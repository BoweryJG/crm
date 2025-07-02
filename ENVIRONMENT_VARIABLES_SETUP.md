# Environment Variables Setup Guide

This guide explains how to properly set up environment variables for the CRM application.

## Overview

All hardcoded Supabase credentials have been removed from the codebase. The application now requires environment variables to be properly configured.

## Required Environment Variables

### Supabase Configuration (REQUIRED)

These are the minimum required environment variables for the application to function:

```bash
# Your Supabase project URL
REACT_APP_SUPABASE_URL=https://your-project.supabase.co

# Your Supabase anonymous key (public key)
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

## Setup Instructions

### 1. Local Development

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```bash
   REACT_APP_SUPABASE_URL=https://cbopynuvhcymbumjnvay.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```

3. Restart your development server:
   ```bash
   npm start
   ```

### 2. Production (Netlify)

1. Go to your Netlify dashboard
2. Navigate to Site Settings → Environment Variables
3. Add the following variables:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

### 3. Other Environments

For other deployment environments, ensure these environment variables are set according to your platform's documentation.

## Getting Your Supabase Credentials

1. Log in to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Find:
   - **Project URL**: This is your `REACT_APP_SUPABASE_URL`
   - **Anon/Public Key**: This is your `REACT_APP_SUPABASE_ANON_KEY`

## Validation

The application will now validate that these environment variables are set on startup. If they're missing, you'll see error messages in the console:

```
Missing Supabase environment variables. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file
```

## Security Notes

- Never commit `.env.local` or any file containing actual credentials to Git
- The `.env.example` file should only contain placeholder values
- Use different credentials for development and production environments
- The anon key is safe to expose in client-side code, but never expose service keys

## Troubleshooting

If you're experiencing issues:

1. Ensure environment variables are properly set
2. Check that there are no spaces around the `=` sign in your `.env` file
3. Restart your development server after changing environment variables
4. Clear your browser's localStorage if you're having authentication issues:
   ```javascript
   Object.keys(localStorage).filter(k => k.includes('supabase')).forEach(k => localStorage.removeItem(k));
   ```

## Files Updated

The following files have been updated to use environment variables instead of hardcoded values:

- `/src/services/supabase/supabase.ts`
- `/src/auth/supabase.ts`
- `/src/App.tsx`
- `/src/suis/services/suisConfigService.ts`
- `/src/scripts/setupApiKeys.ts`
- `/scripts/simpleImportPractices.js`
- `/scripts/importPracticesFromCSV.js`
- `/scripts/checkPracticesSchema.js`
- `/debug-contacts.js`
- `/test-auth-flow.html`
- `/NETLIFY_ENV_SETUP.md`
- `/CURRENT_LOGIN_STATUS.md`
- `/.env.example`