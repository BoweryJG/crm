// Check current auth state in browser
// Run this in the browser console after attempting to login

const checkAuthState = async () => {
  // Check localStorage for Supabase auth
  const authKeys = Object.keys(localStorage).filter(key => key.includes('supabase'));
  console.log('Supabase auth keys in localStorage:', authKeys);
  
  authKeys.forEach(key => {
    const value = localStorage.getItem(key);
    console.log(`${key}:`, value);
  });
  
  // Check if there's a session
  const sessionKey = authKeys.find(key => key.includes('auth-token'));
  if (sessionKey) {
    try {
      const session = JSON.parse(localStorage.getItem(sessionKey) || '{}');
      console.log('Current session:', session);
      console.log('User:', session.user);
    } catch (e) {
      console.log('Could not parse session');
    }
  }
  
  // Check URL for any OAuth fragments
  console.log('Current URL:', window.location.href);
  console.log('Hash:', window.location.hash);
  console.log('Search params:', window.location.search);
};

checkAuthState();