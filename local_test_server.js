/**
 * Local test server for Twilio browser-based calling
 * Run this with: node local_test_server.js
 */

require('dotenv').config({ path: '.env.local' });
const express = require('express');
const twilio = require('twilio');
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const path = require('path');

// Check if required environment variables are present
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY,
  TWILIO_API_SECRET,
  TWILIO_TWIML_APP_SID,
  TWILIO_PHONE_NUMBER
} = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_API_KEY || !TWILIO_API_SECRET || !TWILIO_TWIML_APP_SID) {
  console.error('\n❌ Missing required environment variables in .env.local file');
  console.log('Make sure you have the following variables set:');
  console.log('- TWILIO_ACCOUNT_SID');
  console.log('- TWILIO_API_KEY');
  console.log('- TWILIO_API_SECRET');
  console.log('- TWILIO_TWIML_APP_SID');
  console.log('- TWILIO_PHONE_NUMBER');
  console.log('\nRun ./setup-twilio-calling.sh to set these up automatically.');
  process.exit(1);
}

const app = express();
const PORT = 3000;

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (including test_phone_call.html)
app.use(express.static(__dirname));

// Generate a token for browser-based calling
app.get('/token', (req, res) => {
  const identity = req.query.identity || 'test-user';
  
  console.log(`Generating token for ${identity}...`);

  try {
    // Create an access token
    const token = new AccessToken(
      TWILIO_ACCOUNT_SID,
      TWILIO_API_KEY,
      TWILIO_API_SECRET,
      { identity }
    );

    // Create a Voice grant for this token
    const grant = new VoiceGrant({
      outgoingApplicationSid: TWILIO_TWIML_APP_SID,
      incomingAllow: true // Allow incoming calls
    });

    // Add the grant to the token
    token.addGrant(grant);
    
    const jwt = token.toJwt();
    console.log(`Token generated successfully for ${identity}`);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(JSON.stringify({
      token: jwt,
      identity: identity
    }));
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// Handle voice TwiML
app.post('/voice', (req, res) => {
  console.log('Received voice request:', req.body);
  
  const to = req.body.To;
  const from = req.body.From || TWILIO_PHONE_NUMBER;
  const callerId = TWILIO_PHONE_NUMBER;
  
  let twiml = '';
  
  // Handle browser-to-phone call
  if (to && !to.includes('client:')) {
    twiml = `
      <Response>
        <Dial callerId="${callerId}">
          <Number>${to}</Number>
        </Dial>
      </Response>
    `;
  } 
  // Handle incoming calls to the browser
  else {
    const client = req.body.client || 'test-user';
    twiml = `
      <Response>
        <Dial>
          <Client>${client}</Client>
        </Dial>
      </Response>
    `;
  }
  
  console.log('Returning TwiML:', twiml);
  
  res.setHeader('Content-Type', 'application/xml');
  res.send(twiml);
});

// Start the server
app.listen(PORT, () => {
  console.log(`
🚀 Local Twilio test server running at http://localhost:${PORT}

- To test browser calling:
  Open http://localhost:${PORT}/test_phone_call.html in your browser
  
- For token generation:
  http://localhost:${PORT}/token?identity=your-name
  
- For TwiML App Voice URL (update in Twilio console):
  http://localhost:${PORT}/voice
  
Press Ctrl+C to stop the server
`);
});
