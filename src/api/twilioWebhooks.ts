import express from 'express';
import { storeRecordingMetadata, downloadAndStoreRecording } from '../services/twilio/recordingService';
import { supabase } from '../services/supabase/supabase';

const router = express.Router();

/**
 * Webhook endpoint for Twilio recording status updates
 */
router.post('/recording-webhook', async (req, res) => {
  try {
    console.log('Recording webhook received:', req.body);
    
    // Only process completed recordings
    if (req.body.RecordingStatus === 'completed') {
      const recordingSid = req.body.RecordingSid;
      const callSid = req.body.CallSid;
      
      // Find the call in our database to get contact info
      const { data: callData } = await supabase
        .from('sales_activities')
        .select('contact_id, practice_id, user_id')
        .eq('call_sid', callSid)
        .single();
      
      // Store recording metadata
      await storeRecordingMetadata({
        recordingSid,
        callSid,
        mediaUrl: `https://api.twilio.com/2010-04-01/Accounts/${req.body.AccountSid}/Recordings/${recordingSid}.mp3`,
        duration: parseInt(req.body.RecordingDuration || '0', 10),
        contactId: callData?.contact_id,
        practiceId: callData?.practice_id,
        userId: callData?.user_id
      });
      
      // Start the download process asynchronously
      // We don't await this to respond quickly to Twilio
      downloadAndStoreRecording(recordingSid).catch(err => {
        console.error('Error downloading recording:', err);
      });
      
      res.status(200).json({ success: true });
    } else {
      // For other recording statuses
      res.status(200).json({ success: true, status: req.body.RecordingStatus });
    }
  } catch (error) {
    console.error('Error processing recording webhook:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
});

/**
 * Webhook endpoint for Twilio call status updates
 */
router.post('/call-status', async (req, res) => {
  try {
    console.log('Call status webhook received:', req.body);
    
    const callSid = req.body.CallSid;
    const status = req.body.CallStatus;
    const duration = req.body.CallDuration ? parseInt(req.body.CallDuration, 10) : 0;
    
    // Update call status in database
    await supabase
      .from('sales_activities')
      .update({
        call_status: status,
        call_duration: duration,
        updated_at: new Date().toISOString()
      })
      .eq('call_sid', callSid);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing call status webhook:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
});

export default router;
