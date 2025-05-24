import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase/supabase';
import { useAuth } from '../hooks/useAuth';

export type AppMode = 'demo' | 'live';

interface AppModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => Promise<boolean>;
  isDemo: boolean;
  isLive: boolean;
  canAccessLiveMode: boolean;
  subscriptionTier: string | null;
  subscriptionStatus: 'active' | 'inactive' | 'loading';
  showUpgradeModal: boolean;
  closeUpgradeModal: () => void;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

export const AppModeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user } = useAuth();
  const [mode, setModeState] = useState<AppMode>('demo');
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'loading'>('loading');
  const [canAccessLiveMode, setCanAccessLiveMode] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Load user's app mode and subscription status
  useEffect(() => {
    const loadUserSettings = async () => {
      if (!user) {
        setModeState('demo');
        setSubscriptionStatus('inactive');
        setCanAccessLiveMode(false);
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
        setSubscriptionTier(subscriptionData?.subscription_tier || 'free');
        setSubscriptionStatus(hasActiveSubscription ? 'active' : 'inactive');
        setCanAccessLiveMode(hasActiveSubscription);
        
        // Get user's app settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('app_settings')
          .select('app_mode')
          .eq('user_id', user.id)
          .single();
          
        if (settingsError && settingsError.code !== 'PGRST116') {
          console.error('Error fetching app settings:', settingsError);
        }
        
        // Only set to live mode if user has an active subscription
        const savedMode = settingsData?.app_mode as AppMode;
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
        } else {
          // Create default settings for new user
          await supabase
            .from('app_settings')
            .insert({ 
              user_id: user.id, 
              app_mode: 'demo' 
            });
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
  
  const closeUpgradeModal = () => {
    setShowUpgradeModal(false);
  };
  
  const value = {
    mode,
    setMode,
    isDemo: mode === 'demo',
    isLive: mode === 'live',
    canAccessLiveMode,
    subscriptionTier,
    subscriptionStatus,
    showUpgradeModal,
    closeUpgradeModal
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
