// SUIS Real-time Service
// Manages all real-time subscriptions and live data updates

import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '../../auth/supabase';
import { 
  MarketIntelligence, 
  SUISNotification, 
  ContactUniverse,
  CallIntelligence 
} from '../types';

type SubscriptionCallback<T> = (data: T) => void;

class SUISRealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();
  private callbacks: Map<string, Set<Function>> = new Map();

  // Market Intelligence Real-time Updates
  subscribeToMarketIntelligence(
    callback: SubscriptionCallback<MarketIntelligence>,
    filters?: { territory_id?: string; specialty?: string }
  ): () => void {
    const channelName = 'market-intelligence';
    
    if (!this.channels.has(channelName)) {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'suis_market_intelligence',
            filter: filters?.territory_id ? `territory_id=eq.${filters.territory_id}` : undefined
          },
          (payload: RealtimePostgresChangesPayload<MarketIntelligence>) => {
            this.handleMarketIntelligenceUpdate(payload);
          }
        )
        .subscribe();
      
      this.channels.set(channelName, channel);
    }

    // Add callback
    if (!this.callbacks.has(channelName)) {
      this.callbacks.set(channelName, new Set());
    }
    this.callbacks.get(channelName)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.callbacks.get(channelName);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.unsubscribeChannel(channelName);
        }
      }
    };
  }

  // User Notifications Real-time
  subscribeToNotifications(
    userId: string,
    callback: SubscriptionCallback<SUISNotification>
  ): () => void {
    const channelName = `notifications-${userId}`;
    
    if (!this.channels.has(channelName)) {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'suis_notifications',
            filter: `user_id=eq.${userId}`
          },
          (payload: RealtimePostgresChangesPayload<SUISNotification>) => {
            if (payload.new) {
              this.notifyCallbacks(channelName, payload.new);
            }
          }
        )
        .subscribe();
      
      this.channels.set(channelName, channel);
    }

    // Add callback
    if (!this.callbacks.has(channelName)) {
      this.callbacks.set(channelName, new Set());
    }
    this.callbacks.get(channelName)!.add(callback);

    return () => {
      const callbacks = this.callbacks.get(channelName);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.unsubscribeChannel(channelName);
        }
      }
    };
  }

  // Contact Universe Updates
  subscribeToContactUpdates(
    userId: string,
    callback: SubscriptionCallback<ContactUniverse>
  ): () => void {
    const channelName = `contacts-${userId}`;
    
    if (!this.channels.has(channelName)) {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'suis_contact_universe',
            filter: `user_id=eq.${userId}`
          },
          (payload: RealtimePostgresChangesPayload<ContactUniverse>) => {
            this.handleContactUpdate(payload);
          }
        )
        .subscribe();
      
      this.channels.set(channelName, channel);
    }

    if (!this.callbacks.has(channelName)) {
      this.callbacks.set(channelName, new Set());
    }
    this.callbacks.get(channelName)!.add(callback);

    return () => {
      const callbacks = this.callbacks.get(channelName);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.unsubscribeChannel(channelName);
        }
      }
    };
  }

  // Call Intelligence Updates
  subscribeToCallIntelligence(
    userId: string,
    callback: SubscriptionCallback<CallIntelligence>
  ): () => void {
    const channelName = `calls-${userId}`;
    
    if (!this.channels.has(channelName)) {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'suis_call_intelligence',
            filter: `user_id=eq.${userId}`
          },
          (payload: RealtimePostgresChangesPayload<CallIntelligence>) => {
            if (payload.new) {
              this.notifyCallbacks(channelName, payload.new);
            }
          }
        )
        .subscribe();
      
      this.channels.set(channelName, channel);
    }

    if (!this.callbacks.has(channelName)) {
      this.callbacks.set(channelName, new Set());
    }
    this.callbacks.get(channelName)!.add(callback);

    return () => {
      const callbacks = this.callbacks.get(channelName);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.unsubscribeChannel(channelName);
        }
      }
    };
  }

  // Analytics Updates - for real-time dashboard updates
  subscribeToAnalyticsUpdates(
    userId: string,
    callback: SubscriptionCallback<any>
  ): () => void {
    const channelName = `analytics-${userId}`;
    
    if (!this.channels.has(channelName)) {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'suis_unified_analytics',
            filter: `user_id=eq.${userId}`
          },
          (payload: RealtimePostgresChangesPayload<any>) => {
            this.handleAnalyticsUpdate(payload);
          }
        )
        .subscribe();
      
      this.channels.set(channelName, channel);
    }

    if (!this.callbacks.has(channelName)) {
      this.callbacks.set(channelName, new Set());
    }
    this.callbacks.get(channelName)!.add(callback);

    return () => {
      const callbacks = this.callbacks.get(channelName);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.unsubscribeChannel(channelName);
        }
      }
    };
  }

  // Handle market intelligence updates with filtering
  private handleMarketIntelligenceUpdate(payload: RealtimePostgresChangesPayload<MarketIntelligence>) {
    const channelName = 'market-intelligence';
    if (payload.new) {
      this.notifyCallbacks(channelName, payload.new);
    }
  }

  // Handle contact updates with enrichment
  private handleContactUpdate(payload: RealtimePostgresChangesPayload<ContactUniverse>) {
    const userId = payload.new?.user_id || payload.old?.user_id;
    if (userId) {
      const channelName = `contacts-${userId}`;
      if (payload.new) {
        this.notifyCallbacks(channelName, payload.new);
      }
    }
  }

  // Handle analytics updates
  private handleAnalyticsUpdate(payload: RealtimePostgresChangesPayload<any>) {
    const userId = payload.new?.user_id || payload.old?.user_id;
    if (userId) {
      const channelName = `analytics-${userId}`;
      if (payload.new) {
        this.notifyCallbacks(channelName, payload.new);
      }
    }
  }

  // Notify all callbacks for a channel
  private notifyCallbacks(channelName: string, data: any) {
    const callbacks = this.callbacks.get(channelName);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in realtime callback:', error);
        }
      });
    }
  }

  // Unsubscribe from a channel
  private unsubscribeChannel(channelName: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
      this.callbacks.delete(channelName);
    }
  }

  // Unsubscribe from all channels
  unsubscribeAll() {
    this.channels.forEach((channel, name) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
    this.callbacks.clear();
  }
}

export const suisRealtimeService = new SUISRealtimeService();