/**
 * Automatic Twilio Browser-Based Calling Setup Script
 * This script will create a TwiML app and configure it for browser-based calling
 */

require('dotenv').config({ path: '.env.local' });
const twilio = require('twilio');

// Check if required environment variables are present
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER
} = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
  console.error('\n❌ Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN in .env.local file');
  console.log('Please add these variables to your .env.local file:');
  console.log('TWILIO_ACCOUNT_SID=your_account_sid_here');
  console.log('TWILIO_AUTH_TOKEN=your_auth_token_here');
  console.log('These can be found in your Twilio Console Dashboard');
  process.exit(1);
}

if (!TWILIO_PHONE_NUMBER) {
  console.error('\n❌ Missing TWILIO_PHONE_NUMBER in .env.local file');
  console.log('Please add this variable to your .env.local file:');
  console.log('TWILIO_PHONE_NUMBER=your_twilio_number_here');
  console.log('This should be your Twilio number in E.164 format (e.g. +15551234567)');
  process.exit(1);
}

// Create Twilio client
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Choose a default voice URL until we have a deployed app
const defaultVoiceUrl = process.env.NETLIFY_SITE_URL 
  ? `${process.env.NETLIFY_SITE_URL}/.netlify/functions/initiate-twilio-call/voice`
  : 'https://demo.twilio.com/welcome/voice/';

async function createTwiMLApp() {
  console.log('\n🔧 Setting up Twilio for browser-based calling...');
  
  try {
    // 1. First, create a new TwiML App
    console.log('\n📱 Creating a new TwiML App...');
    const app = await client.applications.create({
      friendlyName: 'SphereOS Browser Calling',
      voiceUrl: defaultVoiceUrl,
      voiceMethod: 'POST'
    });
    
    console.log(`✅ TwiML App created with SID: ${app.sid}`);

    // 2. Generate API Key and Secret for client-side auth
    console.log('\n🔑 Creating new API Key...');
    const newKey = await client.newKeys.create({
      friendlyName: 'SphereOS Browser Calling'
    });
    
    console.log(`✅ API Key created: ${newKey.sid}`);
    console.log(`📝 API Secret: ${newKey.secret}`);
    console.log('\n⚠️ IMPORTANT: Copy your API Secret now. You won\'t be able to see it again!');

    // 3. Update the phone number to use the new TwiML App
    console.log(`\n📞 Configuring phone number ${TWILIO_PHONE_NUMBER} to use the TwiML App...`);
    
    // First, find the phone number SID
    const phoneNumbers = await client.incomingPhoneNumbers.list({
      phoneNumber: TWILIO_PHONE_NUMBER,
      limit: 1
    });
    
    if (phoneNumbers.length === 0) {
      console.error(`❌ Could not find a phone number matching ${TWILIO_PHONE_NUMBER} in your account`);
      console.log('Please verify the number is correct and belongs to your account');
      return;
    }
    
    const phoneNumber = phoneNumbers[0];
    
    // Update the phone number to use the TwiML app
    await client.incomingPhoneNumbers(phoneNumber.sid).update({
      voiceApplicationSid: app.sid
    });
    
    console.log('✅ Phone number configured successfully');

    // 4. Output the configuration to add to .env.local
    console.log('\n📝 Success! Add these values to your .env.local file:');
    console.log('');
    console.log(`TWILIO_TWIML_APP_SID=${app.sid}`);
    console.log(`TWILIO_API_KEY=${newKey.sid}`);
    console.log(`TWILIO_API_SECRET=${newKey.secret}`);
    console.log('');
    console.log('🎉 Your Twilio account is now configured for browser-based calling!');
    console.log('👉 Once deployed, update the TwiML App\'s Voice URL to your Netlify URL:');
    console.log('   https://your-app-url.netlify.app/.netlify/functions/initiate-twilio-call/voice');
    
  } catch (error) {
    console.error('❌ Error setting up Twilio:', error);
    if (error.code === 20003) {
      console.log('Authentication failed. Please check your Account SID and Auth Token.');
    }
  }
}

// Execute the setup
createTwiMLApp();
