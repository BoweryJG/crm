# Linguistics Analysis Integration Fix

This document outlines the changes made to fix the error:
```
Error loading data: Error fetching analysis: Could not find a relationship between 'linguistics_analysis' and 'linguistics_analysis' in the schema cache.
```

## Problem

The RepAnalytics component was attempting to join the `call_analysis` and `linguistics_analysis` tables, but the relationship between these tables was not properly defined in the database schema.

## Solution

We've implemented the following changes to fix this issue:

### 1. Database Schema Updates

A new migration script has been created at `supabase/migrations/20250524_fix_linguistics_analysis_relationship.sql` that:

- Ensures the `linguistics_analysis` table exists with the proper structure
- Adds a `source_type` column to distinguish between uploaded and Twilio recordings
- Fixes the foreign key constraint between `call_analysis` and `linguistics_analysis`
- Adds necessary indexes for performance
- Sets up proper row-level security policies

### 2. New TwilioLinguisticsService

Created a new service file at `src/services/twilio/twilioLinguisticsService.ts` that:

- Handles the integration between Twilio call recordings and the linguistics analysis system
- Creates proper records in both the `linguistics_analysis` and `call_analysis` tables with the correct relationship

### 3. Updated CallAnalysisService

Modified `src/services/callAnalysis/callAnalysisService.ts` to:

- Add a new method `linkCallToLinguisticsAnalysis` to properly link call analysis records to linguistics analysis records
- Ensure the existing `getLinguisticsAnalysis` method properly handles the relationship

### 4. Updated RepAnalytics Component

Modified `src/pages/RepAnalytics.tsx` to:

- Use the proper join syntax in the query to fetch related linguistics analysis data
- Now it uses `linguistics:linguistics_analysis_id(*)` to properly fetch the related linguistics analysis data
- Added linguistics data display to the insight cards, showing:
  - Sentiment score
  - Key phrases
  - Speaking pace
  - Talk-to-listen ratio
  - Action items count
- Added a new Linguistics Analysis Metrics section to the Performance Metrics area, showing:
  - Average sentiment score
  - Average speaking pace
  - Talk-to-listen ratio

### 5. Updated Twilio Webhook Handler

Modified `netlify/functions/twilio-webhook.ts` to:

- Use the new TwilioLinguisticsService for processing recordings
- Update the call_analysis table with call duration and other metadata

## How to Apply the Fix

### Option 1: Using the Supabase SQL Editor (Recommended)

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `apply_linguistics_fix.sql` 
4. Paste into the SQL Editor and run the script
5. Deploy the updated code to your hosting environment

### Option 2: Using the Supabase CLI

If you have the Supabase CLI set up:

1. Run the migration script against your Supabase database:
   ```bash
   npx supabase db push
   ```

2. Deploy the updated code to your hosting environment.

### Option 3: Using the Shell Script (Advanced)

If you're comfortable with shell scripts and have the necessary permissions:

1. Make the script executable:
   ```bash
   chmod +x apply_linguistics_fix.sh
   ```

2. Run the script:
   ```bash
   ./apply_linguistics_fix.sh
   ```

3. Deploy the updated code to your hosting environment.

## Testing

After applying the fix:

1. Make a test call using the Twilio integration
2. Verify that the call recording is properly processed
3. Check the RepAnalytics page to ensure it displays the linguistics analysis data correctly

## Troubleshooting

If you encounter any issues:

1. Check the Supabase database logs for any SQL errors
2. Verify that the `call_analysis` table has the `linguistics_analysis_id` column
3. Ensure that the `linguistics_analysis` table exists and has the proper structure
4. Check the Netlify function logs for any errors in the webhook handler
