import { Handler } from '@netlify/functions';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const apiKey = process.env.TWILIO_FUNCTION_SECRET || '';

const client = twilio(accountSid, authToken);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  if (!event.headers.authorization || event.headers.authorization !== `Bearer ${apiKey}`) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { to, from, callbackUrl } = body;

    if (!to || !from) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing to or from number' }) };
    }

    const twiml = `<Response><Dial record="record-from-answer">${to}</Dial></Response>`;

    const call = await client.calls.create({
      twiml,
      to,
      from,
      statusCallback: callbackUrl,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
      recordingStatusCallback: callbackUrl,
      recordingStatusCallbackMethod: 'POST'
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, callSid: call.sid })
    };
  } catch (error) {
    console.error('Error initiating call:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    };
  }
};
