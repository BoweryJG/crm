// Medical Claims Validation Service
// Ensures all medical claims are properly substantiated and compliant

import { supabase } from '../supabase/supabase';
import { ComplianceEngine } from './ComplianceEngine';

export interface MedicalClaim {
  id: string;
  claim_text: string;
  claim_type: 'efficacy' | 'safety' | 'comparative' | 'economic' | 'quality_of_life';
  product_name: string;
  substantiation_required: boolean;
  substantiation_status: 'pending' | 'approved' | 'rejected' | 'conditional';
  evidence_documents: EvidenceDocument[];
  review_notes?: string;
  created_at: string;
  created_by: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface EvidenceDocument {
  id: string;
  claim_id: string;
  document_type: 'clinical_study' | 'fda_clearance' | 'peer_review' | 'internal_data' | 'expert_opinion';
  title: string;
  source: string;
  publication_date?: string;
  relevance_score: number;
  key_findings: string[];
  limitations?: string[];
  document_url?: string;
  uploaded_at: string;
  uploaded_by: string;
}

export interface ClaimValidationResult {
  claim_id: string;
  is_valid: boolean;
  confidence_score: number;
  issues: ValidationIssue[];
  recommendations: string[];
  regulatory_risks: RegulatoryRisk[];
}

export interface ValidationIssue {
  type: 'unsupported' | 'overstated' | 'misleading' | 'outdated' | 'off_label';
  severity: 'critical' | 'major' | 'minor';
  description: string;
  evidence_gap?: string;
}

export interface RegulatoryRisk {
  agency: 'FDA' | 'FTC' | 'DOJ';
  risk_level: 'high' | 'medium' | 'low';
  potential_action: string;
  mitigation_strategy: string;
}

export class MedicalClaimsValidator {
  private static instance: MedicalClaimsValidator;
  private complianceEngine: ComplianceEngine;
  
  // Common unsubstantiated claim patterns
  private readonly RISKY_PATTERNS = [
    { pattern: /guaranteed|100%|always|never/gi, risk: 'absolute_claim' },
    { pattern: /cure|heal|eliminate|eradicate/gi, risk: 'cure_claim' },
    { pattern: /only|unique|exclusive|first/gi, risk: 'superiority_claim' },
    { pattern: /safe|risk-free|no side effects/gi, risk: 'safety_claim' },
    { pattern: /FDA approved/gi, risk: 'approval_claim' }, // Medical devices are "cleared" not "approved"
    { pattern: /breakthrough|revolutionary|miracle/gi, risk: 'hyperbole' },
    { pattern: /clinically proven|scientifically proven/gi, risk: 'proof_claim' },
    { pattern: /doctor recommended|physician preferred/gi, risk: 'endorsement_claim' }
  ];

  // Required substantiation levels by claim type
  private readonly SUBSTANTIATION_REQUIREMENTS = {
    efficacy: {
      min_studies: 1,
      study_types: ['clinical_study', 'peer_review'],
      required_elements: ['sample_size', 'methodology', 'statistical_significance']
    },
    safety: {
      min_studies: 1,
      study_types: ['clinical_study', 'fda_clearance'],
      required_elements: ['adverse_events', 'contraindications', 'warnings']
    },
    comparative: {
      min_studies: 1,
      study_types: ['clinical_study'],
      required_elements: ['head_to_head', 'same_conditions', 'statistical_analysis']
    },
    economic: {
      min_studies: 1,
      study_types: ['clinical_study', 'internal_data'],
      required_elements: ['cost_analysis', 'roi_calculation', 'methodology']
    },
    quality_of_life: {
      min_studies: 1,
      study_types: ['clinical_study', 'peer_review'],
      required_elements: ['patient_reported_outcomes', 'validated_instruments']
    }
  };

  private constructor() {
    this.complianceEngine = ComplianceEngine.getInstance();
  }

  static getInstance(): MedicalClaimsValidator {
    if (!MedicalClaimsValidator.instance) {
      MedicalClaimsValidator.instance = new MedicalClaimsValidator();
    }
    return MedicalClaimsValidator.instance;
  }

  // Validate a medical claim
  async validateClaim(
    claimText: string,
    claimType: MedicalClaim['claim_type'],
    productName: string,
    evidence: EvidenceDocument[] = []
  ): Promise<ClaimValidationResult> {
    const issues: ValidationIssue[] = [];
    const recommendations: string[] = [];
    const regulatoryRisks: RegulatoryRisk[] = [];
    
    // Check for risky patterns
    const patternIssues = this.checkRiskyPatterns(claimText);
    issues.push(...patternIssues);

    // Validate evidence sufficiency
    const evidenceIssues = this.validateEvidence(claimType, evidence);
    issues.push(...evidenceIssues);

    // Check claim-evidence alignment
    const alignmentIssues = await this.checkClaimEvidenceAlignment(claimText, evidence);
    issues.push(...alignmentIssues);

    // Assess regulatory risks
    const risks = this.assessRegulatoryRisks(claimText, issues);
    regulatoryRisks.push(...risks);

    // Generate recommendations
    const recs = this.generateRecommendations(claimText, issues, evidence);
    recommendations.push(...recs);

    // Calculate confidence score
    const confidenceScore = this.calculateConfidenceScore(issues, evidence);

    return {
      claim_id: crypto.randomUUID(),
      is_valid: issues.filter(i => i.severity === 'critical').length === 0,
      confidence_score: confidenceScore,
      issues,
      recommendations,
      regulatory_risks: regulatoryRisks
    };
  }

  private checkRiskyPatterns(claimText: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    for (const { pattern, risk } of this.RISKY_PATTERNS) {
      const matches = claimText.match(pattern);
      if (matches) {
        issues.push({
          type: 'misleading',
          severity: risk === 'cure_claim' || risk === 'approval_claim' ? 'critical' : 'major',
          description: `Contains risky language: "${matches.join('", "')}". ${this.getRiskExplanation(risk)}`,
          evidence_gap: `Requires strong clinical evidence to support ${risk.replace('_', ' ')}`
        });
      }
    }

    return issues;
  }

  private getRiskExplanation(risk: string): string {
    const explanations: Record<string, string> = {
      'absolute_claim': 'Absolute claims are rarely supportable and create liability.',
      'cure_claim': 'FDA prohibits cure claims for medical devices.',
      'superiority_claim': 'Requires head-to-head clinical trials for substantiation.',
      'safety_claim': 'All medical devices have potential risks that must be disclosed.',
      'approval_claim': 'Medical devices are FDA "cleared" not "approved".',
      'hyperbole': 'Exaggerated claims undermine credibility and may violate regulations.',
      'proof_claim': 'Requires robust clinical evidence with statistical significance.',
      'endorsement_claim': 'Requires documented survey data or professional organization endorsement.'
    };
    return explanations[risk] || 'May require additional substantiation.';
  }

  private validateEvidence(
    claimType: MedicalClaim['claim_type'],
    evidence: EvidenceDocument[]
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const requirements = this.SUBSTANTIATION_REQUIREMENTS[claimType];

    // Check minimum studies
    const relevantStudies = evidence.filter(e => 
      requirements.study_types.includes(e.document_type)
    );

    if (relevantStudies.length < requirements.min_studies) {
      issues.push({
        type: 'unsupported',
        severity: 'critical',
        description: `Insufficient evidence: ${relevantStudies.length} of ${requirements.min_studies} required studies`,
        evidence_gap: `Need ${requirements.study_types.join(' or ')} to support ${claimType} claims`
      });
    }

    // Check for required elements in evidence
    const hasAllElements = requirements.required_elements.every(element =>
      evidence.some(e => 
        e.key_findings.some(finding => 
          finding.toLowerCase().includes(element.replace('_', ' '))
        )
      )
    );

    if (!hasAllElements) {
      issues.push({
        type: 'unsupported',
        severity: 'major',
        description: 'Evidence lacks required elements',
        evidence_gap: `Missing: ${requirements.required_elements.join(', ')}`
      });
    }

    // Check evidence quality
    const avgRelevanceScore = evidence.length > 0
      ? evidence.reduce((sum, e) => sum + e.relevance_score, 0) / evidence.length
      : 0;

    if (avgRelevanceScore < 0.7) {
      issues.push({
        type: 'unsupported',
        severity: 'major',
        description: 'Evidence quality/relevance is insufficient',
        evidence_gap: 'Need more directly relevant clinical evidence'
      });
    }

    return issues;
  }

  private async checkClaimEvidenceAlignment(
    claimText: string,
    evidence: EvidenceDocument[]
  ): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];

    // Extract key claim components
    const claimKeywords = this.extractKeywords(claimText);
    
    // Check if evidence supports the specific claims
    const supportedKeywords = new Set<string>();
    
    evidence.forEach(doc => {
      doc.key_findings.forEach(finding => {
        claimKeywords.forEach(keyword => {
          if (finding.toLowerCase().includes(keyword.toLowerCase())) {
            supportedKeywords.add(keyword);
          }
        });
      });
    });

    const unsupportedKeywords = claimKeywords.filter(k => !supportedKeywords.has(k));
    
    if (unsupportedKeywords.length > 0) {
      issues.push({
        type: 'unsupported',
        severity: 'major',
        description: `Key claim elements not supported by evidence: ${unsupportedKeywords.join(', ')}`,
        evidence_gap: 'Evidence does not directly address all claim components'
      });
    }

    // Check for overstated claims
    const hasLimitations = evidence.some(e => e.limitations && e.limitations.length > 0);
    if (hasLimitations && !claimText.toLowerCase().includes('may')) {
      issues.push({
        type: 'overstated',
        severity: 'minor',
        description: 'Claim should acknowledge study limitations',
        evidence_gap: 'Add qualifying language to reflect evidence limitations'
      });
    }

    return issues;
  }

  private extractKeywords(text: string): string[] {
    // Extract medical/technical keywords
    const medicalTerms = text.match(/\b(?:efficacy|safety|reduction|improvement|treatment|outcomes?|patients?|clinical|significant)\b/gi) || [];
    const percentages = text.match(/\d+%/g) || [];
    const comparisons = text.match(/\b(?:better|more|less|faster|safer|effective)\b/gi) || [];
    
    return Array.from(new Set([...medicalTerms, ...percentages, ...comparisons]));
  }

  private assessRegulatoryRisks(
    claimText: string,
    issues: ValidationIssue[]
  ): RegulatoryRisk[] {
    const risks: RegulatoryRisk[] = [];

    // FDA risk assessment
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      risks.push({
        agency: 'FDA',
        risk_level: 'high',
        potential_action: 'Warning Letter or Notice of Violation',
        mitigation_strategy: 'Immediately revise claims and consult regulatory counsel'
      });
    }

    // FTC risk for deceptive advertising
    if (issues.some(i => i.type === 'misleading' || i.type === 'overstated')) {
      risks.push({
        agency: 'FTC',
        risk_level: 'medium',
        potential_action: 'Investigation for deceptive advertising practices',
        mitigation_strategy: 'Ensure all claims are truthful, non-misleading, and substantiated'
      });
    }

    // DOJ risk for False Claims Act
    if (claimText.toLowerCase().includes('medicare') || claimText.toLowerCase().includes('reimburs')) {
      risks.push({
        agency: 'DOJ',
        risk_level: 'medium',
        potential_action: 'False Claims Act investigation',
        mitigation_strategy: 'Carefully review all reimbursement-related claims'
      });
    }

    return risks;
  }

  private generateRecommendations(
    claimText: string,
    issues: ValidationIssue[],
    evidence: EvidenceDocument[]
  ): string[] {
    const recommendations: string[] = [];

    // General recommendations based on issues
    if (issues.some(i => i.type === 'unsupported')) {
      recommendations.push('Obtain additional clinical evidence before using this claim');
    }

    if (issues.some(i => i.type === 'overstated')) {
      recommendations.push('Add qualifying language: "may", "in clinical studies", "results may vary"');
    }

    if (issues.some(i => i.type === 'misleading')) {
      recommendations.push('Revise claim to be more accurate and balanced');
    }

    // Specific recommendations
    if (!claimText.includes('FDA cleared')) {
      recommendations.push('Include FDA clearance status and indication for use');
    }

    if (evidence.length === 0) {
      recommendations.push('Create evidence dossier with clinical studies and FDA documentation');
    }

    // Best practices
    recommendations.push('Consider having medical/regulatory review before publication');
    recommendations.push('Maintain claim substantiation files for all marketing materials');

    return recommendations;
  }

  private calculateConfidenceScore(
    issues: ValidationIssue[],
    evidence: EvidenceDocument[]
  ): number {
    let score = 100;

    // Deduct points for issues
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical': score -= 30; break;
        case 'major': score -= 20; break;
        case 'minor': score -= 10; break;
      }
    });

    // Bonus points for good evidence
    score += Math.min(evidence.length * 5, 20); // Max 20 bonus points
    
    // Average relevance score bonus
    if (evidence.length > 0) {
      const avgRelevance = evidence.reduce((sum, e) => sum + e.relevance_score, 0) / evidence.length;
      score += avgRelevance * 10; // Max 10 bonus points
    }

    return Math.max(0, Math.min(100, score));
  }

  // Store claim validation in database
  async saveClaim(
    claim: Omit<MedicalClaim, 'id' | 'created_at'>,
    validationResult: ClaimValidationResult
  ): Promise<string> {
    const claimId = crypto.randomUUID();
    
    const { error } = await supabase
      .from('medical_claims')
      .insert({
        id: claimId,
        ...claim,
        created_at: new Date().toISOString(),
        validation_result: validationResult
      });

    if (error) {
      console.error('Error saving medical claim:', error);
      throw error;
    }

    return claimId;
  }

  // Get pre-approved claims
  async getApprovedClaims(productName: string): Promise<MedicalClaim[]> {
    const { data, error } = await supabase
      .from('medical_claims')
      .select('*')
      .eq('product_name', productName)
      .eq('substantiation_status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching approved claims:', error);
      return [];
    }

    return data || [];
  }

  // Review claim with evidence
  async reviewClaim(
    claimId: string,
    reviewerId: string,
    status: 'approved' | 'rejected' | 'conditional',
    notes?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('medical_claims')
      .update({
        substantiation_status: status,
        review_notes: notes,
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerId
      })
      .eq('id', claimId);

    if (error) {
      console.error('Error reviewing claim:', error);
      throw error;
    }
  }

  // Off-label detection
  async checkOffLabelPromotion(
    content: string,
    productName: string,
    clearedIndications: string[]
  ): Promise<{ isOffLabel: boolean; detectedUses: string[] }> {
    // Common off-label indicators
    const offLabelPatterns = [
      /alternative use/gi,
      /can also be used/gi,
      /other applications/gi,
      /experimental/gi,
      /investigational/gi
    ];

    let isOffLabel = false;
    const detectedUses: string[] = [];

    // Check for off-label patterns
    offLabelPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        isOffLabel = true;
      }
    });

    // Extract potential indications from content
    const contentLower = content.toLowerCase();
    
    // Check if content discusses uses not in cleared indications
    const potentialUses = this.extractPotentialUses(content);
    
    potentialUses.forEach(use => {
      const isCleared = clearedIndications.some(indication => 
        indication.toLowerCase().includes(use.toLowerCase()) ||
        use.toLowerCase().includes(indication.toLowerCase())
      );
      
      if (!isCleared) {
        isOffLabel = true;
        detectedUses.push(use);
      }
    });

    return { isOffLabel, detectedUses };
  }

  private extractPotentialUses(content: string): string[] {
    // Extract phrases that might indicate medical uses
    const usePatterns = [
      /for (?:treating|treatment of|managing|management of) ([^,.]+)/gi,
      /indicated for ([^,.]+)/gi,
      /used in ([^,.]+)/gi,
      /effective for ([^,.]+)/gi,
      /helps with ([^,.]+)/gi
    ];

    const uses: string[] = [];
    
    usePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        uses.push(match[1].trim());
      }
    });

    return Array.from(new Set(uses));
  }
}

export default MedicalClaimsValidator;