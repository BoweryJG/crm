# Environment Setup

This project requires environment variables to be set up properly for both local development and production deployment.

## Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your actual credentials:
   - `REACT_APP_SUPABASE_URL`: Your Supabase project URL
   - `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - Other service credentials as needed

## Production Deployment (Netlify)

For production deployment on Netlify, you must set environment variables in the Netlify dashboard:

1. Go to your Netlify site dashboard
2. Navigate to Site Settings > Environment Variables
3. Add the following variables with your production values:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
   - `REACT_APP_BACKEND_URL`
   - All other variables from `.env.example`

**Important**: Never commit `.env` or `.env.local` files to version control. They contain sensitive credentials.

## Required Environment Variables

See `.env.example` for a complete list of required environment variables and their expected format.