/**
 * Simple Auth - A dead simple auth solution for RepSpheres
 * No complex cross-domain messaging, just simple checks
 */

import { supabase } from '../auth/supabase';

export const simpleAuth = {
  /**
   * Check if user is logged in (no redirects, just returns true/false)
   */
  isLoggedIn: async () => {
    try {
      // Check localStorage first (fastest)
      const localAuth = localStorage.getItem('repspheres-auth');
      if (!localAuth) return false;
      
      // Verify with Supabase (but don't wait too long)
      const timeout = new Promise((resolve) => setTimeout(() => resolve(false), 2000));
      const checkAuth = supabase.auth.getSession().then(({ data }) => !!data.session);
      
      return await Promise.race([checkAuth, timeout]);
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },

  /**
   * Get current user (returns null if not logged in)
   */
  getUser: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user || null;
    } catch (error) {
      return null;
    }
  },

  /**
   * Require auth - redirects to login if not authenticated
   */
  requireAuth: async () => {
    const loggedIn = await simpleAuth.isLoggedIn();
    
    // Don't redirect if already on login page
    if (!loggedIn && !window.location.pathname.includes('/login')) {
      const currentUrl = window.location.href;
      window.location.href = `https://repspheres.com/login?redirect=${encodeURIComponent(currentUrl)}`;
      return false;
    }
    
    return loggedIn;
  },

  /**
   * Login with redirect URL
   */
  loginWithRedirect: (redirectUrl) => {
    window.location.href = `https://repspheres.com/login?redirect=${encodeURIComponent(redirectUrl)}`;
  },

  /**
   * Simple navigation to another app
   */
  goToApp: (appUrl) => {
    // Just go there - let the app handle its own auth
    window.location.href = appUrl;
  },

  /**
   * Handle redirect after login
   */
  handleLoginRedirect: () => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    
    if (redirect) {
      // Validate it's a RepSpheres domain
      if (redirect.includes('repspheres.com') || redirect.startsWith('/')) {
        window.location.href = decodeURIComponent(redirect);
        return true;
      }
    }
    
    return false;
  },

  /**
   * Clear everything when there's a problem
   */
  reset: () => {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach(c => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.repspheres.com`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    
    console.log('Auth reset complete');
  },

  /**
   * Debug info
   */
  debug: async () => {
    const loggedIn = await simpleAuth.isLoggedIn();
    const user = await simpleAuth.getUser();
    const localAuth = localStorage.getItem('repspheres-auth');
    
    console.log('=== Simple Auth Debug ===');
    console.log('Logged in:', loggedIn);
    console.log('User:', user?.email || 'none');
    console.log('Local storage:', !!localAuth);
    console.log('Current URL:', window.location.href);
    console.log('Cookies:', document.cookie);
    console.log('========================');
    
    return { loggedIn, user, localAuth: !!localAuth };
  }
};

// Export as default too
export default simpleAuth;