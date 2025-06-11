// SUIS Features Hook
// Provides easy access to all SUIS intelligent features

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { suisService } from '../services/suisService';
import { 
  PredictiveInsight,
  PerformanceMetrics,
  SUISNotification 
} from '../types';

export const useSUISFeatures = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [notifications, setNotifications] = useState<SUISNotification[]>([]);
  const [notificationSummary, setNotificationSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load predictive insights
  const loadInsights = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const predictiveInsights = await suisService.generatePredictiveInsights(user.id);
      setInsights(predictiveInsights);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Load performance metrics
  const loadMetrics = useCallback(async (periodStart?: Date, periodEnd?: Date) => {
    if (!user?.id) return;

    try {
      const end = periodEnd || new Date();
      const start = periodStart || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const performanceMetrics = await suisService.calculatePerformanceMetrics(
        user.id,
        start,
        end
      );
      setMetrics(performanceMetrics);
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  }, [user?.id]);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      const [notifs, summary] = await Promise.all([
        suisService.getNotifications(user.id, true), // unread only
        suisService.getNotificationSummary(user.id)
      ]);
      
      setNotifications(notifs);
      setNotificationSummary(summary);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, [user?.id]);

  // Generate AI content
  const generateContent = useCallback(async (request: any) => {
    if (!user?.id) return null;

    try {
      setLoading(true);
      return await suisService.generateAIContent(user.id, request);
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Conduct AI research
  const conductResearch = useCallback(async (query: string, context?: any) => {
    if (!user?.id) return null;

    try {
      setLoading(true);
      return await suisService.conductAIResearch(user.id, query, context);
    } catch (error) {
      console.error('Error conducting research:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Score opportunity
  const scoreOpportunity = useCallback(async (contactId: string, procedureType?: string) => {
    if (!user?.id) return null;

    try {
      return await suisService.scoreOpportunity(user.id, contactId, procedureType);
    } catch (error) {
      console.error('Error scoring opportunity:', error);
      throw error;
    }
  }, [user?.id]);

  // Mark notification as read
  const markNotificationRead = useCallback(async (notificationId: string) => {
    try {
      await suisService.markNotificationRead(notificationId);
      await loadNotifications(); // Reload
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [loadNotifications]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to notifications
    const notificationSub = suisService.subscribeToNotifications(user.id, (notification) => {
      setNotifications(prev => [notification, ...prev]);
      // Update summary count
      setNotificationSummary(prev => ({
        ...prev,
        total: (prev?.total || 0) + 1,
        byType: {
          ...prev?.byType,
          [notification.notification_type]: (prev?.byType?.[notification.notification_type] || 0) + 1
        }
      }));
    });

    // Subscribe to analytics updates
    const analyticsSub = suisService.subscribeToAnalyticsUpdates(user.id, () => {
      loadMetrics(); // Reload metrics when updated
    });

    // Subscribe to market intelligence
    const marketSub = suisService.subscribeToMarketIntelligence((data) => {
      // Could trigger insight regeneration or notifications
      console.log('New market intelligence:', data);
    });

    // Clean up subscriptions
    return () => {
      notificationSub();
      analyticsSub();
      marketSub();
    };
  }, [user?.id, loadMetrics]);

  // Initial load
  useEffect(() => {
    if (user?.id) {
      loadInsights();
      loadMetrics();
      loadNotifications();
    }
  }, [user?.id, loadInsights, loadMetrics, loadNotifications]);

  return {
    // Data
    insights,
    metrics,
    notifications,
    notificationSummary,
    loading,
    
    // Actions
    generateContent,
    conductResearch,
    scoreOpportunity,
    markNotificationRead,
    
    // Refresh functions
    refreshInsights: loadInsights,
    refreshMetrics: loadMetrics,
    refreshNotifications: loadNotifications
  };
};