/**
 * UnifiedAuthContext
 * Created: July 30, 2025
 * 
 * Integrates @repspheres/unified-auth package into CRM
 * Provides RepX tier-based feature access and controls
 */

import React, { createContext, useContext } from 'react';
import { 
  useRepXTier, 
  useFeatureAccess, 
  useAgentTimeLimit,
  RepXTier,
  FeatureAccess,
  UserSubscription 
} from '@repspheres/unified-auth';
import { useAuth } from '../auth';

interface UnifiedAuthContextType {
  // RepX tier information
  tier: RepXTier;
  subscription: UserSubscription | null;
  tierLoading: boolean;
  tierError: Error | null;
  
  // Feature access
  features: FeatureAccess;
  checkFeature: (feature: keyof FeatureAccess) => boolean;
  
  // Agent time limits
  agentTimeLimit: number;
  agentDisplayTime: string;
  isUnlimitedAgent: boolean;
  
  // Utility functions
  canMakePhoneCalls: () => boolean;
  canSendEmails: () => boolean;
  canUseGmail: () => boolean;
  hasWhiteLabel: () => boolean;
  getEmailLimit: () => number | null;
  getPhoneLimit: () => number;
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType | undefined>(undefined);

export const UnifiedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id;
  
  // Use unified auth hooks
  const { tier, subscription, loading: tierLoading, error: tierError } = useRepXTier(userId);
  const { features, checkFeature } = useFeatureAccess(userId);
  const { timeLimit: agentTimeLimit, displayTime: agentDisplayTime, isUnlimited: isUnlimitedAgent } = useAgentTimeLimit(userId);
  
  // Utility functions for common checks
  const canMakePhoneCalls = () => features.phoneAccess;
  const canSendEmails = () => features.emailAccess;
  const canUseGmail = () => features.gmailIntegration;
  const hasWhiteLabel = () => features.whiteLabel;
  const getEmailLimit = () => features.emailSendLimit;
  const getPhoneLimit = () => features.phoneNumberLimit;
  
  const value: UnifiedAuthContextType = {
    tier,
    subscription,
    tierLoading,
    tierError,
    features,
    checkFeature: (feature: keyof FeatureAccess) => checkFeature(feature).allowed,
    agentTimeLimit,
    agentDisplayTime,
    isUnlimitedAgent,
    canMakePhoneCalls,
    canSendEmails,
    canUseGmail,
    hasWhiteLabel,
    getEmailLimit,
    getPhoneLimit,
  };
  
  return (
    <UnifiedAuthContext.Provider value={value}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};

export const useUnifiedAuth = () => {
  const context = useContext(UnifiedAuthContext);
  if (!context) {
    throw new Error('useUnifiedAuth must be used within UnifiedAuthProvider');
  }
  return context;
};