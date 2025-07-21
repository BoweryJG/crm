import { supabase } from '../supabase/supabase';

export enum WorkflowType {
  EMAIL_SEQUENCE = 'email_sequence',
  REPORT_GENERATION = 'report_generation',
  OUTREACH_CAMPAIGN = 'outreach_campaign',
  CONTENT_GENERATION = 'content_generation',
  PLAUD_RECORDING = 'plaud_recording',
  PR_DISTRIBUTION = 'pr_distribution',
  MAGIC_LINK = 'magic_link',
}

export enum WorkflowStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  type: WorkflowType;
  status: WorkflowStatus;
  description: string;
  lastRun?: string;
  nextRun?: string;
  successRate: number;
  config?: any;
  created_at: string;
  updated_at: string;
}

export interface AutomationStats {
  activeWorkflows: number;
  scheduledTasks: number;
  successRate: number;
  timeSaved: string;
  magicLinksGenerated: number;
  emailsSent: number;
  reportsGenerated: number;
}

export interface MagicLinkAutomation {
  id: string;
  token: string;
  workflow_type: WorkflowType;
  target_email?: string;
  target_contact_id?: string;
  created_at: string;
  used_at?: string;
  expires_at: string;
  metadata?: any;
}

class ComprehensiveAutomationService {
  private backendUrl: string;

  constructor() {
    this.backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://osbackend-zl1h.onrender.com';
  }

  // Get all automation workflows
  async getWorkflows(): Promise<{ data: AutomationWorkflow[] | null; error: Error | null }> {
    try {
      // Get workflows from Supabase
      const { data: dbWorkflows, error: dbError } = await supabase
        .from('automation_workflows')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;

      // Get webhook status from backend
      const response = await fetch(`${this.backendUrl}/webhook/plaud-zapier/config`);
      const webhookConfig = response.ok ? await response.json() : null;

      // Combine data including webhook automations
      const workflows: AutomationWorkflow[] = dbWorkflows || [];

      // Add Zapier/PLAUD webhook as a workflow if configured
      if (webhookConfig?.status === 'configured') {
        workflows.push({
          id: 'plaud-zapier',
          name: 'PLAUD Audio Recording Automation',
          type: WorkflowType.PLAUD_RECORDING,
          status: WorkflowStatus.ACTIVE,
          description: 'Automatically process audio recordings, create tasks, and match contacts',
          successRate: 95,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      return { data: workflows, error: null };
    } catch (error) {
      console.error('Error fetching workflows:', error);
      return { data: null, error: error as Error };
    }
  }

  // Get automation statistics
  async getStats(): Promise<{ data: AutomationStats | null; error: Error | null }> {
    try {
      // Get various stats from Supabase
      const [workflowStats, taskStats, magicLinkStats] = await Promise.all([
        supabase
          .from('automation_workflows')
          .select('status, success_rate')
          .in('status', [WorkflowStatus.ACTIVE, WorkflowStatus.SCHEDULED]),
        supabase
          .from('automation_tasks')
          .select('id, created_at')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase
          .from('automation_magic_links')
          .select('id, created_at')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      ]);

      const activeWorkflows = workflowStats.data?.filter(w => w.status === WorkflowStatus.ACTIVE).length || 0;
      const scheduledTasks = workflowStats.data?.filter(w => w.status === WorkflowStatus.SCHEDULED).length || 0;
      const successRateSum = workflowStats.data?.reduce((acc, w) => acc + (w.success_rate || 0), 0) || 0;
      const workflowCount = workflowStats.data?.length || 1;
      const avgSuccessRate = successRateSum / workflowCount;
      
      // Calculate time saved (mock calculation - would need real metrics)
      const tasksCreated = taskStats.data?.length || 0;
      const timeSavedHours = tasksCreated * 0.5 + (magicLinkStats.data?.length || 0) * 0.25;

      return {
        data: {
          activeWorkflows,
          scheduledTasks,
          successRate: Math.round(avgSuccessRate),
          timeSaved: `${timeSavedHours.toFixed(1)} hrs/week`,
          magicLinksGenerated: magicLinkStats.data?.length || 0,
          emailsSent: 0, // Would need to track this
          reportsGenerated: 0, // Would need to track this
        },
        error: null,
      };
    } catch (error) {
      console.error('Error fetching automation stats:', error);
      return { data: null, error: error as Error };
    }
  }

  // Create a new automation workflow
  async createWorkflow(workflow: Partial<AutomationWorkflow>): Promise<{ data: AutomationWorkflow | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('automation_workflows')
        .insert([{
          ...workflow,
          status: WorkflowStatus.PAUSED,
          success_rate: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error creating workflow:', error);
      return { data: null, error: error as Error };
    }
  }

  // Update workflow status
  async updateWorkflowStatus(workflowId: string, status: WorkflowStatus): Promise<{ data: AutomationWorkflow | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('automation_workflows')
        .update({
          status,
          updated_at: new Date().toISOString(),
          last_run: status === WorkflowStatus.ACTIVE ? new Date().toISOString() : undefined,
        })
        .eq('id', workflowId)
        .select()
        .single();

      if (error) throw error;

      // Trigger backend automation if activating
      if (status === WorkflowStatus.ACTIVE) {
        await this.triggerBackendWorkflow(workflowId);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error updating workflow status:', error);
      return { data: null, error: error as Error };
    }
  }

  // Generate a magic link for one-off automation
  async generateMagicLink(params: {
    workflowType: WorkflowType;
    targetEmail?: string;
    targetContactId?: string;
    expiresInHours?: number;
    metadata?: any;
  }): Promise<{ data: MagicLinkAutomation | null; error: Error | null }> {
    try {
      const token = this.generateSecureToken();
      const expiresAt = new Date(Date.now() + (params.expiresInHours || 24) * 60 * 60 * 1000);

      const { data, error } = await supabase
        .from('automation_magic_links')
        .insert([{
          token,
          workflow_type: params.workflowType,
          target_email: params.targetEmail,
          target_contact_id: params.targetContactId,
          expires_at: expiresAt.toISOString(),
          metadata: params.metadata,
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error generating magic link:', error);
      return { data: null, error: error as Error };
    }
  }

  // Get magic link automations
  async getMagicLinks(filter?: { used?: boolean; expired?: boolean }): Promise<{ data: MagicLinkAutomation[] | null; error: Error | null }> {
    try {
      let query = supabase
        .from('automation_magic_links')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter?.used !== undefined) {
        query = filter.used 
          ? query.not('used_at', 'is', null)
          : query.is('used_at', null);
      }

      if (filter?.expired !== undefined) {
        const now = new Date().toISOString();
        query = filter.expired
          ? query.lt('expires_at', now)
          : query.gte('expires_at', now);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching magic links:', error);
      return { data: null, error: error as Error };
    }
  }

  // Trigger email campaign automation
  async triggerEmailCampaign(params: {
    templateId: string;
    contactIds: string[];
    subject: string;
    scheduledAt?: string;
  }): Promise<{ data: any; error: Error | null }> {
    try {
      const response = await fetch(`${this.backendUrl}/api/crm/email/campaign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Email campaign failed: ${response.statusText}`);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error triggering email campaign:', error);
      return { data: null, error: error as Error };
    }
  }

  // Private helper methods
  private generateSecureToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private async triggerBackendWorkflow(workflowId: string): Promise<void> {
    try {
      const response = await fetch(`${this.backendUrl}/api/crm/automation/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workflowId }),
      });

      if (!response.ok) {
        console.warn(`Backend workflow trigger returned status ${response.status}`);
      }
    } catch (error) {
      console.error('Error triggering backend workflow:', error);
    }
  }
}

export default new ComprehensiveAutomationService();