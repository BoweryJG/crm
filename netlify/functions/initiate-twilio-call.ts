import { Handler, HandlerEvent } from '@netlify/functions';
import twilio from 'twilio';

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, NETLIFY_SITE_URL } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error('Twilio environment variables not set for initiate-twilio-call function');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Twilio configuration error on server.' }),
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

  // Use the environment variable TWILIO_PHONE_NUMBER as the 'from' number.
  // The 'fromFrontend' can be ignored or used for logging if needed, but calls must originate from a verified Twilio number.
  const fromNumber = TWILIO_PHONE_NUMBER;

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
      // The statusCallback will send updates (e.g., completed, busy, failed) to your twilio-webhook function.
      statusCallback: statusCallbackUrl,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'], // Specify desired events
      statusCallbackMethod: 'POST',
    });

    console.log('Twilio call initiated successfully. Call SID:', call.sid);

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
