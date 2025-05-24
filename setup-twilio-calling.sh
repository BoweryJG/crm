#!/bin/bash

# Setup script for Twilio browser-based calling
# This script automatically sets up everything needed for browser-based calling

echo "🚀 SphereOS Twilio Browser-Based Calling Setup"
echo "==============================================="

# Check if the required files exist
if [ ! -f ".env.local" ]; then
  echo "❌ .env.local file not found. Creating a template..."
  cp .env.local.example .env.local 2>/dev/null || touch .env.local
  echo "Created .env.local file. You'll need to add your Twilio credentials."
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is required but not installed."
  echo "Please install Node.js from https://nodejs.org/ and try again."
  exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo "❌ npm is required but not installed."
  echo "It should come with Node.js. Please install Node.js and try again."
  exit 1
fi

# Check if Twilio package is installed
if ! npm list --depth=0 | grep -q twilio; then
  echo "📦 Installing Twilio package..."
  npm install --save twilio
  echo "✅ Twilio package installed"
fi

# Check if dotenv is installed
if ! npm list --depth=0 | grep -q dotenv; then
  echo "📦 Installing dotenv package..."
  npm install --save dotenv
  echo "✅ dotenv package installed"
fi

echo ""
echo "🔎 Checking .env.local for Twilio credentials..."

# Source the .env.local file to get the variables
if [ -f ".env.local" ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

# Check if the required Twilio credentials are already in .env.local
if [ -z "$TWILIO_ACCOUNT_SID" ] || [ -z "$TWILIO_AUTH_TOKEN" ] || [ -z "$TWILIO_PHONE_NUMBER" ]; then
  echo ""
  echo "⚠️  Missing some Twilio credentials in .env.local"
  echo ""
  
  # Prompt for missing credentials
  if [ -z "$TWILIO_ACCOUNT_SID" ]; then
    read -p "Enter your Twilio Account SID: " TWILIO_ACCOUNT_SID
    echo "TWILIO_ACCOUNT_SID=$TWILIO_ACCOUNT_SID" >> .env.local
  fi
  
  if [ -z "$TWILIO_AUTH_TOKEN" ]; then
    read -p "Enter your Twilio Auth Token: " TWILIO_AUTH_TOKEN
    echo "TWILIO_AUTH_TOKEN=$TWILIO_AUTH_TOKEN" >> .env.local
  fi
  
  if [ -z "$TWILIO_PHONE_NUMBER" ]; then
    read -p "Enter your Twilio Phone Number (E.164 format, e.g. +15551234567): " TWILIO_PHONE_NUMBER
    echo "TWILIO_PHONE_NUMBER=$TWILIO_PHONE_NUMBER" >> .env.local
  fi
  
  echo "✅ Credentials added to .env.local"
fi

echo ""
echo "🔧 Running Twilio setup script..."
node setup_twilio.js

# Check if the setup was successful
if [ $? -eq 0 ]; then
  echo ""
  echo "🎉 Setup completed successfully!"
  echo ""
  echo "You can now test browser-based calling with the test pages:"
  echo "- Run 'node test_browser_calling.js' to verify your configuration"
  echo "- Open 'test_phone_call.html' in your browser to test calling"
  echo ""
  echo "To start your application with browser-based calling:"
  echo "npm start"
else
  echo ""
  echo "❌ Setup encountered an error. Please check the output above."
fi

echo ""
echo "Done! 🏁"
