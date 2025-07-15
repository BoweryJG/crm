import { supabase } from '../supabase/supabase';

interface SyncResult {
  success: boolean;
  syncedCount: number;
  error?: string;
}

class GmailSyncService {
  private syncInterval: NodeJS.Timer | null = null;
  private lastSyncTime: Date | null = null;

  async startAutoSync(intervalMinutes: number = 15): Promise<void> {
    // Stop any existing sync
    this.stopAutoSync();

    // Start new sync interval
    this.syncInterval = setInterval(() => {
      this.syncAllAccounts();
    }, intervalMinutes * 60 * 1000);

    // Do an initial sync
    await this.syncAllAccounts();
  }

  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async syncAllAccounts(): Promise<SyncResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, syncedCount: 0, error: 'User not authenticated' };
      }

      // Call the Render backend to sync Gmail
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/email/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          userId: user.id
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Sync failed');
      }

      this.lastSyncTime = new Date();

      return {
        success: true,
        syncedCount: result.syncedCount || 0
      };

    } catch (error) {
      console.error('Gmail sync error:', error);
      return {
        success: false,
        syncedCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async syncAccount(accountEmail: string): Promise<SyncResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, syncedCount: 0, error: 'User not authenticated' };
      }

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/email/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          userId: user.id,
          accountEmail
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Sync failed');
      }

      return {
        success: true,
        syncedCount: result.syncedCount || 0
      };

    } catch (error) {
      console.error('Gmail sync error:', error);
      return {
        success: false,
        syncedCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  getLastSyncTime(): Date | null {
    return this.lastSyncTime;
  }

  // Subscribe to real-time email updates
  subscribeToEmailUpdates(callback: (payload: any) => void) {
    return supabase
      .channel('email_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'email_logs'
        },
        callback
      )
      .subscribe();
  }
}

export const gmailSyncService = new GmailSyncService();