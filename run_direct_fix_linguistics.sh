#!/bin/bash

# Script to run the direct SQL fix for linguistics_analysis table

echo "Running direct SQL fix for linguistics_analysis table..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js to run this script."
    exit 1
fi

# Check if the required packages are installed
if ! node -e "try { require('@supabase/supabase-js'); } catch(e) { console.error('Error: @supabase/supabase-js package is not installed.'); process.exit(1); }"; then
    echo "Installing required packages..."
    npm install --no-save @supabase/supabase-js dotenv
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Error: .env.local file not found. Please create this file with your Supabase credentials."
    echo "Required variables: REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY"
    exit 1
fi

# Run the fix script
node direct_fix_linguistics.js

echo "Direct SQL fix script execution completed."
