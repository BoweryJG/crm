# Delete Test Records

This utility helps clean up test records from the database by removing the 20 most recent linguistics_analysis records that may contain null or problematic data.

## Why This Is Needed

During development and testing, many test records can accumulate in the database. These test records can:

1. Clutter the analytics dashboard
2. Skew metrics and statistics
3. Make it harder to debug real issues
4. Potentially slow down queries
5. Cause relationship issues between tables when they contain null values

This script provides a simple way to clean up these test records without having to manually delete them through the database interface.

## How It Works

The script uses the Supabase REST API to:

1. Fetch the 20 most recent linguistics_analysis records
2. Delete these linguistics_analysis records
3. Preserve the related call_analysis records

This approach ensures that problematic linguistics data is cleaned up while preserving the call analysis records, maintaining the overall integrity of your analytics data.

## Prerequisites

- Node.js installed
- Required npm packages: `node-fetch` (v2) and `dotenv`
- `.env.local` file with valid Supabase credentials

## Usage

Simply run the script from the project root:

```bash
./run_delete_test_records.sh
```

The script will:
1. Load environment variables from `.env.local`
2. Connect to your Supabase project
3. Delete the 20 most recent linguistics_analysis records
4. Output the results to the console

## Customization

If you need to modify the number of records deleted or change other behavior:

1. Open `delete_test_records.js`
2. Modify the limit in the query to change how many records are deleted
3. Save the file and run the script again

## Troubleshooting

If you encounter any issues:

1. Ensure your `.env.local` file contains valid Supabase credentials
2. Check that you have the required npm packages installed
3. Verify that your Supabase project is accessible
4. Check the console output for any error messages
