/**
 * Twilio Browser-Based Calling Test
 * 
 * This script allows you to test the browser-based calling functionality
 * without needing real contacts. It provides a simple interface to test
 * token generation and call execution.
 */

// Load required environment variables
require('dotenv').config({ path: '.env.local' });
const twilio = require('twilio');

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;
const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;

// Create Twilio client
const client = twilio(accountSid, authToken);

// Print configuration status
console.log('\n----- Twilio Browser-Based Calling Test -----\n');
console.log('Checking configuration:');
console.log('- Account SID: ' + (accountSid ? '✓ Present' : '✗ Missing'));
console.log('- Auth Token: ' + (authToken ? '✓ Present' : '✗ Missing'));
console.log('- API Key: ' + (apiKey ? '✓ Present' : '✗ Missing'));
console.log('- API Secret: ' + (apiSecret ? '✓ Present' : '✗ Missing'));
console.log('- TwiML App SID: ' + (twimlAppSid ? '✓ Present' : '✗ Missing'));

if (!accountSid || !authToken || !apiKey || !apiSecret || !twimlAppSid) {
  console.log('\n❌ Missing required configuration. Please check your .env.local file.');
  process.exit(1);
}

async function runTests() {
  try {
    console.log('\nRunning tests...');
    
    // Test 1: Verify account access
    console.log('\n1. Verifying Twilio account access...');
    const account = await client.api.accounts(accountSid).fetch();
    console.log(`   ✓ Account verified: ${account.friendlyName} (${account.status})`);

    // Test 2: Generate a token
    console.log('\n2. Testing token generation...');
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    // Create an access token
    const token = new AccessToken(
      accountSid,
      apiKey,
      apiSecret,
      { identity: 'test-user' }
    );

    // Create a Voice grant for this token
    const grant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true
    });

    // Add the grant to the token
    token.addGrant(grant);

    // Generate the token
    const tokenString = token.toJwt();
    console.log(`   ✓ Token generated successfully: ${tokenString.substring(0, 20)}...`);

    // Test 3: Check TwiML app configuration
    console.log('\n3. Checking TwiML application configuration...');
    const app = await client.applications(twimlAppSid).fetch();
    console.log(`   ✓ TwiML application found: ${app.friendlyName}`);
    console.log(`   - Voice URL: ${app.voiceUrl || 'Not configured'}`);
    
    if (!app.voiceUrl) {
      console.log('\n⚠️ Warning: Voice URL for TwiML application is not configured!');
      console.log('   You should set this to your Netlify function URL:');
      console.log('   https://your-site.netlify.app/.netlify/functions/initiate-twilio-call/voice');
    }

    console.log('\n✅ All tests completed successfully!');
    console.log('\nHow to test in the browser:');
    console.log('1. Run your React app (npm start)');
    console.log('2. Navigate to a page with the QuickCallWidget component');
    console.log('3. Click on a contact to call and select "Use browser for calling"');
    console.log('4. If you don\'t have actual contacts, you can temporarily modify');
    console.log('   the QuickCallWidget to use mock data by ensuring this line exists:');
    console.log('   const mockContacts = mockDataService.generateMockContacts(5);');
    console.log('   setRecentContacts(mockContacts);');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
    }
    process.exit(1);
  }
}

// Run the tests
runTests();
