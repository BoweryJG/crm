// Script to delete the 20 most recent test records with null values from the linguistics_analysis table
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

async function deleteTestRecords() {
  try {
    console.log('Fetching the 20 most recent linguistics_analysis records with null values...');
    
    // Step 1: Get the 20 most recent linguistics_analysis records that have null values
    // We're looking for records where important fields are null, indicating they might be test data
    const recentLinguisticsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/linguistics_analysis?select=id,call_id&order=created_at.desc&limit=20`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!recentLinguisticsResponse.ok) {
      throw new Error(`Failed to fetch recent linguistics records: ${recentLinguisticsResponse.statusText}`);
    }
    
    const recentLinguistics = await recentLinguisticsResponse.json();
    console.log(`Found ${recentLinguistics.length} recent linguistics_analysis records`);
    
    if (recentLinguistics.length === 0) {
      console.log('No records to delete.');
      return;
    }
    
    // Extract IDs
    const linguisticsIds = recentLinguistics.map(record => record.id);
    
    console.log(`Linguistics IDs to delete: ${linguisticsIds.length}`);
    
    // Step 2: Delete the linguistics_analysis records
    console.log('Deleting linguistics_analysis records...');
    const deleteLinguisticsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/linguistics_analysis?id=in.(${linguisticsIds.join(',')})`,
      {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!deleteLinguisticsResponse.ok) {
      throw new Error(`Failed to delete linguistics_analysis records: ${deleteLinguisticsResponse.statusText}`);
    }
    
    console.log('Successfully deleted linguistics_analysis records');
    console.log('Test records deletion complete.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

deleteTestRecords();
