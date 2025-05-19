import { Handler, HandlerEvent } from '@netlify/functions';
import { storeRecordingMetadata, downloadAndStoreRecording } from '../../src/services/twilio/recordingService';
import { supabase } from '../../src/services/supabase/supabase';

// Netlify serverless function to handle Twilio webhooks
export const handler: Handler = async (event: HandlerEvent) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const body = JSON.parse(event.body || '{}');
    console.log('Webhook received:', body);

    // Handle recording status updates
    if (body.RecordingSid && body.RecordingStatus) {
      return await handleRecordingWebhook(body);
    }

    // Handle call status updates
    if (body.CallSid && body.CallStatus) {
      return await handleCallStatusWebhook(body);
    }

    // Default response for unhandled webhook types
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: 'Webhook received but not processed'
      })
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      })
    };
  }
};

/**
 * Handle recording status webhooks from Twilio
 */
async function handleRecordingWebhook(body: any) {
  // Only process completed recordings
  if (body.RecordingStatus === 'completed') {
    const recordingSid = body.RecordingSid;
    const callSid = body.CallSid;
    
    try {
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
        mediaUrl: `https://api.twilio.com/2010-04-01/Accounts/${body.AccountSid}/Recordings/${recordingSid}.mp3`,
        duration: parseInt(body.RecordingDuration || '0', 10),
        contactId: callData?.contact_id,
        practiceId: callData?.practice_id,
        userId: callData?.user_id
      });
      
      // Start the download process asynchronously
      // We don't await this to respond quickly to Twilio
      downloadAndStoreRecording(recordingSid).catch(err => {
        console.error('Error downloading recording:', err);
      });
      
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    } catch (error) {
      console.error('Error processing recording webhook:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error occurred' 
        })
      };
    }
  } else {
    // For other recording statuses
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        status: body.RecordingStatus 
      })
    };
  }
}

/**
 * Handle call status webhooks from Twilio
 */
async function handleCallStatusWebhook(body: any) {
  try {
    const callSid = body.CallSid;
    const status = body.CallStatus;
    const duration = body.CallDuration ? parseInt(body.CallDuration, 10) : 0;
    
    // Update call status in database
    await supabase
      .from('sales_activities')
      .update({
        call_status: status,
        call_duration: duration,
        updated_at: new Date().toISOString()
      })
      .eq('call_sid', callSid);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Error processing call status webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      })
    };
  }
}
