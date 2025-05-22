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
    const { to, from, body: message } = body;

    if (!to || !from || !message) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing parameters' }) };
    }

    const sms = await client.messages.create({
      to,
      from,
      body: message
    });

    return { statusCode: 200, body: JSON.stringify({ success: true, messageSid: sms.sid }) };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }) };
  }
};
