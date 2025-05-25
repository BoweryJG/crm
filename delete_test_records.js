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
    // First, check how many records we have before deletion
    console.log('Checking the number of records before deletion...');
    const countBeforeResponse = await fetch(
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
    
    const totalBefore = countBeforeResponse.headers.get('content-range')?.split('/')[1] || 'unknown';
    console.log(`Total records before deletion: ${totalBefore}`);
    
    console.log('Fetching the 20 most recent linguistics_analysis records...');
    
    // Step 1: Get the 20 most recent linguistics_analysis records
    const recentLinguisticsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/linguistics_analysis?select=id,call_id,created_at&order=created_at.desc&limit=20`,
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
    
    // Extract IDs and print them for debugging
    const linguisticsIds = recentLinguistics.map(record => record.id);
    console.log(`Linguistics IDs to delete: ${linguisticsIds.join(', ')}`);
    
    // Step 2: Delete the linguistics_analysis records
    console.log('Deleting linguistics_analysis records...');
    
    // Use a more direct approach with explicit DELETE method and proper formatting
    const deleteUrl = `${SUPABASE_URL}/rest/v1/linguistics_analysis?id=in.(${linguisticsIds.join(',')})`;
    console.log(`DELETE URL: ${deleteUrl}`);
    
    const deleteLinguisticsResponse = await fetch(
      deleteUrl,
      {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      }
    );
    
    const responseStatus = deleteLinguisticsResponse.status;
    const responseText = await deleteLinguisticsResponse.text();
    
    console.log(`Delete response status: ${responseStatus}`);
    console.log(`Delete response text: ${responseText}`);
    
    if (!deleteLinguisticsResponse.ok) {
      throw new Error(`Failed to delete linguistics_analysis records: ${deleteLinguisticsResponse.statusText}`);
    }
    
    // Check how many records we have after deletion
    console.log('Checking the number of records after deletion...');
    const countAfterResponse = await fetch(
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
    
    const totalAfter = countAfterResponse.headers.get('content-range')?.split('/')[1] || 'unknown';
    console.log(`Total records after deletion: ${totalAfter}`);
    
    if (totalBefore !== 'unknown' && totalAfter !== 'unknown') {
      const recordsDeleted = parseInt(totalBefore) - parseInt(totalAfter);
      console.log(`Successfully deleted ${recordsDeleted} linguistics_analysis records`);
    } else {
      console.log('Successfully deleted linguistics_analysis records, but could not determine exact count');
    }
    
    console.log('Test records deletion complete.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

deleteTestRecords();
