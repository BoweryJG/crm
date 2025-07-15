import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import * as nodemailer from 'nodemailer';
import { simpleParser } from 'mailparser';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Gmail sync configuration
const GMAIL_ACCOUNTS = [
  {
    email: process.env.REACT_APP_GMAIL_EMAIL_1!,
    password: process.env.REACT_APP_GMAIL_PASSWORD_1!
  },
  {
    email: process.env.REACT_APP_GMAIL_EMAIL_2!,
    password: process.env.REACT_APP_GMAIL_PASSWORD_2!
  }
];

interface GmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: Date;
  html?: string;
  text?: string;
}

// This function would be called periodically to sync emails
export const handler: Handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { userId, accountEmail } = JSON.parse(event.body || '{}');

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing userId' })
      };
    }

    // Find the account to sync
    const account = GMAIL_ACCOUNTS.find(acc => 
      !accountEmail || acc.email === accountEmail
    );

    if (!account) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Account not found' })
      };
    }

    // Note: In a real implementation, you would use Gmail API here
    // For now, we'll return a placeholder response
    const syncedCount = 0;
    const message = `Gmail sync placeholder - would sync ${account.email}`;

    // Log the sync attempt
    await supabase
      .from('email_logs')
      .insert({
        from_email: 'system',
        to_email: account.email,
        subject: 'Gmail Sync Attempted',
        status: 'pending',
        sent_at: new Date().toISOString(),
        user_id: userId
      });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message,
        syncedCount,
        account: account.email
      })
    };

  } catch (error) {
    console.error('Gmail sync error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to sync Gmail',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

// Helper function to match email addresses to contacts
async function findContactByEmail(email: string, userId: string) {
  const { data } = await supabase
    .from('contacts')
    .select('id')
    .eq('email', email)
    .eq('user_id', userId)
    .single();
  
  return data?.id;
}