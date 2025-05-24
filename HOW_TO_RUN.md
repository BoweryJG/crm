# Quick Start - How to Run the Twilio Setup

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

## What Does the Setup Script Do?

The setup script will:
1. Create a TwiML App in your Twilio account
2. Configure your Twilio phone number to use that TwiML App
3. Generate API keys needed for browser-based calling
4. Update your .env.local file with all the necessary credentials

## Testing the Setup

After running the setup, you can verify everything works by:

1. Run the test script:
   ```
   node test_browser_calling.js
   ```

2. Test the browser calling by opening:
   ```
   open test_phone_call.html
   ```

No need to manually configure anything in the Twilio console!
