#!/bin/bash

# Script to run the SQL verification and fix for linguistics relationship
# This script will execute the SQL in fix_linguistics_relationship.sql against your Supabase database

echo "Running linguistics relationship verification and fix script..."

# Check if the Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI not found. Please install it first."
    echo "You can install it with: npm install -g supabase"
    exit 1
fi

# Execute the SQL script using Supabase CLI
# Replace PROJECT_ID with your actual Supabase project ID if needed
echo "Executing SQL script against Supabase database..."
supabase db execute --file fix_linguistics_relationship.sql

# If you prefer to use psql directly (if you have the connection details)
# Uncomment the following lines and update with your connection details
# export PGPASSWORD=your_password
# psql -h your_host -U your_user -d your_database -f fix_linguistics_relationship.sql

echo "Script execution completed."
echo "Please check the output above for any errors or verification results."
echo "If you see any issues, you may need to manually fix them in the Supabase dashboard."

# Make the script executable with: chmod +x run_fix_linguistics_relationship.sh
# Run with: ./run_fix_linguistics_relationship.sh
