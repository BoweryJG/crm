// Compliance Integration Service
// Integrates compliance checking into all email automation workflows

import { ComplianceEngine } from './ComplianceEngine';
import { MedicalClaimsValidator } from './MedicalClaimsValidator';
import { EmailAutomationEngine } from '../email/EmailAutomationEngine';
import { supabase } from '../supabase/supabase';

export interface ComplianceWorkflowStep {
  step_id: string;
  workflow_id: string;
  compliance_required: boolean;
  compliance_checks: string[];
  auto_fix_enabled: boolean;
  block_on_violation: boolean;
}

export interface ComplianceApproval {
  id: string;
  content_id: string;
  content_type: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  reviewer_id?: string;
  review_notes?: string;
  compliance_check_id: string;
  created_at: string;
  reviewed_at?: string;
}

export class ComplianceIntegration {
  private static instance: ComplianceIntegration;
  private complianceEngine: ComplianceEngine;
  private claimsValidator: MedicalClaimsValidator;
  private emailEngine: EmailAutomationEngine;

  private constructor() {
    this.complianceEngine = ComplianceEngine.getInstance();
    this.claimsValidator = MedicalClaimsValidator.getInstance();
    this.emailEngine = EmailAutomationEngine.getInstance();
    this.initializeIntegration();
  }

  static getInstance(): ComplianceIntegration {
    if (!ComplianceIntegration.instance) {
      ComplianceIntegration.instance = new ComplianceIntegration();
    }
    return ComplianceIntegration.instance;
  }

  private initializeIntegration() {
    // Intercept email sending
    this.interceptEmailSending();
    
    // Set up workflow compliance checks
    this.setupWorkflowCompliance();
    
    // Monitor for violations
    this.monitorComplianceViolations();
  }

  private interceptEmailSending() {
    // Listen for email sending events and add compliance checks
    this.emailEngine.on('send_automation_email', async (emailData: any) => {
      try {
        // Check compliance before sending
        const complianceResult = await this.checkEmailCompliance(emailData);
        
        if (complianceResult.overall_status === 'violations' && emailData.block_on_violation !== false) {
          // Block sending and request approval
          await this.requestComplianceApproval(emailData, complianceResult);
          
          // Emit error event to notify the email engine
          this.emailEngine.emit('email_compliance_blocked', {
            emailData,
            complianceResult,
            message: 'Email blocked due to compliance violations. Approval required.'
          });
          return;
        }
        
        // Add compliance metadata
        emailData.compliance_check_id = complianceResult.id;
        emailData.compliance_status = complianceResult.overall_status;
        
        // Emit event to proceed with sending
        this.emailEngine.emit('email_compliance_approved', emailData);
      } catch (error) {
        console.error('Error in compliance check:', error);
        this.emailEngine.emit('email_compliance_error', { emailData, error });
      }
    });
  }

  private setupWorkflowCompliance() {
    // Listen for workflow step execution events
    // Note: The EmailAutomationEngine doesn't emit 'workflow-step-execute' event
    // Instead, we'll intercept at the email sending stage via 'send_automation_email'
    
    // Monitor automation starts to ensure compliance is configured
    this.emailEngine.on('automation_started', async ({ automation, execution, contactId }) => {
      console.log(`🔍 Compliance monitoring activated for automation: ${automation.name}`);
      
      // Store compliance requirements for this automation
      await supabase
        .from('compliance_automation_config')
        .upsert({
          automation_id: automation.id,
          compliance_checks: ['fda_advertising', 'medical_claims', 'off_label'],
          block_on_violation: true,
          auto_fix_enabled: false,
          created_at: new Date().toISOString()
        });
    });
    
    // Monitor automation completions for compliance reporting
    this.emailEngine.on('automation_completed', async (execution) => {
      console.log(`✅ Automation ${execution.automation_id} completed with compliance checks`);
    });
    
    // Monitor automation errors
    this.emailEngine.on('automation_error', async ({ execution, error }) => {
      console.error(`❌ Automation ${execution.automation_id} failed:`, error);
      
      // Check if it was a compliance-related error
      if (error.message?.includes('compliance')) {
        await this.notifyComplianceTeam({
          type: 'automation_blocked',
          automation_id: execution.automation_id,
          contact_id: execution.contact_id,
          error: error.message
        });
      }
    });
  }

  private monitorComplianceViolations() {
    this.complianceEngine.subscribeToComplianceAlerts((alert: any) => {
      // Notify compliance team
      this.notifyComplianceTeam(alert);
      
      // Pause related automation if critical
      if (alert.overall_status === 'violations') {
        this.pauseRelatedAutomations(alert.content_id);
      }
    });
  }

  // Check email compliance
  private async checkEmailCompliance(emailData: any): Promise<any> {
    const fullContent = `
      Subject: ${emailData.subject}
      
      ${emailData.body}
      
      ${emailData.footer || ''}
    `;

    // Run compliance check
    const complianceCheck = await this.complianceEngine.checkEmailCompliance(
      emailData.subject,
      emailData.body,
      emailData.user_id,
      emailData.recipient_type
    );

    // Check for medical claims if applicable
    if (this.containsMedicalContent(fullContent)) {
      const claimsValidation = await this.claimsValidator.validateClaim(
        fullContent,
        'efficacy', // Would be determined by content analysis
        emailData.product_name || 'Unknown Product',
        []
      );

      // Add claims validation to compliance results
      if (!claimsValidation.is_valid) {
        complianceCheck.check_results.push({
          rule_id: 'claims_validation',
          rule_name: 'Medical Claims Validation',
          category: 'medical_claims',
          severity: 'violation',
          status: 'fail',
          message: 'Medical claims require substantiation',
          evidence: claimsValidation.issues.map(i => i.description).join('; '),
          recommendation: claimsValidation.recommendations.join('; ')
        });
        
        if (complianceCheck.overall_status === 'compliant') {
          complianceCheck.overall_status = 'violations';
        }
      }
    }

    return complianceCheck;
  }

  private containsMedicalContent(content: string): boolean {
    const medicalKeywords = [
      'treatment', 'therapy', 'clinical', 'patient', 'efficacy',
      'safety', 'outcome', 'indication', 'contraindication',
      'adverse', 'benefit', 'risk', 'study', 'trial'
    ];

    const contentLower = content.toLowerCase();
    return medicalKeywords.some(keyword => contentLower.includes(keyword));
  }

  // Request compliance approval
  private async requestComplianceApproval(
    content: any,
    complianceCheck: any
  ): Promise<ComplianceApproval> {
    const approval: ComplianceApproval = {
      id: crypto.randomUUID(),
      content_id: content.id || crypto.randomUUID(),
      content_type: content.type || 'email',
      approval_status: 'pending',
      compliance_check_id: complianceCheck.id,
      created_at: new Date().toISOString()
    };

    // Store approval request
    const { error } = await supabase
      .from('compliance_approvals')
      .insert(approval);

    if (error) {
      console.error('Error creating approval request:', error);
    }

    // Notify compliance team
    await this.notifyComplianceTeam({
      type: 'approval_required',
      approval,
      compliance_check: complianceCheck,
      content
    });

    return approval;
  }

  // Notify compliance team
  private async notifyComplianceTeam(notification: any): Promise<void> {
    // Send notification to compliance team members
    const { data: complianceTeam } = await supabase
      .from('users')
      .select('id, email')
      .eq('role', 'compliance_officer');

    if (complianceTeam && complianceTeam.length > 0) {
      // Create notifications
      const notifications = complianceTeam.map(member => ({
        user_id: member.id,
        type: 'compliance_alert',
        title: notification.type === 'approval_required' 
          ? 'Compliance Approval Required'
          : 'Compliance Violation Detected',
        message: this.formatNotificationMessage(notification),
        data: notification,
        created_at: new Date().toISOString()
      }));

      await supabase
        .from('notifications')
        .insert(notifications);
    }
  }

  private formatNotificationMessage(notification: any): string {
    if (notification.type === 'approval_required') {
      const violations = notification.compliance_check.check_results
        .filter((r: any) => r.status === 'fail' && r.severity === 'violation')
        .map((r: any) => r.rule_name)
        .join(', ');
      
      return `Content requires approval due to violations: ${violations}`;
    }
    
    return `Compliance violation detected: ${notification.overall_status}`;
  }

  // Pause related automations
  private async pauseRelatedAutomations(contentId: string): Promise<void> {
    // Find automations using this content
    const { data: automations } = await supabase
      .from('email_automations')
      .select('id')
      .contains('workflow_steps', [{ config: { template_id: contentId } }]);

    if (automations && automations.length > 0) {
      // Pause each automation
      await Promise.all(automations.map(auto => 
        supabase
          .from('email_automations')
          .update({ active: false, paused_reason: 'compliance_violation' })
          .eq('id', auto.id)
      ));
    }
  }

  // Public methods for compliance management
  async reviewComplianceApproval(
    approvalId: string,
    reviewerId: string,
    decision: 'approved' | 'rejected',
    notes?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('compliance_approvals')
      .update({
        approval_status: decision,
        reviewer_id: reviewerId,
        review_notes: notes,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', approvalId);

    if (error) {
      console.error('Error reviewing approval:', error);
      throw error;
    }

    // If approved, resume sending
    if (decision === 'approved') {
      await this.resumeApprovedContent(approvalId);
    }
  }

  private async resumeApprovedContent(approvalId: string): Promise<void> {
    // Get approval details
    const { data: approval } = await supabase
      .from('compliance_approvals')
      .select('*')
      .eq('id', approvalId)
      .single();

    if (approval) {
      // Mark content as approved
      await supabase
        .from('email_templates')
        .update({ 
          compliance_approved: true,
          compliance_approval_id: approvalId
        })
        .eq('id', approval.content_id);

      // Resume any paused automations
      await supabase
        .from('email_automations')
        .update({ 
          active: true,
          paused_reason: null
        })
        .contains('workflow_steps', [{ config: { template_id: approval.content_id } }]);

      // Resume paused executions
      const { data: pausedExecutions } = await supabase
        .from('automation_executions')
        .select('*')
        .eq('status', 'paused')
        .contains('execution_data', { paused_reason: 'compliance_violation' });

      if (pausedExecutions) {
        for (const execution of pausedExecutions) {
          // Check if this execution is related to the approved content
          if (execution.execution_data?.compliance_check_id === approval.compliance_check_id) {
            // Resume the execution
            await supabase
              .from('automation_executions')
              .update({ 
                status: 'active',
                execution_data: {
                  ...execution.execution_data,
                  paused_reason: null,
                  compliance_approved: true,
                  approval_id: approvalId
                }
              })
              .eq('id', execution.id);

            // Emit event to resume processing
            this.emailEngine.emit('resume_automation_execution', execution);
          }
        }
      }
    }
  }

  // Auto-fix compliance issues
  async autoFixComplianceIssues(
    content: string,
    complianceCheck: any
  ): Promise<{ fixed_content: string; changes: string[] }> {
    let fixedContent = content;
    const changes: string[] = [];

    // Process each violation
    for (const result of complianceCheck.check_results) {
      if (result.status === 'fail' && result.severity === 'violation') {
        const fix = await this.applyComplianceFix(fixedContent, result);
        if (fix.changed) {
          fixedContent = fix.content;
          changes.push(fix.description);
        }
      }
    }

    return { fixed_content: fixedContent, changes };
  }

  private async applyComplianceFix(
    content: string,
    violation: any
  ): Promise<{ content: string; changed: boolean; description: string }> {
    let fixedContent = content;
    let changed = false;
    let description = '';

    switch (violation.rule_id) {
      case 'fda_001': // Missing directions for use
        if (!content.includes('Directions for Use')) {
          fixedContent += '\n\nDirections for Use: Please consult the product labeling for complete instructions.';
          changed = true;
          description = 'Added directions for use statement';
        }
        break;

      case 'fda_002': // Fair balance
        if (content.match(/benefit|advantage|effective/gi) && !content.match(/risk|limitation|warning/gi)) {
          fixedContent += '\n\nImportant Safety Information: As with any medical device, there are risks and limitations. Please see full prescribing information.';
          changed = true;
          description = 'Added balance statement for risks and limitations';
        }
        break;

      case 'fda_003': // Unsubstantiated claims
        // Replace problematic words
        const replacements = [
          { from: /guaranteed/gi, to: 'intended to' },
          { from: /100%/gi, to: 'designed for optimal' },
          { from: /cure/gi, to: 'treat' },
          { from: /miraculous/gi, to: 'advanced' }
        ];

        replacements.forEach(replacement => {
          if (content.match(replacement.from)) {
            fixedContent = fixedContent.replace(replacement.from, replacement.to);
            changed = true;
            description = `Replaced unsubstantiated language`;
          }
        });
        break;

      case 'fda_008': // Missing indication
        if (!content.includes('FDA cleared')) {
          const indication = await this.getProductIndication(content);
          if (indication) {
            fixedContent += `\n\n${indication}`;
            changed = true;
            description = 'Added FDA clearance statement';
          }
        }
        break;
    }

    return { content: fixedContent, changed, description };
  }

  private async getProductIndication(content: string): Promise<string | null> {
    // Extract product name from content
    const productMatch = content.match(/(?:our|the)\s+(\w+\s+\w+)\s+(?:device|system|product)/i);
    if (!productMatch) return null;

    const productName = productMatch[1];

    // Look up FDA indication
    const { data } = await supabase
      .from('products')
      .select('fda_indication')
      .ilike('name', `%${productName}%`)
      .single();

    if (data && data.fda_indication) {
      return `This device is FDA cleared for ${data.fda_indication}.`;
    }

    return 'This device is FDA cleared. See product labeling for indications for use.';
  }

  // Generate compliance report
  async generateComplianceReport(
    startDate: string,
    endDate: string,
    includeDetails: boolean = false
  ): Promise<any> {
    const report = await this.complianceEngine.generateComplianceReport(
      startDate,
      endDate
    );

    // Add automation-specific metrics
    const { data: automationMetrics } = await supabase
      .from('email_automations')
      .select('id, name, performance_metrics')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    report.automation_compliance = {
      total_automations: automationMetrics?.length || 0,
      compliant_sends: 0,
      blocked_sends: 0,
      approval_requests: 0
    };

    // Count compliance events
    const { data: complianceEvents } = await supabase
      .from('compliance_audit_logs')
      .select('action, compliance_status')
      .gte('timestamp', startDate)
      .lte('timestamp', endDate);

    complianceEvents?.forEach(event => {
      if (event.action === 'compliance_check') {
        if (event.compliance_status === 'compliant') {
          report.automation_compliance.compliant_sends++;
        } else if (event.compliance_status === 'violations') {
          report.automation_compliance.blocked_sends++;
        }
      } else if (event.action === 'approval_request') {
        report.automation_compliance.approval_requests++;
      }
    });

    if (includeDetails) {
      // Add detailed violation analysis
      report.detailed_violations = await this.getDetailedViolations(startDate, endDate);
      
      // Add approval turnaround times
      report.approval_metrics = await this.getApprovalMetrics(startDate, endDate);
    }

    return report;
  }

  private async getDetailedViolations(startDate: string, endDate: string): Promise<any> {
    const { data } = await supabase
      .from('compliance_checks')
      .select('*')
      .gte('checked_at', startDate)
      .lte('checked_at', endDate)
      .eq('overall_status', 'violations');

    const violationsByRule = new Map<string, number>();
    const violationsByContent = new Map<string, number>();

    data?.forEach(check => {
      check.check_results.forEach((result: any) => {
        if (result.status === 'fail') {
          violationsByRule.set(result.rule_name, (violationsByRule.get(result.rule_name) || 0) + 1);
          violationsByContent.set(check.content_type, (violationsByContent.get(check.content_type) || 0) + 1);
        }
      });
    });

    return {
      by_rule: Array.from(violationsByRule.entries()).map(([rule, count]) => ({ rule, count })),
      by_content_type: Array.from(violationsByContent.entries()).map(([type, count]) => ({ type, count }))
    };
  }

  private async getApprovalMetrics(startDate: string, endDate: string): Promise<any> {
    const { data } = await supabase
      .from('compliance_approvals')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .not('reviewed_at', 'is', null);

    const metrics = {
      total_approvals: data?.length || 0,
      approved: 0,
      rejected: 0,
      avg_turnaround_hours: 0
    };

    let totalTurnaround = 0;

    data?.forEach(approval => {
      if (approval.approval_status === 'approved') metrics.approved++;
      if (approval.approval_status === 'rejected') metrics.rejected++;
      
      if (approval.reviewed_at) {
        const turnaround = new Date(approval.reviewed_at).getTime() - new Date(approval.created_at).getTime();
        totalTurnaround += turnaround;
      }
    });

    if (metrics.total_approvals > 0) {
      metrics.avg_turnaround_hours = (totalTurnaround / metrics.total_approvals) / (1000 * 60 * 60);
    }

    return metrics;
  }
}

export default ComplianceIntegration;