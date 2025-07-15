import { Handler } from '@netlify/functions';
import * as nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Email accounts configuration
const emailAccounts = [
  {
    email: 'jgolden@bowerycreativeagency.com',
    password: 'udyt jdfa huqe bicx',
    dailyLimit: 2000
  },
  {
    email: 'jasonwilliamgolden@gmail.com',
    password: 'smom nvay ojrr xnnj',
    dailyLimit: 500
  }
];

let accountIndex = 0;
const accountSentCounts = new Map<string, number>();

// Initialize sent counts
emailAccounts.forEach(account => {
  accountSentCounts.set(account.email, 0);
});

// Get next available account
function getNextAvailableAccount() {
  for (let i = 0; i < emailAccounts.length; i++) {
    const index = (accountIndex + i) % emailAccounts.length;
    const account = emailAccounts[index];
    const sentCount = accountSentCounts.get(account.email) || 0;
    
    if (sentCount < account.dailyLimit) {
      accountIndex = (index + 1) % emailAccounts.length;
      return account;
    }
  }
  
  return null;
}

// Create transporter for an account
function createTransporter(account: typeof emailAccounts[0]) {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: account.email,
      pass: account.password
    }
  });
}

export const handler: Handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const { to, subject, html, text, from, replyTo, contactId, campaignId, userId } = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!to || !subject || (!html && !text)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: to, subject, and either html or text' })
      };
    }

    // Get available account
    const account = getNextAvailableAccount();
    if (!account) {
      return {
        statusCode: 429,
        body: JSON.stringify({ error: 'All email accounts have reached their daily limits' })
      };
    }

    // Create transporter
    const transporter = createTransporter(account);

    // Prepare email options
    const mailOptions = {
      from: from || `"CRM System" <${account.email}>`,
      to,
      subject,
      html,
      text: text || stripHtml(html),
      replyTo: replyTo || account.email
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    // Update sent count
    accountSentCounts.set(account.email, (accountSentCounts.get(account.email) || 0) + 1);

    // Log to database
    const { error: logError } = await supabase
      .from('email_logs')
      .insert({
        message_id: info.messageId,
        from_email: mailOptions.from,
        to_email: to,
        subject,
        status: 'sent',
        sent_at: new Date().toISOString(),
        campaign_id: campaignId,
        contact_id: contactId,
        user_id: userId
      });

    if (logError) {
      console.error('Error logging email:', logError);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        messageId: info.messageId,
        account: account.email
      })
    };

  } catch (error) {
    console.error('Email send error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

// Simple HTML strip function
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}