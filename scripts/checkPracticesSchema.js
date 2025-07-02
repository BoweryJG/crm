const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
  console.log('Checking practices table schema...\n');
  
  // Try to select one row to see what columns exist
  const { data, error } = await supabase
    .from('practices')
    .select('*')
    .limit(1);
  
  if (error) {
    console.log('Error:', error);
  } else {
    console.log('Practices table columns:');
    if (data && data.length > 0) {
      console.log(Object.keys(data[0]));
    } else {
      console.log('Table exists but is empty');
    }
  }
  
  // Also check contacts table for practice_id
  console.log('\nChecking contacts table for practice_id column...');
  const { data: contactData, error: contactError } = await supabase
    .from('contacts')
    .select('practice_id')
    .limit(1);
  
  if (contactError && contactError.message.includes('practice_id')) {
    console.log('❌ practice_id column does not exist in contacts table');
  } else {
    console.log('✅ practice_id column exists in contacts table');
  }
}

checkSchema();