# Quick Start - How to Run the Twilio Setup

## Initial Setup

1. Open Terminal
2. Navigate to project folder: 
   ```
   cd /Users/jasonsmacbookpro2022/CascadeProjects/SphereOsCrM
   ```
3. Run the setup script: 
   ```
   ./setup-twilio-calling.sh
   ```
4. Follow the on-screen prompts

This will automatically set up everything needed for browser-based calling.

## Running the Local Test Server (Recommended)

After running the setup script:

1. Start the local test server:
   ```
   node local_test_server.js
   ```

2. Open the test page in your browser:
   ```
   open http://localhost:3000/test_phone_call.html
   ```

3. Click "Get Twilio Token" and test making/receiving calls

The local server handles token generation and call routing without needing Netlify functions.

## What Does the Setup Script Do?

The setup script will:
1. Create a TwiML App in your Twilio account
2. Configure your Twilio phone number to use that TwiML App
3. Generate API keys needed for browser-based calling
4. Update your .env.local file with all the necessary credentials

## Testing Options

There are two ways to test your setup:

1. **Using the Local Server (Recommended)**:
   ```
   node local_test_server.js
   open http://localhost:3000/test_phone_call.html
   ```
   This runs everything locally without needing deployment.

2. **Using the CLI Test Script**:
   ```
   node test_browser_calling.js
   ```
   This checks if your configuration is valid but doesn't test actual calling.

No need to manually configure anything in the Twilio console!

## Deploying to Production

When deploying to production:

1. Update your TwiML App's Voice URL in the Twilio console to point to your deployed function:
   ```
   https://your-app-domain.netlify.app/.netlify/functions/initiate-twilio-call/voice
   ```

2. In your production code, use the Netlify function endpoint for token generation:
   ```
   /.netlify/functions/initiate-twilio-call/token
   ```
