// SUIS Configuration Service
// Centralizes all SUIS-related configurations and integrations

import { supabase } from '../../auth/supabase';
import { SUISAPIConfig } from '../types';

// Get existing configurations from environment
const getTwilioConfig = () => {
  return {
    functionUrl: process.env.REACT_APP_TWILIO_FUNCTION_URL || '',
    apiKey: process.env.REACT_APP_TWILIO_API_KEY || '',
    phoneNumber: process.env.REACT_APP_TWILIO_PHONE_NUMBER || '',
    accountSid: process.env.REACT_APP_TWILIO_ACCOUNT_SID || '',
    authToken: process.env.REACT_APP_TWILIO_AUTH_TOKEN || ''
  };
};

// Create SUIS API configuration using existing services
export const getSUISConfig = (): SUISAPIConfig => {
  const twilioConfig = getTwilioConfig();
  
  return {
    supabase: {
      url: process.env.REACT_APP_SUPABASE_URL || 'https://cbopynuvhcymbumjnvay.supabase.co',
      anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_KEY || '',
      serviceKey: process.env.REACT_APP_SUPABASE_SERVICE_KEY || ''
    },
    sphere1a: {
      baseUrl: process.env.REACT_APP_SPHERE1A_URL || 'https://api.sphere1a.com/v1',
      apiKey: process.env.REACT_APP_SPHERE1A_API_KEY || 'demo-sphere1a-key',
      version: 'v1'
    },
    openRouter: {
      baseUrl: process.env.REACT_APP_OPENROUTER_URL || 'https://openrouter.ai/api/v1',
      apiKey: process.env.REACT_APP_OPENROUTER_API_KEY || 'sk-or-v1-demo',
      defaultModel: 'openai/gpt-4'
    },
    twilio: {
      accountSid: twilioConfig.accountSid,
      authToken: twilioConfig.authToken,
      apiVersion: '2010-04-01',
      functionUrl: twilioConfig.functionUrl,
      apiKey: twilioConfig.apiKey,
      phoneNumber: twilioConfig.phoneNumber
    },
    encryption: {
      key: process.env.REACT_APP_ENCRYPTION_KEY || 'demo-encryption-key-32-chars-lng',
      algorithm: 'aes-256-gcm'
    }
  };
};

// Export singleton Supabase instance for SUIS
export { supabase as suisSupabase };

// Initialize SUIS API Manager
import { getAPIManager } from '../api';

let suisAPIManager: any = null;

export const getSUISAPIManager = () => {
  if (!suisAPIManager) {
    const config = getSUISConfig();
    suisAPIManager = getAPIManager(config);
  }
  return suisAPIManager;
};

// Utility to check if APIs are properly configured
export const checkAPIConfiguration = () => {
  const config = getSUISConfig();
  const twilioConfig = getTwilioConfig();
  
  return {
    supabase: {
      configured: !!config.supabase.url && !!config.supabase.anonKey,
      url: config.supabase.url
    },
    twilio: {
      configured: !!twilioConfig.functionUrl && !!twilioConfig.apiKey,
      hasCredentials: !!twilioConfig.accountSid
    },
    sphere1a: {
      configured: config.sphere1a.apiKey !== 'demo-sphere1a-key',
      apiKey: config.sphere1a.apiKey.substring(0, 10) + '...'
    },
    openRouter: {
      configured: config.openRouter.apiKey !== 'sk-or-v1-demo',
      apiKey: config.openRouter.apiKey.substring(0, 10) + '...'
    }
  };
};