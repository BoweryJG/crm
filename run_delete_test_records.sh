#!/bin/bash

# Script to delete the 20 most recent test records from the database
echo "Deleting the 20 most recent test records from the database..."

# Run the Node.js script
node delete_test_records.js

echo "Test records deletion complete."
