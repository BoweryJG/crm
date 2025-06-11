import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the multipart form data
    const boundary = event.headers['content-type']?.split('boundary=')[1];
    if (!boundary) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No boundary found in content-type' })
      };
    }

    // Parse the form data
    const formData = parseMultipartFormData(event.body || '', boundary);
    
    // Extract metadata from form fields
    const metadata = {
      contactId: formData.fields.contactId,
      contactName: formData.fields.contactName,
      practiceId: formData.fields.practiceId,
      userId: formData.fields.userId,
      source: formData.fields.source || 'plaud',
      externalId: formData.fields.externalId || formData.fields.notes,
      fileName: formData.file?.filename,
      fileSize: formData.file?.data.length
    };

    if (!formData.file || !metadata.userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Process with Gemini 2.5 Pro
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `
      You are analyzing a sales call recording. Please provide:
      
      1. Complete transcription of the audio
      2. Executive summary (2-3 sentences)
      3. Overall sentiment analysis
      4. Key discussion points (bullet points)
      5. Action items identified
      6. Main topics discussed
      7. Call metrics analysis including:
         - Talk-to-listen ratio (if identifiable)
         - Number of questions asked
         - Number of objections raised
         - Whether next steps were clearly defined
      
      ${metadata.contactName ? `The call is with ${metadata.contactName}.` : ''}
      
      Format the response as a JSON object with the following structure:
      {
        "transcription": "full transcription text",
        "summary": "executive summary",
        "sentiment": "positive/neutral/negative",
        "keyPoints": ["point 1", "point 2"],
        "actionItems": ["action 1", "action 2"],
        "topics": ["topic 1", "topic 2"],
        "callMetrics": {
          "talkToListenRatio": 0.6,
          "questionCount": 5,
          "objectionCount": 2,
          "nextStepsIdentified": true
        }
      }
    `;

    // Send to Gemini for analysis
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: formData.file.mimeType || 'audio/mp3',
          data: Buffer.from(formData.file.data).toString('base64')
        }
      },
      prompt
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    let analysisResult: any;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // Fallback: create a basic result from the text
      analysisResult = {
        transcription: text,
        summary: 'Analysis completed but structured data extraction failed',
        sentiment: 'neutral',
        keyPoints: [],
        actionItems: [],
        topics: [],
        callMetrics: {}
      };
    }

    // Store the recording metadata in Supabase
    const { data: recordingData, error: dbError } = await supabase
      .from('call_recordings')
      .insert({
        contact_id: metadata.contactId,
        practice_id: metadata.practiceId,
        user_id: metadata.userId,
        source: metadata.source,
        external_id: metadata.externalId,
        file_name: metadata.fileName,
        file_size: metadata.fileSize,
        duration: 0, // Will be updated if we can extract from audio
        status: 'analyzed',
        transcription: analysisResult.transcription,
        analysis_results: analysisResult,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to save recording metadata' })
      };
    }

    // Upload the audio file to Supabase Storage
    const filePath = `external-recordings/${recordingData.id}-${metadata.fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('call_recordings')
      .upload(filePath, formData.file.data, {
        contentType: formData.file.mimeType || 'audio/mp3'
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      // Don't fail the whole operation if storage upload fails
    } else {
      // Update the record with the storage path
      await supabase
        .from('call_recordings')
        .update({ storage_path: filePath })
        .eq('id', recordingData.id);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        data: analysisResult,
        recordingId: recordingData.id
      })
    };

  } catch (error) {
    console.error('Error processing external recording:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      })
    };
  }
};

// Helper function to parse multipart form data
function parseMultipartFormData(body: string, boundary: string): {
  fields: Record<string, string>;
  file?: {
    filename: string;
    mimeType: string;
    data: Buffer;
  };
} {
  const parts = body.split(`--${boundary}`);
  const fields: Record<string, string> = {};
  let file: any = null;

  for (const part of parts) {
    if (part.includes('Content-Disposition')) {
      const nameMatch = part.match(/name="([^"]+)"/);
      const filenameMatch = part.match(/filename="([^"]+)"/);
      
      if (nameMatch) {
        const fieldName = nameMatch[1];
        
        if (filenameMatch) {
          // This is a file field
          const filename = filenameMatch[1];
          const mimeTypeMatch = part.match(/Content-Type: ([^\r\n]+)/);
          const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'application/octet-stream';
          
          // Extract the file data (after double newline)
          const dataStart = part.indexOf('\r\n\r\n') + 4;
          const dataEnd = part.lastIndexOf('\r\n');
          const data = Buffer.from(part.substring(dataStart, dataEnd), 'binary');
          
          file = { filename, mimeType, data };
        } else {
          // This is a regular field
          const valueStart = part.indexOf('\r\n\r\n') + 4;
          const valueEnd = part.lastIndexOf('\r\n');
          const value = part.substring(valueStart, valueEnd).trim();
          
          fields[fieldName] = value;
        }
      }
    }
  }

  return { fields, file };
}