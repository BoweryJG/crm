// Script to update the 20 most recent test records in the linguistics_analysis table
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

async function updateTestRecords() {
  try {
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
      console.log('No records to update.');
      return;
    }
    
    // Extract IDs and print them for debugging
    const linguisticsIds = recentLinguistics.map(record => record.id);
    console.log(`Linguistics IDs to update: ${linguisticsIds.length}`);
    
    // Step 2: Update the linguistics_analysis records to clear their data
    console.log('Updating linguistics_analysis records...');
    
    // Process records in batches to avoid URL length limitations
    const batchSize = 5;
    let updatedCount = 0;
    
    for (let i = 0; i < linguisticsIds.length; i += batchSize) {
      const batchIds = linguisticsIds.slice(i, i + batchSize);
      console.log(`Processing batch ${i/batchSize + 1} with ${batchIds.length} records...`);
      
      // Update each record individually to ensure success
      for (const id of batchIds) {
        console.log(`Updating record ${id}...`);
        
        const updateResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/linguistics_analysis?id=eq.${id}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              // Clear or reset fields that might be causing issues
              sentiment_score: null,
              key_phrases: null,
              transcript: null,
              analysis_result: null,
              is_processed: false,
              // Add a marker to indicate this record has been cleared
              cleared_at: new Date().toISOString()
            })
          }
        );
        
        const responseStatus = updateResponse.status;
        console.log(`Update response status for ${id}: ${responseStatus}`);
        
        if (updateResponse.ok) {
          updatedCount++;
        } else {
          console.error(`Failed to update record ${id}: ${updateResponse.statusText}`);
        }
      }
    }
    
    console.log(`Successfully updated ${updatedCount} out of ${linguisticsIds.length} linguistics_analysis records`);
    console.log('Test records update complete.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updateTestRecords();
