import { Handler, HandlerEvent } from '@netlify/functions';
import twilio from 'twilio';

// Hardcoded TwiML URL - no environment variable needed
const TWILIO_CALL_HANDLER_URL = 'https://osbackend-zl1h.onrender.com/twilio/voice';

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

    const call = await client.calls.create({
      to: to,
      from: fromNumber,
      url: TWILIO_CALL_HANDLER_URL, // URL for TwiML instructions
      // The statusCallback will send updates (e.g., completed, busy, failed) to your twilio-webhook function.
      statusCallback: statusCallbackUrl,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'], // Specify desired events
      statusCallbackMethod: 'POST',
    });

    console.log('Twilio call initiated successfully. Call SID:', call.sid, 'TwiML URL used (hardcoded):', TWILIO_CALL_HANDLER_URL);

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
