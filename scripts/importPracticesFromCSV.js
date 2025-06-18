const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://cbopynuvhcymbumjnvay.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create practices table SQL
const createPracticesTableSQL = `
CREATE TABLE IF NOT EXISTS public.practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  type TEXT,
  size TEXT,
  specialty TEXT,
  contact_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add practice_id to contacts table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'contacts' 
                AND column_name = 'practice_id') THEN
    ALTER TABLE public.contacts ADD COLUMN practice_id UUID REFERENCES practices(id);
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_practices_city_state ON practices(city, state);
CREATE INDEX IF NOT EXISTS idx_contacts_practice_id ON contacts(practice_id);
`;

async function createPracticesTable() {
  console.log('Creating practices table...');
  const { error } = await supabase.rpc('exec_sql', { sql: createPracticesTableSQL });
  
  if (error) {
    console.error('Error creating practices table:', error);
    // Try alternative approach
    console.log('Trying to create table directly...');
    // You may need to run this SQL directly in Supabase dashboard
    console.log(createPracticesTableSQL);
  } else {
    console.log('Practices table created successfully');
  }
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
  console.log(`Uploading ${practicesArray.length} practices to Supabase...`);
  
  // Upload in batches of 500
  const batchSize = 500;
  for (let i = 0; i < practicesArray.length; i += batchSize) {
    const batch = practicesArray.slice(i, i + batchSize);
    
    const { data, error } = await supabase
      .from('practices')
      .insert(batch)
      .select();
    
    if (error) {
      console.error(`Error uploading batch ${i / batchSize + 1}:`, error);
    } else {
      console.log(`Uploaded batch ${i / batchSize + 1} (${data.length} practices)`);
    }
  }
  
  // Fetch all practices to get their IDs
  const { data: allPractices, error } = await supabase
    .from('practices')
    .select('id, city, state');
  
  if (error) {
    console.error('Error fetching practices:', error);
    return null;
  }
  
  // Create lookup map
  const practiceIdMap = new Map();
  allPractices.forEach(practice => {
    const key = `${practice.city.toLowerCase()}-${practice.state.toLowerCase()}`;
    practiceIdMap.set(key, practice.id);
  });
  
  return practiceIdMap;
}

async function updateContactsWithPracticeIds(contactPracticeMap, practiceIdMap) {
  console.log('Updating contacts with practice IDs...');
  
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
  const batchSize = 100;
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    
    // Update each contact
    for (const update of batch) {
      const { error } = await supabase
        .from('contacts')
        .update({ practice_id: update.practice_id })
        .eq('id', update.id);
      
      if (error) {
        console.error(`Error updating contact ${update.id}:`, error);
      }
    }
    
    console.log(`Updated batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(updates.length / batchSize)}`);
  }
}

async function main() {
  try {
    // Step 1: Create practices table
    await createPracticesTable();
    
    // Wait a moment for table creation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 2: Import and process CSV
    const { practicesArray, contactPracticeMap } = await importPractices();
    
    // Step 3: Upload practices to Supabase
    const practiceIdMap = await uploadPracticesToSupabase(practicesArray);
    
    if (practiceIdMap) {
      // Step 4: Update contacts with practice IDs
      await updateContactsWithPracticeIds(contactPracticeMap, practiceIdMap);
    }
    
    console.log('Import complete!');
    
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