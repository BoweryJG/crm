import { Handler, HandlerEvent } from '@netlify/functions';
import twilio from 'twilio';

// Get URL of your personal Twilio voice application
// This should point to a TwiML app that handles the call on your end
const PERSONAL_TWIML_APP_URL = process.env.TWILIO_PERSONAL_TWIML_APP || 'https://handler.twilio.com/twiml/EH179be5dbd5c91d93cc8351eba7ab0121';

// When we make an outbound call, we need to generate TwiML that dials your personal number
// This way, when the recipient answers, they'll be connected to you
const generateTwiML = (personalNumber) => {
  return `
<Response>
  <Dial callerId="${personalNumber}" timeout="30" record="false">
    <Number>${personalNumber}</Number>
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
    NETLIFY_SITE_URL
  } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !rawTwilioPhoneNumber) {
    console.error('Core Twilio environment variables (ACCOUNT_SID, AUTH_TOKEN, PHONE_NUMBER) not set for initiate-twilio-call function');
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

    // Extract the personal number from the request or use a default
    const personalNumber = requestBody.personalNumber || process.env.PERSONAL_PHONE_NUMBER;
    
    if (!personalNumber) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing personal phone number. Please provide personalNumber in the request or set PERSONAL_PHONE_NUMBER in environment variables.' 
        }),
      };
    }

    // For a full two-way call, we first call the target number
    const call = await client.calls.create({
      to: to, // The person you want to call
      from: fromNumber, // Your Twilio number
      twiml: generateTwiML(personalNumber), // When they answer, dial your personal number to connect both parties
      statusCallback: statusCallbackUrl,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
    });

    console.log(`Initiated two-way call from ${fromNumber} to ${to}, connecting to personal number ${personalNumber}. Call SID: ${call.sid}`);

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
