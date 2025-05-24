/**
 * Twilio Browser-Based Calling Test Script
 * This script tests if your Twilio configuration is set up correctly for browser-based calling
 */

require('dotenv').config({ path: '.env.local' });
const twilio = require('twilio');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

// Print colored message
function print(message, color = colors.white) {
  console.log(color + message + colors.reset);
}

// Print header
function printHeader(message) {
  console.log('\n' + colors.bold + colors.blue + '='.repeat(message.length + 4) + colors.reset);
  console.log(colors.bold + colors.blue + '= ' + message + ' =' + colors.reset);
  console.log(colors.bold + colors.blue + '='.repeat(message.length + 4) + colors.reset + '\n');
}

// Print success or failure
function printResult(message, success) {
  const icon = success ? '✓' : '✗';
  const color = success ? colors.green : colors.red;
  console.log(color + icon + ' ' + message + colors.reset);
}

async function testTwilioConfiguration() {
  printHeader('Twilio Browser-Based Calling Configuration Test');
  
  let hasErrors = false;
  
  // 1. Check required environment variables
  print('Checking environment variables...', colors.cyan);
  
  const requiredVars = [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_API_KEY',
    'TWILIO_API_SECRET',
    'TWILIO_TWIML_APP_SID',
    'TWILIO_PHONE_NUMBER'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    printResult(`Missing required environment variables: ${missingVars.join(', ')}`, false);
    print('\nPlease add these variables to your .env.local file.', colors.yellow);
    print('You can run ./setup-twilio-calling.sh to set these up automatically.', colors.yellow);
    hasErrors = true;
  } else {
    printResult('All required environment variables are present', true);
  }
  
  // If missing any required vars, exit early
  if (hasErrors) {
    return false;
  }
  
  // 2. Create Twilio clients
  try {
    const mainClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    print('Testing Twilio authentication...', colors.cyan);
    
    // Test authentication by making a simple API call
    try {
      await mainClient.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
      printResult('Twilio authentication successful', true);
    } catch (error) {
      printResult(`Twilio authentication failed: ${error.message}`, false);
      hasErrors = true;
    }
    
    // 3. Check if TwiML App exists
    print('Checking TwiML App configuration...', colors.cyan);
    try {
      const app = await mainClient.applications(process.env.TWILIO_TWIML_APP_SID).fetch();
      printResult(`TwiML App found: ${app.friendlyName}`, true);
      
      // Check if Voice URL is configured
      if (!app.voiceUrl) {
        printResult('TwiML App has no Voice URL configured', false);
        print('Your TwiML App should have a Voice URL pointing to your application.', colors.yellow);
        hasErrors = true;
      } else {
        printResult(`Voice URL configured: ${app.voiceUrl}`, true);
      }
    } catch (error) {
      printResult(`TwiML App not found: ${error.message}`, false);
      hasErrors = true;
    }
    
    // 4. Check if phone number is configured
    print('Checking phone number configuration...', colors.cyan);
    try {
      const phoneNumbers = await mainClient.incomingPhoneNumbers.list({
        phoneNumber: process.env.TWILIO_PHONE_NUMBER
      });
      
      if (phoneNumbers.length === 0) {
        printResult(`Phone number ${process.env.TWILIO_PHONE_NUMBER} not found in your account`, false);
        hasErrors = true;
      } else {
        const phoneNumber = phoneNumbers[0];
        printResult(`Phone number found: ${phoneNumber.friendlyName}`, true);
        
        // Check if the phone number is using the TwiML app
        if (phoneNumber.voiceApplicationSid === process.env.TWILIO_TWIML_APP_SID) {
          printResult('Phone number is correctly configured to use the TwiML App', true);
        } else {
          printResult('Phone number is NOT configured to use your TwiML App', false);
          print('Please update your phone number to use the TwiML App for Voice calls.', colors.yellow);
          hasErrors = true;
        }
      }
    } catch (error) {
      printResult(`Error checking phone number: ${error.message}`, false);
      hasErrors = true;
    }
    
    // 5. Test token generation
    print('Testing token generation...', colors.cyan);
    try {
      const AccessToken = twilio.jwt.AccessToken;
      const VoiceGrant = AccessToken.VoiceGrant;
      
      // Create an access token
      const token = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET,
        { identity: 'test-user' }
      );
      
      // Create a Voice grant for this token
      const grant = new VoiceGrant({
        outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
        incomingAllow: true
      });
      
      // Add the grant to the token
      token.addGrant(grant);
      
      // Generate the token
      const jwt = token.toJwt();
      
      if (jwt) {
        printResult('Token generation successful', true);
      } else {
        printResult('Token generation failed', false);
        hasErrors = true;
      }
    } catch (error) {
      printResult(`Error generating token: ${error.message}`, false);
      hasErrors = true;
    }
    
  } catch (error) {
    printResult(`Error initializing Twilio client: ${error.message}`, false);
    hasErrors = true;
  }
  
  // Final result
  console.log('\n' + '-'.repeat(50));
  if (hasErrors) {
    print('\n❌ Some tests failed. Please fix the issues above before testing browser-based calling.', colors.bold + colors.red);
  } else {
    print('\n✅ All tests passed! Your Twilio configuration is ready for browser-based calling.', colors.bold + colors.green);
    print('\nNext steps:', colors.bold + colors.cyan);
    print('1. Open test_phone_call.html in your browser to test calling', colors.cyan);
    print('2. Call your Twilio number to test incoming calls', colors.cyan);
  }
  
  return !hasErrors;
}

testTwilioConfiguration();
