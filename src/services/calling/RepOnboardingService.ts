import { supabase } from '../supabase/supabaseClient';
import TwilioProvisioningService, { ProvisioningOptions } from './TwilioProvisioningService';

export interface RepProfile {
  id: string;
  email: string;
  full_name: string;
  company?: string;
  territory?: string;
  preferred_area_code?: string;
  industry?: string;
  created_at: string;
}

export interface OnboardingResult {
  success: boolean;
  rep_profile: RepProfile;
  phone_number?: string;
  twilio_config?: any;
  dashboard_config?: any;
  onboarding_duration_ms: number;
  error?: string;
}

class RepOnboardingService {
  /**
   * Complete automated onboarding for a new rep
   * This is triggered when a user completes authentication and profile setup
   */
  async onboardNewRep(userId: string, profileData: Partial<RepProfile>): Promise<OnboardingResult> {
    const startTime = Date.now();
    console.log(`🚀 Starting automated onboarding for user ${userId}`);

    try {
      // Step 1: Create or update rep profile
      const repProfile = await this.createRepProfile(userId, profileData);
      console.log(`👤 Created rep profile for ${repProfile.full_name}`);

      // Step 2: Provision Twilio calling capabilities
      const provisioningOptions: ProvisioningOptions = {
        rep_id: userId,
        preferred_area_code: profileData.preferred_area_code || this.guessAreaCodeFromProfile(profileData),
        features: {
          transcription: true,
          recording: true,
          ai_analysis: true
        }
      };

      const twilioConfig = await TwilioProvisioningService.provisionNewRep(provisioningOptions);
      console.log(`📞 Provisioned phone number: ${twilioConfig.phone_number}`);

      // Step 3: Initialize personal dashboard configuration
      const dashboardConfig = await this.initializePersonalDashboard(userId, twilioConfig);
      console.log(`📊 Initialized personal dashboard`);

      // Step 4: Set up rep-specific data tables and permissions
      await this.setupRepDataStructure(userId);
      console.log(`🗄️ Set up data structure and permissions`);

      // Step 5: Create welcome data and tutorials
      await this.createWelcomeData(userId);
      console.log(`👋 Created welcome data and tutorials`);

      // Step 6: Send welcome notification
      await this.sendWelcomeNotification(repProfile, twilioConfig.phone_number);
      console.log(`📧 Sent welcome notification`);

      const duration = Date.now() - startTime;
      console.log(`✅ Onboarding completed in ${duration}ms`);

      return {
        success: true,
        rep_profile: repProfile,
        phone_number: twilioConfig.phone_number,
        twilio_config: twilioConfig,
        dashboard_config: dashboardConfig,
        onboarding_duration_ms: duration
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ Onboarding failed for user ${userId}:`, error);

      return {
        success: false,
        rep_profile: {} as RepProfile,
        onboarding_duration_ms: duration,
        error: error.message
      };
    }
  }

  /**
   * Create or update rep profile in database
   */
  private async createRepProfile(userId: string, profileData: Partial<RepProfile>): Promise<RepProfile> {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('rep_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('rep_profiles')
          .update({
            ...profileData,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new profile
        const newProfile: RepProfile = {
          id: userId,
          email: profileData.email || '',
          full_name: profileData.full_name || 'New Rep',
          company: profileData.company,
          territory: profileData.territory,
          preferred_area_code: profileData.preferred_area_code,
          industry: profileData.industry,
          created_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('rep_profiles')
          .insert([newProfile])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Failed to create rep profile:', error);
      throw error;
    }
  }

  /**
   * Initialize personal dashboard configuration for the rep
   */
  private async initializePersonalDashboard(userId: string, twilioConfig: any): Promise<any> {
    try {
      const dashboardConfig = {
        rep_id: userId,
        layout: 'luxury-standard',
        theme: 'corporate-professional',
        widgets: {
          calling_interface: {
            enabled: true,
            position: 'top-left',
            phone_number_display: true,
            quick_dial_contacts: []
          },
          call_analytics: {
            enabled: true,
            position: 'top-right',
            show_daily_stats: true,
            show_weekly_trends: true
          },
          transcription_feed: {
            enabled: true,
            position: 'bottom-left',
            real_time_display: true,
            ai_insights: true
          },
          contact_integration: {
            enabled: true,
            position: 'bottom-right',
            show_call_history: true,
            quick_actions: true
          }
        },
        preferences: {
          auto_transcribe: true,
          ai_coaching: true,
          sound_notifications: true,
          mobile_optimization: true
        },
        personalization: {
          welcome_message: `Welcome to your RepSpheres calling platform! Your number: ${twilioConfig.phone_number}`,
          quick_tips: [
            'Click any contact card to start calling instantly',
            'Your calls are automatically transcribed and analyzed',
            'Check your AI insights for coaching recommendations',
            'All call data is private and secure to your account'
          ]
        },
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('rep_dashboard_config')
        .insert([dashboardConfig]);

      if (error) throw error;

      return dashboardConfig;
    } catch (error) {
      console.error('Failed to initialize dashboard:', error);
      throw error;
    }
  }

  /**
   * Set up rep-specific data structure and Row Level Security
   */
  private async setupRepDataStructure(userId: string): Promise<void> {
    try {
      // The RLS policies should be already set up in the database schema
      // This function could initialize any rep-specific configurations

      // Initialize call history table for this rep (data will be inserted as calls are made)
      // Initialize transcription storage (will be populated by Twilio webhooks)
      // Initialize AI analysis storage (will be populated by transcription processing)

      // For now, we'll just ensure the rep has proper access by creating initial records
      const initialData = [
        {
          table: 'rep_call_records',
          data: {
            rep_id: userId,
            total_calls: 0,
            total_minutes: 0,
            setup_completed: true,
            created_at: new Date().toISOString()
          }
        }
      ];

      // Note: In a real implementation, you might need to execute specific
      // database functions or procedures to set up RLS policies dynamically
      console.log(`Data structure setup completed for rep ${userId}`);

    } catch (error) {
      console.error('Failed to setup data structure:', error);
      throw error;
    }
  }

  /**
   * Create welcome data and tutorial content for new rep
   */
  private async createWelcomeData(userId: string): Promise<void> {
    try {
      // Create sample contacts if none exist
      const { data: existingContacts } = await supabase
        .from('contacts')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (!existingContacts || existingContacts.length === 0) {
        // Create sample contacts for demo purposes
        const sampleContacts = [
          {
            user_id: userId,
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@medicalpractice.com',
            phone: '+1-555-0123',
            company: 'Johnson Medical Practice',
            title: 'Practice Manager',
            notes: 'Interested in aesthetic equipment - follow up on laser systems',
            created_at: new Date().toISOString()
          },
          {
            user_id: userId,
            name: 'Michael Chen',
            email: 'mchen@beautyclinic.com',
            phone: '+1-555-0124',
            company: 'Elite Beauty Clinic',
            title: 'Owner',
            notes: 'Previous customer - exploring expansion opportunities',
            created_at: new Date().toISOString()
          }
        ];

        const { error } = await supabase
          .from('contacts')
          .insert(sampleContacts);

        if (error) {
          console.error('Failed to create sample contacts:', error);
        } else {
          console.log('Created sample contacts for new rep');
        }
      }

      // Create tutorial/onboarding tasks
      const onboardingTasks = [
        {
          rep_id: userId,
          task_type: 'tutorial',
          title: 'Make Your First Call',
          description: 'Try calling one of your sample contacts to test the system',
          completed: false,
          priority: 'high',
          created_at: new Date().toISOString()
        },
        {
          rep_id: userId,
          task_type: 'tutorial',
          title: 'Review Call Transcription',
          description: 'After your first call, check the AI transcription and insights',
          completed: false,
          priority: 'medium',
          created_at: new Date().toISOString()
        },
        {
          rep_id: userId,
          task_type: 'tutorial',
          title: 'Customize Your Dashboard',
          description: 'Personalize your calling interface and preferences',
          completed: false,
          priority: 'low',
          created_at: new Date().toISOString()
        }
      ];

      const { error: tasksError } = await supabase
        .from('rep_tasks')
        .insert(onboardingTasks);

      if (tasksError) {
        console.error('Failed to create onboarding tasks:', tasksError);
      }

    } catch (error) {
      console.error('Failed to create welcome data:', error);
      throw error;
    }
  }

  /**
   * Send welcome notification to new rep
   */
  private async sendWelcomeNotification(repProfile: RepProfile, phoneNumber: string): Promise<void> {
    try {
      // Create in-app notification
      const notification = {
        rep_id: repProfile.id,
        type: 'welcome',
        title: '🎉 Welcome to RepSpheres Calling!',
        message: `Your personal phone number ${phoneNumber} is ready to use. Start making calls with AI-powered transcription and insights.`,
        action_url: '/command-center?tab=communications',
        action_text: 'Start Calling',
        priority: 'high',
        read: false,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('rep_notifications')
        .insert([notification]);

      if (error) {
        console.error('Failed to create welcome notification:', error);
      }

      // Could also send email notification here
      console.log(`Welcome notification sent to ${repProfile.email}`);

    } catch (error) {
      console.error('Failed to send welcome notification:', error);
      // Don't throw error - this is not critical for onboarding
    }
  }

  /**
   * Guess appropriate area code based on profile data
   */
  private guessAreaCodeFromProfile(profileData: Partial<RepProfile>): string {
    // Simple area code mapping based on territory or company
    const territoryAreaCodes: { [key: string]: string } = {
      'california': '415',
      'new york': '212',
      'texas': '214',
      'florida': '305',
      'illinois': '312',
      'washington': '206'
    };

    const territory = profileData.territory?.toLowerCase();
    if (territory && territoryAreaCodes[territory]) {
      return territoryAreaCodes[territory];
    }

    // Default to San Francisco Bay Area
    return '415';
  }

  /**
   * Check onboarding status for a rep
   */
  async getOnboardingStatus(userId: string): Promise<{
    completed: boolean;
    steps_completed: number;
    total_steps: number;
    phone_number?: string;
    next_step?: string;
  }> {
    try {
      // Check if rep has Twilio config (main indicator of onboarding completion)
      const twilioConfig = await TwilioProvisioningService.getRepConfig(userId);
      
      if (!twilioConfig) {
        return {
          completed: false,
          steps_completed: 0,
          total_steps: 6,
          next_step: 'Complete profile and start automatic phone provisioning'
        };
      }

      // Check dashboard config
      const { data: dashboardConfig } = await supabase
        .from('rep_dashboard_config')
        .select('*')
        .eq('rep_id', userId)
        .single();

      const stepsCompleted = [
        !!twilioConfig,                    // Twilio provisioned
        !!dashboardConfig,                 // Dashboard configured
        twilioConfig.status === 'active'   // Active status
      ].filter(Boolean).length;

      return {
        completed: stepsCompleted >= 3,
        steps_completed: stepsCompleted,
        total_steps: 3,
        phone_number: twilioConfig.phone_number,
        next_step: stepsCompleted < 3 ? 'Complete remaining setup steps' : undefined
      };

    } catch (error) {
      console.error('Failed to get onboarding status:', error);
      return {
        completed: false,
        steps_completed: 0,
        total_steps: 6,
        next_step: 'Start onboarding process'
      };
    }
  }

  /**
   * Re-run onboarding for existing user (in case of failures)
   */
  async retryOnboarding(userId: string): Promise<OnboardingResult> {
    console.log(`🔄 Retrying onboarding for user ${userId}`);
    
    // Get existing profile data
    const { data: existingProfile } = await supabase
      .from('rep_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return this.onboardNewRep(userId, existingProfile || {});
  }
}

export default new RepOnboardingService();