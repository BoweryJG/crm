# Supabase Authentication Fix

## Problem
After OAuth login, you're being redirected back to the homepage instead of staying logged in.

## Debugging Steps Added
1. Added console logs to track auth state changes
2. Fixed redirect URL to use current origin (handles different ports)
3. Added OAuth response logging

## Check These in Browser Console:
1. Open Developer Tools (F12)
2. Try to login
3. Look for these console messages:
   - "Current app URL for OAuth redirect: ..."
   - "OAuth sign in - redirect URL: ..."
   - "OAuth response: ..."
   - "Initial auth check: ..."
   - "Auth state changed: ..."

## IMPORTANT: Supabase Dashboard Configuration

You MUST add your redirect URL to Supabase:

1. Go to https://app.supabase.com/project/cbopynuvhcymbumjnvay/auth/url-configuration
2. In the "Redirect URLs" section, add these URLs:
   - http://localhost:3000/
   - http://localhost:3001/
   - http://localhost:3002/
   - http://localhost:5173/
   - http://localhost:5174/
   - If you're using a different port, add that too

3. Make sure to click "Save" after adding the URLs

## Testing After Fix:
1. Clear your browser's localStorage: 
   ```javascript
   // Run in browser console
   Object.keys(localStorage).filter(k => k.includes('supabase')).forEach(k => localStorage.removeItem(k));
   ```

2. Try logging in again

3. Check the console for the debug messages

## If Still Not Working:
The console logs will tell us:
- What redirect URL is being used
- If Supabase is receiving the auth callback
- If the session is being created

Share the console output and we can fix the specific issue.