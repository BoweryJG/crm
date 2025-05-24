# Twilio Setup Guide for Browser-Based Calling

This guide will walk you through setting up Twilio for browser-based calling from scratch, including creating a TwiML app which is required for browser-based calling functionality.

## Step 1: Create a TwiML App

A TwiML App is required for browser-based calling. It connects your Twilio phone number to your application code.

1. Log in to your [Twilio Console](https://www.twilio.com/console)
2. Navigate to the left sidebar menu and find **Explore Products** > **Voice** > **TwiML Apps**
3. Click the **Create new TwiML App** button
4. Fill in the form:
   - **Friendly name**: `SphereOS Browser Calling`
   - **Voice**: 
     - **Request URL**: You can temporarily use `https://demo.twilio.com/welcome/voice/` for testing
     - **Method**: `POST`
   - Leave all other fields at their default settings
5. Click **Create**
6. After creation, you'll see your new TwiML App. Make note of the **SID** - you'll need this for your .env file

## Step 2: Update Your Environment Variables

Add the following variables to your `.env.local` file:

```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_API_KEY=your_api_key
TWILIO_API_SECRET=your_api_secret
TWILIO_TWIML_APP_SID=your_twiml_app_sid_from_step_1
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### Getting Your API Key & Secret

If you don't have API Key and Secret yet:

1. In the Twilio Console, go to **Account** > **API keys & tokens**
2. Click **Create API Key**
3. Name it `SphereOS Browser Calling`
4. Set the key type to `Standard`
5. Click **Create API Key**
6. Make sure to copy both the **SID** (this is your API Key) and **Secret** right away - you won't be able to see the Secret again!

## Step 3: Configure Your Twilio Phone Number

To enable browser-based calling:

1. Go to **Phone Numbers** > **Manage** > **Active numbers**
2. Click on your Twilio phone number
3. Scroll down to the **Voice & Fax** section
4. For **A CALL COMES IN**, select **TwiML App** from the dropdown
5. Select the TwiML App you created in Step 1
6. Click **Save**

## Step 4: Update Your TwiML App URL

Once your application is deployed (or if you're using a tunneling service like ngrok for local development):

1. Go back to **Voice** > **TwiML Apps**
2. Click on your TwiML App
3. Update the **Voice Request URL** to point to your application's Twilio function:
   - If deployed: `https://your-app-url.netlify.app/.netlify/functions/initiate-twilio-call/voice`
   - If using ngrok: `https://your-ngrok-url.ngrok.io/.netlify/functions/initiate-twilio-call/voice`
4. Make sure the method is set to `POST`
5. Save your changes

## Testing Your Setup

Once everything is configured:

1. Run `node test_browser_calling.js` to verify your configuration
2. Open `test_phone_call.html` in your browser to test a browser-based call
3. Call your Twilio phone number from another phone to test incoming calls

## Troubleshooting

If you encounter issues:

1. Verify all environment variables are correctly set
2. Check that your TwiML App's Voice URL is properly configured
3. Ensure your phone number is configured to use your TwiML App
4. Look at the browser console and server logs for any error messages
5. Make sure your browser has permission to access your microphone
