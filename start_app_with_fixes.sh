#!/bin/bash

# Script to start the application with the linguistics relationship fixes applied

echo "Starting application with linguistics relationship fixes..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm not found. Please install Node.js and npm first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the application
echo "Starting the application..."
npm start

# Note: This script assumes you've already applied the database fixes using run_fix_linguistics_relationship.sh
# If you haven't, please run that script first:
# ./run_fix_linguistics_relationship.sh
