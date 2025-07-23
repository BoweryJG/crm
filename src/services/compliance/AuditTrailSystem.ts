// Audit Trail System for Regulatory Requirements
// Comprehensive logging and tracking for compliance

import { supabase } from '../supabase/supabase';
import { EventEmitter } from 'events';

export interface AuditEvent {
  id: string;
  event_type: AuditEventType;
  entity_type: string;
  entity_id: string;
  action: string;
  user_id: string;
  user_email: string;
  user_role: string;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  changes?: ChangeRecord[];
  metadata?: Record<string, unknown>;
  compliance_relevant: boolean;
  retention_years: number;
}

export type AuditEventType = 
  | 'data_access'
  | 'data_modification'
  | 'authentication'
  | 'authorization'
  | 'compliance_check'
  | 'approval_workflow'
  | 'email_sent'
  | 'document_viewed'
  | 'report_generated'
  | 'configuration_change'
  | 'system_event';

export interface ChangeRecord {
  field: string;
  old_value: unknown;
  new_value: unknown;
  change_type: 'create' | 'update' | 'delete';
}

export interface AuditQuery {
  user_id?: string;
  entity_type?: string;
  entity_id?: string;
  event_type?: AuditEventType;
  start_date?: string;
  end_date?: string;
  compliance_only?: boolean;
  limit?: number;
  offset?: number;
}

export interface AuditReport {
  id: string;
  report_type: 'compliance' | 'user_activity' | 'data_access' | 'security';
  period_start: string;
  period_end: string;
  generated_by: string;
  generated_at: string;
  summary: AuditSummary;
  details: Record<string, unknown>;
  export_format?: 'pdf' | 'csv' | 'json';
  file_url?: string;
}

export interface AuditSummary {
  total_events: number;
  events_by_type: Record<string, number>;
  unique_users: number;
  compliance_events: number;
  high_risk_events: number;
  anomalies_detected: number;
}

export interface ComplianceRequirement {
  id: string;
  regulation: 'HIPAA' | 'FDA' | 'SOC2' | 'ISO27001';
  requirement: string;
  audit_fields: string[];
  retention_period: number; // years
  encryption_required: boolean;
  review_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
}

interface UserActivityDetail {
  user_id: string;
  user_email: string;
  user_role: string;
  total_actions: number;
  actions_by_type: Record<string, number>;
  last_activity: string;
}

interface DataAccessDetail {
  total_accesses: number;
  by_entity_type: Record<string, number>;
  sensitive_data_access: AuditEvent[];
  bulk_access: AuditEvent[];
}

interface SecurityDetail {
  authentication_events: AuditEvent[];
  authorization_failures: AuditEvent[];
  high_risk_actions: AuditEvent[];
  after_hours_access: AuditEvent[];
  new_ip_addresses: { ip_address: string; first_seen: string; user: string }[];
}

export class AuditTrailSystem extends EventEmitter {
  private static instance: AuditTrailSystem;
  private buffer: AuditEvent[] = [];
  private flushInterval!: NodeJS.Timeout; // Using definite assignment assertion
  private complianceRequirements: Map<string, ComplianceRequirement> = new Map();
  
  // Retention policies by regulation
  private readonly RETENTION_POLICIES = {
    HIPAA: 6, // 6 years
    FDA: 7,   // 7 years for medical device records
    SOC2: 3,  // 3 years
    DEFAULT: 7 // Conservative default
  };

  // High-risk actions that require special attention
  private readonly HIGH_RISK_ACTIONS = [
    'delete_patient_data',
    'modify_clinical_data',
    'export_bulk_data',
    'change_access_permissions',
    'disable_audit_logging',
    'modify_compliance_settings'
  ];

  private constructor() {
    super();
    this.initializeSystem();
  }

  static getInstance(): AuditTrailSystem {
    if (!AuditTrailSystem.instance) {
      AuditTrailSystem.instance = new AuditTrailSystem();
    }
    return AuditTrailSystem.instance;
  }

  private async initializeSystem() {
    // Load compliance requirements
    await this.loadComplianceRequirements();
    
    // Set up buffer flushing
    this.flushInterval = setInterval(() => {
      this.flushBuffer();
    }, 5000); // Flush every 5 seconds
    
    // Set up real-time monitoring
    this.setupRealtimeMonitoring();
    
    // Initialize integrity checks
    this.scheduleIntegrityChecks();
  }

  private async loadComplianceRequirements() {
    const requirements: ComplianceRequirement[] = [
      {
        id: 'hipaa-audit',
        regulation: 'HIPAA',
        requirement: 'Track all access to PHI',
        audit_fields: ['user_id', 'patient_id', 'access_time', 'data_accessed'],
        retention_period: 6,
        encryption_required: true,
        review_frequency: 'daily'
      },
      {
        id: 'fda-audit',
        regulation: 'FDA',
        requirement: 'Track all changes to device data and quality records',
        audit_fields: ['user_id', 'device_id', 'change_type', 'timestamp', 'previous_value'],
        retention_period: 7,
        encryption_required: true,
        review_frequency: 'weekly'
      },
      {
        id: 'soc2-access',
        regulation: 'SOC2',
        requirement: 'Monitor system access and authentication',
        audit_fields: ['user_id', 'ip_address', 'authentication_method', 'success_status'],
        retention_period: 3,
        encryption_required: true,
        review_frequency: 'monthly'
      }
    ];

    requirements.forEach(req => {
      this.complianceRequirements.set(req.id, req);
    });
  }

  // Core audit logging method
  async logEvent(
    eventType: AuditEventType,
    entityType: string,
    entityId: string,
    action: string,
    userId: string,
    metadata?: Record<string, unknown>,
    changes?: ChangeRecord[]
  ): Promise<void> {
    // Get user details
    const userDetails = await this.getUserDetails(userId);
    
    // Determine retention period
    const retentionYears = this.determineRetentionPeriod(eventType, entityType);
    
    // Check if compliance relevant
    const complianceRelevant = this.isComplianceRelevant(eventType, action);
    
    // Create audit event
    const auditEvent: AuditEvent = {
      id: crypto.randomUUID(),
      event_type: eventType,
      entity_type: entityType,
      entity_id: entityId,
      action,
      user_id: userId,
      user_email: userDetails.email,
      user_role: userDetails.role,
      timestamp: new Date().toISOString(),
      ip_address: metadata?.ip_address as string | undefined,
      user_agent: metadata?.user_agent as string | undefined,
      session_id: metadata?.session_id as string | undefined,
      changes,
      metadata,
      compliance_relevant: complianceRelevant,
      retention_years: retentionYears
    };

    // Add to buffer for batch processing
    this.buffer.push(auditEvent);
    
    // Immediate flush for high-risk events
    if (this.isHighRiskAction(action)) {
      await this.flushBuffer();
      this.emit('high-risk-event', auditEvent);
    }
    
    // Check for anomalies
    await this.checkForAnomalies(auditEvent);
  }

  private async getUserDetails(userId: string): Promise<{ email: string; role: string }> {
    const { data } = await supabase
      .from('users')
      .select('email, role')
      .eq('id', userId)
      .single();
    
    return data || { email: 'unknown', role: 'unknown' };
  }

  private determineRetentionPeriod(eventType: AuditEventType, entityType: string): number {
    // Medical device related
    if (entityType.includes('device') || entityType.includes('clinical')) {
      return this.RETENTION_POLICIES.FDA;
    }
    
    // Patient data related
    if (entityType.includes('patient') || entityType.includes('health')) {
      return this.RETENTION_POLICIES.HIPAA;
    }
    
    // Authentication/access related
    if (eventType === 'authentication' || eventType === 'authorization') {
      return this.RETENTION_POLICIES.SOC2;
    }
    
    return this.RETENTION_POLICIES.DEFAULT;
  }

  private isComplianceRelevant(eventType: AuditEventType, action: string): boolean {
    const complianceEvents: AuditEventType[] = [
      'compliance_check',
      'approval_workflow',
      'data_modification',
      'configuration_change'
    ];
    
    return complianceEvents.includes(eventType) || 
           this.HIGH_RISK_ACTIONS.includes(action);
  }

  private isHighRiskAction(action: string): boolean {
    return this.HIGH_RISK_ACTIONS.includes(action);
  }

  // Flush buffer to database
  private async flushBuffer(): Promise<void> {
    if (this.buffer.length === 0) return;
    
    const eventsToFlush = [...this.buffer];
    this.buffer = [];
    
    try {
      // Encrypt sensitive data before storing
      const encryptedEvents = await this.encryptSensitiveData(eventsToFlush);
      
      // Store in database
      const { error } = await supabase
        .from('audit_trail')
        .insert(encryptedEvents);
      
      if (error) {
        console.error('Error flushing audit buffer:', error);
        // Re-add to buffer for retry
        this.buffer.unshift(...eventsToFlush);
      }
    } catch (error) {
      console.error('Fatal error in audit flush:', error);
      // Critical - emit event for immediate attention
      this.emit('audit-failure', { error, events: eventsToFlush });
    }
  }

  private async encryptSensitiveData(events: AuditEvent[]): Promise<any[]> {
    // In production, implement proper encryption
    // This is a placeholder for the encryption logic
    return events.map(event => ({
      ...event,
      // Encrypt sensitive fields and store as encrypted objects
      metadata: event.metadata ? this.encryptField(event.metadata) : undefined,
      changes: event.changes ? this.encryptField(event.changes) : undefined
    }));
  }

  private encryptField(data: unknown): { encrypted: boolean; data: string } {
    // Placeholder for encryption
    // In production, use proper encryption library
    return {
      encrypted: true,
      data: JSON.stringify(data)
    };
  }

  // Query audit trail
  async queryAuditTrail(query: AuditQuery): Promise<AuditEvent[]> {
    let dbQuery = supabase
      .from('audit_trail')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (query.user_id) {
      dbQuery = dbQuery.eq('user_id', query.user_id);
    }
    
    if (query.entity_type) {
      dbQuery = dbQuery.eq('entity_type', query.entity_type);
    }
    
    if (query.entity_id) {
      dbQuery = dbQuery.eq('entity_id', query.entity_id);
    }
    
    if (query.event_type) {
      dbQuery = dbQuery.eq('event_type', query.event_type);
    }
    
    if (query.start_date) {
      dbQuery = dbQuery.gte('timestamp', query.start_date);
    }
    
    if (query.end_date) {
      dbQuery = dbQuery.lte('timestamp', query.end_date);
    }
    
    if (query.compliance_only) {
      dbQuery = dbQuery.eq('compliance_relevant', true);
    }
    
    if (query.limit) {
      dbQuery = dbQuery.limit(query.limit);
    }
    
    if (query.offset) {
      dbQuery = dbQuery.range(query.offset, query.offset + (query.limit || 100) - 1);
    }
    
    const { data, error } = await dbQuery;
    
    if (error) {
      console.error('Error querying audit trail:', error);
      return [];
    }
    
    // Decrypt sensitive data
    return this.decryptAuditEvents(data || []);
  }

  private decryptAuditEvents(events: any[]): AuditEvent[] {
    return events.map(event => ({
      ...event,
      metadata: this.decryptIfEncrypted(event.metadata),
      changes: this.decryptIfEncrypted(event.changes)
    }));
  }

  private decryptIfEncrypted(data: any): any {
    if (data && typeof data === 'object' && 'encrypted' in data && data.encrypted) {
      return JSON.parse(data.data);
    }
    return data;
  }

  // Anomaly detection
  private async checkForAnomalies(event: AuditEvent): Promise<void> {
    // Check for unusual patterns
    const anomalies: string[] = [];
    
    // Unusual time access
    const hour = new Date(event.timestamp).getHours();
    if (hour < 6 || hour > 22) {
      anomalies.push('after-hours-access');
    }
    
    // Rapid repeated actions
    const recentActions = await this.getRecentUserActions(event.user_id, 5); // Last 5 minutes
    if (recentActions.length > 50) {
      anomalies.push('rapid-actions');
    }
    
    // Access from new location
    if (event.ip_address) {
      const isNewLocation = await this.checkNewLocation(event.user_id, event.ip_address);
      if (isNewLocation) {
        anomalies.push('new-location');
      }
    }
    
    // Bulk data access
    if (event.action.includes('bulk') || event.action.includes('export')) {
      anomalies.push('bulk-data-access');
    }
    
    if (anomalies.length > 0) {
      await this.reportAnomaly(event, anomalies);
    }
  }

  private async getRecentUserActions(userId: string, minutes: number): Promise<any[]> {
    const cutoffTime = new Date();
    cutoffTime.setMinutes(cutoffTime.getMinutes() - minutes);
    
    const { data } = await supabase
      .from('audit_trail')
      .select('id')
      .eq('user_id', userId)
      .gte('timestamp', cutoffTime.toISOString());
    
    return data || [];
  }

  private async checkNewLocation(userId: string, ipAddress: string): Promise<boolean> {
    // Check if IP has been used before by this user
    const { data } = await supabase
      .from('audit_trail')
      .select('id')
      .eq('user_id', userId)
      .eq('ip_address', ipAddress)
      .limit(1);
    
    return !data || data.length === 0;
  }

  private async reportAnomaly(event: AuditEvent, anomalies: string[]): Promise<void> {
    const anomalyReport = {
      id: crypto.randomUUID(),
      audit_event_id: event.id,
      user_id: event.user_id,
      anomaly_types: anomalies,
      severity: this.calculateAnomalySeverity(anomalies),
      detected_at: new Date().toISOString(),
      resolved: false
    };
    
    await supabase
      .from('audit_anomalies')
      .insert(anomalyReport);
    
    // Emit for real-time handling
    this.emit('anomaly-detected', {
      event,
      anomalies,
      severity: anomalyReport.severity
    });
  }

  private calculateAnomalySeverity(anomalies: string[]): 'critical' | 'high' | 'medium' | 'low' {
    if (anomalies.includes('bulk-data-access') || anomalies.length >= 3) {
      return 'critical';
    }
    if (anomalies.includes('new-location') && anomalies.includes('after-hours-access')) {
      return 'high';
    }
    if (anomalies.includes('rapid-actions')) {
      return 'medium';
    }
    return 'low';
  }

  // Real-time monitoring
  private setupRealtimeMonitoring() {
    // Monitor for specific patterns
    const subscription = supabase
      .channel('audit-monitoring')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'audit_trail',
        filter: 'compliance_relevant=eq.true'
      }, (payload) => {
        this.handleRealtimeAuditEvent(payload.new);
      })
      .subscribe();
  }

  private handleRealtimeAuditEvent(event: any) {
    // Check for immediate action items
    if (this.requiresImmediateAction(event as AuditEvent)) {
      this.emit('immediate-action-required', event);
    }
  }

  private requiresImmediateAction(event: AuditEvent): boolean {
    return event.event_type === 'data_modification' && 
           event.entity_type === 'clinical_data' ||
           this.HIGH_RISK_ACTIONS.includes(event.action);
  }

  // Integrity checks
  private scheduleIntegrityChecks() {
    // Daily integrity check
    setInterval(() => {
      this.performIntegrityCheck();
    }, 24 * 60 * 60 * 1000); // 24 hours
  }

  private async performIntegrityCheck(): Promise<void> {
    try {
      // Check for gaps in audit trail
      const gaps = await this.findAuditGaps();
      if (gaps.length > 0) {
        this.emit('integrity-issue', { type: 'gaps', details: gaps });
      }
      
      // Check for tampering
      const tampering = await this.checkForTampering();
      if (tampering) {
        this.emit('integrity-issue', { type: 'tampering', details: tampering });
      }
      
      // Verify retention compliance
      await this.enforceRetentionPolicies();
      
    } catch (error) {
      console.error('Integrity check failed:', error);
      this.emit('integrity-check-failed', error);
    }
  }

  private async findAuditGaps(): Promise<any[]> {
    // Look for missing sequential IDs or time gaps
    const { data } = await supabase
      .from('audit_trail')
      .select('id, timestamp')
      .order('timestamp', { ascending: true })
      .limit(1000);
    
    const gaps: any[] = [];
    
    // Check for time gaps > 1 hour during business hours
    for (let i = 1; i < (data?.length || 0); i++) {
      const current = new Date(data![i].timestamp);
      const previous = new Date(data![i-1].timestamp);
      const gapHours = (current.getTime() - previous.getTime()) / (1000 * 60 * 60);
      
      if (gapHours > 1 && this.isBusinessHours(current)) {
        gaps.push({
          start: previous,
          end: current,
          duration_hours: gapHours
        });
      }
    }
    
    return gaps;
  }

  private isBusinessHours(date: Date): boolean {
    const hour = date.getHours();
    const day = date.getDay();
    return day >= 1 && day <= 5 && hour >= 8 && hour <= 18;
  }

  private async checkForTampering(): Promise<{ modified_records: number; records: any[] } | null> {
    // Check for direct database modifications bypassing the audit system
    const { data } = await supabase
      .from('audit_trail')
      .select('id, created_at, updated_at')
      .neq('created_at', 'updated_at')
      .limit(10);
    
    if (data && data.length > 0) {
      return {
        modified_records: data.length,
        records: data
      };
    }
    
    return null;
  }

  private async enforceRetentionPolicies(): Promise<void> {
    // Archive old records
    const cutoffDates = new Map<number, Date>();
    
    [3, 6, 7].forEach(years => {
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - years);
      cutoffDates.set(years, cutoff);
    });
    
    // Move to archive table
    cutoffDates.forEach(async (cutoff, years) => {
      await this.archiveOldRecords(years, cutoff);
    });
  }

  private async archiveOldRecords(retentionYears: number, cutoffDate: Date): Promise<void> {
    // Move records to archive
    const { data, error } = await supabase
      .from('audit_trail')
      .select('*')
      .eq('retention_years', retentionYears)
      .lt('timestamp', cutoffDate.toISOString())
      .limit(1000);
    
    if (data && data.length > 0) {
      // Insert into archive
      await supabase
        .from('audit_trail_archive')
        .insert(data);
      
      // Delete from main table
      const ids = data.map(record => record.id);
      await supabase
        .from('audit_trail')
        .delete()
        .in('id', ids);
      
      console.log(`Archived ${data.length} records with ${retentionYears}-year retention`);
    }
  }

  // Generate compliance reports
  async generateComplianceReport(
    reportType: AuditReport['report_type'],
    startDate: string,
    endDate: string,
    userId: string
  ): Promise<AuditReport> {
    const events = await this.queryAuditTrail({
      start_date: startDate,
      end_date: endDate,
      compliance_only: reportType === 'compliance'
    });
    
    const summary = this.generateSummary(events);
    const details = await this.generateDetailedReport(reportType, events);
    
    const report: AuditReport = {
      id: crypto.randomUUID(),
      report_type: reportType,
      period_start: startDate,
      period_end: endDate,
      generated_by: userId,
      generated_at: new Date().toISOString(),
      summary,
      details
    };
    
    // Store report
    await supabase
      .from('audit_reports')
      .insert(report);
    
    // Log report generation
    await this.logEvent(
      'report_generated',
      'audit_report',
      report.id,
      `Generated ${reportType} audit report`,
      userId,
      { report_id: report.id }
    );
    
    return report;
  }

  private generateSummary(events: AuditEvent[]): AuditSummary {
    const eventsByType = events.reduce((acc, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const uniqueUsers = new Set(events.map(e => e.user_id)).size;
    const complianceEvents = events.filter(e => e.compliance_relevant).length;
    const highRiskEvents = events.filter(e => this.isHighRiskAction(e.action)).length;
    
    return {
      total_events: events.length,
      events_by_type: eventsByType,
      unique_users: uniqueUsers,
      compliance_events: complianceEvents,
      high_risk_events: highRiskEvents,
      anomalies_detected: 0 // Would query anomalies table
    };
  }

  private async generateDetailedReport(
    reportType: AuditReport['report_type'],
    events: AuditEvent[]
  ): Promise<Record<string, unknown>> {
    switch (reportType) {
      case 'compliance':
        return this.generateComplianceDetails(events);
      case 'user_activity':
        return { users: this.generateUserActivityDetails(events) };
      case 'data_access':
        return { access: this.generateDataAccessDetails(events) };
      case 'security':
        return { security: this.generateSecurityDetails(events) };
      default:
        return {};
    }
  }

  private generateComplianceDetails(events: AuditEvent[]): Record<string, unknown> {
    const complianceEvents = events.filter(e => e.compliance_relevant);
    
    return {
      total_compliance_events: complianceEvents.length,
      by_regulation: this.groupByRegulation(complianceEvents),
      high_risk_actions: complianceEvents.filter(e => this.isHighRiskAction(e.action)),
      approval_workflows: complianceEvents.filter(e => e.event_type === 'approval_workflow'),
      data_modifications: complianceEvents.filter(e => e.event_type === 'data_modification')
    };
  }

  private groupByRegulation(events: AuditEvent[]): Record<string, { count: number; percentage: number }> {
    // Group events by applicable regulations
    const grouped: Record<string, AuditEvent[]> = {
      HIPAA: events.filter(e => e.entity_type.includes('patient') || e.entity_type.includes('health')),
      FDA: events.filter(e => e.entity_type.includes('device') || e.entity_type.includes('clinical')),
      SOC2: events.filter(e => e.event_type === 'authentication' || e.event_type === 'authorization')
    };
    
    return Object.entries(grouped).reduce((acc, [reg, evts]) => {
      acc[reg] = {
        count: (evts as AuditEvent[]).length,
        percentage: ((evts as AuditEvent[]).length / events.length) * 100
      };
      return acc;
    }, {} as Record<string, { count: number; percentage: number }>);
  }

  private generateUserActivityDetails(events: AuditEvent[]): UserActivityDetail[] {
    const userActivity = new Map<string, UserActivityDetail>();
    
    events.forEach(event => {
      if (!userActivity.has(event.user_id)) {
        userActivity.set(event.user_id, {
          user_id: event.user_id,
          user_email: event.user_email,
          user_role: event.user_role,
          total_actions: 0,
          actions_by_type: {},
          last_activity: event.timestamp
        });
      }
      
      const user = userActivity.get(event.user_id)!;
      user.total_actions++;
      user.actions_by_type[event.event_type] = (user.actions_by_type[event.event_type] || 0) + 1;
      
      if (new Date(event.timestamp) > new Date(user.last_activity)) {
        user.last_activity = event.timestamp;
      }
    });
    
    return Array.from(userActivity.values())
      .sort((a, b) => b.total_actions - a.total_actions);
  }

  private generateDataAccessDetails(events: AuditEvent[]): DataAccessDetail {
    const dataAccessEvents = events.filter(e => e.event_type === 'data_access');
    
    return {
      total_accesses: dataAccessEvents.length,
      by_entity_type: this.groupByEntityType(dataAccessEvents),
      sensitive_data_access: dataAccessEvents.filter(e => 
        e.entity_type.includes('patient') || 
        e.entity_type.includes('clinical')
      ),
      bulk_access: dataAccessEvents.filter(e => 
        e.action.includes('bulk') || 
        e.action.includes('export')
      )
    };
  }

  private groupByEntityType(events: AuditEvent[]): Record<string, number> {
    return events.reduce((acc, event) => {
      acc[event.entity_type] = (acc[event.entity_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private generateSecurityDetails(events: AuditEvent[]): SecurityDetail {
    return {
      authentication_events: events.filter(e => e.event_type === 'authentication'),
      authorization_failures: events.filter(e => 
        e.event_type === 'authorization' && 
        e.metadata?.success === false
      ),
      high_risk_actions: events.filter(e => this.isHighRiskAction(e.action)),
      after_hours_access: events.filter(e => {
        const hour = new Date(e.timestamp).getHours();
        return hour < 6 || hour > 22;
      }),
      new_ip_addresses: this.findNewIpAddresses(events)
    };
  }

  private findNewIpAddresses(events: AuditEvent[]): any[] {
    const ipFirstSeen = new Map<string, Date>();
    const newIps: any[] = [];
    
    events.forEach(event => {
      if (event.ip_address) {
        if (!ipFirstSeen.has(event.ip_address)) {
          ipFirstSeen.set(event.ip_address, new Date(event.timestamp));
          newIps.push({
            ip_address: event.ip_address,
            first_seen: event.timestamp,
            user: event.user_email
          });
        }
      }
    });
    
    return newIps;
  }

  // Public methods for external monitoring
  onHighRiskEvent(callback: (event: AuditEvent) => void): () => void {
    this.on('high-risk-event', callback);
    return () => this.off('high-risk-event', callback);
  }

  onAnomalyDetected(callback: (anomaly: any) => void): () => void {
    this.on('anomaly-detected', callback);
    return () => this.off('anomaly-detected', callback);
  }

  onIntegrityIssue(callback: (issue: any) => void): () => void {
    this.on('integrity-issue', callback);
    return () => this.off('integrity-issue', callback);
  }

  // Cleanup
  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushBuffer(); // Final flush
    this.removeAllListeners();
  }
}

export default AuditTrailSystem;