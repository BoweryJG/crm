import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth';
import { supabase } from '../services/supabase/supabase';

// Rep^x subscription tiers
export type RepxTier = 'repx1' | 'repx2' | 'repx3' | 'repx4' | 'repx5';
export type BillingCycle = 'monthly' | 'annual';

export interface RepxPlan {
  name: string;
  monthly: {
    amount: number;
    priceId: string;
  };
  annual: {
    amount: number;
    priceId: string;
  };
  productId: string;
  features: {
    calls: number | 'unlimited';
    emails: number | 'unlimited';
    canvas_scans: number | 'unlimited';
    basic: string[];
    premium: string[];
  };
}

export interface RepxPlans {
  repx1: RepxPlan;
  repx2: RepxPlan;
  repx3: RepxPlan;
  repx4: RepxPlan;
  repx5: RepxPlan;
}

export interface SubscriptionStatus {
  tier: RepxTier | null;
  isActive: boolean;
  status: 'active' | 'inactive' | 'loading' | 'error';
  expiresAt?: Date;
}

export interface UsageStats {
  calls: number;
  emails: number;
  canvas_scans: number;
  period: 'daily' | 'monthly';
  resetDate: Date;
}

export interface SubscriptionHookReturn {
  // Subscription state
  subscriptionStatus: SubscriptionStatus;
  plans: RepxPlans | null;
  usage: UsageStats | null;
  
  // Loading states
  loading: boolean;
  plansLoading: boolean;
  usageLoading: boolean;
  
  // Actions
  fetchPlans: () => Promise<void>;
  fetchSubscriptionStatus: () => Promise<void>;
  fetchUsage: () => Promise<void>;
  createCheckoutSession: (tier: RepxTier, billingCycle: BillingCycle) => Promise<string | null>;
  validateAccess: (feature: 'calls' | 'emails' | 'canvas_scans') => Promise<boolean>;
  trackUsage: (feature: 'calls' | 'emails' | 'canvas_scans', amount?: number) => Promise<void>;
  
  // Computed values
  hasActiveSubscription: boolean;
  currentPlan: RepxPlan | null;
  canUpgrade: boolean;
  nextTier: RepxTier | null;
}

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://osbackend-zl1h.onrender.com';

export const useSubscription = (): SubscriptionHookReturn => {
  const { user } = useAuth();
  
  // State
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    tier: null,
    isActive: false,
    status: 'loading'
  });
  const [plans, setPlans] = useState<RepxPlans | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(false);
  const [usageLoading, setUsageLoading] = useState(false);

  // Fetch Rep^x plans from osbackend
  const fetchPlans = useCallback(async () => {
    setPlansLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/crm/stripe/repx/plans`);
      const data = await response.json();
      
      if (data.success) {
        setPlans(data.data);
      } else {
        console.error('Failed to fetch plans:', data.error);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setPlansLoading(false);
    }
  }, []);

  // Fetch subscription status from Supabase
  const fetchSubscriptionStatus = useCallback(async () => {
    if (!user) {
      setSubscriptionStatus({
        tier: null,
        isActive: false,
        status: 'inactive'
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('subscription_tier, is_active, expires_at')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        setSubscriptionStatus(prev => ({ ...prev, status: 'error' }));
        return;
      }

      const tier = data?.subscription_tier as RepxTier;
      const isActive = data?.is_active || false;
      const expiresAt = data?.expires_at ? new Date(data.expires_at) : undefined;

      setSubscriptionStatus({
        tier,
        isActive,
        status: isActive ? 'active' : 'inactive',
        expiresAt
      });
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      setSubscriptionStatus(prev => ({ ...prev, status: 'error' }));
    }
  }, [user]);

  // Fetch usage statistics
  const fetchUsage = useCallback(async () => {
    if (!user || !subscriptionStatus.isActive) {
      setUsage(null);
      return;
    }

    setUsageLoading(true);
    try {
      // Get current month usage
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('usage_tracking')
        .select('feature_type, usage_count, created_at')
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString());

      if (error) {
        console.error('Error fetching usage:', error);
        return;
      }

      // Aggregate usage by feature type
      const usageStats = {
        calls: 0,
        emails: 0,
        canvas_scans: 0,
        period: 'monthly' as const,
        resetDate: new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 1)
      };

      data?.forEach(record => {
        if (record.feature_type in usageStats && typeof usageStats[record.feature_type as keyof typeof usageStats] === 'number') {
          (usageStats[record.feature_type as keyof typeof usageStats] as number) += record.usage_count || 1;
        }
      });

      setUsage(usageStats);
    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setUsageLoading(false);
    }
  }, [user, subscriptionStatus.isActive]);

  // Create Stripe checkout session
  const createCheckoutSession = useCallback(async (tier: RepxTier, billingCycle: BillingCycle): Promise<string | null> => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/crm/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tier,
          billingCycle,
          customerEmail: user?.email || '',
          successUrl: `${window.location.origin}/subscription/success`,
          cancelUrl: `${window.location.origin}/subscription/cancel`
        })
      });

      const data = await response.json();
      
      if (data.success && data.data?.url) {
        return data.data.url;
      } else {
        console.error('Failed to create checkout session:', data.error);
        return null;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return null;
    }
  }, [user]);

  // Validate access to features
  const validateAccess = useCallback(async (feature: 'calls' | 'emails' | 'canvas_scans'): Promise<boolean> => {
    if (!subscriptionStatus.isActive || !subscriptionStatus.tier || !usage) {
      return false;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/crm/repx/validate-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userTier: subscriptionStatus.tier,
          feature,
          usage: {
            calls: usage.calls,
            emails: usage.emails,
            canvas_scans: usage.canvas_scans
          }
        })
      });

      const data = await response.json();
      return data.success && data.data.hasAccess;
    } catch (error) {
      console.error('Error validating access:', error);
      return false;
    }
  }, [subscriptionStatus, usage]);

  // Track usage
  const trackUsage = useCallback(async (feature: 'calls' | 'emails' | 'canvas_scans', amount = 1): Promise<void> => {
    if (!user || !subscriptionStatus.isActive) {
      return;
    }

    try {
      await supabase
        .from('usage_tracking')
        .insert({
          user_id: user.id,
          feature_type: feature,
          usage_count: amount,
          created_at: new Date().toISOString()
        });

      // Update local usage state
      setUsage(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [feature]: prev[feature] + amount
        };
      });
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  }, [user, subscriptionStatus.isActive]);

  // Computed values
  const hasActiveSubscription = subscriptionStatus.isActive && subscriptionStatus.tier !== null;
  
  const currentPlan = plans && subscriptionStatus.tier ? plans[subscriptionStatus.tier] : null;
  
  const tierOrder: RepxTier[] = ['repx1', 'repx2', 'repx3', 'repx4', 'repx5'];
  const currentTierIndex = subscriptionStatus.tier ? tierOrder.indexOf(subscriptionStatus.tier) : -1;
  const canUpgrade = currentTierIndex >= 0 && currentTierIndex < tierOrder.length - 1;
  const nextTier = canUpgrade ? tierOrder[currentTierIndex + 1] : null;

  // Effects
  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        fetchPlans(),
        fetchSubscriptionStatus()
      ]).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user, fetchPlans, fetchSubscriptionStatus]);

  useEffect(() => {
    if (subscriptionStatus.isActive) {
      fetchUsage();
    }
  }, [subscriptionStatus.isActive, fetchUsage]);

  return {
    // State
    subscriptionStatus,
    plans,
    usage,
    
    // Loading states
    loading,
    plansLoading,
    usageLoading,
    
    // Actions
    fetchPlans,
    fetchSubscriptionStatus,
    fetchUsage,
    createCheckoutSession,
    validateAccess,
    trackUsage,
    
    // Computed values
    hasActiveSubscription,
    currentPlan,
    canUpgrade,
    nextTier
  };
};

export default useSubscription;