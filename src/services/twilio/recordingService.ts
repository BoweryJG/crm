import { supabase } from '../supabase/supabase';

/**
 * Interface for recording metadata
 */
interface RecordingMetadata {
  recordingSid: string;
  callSid: string;
  mediaUrl: string;
  duration: number;
  contactId?: string;
  practiceId?: string;
  userId?: string;
}

/**
 * Stores recording metadata in Supabase
 * @param metadata Recording metadata
 * @returns Success status
 */
export const storeRecordingMetadata = async (metadata: RecordingMetadata): Promise<boolean> => {
  try {
    const { recordingSid, callSid, mediaUrl, duration, contactId, practiceId, userId } = metadata;
    
    // Store in Supabase
    const { error } = await supabase
      .from('call_recordings')
      .insert({
        recording_sid: recordingSid,
        call_sid: callSid,
        media_url: mediaUrl,
        duration: duration,
        contact_id: contactId,
        practice_id: practiceId,
        user_id: userId,
        created_at: new Date().toISOString(),
        status: 'pending_download'
      });
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error storing recording metadata:', error);
    return false;
  }
};

/**
 * Downloads a recording from Twilio and stores it in Supabase Storage
 * @param recordingSid The Twilio recording SID
 * @returns Success status and file path
 */
export const downloadAndStoreRecording = async (recordingSid: string): Promise<{ success: boolean; filePath?: string; error?: string }> => {
  try {
    // First, get the recording metadata from our database
    const { data: recordingData, error: fetchError } = await supabase
      .from('call_recordings')
      .select('*')
      .eq('recording_sid', recordingSid)
      .single();
    
    if (fetchError || !recordingData) {
      throw new Error(fetchError?.message || 'Recording not found');
    }
    
    // Download the recording from Twilio
    const mediaUrl = recordingData.media_url;
    const response = await fetch(mediaUrl, {
      headers: {
        'Authorization': `Basic ${btoa(`${process.env.REACT_APP_TWILIO_API_KEY}:`)}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to download recording: ${response.statusText}`);
    }
    
    // Convert to blob
    const blob = await response.blob();
    
    // Create a file object
    const file = new File([blob], `recording_${recordingSid}.mp3`, { type: 'audio/mp3' });
    
    // Upload to Supabase Storage
    const filePath = `recordings/${recordingSid}.mp3`;
    const { error: uploadError } = await supabase.storage
      .from('call_recordings')
      .upload(filePath, file);
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Update the record in the database
    const { error: updateError } = await supabase
      .from('call_recordings')
      .update({
        status: 'downloaded',
        storage_path: filePath,
        updated_at: new Date().toISOString()
      })
      .eq('recording_sid', recordingSid);
    
    if (updateError) {
      throw updateError;
    }
    
    return { success: true, filePath };
  } catch (error) {
    console.error('Error downloading and storing recording:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Gets a list of recordings for a contact
 * @param contactId Contact ID
 * @returns List of recordings
 */
export const getRecordingsForContact = async (contactId: string) => {
  try {
    const { data, error } = await supabase
      .from('call_recordings')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching recordings:', error);
    return { data: null, error };
  }
};

/**
 * Gets a signed URL for a recording stored in Supabase Storage
 * @param storagePath Path to the recording in Supabase Storage
 * @returns Signed URL
 */
export const getRecordingUrl = async (storagePath: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('call_recordings')
      .createSignedUrl(storagePath, 3600); // 1 hour expiry
    
    if (error) {
      throw error;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    return null;
  }
};

/**
 * Sends a recording to OpenRouter for linguistic analysis
 * @param recordingSid Recording SID
 * @returns Analysis results
 */
export const analyzeRecording = async (recordingSid: string) => {
  try {
    // First get the signed URL for the recording
    const { data: recordingData, error: fetchError } = await supabase
      .from('call_recordings')
      .select('storage_path')
      .eq('recording_sid', recordingSid)
      .single();
    
    if (fetchError || !recordingData?.storage_path) {
      throw new Error(fetchError?.message || 'Recording not found');
    }
    
    const signedUrl = await getRecordingUrl(recordingData.storage_path);
    
    if (!signedUrl) {
      throw new Error('Failed to get signed URL for recording');
    }
    
    // Send to OpenRouter for analysis
    // Note: This is a placeholder. You'll need to implement the actual OpenRouter API call
    const response = await fetch('https://openrouter.ai/api/v1/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        audio_url: signedUrl,
        analysis_type: 'linguistics'
        // Other parameters as needed
      })
    });
    
    const analysisResults = await response.json();
    
    // Store the analysis results
    const { error: updateError } = await supabase
      .from('call_recordings')
      .update({
        analysis_results: analysisResults,
        analysis_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('recording_sid', recordingSid);
    
    if (updateError) {
      throw updateError;
    }
    
    return { success: true, results: analysisResults };
  } catch (error) {
    console.error('Error analyzing recording:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};
