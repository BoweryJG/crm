# Deploying Twilio Browser-Based Calling to Production

This guide explains how to properly deploy your Twilio browser-based calling setup to your production environment using your existing Netlify functions and Render backend.

## Step 1: Update Your TwiML App Voice URL

After running the `./setup-twilio-calling.sh` script, you need to update your TwiML App's Voice URL to point to your Netlify function:

1. Log in to the [Twilio Console](https://www.twilio.com/console)
2. Navigate to "Voice & Video" → "TwiML Apps"
3. Find and click on the app named "SphereOS Browser Calling"
4. Change the Voice URL to:
   ```
   https://your-app-url.netlify.app/.netlify/functions/initiate-twilio-call/voice
   ```
5. Click "Save"

## Step 2: Verify Environment Variables

Ensure your `.env.local` file contains all required Twilio variables:

```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_TWIML_APP_SID=your_twiml_app_sid
TWILIO_API_KEY=your_api_key
TWILIO_API_SECRET=your_api_secret
```

## Step 3: Configure Your Netlify Deployment

Make sure these same environment variables are configured in your Netlify project:

1. Go to your Netlify site dashboard
2. Navigate to "Site settings" → "Environment variables"
3. Add all the Twilio variables from Step 2
4. Trigger a new deployment to apply the changes

## Step 4: Test Your Production Setup

1. Visit your deployed Netlify site
2. Test making calls from the browser to verify the setup works correctly

## Connecting to Your Render Backend

To integrate with your Render backend at `https://spheres-consolidated-backend.onrender.com`:

1. Update your Render `render.yaml` to include the Twilio environment variables:

```yaml
services:
  - type: web
    name: spheres-consolidated-backend
    env: node
    buildCommand: npm install
    startCommand: node index.js
    envVars:
      - key: TWILIO_ACCOUNT_SID
        sync: false
      - key: TWILIO_AUTH_TOKEN
        sync: false
      - key: TWILIO_PHONE_NUMBER
        sync: false
      - key: TWILIO_TWIML_APP_SID
        sync: false
      - key: TWILIO_API_KEY
        sync: false
      - key: TWILIO_API_SECRET
        sync: false
      # Your existing environment variables here
```

2. Add these environment variables in the Render dashboard for your service

3. Update the Twilio service in your backend to handle browser-based calling:
   - Modify the existing twilio_service.js to support token generation
   - Add endpoints for voice TwiML rendering

## Important Notes

1. Your browser-based calling uses Netlify Functions for token generation and TwiML
2. Your backend on Render can be used for call records, analytics, and other server-side operations
3. Never expose your TWILIO_AUTH_TOKEN or TWILIO_API_SECRET to the client side

If you need to record calls, transcribe calls, or perform other advanced Twilio functions, implement those in your Render backend and configure the TwiML responses to use those endpoints.
