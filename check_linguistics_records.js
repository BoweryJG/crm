// Script to check the number of records in the linguistics_analysis table
require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

// Get Supabase credentials from environment variables
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Error: REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY must be set in .env.local');
  process.exit(1);
}

console.log('Supabase URL:', SUPABASE_URL);

async function checkLinguisticsRecords() {
  try {
    console.log('Checking the number of records in the linguistics_analysis table...');
    
    // Count the total number of records in the linguistics_analysis table
    const countResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/linguistics_analysis?select=count`,
      {
        method: 'HEAD',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'count=exact'
        }
      }
    );
    
    if (!countResponse.ok) {
      throw new Error(`Failed to count linguistics records: ${countResponse.statusText}`);
    }
    
    const totalCount = countResponse.headers.get('content-range')?.split('/')[1] || 'unknown';
    console.log(`Total records in linguistics_analysis table: ${totalCount}`);
    
    // Get the 5 most recent records to examine
    const recentRecordsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/linguistics_analysis?select=id,call_id,created_at&order=created_at.desc&limit=5`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!recentRecordsResponse.ok) {
      throw new Error(`Failed to fetch recent linguistics records: ${recentRecordsResponse.statusText}`);
    }
    
    const recentRecords = await recentRecordsResponse.json();
    console.log('5 most recent linguistics_analysis records:');
    console.table(recentRecords);
    
    console.log('Check complete.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkLinguisticsRecords();
