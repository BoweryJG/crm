#!/bin/bash

# Script to apply linguistics fixes and start the application

echo "===== APPLYING LINGUISTICS FIXES AND STARTING APPLICATION ====="

# Step 1: Apply the direct fix for linguistics_analysis table
echo "Step 1: Applying direct fix for linguistics_analysis table..."
./run_direct_fix_linguistics.sh

# Check if the fix was successful
if [ $? -ne 0 ]; then
    echo "Error: Failed to apply linguistics fix. Please check the error messages above."
    exit 1
fi

echo "Linguistics fix applied successfully."

# Step 2: Start the application
echo "Step 2: Starting the application..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install Node.js and npm to run this script."
    exit 1
fi

# Start the application
echo "Starting the React application..."
npm start

echo "===== APPLICATION STARTED ====="
