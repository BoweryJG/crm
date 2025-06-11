// SUIS React Hook for unified intelligence integration
import { useState, useEffect, useCallback } from 'react';
import { suisService, IntelligenceInsight, ProcedurePerformance, UnifiedAnalytics, IntelligentNotification } from '../services/suisService';

interface UseSUISOptions {
  userId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableRealtime?: boolean;
}

interface SUISData {
  // Intelligence insights for dashboard ticker
  insights: IntelligenceInsight[];
  insightsLoading: boolean;
  
  // Procedure performance for Rep Analytics
  procedures: ProcedurePerformance[];
  proceduresLoading: boolean;
  
  // Unified analytics for Rep/Region dashboards
  analytics: UnifiedAnalytics[];
  analyticsLoading: boolean;
  
  // Intelligent notifications
  notifications: IntelligentNotification[];
  notificationsLoading: boolean;
  unreadCount: number;
  
  // Territory intelligence
  territoryData: any[];
  territoryLoading: boolean;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  refreshAll: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  createInsight: (insight: Partial<IntelligenceInsight>) => Promise<void>;
}

export const useSUIS = (options: UseSUISOptions = {}): SUISData => {
  const {
    userId,
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
    enableRealtime = true
  } = options;

  // State management
  const [insights, setInsights] = useState<IntelligenceInsight[]>([]);
  const [procedures, setProcedures] = useState<ProcedurePerformance[]>([]);
  const [analytics, setAnalytics] = useState<UnifiedAnalytics[]>([]);
  const [notifications, setNotifications] = useState<IntelligentNotification[]>([]);
  const [territoryData, setTerritoryData] = useState<any[]>([]);
  
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [proceduresLoading, setProceduresLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [territoryLoading, setTerritoryLoading] = useState(true);
  
  const [error, setError] = useState<string | null>(null);

  // Load intelligence insights
  const loadInsights = useCallback(async () => {
    try {
      setInsightsLoading(true);
      const data = await suisService.getIntelligenceInsights(userId, 10);
      setInsights(data);
      setError(null);
    } catch (err) {
      setError('Failed to load intelligence insights');
      console.error('Error loading insights:', err);
    } finally {
      setInsightsLoading(false);
    }
  }, [userId]);

  // Load procedure performance
  const loadProcedures = useCallback(async () => {
    try {
      setProceduresLoading(true);
      const data = await suisService.getProcedurePerformance(userId);
      setProcedures(data);
      setError(null);
    } catch (err) {
      setError('Failed to load procedure performance');
      console.error('Error loading procedures:', err);
    } finally {
      setProceduresLoading(false);
    }
  }, [userId]);

  // Load unified analytics
  const loadAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true);
      const data = await suisService.getUnifiedAnalytics(userId);
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError('Failed to load analytics');
      console.error('Error loading analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [userId]);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    try {
      setNotificationsLoading(true);
      const data = await suisService.getIntelligentNotifications(userId);
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Error loading notifications:', err);
    } finally {
      setNotificationsLoading(false);
    }
  }, [userId]);

  // Load territory intelligence
  const loadTerritoryData = useCallback(async () => {
    try {
      setTerritoryLoading(true);
      const data = await suisService.getTerritoryIntelligence(userId);
      setTerritoryData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load territory data');
      console.error('Error loading territory data:', err);
    } finally {
      setTerritoryLoading(false);
    }
  }, [userId]);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    await Promise.all([
      loadInsights(),
      loadProcedures(),
      loadAnalytics(),
      loadNotifications(),
      loadTerritoryData()
    ]);
  }, [loadInsights, loadProcedures, loadAnalytics, loadNotifications, loadTerritoryData]);

  // Mark notification as read
  const markNotificationRead = useCallback(async (id: string) => {
    try {
      await suisService.markNotificationRead(id);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read_status: true } : notif
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  // Create new insight
  const createInsight = useCallback(async (insight: Partial<IntelligenceInsight>) => {
    try {
      const newInsight = await suisService.createIntelligenceInsight(insight);
      if (newInsight) {
        setInsights(prev => [newInsight, ...prev]);
      }
    } catch (err) {
      console.error('Error creating insight:', err);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(refreshAll, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshAll]);

  // Real-time subscriptions
  useEffect(() => {
    if (!enableRealtime) return;

    const insightSubscription = suisService.subscribeToIntelligenceUpdates(
      (payload) => {
        console.log('Intelligence update:', payload);
        loadInsights(); // Refresh insights when changes occur
      },
      userId
    );

    const notificationSubscription = suisService.subscribeToNotificationUpdates(
      (payload) => {
        console.log('Notification update:', payload);
        loadNotifications(); // Refresh notifications when changes occur
      },
      userId
    );

    return () => {
      insightSubscription.unsubscribe();
      notificationSubscription.unsubscribe();
    };
  }, [enableRealtime, userId, loadInsights, loadNotifications]);

  // Calculate derived values
  const unreadCount = notifications.filter(n => !n.read_status).length;
  const isLoading = insightsLoading || proceduresLoading || analyticsLoading || notificationsLoading || territoryLoading;

  return {
    // Data
    insights,
    insightsLoading,
    procedures,
    proceduresLoading,
    analytics,
    analyticsLoading,
    notifications,
    notificationsLoading,
    unreadCount,
    territoryData,
    territoryLoading,
    
    // Global state
    isLoading,
    error,
    
    // Actions
    refreshAll,
    markNotificationRead,
    createInsight
  };
};

// Specialized hooks for specific components
export const useSUISForTicker = (userId?: string) => {
  const { insights, insightsLoading, error } = useSUIS({ 
    userId, 
    autoRefresh: true, 
    refreshInterval: 15000, // Faster refresh for ticker
    enableRealtime: true 
  });

  // Convert insights to ticker format
  const tickerData = suisService.convertInsightsToTickerData(insights);

  return {
    tickerData,
    loading: insightsLoading,
    error
  };
};

export const useSUISForRepAnalytics = (userId?: string) => {
  const { 
    procedures, 
    analytics, 
    proceduresLoading, 
    analyticsLoading, 
    error 
  } = useSUIS({ 
    userId, 
    autoRefresh: true, 
    refreshInterval: 60000 // 1 minute refresh for analytics
  });

  // Filter analytics for rep-specific data
  const repAnalytics = analytics.filter(a => a.analytics_type === 'rep');

  return {
    procedures,
    repAnalytics,
    loading: proceduresLoading || analyticsLoading,
    error
  };
};

export const useSUISForRegionAnalytics = (userId?: string, territoryCode?: string) => {
  const { 
    analytics, 
    territoryData, 
    analyticsLoading, 
    territoryLoading, 
    error 
  } = useSUIS({ 
    userId, 
    autoRefresh: true, 
    refreshInterval: 60000
  });

  // Filter analytics for region-specific data
  const regionAnalytics = analytics.filter(a => 
    a.analytics_type === 'region' || a.analytics_type === 'territory'
  );

  // Filter territory data if specific territory requested
  const filteredTerritoryData = territoryCode 
    ? territoryData.filter(t => t.territory_code === territoryCode)
    : territoryData;

  return {
    regionAnalytics,
    territoryData: filteredTerritoryData,
    loading: analyticsLoading || territoryLoading,
    error
  };
};

export default useSUIS;