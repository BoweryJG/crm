// Email Automation Engine - Central Orchestrator for Award-Winning Email Automation System
// Connects AutomationHub, UltraEmailModal, SendOptimizer, and EmailAnalytics

import { EventEmitter } from 'events';
import { supabase } from '../supabase/supabase';

// Core Types
export interface AutomationTrigger {
  id: string;
  type: 'time_based' | 'behavior' | 'event' | 'contact_action';
  name: string;
  description: string;
  conditions: TriggerCondition[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TriggerCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
  value: any;
  logic?: 'AND' | 'OR';
}

export interface EmailAutomation {
  id: string;
  name: string;
  description: string;
  trigger_id: string;
  workflow_steps: WorkflowStep[];
  active: boolean;
  performance_metrics: AutomationMetrics;
  created_at: string;
  updated_at: string;
}

export interface WorkflowStep {
  id: string;
  type: 'email' | 'delay' | 'condition' | 'action';
  order: number;
  config: StepConfig;
  next_step_id?: string;
  condition_branches?: ConditionalBranch[];
}

export interface StepConfig {
  // Email step config
  template_id?: string;
  subject?: string;
  body?: string;
  send_optimization?: boolean;
  
  // Delay step config
  delay_amount?: number;
  delay_unit?: 'minutes' | 'hours' | 'days';
  
  // Condition step config
  condition_type?: 'contact_property' | 'email_engagement' | 'time_based';
  condition_rules?: TriggerCondition[];
  
  // Action step config
  action_type?: 'add_tag' | 'update_property' | 'create_task';
  action_data?: any;
}

export interface ConditionalBranch {
  condition: TriggerCondition;
  next_step_id: string;
  label: string;
}

export interface AutomationMetrics {
  total_triggered: number;
  emails_sent: number;
  emails_opened: number;
  emails_clicked: number;
  conversions: number;
  open_rate: number;
  click_rate: number;
  conversion_rate: number;
  revenue_generated?: number;
}

export interface AutomationExecution {
  id: string;
  automation_id: string;
  contact_id: string;
  current_step_id: string;
  status: 'active' | 'completed' | 'paused' | 'failed';
  started_at: string;
  scheduled_next_step?: string;
  execution_data: any;
}

// Main Email Automation Engine Class
export class EmailAutomationEngine extends EventEmitter {
  private static instance: EmailAutomationEngine;
  private activeExecutions: Map<string, AutomationExecution> = new Map();
  private automations: Map<string, EmailAutomation> = new Map();
  private triggers: Map<string, AutomationTrigger> = new Map();
  private executionQueue: AutomationExecution[] = [];
  private processingInterval: NodeJS.Timeout | null = null;

  private constructor() {
    super();
    this.initializeEngine();
  }

  public static getInstance(): EmailAutomationEngine {
    if (!EmailAutomationEngine.instance) {
      EmailAutomationEngine.instance = new EmailAutomationEngine();
    }
    return EmailAutomationEngine.instance;
  }

  // Initialize the automation engine
  private async initializeEngine(): Promise<void> {
    try {
      await this.loadAutomations();
      await this.loadTriggers();
      await this.loadActiveExecutions();
      this.startProcessingQueue();
      
      // EmailAutomationEngine initialized successfully
      this.emit('engine_ready');
    } catch (error) {
      console.error('❌ Failed to initialize EmailAutomationEngine:', error);
      this.emit('engine_error', error);
    }
  }

  // Load all automations from database
  private async loadAutomations(): Promise<void> {
    const { data, error } = await supabase
      .from('email_automations')
      .select('*')
      .eq('active', true);

    if (error) throw error;

    if (data) {
      data.forEach(automation => {
        this.automations.set(automation.id, automation);
      });
    }
  }

  // Load all triggers from database
  private async loadTriggers(): Promise<void> {
    const { data, error } = await supabase
      .from('automation_triggers')
      .select('*')
      .eq('active', true);

    if (error) throw error;

    if (data) {
      data.forEach(trigger => {
        this.triggers.set(trigger.id, trigger);
      });
    }
  }

  // Load active executions
  private async loadActiveExecutions(): Promise<void> {
    const { data, error } = await supabase
      .from('automation_executions')
      .select('*')
      .in('status', ['active', 'paused']);

    if (error) throw error;

    if (data) {
      data.forEach(execution => {
        this.activeExecutions.set(execution.id, execution);
        if (execution.status === 'active') {
          this.executionQueue.push(execution);
        }
      });
    }
  }

  // Start processing queue
  private startProcessingQueue(): void {
    this.processingInterval = setInterval(() => {
      this.processExecutionQueue();
    }, 5000); // Process every 5 seconds
  }

  // Process automation execution queue
  private async processExecutionQueue(): Promise<void> {
    if (this.executionQueue.length === 0) return;

    const execution = this.executionQueue.shift();
    if (!execution) return;

    try {
      await this.processExecutionStep(execution);
    } catch (error) {
      console.error('❌ Error processing automation step:', error);
      await this.handleExecutionError(execution, error);
    }
  }

  // Process individual execution step
  private async processExecutionStep(execution: AutomationExecution): Promise<void> {
    const automation = this.automations.get(execution.automation_id);
    if (!automation) {
      throw new Error(`Automation ${execution.automation_id} not found`);
    }

    const currentStep = automation.workflow_steps.find(
      step => step.id === execution.current_step_id
    );
    
    if (!currentStep) {
      throw new Error(`Step ${execution.current_step_id} not found in automation`);
    }

    switch (currentStep.type) {
      case 'email':
        await this.processEmailStep(execution, currentStep);
        break;
      case 'delay':
        await this.processDelayStep(execution, currentStep);
        break;
      case 'condition':
        await this.processConditionStep(execution, currentStep);
        break;
      case 'action':
        await this.processActionStep(execution, currentStep);
        break;
    }
  }

  // Process email step - integrates with UltraEmailModal
  private async processEmailStep(execution: AutomationExecution, step: WorkflowStep): Promise<void> {
    const config = step.config;
    
    // Prepare email data for UltraEmailModal integration
    const emailData = {
      to: [await this.getContactEmail(execution.contact_id)],
      subject: await this.personalizeContent(config.subject || '', execution.contact_id),
      body: await this.personalizeContent(config.body || '', execution.contact_id),
      template_id: config.template_id,
      automation_id: execution.automation_id,
      execution_id: execution.id,
      send_optimization: config.send_optimization || false
    };

    // Emit event for UltraEmailModal to handle
    this.emit('send_automation_email', emailData);

    // Move to next step
    await this.moveToNextStep(execution, step);
  }

  // Process delay step
  private async processDelayStep(execution: AutomationExecution, step: WorkflowStep): Promise<void> {
    const config = step.config;
    const delayMs = this.calculateDelayMilliseconds(
      config.delay_amount || 1,
      config.delay_unit || 'hours'
    );

    const scheduledTime = new Date(Date.now() + delayMs).toISOString();

    // Update execution to be scheduled for later
    await this.updateExecution(execution.id, {
      scheduled_next_step: scheduledTime,
      current_step_id: step.next_step_id || step.id
    });

    // Don't process immediately - will be picked up when scheduled time arrives
  }

  // Process condition step
  private async processConditionStep(execution: AutomationExecution, step: WorkflowStep): Promise<void> {
    const config = step.config;
    const contactData = await this.getContactData(execution.contact_id);

    // Evaluate conditions
    const conditionMet = await this.evaluateConditions(
      config.condition_rules || [],
      contactData,
      execution
    );

    // Determine next step based on condition result
    let nextStepId = step.next_step_id;
    
    if (step.condition_branches) {
      const matchingBranch = step.condition_branches.find(branch => {
        return this.evaluateSingleCondition(branch.condition, contactData, execution);
      });
      
      if (matchingBranch) {
        nextStepId = matchingBranch.next_step_id;
      }
    }

    // Move to appropriate next step
    execution.current_step_id = nextStepId || execution.current_step_id;
    await this.updateExecution(execution.id, { current_step_id: execution.current_step_id });
    
    // Continue processing if not at end
    if (nextStepId) {
      this.executionQueue.push(execution);
    }
  }

  // Process action step
  private async processActionStep(execution: AutomationExecution, step: WorkflowStep): Promise<void> {
    const config = step.config;

    switch (config.action_type) {
      case 'add_tag':
        await this.addContactTag(execution.contact_id, config.action_data.tag);
        break;
      case 'update_property':
        await this.updateContactProperty(
          execution.contact_id,
          config.action_data.property,
          config.action_data.value
        );
        break;
      case 'create_task':
        await this.createTask(execution.contact_id, config.action_data);
        break;
    }

    // Move to next step
    await this.moveToNextStep(execution, step);
  }

  // Trigger automation based on event
  public async triggerAutomation(
    triggerType: string,
    contactId: string,
    eventData: any = {}
  ): Promise<void> {
    // Find matching triggers
    const matchingTriggers = Array.from(this.triggers.values()).filter(
      trigger => trigger.type === triggerType && trigger.active
    );

    for (const trigger of matchingTriggers) {
      // Check if trigger conditions are met
      const conditionsMet = await this.evaluateTriggerConditions(
        trigger.conditions,
        contactId,
        eventData
      );

      if (conditionsMet) {
        // Find automations for this trigger
        const automation = Array.from(this.automations.values()).find(
          auto => auto.trigger_id === trigger.id && auto.active
        );

        if (automation) {
          await this.startAutomationExecution(automation, contactId, eventData);
        }
      }
    }
  }

  // Start new automation execution
  private async startAutomationExecution(
    automation: EmailAutomation,
    contactId: string,
    eventData: any
  ): Promise<void> {
    const execution: AutomationExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      automation_id: automation.id,
      contact_id: contactId,
      current_step_id: automation.workflow_steps[0]?.id || '',
      status: 'active',
      started_at: new Date().toISOString(),
      execution_data: eventData
    };

    // Save to database with proper error handling
    const { error: insertError } = await supabase
      .from('automation_executions')
      .insert(execution);
    
    if (insertError) {
      console.error('Failed to save automation execution:', insertError);
      // Continue execution in memory even if DB save fails
    }

    // Add to active executions and queue
    this.activeExecutions.set(execution.id, execution);
    this.executionQueue.push(execution);

    this.emit('automation_started', { automation, execution, contactId });
  }

  // Helper methods
  private async moveToNextStep(execution: AutomationExecution, currentStep: WorkflowStep): Promise<void> {
    if (currentStep.next_step_id) {
      execution.current_step_id = currentStep.next_step_id;
      await this.updateExecution(execution.id, { current_step_id: execution.current_step_id });
      this.executionQueue.push(execution);
    } else {
      // Automation completed
      execution.status = 'completed';
      await this.updateExecution(execution.id, { status: 'completed' });
      this.activeExecutions.delete(execution.id);
      this.emit('automation_completed', execution);
    }
  }

  private calculateDelayMilliseconds(amount: number, unit: string): number {
    const multipliers = {
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000
    };
    return amount * (multipliers[unit as keyof typeof multipliers] || multipliers.hours);
  }

  private async personalizeContent(content: string, contactId: string): Promise<string> {
    const contactData = await this.getContactData(contactId);
    
    return content
      .replace(/\{\{first_name\}\}/g, contactData.first_name || '')
      .replace(/\{\{last_name\}\}/g, contactData.last_name || '')
      .replace(/\{\{email\}\}/g, contactData.email || '')
      .replace(/\{\{company\}\}/g, contactData.company || '');
  }

  private async getContactEmail(contactId: string): Promise<string> {
    // Try regular contacts table first
    let { data } = await supabase
      .from('contacts')
      .select('email')
      .eq('id', contactId)
      .single();
    
    if (data?.email) {
      return data.email;
    }
    
    // Fallback to public_contacts if not found
    const { data: publicContact } = await supabase
      .from('public_contacts')
      .select('email')
      .eq('id', contactId)
      .single();
    
    return publicContact?.email || '';
  }

  private async getContactData(contactId: string): Promise<any> {
    // Try regular contacts table first
    let { data } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single();
    
    if (data) {
      return data;
    }
    
    // Fallback to public_contacts if not found
    const { data: publicContact } = await supabase
      .from('public_contacts')
      .select('*')
      .eq('id', contactId)
      .single();
    
    return publicContact || {
      id: contactId,
      first_name: 'Unknown',
      last_name: 'Contact',
      email: 'unknown@example.com',
      company: 'Unknown Company'
    };
  }

  private async updateExecution(executionId: string, updates: Partial<AutomationExecution>): Promise<void> {
    await supabase
      .from('automation_executions')
      .update(updates)
      .eq('id', executionId);

    // Update local cache
    const execution = this.activeExecutions.get(executionId);
    if (execution) {
      Object.assign(execution, updates);
    }
  }

  private async evaluateConditions(
    conditions: TriggerCondition[],
    contactData: any,
    execution: AutomationExecution
  ): Promise<boolean> {
    // Implement condition evaluation logic
    return true; // Simplified for now
  }

  private evaluateSingleCondition(
    condition: TriggerCondition,
    contactData: any,
    execution: AutomationExecution
  ): boolean {
    // Implement single condition evaluation
    return true; // Simplified for now
  }

  private async evaluateTriggerConditions(
    conditions: TriggerCondition[],
    contactId: string,
    eventData: any
  ): Promise<boolean> {
    // Implement trigger condition evaluation
    return true; // Simplified for now
  }

  private async addContactTag(contactId: string, tag: string): Promise<void> {
    try {
      // Add tag to contact's tags array
      const contactData = await this.getContactData(contactId);
      const currentTags = contactData.tags || [];
      
      if (!currentTags.includes(tag)) {
        const updatedTags = [...currentTags, tag];
        
        // Try to update contacts table first
        const { error: contactError } = await supabase
          .from('contacts')
          .update({ tags: updatedTags, updated_at: new Date().toISOString() })
          .eq('id', contactId);
        
        if (contactError) {
          // Fallback to public_contacts
          await supabase
            .from('public_contacts')
            .update({ tags: updatedTags, updated_at: new Date().toISOString() })
            .eq('id', contactId);
        }
        
        console.log(`\ud83c\udff7 Added tag '${tag}' to contact ${contactId}`);
      }
    } catch (error) {
      console.error('Failed to add contact tag:', error);
    }
  }

  private async updateContactProperty(contactId: string, property: string, value: any): Promise<void> {
    try {
      const updateData = {
        [property]: value,
        updated_at: new Date().toISOString()
      };
      
      // Try to update contacts table first
      const { error: contactError } = await supabase
        .from('contacts')
        .update(updateData)
        .eq('id', contactId);
      
      if (contactError) {
        // Fallback to public_contacts
        await supabase
          .from('public_contacts')
          .update(updateData)
          .eq('id', contactId);
      }
      
      console.log(`\ud83d\udcdd Updated contact ${contactId} property '${property}' to:`, value);
    } catch (error) {
      console.error('Failed to update contact property:', error);
    }
  }

  private async createTask(contactId: string, taskData: any): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const task = {
        user_id: user.id,
        contact_id: contactId,
        title: taskData.title || 'Automation Task',
        description: taskData.description || 'Task created by email automation',
        due_date: taskData.due_date,
        priority: taskData.priority || 'normal',
        status: 'pending',
        category: 'automation',
        tags: ['email-automation'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Try to insert into tasks table (if it exists)
      const { error } = await supabase
        .from('tasks')
        .insert(task);
      
      if (error) {
        // Fallback: create a note in sales_activities
        await supabase
          .from('sales_activities')
          .insert({
            user_id: user.id,
            contact_id: contactId,
            activity_type: 'task',
            title: task.title,
            description: task.description,
            scheduled_date: task.due_date,
            status: 'scheduled',
            source: 'automation',
            created_at: new Date().toISOString()
          });
      }
      
      console.log(`\u2705 Created automation task for contact ${contactId}:`, task.title);
    } catch (error) {
      console.error('Failed to create automation task:', error);
    }
  }

  private async handleExecutionError(execution: AutomationExecution, error: any): Promise<void> {
    execution.status = 'failed';
    await this.updateExecution(execution.id, { status: 'failed' });
    this.activeExecutions.delete(execution.id);
    this.emit('automation_error', { execution, error });
  }

  // Public API methods
  public async createAutomation(automation: Omit<EmailAutomation, 'id' | 'created_at' | 'updated_at'>): Promise<EmailAutomation> {
    const newAutomation: EmailAutomation = {
      ...automation,
      id: `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('email_automations')
      .insert(newAutomation);
    
    if (error) {
      console.error('Failed to save automation to database:', error);
      throw error;
    }

    this.automations.set(newAutomation.id, newAutomation);
    return newAutomation;
  }

  public async pauseAutomation(automationId: string): Promise<void> {
    const automation = this.automations.get(automationId);
    if (automation) {
      automation.active = false;
      const { error } = await supabase
        .from('email_automations')
        .update({ active: false, updated_at: new Date().toISOString() })
        .eq('id', automationId);
      
      if (error) {
        console.error('Failed to pause automation:', error);
      }
    }
  }

  public async resumeAutomation(automationId: string): Promise<void> {
    const automation = this.automations.get(automationId);
    if (automation) {
      automation.active = true;
      const { error } = await supabase
        .from('email_automations')
        .update({ active: true, updated_at: new Date().toISOString() })
        .eq('id', automationId);
      
      if (error) {
        console.error('Failed to resume automation:', error);
      }
    }
  }

  public getAutomationMetrics(automationId: string): AutomationMetrics | null {
    const automation = this.automations.get(automationId);
    return automation?.performance_metrics || null;
  }

  public getActiveExecutions(): AutomationExecution[] {
    return Array.from(this.activeExecutions.values());
  }

  public async getAutomationsByTrigger(triggerType: string): Promise<EmailAutomation[]> {
    const matchingTriggers = Array.from(this.triggers.values()).filter(
      trigger => trigger.type === triggerType
    );
    
    return Array.from(this.automations.values()).filter(automation =>
      matchingTriggers.some(trigger => trigger.id === automation.trigger_id)
    );
  }

  // Cleanup
  public destroy(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }
    this.removeAllListeners();
  }
}

// Export singleton instance
export const emailAutomationEngine = EmailAutomationEngine.getInstance();