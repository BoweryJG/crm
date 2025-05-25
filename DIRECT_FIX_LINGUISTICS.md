# Direct Fix for Linguistics Analysis Table

This document explains how to use the direct SQL fix for the linguistics_analysis table issues.

## Problem

The application is experiencing issues with the linguistics_analysis table:

1. The REST API calls to update linguistics_analysis records are failing with 400 Bad Request errors
2. The relationship between call_analysis and linguistics_analysis tables may be broken
3. Row Level Security (RLS) policies may be preventing proper access to the linguistics_analysis table

## Solution

The `direct_fix_linguistics.js` script performs the following fixes:

1. Fixes the foreign key relationship between call_analysis and linguistics_analysis tables
2. Adds proper RLS policies to allow authenticated users to view, insert, and update linguistics_analysis records
3. Restores data from a backup table if available, or creates mock data for recent records
4. Creates a backup of the current data to prevent future data loss

## How to Use

### Prerequisites

- Node.js installed
- Supabase credentials in `.env.local` file

### Running the Fix

1. Make sure your `.env.local` file contains the following variables:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_KEY=your_supabase_key
   ```

2. Run the script using the provided shell script:
   ```bash
   ./run_direct_fix_linguistics.sh
   ```

   This will:
   - Check for required dependencies
   - Install any missing packages
   - Run the direct SQL fix

3. After running the script, check the console output for any errors or success messages.

## What to Expect

- The script will fix the table relationships and RLS policies
- If a backup table exists, it will restore data from the backup
- If no backup exists, it will create mock data for the 20 most recent records
- It will create a backup of the current data to prevent future data loss

## Troubleshooting

If you encounter any issues:

1. Check that your Supabase credentials are correct in `.env.local`
2. Ensure you have the necessary permissions to modify the database schema
3. Check the console output for specific error messages

## After Running the Fix

After running the fix, the application should be able to:

1. Properly display linguistics data in the RepAnalytics page
2. Allow updates to linguistics_analysis records
3. Maintain the relationship between call_analysis and linguistics_analysis tables

If issues persist, you may need to restart the application or clear your browser cache.
