// FDA Advertising Compliance Checker for Medical Device Marketing
// Ensures all marketing communications meet regulatory requirements

import { supabase } from '../supabase/supabase';

export interface ComplianceCheck {
  id: string;
  content_type: 'email' | 'sms' | 'call_script' | 'marketing_material';
  content: string;
  check_results: ComplianceResult[];
  overall_status: 'compliant' | 'warnings' | 'violations';
  checked_at: string;
  checked_by: string;
  metadata?: any;
}

export interface ComplianceResult {
  rule_id: string;
  rule_name: string;
  category: 'fda_advertising' | 'medical_claims' | 'off_label' | 'fair_balance' | 'data_privacy';
  severity: 'violation' | 'warning' | 'info';
  status: 'pass' | 'fail';
  message: string;
  evidence?: string;
  recommendation?: string;
  regulation_reference?: string;
}

export interface ComplianceRule {
  id: string;
  name: string;
  category: string;
  description: string;
  pattern?: RegExp;
  keywords?: string[];
  required_elements?: string[];
  severity: 'violation' | 'warning' | 'info';
  active: boolean;
  regulation_reference: string;
}

export interface AuditLog {
  id: string;
  action: string;
  content_id: string;
  user_id: string;
  timestamp: string;
  compliance_status: string;
  details: any;
  ip_address?: string;
  user_agent?: string;
}

export class ComplianceEngine {
  private static instance: ComplianceEngine;
  private rules: Map<string, ComplianceRule> = new Map();
  
  // FDA Advertising Rules for Medical Devices
  private readonly FDA_RULES: ComplianceRule[] = [
    {
      id: 'fda_001',
      name: 'Adequate Directions for Use',
      category: 'fda_advertising',
      description: 'Marketing materials must include adequate directions for use',
      required_elements: ['intended use', 'directions', 'warnings'],
      severity: 'violation',
      active: true,
      regulation_reference: '21 CFR 801.5'
    },
    {
      id: 'fda_002',
      name: 'Fair Balance Requirement',
      category: 'fair_balance',
      description: 'Benefits must be balanced with risks and limitations',
      keywords: ['benefit', 'advantage', 'effective', 'success'],
      severity: 'violation',
      active: true,
      regulation_reference: '21 CFR 202.1'
    },
    {
      id: 'fda_003',
      name: 'Unsubstantiated Claims',
      category: 'medical_claims',
      description: 'All medical claims must be substantiated',
      pattern: /(?:cure|treat|prevent|eliminate|guaranteed|100%|miraculous|breakthrough)/gi,
      severity: 'violation',
      active: true,
      regulation_reference: '21 CFR 807.97'
    },
    {
      id: 'fda_004',
      name: 'Off-Label Promotion',
      category: 'off_label',
      description: 'Cannot promote device for uses not cleared by FDA',
      keywords: ['off-label', 'unapproved use', 'experimental'],
      severity: 'violation',
      active: true,
      regulation_reference: '21 USC 352'
    },
    {
      id: 'fda_005',
      name: 'Comparative Claims',
      category: 'medical_claims',
      description: 'Comparative claims must be supported by clinical evidence',
      pattern: /(?:better than|superior to|more effective than|outperforms)/gi,
      severity: 'warning',
      active: true,
      regulation_reference: '21 CFR 807.92'
    },
    {
      id: 'fda_006',
      name: 'Patient Testimonials',
      category: 'fda_advertising',
      description: 'Patient testimonials must include typical results disclaimer',
      pattern: /(?:patient said|testimonial|review|results may vary)/gi,
      severity: 'warning',
      active: true,
      regulation_reference: 'FDA Guidance on Internet/Social Media'
    },
    {
      id: 'fda_007',
      name: 'Clinical Data Presentation',
      category: 'medical_claims',
      description: 'Clinical data must be presented accurately and completely',
      keywords: ['clinical study', 'research shows', 'data indicates', 'study proves'],
      severity: 'violation',
      active: true,
      regulation_reference: '21 CFR 814.80'
    },
    {
      id: 'fda_008',
      name: 'Indication for Use',
      category: 'fda_advertising',
      description: 'Must clearly state FDA-cleared indication for use',
      required_elements: ['indication', 'FDA cleared', 'intended use'],
      severity: 'violation',
      active: true,
      regulation_reference: '21 CFR 807.87'
    }
  ];

  // HIPAA Privacy Rules
  private readonly PRIVACY_RULES: ComplianceRule[] = [
    {
      id: 'hipaa_001',
      name: 'Protected Health Information',
      category: 'data_privacy',
      description: 'Cannot share PHI without authorization',
      pattern: /(?:patient name|medical record|diagnosis|treatment)/gi,
      severity: 'violation',
      active: true,
      regulation_reference: '45 CFR 164.502'
    }
  ];

  private constructor() {
    this.initializeRules();
  }

  static getInstance(): ComplianceEngine {
    if (!ComplianceEngine.instance) {
      ComplianceEngine.instance = new ComplianceEngine();
    }
    return ComplianceEngine.instance;
  }

  private initializeRules() {
    [...this.FDA_RULES, ...this.PRIVACY_RULES].forEach(rule => {
      this.rules.set(rule.id, rule);
    });
  }

  // Main compliance check method
  async checkCompliance(
    content: string,
    contentType: 'email' | 'sms' | 'call_script' | 'marketing_material',
    userId: string,
    metadata?: any
  ): Promise<ComplianceCheck> {
    const results: ComplianceResult[] = [];
    
    // Run all active rules
    this.rules.forEach((rule, ruleId) => {
      if (!rule.active) return;
      
      const result = this.evaluateRule(content, rule);
      results.push(result);
    });

    // Determine overall status
    const hasViolations = results.some(r => r.severity === 'violation' && r.status === 'fail');
    const hasWarnings = results.some(r => r.severity === 'warning' && r.status === 'fail');
    
    const overallStatus = hasViolations ? 'violations' : hasWarnings ? 'warnings' : 'compliant';

    // Create compliance check record
    const checkRecord: ComplianceCheck = {
      id: crypto.randomUUID(),
      content_type: contentType,
      content,
      check_results: results,
      overall_status: overallStatus,
      checked_at: new Date().toISOString(),
      checked_by: userId,
      metadata
    };

    // Store in database
    await this.storeComplianceCheck(checkRecord);
    
    // Log audit trail
    await this.logAuditTrail({
      action: 'compliance_check',
      content_id: checkRecord.id,
      user_id: userId,
      compliance_status: overallStatus,
      details: { contentType, resultsCount: results.length }
    });

    return checkRecord;
  }

  private evaluateRule(content: string, rule: ComplianceRule): ComplianceResult {
    let status: 'pass' | 'fail' = 'pass';
    let evidence: string | undefined;
    let recommendation: string | undefined;

    // Check pattern matching
    if (rule.pattern) {
      const matches = content.match(rule.pattern);
      if (matches && matches.length > 0) {
        status = 'fail';
        evidence = `Found: "${matches.join('", "')}"`;
        recommendation = this.getRecommendation(rule);
      }
    }

    // Check required elements
    if (rule.required_elements && status === 'pass') {
      const missingElements = rule.required_elements.filter(element => 
        !content.toLowerCase().includes(element.toLowerCase())
      );
      
      if (missingElements.length > 0) {
        status = 'fail';
        evidence = `Missing required elements: ${missingElements.join(', ')}`;
        recommendation = `Include the following: ${missingElements.join(', ')}`;
      }
    }

    // Check keywords
    if (rule.keywords && status === 'pass') {
      const foundKeywords = rule.keywords.filter(keyword => 
        content.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (foundKeywords.length > 0) {
        status = 'fail';
        evidence = `Contains keywords: "${foundKeywords.join('", "')}"`;
        recommendation = this.getRecommendation(rule);
      }
    }

    return {
      rule_id: rule.id,
      rule_name: rule.name,
      category: rule.category as any,
      severity: rule.severity,
      status,
      message: status === 'pass' 
        ? `Compliant with ${rule.name}` 
        : `Violation of ${rule.name}: ${rule.description}`,
      evidence,
      recommendation,
      regulation_reference: rule.regulation_reference
    };
  }

  private getRecommendation(rule: ComplianceRule): string {
    const recommendations: Record<string, string> = {
      'fda_001': 'Include complete directions for use, intended use statement, and all relevant warnings.',
      'fda_002': 'Balance benefit claims with appropriate risk information and limitations.',
      'fda_003': 'Remove or substantiate all medical claims with clinical evidence.',
      'fda_004': 'Only promote FDA-cleared indications. Remove any off-label uses.',
      'fda_005': 'Support comparative claims with head-to-head clinical study data.',
      'fda_006': 'Add disclaimer: "Individual results may vary. Not all patients will achieve the same results."',
      'fda_007': 'Present clinical data completely, including study limitations and adverse events.',
      'fda_008': 'Clearly state: "FDA cleared for [specific indication]"',
      'hipaa_001': 'Remove all patient-identifiable information or obtain written authorization.'
    };

    return recommendations[rule.id] || 'Review and revise content to meet regulatory requirements.';
  }

  // Check specific content types
  async checkEmailCompliance(
    subject: string,
    body: string,
    userId: string,
    recipientType?: 'physician' | 'patient' | 'staff'
  ): Promise<ComplianceCheck> {
    const fullContent = `Subject: ${subject}\n\n${body}`;
    return this.checkCompliance(fullContent, 'email', userId, { recipientType });
  }

  async checkSmsCompliance(
    message: string,
    userId: string
  ): Promise<ComplianceCheck> {
    // SMS has additional character limit considerations
    if (message.length > 160) {
      console.warn('SMS exceeds 160 characters - may be split into multiple messages');
    }
    return this.checkCompliance(message, 'sms', userId);
  }

  // Pre-approved content templates
  async getCompliantTemplates(contentType: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('compliant_templates')
      .select('*')
      .eq('content_type', contentType)
      .eq('approved', true);

    if (error) {
      console.error('Error fetching compliant templates:', error);
      return [];
    }

    return data || [];
  }

  // Store compliance check in database
  private async storeComplianceCheck(check: ComplianceCheck): Promise<void> {
    const { error } = await supabase
      .from('compliance_checks')
      .insert({
        id: check.id,
        content_type: check.content_type,
        content: check.content,
        check_results: check.check_results,
        overall_status: check.overall_status,
        checked_at: check.checked_at,
        checked_by: check.checked_by,
        metadata: check.metadata
      });

    if (error) {
      console.error('Error storing compliance check:', error);
    }
  }

  // Audit trail logging
  private async logAuditTrail(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const auditLog: AuditLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...log
    };

    const { error } = await supabase
      .from('compliance_audit_logs')
      .insert(auditLog);

    if (error) {
      console.error('Error logging audit trail:', error);
    }
  }

  // Get compliance history
  async getComplianceHistory(
    userId?: string,
    contentType?: string,
    limit: number = 100
  ): Promise<ComplianceCheck[]> {
    let query = supabase
      .from('compliance_checks')
      .select('*')
      .order('checked_at', { ascending: false })
      .limit(limit);

    if (userId) {
      query = query.eq('checked_by', userId);
    }

    if (contentType) {
      query = query.eq('content_type', contentType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching compliance history:', error);
      return [];
    }

    return data || [];
  }

  // Real-time compliance monitoring
  subscribeToComplianceAlerts(callback: (alert: any) => void): () => void {
    const subscription = supabase
      .channel('compliance-alerts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'compliance_checks',
        filter: 'overall_status=eq.violations'
      }, (payload) => {
        callback(payload.new);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  // Export compliance report
  async generateComplianceReport(
    startDate: string,
    endDate: string,
    userId?: string
  ): Promise<any> {
    const { data, error } = await supabase
      .from('compliance_checks')
      .select('*')
      .gte('checked_at', startDate)
      .lte('checked_at', endDate)
      .eq(userId ? 'checked_by' : '', userId || '');

    if (error) {
      console.error('Error generating compliance report:', error);
      return null;
    }

    // Analyze compliance data
    const report = {
      period: { start: startDate, end: endDate },
      totalChecks: data.length,
      violationCount: data.filter(c => c.overall_status === 'violations').length,
      warningCount: data.filter(c => c.overall_status === 'warnings').length,
      compliantCount: data.filter(c => c.overall_status === 'compliant').length,
      complianceRate: data.length > 0 
        ? (data.filter(c => c.overall_status === 'compliant').length / data.length) * 100 
        : 0,
      byContentType: this.groupByContentType(data),
      commonViolations: this.analyzeCommonViolations(data),
      generatedAt: new Date().toISOString()
    };

    return report;
  }

  private groupByContentType(checks: ComplianceCheck[]): any {
    const grouped: any = {};
    checks.forEach(check => {
      if (!grouped[check.content_type]) {
        grouped[check.content_type] = {
          total: 0,
          compliant: 0,
          warnings: 0,
          violations: 0
        };
      }
      grouped[check.content_type].total++;
      grouped[check.content_type][check.overall_status]++;
    });
    return grouped;
  }

  private analyzeCommonViolations(checks: ComplianceCheck[]): any[] {
    const violationCounts: Map<string, number> = new Map();
    
    checks.forEach(check => {
      check.check_results
        .filter(result => result.status === 'fail')
        .forEach(result => {
          const count = violationCounts.get(result.rule_name) || 0;
          violationCounts.set(result.rule_name, count + 1);
        });
    });

    return Array.from(violationCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ruleName, count]) => ({ ruleName, count }));
  }
}

export default ComplianceEngine;