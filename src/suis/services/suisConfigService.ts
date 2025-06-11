// SUIS Configuration Service
// Centralizes all SUIS-related configurations and integrations

import { supabase } from '../../auth/supabase';
import { apiKeyService } from '../../services/apiKeyService';
import { getAPIManager } from '../api';

// Define API configuration type
interface SUISAPIConfig {
  supabase: {
    url: string;
    anonKey: string;
    serviceKey: string;
  };
  sphere1a: {
    baseUrl: string;
    apiKey: string;
    version: string;
  };
  openRouter: {
    baseUrl: string;
    apiKey: string;
    defaultModel: string;
  };
  twilio: {
    accountSid: string;
    authToken: string;
    apiVersion: string;
    functionUrl: string;
    apiKey: string;
    phoneNumber: string;
  };
  encryption: {
    key: string;
    algorithm: string;
  };
}

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

// Cache for API key
let cachedSphere1aKey: string | null = null;

// Create SUIS API configuration using existing services
export const getSUISConfig = async (): Promise<SUISAPIConfig> => {
  const twilioConfig = getTwilioConfig();
  
  // Get or create Sphere1a API key
  if (!cachedSphere1aKey) {
    try {
      cachedSphere1aKey = await apiKeyService.getOrCreateSphere1aKey();
    } catch (error) {
      console.warn('Could not get/create Sphere1a key, using environment variable');
      cachedSphere1aKey = process.env.REACT_APP_SPHERE1A_API_KEY || '';
    }
  }
  
  return {
    supabase: {
      url: process.env.REACT_APP_SUPABASE_URL || 'https://cbopynuvhcymbumjnvay.supabase.co',
      anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_KEY || '',
      serviceKey: process.env.REACT_APP_SUPABASE_SERVICE_KEY || ''
    },
    sphere1a: {
      baseUrl: process.env.REACT_APP_SPHERE1A_URL || 'https://api.sphere1a.com/v1',
      apiKey: cachedSphere1aKey || '',
      version: 'v1'
    },
    openRouter: {
      baseUrl: process.env.REACT_APP_OPENROUTER_URL || 'https://openrouter.ai/api/v1',
      apiKey: process.env.REACT_APP_OPENROUTER_API_KEY || '',
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

// Synchronous version for backward compatibility
export const getSUISConfigSync = (): SUISAPIConfig => {
  const twilioConfig = getTwilioConfig();
  
  return {
    supabase: {
      url: process.env.REACT_APP_SUPABASE_URL || 'https://cbopynuvhcymbumjnvay.supabase.co',
      anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_KEY || '',
      serviceKey: process.env.REACT_APP_SUPABASE_SERVICE_KEY || ''
    },
    sphere1a: {
      baseUrl: process.env.REACT_APP_SPHERE1A_URL || 'https://api.sphere1a.com/v1',
      apiKey: cachedSphere1aKey || process.env.REACT_APP_SPHERE1A_API_KEY || '',
      version: 'v1'
    },
    openRouter: {
      baseUrl: process.env.REACT_APP_OPENROUTER_URL || 'https://openrouter.ai/api/v1',
      apiKey: process.env.REACT_APP_OPENROUTER_API_KEY || '',
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
let suisAPIManager: any = null;

export const getSUISAPIManager = async () => {
  if (!suisAPIManager) {
    const config = await getSUISConfig();
    suisAPIManager = getAPIManager(config);
  }
  return suisAPIManager;
};

// Utility to check if APIs are properly configured
export const checkAPIConfiguration = async () => {
  const config = await getSUISConfig();
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
      configured: !!config.sphere1a.apiKey && config.sphere1a.apiKey.length > 0,
      apiKey: config.sphere1a.apiKey ? config.sphere1a.apiKey.substring(0, 10) + '...' : 'Not configured'
    },
    openRouter: {
      configured: !!config.openRouter.apiKey && config.openRouter.apiKey.length > 0,
      apiKey: config.openRouter.apiKey ? config.openRouter.apiKey.substring(0, 10) + '...' : 'Not configured'
    }
  };
};