/**
 * Gmail OAuth Service
 * 
 * This service handles Gmail-specific OAuth authentication separately from the main auth system.
 * It's used only for Gmail API access, not for primary user authentication.
 */

export class GmailOAuthService {
  private static GMAIL_SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.modify'
  ];

  private static GMAIL_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
  private static GMAIL_REDIRECT_URI = `${window.location.origin}/gmail-auth-callback`;

  /**
   * Get the current user's email from the main auth system
   */
  private static getCurrentUserEmail(): string | null {
    return localStorage.getItem('crm_user_email');
  }

  /**
   * Generate a unique storage key for Gmail tokens based on user email
   */
  private static getTokenStorageKey(email: string): string {
    return `gmail_tokens_${email}`;
  }

  /**
   * Check if Gmail is authorized for the current user
   */
  static async isGmailAuthorized(): Promise<boolean> {
    const userEmail = this.getCurrentUserEmail();
    if (!userEmail) return false;

    const tokenKey = this.getTokenStorageKey(userEmail);
    const tokens = localStorage.getItem(tokenKey);
    
    if (!tokens) return false;

    try {
      const parsed = JSON.parse(tokens);
      // Check if access token exists and is not expired
      if (parsed.access_token && parsed.expires_at) {
        const expiresAt = new Date(parsed.expires_at);
        return expiresAt > new Date();
      }
    } catch {
      return false;
    }

    return false;
  }

  /**
   * Start Gmail OAuth flow
   */
  static async authorizeGmail(): Promise<void> {
    const userEmail = this.getCurrentUserEmail();
    if (!userEmail) {
      throw new Error('User must be logged in to authorize Gmail access');
    }

    // Create OAuth URL
    const params = new URLSearchParams({
      client_id: this.GMAIL_CLIENT_ID,
      redirect_uri: this.GMAIL_REDIRECT_URI,
      response_type: 'token',
      scope: this.GMAIL_SCOPES.join(' '),
      login_hint: userEmail, // Pre-fill the email
      access_type: 'offline',
      prompt: 'consent'
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    
    // Store state for callback
    sessionStorage.setItem('gmail_auth_state', JSON.stringify({
      userEmail,
      timestamp: Date.now()
    }));

    // Redirect to Google OAuth
    window.location.href = authUrl;
  }

  /**
   * Handle OAuth callback and store tokens
   */
  static async handleGmailCallback(): Promise<void> {
    // Parse tokens from URL hash
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    
    const accessToken = params.get('access_token');
    const expiresIn = params.get('expires_in');
    
    if (!accessToken) {
      throw new Error('No access token received from Google');
    }

    // Get state from session
    const stateStr = sessionStorage.getItem('gmail_auth_state');
    if (!stateStr) {
      throw new Error('Invalid OAuth state');
    }

    const state = JSON.parse(stateStr);
    const userEmail = state.userEmail;

    // Calculate expiration time
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + parseInt(expiresIn || '3600'));

    // Store tokens with user-specific key
    const tokenKey = this.getTokenStorageKey(userEmail);
    const tokenData = {
      access_token: accessToken,
      expires_at: expiresAt.toISOString(),
      authorized_at: new Date().toISOString(),
      scopes: this.GMAIL_SCOPES
    };

    localStorage.setItem(tokenKey, JSON.stringify(tokenData));
    sessionStorage.removeItem('gmail_auth_state');
  }

  /**
   * Get Gmail access token for API calls
   */
  static async getAccessToken(): Promise<string | null> {
    const userEmail = this.getCurrentUserEmail();
    if (!userEmail) return null;

    const tokenKey = this.getTokenStorageKey(userEmail);
    const tokensStr = localStorage.getItem(tokenKey);
    
    if (!tokensStr) return null;

    try {
      const tokens = JSON.parse(tokensStr);
      
      // Check if token is still valid
      if (tokens.expires_at) {
        const expiresAt = new Date(tokens.expires_at);
        if (expiresAt > new Date()) {
          return tokens.access_token;
        }
      }
      
      // Token expired, need to re-authorize
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Revoke Gmail access for the current user
   */
  static async revokeGmailAccess(): Promise<void> {
    const userEmail = this.getCurrentUserEmail();
    if (!userEmail) return;

    const tokenKey = this.getTokenStorageKey(userEmail);
    const tokensStr = localStorage.getItem(tokenKey);
    
    if (tokensStr) {
      try {
        const tokens = JSON.parse(tokensStr);
        
        // Revoke token with Google
        if (tokens.access_token) {
          await fetch(`https://oauth2.googleapis.com/revoke?token=${tokens.access_token}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
        }
      } catch (error) {
        console.error('Error revoking Gmail token:', error);
      }
    }

    // Remove stored tokens
    localStorage.removeItem(tokenKey);
  }

  /**
   * Get authorization headers for Gmail API calls
   */
  static async getAuthHeaders(): Promise<Record<string, string> | null> {
    const token = await this.getAccessToken();
    if (!token) return null;

    return {
      'Authorization': `Bearer ${token}`
    };
  }
}