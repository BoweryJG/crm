import { Handler, HandlerEvent } from '@netlify/functions';
import twilio from 'twilio';
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

// Handle token generation for the browser client
const generateAccessToken = async (event: HandlerEvent) => {
  try {
    // Parse query parameters or body
    let identity;
    
    if (event.queryStringParameters && event.queryStringParameters.identity) {
      identity = event.queryStringParameters.identity;
    } else if (event.body) {
      const body = JSON.parse(event.body);
      identity = body.identity;
    }

    if (!identity) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Identity parameter is required' }),
      };
    }

    const { 
      TWILIO_ACCOUNT_SID, 
      TWILIO_API_KEY, 
      TWILIO_API_SECRET,
      TWILIO_TWIML_APP_SID,
    } = process.env;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_API_KEY || !TWILIO_API_SECRET || !TWILIO_TWIML_APP_SID) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing required environment variables for token generation' }),
      };
    }

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

    // Generate the token
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // For CORS
      },
      body: JSON.stringify({
        token: token.toJwt(),
        identity: identity
      }),
    };
  } catch (error) {
    console.error('Error generating token:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate token' }),
    };
  }
};

// This TwiML is used when making calls from the browser
const generateVoiceTwiML = (to, from) => {
  return `
<Response>
  <Dial callerId="${from}">
    <Number>${to}</Number>
  </Dial>
</Response>
`;
};

// This TwiML handles incoming calls to the browser
const generateIncomingCallTwiML = (clientName) => {
  return `
<Response>
  <Dial>
    <Client>${clientName}</Client>
  </Dial>
</Response>
`;
};

// Helper function to format phone numbers to E.164
const formatPhoneNumber = (phoneNumber: string): string | null => {
  if (!phoneNumber) return null;
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  if (digitsOnly.length < 10) {
    return null;
  }
  if (digitsOnly.length === 10) { // Assuming US number if 10 digits
    return `+1${digitsOnly}`;
  }
  if (digitsOnly.startsWith('1') && digitsOnly.length === 11) { // US number with 1 prefix
    return `+${digitsOnly}`;
  }
  if (digitsOnly.length > 10) { // International number already with country code
    return `+${digitsOnly}`;
  }
  return null;
};

export const handler: Handler = async (event: HandlerEvent) => {
  // Handle different endpoints
  const path = event.path.replace('/.netlify/functions/initiate-twilio-call', '');
  
  // Generate token for browser client
  if (path === '/token' || path.includes('/token')) {
    return generateAccessToken(event);
  }

  // Handle voice TwiML for browser-to-phone call
  if (path === '/voice' || path.includes('/voice')) {
    try {
      let to = '';
      let from = '';
      let clientName = '';
      
      // Parse the request body differently depending on HTTP method
      if (event.httpMethod === 'POST') {
        if (event.body) {
          const params = new URLSearchParams(event.body);
          to = params.get('To') || '';
          from = params.get('From') || '';
          clientName = params.get('Client') || '';
        }
      } else if (event.httpMethod === 'GET' && event.queryStringParameters) {
        to = event.queryStringParameters.To || '';
        from = event.queryStringParameters.From || '';
        clientName = event.queryStringParameters.Client || '';
      }

      console.log('Voice TwiML request:', { to, from, clientName });

      // Determine if this is an incoming call to the browser client or outgoing call from browser
      if (to.startsWith('client:')) {
        // This is an incoming call to the browser client
        const client = to.substring(7); // Remove 'client:' prefix
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/xml' },
          body: generateIncomingCallTwiML(client)
        };
      } else {
        // This is an outgoing call from browser to phone number
        const callerId = process.env.TWILIO_PHONE_NUMBER || from;
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/xml' },
          body: generateVoiceTwiML(to, callerId)
        };
      }
    } catch (error) {
      console.error('Error generating voice TwiML:', error);
      return {
        statusCode: 500,
        body: 'Error handling voice request'
      };
    }
  }
  
  // Handle outbound call initiation (original functionality)
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const { 
    TWILIO_ACCOUNT_SID, 
    TWILIO_AUTH_TOKEN, 
    TWILIO_PHONE_NUMBER: rawTwilioPhoneNumber,
    TWILIO_API_KEY,
    TWILIO_API_SECRET,
    TWILIO_TWIML_APP_SID,
    NETLIFY_SITE_URL
  } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !rawTwilioPhoneNumber) {
    console.error('Core Twilio environment variables not set for initiate-twilio-call function');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Twilio configuration error on server: Missing core credentials.' }),
    };
  }

  const fromNumberE164 = formatPhoneNumber(rawTwilioPhoneNumber);
  if (!fromNumberE164) {
    console.error(`Invalid TWILIO_PHONE_NUMBER format after attempting to normalize: ${rawTwilioPhoneNumber}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Twilio configuration error on server: Invalid FROM phone number format.' }),
    };
  }

  let requestBody;
  try {
    requestBody = JSON.parse(event.body || '{}');
  } catch (error) {
    console.error('Invalid JSON in request body:', event.body);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body: Must be valid JSON.' }),
    };
  }

  const { to, from: fromFrontend, contactId, practiceId, userId } = requestBody;

  if (!to) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing "to" phone number in request body.' }),
    };
  }

  // Use the environment variable TWILIO_PHONE_NUMBER (now formatted) as the 'from' number.
  // The 'fromFrontend' can be ignored or used for logging if needed, but calls must originate from a verified Twilio number.
  const fromNumber = fromNumberE164;

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  try {
    // Construct the status callback URL to point to your existing twilio-webhook function
    // Ensure NETLIFY_SITE_URL is set in your Netlify build environment, or construct it manually.
    const siteUrl = NETLIFY_SITE_URL || (event.headers && `https://${event.headers.host}`);
    if (!siteUrl) {
        console.error('Could not determine site URL for Twilio status callback.');
        // Fallback or error, depending on how critical this is.
        // For now, we'll proceed without it if it can't be determined, but Twilio might require it or default.
    }
    const statusCallbackUrl = siteUrl ? `${siteUrl}/.netlify/functions/twilio-webhook` : undefined;
    
    console.log(`Initiating call from ${fromNumber} to ${to}. Status callback: ${statusCallbackUrl}`);

    // For a standard call (this will be replaced by browser-based calling)
    const call = await client.calls.create({
      to: to,
      from: fromNumber,
      url: `${siteUrl}/.netlify/functions/initiate-twilio-call/voice?To=${to}&From=${fromNumber}`,
      statusCallback: statusCallbackUrl,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
    });

    console.log(`Initiated call from ${fromNumber} to ${to}. Call SID: ${call.sid}`);

    // Note: The frontend's twilioService.ts is already responsible for logging the 'initiated'
    // status to sales_activities AFTER this function returns successfully with a callSid.
    // So, this backend function doesn't need to log to Supabase directly for the 'initiated' state.

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, callSid: call.sid }),
    };
  } catch (error: any) {
    console.error('Error initiating Twilio call:', error);
    return {
      statusCode: error.status || 500,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Failed to initiate Twilio call.',
        twilioError: error.moreInfo ? { code: error.code, moreInfo: error.moreInfo } : undefined,
      }),
    };
  }
};
