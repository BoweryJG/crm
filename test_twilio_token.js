#!/usr/bin/env node

/**
 * Test Twilio token generation locally
 * This will help verify if the API key/secret combination is valid
 */

require('dotenv').config({ path: '.env.local' });
const twilio = require('twilio');
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

console.log('\n🔍 Testing Twilio Token Generation\n');

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY,
  TWILIO_API_SECRET,
  TWILIO_TWIML_APP_SID
} = process.env;

console.log('Environment variables check:');
console.log('TWILIO_ACCOUNT_SID:', TWILIO_ACCOUNT_SID ? `✅ ${TWILIO_ACCOUNT_SID}` : '❌ Missing');
console.log('TWILIO_API_KEY:', TWILIO_API_KEY ? `✅ ${TWILIO_API_KEY}` : '❌ Missing');
console.log('TWILIO_API_SECRET:', TWILIO_API_SECRET ? `✅ ${TWILIO_API_SECRET.substring(0, 10)}...` : '❌ Missing');
console.log('TWILIO_TWIML_APP_SID:', TWILIO_TWIML_APP_SID ? `✅ ${TWILIO_TWIML_APP_SID}` : '❌ Missing');

if (!TWILIO_ACCOUNT_SID || !TWILIO_API_KEY || !TWILIO_API_SECRET || !TWILIO_TWIML_APP_SID) {
  console.error('\n❌ Missing required environment variables');
  process.exit(1);
}

try {
  console.log('\n🔐 Attempting to generate access token...\n');
  
  const token = new AccessToken(
    TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY,
    TWILIO_API_SECRET,
    { identity: 'test-user' }
  );

  const grant = new VoiceGrant({
    outgoingApplicationSid: TWILIO_TWIML_APP_SID,
    incomingAllow: true
  });

  token.addGrant(grant);
  const tokenString = token.toJwt();
  
  console.log('✅ Token generated successfully!');
  console.log('Token length:', tokenString.length);
  console.log('Token preview:', tokenString.substring(0, 50) + '...');
  
  // Decode the token to check its contents
  const parts = tokenString.split('.');
  if (parts.length === 3) {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    console.log('\nToken payload:');
    console.log('- Identity:', payload.grants?.identity);
    console.log('- Voice grant:', payload.grants?.voice ? '✅ Present' : '❌ Missing');
    console.log('- Expires:', new Date(payload.exp * 1000).toLocaleString());
  }
  
  console.log('\n✅ Your Twilio credentials appear to be valid!');
  console.log('\nIf you\'re still getting AccessTokenInvalid errors, check that:');
  console.log('1. The same API key/secret are set in Netlify');
  console.log('2. There are no extra spaces or characters in the Netlify environment variables');
  console.log('3. The API key hasn\'t been revoked in the Twilio console');
  
} catch (error) {
  console.error('\n❌ Error generating token:', error.message);
  console.error('\nThis usually means:');
  console.error('- The API Key (SID) doesn\'t exist');
  console.error('- The API Secret is incorrect');
  console.error('- The API Key has been revoked');
}