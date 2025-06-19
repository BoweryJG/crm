// SUIS React Hook for unified intelligence integration
import { useContext } from 'react';
import { SUISContext } from '../suis/components/SUISProvider';

export const useSUIS = () => {
  const context = useContext(SUISContext);
  
  if (!context) {
    throw new Error('useSUIS must be used within a SUISProvider');
  }
  
  return context;
};

// Optional SUIS hook that returns null if not in provider
export const useSUISOptional = () => {
  const context = useContext(SUISContext);
  return context;
};

// Safe SUIS hook that returns a default state if not in provider
export const useSUISSafe = () => {
  const context = useContext(SUISContext);
  
  if (!context) {
    // Return a safe default state
    return {
      state: {
        isInitialized: false,
        user: null,
        intelligenceProfile: null,
        marketIntelligence: [],
        notifications: [],
        analytics: null,
        theme: {
          currentTheme: 'light',
          themes: {},
          intelligentSwitching: {},
          customizations: {},
          accessibility: {}
        },
        config: {
          apiEndpoints: {},
          features: {},
          performance: {}
        },
        loading: false,
        error: null
      },
      actions: {
        initializeSystem: async () => {},
        updateIntelligenceProfile: async () => {},
        fetchMarketIntelligence: async () => {},
        generateContent: async () => ({} as any),
        analyzeCall: async () => ({} as any),
        performResearch: async () => ({} as any),
        updateTheme: () => {},
        markNotificationRead: async () => {},
        subscribeToRealtime: () => {},
        unsubscribeFromRealtime: () => {}
      }
    };
  }
  
  return context;
};

export default useSUIS;