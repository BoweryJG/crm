const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkPracticesTable() {
  console.log('Checking if practices table exists...');
  const { data, error } = await supabase
    .from('practices')
    .select('id')
    .limit(1);
  
  if (error && error.code === '42P01') {
    console.log('\n❌ PRACTICES TABLE DOES NOT EXIST!');
    console.log('\nPlease run the following SQL in your Supabase dashboard first:');
    console.log('----------------------------------------');
    console.log(fs.readFileSync('./create_practices_table.sql', 'utf8'));
    console.log('----------------------------------------');
    return false;
  }
  
  console.log('✅ Practices table exists');
  return true;
}

async function importPractices() {
  const practices = new Map(); // key: "city-state", value: practice data
  const contactPracticeMap = new Map(); // key: email, value: practice key
  let rowCount = 0;

  console.log('Reading CSV file...');
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('/Users/jasonsmacbookpro2022/Downloads/MasterD_NYCC.csv')
      .pipe(csv())
      .on('data', (row) => {
        rowCount++;
        if (rowCount % 1000 === 0) {
          console.log(`Processed ${rowCount} rows...`);
        }

        const city = row['City']?.trim();
        const state = row['State/Region']?.trim();
        const email = row['Email']?.toLowerCase().trim();
        
        if (city && state) {
          const practiceKey = `${city.toLowerCase()}-${state.toLowerCase()}`;
          
          // Create or update practice info
          if (!practices.has(practiceKey)) {
            practices.set(practiceKey, {
              name: `${city} Dental Practice`, // Generic name, can be enhanced
              city: city,
              state: state,
              specialty: row['Specialty'] || 'General Dentistry',
              contact_count: 1,
              emails: new Set([email].filter(Boolean)),
              phones: new Set([row['Phone Number'], row['Mobile Phone Number']].filter(Boolean))
            });
          } else {
            const practice = practices.get(practiceKey);
            practice.contact_count++;
            if (email) practice.emails.add(email);
            if (row['Phone Number']) practice.phones.add(row['Phone Number']);
            if (row['Mobile Phone Number']) practice.phones.add(row['Mobile Phone Number']);
          }
          
          // Map contact to practice
          if (email) {
            contactPracticeMap.set(email, practiceKey);
          }
        }
      })
      .on('end', async () => {
        console.log(`CSV processing complete. Total rows: ${rowCount}`);
        console.log(`Unique practices found: ${practices.size}`);
        
        // Convert practices map to array for upload
        const practicesArray = Array.from(practices.entries()).map(([key, data]) => ({
          name: data.name,
          city: data.city,
          state: data.state,
          specialty: data.specialty,
          email: Array.from(data.emails).filter(e => e).join(', ').substring(0, 255), // Limit email field
          phone: Array.from(data.phones).filter(p => p)[0] || null, // Take first phone
          type: data.specialty?.includes('Oral Surgeon') ? 'surgical' : 
                data.specialty?.includes('Aesthetic') ? 'aesthetic' : 'dental',
          contact_count: data.contact_count
        }));

        resolve({ practicesArray, contactPracticeMap });
      })
      .on('error', reject);
  });
}

async function uploadPracticesToSupabase(practicesArray) {
  console.log(`\nUploading ${practicesArray.length} practices to Supabase...`);
  
  // First, clear existing practices (optional)
  console.log('Clearing existing practices...');
  const { error: deleteError } = await supabase
    .from('practices')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
  
  if (deleteError) {
    console.log('Warning: Could not clear existing practices:', deleteError.message);
  }
  
  // Upload in batches of 100
  const batchSize = 100;
  let successCount = 0;
  
  for (let i = 0; i < practicesArray.length; i += batchSize) {
    const batch = practicesArray.slice(i, i + batchSize);
    
    const { data, error } = await supabase
      .from('practices')
      .insert(batch)
      .select();
    
    if (error) {
      console.error(`Error uploading batch ${i / batchSize + 1}:`, error.message);
    } else {
      successCount += data.length;
      console.log(`✓ Uploaded batch ${i / batchSize + 1} (${data.length} practices) - Total: ${successCount}/${practicesArray.length}`);
    }
  }
  
  // Fetch all practices to get their IDs
  console.log('\nFetching practice IDs...');
  const { data: allPractices, error } = await supabase
    .from('practices')
    .select('id, city, state');
  
  if (error) {
    console.error('Error fetching practices:', error);
    return null;
  }
  
  console.log(`✅ Successfully fetched ${allPractices.length} practices`);
  
  // Create lookup map
  const practiceIdMap = new Map();
  allPractices.forEach(practice => {
    const key = `${practice.city.toLowerCase()}-${practice.state.toLowerCase()}`;
    practiceIdMap.set(key, practice.id);
  });
  
  return practiceIdMap;
}

async function updateContactsWithPracticeIds(contactPracticeMap, practiceIdMap) {
  console.log('\nUpdating contacts with practice IDs...');
  
  // First, get all contacts from database
  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('id, email')
    .not('email', 'is', null);
  
  if (error) {
    console.error('Error fetching contacts:', error);
    return;
  }
  
  console.log(`Found ${contacts.length} contacts with emails`);
  
  // Create updates array
  const updates = [];
  let matchCount = 0;
  
  contacts.forEach(contact => {
    const email = contact.email?.toLowerCase().trim();
    if (email && contactPracticeMap.has(email)) {
      const practiceKey = contactPracticeMap.get(email);
      const practiceId = practiceIdMap.get(practiceKey);
      
      if (practiceId) {
        updates.push({
          id: contact.id,
          practice_id: practiceId
        });
        matchCount++;
      }
    }
  });
  
  console.log(`Matched ${matchCount} contacts to practices`);
  
  // Update contacts in batches
  const batchSize = 50;
  let updateCount = 0;
  
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    
    // Update each contact
    for (const update of batch) {
      const { error } = await supabase
        .from('contacts')
        .update({ practice_id: update.practice_id })
        .eq('id', update.id);
      
      if (error) {
        console.error(`Error updating contact ${update.id}:`, error.message);
      } else {
        updateCount++;
      }
    }
    
    console.log(`✓ Updated batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(updates.length / batchSize)} - Total: ${updateCount}/${updates.length}`);
  }
  
  console.log(`✅ Successfully updated ${updateCount} contacts`);
}

async function main() {
  try {
    console.log('🚀 Starting Practice Import Process');
    console.log('===================================\n');
    
    // Step 1: Check if practices table exists
    const tableExists = await checkPracticesTable();
    if (!tableExists) {
      console.log('\n⚠️  Please create the practices table first by running the SQL above in your Supabase dashboard.');
      console.log('Then run this script again.');
      process.exit(1);
    }
    
    // Step 2: Import and process CSV
    const { practicesArray, contactPracticeMap } = await importPractices();
    
    // Step 3: Upload practices to Supabase
    const practiceIdMap = await uploadPracticesToSupabase(practicesArray);
    
    if (practiceIdMap) {
      // Step 4: Update contacts with practice IDs
      await updateContactsWithPracticeIds(contactPracticeMap, practiceIdMap);
    }
    
    console.log('\n✅ Import complete!');
    
    // Show summary
    const { count: practiceCount } = await supabase
      .from('practices')
      .select('*', { count: 'exact', head: true });
    
    const { count: linkedContactCount } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .not('practice_id', 'is', null);
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total practices created: ${practiceCount}`);
    console.log(`Total contacts linked to practices: ${linkedContactCount}`);
    
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

// Run the import
main();