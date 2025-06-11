# PLAUD Recording Integration

This document describes the external recording integration for uploading PLAUD and other external recordings to the CRM.

## Overview

The integration allows you to upload external audio recordings (from PLAUD devices or other sources) directly to the CRM. These recordings are automatically processed through Google Gemini 2.5 Pro for transcription and analysis, then stored alongside Twilio call recordings.

## Features

- **Multi-source Support**: Upload recordings from PLAUD devices, manual recordings, or other sources
- **Automatic Processing**: Uses Gemini 2.5 Pro for transcription and analysis
- **Unified View**: External recordings appear alongside Twilio calls in the call history
- **Analysis Results**: Get summaries, key points, action items, and sentiment analysis
- **File Support**: MP3, WAV, M4A, and WebM formats up to 100MB

## Setup

### 1. Environment Variables

Add the following to your `.env` file:

```
GEMINI_API_KEY=your_google_gemini_api_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Database Migration

Run the database migration to add external recording support:

```sql
-- Apply the migration at:
-- src/services/supabase/migrations/update_call_recordings_external_sources.sql
```

### 3. Deploy

Deploy to Netlify. The upload function is automatically included.

## Usage

1. Navigate to any contact detail page
2. Click "Upload Recording" in the Call History section
3. Select your audio file
4. Choose the recording source (PLAUD, Manual, Other)
5. Add optional notes or external ID
6. Click "Upload & Analyze"

The recording will be processed and appear in the call history with transcription and analysis results.

## Technical Details

### Components
- `ExternalRecordingUpload.tsx`: Upload interface component
- `geminiService.ts`: Service for Gemini integration
- `CallHistory.tsx`: Updated to show all recording sources

### Netlify Function
- `upload-external-recording.ts`: Handles file upload and Gemini processing

### Database Schema Updates
- Added `source` column for recording origin
- Added `external_id` for external references
- Added `file_name` and `file_size` for uploads
- Added `transcription` for full text
- Made Twilio fields nullable for external recordings