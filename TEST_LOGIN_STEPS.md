# Test Login Steps

## 1. Clear Browser Data
Open browser console (F12) and run:
```javascript
// Clear all Supabase data
Object.keys(localStorage).filter(k => k.includes('supabase')).forEach(k => {
    console.log('Removing:', k);
    localStorage.removeItem(k);
});
console.log('Storage cleared!');
```

## 2. Start Your App
```bash
npm start
```

## 3. Open Browser Console
Keep the console open to see debug messages

## 4. Try to Login
1. Go to http://localhost:3000/login (or just http://localhost:3000)
2. Click "Continue with Google" or "Continue with Facebook"
3. Complete the OAuth flow

## 5. Watch for These Console Messages:
- "Current app URL for OAuth redirect: http://localhost:3000"
- "OAuth sign in - redirect URL: http://localhost:3000/"
- "OAuth response: {data: {...}, error: null}"
- "Auth state changed: SIGNED_IN [your-email]"
- "Dashboard - Auth state: {user: '[your-email]', authLoading: false}"

## 6. Expected Behavior:
After successful OAuth login, you should:
1. Be redirected back to your app
2. See the Dashboard with "Welcome back, [your name]"
3. NOT be redirected back to the login page

## If Still Having Issues:
Share the console output, especially:
- Any error messages
- The final URL you end up at
- Whether you see the "Auth state changed" message