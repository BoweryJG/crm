# PLAUD Recording Integration

This document describes the external recording integration for uploading PLAUD and other external recordings to the CRM.

## Overview

The integration allows you to upload external audio recordings (from PLAUD devices or other sources) directly to the CRM. These recordings are automatically processed through a backend API service for transcription and analysis, then stored alongside Twilio call recordings.

## Features

- **Multi-source Support**: Upload recordings from PLAUD devices, manual recordings, or other sources
- **Flexible AI Providers**: Choose between OpenAI (Whisper) and Gemini for transcription
- **Advanced Analysis**: Choose between OpenAI (GPT-4) and Gemini for call analysis
- **Unified View**: External recordings appear alongside Twilio calls in the call history
- **Analysis Results**: Get summaries, key points, action items, and sentiment analysis
- **File Support**: MP3, WAV, M4A, and WebM formats up to 100MB
- **Enhanced Error Handling**: Robust error reporting and recovery
- **Backend Processing**: Reliable processing through dedicated backend API

## Setup

### 1. Environment Variables

Add the following to your `.env.local` file:

```
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

The backend API should be configured with:
- OpenAI API key (for Whisper transcription and GPT-4 analysis)
- Gemini API key (for Gemini transcription and analysis)
- Supabase credentials for database storage

### 2. Backend API

The application now uses a dedicated backend API service instead of Netlify functions. The backend provides:
- Multiple AI provider support (OpenAI and Gemini)
- Better error handling and retry logic
- Improved performance and reliability
- Centralized API key management

Ensure your backend API is running and accessible at the URL specified in `REACT_APP_BACKEND_URL`.

### 3. Database Migration

The database schema should already support external recordings. If not, run:

```sql
-- Apply the migration at:
-- src/services/supabase/migrations/update_call_recordings_external_sources.sql
```

## Usage

1. Navigate to any contact detail page
2. Click "Upload Recording" in the Call History section
3. Select your audio file (MP3, WAV, M4A, or WebM)
4. Choose the recording source (PLAUD, Manual, Other)
5. Select AI providers:
   - **Transcription Provider**: Choose between OpenAI Whisper or Gemini
   - **Analysis Provider**: Choose between GPT-4 or Gemini
6. Add optional notes or external ID
7. Click "Upload & Analyze"

The recording will be processed through the backend API and appear in the call history with transcription and analysis results.

## Technical Details

### Components
- `ExternalRecordingUpload.tsx`: Upload interface component with AI provider selection
- `geminiService.ts`: Service layer for backend API integration
- `CallHistory.tsx`: Displays all recording sources in unified view

### Backend API Integration
The application now communicates with a backend API service at the endpoint configured in `REACT_APP_BACKEND_URL`. The backend handles:
- File upload and storage
- AI provider integration (OpenAI and Gemini)
- Database operations
- Error handling and retries

### API Endpoint
- `POST /api/upload-external-recording`: Handles file upload and AI processing
  - Accepts multipart form data
  - Supports provider selection for transcription and analysis
  - Returns processed results and recording ID

### Database Schema
- `source` column: Recording origin (plaud/manual/other)
- `external_id`: External reference ID
- `file_name` and `file_size`: Upload metadata
- `transcription`: Full transcription text
- `analysis_results`: JSON object with analysis data
- Twilio fields are nullable for external recordings

### Error Handling
The backend API provides comprehensive error handling:
- File validation (type and size)
- AI provider failures with fallback options
- Database transaction management
- Detailed error messages for troubleshooting