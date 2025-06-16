#!/bin/bash

# Script to fix SUIS schema cache issue

echo "🔧 Fixing SUIS schema cache issue..."

# Get the current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if we have the necessary environment variables
if [ -z "$REACT_APP_SUPABASE_URL" ] || [ -z "$REACT_APP_SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: Missing required environment variables."
    echo "Please ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_SERVICE_ROLE_KEY are set."
    exit 1
fi

# Extract project reference from Supabase URL
PROJECT_REF=$(echo $REACT_APP_SUPABASE_URL | sed -n 's/https:\/\/\(.*\)\.supabase\.co/\1/p')

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Error: Could not extract project reference from Supabase URL."
    exit 1
fi

echo "📊 Project Reference: $PROJECT_REF"
echo "🔄 Running schema cache fix..."

# Run the SQL using psql
psql "${DATABASE_URL}" -f "${SCRIPT_DIR}/fix_suis_schema_cache.sql"

if [ $? -eq 0 ]; then
    echo "✅ Schema cache fix completed successfully!"
    echo ""
    echo "The SUIS errors should now be resolved. Please refresh your browser to see the changes."
else
    echo "❌ Error running schema cache fix. Please check your database connection."
    exit 1
fi