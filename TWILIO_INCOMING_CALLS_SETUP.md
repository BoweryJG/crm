# Setting Up Twilio for Incoming Browser-Based Calls

This guide explains how to configure your Twilio account to receive incoming calls in the browser through our application.

## Step 1: Configure Your TwiML App

For browser-based calling to work properly, you need to properly configure your Twilio TwiML App:

1. Log in to your [Twilio Console](https://www.twilio.com/console)
2. Navigate to **Phone Numbers** → **TwiML Apps**
3. Find and click on the TwiML App you're using (the one whose SID is in your `.env.local` file as `TWILIO_TWIML_APP_SID`)
4. Update the configuration:
   - **Voice**: Request URL: `https://your-app-url.netlify.app/.netlify/functions/initiate-twilio-call/voice`
   - Set the HTTP Method to `POST`
   - For the fallback URL (optional), you can use the same URL

![TwiML App Configuration](https://www.twilio.com/docs/static/img/twiml-app-create-setting.width-800.png)

## Step 2: Configure Your Twilio Phone Number

To receive incoming calls to your Twilio number that will ring in the browser:

1. Go to **Phone Numbers** → **Active Numbers** in the Twilio Console
2. Click on your Twilio phone number (the one set as `TWILIO_PHONE_NUMBER` in your environment variables)
3. Scroll down to the **Voice & Fax** section
4. For **A CALL COMES IN**, select **TwiML App** from the dropdown
5. Select the TwiML App you configured in Step 1
6. Click **Save**

## Step 3: Testing Incoming Calls

To test incoming calls:

1. Make sure your app is running and you've initialized the Twilio device by visiting a page with the `QuickCallWidget` 
2. Call your Twilio phone number from any phone
3. The call should ring in your browser
4. If you've opened multiple browser tabs/devices with the app, the call will ring on all of them

## Troubleshooting

If incoming calls aren't working:

1. **Check browser console logs** for any errors related to Twilio
2. **Check Netlify Function logs** for any errors in the `/voice` endpoint processing
3. **Verify your Twilio phone number configuration** is pointing to the TwiML App
4. **Verify the TwiML App configuration** is pointing to your Netlify function URL
5. **Test with the standalone test page** (`test_phone_call.html`) to isolate issues
6. **Ensure your browser has microphone permissions** enabled for your site

## Advanced Configuration

For production environments, you may want to implement more sophisticated routing:

- Route calls to specific users based on their identity
- Implement a call queue if no users are available
- Set up voicemail functionality for missed calls

See the [Twilio Client Documentation](https://www.twilio.com/docs/voice/client/javascript) for more advanced features.
