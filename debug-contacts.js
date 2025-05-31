const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cbopynuvhcymbumjnvay.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNib3B5bnV2aGN5bWJ1bWpudmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTUxNzMsImV4cCI6MjA1OTU3MTE3M30.UZElMkoHugIt984RtYWyfrRuv2rB67opQdCrFVPCfzU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugContacts() {
  console.log('🔍 Debugging contact types and categorization...\n');
  
  try {
    // Fetch all contacts
    const { data, error } = await supabase
      .from('public_contacts')
      .select('id, first_name, last_name, type')
      .order('created_at');
    
    if (error) {
      console.error('❌ Error fetching contacts:', error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('❌ No contacts found in public_contacts table');
      return;
    }
    
    console.log(`📊 Total contacts: ${data.length}\n`);
    
    // Group by type
    const typeGroups = {};
    data.forEach(contact => {
      const type = contact.type || 'unknown';
      if (!typeGroups[type]) {
        typeGroups[type] = [];
      }
      typeGroups[type].push(contact);
    });
    
    console.log('📋 Contact types breakdown:');
    Object.entries(typeGroups).forEach(([type, contacts]) => {
      console.log(`  ${type}: ${contacts.length} contacts`);
    });
    console.log('');
    
    // Apply the same categorization logic as the app
    const categorized = data.map(contact => {
      let practiceType = 'dental';
      if (['aesthetic_doctor', 'plastic_surgeon', 'dermatologist', 
           'cosmetic_dermatologist', 'nurse_practitioner', 
           'physician_assistant', 'aesthetician'].includes(contact.type)) {
        practiceType = 'aesthetic';
      }
      
      return {
        ...contact,
        practiceType
      };
    });
    
    const dentalCount = categorized.filter(c => c.practiceType === 'dental').length;
    const aestheticCount = categorized.filter(c => c.practiceType === 'aesthetic').length;
    
    console.log('🏥 Practice type categorization:');
    console.log(`  Dental: ${dentalCount} contacts`);
    console.log(`  Aesthetic: ${aestheticCount} contacts`);
    console.log('');
    
    // Show some examples
    console.log('📝 Sample contacts by category:');
    console.log('\nDental contacts:');
    categorized.filter(c => c.practiceType === 'dental').slice(0, 5).forEach(c => {
      console.log(`  - ${c.first_name} ${c.last_name} (${c.type})`);
    });
    
    console.log('\nAesthetic contacts:');
    categorized.filter(c => c.practiceType === 'aesthetic').slice(0, 5).forEach(c => {
      console.log(`  - ${c.first_name} ${c.last_name} (${c.type})`);
    });
    
  } catch (error) {
    console.error('❌ Exception:', error);
  }
}

debugContacts();