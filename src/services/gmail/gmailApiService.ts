// Browser-compatible Gmail API service using REST API calls

export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  historyId: string;
  internalDate: string;
  payload: {
    partId: string;
    mimeType: string;
    filename: string;
    headers: Array<{
      name: string;
      value: string;
    }>;
    body: {
      attachmentId?: string;
      size: number;
      data?: string;
    };
    parts?: any[];
  };
  sizeEstimate: number;
  labelIds: string[];
}

export interface ParsedEmailMessage {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  date: string;
  snippet: string;
  body: string;
  isHtml: boolean;
  attachments: Array<{
    filename: string;
    mimeType: string;
    size: number;
    attachmentId: string;
  }>;
  labelIds: string[];
  isRead: boolean;
  isImportant: boolean;
  isStarred: boolean;
}

interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
  expires_at: number;
}

class GmailApiService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number = 0;
  private isInitialized = false;

  constructor() {
    this.loadStoredTokens();
  }

  /**
   * Get the Gmail OAuth redirect URI based on current environment
   */
  private getRedirectUri(): string {
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    return isDevelopment 
      ? 'http://localhost:7003/auth/google/callback'
      : 'https://crm.repspheres.com/auth/google/callback';
  }

  private loadStoredTokens(): void {
    try {
      // Get current user ID from Supabase
      const userEmail = this.getCurrentUserEmail();
      if (!userEmail) {
        console.log('No authenticated user - skipping token load');
        return;
      }
      
      const storageKey = `gmail_tokens_${userEmail}`;
      const storedTokens = localStorage.getItem(storageKey);
      if (storedTokens) {
        const tokens: AuthTokens = JSON.parse(storedTokens);
        this.accessToken = tokens.access_token;
        this.refreshToken = tokens.refresh_token || null;
        this.tokenExpiry = tokens.expires_at || 0;
        
        // Check if token is still valid
        if (Date.now() < this.tokenExpiry) {
          this.isInitialized = true;
        }
      }
    } catch (error) {
      console.error('Failed to load stored tokens:', error);
    }
  }
  
  private getCurrentUserEmail(): string | null {
    // Check for user email in localStorage (set during login)
    return localStorage.getItem('crm_user_email');
  }

  private saveTokens(tokens: AuthTokens): void {
    try {
      const userEmail = this.getCurrentUserEmail();
      if (!userEmail) {
        console.error('Cannot save tokens - no authenticated user');
        return;
      }
      
      tokens.expires_at = Date.now() + (tokens.expires_in * 1000);
      const storageKey = `gmail_tokens_${userEmail}`;
      localStorage.setItem(storageKey, JSON.stringify(tokens));
      this.accessToken = tokens.access_token;
      this.refreshToken = tokens.refresh_token || null;
      this.tokenExpiry = tokens.expires_at;
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to save tokens:', error);
    }
  }

  /**
   * Initialize the Gmail API service with stored credentials
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized && Date.now() < this.tokenExpiry) {
      return true;
    }

    if (this.refreshToken) {
      try {
        await this.refreshAccessToken();
        return true;
      } catch (error) {
        console.error('Failed to refresh token:', error);
      }
    }

    return false;
  }

  /**
   * Get the OAuth2 authorization URL
   */
  getAuthUrl(): string {
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = new URLSearchParams({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
      redirect_uri: this.getRedirectUri(),
      response_type: 'code',
      scope: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.modify'
      ].join(' '),
      access_type: 'offline',
      include_granted_scopes: 'true'
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForTokens(code: string): Promise<boolean> {
    try {
      const response = await fetch('/.netlify/functions/google-token-exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirect_uri: this.getRedirectUri()
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Token exchange failed: ${error.error_description || error.error}`);
      }

      const tokens: AuthTokens = await response.json();
      this.saveTokens(tokens);
      return true;
    } catch (error) {
      console.error('Failed to exchange code for tokens:', error);
      return false;
    }
  }

  /**
   * Refresh the access token using refresh token
   */
  private async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('/.netlify/functions/google-token-refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: this.refreshToken
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Token refresh failed: ${error.error_description || error.error}`);
    }

    const tokens: AuthTokens = await response.json();
    if (!tokens.refresh_token) {
      tokens.refresh_token = this.refreshToken; // Keep existing refresh token
    }
    this.saveTokens(tokens);
  }

  /**
   * Make authenticated API request to Gmail API
   */
  private async makeApiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('Gmail API not initialized');
    }

    // Check if token needs refresh
    if (Date.now() >= this.tokenExpiry - 300000) { // Refresh 5 minutes before expiry
      if (this.refreshToken) {
        await this.refreshAccessToken();
      } else {
        throw new Error('Access token expired and no refresh token available');
      }
    }

    const response = await fetch(`https://gmail.googleapis.com/gmail/v1${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gmail API error: ${error.error?.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get user's Gmail profile
   */
  async getUserProfile(): Promise<any> {
    return await this.makeApiRequest('/users/me/profile');
  }

  /**
   * Get list of messages with optional query
   */
  async getMessages(query?: string, maxResults = 100): Promise<GmailMessage[]> {
    const params = new URLSearchParams({
      maxResults: maxResults.toString()
    });

    if (query) {
      params.append('q', query);
    }

    const response = await this.makeApiRequest(`/users/me/messages?${params.toString()}`);
    
    if (!response.messages) {
      return [];
    }

    // Get full message details
    const messages = await Promise.all(
      response.messages.map(async (message: any) => {
        return await this.makeApiRequest(`/users/me/messages/${message.id}`);
      })
    );

    return messages;
  }

  /**
   * Parse Gmail message to a more usable format
   */
  parseMessage(message: GmailMessage): ParsedEmailMessage {
    const headers = message.payload.headers || [];
    const getHeader = (name: string) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

    let body = '';
    let isHtml = false;

    // Extract body from message payload
    const extractBody = (payload: any): void => {
      if (payload.body && payload.body.data) {
        const data = payload.body.data;
        const decodedBody = atob(data.replace(/-/g, '+').replace(/_/g, '/'));
        if (payload.mimeType === 'text/html') {
          body = decodedBody;
          isHtml = true;
        } else if (payload.mimeType === 'text/plain' && !body) {
          body = decodedBody;
        }
      }

      if (payload.parts) {
        payload.parts.forEach(extractBody);
      }
    };

    extractBody(message.payload);

    // Extract attachments
    const attachments: Array<{
      filename: string;
      mimeType: string;
      size: number;
      attachmentId: string;
    }> = [];

    const extractAttachments = (payload: any): void => {
      if (payload.filename && payload.filename.length > 0 && payload.body?.attachmentId) {
        attachments.push({
          filename: payload.filename,
          mimeType: payload.mimeType,
          size: payload.body.size,
          attachmentId: payload.body.attachmentId
        });
      }

      if (payload.parts) {
        payload.parts.forEach(extractAttachments);
      }
    };

    extractAttachments(message.payload);

    return {
      id: message.id,
      threadId: message.threadId,
      subject: getHeader('Subject'),
      from: getHeader('From'),
      to: getHeader('To'),
      cc: getHeader('Cc'),
      bcc: getHeader('Bcc'),
      date: getHeader('Date'),
      snippet: message.snippet,
      body,
      isHtml,
      attachments,
      labelIds: message.labelIds || [],
      isRead: !message.labelIds?.includes('UNREAD'),
      isImportant: message.labelIds?.includes('IMPORTANT') || false,
      isStarred: message.labelIds?.includes('STARRED') || false
    };
  }

  /**
   * Get recent messages (last 7 days)
   */
  async getRecentMessages(): Promise<ParsedEmailMessage[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const query = `after:${sevenDaysAgo.getFullYear()}/${sevenDaysAgo.getMonth() + 1}/${sevenDaysAgo.getDate()}`;
    const messages = await this.getMessages(query);
    
    return messages.map(message => this.parseMessage(message));
  }

  /**
   * Send an email
   */
  async sendEmail(to: string, subject: string, body: string, isHtml = false): Promise<string> {
    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      `Content-Type: ${isHtml ? 'text/html' : 'text/plain'}; charset=utf-8`,
      '',
      body
    ].join('\n');

    const encodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const response = await this.makeApiRequest('/users/me/messages/send', {
      method: 'POST',
      body: JSON.stringify({
        raw: encodedEmail
      })
    });

    return response.id;
  }

  /**
   * Mark message as read
   */
  async markAsRead(messageId: string): Promise<void> {
    await this.makeApiRequest(`/users/me/messages/${messageId}/modify`, {
      method: 'POST',
      body: JSON.stringify({
        removeLabelIds: ['UNREAD']
      })
    });
  }

  /**
   * Get attachment data
   */
  async getAttachment(messageId: string, attachmentId: string): Promise<string> {
    const response = await this.makeApiRequest(`/users/me/messages/${messageId}/attachments/${attachmentId}`);
    return response.data;
  }

  /**
   * Check if service is initialized
   */
  isReady(): boolean {
    return this.isInitialized && Date.now() < this.tokenExpiry;
  }

  /**
   * Logout and clear stored tokens
   */
  logout(): void {
    const userEmail = this.getCurrentUserEmail();
    if (userEmail) {
      const storageKey = `gmail_tokens_${userEmail}`;
      localStorage.removeItem(storageKey);
    }
    this.isInitialized = false;
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = 0;
  }
}

const gmailApiService = new GmailApiService();
export default gmailApiService;