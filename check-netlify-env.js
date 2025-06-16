#!/usr/bin/env node

/**
 * Check which environment variables are missing on Netlify
 * Run this locally to see what needs to be added to Netlify
 */

require('dotenv').config({ path: '.env.local' });

console.log('\n🔍 Checking Twilio Environment Variables\n');

const requiredVars = [
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN', 
  'TWILIO_API_KEY',
  'TWILIO_API_SECRET',
  'TWILIO_TWIML_APP_SID',
  'TWILIO_PHONE_NUMBER'
];

const varStatus = {};

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value && value !== `your_${varName.toLowerCase()}_here`) {
    varStatus[varName] = {
      exists: true,
      value: varName.includes('TOKEN') || varName.includes('SECRET') 
        ? `${value.substring(0, 10)}...${value.slice(-4)}`
        : value
    };
  } else {
    varStatus[varName] = { exists: false };
  }
});

console.log('Local .env.local status:');
console.log('========================\n');

requiredVars.forEach(varName => {
  const status = varStatus[varName];
  if (status.exists) {
    console.log(`✅ ${varName}: ${status.value}`);
  } else {
    console.log(`❌ ${varName}: NOT SET or using placeholder value`);
  }
});

console.log('\n\n📋 Values to add to Netlify Environment Variables:');
console.log('================================================\n');

// Show the actual values from .env.local
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID !== 'your_twilio_account_sid_here') {
  console.log(`TWILIO_ACCOUNT_SID=${process.env.TWILIO_ACCOUNT_SID}`);
}

if (process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_AUTH_TOKEN !== 'your_twilio_auth_token_here') {
  console.log(`TWILIO_AUTH_TOKEN=${process.env.TWILIO_AUTH_TOKEN}`);
}

// Check for API key - it might be missing
if (!process.env.TWILIO_API_KEY || process.env.TWILIO_API_KEY === 'SKyour_actual_api_key_here') {
  console.log('\n⚠️  TWILIO_API_KEY is missing!');
  console.log('You need to create one in the Twilio Console:');
  console.log('1. Go to https://www.twilio.com/console');
  console.log('2. Navigate to Account → API keys & tokens');
  console.log('3. Create a new Standard API Key');
  console.log('4. Copy the SID (starts with SK) as TWILIO_API_KEY');
  console.log('5. Copy the Secret as TWILIO_API_SECRET');
} else {
  console.log(`TWILIO_API_KEY=${process.env.TWILIO_API_KEY}`);
}

if (process.env.TWILIO_API_SECRET && process.env.TWILIO_API_SECRET !== 'your_twilio_api_secret_here') {
  console.log(`TWILIO_API_SECRET=${process.env.TWILIO_API_SECRET}`);
}

if (process.env.TWILIO_TWIML_APP_SID && process.env.TWILIO_TWIML_APP_SID !== 'your_twiml_app_sid_here') {
  console.log(`TWILIO_TWIML_APP_SID=${process.env.TWILIO_TWIML_APP_SID}`);
}

if (process.env.TWILIO_PHONE_NUMBER && process.env.TWILIO_PHONE_NUMBER !== '+1234567890') {
  console.log(`TWILIO_PHONE_NUMBER=${process.env.TWILIO_PHONE_NUMBER}`);
}

console.log('\n\n📌 How to add to Netlify:');
console.log('========================');
console.log('1. Go to https://app.netlify.com');
console.log('2. Select your site (crm.repspheres.com)');
console.log('3. Go to Site settings → Environment variables');
console.log('4. Add each variable listed above');
console.log('5. Deploy your site again for changes to take effect\n');