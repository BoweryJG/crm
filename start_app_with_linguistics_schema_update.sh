#!/bin/bash

# Script to apply the linguistics schema update and start the application
# This adds advanced sales analytics fields to the linguistics_analysis table

echo "===== SphereOsCrM Linguistics Schema Update ====="
echo "This script will:"
echo "1. Apply the linguistics analysis schema update"
echo "2. Start the application with the enhanced analytics features"
echo ""

# Check if direct_linguistics_schema_update.sql exists
if [ ! -f direct_linguistics_schema_update.sql ]; then
  echo "❌ Error: direct_linguistics_schema_update.sql not found!"
  echo "Please make sure the SQL file exists in the current directory."
  exit 1
fi

echo "✅ Found linguistics schema update SQL file"

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "⚠️ Warning: .env.local file not found."
  echo "Creating a copy from .env.local.example..."
  
  if [ -f .env.local.example ]; then
    cp .env.local.example .env.local
    echo "✅ Created .env.local from example file"
  else
    echo "❌ Error: .env.local.example not found!"
    echo "Please create a .env.local file with your Supabase credentials."
    exit 1
  fi
fi

echo "✅ Environment file check passed"

# Remind user to apply SQL manually
echo ""
echo "🔔 IMPORTANT: Before starting the application, you need to apply the SQL schema update manually:"
echo "1. Open your Supabase project dashboard"
echo "2. Go to the SQL Editor"
echo "3. Copy the contents of direct_linguistics_schema_update.sql"
echo "4. Paste into the SQL Editor and run the query"
echo ""
echo "Have you applied the SQL schema update? (y/n)"
read -r applied_sql

if [[ "$applied_sql" != "y" && "$applied_sql" != "Y" ]]; then
  echo "Please apply the SQL schema update before continuing."
  echo "You can run this script again after applying the update."
  exit 0
fi

echo "✅ SQL schema update confirmed"
echo ""
echo "Starting the application with enhanced linguistics analytics..."

# Start the application
npm start

# Check if npm start was successful
if [ $? -ne 0 ]; then
  echo "❌ Error starting the application."
  echo "Please check the error messages above and try again."
  exit 1
fi
