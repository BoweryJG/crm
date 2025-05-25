// Script to delete the 20 most recent test records using the Supabase REST API
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
    console.log('Fetching the 20 most recent call_analysis records...');
    
    // Step 1: Get the 20 most recent call_analysis records
    const recentCallsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/call_analysis?select=id,linguistics_analysis_id&order=created_at.desc&limit=20`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!recentCallsResponse.ok) {
      throw new Error(`Failed to fetch recent calls: ${recentCallsResponse.statusText}`);
    }
    
    const recentCalls = await recentCallsResponse.json();
    console.log(`Found ${recentCalls.length} recent call_analysis records`);
    
    if (recentCalls.length === 0) {
      console.log('No records to delete.');
      return;
    }
    
    // Extract IDs
    const callIds = recentCalls.map(call => call.id);
    const linguisticsIds = recentCalls
      .filter(call => call.linguistics_analysis_id)
      .map(call => call.linguistics_analysis_id);
    
    console.log(`Call IDs to delete: ${callIds.length}`);
    console.log(`Linguistics IDs to delete: ${linguisticsIds.length}`);
    
    // Step 2: Delete the call_analysis records
    console.log('Deleting call_analysis records...');
    const deleteCallsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/call_analysis?id=in.(${callIds.join(',')})`,
      {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!deleteCallsResponse.ok) {
      throw new Error(`Failed to delete call_analysis records: ${deleteCallsResponse.statusText}`);
    }
    
    console.log('Successfully deleted call_analysis records');
    
    // Step 3: Delete orphaned linguistics_analysis records
    if (linguisticsIds.length > 0) {
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
    } else {
      console.log('No linguistics_analysis records to delete');
    }
    
    console.log('Test records deletion complete.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

deleteTestRecords();
