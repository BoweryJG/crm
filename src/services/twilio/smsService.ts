import { supabase } from '../supabase/supabase';
import { Contact } from '../../types/models';

// Twilio API configuration
const TWILIO_FUNCTION_URL = process.env.REACT_APP_TWILIO_FUNCTION_URL || '';
const TWILIO_API_KEY = process.env.REACT_APP_TWILIO_API_KEY || '';

/**
 * Interface for SMS parameters
 */
interface SMSParams {
  to: string;
  from: string;
  body: string;
  contactId: string;
  practiceId: string;
  userId: string;
}

/**
 * Interface for SMS response
 */
interface SMSResponse {
  success: boolean;
  messageSid?: string;
  error?: string;
}

/**
 * Interface for SMS history item
 */
export interface SMSHistoryItem {
  id: string;
  contact_id: string;
  practice_id: string;
  user_id: string;
  type: 'sms';
  date: string;
  message_sid: string;
  message_status: string;
  message_body: string;
  message_direction: 'outbound' | 'inbound';
  created_at: string;
  updated_at: string;
}

/**
 * Sends an SMS using Twilio
 * @param params SMS parameters
 * @returns SMS response with success status and message SID if successful
 */
export const sendSMS = async (params: SMSParams): Promise<SMSResponse> => {
  try {
    // Validate phone number format
    const formattedTo = formatPhoneNumber(params.to);
    if (!formattedTo) {
      return { success: false, error: 'Invalid phone number format' };
    }

    // Make API call to Twilio Function
    const response = await fetch(`${TWILIO_FUNCTION_URL}/send-sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TWILIO_API_KEY}`
      },
      body: JSON.stringify({
        to: formattedTo,
        from: params.from,
        body: params.body
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send SMS');
    }

    // Log SMS activity in Supabase
    await logSMSActivity({
      contactId: params.contactId,
      practiceId: params.practiceId,
      userId: params.userId,
      messageSid: data.messageSid,
      status: 'sent',
      body: params.body,
      phoneNumber: formattedTo,
      direction: 'outbound'
    });

    return {
      success: true,
      messageSid: data.messageSid
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Updates SMS status in the database
 * @param messageSid Message SID
 * @param status New status
 * @returns Success status
 */
export const updateSMSStatus = async (messageSid: string, status: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sms_messages')
      .update({
        message_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('message_sid', messageSid);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error updating SMS status:', error);
    return false;
  }
};

/**
 * Logs an SMS activity in the database
 * @param params SMS activity parameters
 * @returns Success status
 */
interface LogSMSActivityParams {
  contactId: string;
  practiceId: string;
  userId: string;
  messageSid: string;
  status: string;
  body: string;
  phoneNumber: string;
  direction: 'outbound' | 'inbound';
}

export const logSMSActivity = async (params: LogSMSActivityParams): Promise<boolean> => {
  try {
    const { contactId, practiceId, userId, messageSid, status, body, phoneNumber, direction } = params;

    const { error } = await supabase
      .from('sms_messages')
      .insert({
        contact_id: contactId,
        practice_id: practiceId,
        user_id: userId,
        message_sid: messageSid,
        message_status: status,
        message_body: body,
        message_direction: direction,
        date: new Date().toISOString(),
        details: { phoneNumber }
      });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error logging SMS activity:', error);
    return false;
  }
};

/**
 * Fetches SMS history for a contact
 * @param contactId Contact ID
 * @returns SMS history
 */
export const fetchSMSHistory = async (contactId: string) => {
  try {
    const { data, error } = await supabase
      .from('sms_messages')
      .select('*')
      .eq('contact_id', contactId)
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching SMS history:', error);
    return { data: null, error };
  }
};

/**
 * Formats a phone number to E.164 format
 * @param phoneNumber Phone number to format
 * @returns Formatted phone number or null if invalid
 */
export const formatPhoneNumber = (phoneNumber: string): string | null => {
  // Remove all non-numeric characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  // Check if the number is valid
  if (digitsOnly.length < 10) {
    return null;
  }

  // For US numbers
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  }

  // For international numbers that already have country code
  if (digitsOnly.length > 10) {
    return `+${digitsOnly}`;
  }

  return null;
};

/**
 * Sends an SMS to a contact
 * @param contact Contact to send SMS to
 * @param userId Current user ID
 * @param message Message body
 * @returns SMS response
 */
export const sendSMSToContact = async (
  contact: Contact, 
  userId: string, 
  message: string
): Promise<SMSResponse> => {
  // In a real app, you would get the 'from' number from user settings or environment
  const fromNumber = process.env.REACT_APP_TWILIO_PHONE_NUMBER || '';
  
  if (!fromNumber) {
    return { 
      success: false, 
      error: 'No outbound phone number configured' 
    };
  }

  return sendSMS({
    to: contact.phone,
    from: fromNumber,
    body: message,
    contactId: contact.id,
    practiceId: contact.practice_id || 'unknown',
    userId: userId
  });
};
