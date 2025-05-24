import { supabase } from '../supabase/supabase';
import { Contact } from '../../types/models';

// Helper function to validate if a string is a valid UUID
const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

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
    // TWILIO_FUNCTION_URL should be the complete URL to the Netlify function
    const response = await fetch(TWILIO_FUNCTION_URL, {
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

    // Log technical call details in twilio_calls
    await logCallActivity({
      contactId: params.contactId,
      practiceId: params.practiceId,
      userId: params.userId,
      callSid: data.callSid,
      status: 'initiated', // Twilio call status, e.g., 'initiated', 'ringing', 'answered', 'completed'
      fromNumber: params.from, // The number calling from (your Twilio number)
      toNumber: formattedTo,   // The number being called
      direction: 'outbound'    // Since this is an app-initiated call
    });
    
    // Also create a higher-level activity record in sales_activities table
    // This keeps the app's activity tracking system consistent
    await logSalesActivity({
      contactId: params.contactId,
      notes: `Outbound call to ${formattedTo}`,
      callSid: data.callSid  // Store callSid in notes for reference
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
 * Updates call status in the twilio_calls table
 * @param update Call status update information
 * @returns Success status
 */
export const updateCallStatus = async (update: CallStatusUpdate): Promise<boolean> => {
  try {
    const { callSid, status, duration } = update;

    // Maps to 'status' and 'duration' columns in 'twilio_calls' table
    const { error } = await supabase
      .from('twilio_calls') // Changed table name
      .update({
        status: status,       // Maps to 'status' column in twilio_calls
        duration: duration || 0, // Maps to 'duration' column in twilio_calls
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
 * Logs a call activity in the twilio_calls table (technical Twilio details)
 * @param params Call activity parameters
 * @returns Success status
 */
interface LogCallActivityParams {
  contactId: string;         // Will be stored in metadata
  practiceId: string;        // Will be stored in metadata
  userId: string;            // Maps to user_id
  callSid: string;           // Maps to call_sid
  status: string;            // Maps to status (e.g., 'initiated', 'completed')
  fromNumber: string;        // Maps to from_number
  toNumber: string;          // Maps to to_number
  direction: 'inbound' | 'outbound'; // Maps to direction
  notes?: string;            // Will be stored in metadata
}

export const logCallActivity = async (params: LogCallActivityParams): Promise<boolean> => {
  try {
    const { 
      contactId, 
      practiceId, 
      userId, 
      callSid, 
      status, 
      fromNumber, 
      toNumber, 
      direction, 
      notes 
    } = params;

    // Check if we're using mock/test data
    if (!isValidUUID(userId)) {
      console.warn(`Found non-UUID userId "${userId}", skipping database insert`);
      return true; // Return success but don't attempt to save to the database
    }

    const metadata = {
      contact_id: contactId,
      practice_id: practiceId,
      notes: notes || 'Phone call initiated by application.',
      // any other details from original 'details: { phoneNumber }' can be added if needed
    };

    const { error } = await supabase
      .from('twilio_calls') // Changed table name
      .insert({
        call_sid: callSid,
        from_number: fromNumber,
        to_number: toNumber,
        direction: direction,
        status: status,
        user_id: userId, // Assuming this is the application user who initiated
        metadata: metadata,
        // 'created_at' and 'updated_at' should have default values in DB
        // 'duration' will be updated later by webhook
        // 'phone_number_sid', 'recording_url', 'recording_sid', 'transcription_id' are nullable or set later
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
/**
 * Logs a general sales activity in the sales_activities table (for general activity tracking)
 * @param params Parameters for the sales activity
 * @returns Success status
 */
interface SalesActivityParams {
  contactId: string;
  notes?: string;
  callSid?: string; // Optional, to reference the related twilio_calls record
  outcome?: string;
  duration?: number;
}

export const logSalesActivity = async (params: SalesActivityParams): Promise<boolean> => {
  try {
    const { contactId, notes, callSid, outcome, duration } = params;
    
    // Check if we're using mock/test data
    if (!isValidUUID(contactId)) {
      console.warn(`Found non-UUID contactId "${contactId}", skipping database insert`);
      return true; // Return success but don't attempt to save to the database
    }
    
    // Format notes to include callSid reference if provided
    const formattedNotes = callSid 
      ? `${notes || 'Phone call'} (Call ID: ${callSid})`
      : notes || 'Phone call';
    
    const { error } = await supabase
      .from('sales_activities')
      .insert({
        type: 'call',
        contact_id: contactId,
        date: new Date().toISOString(),
        duration: duration,
        notes: formattedNotes,
        outcome: outcome
        // created_at and updated_at will use DB defaults
      });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error logging sales activity:', error);
    return false;
  }
};

/**
 * Fetches call history for a contact
 * @param contactId Contact ID
 * @returns Call history
 */
export const fetchCallHistory = async (contactId: string) => {
  try {
    // Query the sales_activities table for call activities
    // This matches the original behavior and works with QuickCallWidget
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
