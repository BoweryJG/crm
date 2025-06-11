// API Key Management Service
import { supabase } from '../auth/supabase';

export interface ApiKey {
  id: string;
  userId: string;
  keyName: string;
  apiKey: string;
  keyType: 'sphere1a' | 'openrouter' | 'custom';
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  isActive: boolean;
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

class ApiKeyService {
  // Generate a new API key for the current user
  async generateApiKey(keyName: string, keyType: 'sphere1a' | 'openrouter' | 'custom' = 'sphere1a') {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate the API key using Supabase function
      const { data: keyData, error: genError } = await supabase
        .rpc('generate_api_key', { prefix: keyType === 'sphere1a' ? 'sphere1a' : 'sk' });

      if (genError) throw genError;

      // Insert the API key record
      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          key_name: keyName,
          api_key: keyData,
          key_type: keyType,
          permissions: {
            read: true,
            write: true,
            delete: keyType === 'sphere1a' // Only allow delete for sphere1a keys
          }
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating API key:', error);
      throw error;
    }
  }

  // Get all API keys for the current user
  async getUserApiKeys() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching API keys:', error);
      return [];
    }
  }

  // Get or create Sphere1a API key
  async getOrCreateSphere1aKey() {
    try {
      const keys = await this.getUserApiKeys();
      const sphere1aKey = keys.find(k => k.key_type === 'sphere1a' && k.is_active);

      if (sphere1aKey) {
        return sphere1aKey.api_key;
      }

      // Create new Sphere1a API key
      const newKey = await this.generateApiKey('Sphere1a Integration', 'sphere1a');
      return newKey.api_key;
    } catch (error) {
      console.error('Error getting/creating Sphere1a key:', error);
      // Return a fallback key for development
      return `sphere1a_${Date.now()}_fallback`;
    }
  }

  // Validate an API key
  async validateApiKey(apiKey: string) {
    try {
      const { data, error } = await supabase
        .rpc('validate_api_key', { key: apiKey });

      if (error) throw error;
      return data?.[0] || { is_valid: false, user_id: null, permissions: {} };
    } catch (error) {
      console.error('Error validating API key:', error);
      return { is_valid: false, user_id: null, permissions: {} };
    }
  }

  // Revoke an API key
  async revokeApiKey(keyId: string) {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', keyId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error revoking API key:', error);
      return false;
    }
  }

  // Set API key expiration
  async setKeyExpiration(keyId: string, expiresAt: Date) {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ expires_at: expiresAt.toISOString() })
        .eq('id', keyId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error setting key expiration:', error);
      return false;
    }
  }
}

export const apiKeyService = new ApiKeyService();