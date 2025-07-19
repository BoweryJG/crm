// Trigger Manager - Advanced Event System for Email Automation
// Handles all automation triggers: behavioral, time-based, contact actions, and custom events

import { EventEmitter } from 'events';
import { emailAutomationEngine, AutomationTrigger, TriggerCondition } from './EmailAutomationEngine';
import { supabase } from '../supabase/supabase';

// Trigger Event Types
export interface TriggerEvent {
  id: string;
  type: 'contact_created' | 'contact_updated' | 'email_opened' | 'email_clicked' | 
        'form_submitted' | 'purchase_made' | 'page_visited' | 'tag_added' | 
        'property_changed' | 'time_based' | 'custom';
  contact_id: string;
  event_data: any;
  timestamp: string;
  source?: string;
}

export interface BehavioralTrigger extends AutomationTrigger {
  behavior_type: 'email_engagement' | 'website_activity' | 'purchase_behavior' | 'form_activity';
  tracking_rules: TrackingRule[];
}

export interface TrackingRule {
  event_type: string;
  conditions: TriggerCondition[];
  frequency_limit?: {
    count: number;
    period: 'hour' | 'day' | 'week' | 'month';
  };
  cooldown_period?: number; // minutes
}

export interface TimeBasedTrigger extends AutomationTrigger {
  schedule_type: 'fixed' | 'relative' | 'recurring';
  schedule_config: ScheduleConfig;
}

export interface ScheduleConfig {
  // Fixed schedule
  fixed_datetime?: string;
  
  // Relative schedule (X time after another event)
  relative_to_event?: string;
  relative_delay?: {
    amount: number;
    unit: 'minutes' | 'hours' | 'days' | 'weeks';
  };
  
  // Recurring schedule
  recurring_pattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number; // every X frequency
    days_of_week?: number[]; // 0-6, Sunday = 0
    day_of_month?: number;
    time_of_day?: string; // HH:MM format
  };
}

// Trigger Manager Class
export class TriggerManager extends EventEmitter {
  private static instance: TriggerManager;
  private activeTriggers: Map<string, AutomationTrigger> = new Map();
  private eventQueue: TriggerEvent[] = [];
  private processingInterval: NodeJS.Timeout | null = null;
  private cooldownMap: Map<string, number> = new Map(); // trigger_id -> last_triggered_timestamp

  private constructor() {
    super();
    this.initializeTriggerManager();
  }

  public static getInstance(): TriggerManager {
    if (!TriggerManager.instance) {
      TriggerManager.instance = new TriggerManager();
    }
    return TriggerManager.instance;
  }

  // Initialize trigger manager
  private async initializeTriggerManager(): Promise<void> {
    try {
      await this.loadActiveTriggers();
      this.startEventProcessing();
      this.setupTimeBasedTriggers();
      
      console.log('🎯 TriggerManager initialized successfully');
      this.emit('trigger_manager_ready');
    } catch (error) {
      console.error('❌ Failed to initialize TriggerManager:', error);
      this.emit('trigger_manager_error', error);
    }
  }

  // Load all active triggers
  private async loadActiveTriggers(): Promise<void> {
    const { data, error } = await supabase
      .from('automation_triggers')
      .select('*')
      .eq('active', true);

    if (error) throw error;

    if (data) {
      data.forEach(trigger => {
        this.activeTriggers.set(trigger.id, trigger);
      });
    }
  }

  // Start processing event queue
  private startEventProcessing(): void {
    this.processingInterval = setInterval(() => {
      this.processEventQueue();
    }, 1000); // Process every second
  }

  // Setup time-based trigger monitoring
  private setupTimeBasedTriggers(): void {
    setInterval(() => {
      this.checkTimeBasedTriggers();
    }, 60000); // Check every minute
  }

  // Process event queue
  private async processEventQueue(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const event = this.eventQueue.shift();
    if (!event) return;

    try {
      await this.processEvent(event);
    } catch (error) {
      console.error('❌ Error processing trigger event:', error);
      this.emit('event_processing_error', { event, error });
    }
  }

  // Process individual event
  private async processEvent(event: TriggerEvent): Promise<void> {
    // Find matching triggers for this event type
    const matchingTriggers = Array.from(this.activeTriggers.values()).filter(trigger =>
      this.eventMatchesTrigger(event, trigger)
    );

    for (const trigger of matchingTriggers) {
      // Check cooldown
      if (this.isInCooldown(trigger.id)) {
        continue;
      }

      // Evaluate trigger conditions
      const conditionsMet = await this.evaluateTriggerConditions(trigger, event);
      
      if (conditionsMet) {
        // Trigger the automation
        await emailAutomationEngine.triggerAutomation(
          trigger.type,
          event.contact_id,
          {
            trigger_id: trigger.id,
            event_data: event.event_data,
            event_timestamp: event.timestamp
          }
        );

        // Set cooldown if specified
        this.setCooldown(trigger.id);

        // Log trigger activation
        await this.logTriggerActivation(trigger.id, event);

        this.emit('trigger_activated', { trigger, event });
      }
    }
  }

  // Check if event matches trigger type
  private eventMatchesTrigger(event: TriggerEvent, trigger: AutomationTrigger): boolean {
    switch (trigger.type) {
      case 'behavior':
        return this.matchesBehavioralTrigger(event, trigger as BehavioralTrigger);
      case 'event':
        return this.matchesEventTrigger(event, trigger);
      case 'contact_action':
        return this.matchesContactActionTrigger(event, trigger);
      default:
        return false;
    }
  }

  // Match behavioral triggers
  private matchesBehavioralTrigger(event: TriggerEvent, trigger: BehavioralTrigger): boolean {
    const behaviorTypes = {
      'email_engagement': ['email_opened', 'email_clicked', 'email_replied'],
      'website_activity': ['page_visited', 'form_submitted', 'download_started'],
      'purchase_behavior': ['purchase_made', 'cart_abandoned', 'product_viewed'],
      'form_activity': ['form_submitted', 'form_started', 'form_abandoned']
    };

    const relevantEvents = behaviorTypes[trigger.behavior_type] || [];
    return relevantEvents.includes(event.type);
  }

  // Match event triggers
  private matchesEventTrigger(event: TriggerEvent, trigger: AutomationTrigger): boolean {
    // Check if the event type matches any of the trigger's conditions
    return trigger.conditions.some(condition => 
      condition.field === 'event_type' && condition.value === event.type
    );
  }

  // Match contact action triggers
  private matchesContactActionTrigger(event: TriggerEvent, trigger: AutomationTrigger): boolean {
    const contactActionEvents = [
      'contact_created', 'contact_updated', 'tag_added', 'property_changed'
    ];
    return contactActionEvents.includes(event.type);
  }

  // Evaluate trigger conditions
  private async evaluateTriggerConditions(trigger: AutomationTrigger, event: TriggerEvent): Promise<boolean> {
    if (!trigger.conditions || trigger.conditions.length === 0) {
      return true; // No conditions means always trigger
    }

    // Get contact data for evaluation
    const contactData = await this.getContactData(event.contact_id);
    
    // Evaluate each condition
    for (const condition of trigger.conditions) {
      const conditionMet = this.evaluateCondition(condition, contactData, event);
      
      // Handle logic operators
      if (condition.logic === 'OR') {
        if (conditionMet) return true;
      } else { // Default to AND logic
        if (!conditionMet) return false;
      }
    }

    return true;
  }

  // Evaluate individual condition
  private evaluateCondition(condition: TriggerCondition, contactData: any, event: TriggerEvent): boolean {
    let fieldValue: any;

    // Get field value from contact data or event data
    if (condition.field.startsWith('event.')) {
      const eventField = condition.field.replace('event.', '');
      fieldValue = event.event_data[eventField];
    } else if (condition.field.startsWith('contact.')) {
      const contactField = condition.field.replace('contact.', '');
      fieldValue = contactData[contactField];
    } else {
      fieldValue = contactData[condition.field];
    }

    // Evaluate based on operator
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'contains':
        return String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase());
      case 'greater_than':
        return Number(fieldValue) > Number(condition.value);
      case 'less_than':
        return Number(fieldValue) < Number(condition.value);
      case 'exists':
        return fieldValue !== null && fieldValue !== undefined && fieldValue !== '';
      default:
        return false;
    }
  }

  // Check time-based triggers
  private async checkTimeBasedTriggers(): Promise<void> {
    const timeBasedTriggers = Array.from(this.activeTriggers.values()).filter(
      trigger => trigger.type === 'time_based'
    );

    for (const trigger of timeBasedTriggers) {
      await this.evaluateTimeBasedTrigger(trigger as TimeBasedTrigger);
    }
  }

  // Evaluate time-based trigger
  private async evaluateTimeBasedTrigger(trigger: TimeBasedTrigger): Promise<void> {
    const now = new Date();
    const shouldTrigger = this.shouldTimeBasedTriggerFire(trigger, now);

    if (shouldTrigger) {
      // Get all contacts that should receive this trigger
      const eligibleContacts = await this.getEligibleContactsForTimeTrigger(trigger);

      for (const contact of eligibleContacts) {
        const event: TriggerEvent = {
          id: `time_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'time_based',
          contact_id: contact.id,
          event_data: {
            trigger_type: trigger.schedule_type,
            schedule_config: trigger.schedule_config
          },
          timestamp: now.toISOString(),
          source: 'time_based_trigger'
        };

        // Queue the event for processing
        this.eventQueue.push(event);
      }
    }
  }

  // Check if time-based trigger should fire
  private shouldTimeBasedTriggerFire(trigger: TimeBasedTrigger, now: Date): boolean {
    const config = trigger.schedule_config;

    switch (trigger.schedule_type) {
      case 'fixed':
        if (config.fixed_datetime) {
          const triggerTime = new Date(config.fixed_datetime);
          return Math.abs(now.getTime() - triggerTime.getTime()) < 60000; // Within 1 minute
        }
        return false;

      case 'recurring':
        return this.shouldRecurringTriggerFire(config, now);

      case 'relative':
        // Relative triggers are handled by specific events, not time-based checking
        return false;

      default:
        return false;
    }
  }

  // Check recurring trigger schedule
  private shouldRecurringTriggerFire(config: ScheduleConfig, now: Date): boolean {
    if (!config.recurring_pattern) return false;

    const pattern = config.recurring_pattern;
    
    // Check time of day
    if (pattern.time_of_day) {
      const [hours, minutes] = pattern.time_of_day.split(':').map(Number);
      if (now.getHours() !== hours || now.getMinutes() !== minutes) {
        return false;
      }
    }

    // Check frequency
    switch (pattern.frequency) {
      case 'daily':
        return true; // If time matches, trigger daily

      case 'weekly':
        return pattern.days_of_week?.includes(now.getDay()) || false;

      case 'monthly':
        return pattern.day_of_month === now.getDate();

      case 'yearly':
        return pattern.day_of_month === now.getDate() && 
               now.getMonth() === 0; // Simplified - would need month field

      default:
        return false;
    }
  }

  // Get eligible contacts for time trigger
  private async getEligibleContactsForTimeTrigger(trigger: TimeBasedTrigger): Promise<any[]> {
    let query = supabase.from('contacts').select('*');

    // Apply trigger conditions to filter contacts
    for (const condition of trigger.conditions) {
      if (condition.field.startsWith('contact.')) {
        const field = condition.field.replace('contact.', '');
        
        switch (condition.operator) {
          case 'equals':
            query = query.eq(field, condition.value);
            break;
          case 'contains':
            query = query.ilike(field, `%${condition.value}%`);
            break;
          case 'greater_than':
            query = query.gt(field, condition.value);
            break;
          case 'less_than':
            query = query.lt(field, condition.value);
            break;
          case 'exists':
            query = query.not(field, 'is', null);
            break;
        }
      }
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching eligible contacts:', error);
      return [];
    }

    return data || [];
  }

  // Cooldown management
  private isInCooldown(triggerId: string): boolean {
    const lastTriggered = this.cooldownMap.get(triggerId);
    if (!lastTriggered) return false;

    const trigger = this.activeTriggers.get(triggerId);
    if (!trigger) return false;

    // Check if trigger has cooldown configuration
    const cooldownMinutes = this.getTriggerCooldown(trigger);
    if (cooldownMinutes === 0) return false;

    const cooldownMs = cooldownMinutes * 60 * 1000;
    return (Date.now() - lastTriggered) < cooldownMs;
  }

  private setCooldown(triggerId: string): void {
    this.cooldownMap.set(triggerId, Date.now());
  }

  private getTriggerCooldown(trigger: AutomationTrigger): number {
    // Extract cooldown from trigger configuration
    // This would be part of the trigger's configuration
    return 0; // Default no cooldown
  }

  // Helper methods
  private async getContactData(contactId: string): Promise<any> {
    const { data } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single();
    return data || {};
  }

  private async logTriggerActivation(triggerId: string, event: TriggerEvent): Promise<void> {
    await supabase.from('trigger_activations').insert({
      trigger_id: triggerId,
      contact_id: event.contact_id,
      event_type: event.type,
      event_data: event.event_data,
      activated_at: new Date().toISOString()
    });
  }

  // Public API methods
  public async trackEvent(event: Omit<TriggerEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent: TriggerEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    // Add to processing queue
    this.eventQueue.push(fullEvent);

    // Emit for real-time monitoring
    this.emit('event_tracked', fullEvent);

    // Store in database for analytics
    await supabase.from('trigger_events').insert(fullEvent);
  }

  public async createTrigger(trigger: Omit<AutomationTrigger, 'id' | 'created_at' | 'updated_at'>): Promise<AutomationTrigger> {
    const newTrigger: AutomationTrigger = {
      ...trigger,
      id: `trigger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('automation_triggers').insert(newTrigger);
    if (error) throw error;

    this.activeTriggers.set(newTrigger.id, newTrigger);
    return newTrigger;
  }

  public async updateTrigger(triggerId: string, updates: Partial<AutomationTrigger>): Promise<void> {
    const trigger = this.activeTriggers.get(triggerId);
    if (!trigger) throw new Error(`Trigger ${triggerId} not found`);

    const updatedTrigger = { ...trigger, ...updates, updated_at: new Date().toISOString() };

    const { error } = await supabase
      .from('automation_triggers')
      .update(updatedTrigger)
      .eq('id', triggerId);

    if (error) throw error;

    this.activeTriggers.set(triggerId, updatedTrigger);
  }

  public async deleteTrigger(triggerId: string): Promise<void> {
    const { error } = await supabase
      .from('automation_triggers')
      .delete()
      .eq('id', triggerId);

    if (error) throw error;

    this.activeTriggers.delete(triggerId);
  }

  public getTriggerStats(triggerId: string): any {
    // Return trigger statistics
    return {
      trigger_id: triggerId,
      total_activations: 0, // Would query from trigger_activations table
      last_activated: null,
      success_rate: 100
    };
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
export const triggerManager = TriggerManager.getInstance();