# Backend API Migration Guide

This guide explains the migration from Netlify functions to the backend API for external recording processing.

## Overview

The SphereOsCrM has been updated to use a dedicated backend API service for processing external recordings (PLAUD, manual recordings, etc.) instead of Netlify functions. This provides better reliability, performance, and flexibility.

## What Changed

### Removed
- **Netlify Function**: `/netlify/functions/upload-external-recording.ts` has been removed

### Updated
- **geminiService.ts**: Now calls the backend API instead of Netlify function
- **ExternalRecordingUpload.tsx**: Added AI provider selection UI
- **Environment Configuration**: Uses `REACT_APP_BACKEND_URL` for backend endpoint

### New Features
- Choice of transcription provider (OpenAI Whisper or Gemini)
- Choice of analysis provider (GPT-4 or Gemini)
- Better error handling and retry logic
- More comprehensive response data

## Migration Steps

1. **Set Environment Variable**
   Add to your `.env.local`:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-api-url.com
   ```

2. **Deploy Backend API**
   Ensure your backend API is deployed and running with:
   - OpenAI API key configured
   - Gemini API key configured
   - Supabase credentials configured
   - Endpoint `/api/upload-external-recording` available

3. **Update Frontend**
   Pull the latest changes and rebuild:
   ```bash
   git pull
   npm install
   npm run build
   ```

4. **Test the Integration**
   - Navigate to a contact detail page
   - Click "Upload Recording"
   - Select an audio file
   - Choose your preferred AI providers
   - Verify successful upload and analysis

## Backend API Requirements

Your backend API should implement the `/api/upload-external-recording` endpoint with:

### Request
- Method: `POST`
- Content-Type: `multipart/form-data`
- Fields:
  - `file`: Audio file (required)
  - `contactId`: Contact ID (optional)
  - `contactName`: Contact name (optional)
  - `practiceId`: Practice ID (optional)
  - `userId`: User ID (required)
  - `source`: Recording source (plaud/manual/other)
  - `externalId`: External reference ID (optional)
  - `transcriptionProvider`: AI provider for transcription (openai/gemini)
  - `analysisProvider`: AI provider for analysis (openai/gemini)

### Response
```json
{
  "success": true,
  "data": {
    "recordingId": "uuid",
    "analysis": {
      "transcription": "Full transcription text",
      "summary": "Executive summary",
      "sentiment": "positive/neutral/negative",
      "keyPoints": ["point1", "point2"],
      "actionItems": ["action1", "action2"],
      "topics": ["topic1", "topic2"],
      "callMetrics": {
        "talkToListenRatio": 0.6,
        "questionCount": 5,
        "objectionCount": 2,
        "nextStepsIdentified": true
      }
    }
  }
}
```

## Rollback Instructions

If you need to rollback to using Netlify functions:

1. Restore the Netlify function from git history
2. Update `geminiService.ts` to use the Netlify function URL
3. Remove provider selection from `ExternalRecordingUpload.tsx`
4. Redeploy to Netlify

## Support

For questions or issues with the migration, please refer to:
- Backend API documentation
- `/docs/PLAUD_INTEGRATION.md` for updated integration details