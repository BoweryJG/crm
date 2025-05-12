import { supabase } from '../supabase/supabase';
import { Contact } from '../../types/models';

// Twilio API configuration
const TWILIO_FUNCTION_URL = process.env.REACT_APP_TWILIO_FUNCTION_URL || '';
const TWILIO_API_KEY = process.env.REACT_APP_TWILIO_API_KEY || '';

/**
 * Interface for call parameters
 */
interface CallParams {
  to: string;
  from: string;
  contactId: string;
  practiceId: string;
  userId: string;
  callbackUrl?: string;
}

/**
 * Interface for call response
 */
interface CallResponse {
  success: boolean;
  callSid?: string;
  error?: string;
}

/**
 * Interface for call status update
 */
interface CallStatusUpdate {
  callSid: string;
  status: string;
  duration?: number;
}

/**
 * Initiates a call using Twilio
 * @param params Call parameters
 * @returns Call response with success status and call SID if successful
 */
export const initiateCall = async (params: CallParams): Promise<CallResponse> => {
  try {
    // Validate phone number format
    const formattedTo = formatPhoneNumber(params.to);
    if (!formattedTo) {
      return { success: false, error: 'Invalid phone number format' };
    }

    // Make API call to Twilio Function
    const response = await fetch(`${TWILIO_FUNCTION_URL}/initiate-call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TWILIO_API_KEY}`
      },
      body: JSON.stringify({
        to: formattedTo,
        from: params.from,
        callbackUrl: params.callbackUrl || `${window.location.origin}/call-callback`
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to initiate call');
    }

    // Log call activity in Supabase
    await logCallActivity({
      contactId: params.contactId,
      practiceId: params.practiceId,
      userId: params.userId,
      callSid: data.callSid,
      status: 'initiated',
      phoneNumber: formattedTo
    });

    return {
      success: true,
      callSid: data.callSid
    };
  } catch (error) {
    console.error('Error initiating call:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Updates call status in the database
 * @param update Call status update information
 * @returns Success status
 */
export const updateCallStatus = async (update: CallStatusUpdate): Promise<boolean> => {
  try {
    const { callSid, status, duration } = update;

    const { error } = await supabase
      .from('sales_activities')
      .update({
        call_status: status,
        call_duration: duration || 0,
        updated_at: new Date().toISOString()
      })
      .eq('call_sid', callSid);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error updating call status:', error);
    return false;
  }
};

/**
 * Logs a call activity in the database
 * @param params Call activity parameters
 * @returns Success status
 */
interface LogCallActivityParams {
  contactId: string;
  practiceId: string;
  userId: string;
  callSid: string;
  status: string;
  phoneNumber: string;
  notes?: string;
}

export const logCallActivity = async (params: LogCallActivityParams): Promise<boolean> => {
  try {
    const { contactId, practiceId, userId, callSid, status, phoneNumber, notes } = params;

    const { error } = await supabase
      .from('sales_activities')
      .insert({
        contact_id: contactId,
        practice_id: practiceId,
        user_id: userId,
        type: 'call',
        date: new Date().toISOString(),
        call_sid: callSid,
        call_status: status,
        notes: notes || 'Phone call',
        details: { phoneNumber }
      });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error logging call activity:', error);
    return false;
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
 * Makes a call to a contact
 * @param contact Contact to call
 * @param userId Current user ID
 * @returns Call response
 */
export const callContact = async (contact: Contact, userId: string): Promise<CallResponse> => {
  // In a real app, you would get the 'from' number from user settings or environment
  const fromNumber = process.env.REACT_APP_TWILIO_PHONE_NUMBER || '';
  
  if (!fromNumber) {
    return { 
      success: false, 
      error: 'No outbound phone number configured' 
    };
  }

  return initiateCall({
    to: contact.phone,
    from: fromNumber,
    contactId: contact.id,
    practiceId: contact.practice_id || 'unknown',
    userId: userId
  });
};

/**
 * Fetches call history for a contact
 * @param contactId Contact ID
 * @returns Call history
 */
export const fetchCallHistory = async (contactId: string) => {
  try {
    const { data, error } = await supabase
      .from('sales_activities')
      .select('*')
      .eq('contact_id', contactId)
      .eq('type', 'call')
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching call history:', error);
    return { data: null, error };
  }
};
