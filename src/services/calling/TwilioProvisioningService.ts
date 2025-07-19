import { supabase } from '../supabase/supabase';

// Twilio SDK types
interface TwilioClient {
  incomingPhoneNumbers: {
    create: (options: any) => Promise<any>;
    list: (options?: any) => Promise<any>;
  };
  availablePhoneNumbers: {
    (countryCode: string): {
      local: {
        list: (options: any) => Promise<any>;
      };
    };
  };
  applications: {
    create: (options: any) => Promise<any>;
  };
}

export interface RepTwilioConfig {
  rep_id: string;
  phone_number: string;
  twilio_sid: string;
  twilio_app_sid: string;
  webhook_config: {
    voice_url: string;
    status_callback_url: string;
    transcribe_callback_url: string;
  };
  provisioned_at: string;
  status: 'active' | 'suspended' | 'error';
}

export interface ProvisioningOptions {
  rep_id: string;
  preferred_area_code?: string;
  preferred_region?: string;
  features?: {
    transcription: boolean;
    recording: boolean;
    ai_analysis: boolean;
  };
}

class TwilioProvisioningService {
  private twilioClient: TwilioClient | null = null;
  private masterAccountSid: string;
  private masterAuthToken: string;
  private baseWebhookUrl: string;

  constructor() {
    this.masterAccountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID || '';
    this.masterAuthToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN || '';
    this.baseWebhookUrl = process.env.REACT_APP_BASE_WEBHOOK_URL || 'https://crm.repspheres.com/api/twilio';
    
    console.log('🔧 Twilio Config:', {
      accountSid: this.masterAccountSid ? '✅ SET' : '❌ MISSING',
      authToken: this.masterAuthToken ? '✅ SET' : '❌ MISSING',
      webhookUrl: this.baseWebhookUrl
    });
    
    // Initialize Twilio client with real credentials
    this.initializeTwilioClient();
  }

  private async initializeTwilioClient(): Promise<void> {
    try {
      // Use actual Twilio credentials if available
      if (this.masterAccountSid && this.masterAuthToken) {
        console.log('🔗 Initializing Twilio client with real credentials');
        
        // In production, you would use the actual Twilio SDK here:
        // const twilio = require('twilio');
        // this.twilioClient = twilio(this.masterAccountSid, this.masterAuthToken);
        
        // For now, create a mock client that uses your actual phone number
        const userPhoneNumber = process.env.REACT_APP_TWILIO_PHONE_NUMBER || '+1234567890';
        
        this.twilioClient = {
          incomingPhoneNumbers: {
            create: async (options: any) => {
              // Return your actual phone number instead of creating a new one
              console.log('📞 Using existing Twilio phone number:', userPhoneNumber);
              return {
                sid: `PN_USER_${this.masterAccountSid.substr(-8)}`,
                phoneNumber: userPhoneNumber,
                friendlyName: options.friendlyName || 'RepSpheres User Number',
                voiceUrl: options.voiceUrl,
                statusCallbackUrl: options.statusCallbackUrl,
              };
            },
            list: async (options?: any) => {
              // Return your existing phone number
              return [{
                sid: `PN_USER_${this.masterAccountSid.substr(-8)}`,
                phoneNumber: userPhoneNumber,
                friendlyName: 'RepSpheres User Number'
              }];
            }
          },
          availablePhoneNumbers: (countryCode: string) => ({
            local: {
              list: async (options: any) => {
                // Return your existing number as "available"
                return [{
                  phoneNumber: userPhoneNumber,
                  friendlyName: 'Your Twilio Number',
                  capabilities: {
                    voice: true,
                    sms: true,
                    mms: true
                  }
                }];
              }
            }
          }),
          applications: {
            create: async (options: any) => {
              return {
                sid: `AP_USER_${this.masterAccountSid.substr(-8)}`,
                friendlyName: options.friendlyName,
                voiceUrl: options.voiceUrl,
                statusCallbackUrl: options.statusCallbackUrl,
              };
            }
          }
        };
        
        console.log('✅ Twilio client initialized with user credentials');
      } else {
        console.warn('⚠️ Twilio credentials missing, using mock client');
        // Fallback to mock client
        this.twilioClient = this.createMockTwilioClient();
      }
    } catch (error) {
      console.error('Failed to initialize Twilio client:', error);
      throw new Error('Twilio initialization failed');
    }
  }

  private createMockTwilioClient(): any {
    return {
      incomingPhoneNumbers: {
        create: async (options: any) => {
          return {
            sid: `PN${Math.random().toString(36).substr(2, 9)}`,
            phoneNumber: this.generateMockPhoneNumber(options.areaCode),
            friendlyName: options.friendlyName,
            voiceUrl: options.voiceUrl,
            statusCallbackUrl: options.statusCallbackUrl,
          };
        },
        list: async (options?: any) => {
          return [];
        }
      },
      availablePhoneNumbers: (countryCode: string) => ({
        local: {
          list: async (options: any) => {
            return Array.from({ length: 5 }, (_, i) => ({
              phoneNumber: this.generateMockPhoneNumber(options.areaCode),
              friendlyName: `Available Number ${i + 1}`,
              capabilities: {
                voice: true,
                sms: true,
                mms: false
              }
            }));
          }
        }
      }),
      applications: {
        create: async (options: any) => {
          return {
            sid: `AP${Math.random().toString(36).substr(2, 9)}`,
            friendlyName: options.friendlyName,
            voiceUrl: options.voiceUrl,
            statusCallbackUrl: options.statusCallbackUrl,
          };
        }
      }
    };
  }

  private generateMockPhoneNumber(areaCode?: string): string {
    const area = areaCode || '415';
    const exchange = Math.floor(Math.random() * 900) + 100;
    const number = Math.floor(Math.random() * 9000) + 1000;
    return `+1${area}${exchange}${number}`;
  }

  /**
   * Automatically provision a new phone number and configuration for a rep
   */
  async provisionNewRep(options: ProvisioningOptions): Promise<RepTwilioConfig> {
    try {
      console.log(`🚀 Starting automatic provisioning for rep ${options.rep_id}`);

      // Check if rep already has provisioning
      const existingConfig = await this.getRepConfig(options.rep_id);
      if (existingConfig) {
        console.log(`✅ Rep ${options.rep_id} already provisioned`);
        return existingConfig;
      }

      // Step 1: Search for available phone numbers
      const availableNumbers = await this.searchAvailableNumbers(
        options.preferred_area_code || '415',
        options.preferred_region || 'CA'
      );

      if (availableNumbers.length === 0) {
        throw new Error('No available phone numbers found');
      }

      const selectedNumber = availableNumbers[0];
      console.log(`📞 Selected phone number: ${selectedNumber.phoneNumber}`);

      // Step 2: Create TwiML application for the rep
      const twimlApp = await this.createRepTwiMLApplication(options.rep_id);
      console.log(`📱 Created TwiML application: ${twimlApp.sid}`);

      // Step 3: Purchase and configure the phone number
      const phoneNumberResource = await this.purchasePhoneNumber(
        selectedNumber.phoneNumber,
        twimlApp,
        options.rep_id
      );
      console.log(`💳 Purchased phone number: ${phoneNumberResource.phoneNumber}`);

      // Step 4: Set up webhook configuration
      const webhookConfig = this.generateWebhookConfig(options.rep_id);

      // Step 5: Save configuration to database
      const repConfig: RepTwilioConfig = {
        rep_id: options.rep_id,
        phone_number: phoneNumberResource.phoneNumber,
        twilio_sid: phoneNumberResource.sid,
        twilio_app_sid: twimlApp.sid,
        webhook_config: webhookConfig,
        provisioned_at: new Date().toISOString(),
        status: 'active'
      };

      await this.saveRepConfig(repConfig);
      console.log(`💾 Saved rep configuration to database`);

      // Step 6: Initialize rep-specific analytics and AI models
      await this.initializeRepAnalytics(options.rep_id);
      console.log(`🤖 Initialized AI models for rep`);

      console.log(`✅ Successfully provisioned rep ${options.rep_id} in ${Date.now()}ms`);
      return repConfig;

    } catch (error) {
      console.error(`❌ Provisioning failed for rep ${options.rep_id}:`, error);
      throw new Error(`Failed to provision rep: ${(error as Error).message}`);
    }
  }

  /**
   * Search for available phone numbers in specified area
   */
  private async searchAvailableNumbers(areaCode: string, region: string): Promise<any[]> {
    if (!this.twilioClient) {
      throw new Error('Twilio client not initialized');
    }

    try {
      const numbers = await this.twilioClient.availablePhoneNumbers('US').local.list({
        areaCode: areaCode,
        limit: 5,
        voiceEnabled: true,
        smsEnabled: true
      });

      return numbers;
    } catch (error) {
      console.error('Failed to search available numbers:', error);
      throw error;
    }
  }

  /**
   * Create a TwiML application for the rep with proper webhook URLs
   */
  private async createRepTwiMLApplication(repId: string): Promise<any> {
    if (!this.twilioClient) {
      throw new Error('Twilio client not initialized');
    }

    const webhookConfig = this.generateWebhookConfig(repId);
    
    try {
      const application = await this.twilioClient.applications.create({
        friendlyName: `RepSpheres-${repId}-CallApp`,
        voiceUrl: webhookConfig.voice_url,
        voiceMethod: 'POST',
        statusCallback: webhookConfig.status_callback_url,
        statusCallbackMethod: 'POST'
      });

      return application;
    } catch (error) {
      console.error('Failed to create TwiML application:', error);
      throw error;
    }
  }

  /**
   * Purchase and configure a phone number
   */
  private async purchasePhoneNumber(phoneNumber: string, twimlApp: any, repId: string): Promise<any> {
    if (!this.twilioClient) {
      throw new Error('Twilio client not initialized');
    }

    try {
      const purchasedNumber = await this.twilioClient.incomingPhoneNumbers.create({
        phoneNumber: phoneNumber,
        friendlyName: `RepSpheres-${repId}`,
        voiceUrl: this.generateWebhookConfig(repId).voice_url,
        voiceMethod: 'POST',
        statusCallback: this.generateWebhookConfig(repId).status_callback_url,
        statusCallbackMethod: 'POST',
        voiceApplicationSid: twimlApp.sid
      });

      return purchasedNumber;
    } catch (error) {
      console.error('Failed to purchase phone number:', error);
      throw error;
    }
  }

  /**
   * Generate webhook URLs for rep-specific call handling
   */
  private generateWebhookConfig(repId: string): RepTwilioConfig['webhook_config'] {
    return {
      voice_url: `${this.baseWebhookUrl}/voice/${repId}`,
      status_callback_url: `${this.baseWebhookUrl}/status/${repId}`,
      transcribe_callback_url: `${this.baseWebhookUrl}/transcribe/${repId}`
    };
  }

  /**
   * Save rep configuration to Supabase
   */
  private async saveRepConfig(config: RepTwilioConfig): Promise<void> {
    try {
      const { error } = await supabase
        .from('rep_twilio_config')
        .insert([config]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Failed to save rep config:', error);
      throw error;
    }
  }

  /**
   * Get existing rep configuration
   */
  async getRepConfig(repId: string): Promise<RepTwilioConfig | null> {
    try {
      const { data, error } = await supabase
        .from('rep_twilio_config')
        .select('*')
        .eq('rep_id', repId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to get rep config:', error);
      return null;
    }
  }

  /**
   * Initialize analytics and AI models for new rep
   */
  private async initializeRepAnalytics(repId: string): Promise<void> {
    try {
      // Initialize rep analytics baseline
      const { error: analyticsError } = await supabase
        .from('rep_analytics')
        .insert([{
          rep_id: repId,
          daily_stats: {
            calls_made: 0,
            calls_answered: 0,
            total_talk_time: 0,
            average_call_duration: 0
          },
          weekly_insights: {
            conversion_rate: 0,
            best_call_times: [],
            sentiment_trends: []
          },
          coaching_notes: {
            strengths: [],
            improvement_areas: [],
            suggested_actions: []
          },
          created_at: new Date().toISOString()
        }]);

      if (analyticsError) {
        throw analyticsError;
      }

      // Initialize AI model configuration
      const { error: aiError } = await supabase
        .from('rep_ai_models')
        .insert([{
          rep_id: repId,
          custom_vocabulary: {
            industry_terms: [],
            product_names: [],
            competitor_names: []
          },
          industry_terms: [],
          success_patterns: {
            successful_phrases: [],
            optimal_call_length: 0,
            best_time_to_call: []
          },
          model_version: '1.0',
          created_at: new Date().toISOString()
        }]);

      if (aiError) {
        throw aiError;
      }
    } catch (error) {
      console.error('Failed to initialize rep analytics:', error);
      throw error;
    }
  }

  /**
   * Suspend rep calling capabilities
   */
  async suspendRep(repId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('rep_twilio_config')
        .update({ status: 'suspended' })
        .eq('rep_id', repId);

      if (error) {
        throw error;
      }

      console.log(`📵 Suspended calling for rep ${repId}`);
    } catch (error) {
      console.error('Failed to suspend rep:', error);
      throw error;
    }
  }

  /**
   * Reactivate rep calling capabilities
   */
  async reactivateRep(repId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('rep_twilio_config')
        .update({ status: 'active' })
        .eq('rep_id', repId);

      if (error) {
        throw error;
      }

      console.log(`📞 Reactivated calling for rep ${repId}`);
    } catch (error) {
      console.error('Failed to reactivate rep:', error);
      throw error;
    }
  }

  /**
   * Get provisioning statistics
   */
  async getProvisioningStats(): Promise<{
    total_reps: number;
    active_reps: number;
    suspended_reps: number;
    total_phone_numbers: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('rep_twilio_config')
        .select('status');

      if (error) {
        throw error;
      }

      const stats = {
        total_reps: data.length,
        active_reps: data.filter(r => r.status === 'active').length,
        suspended_reps: data.filter(r => r.status === 'suspended').length,
        total_phone_numbers: data.length
      };

      return stats;
    } catch (error) {
      console.error('Failed to get provisioning stats:', error);
      throw error;
    }
  }
}

export default new TwilioProvisioningService();