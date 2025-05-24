# How to Get a New Twilio API Secret

If you didn't save your API Secret when you first ran the setup script, or need to generate a new one, follow these steps:

## Option 1: Run the Setup Script Again

The simplest approach is to run the setup script again, which will create a new API key/secret pair:

```bash
./setup-twilio-calling.sh
```

When the script runs, it will display the new API secret. Copy it immediately as it's only shown once.

## Option 2: Create a New API Key/Secret Manually in Twilio Console

1. Log in to the [Twilio Console](https://www.twilio.com/console)
2. Navigate to Account > API keys & tokens (Settings > API Keys)
3. Click "Create API Key"
4. Enter a friendly name (e.g., "SphereOS Browser Calling")
5. Select "Standard" for Key Type
6. Click "Create API Key"
7. **IMPORTANT**: Copy the displayed API Secret immediately - it will only be shown once!
8. Save the SID (starts with "SK") as your TWILIO_API_KEY
9. Save the Secret as your TWILIO_API_SECRET

Update your `.env.local` file with these new values:

```
TWILIO_API_KEY=SK1234567890abcdef1234567890abcdef
TWILIO_API_SECRET=your_new_api_secret
```

## Important Notes

- The API Secret is only displayed once when created and cannot be retrieved later
- If you lose your API Secret, you must create a new API Key/Secret pair
- You can have multiple active API keys for your Twilio account
- Old API keys can be revoked in the Twilio Console if needed

For security, never share your API Secret and only store it in secure environment variables.
