import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase/supabase';
import { useAuth } from '../auth';
import { isAdminUser } from '../config/adminUsers';

export type AppMode = 'demo' | 'live';
export type FeatureTier = 'basic' | 'premium';
export type RepxTier = 'repx1' | 'repx2' | 'repx3' | 'repx4' | 'repx5';

interface AppModeContextType {
  mode: AppMode;
  featureTier: FeatureTier;
  setMode: (mode: AppMode) => Promise<boolean>;
  setFeatureTier: (tier: FeatureTier) => Promise<boolean>;
  isDemo: boolean;
  isLive: boolean;
  isBasic: boolean;
  isPremium: boolean;
  canAccessLiveMode: boolean;
  canAccessPremiumFeatures: boolean;
  subscriptionTier: string | null;
  repxTier: RepxTier | null;
  subscriptionStatus: 'active' | 'inactive' | 'loading';
  showUpgradeModal: boolean;
  showFeatureUpgradeModal: boolean;
  closeUpgradeModal: () => void;
  closeFeatureUpgradeModal: () => void;
  openFeatureUpgradeModal: () => void;
  // Rep^x specific features
  hasRepxAccess: (feature: 'calls' | 'emails' | 'canvas_scans') => boolean;
  getRepxFeatureLimits: () => { calls: number | 'unlimited'; emails: number | 'unlimited'; canvas_scans: number | 'unlimited' } | null;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

export const AppModeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user } = useAuth();
  const [mode, setModeState] = useState<AppMode>('demo');
  const [featureTier, setFeatureTierState] = useState<FeatureTier>('basic');
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [repxTier, setRepxTier] = useState<RepxTier | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'loading'>('loading');
  const [canAccessLiveMode, setCanAccessLiveMode] = useState(false);
  const [canAccessPremiumFeatures, setCanAccessPremiumFeatures] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showFeatureUpgradeModal, setShowFeatureUpgradeModal] = useState(false);
  
  // Load user's app mode and subscription status
  useEffect(() => {
    const loadUserSettings = async () => {
      if (!user) {
        // Force demo mode for non-authenticated users (public mode)
        setModeState('demo');
        setFeatureTierState('basic');
        setSubscriptionStatus('inactive');
        setCanAccessLiveMode(false);
        setCanAccessPremiumFeatures(false);
        return;
      }
      
      // Check if user is admin
      const isAdmin = isAdminUser(user.email);
      
      if (isAdmin) {
        // Admins get everything
        setModeState('live');
        setFeatureTierState('premium');
        setSubscriptionStatus('active');
        setCanAccessLiveMode(true);
        setCanAccessPremiumFeatures(true);
        setSubscriptionTier('enterprise');
        return;
      }
      
      setSubscriptionStatus('loading');
      
      try {
        // Get user's subscription
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .select('subscription_tier, is_active')
          .eq('user_id', user.id)
          .single();
          
        if (subscriptionError && subscriptionError.code !== 'PGRST116') {
          console.error('Error fetching subscription:', subscriptionError);
        }
        
        const hasActiveSubscription = subscriptionData?.is_active || false;
        const tier = subscriptionData?.subscription_tier || 'free';
        setSubscriptionTier(tier);
        setSubscriptionStatus(hasActiveSubscription ? 'active' : 'inactive');
        setCanAccessLiveMode(hasActiveSubscription);
        
        // Set Rep^x tier if it's a valid Rep^x subscription
        const validRepxTiers: RepxTier[] = ['repx1', 'repx2', 'repx3', 'repx4', 'repx5'];
        if (validRepxTiers.includes(tier as RepxTier)) {
          setRepxTier(tier as RepxTier);
        } else {
          setRepxTier(null);
        }
        
        // Determine if user can access premium features based on subscription tier
        const canAccessPremium = hasActiveSubscription && (
          tier === 'premium' || tier === 'enterprise' || 
          tier === 'repx3' || tier === 'repx4' || tier === 'repx5'
        );
        setCanAccessPremiumFeatures(canAccessPremium);
        
        // Get user's app settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('app_settings')
          .select('app_mode, feature_tier')
          .eq('user_id', user.id)
          .single();
          
        if (settingsError) {
          if (settingsError.code !== 'PGRST116') {
            console.warn('App settings table not accessible, using defaults:', settingsError.message);
          }
        }
        
        // Only set to live mode if user has an active subscription
        const savedMode = settingsData?.app_mode as AppMode;
        const savedFeatureTier = settingsData?.feature_tier as FeatureTier || 'basic';
        
        if (savedMode === 'live' && !hasActiveSubscription) {
          // User doesn't have access to live mode anymore
          setModeState('demo');
          // Update their settings to demo mode
          await supabase
            .from('app_settings')
            .upsert({ 
              user_id: user.id, 
              app_mode: 'demo' 
            });
        } else if (settingsData) {
          setModeState(savedMode);
          setFeatureTierState(savedFeatureTier);
        } else {
          // Create default settings for new user
          await supabase
            .from('app_settings')
            .insert({ 
              user_id: user.id, 
              app_mode: 'demo',
              feature_tier: 'basic'
            });
        }
        
        // If user doesn't have premium access but has premium tier set, downgrade to basic
        if (savedFeatureTier === 'premium' && !canAccessPremium) {
          setFeatureTierState('basic');
          if (user) {
            await supabase
              .from('app_settings')
              .upsert({ 
                user_id: user.id, 
                feature_tier: 'basic' 
              });
          }
        }
      } catch (error) {
        console.error('Error loading user settings:', error);
        setModeState('demo');
        setSubscriptionStatus('inactive');
        setCanAccessLiveMode(false);
      }
    };
    
    loadUserSettings();
  }, [user]);
  
  // Function to change mode with subscription check
  const setMode = async (newMode: AppMode): Promise<boolean> => {
    if (newMode === 'live' && !canAccessLiveMode) {
      setShowUpgradeModal(true);
      return false;
    }
    
    setModeState(newMode);
    
    // Save user's preference if logged in
    if (user) {
      try {
        await supabase
          .from('app_settings')
          .upsert({ 
            user_id: user.id, 
            app_mode: newMode 
          });
        return true;
      } catch (error) {
        console.error('Error saving app mode:', error);
        return false;
      }
    }
    
    return true;
  };
  
  // Function to change feature tier with subscription check
  const setFeatureTier = async (newTier: FeatureTier): Promise<boolean> => {
    if (newTier === 'premium' && !canAccessPremiumFeatures) {
      setShowFeatureUpgradeModal(true);
      return false;
    }
    
    setFeatureTierState(newTier);
    
    // Save user's preference if logged in
    if (user) {
      try {
        await supabase
          .from('app_settings')
          .upsert({ 
            user_id: user.id, 
            feature_tier: newTier 
          });
        return true;
      } catch (error) {
        console.error('Error saving feature tier:', error);
        return false;
      }
    }
    
    return true;
  };
  
  const closeUpgradeModal = () => {
    setShowUpgradeModal(false);
  };
  
  const closeFeatureUpgradeModal = () => {
    setShowFeatureUpgradeModal(false);
  };
  
  const openFeatureUpgradeModal = () => {
    setShowFeatureUpgradeModal(true);
  };
  
  // Rep^x specific feature access check
  const hasRepxAccess = (feature: 'calls' | 'emails' | 'canvas_scans'): boolean => {
    if (!repxTier) return false;
    
    switch (feature) {
      case 'calls':
        return true; // All Rep^x tiers have calls
      case 'emails':
        return ['repx2', 'repx3', 'repx4', 'repx5'].includes(repxTier);
      case 'canvas_scans':
        return ['repx2', 'repx3', 'repx4', 'repx5'].includes(repxTier);
      default:
        return false;
    }
  };
  
  // Get Rep^x feature limits
  const getRepxFeatureLimits = () => {
    if (!repxTier) return null;
    
    const limits = {
      repx1: { calls: 100, emails: 0, canvas_scans: 0 },
      repx2: { calls: 200, emails: 50, canvas_scans: 10 },
      repx3: { calls: 400, emails: 100, canvas_scans: 25 },
      repx4: { calls: 800, emails: 200, canvas_scans: 50 },
      repx5: { calls: 'unlimited' as const, emails: 'unlimited' as const, canvas_scans: 'unlimited' as const }
    };
    
    return limits[repxTier];
  };
  
  const value = {
    mode,
    featureTier,
    setMode,
    setFeatureTier,
    isDemo: mode === 'demo',
    isLive: mode === 'live',
    isBasic: featureTier === 'basic',
    isPremium: featureTier === 'premium',
    canAccessLiveMode,
    canAccessPremiumFeatures,
    subscriptionTier,
    repxTier,
    subscriptionStatus,
    showUpgradeModal,
    showFeatureUpgradeModal,
    closeUpgradeModal,
    closeFeatureUpgradeModal,
    openFeatureUpgradeModal,
    hasRepxAccess,
    getRepxFeatureLimits
  };
  
  return (
    <AppModeContext.Provider value={value}>
      {children}
    </AppModeContext.Provider>
  );
};

export const useAppMode = (): AppModeContextType => {
  const context = useContext(AppModeContext);
  if (context === undefined) {
    throw new Error('useAppMode must be used within an AppModeProvider');
  }
  return context;
};
