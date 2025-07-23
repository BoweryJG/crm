// Medical Device Sales Automation Templates - 34 Revolutionary Templates
// Category-defining automation system for medical device, injectable, laser, and aesthetic sales reps

export interface AutomationTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  psychology: string;
  workflow_steps: WorkflowStep[];
  triggers: AutomationTrigger[];
  target_stakeholders: string[];
  personalization_variables: string[];
  success_metrics: string[];
  estimated_duration: string;
  difficulty_level: 'Easy' | 'Medium' | 'Advanced';
}

export interface WorkflowStep {
  id: string;
  type: 'email' | 'wait' | 'condition' | 'action';
  name: string;
  content?: EmailContent;
  delay_hours?: number;
  conditions?: any;
  actions?: any;
}

export interface EmailContent {
  subject: string;
  body_html: string;
  body_text: string;
  personalization_tags: string[];
}

export interface AutomationTrigger {
  type: string;
  conditions: any;
  description: string;
}

// 34 Revolutionary Medical Device Automation Templates
export const MEDICAL_AUTOMATION_TEMPLATES: AutomationTemplate[] = [
  
  // PSYCHOLOGICAL WARFARE AUTOMATIONS (4)
  {
    id: 'celebrity_doctor_maker',
    name: 'The Celebrity Doctor Maker',
    category: 'Psychological Warfare',
    description: 'Transform successful doctors into industry celebrities with compelling case studies and media opportunities',
    psychology: 'Targets doctors\' desire for professional recognition and thought leadership status',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Success Recognition',
        content: {
          subject: 'Dr. {{last_name}} - Your {{procedure}} Results Are Exceptional',
          body_html: `<p>Dear Dr. {{last_name}},</p>
          <p>Your recent {{device_name}} results are among the top 5% we've seen. Your {{outcome_metric}} improvement of {{percentage}}% is remarkable.</p>
          <p>Would you be interested in sharing your success story with the medical community? We can help you:</p>
          <ul>
          <li>Publish a case study in {{specialty_journal}}</li>
          <li>Present at {{upcoming_conference}}</li>
          <li>Feature in our thought leadership series</li>
          </ul>`,
          body_text: 'Dr. {{last_name}}, Your {{device_name}} results are exceptional. Let us help you share your success.',
          personalization_tags: ['last_name', 'procedure', 'device_name', 'outcome_metric', 'percentage']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Response Window',
        delay_hours: 72
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Celebrity Package Offer',
        content: {
          subject: 'Make Dr. {{last_name}} The Go-To {{specialty}} Expert',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>We're offering you our exclusive "Medical Celebrity Package":</p>
          <ul>
          <li>Professional photography session</li>
          <li>PR template creation</li>
          <li>Social media content package</li>
          <li>Press release distribution</li>
          <li>Speaking opportunity coordination</li>
          </ul>
          <p>Become the recognized leader in {{specialty}} that patients seek out.</p>`,
          body_text: 'Dr. {{last_name}}, Become the recognized {{specialty}} leader with our Celebrity Package.',
          personalization_tags: ['last_name', 'specialty']
        }
      }
    ],
    triggers: [
      {
        type: 'patient_outcome',
        conditions: { outcome_improvement: '>20%', satisfaction_score: '>4.5' },
        description: 'Exceptional patient outcomes with high satisfaction'
      },
      {
        type: 'usage_milestone',
        conditions: { procedures_completed: '>50', success_rate: '>90%' },
        description: 'High usage with excellent success rate'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner'],
    personalization_variables: ['last_name', 'specialty', 'device_name', 'outcome_metric', 'percentage'],
    success_metrics: ['Response Rate', 'Case Study Completion', 'Speaking Engagements', 'Media Mentions'],
    estimated_duration: '2-3 weeks',
    difficulty_level: 'Medium'
  },

  {
    id: 'practice_jealousy_engine',
    name: 'The Practice Jealousy Engine',
    category: 'Psychological Warfare',
    description: 'Show competing practices anonymized success metrics to trigger competitive FOMO',
    psychology: 'Leverages competitive nature and fear of being left behind',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Competitive Intelligence Alert',
        content: {
          subject: 'Your Competition Is Pulling Ahead in {{city}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Market intelligence shows concerning trends in {{city}}:</p>
          <ul>
          <li>A practice 2 miles from you increased revenue 40% with {{device_name}}</li>
          <li>Another {{specialty}} practice added 3 new treatment rooms</li>
          <li>Patient search volume for "{{procedure}}" increased 65% in your area</li>
          </ul>
          <p>Your patients are noticing the gap. Let's discuss how to maintain your competitive edge.</p>`,
          body_text: 'Dr. {{last_name}}, Competitors in {{city}} are pulling ahead. Let\'s maintain your edge.',
          personalization_tags: ['last_name', 'city', 'device_name', 'specialty', 'procedure']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Urgency Building',
        delay_hours: 48
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Solution Positioning',
        content: {
          subject: 'Don\'t Let {{competitor_practice}} Dominate {{specialty}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>While you've been the established leader in {{city}}, new players are making moves:</p>
          <p><strong>Market Reality Check:</strong></p>
          <ul>
          <li>{{competitor_practice}} just invested &dollar;{{investment_amount}} in new equipment</li>
          <li>They're marketing "most advanced {{procedure}} in {{city}}"</li>
          <li>Google searches show patients comparing your practices</li>
          </ul>
          <p>It's time to reassert your dominance. Let me show you how {{device_name}} can help you leapfrog the competition.</p>`,
          body_text: 'Dr. {{last_name}}, {{competitor_practice}} is investing heavily. Time to reassert your dominance.',
          personalization_tags: ['last_name', 'competitor_practice', 'specialty', 'city', 'investment_amount', 'procedure', 'device_name']
        }
      }
    ],
    triggers: [
      {
        type: 'competitor_activity',
        conditions: { new_equipment_purchase: true, marketing_activity: 'increased' },
        description: 'Competitor makes significant investment or marketing push'
      },
      {
        type: 'market_share',
        conditions: { market_share_decline: '>5%', patient_inquiries: 'decreased' },
        description: 'Practice losing market share or patient interest'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'Administrator'],
    personalization_variables: ['last_name', 'city', 'competitor_practice', 'specialty', 'procedure'],
    success_metrics: ['Demo Requests', 'Competitive Analysis Meetings', 'Purchasing Timeline Acceleration'],
    estimated_duration: '1 week',
    difficulty_level: 'Advanced'
  },

  // INTELLIGENCE & PREDICTION AUTOMATIONS (4)
  {
    id: 'crystal_ball_predictor',
    name: 'The Crystal Ball Predictor',
    category: 'Intelligence & Prediction',
    description: 'AI predicts which practices will need devices 6-12 months before they know it themselves',
    psychology: 'Positions sales rep as strategic advisor with valuable market intelligence',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Future Market Intelligence',
        content: {
          subject: 'Dr. {{last_name}} - Market Prediction for {{specialty}} in {{city}}',
          body_html: `<p>Dear Dr. {{last_name}},</p>
          <p>Our AI analysis predicts significant changes coming to {{specialty}} in {{region}}:</p>
          <h3>6-Month Forecast:</h3>
          <ul>
          <li>{{procedure}} demand will increase {{percentage}}% in your area</li>
          <li>Insurance coverage expanding for {{treatment_type}}</li>
          <li>New competitor entering market in {{timeline}}</li>
          </ul>
          <h3>Strategic Recommendation:</h3>
          <p>Practices that prepare now will capture 80% of the new market. Those who wait will struggle to catch up.</p>`,
          body_text: 'Dr. {{last_name}}, AI predicts {{percentage}}% increase in {{procedure}} demand. Prepare now to capture market.',
          personalization_tags: ['last_name', 'specialty', 'city', 'region', 'procedure', 'percentage', 'treatment_type', 'timeline']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Prediction Processing Time',
        delay_hours: 96
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Strategic Partnership Offer',
        content: {
          subject: 'Be The First {{specialty}} Practice Ready for 2025',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Our predictions have been 94% accurate over the past 3 years. Here's what we see for practices like yours:</p>
          <p><strong>Early Adopters (Next 6 Months):</strong></p>
          <ul>
          <li>Average revenue increase: {{revenue_increase}}%</li>
          <li>Patient acquisition: {{patient_increase}} new patients/month</li>
          <li>Market leadership position secured</li>
          </ul>
          <p><strong>Late Adopters (12+ Months):</strong></p>
          <ul>
          <li>Playing catch-up with established competitors</li>
          <li>Higher equipment costs (average {{cost_increase}}% more)</li>
          <li>Reduced market share</li>
          </ul>`,
          body_text: 'Dr. {{last_name}}, Early adopters see {{revenue_increase}}% revenue increase. Late adopters pay {{cost_increase}}% more.',
          personalization_tags: ['last_name', 'specialty', 'revenue_increase', 'patient_increase', 'cost_increase']
        }
      }
    ],
    triggers: [
      {
        type: 'market_trend_analysis',
        conditions: { trend_confidence: '>85%', timeline: '6-12 months' },
        description: 'AI identifies high-confidence market trend predictions'
      },
      {
        type: 'practice_growth_indicators',
        conditions: { hiring_activity: true, facility_expansion: 'planning' },
        description: 'Practice showing signs of growth and expansion'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'Administrator'],
    personalization_variables: ['last_name', 'specialty', 'city', 'region', 'procedure', 'percentage'],
    success_metrics: ['Strategic Planning Meetings', 'Early Adoption Rate', 'Revenue Predictions Accuracy'],
    estimated_duration: '2-3 weeks',
    difficulty_level: 'Advanced'
  },

  // FINANCIAL & ROI AUTOMATIONS (4)
  {
    id: 'revenue_rescue_mission',
    name: 'The Revenue Rescue Mission',
    category: 'Financial & ROI',
    description: 'Target declining practices with specific financial recovery plans using your device',
    psychology: 'Addresses financial fear and offers concrete solution with ROI projections',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Financial Health Assessment',
        content: {
          subject: 'Dr. {{last_name}} - {{specialty}} Revenue Analysis for {{practice_name}}',
          body_html: `<p>Dear Dr. {{last_name}},</p>
          <p>Our analysis of {{specialty}} practices in {{city}} shows concerning trends:</p>
          <h3>Market Benchmarking:</h3>
          <ul>
          <li>Average {{specialty}} practice revenue: &dollar;{{market_average}}</li>
          <li>Top-performing practices: &dollar;{{top_performer_revenue}}</li>
          <li>Growth practices common factor: {{growth_factor}}</li>
          </ul>
          <h3>Revenue Recovery Projection for {{practice_name}}:</h3>
          <p>With {{device_name}}, similar practices have achieved:</p>
          <ul>
          <li>{{revenue_increase}}% revenue increase within {{timeline}}</li>
          <li>{{patient_volume}}% increase in patient volume</li>
          <li>ROI: {{roi_percentage}}% in year one</li>
          </ul>`,
          body_text: 'Dr. {{last_name}}, {{device_name}} helps practices achieve {{revenue_increase}}% revenue increase within {{timeline}}.',
          personalization_tags: ['last_name', 'specialty', 'practice_name', 'city', 'market_average', 'device_name', 'revenue_increase']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Financial Review Period',
        delay_hours: 120
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Custom Recovery Plan',
        content: {
          subject: 'Custom Revenue Recovery Plan for {{practice_name}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>I've prepared a custom recovery plan for {{practice_name}}:</p>
          <h3>Phase 1: Immediate Revenue (Months 1-3)</h3>
          <ul>
          <li>Add {{procedure_1}} services: +&dollar;{{immediate_revenue}}/month</li>
          <li>Optimize existing {{procedure_2}} efficiency: +{{efficiency_gain}}%</li>
          <li>Patient retention improvement: +{{retention_increase}}%</li>
          </ul>
          <h3>Phase 2: Growth Acceleration (Months 4-12)</h3>
          <ul>
          <li>Market expansion opportunities: +&dollar;{{expansion_revenue}}/month</li>
          <li>Premium service positioning</li>
          <li>Insurance reimbursement optimization</li>
          </ul>
          <p><strong>Total Projected Recovery: &dollar;{{total_recovery}} in Year 1</strong></p>`,
          body_text: 'Dr. {{last_name}}, Custom recovery plan projects &dollar;{{total_recovery}} increase in Year 1.',
          personalization_tags: ['last_name', 'practice_name', 'procedure_1', 'immediate_revenue', 'total_recovery']
        }
      }
    ],
    triggers: [
      {
        type: 'financial_decline',
        conditions: { revenue_decline: '>10%', patient_volume_decline: '>15%' },
        description: 'Practice showing significant revenue or patient volume decline'
      },
      {
        type: 'market_underperformance',
        conditions: { below_market_average: true, competitor_growth: '>20%' },
        description: 'Practice underperforming compared to market benchmarks'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'Administrator', 'CFO'],
    personalization_variables: ['practice_name', 'specialty', 'revenue_increase', 'timeline', 'roi_percentage'],
    success_metrics: ['Financial Planning Meetings', 'ROI Calculations Requested', 'Purchase Decisions'],
    estimated_duration: '3-4 weeks',
    difficulty_level: 'Medium'
  },

  // Remaining Psychological Warfare Templates (2 more)
  {
    id: 'ego_stroke_engine',
    name: 'The Ego Stroke Engine',
    category: 'Psychological Warfare',
    description: 'Make doctors feel like the smartest person in the room by validating their expertise',
    psychology: 'Appeals to professional ego and desire for intellectual validation',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Expert Recognition',
        content: {
          subject: 'Dr. {{last_name}}, Your Expertise in {{specialty}} is Exceptional',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>After reviewing your approach to {{complex_case}}, I'm genuinely impressed by your clinical reasoning.</p>
          <p>Your understanding of {{technical_concept}} goes beyond what most {{specialty}} practitioners grasp. Specifically:</p>
          <ul>
          <li>Your {{treatment_approach}} methodology is textbook-perfect</li>
          <li>Few doctors would have caught the {{subtle_indication}} you identified</li>
          <li>Your patient outcomes speak to your exceptional skill</li>
          </ul>
          <p>I'd love to discuss how {{device_name}} can complement your already superior clinical judgment.</p>`,
          body_text: 'Dr. {{last_name}}, Your expertise in {{specialty}} is exceptional. Let\'s discuss how {{device_name}} complements your skills.',
          personalization_tags: ['last_name', 'specialty', 'complex_case', 'technical_concept', 'treatment_approach', 'device_name']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Ego Processing Time',
        delay_hours: 96
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Peer Recognition Setup',
        content: {
          subject: 'Dr. {{last_name}} - Your Peers Are Asking About Your Results',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your reputation in {{city}} is generating inquiries. Three colleagues have asked me:</p>
          <p><em>"How does Dr. {{last_name}} consistently achieve such exceptional {{outcome_type}} results?"</em></p>
          <p>They're particularly interested in:</p>
          <ul>
          <li>Your patient selection criteria</li>
          <li>Your post-procedure protocol</li>
          <li>Your approach to {{challenging_cases}}</li>
          </ul>
          <p>Would you be interested in a brief call to discuss your methodology? I suspect other doctors could learn from your approach.</p>`,
          body_text: 'Dr. {{last_name}}, Your peers are asking about your exceptional results. Share your methodology?',
          personalization_tags: ['last_name', 'city', 'outcome_type', 'challenging_cases']
        }
      }
    ],
    triggers: [
      {
        type: 'professional_achievement',
        conditions: { publications: '>0', conference_presentations: '>0' },
        description: 'Doctor with academic or speaking achievements'
      },
      {
        type: 'peer_recognition',
        conditions: { referrals_received: '>high', patient_satisfaction: '>95%' },
        description: 'Doctor with high peer recognition and patient satisfaction'
      }
    ],
    target_stakeholders: ['Doctor', 'Department Head'],
    personalization_variables: ['last_name', 'specialty', 'complex_case', 'technical_concept', 'treatment_approach'],
    success_metrics: ['Response Rate', 'Meeting Acceptance', 'Ego Validation Engagement'],
    estimated_duration: '2 weeks',
    difficulty_level: 'Medium'
  },

  {
    id: 'fear_uncertainty_doubt',
    name: 'The FUD Generator',
    category: 'Psychological Warfare',
    description: 'Create strategic uncertainty about current methods to drive change adoption',
    psychology: 'Leverages fear of being outdated and uncertainty about current practices',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Industry Shift Alert',
        content: {
          subject: 'Dr. {{last_name}} - Major Changes Coming to {{specialty}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Concerning developments in {{specialty}} that may affect your practice:</p>
          <h3>Industry Shifts:</h3>
          <ul>
          <li>New {{regulatory_change}} guidelines expected Q{{quarter}}</li>
          <li>Insurance companies questioning traditional {{procedure}} approaches</li>
          <li>Patient expectations shifting toward {{new_standard}} outcomes</li>
          <li>Malpractice insurers raising rates for outdated techniques</li>
          </ul>
          <p><strong>Are you prepared for these changes?</strong></p>
          <p>Practices that adapt early maintain their competitive edge.</p>`,
          body_text: 'Dr. {{last_name}}, Major changes coming to {{specialty}}. Are you prepared?',
          personalization_tags: ['last_name', 'specialty', 'regulatory_change', 'quarter', 'procedure', 'new_standard']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Anxiety Building Period',
        delay_hours: 72
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Solution Positioning',
        content: {
          subject: 'Don\'t Get Left Behind - {{device_name}} Future-Proofs Your Practice',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>While industry uncertainty creates challenges, it also creates opportunities for prepared practices.</p>
          <p><strong>{{device_name}} addresses all upcoming concerns:</strong></p>
          <ul>
          <li>✓ Meets new {{regulatory_standard}} requirements</li>
          <li>✓ Provides {{outcome_improvement}} outcomes insurers prefer</li>
          <li>✓ Reduces liability with {{safety_feature}} technology</li>
          <li>✓ Positions you as innovative leader</li>
          </ul>
          <p>Let me show you how forward-thinking practices are preparing.</p>`,
          body_text: 'Dr. {{last_name}}, {{device_name}} future-proofs your practice against industry changes.',
          personalization_tags: ['last_name', 'device_name', 'regulatory_standard', 'outcome_improvement', 'safety_feature']
        }
      }
    ],
    triggers: [
      {
        type: 'regulatory_change',
        conditions: { new_guidelines: true, compliance_deadline: '<12 months' },
        description: 'Upcoming regulatory or compliance changes'
      },
      {
        type: 'market_disruption',
        conditions: { new_technology: true, competitor_adoption: 'increasing' },
        description: 'Market disruption or new technology adoption'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'Administrator'],
    personalization_variables: ['specialty', 'regulatory_change', 'procedure', 'device_name'],
    success_metrics: ['Anxiety Response Rate', 'Demo Requests', 'Urgency Indicators'],
    estimated_duration: '1-2 weeks',
    difficulty_level: 'Advanced'
  },

  // Intelligence & Prediction Templates (3 more)
  {
    id: 'market_insider_intel',
    name: 'The Market Insider Intel',
    category: 'Intelligence & Prediction',
    description: 'Share exclusive market intelligence and insider trends before they become public',
    psychology: 'Makes doctors feel like privileged insiders with exclusive information',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Exclusive Intelligence Brief',
        content: {
          subject: 'CONFIDENTIAL: {{specialty}} Market Intelligence - {{date}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p><strong>CONFIDENTIAL MARKET BRIEF</strong></p>
          <p>Exclusive intelligence for select {{specialty}} practitioners:</p>
          <h3>Inside Information:</h3>
          <ul>
          <li>{{major_competitor}} planning &dollar;{{investment}}M expansion in {{region}}</li>
          <li>{{insurance_company}} quietly changing {{procedure}} reimbursement rates</li>
          <li>{{regulatory_body}} considering new {{device_category}} standards</li>
          <li>Patient demand for {{treatment_type}} up {{percentage}}% (unreported)</li>
          </ul>
          <p><em>This intelligence comes from our network of {{industry_source}}. Please keep confidential.</em></p>`,
          body_text: 'Dr. {{last_name}}, Confidential market intelligence for select {{specialty}} practitioners.',
          personalization_tags: ['last_name', 'specialty', 'date', 'major_competitor', 'investment', 'region']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Intelligence Processing Time',
        delay_hours: 120
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Strategic Advisory',
        content: {
          subject: 'Strategic Advisory: How This Intel Affects {{practice_name}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Following up on our confidential brief, here's how these developments specifically impact {{practice_name}}:</p>
          <h3>Strategic Implications:</h3>
          <ul>
          <li><strong>Opportunity Window:</strong> {{timeframe}} before market becomes saturated</li>
          <li><strong>Competitive Threat:</strong> {{threat_level}} risk from new entrants</li>
          <li><strong>Revenue Impact:</strong> Potential {{revenue_change}} in {{procedure}} revenue</li>
          <li><strong>Recommended Action:</strong> {{strategic_recommendation}}</li>
          </ul>
          <p>Would you like a private consultation to discuss your strategic response?</p>`,
          body_text: 'Dr. {{last_name}}, Strategic implications of market intel for {{practice_name}}.',
          personalization_tags: ['last_name', 'practice_name', 'timeframe', 'threat_level', 'revenue_change', 'strategic_recommendation']
        }
      }
    ],
    triggers: [
      {
        type: 'market_intelligence',
        conditions: { confidence_level: '>90%', exclusivity: true },
        description: 'High-confidence exclusive market intelligence available'
      },
      {
        type: 'competitive_movement',
        conditions: { major_player_activity: true, market_impact: 'significant' },
        description: 'Major competitor making significant market moves'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'Administrator'],
    personalization_variables: ['specialty', 'practice_name', 'region', 'procedure'],
    success_metrics: ['Intelligence Brief Opens', 'Consultation Requests', 'Strategic Planning Meetings'],
    estimated_duration: '2 weeks',
    difficulty_level: 'Advanced'
  },

  {
    id: 'patient_demand_predictor',
    name: 'The Patient Demand Predictor',
    category: 'Intelligence & Prediction',
    description: 'Predict patient demand surges using social media, search trends, and demographic data',
    psychology: 'Positions rep as data-driven advisor who can predict patient behavior',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Demand Forecast Alert',
        content: {
          subject: 'Dr. {{last_name}} - Patient Demand Surge Predicted for {{procedure}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Our AI analysis predicts a significant surge in {{procedure}} demand in {{city}}:</p>
          <h3>Demand Prediction Model:</h3>
          <ul>
          <li>Google searches for "{{search_term}}" up {{percentage}}%</li>
          <li>Social media mentions increased {{social_increase}}%</li>
          <li>{{demographic}} population growth of {{population_change}}%</li>
          <li>Insurance coverage expansion effective {{date}}</li>
          </ul>
          <h3>Projected Timeline:</h3>
          <p><strong>Peak demand expected: {{peak_month}}</strong></p>
          <p>Practices that prepare now will capture 80% more patients than those who wait.</p>`,
          body_text: 'Dr. {{last_name}}, AI predicts {{percentage}}% surge in {{procedure}} demand in {{city}}.',
          personalization_tags: ['last_name', 'procedure', 'city', 'search_term', 'percentage', 'peak_month']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Planning Period',
        delay_hours: 96
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Capacity Planning Guide',
        content: {
          subject: 'Capacity Planning: Prepare {{practice_name}} for {{procedure}} Surge',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Based on our demand predictions, here's your customized capacity plan:</p>
          <h3>Recommended Preparation:</h3>
          <ul>
          <li><strong>Equipment:</strong> {{device_name}} to handle {{projected_volume}} cases/month</li>
          <li><strong>Staffing:</strong> {{staff_recommendation}} to manage increased workflow</li>
          <li><strong>Marketing:</strong> Launch campaigns {{timing}} before peak demand</li>
          <li><strong>Scheduling:</strong> Optimize appointment slots for {{patient_type}} patients</li>
          </ul>
          <p><strong>ROI Projection:</strong> &dollar;{{roi_projection}} additional revenue in first 6 months</p>`,
          body_text: 'Dr. {{last_name}}, Capacity planning guide for {{procedure}} surge at {{practice_name}}.',
          personalization_tags: ['last_name', 'practice_name', 'procedure', 'device_name', 'projected_volume', 'roi_projection']
        }
      }
    ],
    triggers: [
      {
        type: 'search_trend_spike',
        conditions: { search_volume_increase: '>30%', trend_duration: '>4 weeks' },
        description: 'Significant and sustained increase in relevant search terms'
      },
      {
        type: 'demographic_shift',
        conditions: { target_population_growth: '>10%', income_increase: '>5%' },
        description: 'Favorable demographic changes in target market'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'Administrator'],
    personalization_variables: ['procedure', 'city', 'search_term', 'peak_month', 'practice_name'],
    success_metrics: ['Demand Prediction Accuracy', 'Capacity Planning Meetings', 'Equipment Pre-Orders'],
    estimated_duration: '2-3 weeks',
    difficulty_level: 'Advanced'
  },

  {
    id: 'regulatory_radar',
    name: 'The Regulatory Radar',
    category: 'Intelligence & Prediction',
    description: 'Monitor regulatory changes and predict compliance requirements before they hit',
    psychology: 'Positions rep as regulatory expert and risk management advisor',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Regulatory Early Warning',
        content: {
          subject: 'REGULATORY ALERT: {{compliance_area}} Changes Affecting {{specialty}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p><strong>REGULATORY EARLY WARNING SYSTEM</strong></p>
          <p>Our compliance monitoring has detected incoming changes:</p>
          <h3>Regulatory Intelligence:</h3>
          <ul>
          <li>{{regulatory_body}} drafting new {{device_category}} standards</li>
          <li>Expected publication: {{publication_date}}</li>
          <li>Implementation deadline: {{compliance_deadline}}</li>
          <li>Estimated compliance cost: &dollar;{{compliance_cost}} per practice</li>
          </ul>
          <h3>Impact Assessment:</h3>
          <p>Practices using {{current_technology}} will need to upgrade or face {{consequences}}.</p>`,
          body_text: 'Dr. {{last_name}}, Regulatory changes coming to {{specialty}}. Early warning alert.',
          personalization_tags: ['last_name', 'compliance_area', 'specialty', 'regulatory_body', 'device_category', 'compliance_deadline']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Compliance Assessment Period',
        delay_hours: 120
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Compliance Strategy',
        content: {
          subject: 'Compliance Strategy: {{practice_name}} Regulatory Readiness Plan',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>I've prepared a compliance readiness plan for {{practice_name}}:</p>
          <h3>Regulatory Compliance Strategy:</h3>
          <ul>
          <li><strong>Current Status:</strong> {{current_compliance_level}}</li>
          <li><strong>Gap Analysis:</strong> {{compliance_gaps}}</li>
          <li><strong>Recommended Solution:</strong> {{device_name}} meets all new requirements</li>
          <li><strong>Implementation Timeline:</strong> {{implementation_plan}}</li>
          </ul>
          <p><strong>Early Adopter Benefits:</strong></p>
          <ul>
          <li>Avoid last-minute rush pricing</li>
          <li>Gain competitive advantage</li>
          <li>Reduce compliance risk</li>
          </ul>`,
          body_text: 'Dr. {{last_name}}, Compliance strategy for {{practice_name}} regulatory readiness.',
          personalization_tags: ['last_name', 'practice_name', 'current_compliance_level', 'compliance_gaps', 'device_name']
        }
      }
    ],
    triggers: [
      {
        type: 'regulatory_filing',
        conditions: { new_regulation: 'draft', impact_level: 'high' },
        description: 'New regulation in draft stage with high practice impact'
      },
      {
        type: 'compliance_deadline',
        conditions: { deadline_approaching: '<18 months', preparation_required: true },
        description: 'Compliance deadline approaching requiring preparation'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'Compliance Officer', 'Administrator'],
    personalization_variables: ['specialty', 'compliance_area', 'regulatory_body', 'practice_name'],
    success_metrics: ['Regulatory Alert Opens', 'Compliance Consultations', 'Early Compliance Adoptions'],
    estimated_duration: '2 weeks',
    difficulty_level: 'Advanced'
  },

  // Influence & Network Templates (4 templates)
  {
    id: 'thought_leader_maker',
    name: 'The Thought Leader Maker',
    category: 'Influence & Network',
    description: 'Transform doctors into industry thought leaders through strategic content and speaking opportunities',
    psychology: 'Appeals to desire for professional recognition and industry influence',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Thought Leadership Opportunity',
        content: {
          subject: 'Dr. {{last_name}} - Establish Your Voice in {{specialty}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your insights on {{clinical_area}} deserve a broader audience. I'd like to help you establish thought leadership in {{specialty}}.</p>
          <h3>Thought Leadership Opportunities:</h3>
          <ul>
          <li>Keynote at {{upcoming_conference}} ({{date}})</li>
          <li>{{specialty_journal}} guest editorial</li>
          <li>Webinar series: "{{topic}}" ({{audience_size}}+ attendees)</li>
          <li>Industry podcast interviews</li>
          </ul>
          <p>Your perspective on {{current_challenge}} could shape industry dialogue.</p>`,
          body_text: 'Dr. {{last_name}}, Establish your thought leadership voice in {{specialty}}.',
          personalization_tags: ['last_name', 'specialty', 'clinical_area', 'upcoming_conference', 'date', 'topic']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Interest Assessment',
        delay_hours: 96
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Content Development Plan',
        content: {
          subject: 'Your {{specialty}} Thought Leadership Content Strategy',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>I've outlined a comprehensive content strategy to establish your thought leadership:</p>
          <h3>Content Development Plan:</h3>
          <ul>
          <li><strong>Phase 1:</strong> Case study series featuring your {{device_name}} outcomes</li>
          <li><strong>Phase 2:</strong> Industry whitepaper on {{emerging_topic}}</li>
          <li><strong>Phase 3:</strong> Speaking circuit appearances</li>
          <li><strong>Phase 4:</strong> Industry advisory board positions</li>
          </ul>
          <p>We'll handle content creation, distribution, and promotion. You focus on clinical excellence.</p>`,
          body_text: 'Dr. {{last_name}}, Complete thought leadership strategy for {{specialty}}.',
          personalization_tags: ['last_name', 'specialty', 'device_name', 'emerging_topic']
        }
      }
    ],
    triggers: [
      {
        type: 'clinical_excellence',
        conditions: { outcomes_top_percentile: true, case_complexity: 'high' },
        description: 'Doctor with exceptional clinical outcomes and complex cases'
      },
      {
        type: 'speaking_interest',
        conditions: { conference_participation: '>3', teaching_role: true },
        description: 'Doctor with speaking experience and teaching interests'
      }
    ],
    target_stakeholders: ['Doctor', 'Department Head'],
    personalization_variables: ['specialty', 'clinical_area', 'upcoming_conference', 'topic', 'device_name'],
    success_metrics: ['Speaking Engagements', 'Published Content', 'Industry Recognition'],
    estimated_duration: '3-6 months',
    difficulty_level: 'Medium'
  },

  {
    id: 'network_amplifier',
    name: 'The Network Amplifier',
    category: 'Influence & Network',
    description: 'Leverage doctor networks to create referral chains and peer influence cascades',
    psychology: 'Taps into social proof and peer validation within professional networks',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Network Mapping',
        content: {
          subject: 'Dr. {{last_name}} - Your Professional Network Analysis',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>I've analyzed your professional network and identified strategic influence opportunities:</p>
          <h3>Network Influence Map:</h3>
          <ul>
          <li><strong>Direct Connections:</strong> {{direct_connections}} {{specialty}} colleagues</li>
          <li><strong>Key Influencers:</strong> {{key_influencer_1}}, {{key_influencer_2}}, {{key_influencer_3}}</li>
          <li><strong>Network Reach:</strong> {{extended_reach}} professionals in your extended network</li>
          <li><strong>Influence Score:</strong> {{influence_score}}/100</li>
          </ul>
          <p>Your network is ideally positioned for {{strategic_opportunity}}.</p>`,
          body_text: 'Dr. {{last_name}}, Professional network analysis reveals strategic opportunities.',
          personalization_tags: ['last_name', 'direct_connections', 'specialty', 'key_influencer_1', 'influence_score']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Network Strategy Development',
        delay_hours: 72
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Network Activation Strategy',
        content: {
          subject: 'Network Activation: Amplify Your {{specialty}} Influence',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Here's how to strategically activate your professional network:</p>
          <h3>Network Amplification Strategy:</h3>
          <ul>
          <li><strong>Peer Champions:</strong> {{champion_1}} and {{champion_2}} as early adopters</li>
          <li><strong>Referral Network:</strong> Share {{device_name}} outcomes with referring physicians</li>
          <li><strong>Study Groups:</strong> Present findings at {{specialty}} society meetings</li>
          <li><strong>Mentorship:</strong> Influence residents and fellows through your program</li>
          </ul>
          <p>Network effect could drive {{projected_referrals}} additional referrals annually.</p>`,
          body_text: 'Dr. {{last_name}}, Network activation strategy for {{specialty}} influence amplification.',
          personalization_tags: ['last_name', 'specialty', 'champion_1', 'champion_2', 'device_name', 'projected_referrals']
        }
      }
    ],
    triggers: [
      {
        type: 'network_density',
        conditions: { connections_count: '>50', influence_score: '>70' },
        description: 'Doctor with large, influential professional network'
      },
      {
        type: 'referral_patterns',
        conditions: { receives_referrals: '>20/month', sends_referrals: '>10/month' },
        description: 'Doctor with active referral relationships'
      }
    ],
    target_stakeholders: ['Doctor', 'Department Head', 'Practice Owner'],
    personalization_variables: ['specialty', 'key_influencer_1', 'influence_score', 'device_name'],
    success_metrics: ['Network Activation Rate', 'Referral Pattern Changes', 'Peer Adoption'],
    estimated_duration: '4-6 weeks',
    difficulty_level: 'Advanced'
  },

  {
    id: 'kol_catalyst',
    name: 'The KOL Catalyst',
    category: 'Influence & Network',
    description: 'Identify and cultivate Key Opinion Leaders to drive market adoption',
    psychology: 'Leverages authority bias and expert endorsement psychology',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'KOL Identification',
        content: {
          subject: 'Dr. {{last_name}} - KOL Opportunity in {{specialty}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your reputation and influence in {{specialty}} make you an ideal Key Opinion Leader candidate.</p>
          <h3>KOL Profile Assessment:</h3>
          <ul>
          <li><strong>Publications:</strong> {{publication_count}} peer-reviewed articles</li>
          <li><strong>Citations:</strong> {{citation_count}} citations (H-index: {{h_index}})</li>
          <li><strong>Speaking:</strong> {{speaking_engagements}} conference presentations</li>
          <li><strong>Network:</strong> {{network_size}} professional connections</li>
          </ul>
          <p>KOL status could position you as the definitive voice on {{emerging_technology}}.</p>`,
          body_text: 'Dr. {{last_name}}, KOL opportunity assessment for {{specialty}} leadership.',
          personalization_tags: ['last_name', 'specialty', 'publication_count', 'citation_count', 'h_index', 'emerging_technology']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'KOL Interest Evaluation',
        delay_hours: 120
      },
      {
        id: 'step3',
        type: 'email',
        name: 'KOL Development Program',
        content: {
          subject: 'Your {{specialty}} KOL Development Program',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>I've designed a comprehensive KOL development program tailored to your expertise:</p>
          <h3>KOL Development Track:</h3>
          <ul>
          <li><strong>Research Collaboration:</strong> Multi-center study on {{research_topic}}</li>
          <li><strong>Advisory Board:</strong> {{company_name}} Scientific Advisory position</li>
          <li><strong>Speaker Bureau:</strong> International conference circuit</li>
          <li><strong>Publication Support:</strong> Editorial assistance and co-authorship opportunities</li>
          </ul>
          <p><strong>Benefits:</strong> &dollar;{{annual_compensation}} annual compensation plus research funding.</p>`,
          body_text: 'Dr. {{last_name}}, Comprehensive KOL development program for {{specialty}}.',
          personalization_tags: ['last_name', 'specialty', 'research_topic', 'company_name', 'annual_compensation']
        }
      }
    ],
    triggers: [
      {
        type: 'academic_credentials',
        conditions: { publications: '>10', h_index: '>15', university_affiliation: true },
        description: 'Doctor with strong academic credentials and research background'
      },
      {
        type: 'influence_metrics',
        conditions: { speaking_engagements: '>5', social_media_following: '>1000' },
        description: 'Doctor with demonstrated influence and thought leadership'
      }
    ],
    target_stakeholders: ['Doctor', 'Research Director', 'Department Head'],
    personalization_variables: ['specialty', 'publication_count', 'emerging_technology', 'research_topic'],
    success_metrics: ['KOL Program Participation', 'Publication Collaborations', 'Speaking Engagements'],
    estimated_duration: '6-12 months',
    difficulty_level: 'Advanced'
  },

  {
    id: 'social_proof_engine',
    name: 'The Social Proof Engine',
    category: 'Influence & Network',
    description: 'Create cascading social proof through strategic peer testimonials and endorsements',
    psychology: 'Leverages social proof and bandwagon effect psychology',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Peer Success Showcase',
        content: {
          subject: 'Dr. {{last_name}} - What Your Peers Are Saying About {{device_name}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your colleagues in {{city}} are sharing remarkable results with {{device_name}}:</p>
          <h3>Peer Testimonials:</h3>
          <blockquote>
          <p><em>"{{testimonial_1}}"</em></p>
          <p><strong>- Dr. {{peer_1}}, {{peer_1_institution}}</strong></p>
          </blockquote>
          <blockquote>
          <p><em>"{{testimonial_2}}"</em></p>
          <p><strong>- Dr. {{peer_2}}, {{peer_2_institution}}</strong></p>
          </blockquote>
          <p>Would you like to see the case studies they're referencing?</p>`,
          body_text: 'Dr. {{last_name}}, Your {{city}} peers are sharing remarkable {{device_name}} results.',
          personalization_tags: ['last_name', 'city', 'device_name', 'testimonial_1', 'peer_1', 'peer_1_institution']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Social Proof Processing',
        delay_hours: 72
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Peer Adoption Stats',
        content: {
          subject: '{{percentage}}% of {{specialty}} Doctors in {{city}} Now Using {{device_name}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>The adoption rate among your peers is accelerating:</p>
          <h3>Local Adoption Statistics:</h3>
          <ul>
          <li><strong>{{city}} {{specialty}} practices:</strong> {{percentage}}% adoption rate</li>
          <li><strong>Top hospitals:</strong> {{hospital_1}}, {{hospital_2}}, {{hospital_3}}</li>
          <li><strong>Average outcome improvement:</strong> {{improvement_metric}}</li>
          <li><strong>Patient satisfaction increase:</strong> {{satisfaction_increase}}%</li>
          </ul>
          <p>Don't let your practice fall behind the curve. Your patients are starting to ask questions.</p>`,
          body_text: 'Dr. {{last_name}}, {{percentage}}% of {{city}} {{specialty}} doctors now use {{device_name}}.',
          personalization_tags: ['last_name', 'percentage', 'specialty', 'city', 'device_name', 'improvement_metric']
        }
      }
    ],
    triggers: [
      {
        type: 'peer_adoption',
        conditions: { local_adoption_rate: '>30%', positive_outcomes: '>90%' },
        description: 'Significant peer adoption with positive outcomes in local market'
      },
      {
        type: 'testimonial_availability',
        conditions: { peer_testimonials: '>5', video_testimonials: '>2' },
        description: 'Multiple peer testimonials and success stories available'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner'],
    personalization_variables: ['city', 'device_name', 'peer_1', 'percentage', 'specialty'],
    success_metrics: ['Social Proof Engagement', 'Peer Comparison Requests', 'FOMO Responses'],
    estimated_duration: '2-3 weeks',
    difficulty_level: 'Medium'
  },

  // Competitive & Market Templates (4 templates)
  {
    id: 'competitor_weakness_exploiter',
    name: 'The Competitor Weakness Exploiter',
    category: 'Competitive & Market',
    description: 'Identify and strategically exploit competitor weaknesses and vulnerabilities',
    psychology: 'Leverages competitive psychology and fear of falling behind',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Competitive Intelligence Brief',
        content: {
          subject: 'Dr. {{last_name}} - Critical Analysis: {{competitor_device}} vs {{our_device}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>I've completed a comprehensive analysis of {{competitor_device}} limitations affecting {{city}} practices:</p>
          <h3>Competitive Intelligence Report:</h3>
          <ul>
          <li><strong>Technical Limitations:</strong> {{technical_weakness}}</li>
          <li><strong>Clinical Concerns:</strong> {{clinical_limitation}}</li>
          <li><strong>Cost Issues:</strong> {{cost_concern}}</li>
          <li><strong>Support Problems:</strong> {{support_issue}}</li>
          </ul>
          <p><em>This information is confidential and for your strategic planning only.</em></p>`,
          body_text: 'Dr. {{last_name}}, Critical analysis of {{competitor_device}} limitations.',
          personalization_tags: ['last_name', 'competitor_device', 'our_device', 'city', 'technical_weakness', 'clinical_limitation']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Competitive Assessment Period',
        delay_hours: 96
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Competitive Advantage Positioning',
        content: {
          subject: 'Why {{our_device}} Solves Every {{competitor_device}} Problem',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>While {{competitor_device}} has limitations, {{our_device}} addresses every concern:</p>
          <h3>Competitive Advantages:</h3>
          <ul>
          <li><strong>Technical Superiority:</strong> {{our_advantage_1}}</li>
          <li><strong>Clinical Benefits:</strong> {{our_advantage_2}}</li>
          <li><strong>Economic Value:</strong> {{cost_advantage}}</li>
          <li><strong>Support Excellence:</strong> {{support_advantage}}</li>
          </ul>
          <p>Practices switching from {{competitor_device}} report {{improvement_metric}} improvement.</p>`,
          body_text: 'Dr. {{last_name}}, {{our_device}} solves every {{competitor_device}} limitation.',
          personalization_tags: ['last_name', 'our_device', 'competitor_device', 'our_advantage_1', 'improvement_metric']
        }
      }
    ],
    triggers: [
      {
        type: 'competitor_weakness',
        conditions: { weakness_identified: true, market_impact: 'significant' },
        description: 'Significant competitor weakness or vulnerability identified'
      },
      {
        type: 'customer_dissatisfaction',
        conditions: { competitor_complaints: '>threshold', support_issues: 'increasing' },
        description: 'Customer dissatisfaction with competitor solutions'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'Administrator'],
    personalization_variables: ['competitor_device', 'our_device', 'technical_weakness', 'clinical_limitation'],
    success_metrics: ['Competitive Comparison Requests', 'Switch Consideration', 'Weakness Validation'],
    estimated_duration: '2-3 weeks',
    difficulty_level: 'Advanced'
  },

  {
    id: 'market_domination_strategy',
    name: 'The Market Domination Strategy',
    category: 'Competitive & Market',
    description: 'Help practices achieve market dominance through strategic positioning and competitive tactics',
    psychology: 'Appeals to ambition and desire for market leadership',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Market Position Analysis',
        content: {
          subject: 'Dr. {{last_name}} - {{practice_name}} Market Dominance Assessment',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>I've analyzed {{practice_name}}'s position in the {{city}} {{specialty}} market:</p>
          <h3>Market Position Analysis:</h3>
          <ul>
          <li><strong>Current Market Share:</strong> {{current_share}}%</li>
          <li><strong>Market Leader:</strong> {{market_leader}} ({{leader_share}}%)</li>
          <li><strong>Growth Opportunity:</strong> {{opportunity_size}} untapped market</li>
          <li><strong>Key Differentiator:</strong> {{differentiation_factor}}</li>
          </ul>
          <p>You're positioned to become the dominant {{specialty}} practice in {{city}}.</p>`,
          body_text: 'Dr. {{last_name}}, Market dominance assessment for {{practice_name}}.',
          personalization_tags: ['last_name', 'practice_name', 'city', 'specialty', 'current_share', 'market_leader']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Strategy Development Period',
        delay_hours: 120
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Domination Strategy Blueprint',
        content: {
          subject: 'Market Domination Blueprint for {{practice_name}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Here's your comprehensive market domination strategy:</p>
          <h3>Domination Strategy:</h3>
          <ul>
          <li><strong>Phase 1:</strong> Technology advantage with {{device_name}}</li>
          <li><strong>Phase 2:</strong> Aggressive marketing campaign</li>
          <li><strong>Phase 3:</strong> Strategic partnerships with {{partner_type}}</li>
          <li><strong>Phase 4:</strong> Geographic expansion to {{expansion_area}}</li>
          </ul>
          <p><strong>Projected Outcome:</strong> {{target_share}}% market share within {{timeline}}.</p>`,
          body_text: 'Dr. {{last_name}}, Market domination blueprint for {{practice_name}}.',
          personalization_tags: ['last_name', 'practice_name', 'device_name', 'partner_type', 'target_share', 'timeline']
        }
      }
    ],
    triggers: [
      {
        type: 'market_opportunity',
        conditions: { market_fragmentation: 'high', growth_potential: '>20%' },
        description: 'Fragmented market with high growth potential'
      },
      {
        type: 'practice_ambition',
        conditions: { growth_goals: 'aggressive', investment_capacity: 'high' },
        description: 'Practice with aggressive growth goals and investment capacity'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'Administrator'],
    personalization_variables: ['practice_name', 'city', 'specialty', 'current_share', 'device_name'],
    success_metrics: ['Market Share Growth', 'Strategic Planning Engagement', 'Investment Decisions'],
    estimated_duration: '4-6 weeks',
    difficulty_level: 'Advanced'
  },

  {
    id: 'competitive_intelligence_network',
    name: 'The Competitive Intelligence Network',
    category: 'Competitive & Market',
    description: 'Build network of intelligence sources to monitor competitor movements and market changes',
    psychology: 'Creates sense of insider advantage and strategic superiority',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Intelligence Network Invitation',
        content: {
          subject: 'Dr. {{last_name}} - Exclusive: {{city}} {{specialty}} Intelligence Network',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>I'm establishing an exclusive intelligence network for select {{specialty}} leaders in {{city}}.</p>
          <h3>Intelligence Network Benefits:</h3>
          <ul>
          <li><strong>Market Intelligence:</strong> Early warning on competitor moves</li>
          <li><strong>Pricing Intelligence:</strong> Real-time pricing and contract data</li>
          <li><strong>Technology Intelligence:</strong> New product launches and updates</li>
          <li><strong>Regulatory Intelligence:</strong> Policy changes and compliance updates</li>
          </ul>
          <p><em>Membership is by invitation only. Strict confidentiality maintained.</em></p>`,
          body_text: 'Dr. {{last_name}}, Exclusive {{specialty}} intelligence network invitation.',
          personalization_tags: ['last_name', 'city', 'specialty']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Network Commitment Assessment',
        delay_hours: 72
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Intelligence Brief Sample',
        content: {
          subject: 'CONFIDENTIAL: {{city}} {{specialty}} Market Intelligence Brief #{{brief_number}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p><strong>CONFIDENTIAL INTELLIGENCE BRIEF</strong></p>
          <h3>Market Intelligence Update:</h3>
          <ul>
          <li><strong>Competitor Movement:</strong> {{competitor_1}} expanding to {{new_location}}</li>
          <li><strong>Pricing Intelligence:</strong> {{device_category}} prices down {{percentage}}%</li>
          <li><strong>Regulatory Update:</strong> {{regulation_change}} effective {{date}}</li>
          <li><strong>Market Opportunity:</strong> {{opportunity_description}}</li>
          </ul>
          <p><em>Next brief in 2 weeks. Reply with any intelligence requests.</em></p>`,
          body_text: 'Dr. {{last_name}}, Confidential market intelligence brief for {{city}}.',
          personalization_tags: ['last_name', 'city', 'specialty', 'brief_number', 'competitor_1', 'percentage']
        }
      }
    ],
    triggers: [
      {
        type: 'market_volatility',
        conditions: { competitor_activity: 'high', price_fluctuation: '>10%' },
        description: 'High market volatility with significant competitor activity'
      },
      {
        type: 'information_seeking',
        conditions: { market_research_requests: '>3', competitor_inquiries: '>5' },
        description: 'Practice showing high interest in market and competitor information'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'Administrator'],
    personalization_variables: ['city', 'specialty', 'competitor_1', 'percentage'],
    success_metrics: ['Network Participation', 'Intelligence Sharing', 'Strategic Actions Taken'],
    estimated_duration: '3-4 weeks',
    difficulty_level: 'Advanced'
  },

  {
    id: 'disruptor_positioning',
    name: 'The Disruptor Positioning',
    category: 'Competitive & Market',
    description: 'Position practice as market disruptor challenging established norms and practices',
    psychology: 'Appeals to desire to be innovative leader and challenge status quo',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Disruptor Opportunity Assessment',
        content: {
          subject: 'Dr. {{last_name}} - Disrupt the {{city}} {{specialty}} Market',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>The {{city}} {{specialty}} market is ripe for disruption. Here's why:</p>
          <h3>Disruption Opportunity:</h3>
          <ul>
          <li><strong>Outdated Practices:</strong> {{outdated_method}} still dominant</li>
          <li><strong>Patient Frustration:</strong> {{patient_pain_point}} unaddressed</li>
          <li><strong>Technology Gap:</strong> Most practices 5+ years behind</li>
          <li><strong>Service Gaps:</strong> {{service_gap}} creating opportunity</li>
          </ul>
          <p>{{practice_name}} could be the practice that changes everything.</p>`,
          body_text: 'Dr. {{last_name}}, Disrupt the {{city}} {{specialty}} market opportunity.',
          personalization_tags: ['last_name', 'city', 'specialty', 'outdated_method', 'patient_pain_point', 'practice_name']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Disruption Strategy Development',
        delay_hours: 96
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Disruptor Strategy Blueprint',
        content: {
          subject: 'Become The {{specialty}} Disruptor in {{city}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your disruptor strategy to transform {{city}} {{specialty}} care:</p>
          <h3>Disruption Strategy:</h3>
          <ul>
          <li><strong>Technology Disruption:</strong> {{device_name}} as differentiator</li>
          <li><strong>Service Model Disruption:</strong> {{new_service_model}}</li>
          <li><strong>Patient Experience Disruption:</strong> {{experience_innovation}}</li>
          <li><strong>Marketing Disruption:</strong> {{marketing_approach}}</li>
          </ul>
          <p><strong>Result:</strong> Become the practice others copy, not compete against.</p>`,
          body_text: 'Dr. {{last_name}}, Become the {{specialty}} disruptor in {{city}}.',
          personalization_tags: ['last_name', 'specialty', 'city', 'device_name', 'new_service_model', 'experience_innovation']
        }
      }
    ],
    triggers: [
      {
        type: 'market_stagnation',
        conditions: { innovation_rate: 'low', customer_satisfaction: '<average' },
        description: 'Stagnant market with low innovation and customer satisfaction'
      },
      {
        type: 'practice_innovation',
        conditions: { early_adopter: true, technology_investment: 'high' },
        description: 'Practice with history of early adoption and innovation'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner'],
    personalization_variables: ['city', 'specialty', 'practice_name', 'device_name', 'new_service_model'],
    success_metrics: ['Disruptor Brand Recognition', 'Market Differentiation', 'Innovation Leadership'],
    estimated_duration: '4-8 weeks',
    difficulty_level: 'Advanced'
  },

  // Status & Legacy Templates (4 templates)
  {
    id: 'legacy_builder',
    name: 'The Legacy Builder',
    category: 'Status & Legacy',
    description: 'Appeal to doctors\' desire to build lasting professional legacy through innovation adoption',
    psychology: 'Taps into desires for professional legacy and being remembered for innovation',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Legacy Vision',
        content: {
          subject: 'Dr. {{last_name}} - Your Professional Legacy in {{specialty}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>In 20 years, when young {{specialty}} residents study the evolution of {{clinical_area}}, what will they say about Dr. {{last_name}}?</p>
          <h3>Legacy Builders in Medicine:</h3>
          <ul>
          <li><strong>Dr. {{historical_figure_1}}:</strong> Pioneered {{innovation_1}} (1960s)</li>
          <li><strong>Dr. {{historical_figure_2}}:</strong> Advanced {{innovation_2}} (1980s)</li>
          <li><strong>Dr. {{historical_figure_3}}:</strong> Revolutionized {{innovation_3}} (2000s)</li>
          <li><strong>Dr. {{last_name}}:</strong> ? (2024)</li>
          </ul>
          <p>{{device_name}} represents your opportunity to join the ranks of visionary practitioners.</p>`,
          body_text: 'Dr. {{last_name}}, What will your professional legacy be in {{specialty}}?',
          personalization_tags: ['last_name', 'specialty', 'clinical_area', 'device_name', 'historical_figure_1', 'innovation_1']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Legacy Contemplation Period',
        delay_hours: 120
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Legacy Action Plan',
        content: {
          subject: 'Building Dr. {{last_name}}\'s {{specialty}} Legacy',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your legacy-building opportunity with {{device_name}}:</p>
          <h3>Legacy Building Strategy:</h3>
          <ul>
          <li><strong>Innovation Leadership:</strong> First in {{city}} to adopt {{technology}}</li>
          <li><strong>Outcome Documentation:</strong> Publish case series and outcomes data</li>
          <li><strong>Knowledge Transfer:</strong> Train next generation of {{specialty}} practitioners</li>
          <li><strong>Thought Leadership:</strong> Present findings at major conferences</li>
          </ul>
          <p><strong>Legacy Impact:</strong> Be remembered as the doctor who brought {{advancement}} to {{city}}.</p>`,
          body_text: 'Dr. {{last_name}}, Build your {{specialty}} legacy with {{device_name}}.',
          personalization_tags: ['last_name', 'specialty', 'device_name', 'city', 'technology', 'advancement']
        }
      }
    ],
    triggers: [
      {
        type: 'career_maturity',
        conditions: { years_practice: '>15', leadership_role: true },
        description: 'Experienced doctor in leadership position thinking about legacy'
      },
      {
        type: 'innovation_interest',
        conditions: { early_adopter_history: true, teaching_involvement: true },
        description: 'Doctor with history of innovation and teaching involvement'
      }
    ],
    target_stakeholders: ['Doctor', 'Department Head', 'Practice Owner'],
    personalization_variables: ['specialty', 'clinical_area', 'device_name', 'city', 'technology'],
    success_metrics: ['Legacy Vision Engagement', 'Innovation Adoption', 'Thought Leadership Activities'],
    estimated_duration: '4-6 weeks',
    difficulty_level: 'Advanced'
  },

  {
    id: 'pioneer_status',
    name: 'The Pioneer Status',
    category: 'Status & Legacy',
    description: 'Position doctor as pioneering innovator who leads rather than follows',
    psychology: 'Appeals to desire for recognition as industry pioneer and early adopter',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Pioneer Recognition',
        content: {
          subject: 'Dr. {{last_name}} - Join the {{specialty}} Pioneer Program',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>We're selecting {{number}} pioneering {{specialty}} practitioners for our exclusive Pioneer Program.</p>
          <h3>Pioneer Benefits:</h3>
          <ul>
          <li><strong>First Access:</strong> {{device_name}} before general release</li>
          <li><strong>Pioneer Recognition:</strong> "Pioneer Physician" designation</li>
          <li><strong>Research Collaboration:</strong> Co-development opportunities</li>
          <li><strong>Speaking Platform:</strong> Present at {{conference_name}}</li>
          </ul>
          <p>Your track record of innovation makes you an ideal Pioneer candidate.</p>`,
          body_text: 'Dr. {{last_name}}, Join the exclusive {{specialty}} Pioneer Program.',
          personalization_tags: ['last_name', 'specialty', 'number', 'device_name', 'conference_name']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Pioneer Application Period',
        delay_hours: 96
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Pioneer Program Details',
        content: {
          subject: 'Your {{specialty}} Pioneer Program Application - Next Steps',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Welcome to the Pioneer Program! Here's your exclusive opportunity:</p>
          <h3>Pioneer Program Details:</h3>
          <ul>
          <li><strong>Training:</strong> Exclusive {{training_program}} certification</li>
          <li><strong>Research:</strong> Contribute to {{clinical_study}} multi-center trial</li>
          <li><strong>Marketing:</strong> "Pioneer Physician" branding rights</li>
          <li><strong>Network:</strong> Access to Pioneer physician network</li>
          </ul>
          <p>As a Pioneer, you'll shape the future of {{specialty}} care.</p>`,
          body_text: 'Dr. {{last_name}}, Welcome to the {{specialty}} Pioneer Program.',
          personalization_tags: ['last_name', 'specialty', 'training_program', 'clinical_study']
        }
      }
    ],
    triggers: [
      {
        type: 'innovation_history',
        conditions: { early_adoptions: '>3', technology_presentations: '>1' },
        description: 'Doctor with history of early technology adoption'
      },
      {
        type: 'status_seeking',
        conditions: { awards_received: '>0', peer_recognition: 'high' },
        description: 'Doctor who values professional recognition and status'
      }
    ],
    target_stakeholders: ['Doctor', 'Department Head'],
    personalization_variables: ['specialty', 'device_name', 'conference_name', 'training_program'],
    success_metrics: ['Pioneer Program Enrollment', 'Innovation Adoption Speed', 'Peer Influence'],
    estimated_duration: '3-4 weeks',
    difficulty_level: 'Medium'
  },

  {
    id: 'excellence_club',
    name: 'The Excellence Club',
    category: 'Status & Legacy',
    description: 'Create exclusive club for high-performing doctors using advanced technology',
    psychology: 'Appeals to desire for exclusivity and elite professional status',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Excellence Club Invitation',
        content: {
          subject: 'Dr. {{last_name}} - Invitation to {{specialty}} Excellence Club',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Based on your exceptional {{outcome_metric}} outcomes, you're invited to join our exclusive Excellence Club.</p>
          <h3>Excellence Club Membership:</h3>
          <ul>
          <li><strong>Elite Recognition:</strong> Top {{percentage}}% of {{specialty}} practitioners</li>
          <li><strong>Advanced Technology:</strong> {{device_name}} with premium features</li>
          <li><strong>Peer Network:</strong> Connect with other excellence-driven physicians</li>
          <li><strong>Research Opportunities:</strong> Contribute to outcome studies</li>
          </ul>
          <p><em>Membership by invitation only. Limited to {{limit}} practitioners annually.</em></p>`,
          body_text: 'Dr. {{last_name}}, Exclusive invitation to {{specialty}} Excellence Club.',
          personalization_tags: ['last_name', 'specialty', 'outcome_metric', 'percentage', 'device_name', 'limit']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Exclusivity Consideration',
        delay_hours: 72
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Membership Benefits',
        content: {
          subject: 'Excellence Club Membership Benefits for Dr. {{last_name}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your Excellence Club membership includes:</p>
          <h3>Exclusive Benefits:</h3>
          <ul>
          <li><strong>Technology:</strong> {{device_name}} with advanced analytics suite</li>
          <li><strong>Support:</strong> Dedicated clinical support team</li>
          <li><strong>Marketing:</strong> "Excellence Club Member" designation</li>
          <li><strong>Events:</strong> Invitation-only annual summit</li>
          <li><strong>Research:</strong> Priority access to new innovations</li>
          </ul>
          <p><strong>Annual Investment:</strong> &dollar;{{membership_cost}} (exclusive to Excellence Club)</p>`,
          body_text: 'Dr. {{last_name}}, Excellence Club membership benefits overview.',
          personalization_tags: ['last_name', 'device_name', 'membership_cost']
        }
      }
    ],
    triggers: [
      {
        type: 'performance_excellence',
        conditions: { outcomes_top_percentile: true, volume_high: true },
        description: 'Doctor with exceptional performance metrics'
      },
      {
        type: 'status_orientation',
        conditions: { prestige_seeking: true, peer_comparison_interest: 'high' },
        description: 'Doctor interested in elite status and peer recognition'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner'],
    personalization_variables: ['specialty', 'outcome_metric', 'percentage', 'device_name', 'limit'],
    success_metrics: ['Membership Applications', 'Elite Program Participation', 'Premium Service Adoption'],
    estimated_duration: '2-3 weeks',
    difficulty_level: 'Medium'
  },

  {
    id: 'reputation_guardian',
    name: 'The Reputation Guardian',
    category: 'Status & Legacy',
    description: 'Protect and enhance professional reputation through technology adoption',
    psychology: 'Appeals to concerns about professional reputation and competitive positioning',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Reputation Analysis',
        content: {
          subject: 'Dr. {{last_name}} - Professional Reputation Analysis Report',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>I've completed a comprehensive analysis of your professional reputation in {{city}}:</p>
          <h3>Reputation Analysis:</h3>
          <ul>
          <li><strong>Online Presence:</strong> {{rating}} average rating ({{review_count}} reviews)</li>
          <li><strong>Peer Perception:</strong> {{peer_rating}}/10 among colleagues</li>
          <li><strong>Innovation Score:</strong> {{innovation_score}}% ({{specialty}} average: {{avg_score}}%)</li>
          <li><strong>Risk Factor:</strong> {{competitor_practice}} gaining reputation momentum</li>
          </ul>
          <p>Your reputation is strong, but proactive steps can ensure it stays that way.</p>`,
          body_text: 'Dr. {{last_name}}, Professional reputation analysis for {{practice_name}}.',
          personalization_tags: ['last_name', 'city', 'rating', 'review_count', 'peer_rating', 'innovation_score']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Reputation Concern Processing',
        delay_hours: 96
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Reputation Protection Strategy',
        content: {
          subject: 'Protecting Dr. {{last_name}}\'s {{specialty}} Reputation',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Here's your comprehensive reputation protection and enhancement strategy:</p>
          <h3>Reputation Guardian Plan:</h3>
          <ul>
          <li><strong>Technology Leadership:</strong> {{device_name}} positions you as innovator</li>
          <li><strong>Outcome Improvement:</strong> Better results = stronger reputation</li>
          <li><strong>Patient Satisfaction:</strong> Advanced care increases positive reviews</li>
          <li><strong>Peer Recognition:</strong> Stay ahead of competitive threats</li>
          </ul>
          <p><strong>Reputation ROI:</strong> Investment in reputation pays dividends for decades.</p>`,
          body_text: 'Dr. {{last_name}}, Reputation protection strategy with {{device_name}}.',
          personalization_tags: ['last_name', 'specialty', 'device_name']
        }
      }
    ],
    triggers: [
      {
        type: 'reputation_concern',
        conditions: { negative_reviews_recent: true, competitor_growth: '>20%' },
        description: 'Recent reputation concerns or competitive threats'
      },
      {
        type: 'reputation_maintenance',
        conditions: { high_reputation: true, reputation_monitoring: 'active' },
        description: 'Doctor actively managing strong reputation'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'Administrator'],
    personalization_variables: ['city', 'rating', 'peer_rating', 'innovation_score', 'device_name'],
    success_metrics: ['Reputation Monitoring Engagement', 'Technology Adoption for Reputation', 'Competitive Positioning'],
    estimated_duration: '3-4 weeks',
    difficulty_level: 'Medium'
  },

  // Financial & ROI Templates (3 more)
  {
    id: 'cash_flow_optimizer',
    name: 'The Cash Flow Optimizer',
    category: 'Financial & ROI',
    description: 'Optimize practice cash flow through equipment leasing and revenue optimization',
    psychology: 'Addresses cash flow concerns and financial optimization desires',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Cash Flow Analysis',
        content: {
          subject: 'Dr. {{last_name}} - {{practice_name}} Cash Flow Optimization Analysis',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>I've analyzed {{practice_name}}'s potential for cash flow optimization:</p>
          <h3>Cash Flow Analysis:</h3>
          <ul>
          <li><strong>Current Monthly Revenue:</strong> &dollar;{{current_revenue}}</li>
          <li><strong>Revenue Optimization Potential:</strong> +&dollar;{{optimization_potential}}/month</li>
          <li><strong>Equipment Investment:</strong> &dollar;{{equipment_cost}} ({{device_name}})</li>
          <li><strong>Financing Options:</strong> &dollar;{{monthly_payment}}/month</li>
          </ul>
          <p><strong>Net Cash Flow Impact:</strong> +&dollar;{{net_positive_flow}}/month after financing</p>`,
          body_text: 'Dr. {{last_name}}, Cash flow optimization analysis for {{practice_name}}.',
          personalization_tags: ['last_name', 'practice_name', 'current_revenue', 'optimization_potential', 'device_name', 'net_positive_flow']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Financial Review Period',
        delay_hours: 120
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Financing Solutions',
        content: {
          subject: 'Custom Financing Solution for {{practice_name}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>I've arranged multiple financing options for {{device_name}}:</p>
          <h3>Financing Solutions:</h3>
          <ul>
          <li><strong>Option 1:</strong> &dollar;{{option_1_payment}}/month ({{option_1_term}} months, {{option_1_apr}}% APR)</li>
          <li><strong>Option 2:</strong> &dollar;{{option_2_payment}}/month ({{option_2_term}} months, {{option_2_apr}}% APR)</li>
          <li><strong>Option 3:</strong> Lease-to-own &dollar;{{option_3_payment}}/month</li>
          <li><strong>Cash Discount:</strong> {{cash_discount}}% off for full payment</li>
          </ul>
          <p><strong>Recommended:</strong> Option 2 provides best cash flow optimization.</p>`,
          body_text: 'Dr. {{last_name}}, Custom financing solutions for {{device_name}}.',
          personalization_tags: ['last_name', 'practice_name', 'device_name', 'option_1_payment', 'option_2_payment', 'cash_discount']
        }
      }
    ],
    triggers: [
      {
        type: 'cash_flow_concern',
        conditions: { cash_flow_tight: true, growth_goals: 'aggressive' },
        description: 'Practice with cash flow constraints but growth ambitions'
      },
      {
        type: 'financing_interest',
        conditions: { financing_inquiries: '>0', capital_preservation: 'important' },
        description: 'Practice interested in financing options'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'CFO', 'Administrator'],
    personalization_variables: ['practice_name', 'current_revenue', 'device_name', 'monthly_payment', 'net_positive_flow'],
    success_metrics: ['Financing Applications', 'Cash Flow Planning Meetings', 'Revenue Optimization Adoption'],
    estimated_duration: '3-4 weeks',
    difficulty_level: 'Medium'
  },

  {
    id: 'tax_advantage_maximizer',
    name: 'The Tax Advantage Maximizer',
    category: 'Financial & ROI',
    description: 'Maximize tax advantages and depreciation benefits from equipment purchases',
    psychology: 'Appeals to desire for tax optimization and financial efficiency',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Tax Advantage Analysis',
        content: {
          subject: 'Dr. {{last_name}} - {{tax_year}} Tax Advantages for {{device_name}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Significant tax advantages available for {{device_name}} purchase before {{deadline}}:</p>
          <h3>Tax Benefits Analysis:</h3>
          <ul>
          <li><strong>Section 179 Deduction:</strong> Up to &dollar;{{section_179_limit}} immediate deduction</li>
          <li><strong>Bonus Depreciation:</strong> {{bonus_percentage}}% first-year depreciation</li>
          <li><strong>Total Tax Savings:</strong> &dollar;{{total_tax_savings}} ({{tax_bracket}}% bracket)</li>
          <li><strong>Effective Cost:</strong> &dollar;{{effective_cost}} after tax benefits</li>
          </ul>
          <p><strong>Act Before {{deadline}}:</strong> These benefits expire soon.</p>`,
          body_text: 'Dr. {{last_name}}, {{tax_year}} tax advantages for {{device_name}} purchase.',
          personalization_tags: ['last_name', 'tax_year', 'device_name', 'deadline', 'section_179_limit', 'total_tax_savings']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Tax Planning Period',
        delay_hours: 72
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Tax Strategy Implementation',
        content: {
          subject: 'Implement {{practice_name}} Tax Optimization Strategy',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your customized tax optimization strategy:</p>
          <h3>Tax Strategy Implementation:</h3>
          <ul>
          <li><strong>Purchase Timing:</strong> Complete by {{optimal_date}} for maximum benefit</li>
          <li><strong>Documentation:</strong> Required forms and receipts package</li>
          <li><strong>CPA Coordination:</strong> I'll work with {{cpa_name}} if needed</li>
          <li><strong>Multi-Year Planning:</strong> Additional equipment considerations</li>
          </ul>
          <p><strong>Total Benefit:</strong> &dollar;{{total_benefit}} in tax savings + business growth</p>`,
          body_text: 'Dr. {{last_name}}, Tax optimization strategy implementation for {{practice_name}}.',
          personalization_tags: ['last_name', 'practice_name', 'optimal_date', 'cpa_name', 'total_benefit']
        }
      }
    ],
    triggers: [
      {
        type: 'tax_season_approach',
        conditions: { quarter: 'Q4', high_income_year: true },
        description: 'Approaching tax deadline with high income year'
      },
      {
        type: 'tax_optimization_interest',
        conditions: { cpa_consultations: '>0', tax_planning: 'active' },
        description: 'Practice actively engaged in tax planning'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'CFO', 'CPA'],
    personalization_variables: ['tax_year', 'device_name', 'section_179_limit', 'total_tax_savings', 'practice_name'],
    success_metrics: ['Tax Consultation Requests', 'Year-End Purchase Decisions', 'CPA Referrals'],
    estimated_duration: '2-3 weeks',
    difficulty_level: 'Advanced'
  },

  {
    id: 'profit_center_creator',
    name: 'The Profit Center Creator',
    category: 'Financial & ROI',
    description: 'Transform equipment into dedicated profit centers with detailed revenue projections',
    psychology: 'Appeals to entrepreneurial mindset and revenue optimization focus',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Profit Center Analysis',
        content: {
          subject: 'Dr. {{last_name}} - Turn {{device_name}} Into a {{revenue_projection}} Profit Center',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>{{device_name}} can become a dedicated profit center for {{practice_name}}:</p>
          <h3>Profit Center Projections:</h3>
          <ul>
          <li><strong>Service Addition:</strong> {{new_service}} procedures</li>
          <li><strong>Patient Volume:</strong> {{patient_volume}} procedures/month</li>
          <li><strong>Average Fee:</strong> &dollar;{{average_fee}} per procedure</li>
          <li><strong>Monthly Revenue:</strong> &dollar;{{monthly_revenue}}</li>
          <li><strong>Annual Profit:</strong> &dollar;{{annual_profit}} (after all expenses)</li>
          </ul>
          <p><strong>ROI Timeline:</strong> Full investment recovery in {{roi_months}} months</p>`,
          body_text: 'Dr. {{last_name}}, {{device_name}} profit center projections for {{practice_name}}.',
          personalization_tags: ['last_name', 'device_name', 'revenue_projection', 'practice_name', 'new_service', 'annual_profit']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Profit Planning Period',
        delay_hours: 96
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Profit Center Implementation Plan',
        content: {
          subject: 'Profit Center Implementation Plan for {{practice_name}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your step-by-step profit center implementation:</p>
          <h3>Implementation Timeline:</h3>
          <ul>
          <li><strong>Month 1:</strong> Equipment installation and staff training</li>
          <li><strong>Month 2:</strong> Service launch and initial patient flow</li>
          <li><strong>Month 3:</strong> Marketing optimization and volume ramp</li>
          <li><strong>Months 4-6:</strong> Full profit center operation</li>
          </ul>
          <p><strong>Success Metrics:</strong> Track {{key_metric_1}}, {{key_metric_2}}, and profitability</p>`,
          body_text: 'Dr. {{last_name}}, Profit center implementation plan for {{device_name}}.',
          personalization_tags: ['last_name', 'practice_name', 'key_metric_1', 'key_metric_2', 'device_name']
        }
      }
    ],
    triggers: [
      {
        type: 'revenue_growth_focus',
        conditions: { revenue_goals: 'aggressive', new_service_interest: true },
        description: 'Practice focused on revenue growth and new service lines'
      },
      {
        type: 'entrepreneurial_mindset',
        conditions: { business_expansion: 'planned', profit_optimization: 'priority' },
        description: 'Practice owner with entrepreneurial approach to growth'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'Administrator'],
    personalization_variables: ['device_name', 'revenue_projection', 'practice_name', 'new_service', 'annual_profit'],
    success_metrics: ['Profit Center Planning', 'Service Line Development', 'Revenue Growth Tracking'],
    estimated_duration: '4-6 weeks',
    difficulty_level: 'Medium'
  },

  // Risk & Protection Templates (3 templates)
  {
    id: 'liability_shield',
    name: 'The Liability Shield',
    category: 'Risk & Protection',
    description: 'Position advanced technology as liability protection and malpractice risk reduction',
    psychology: 'Addresses fear of malpractice and desire for risk mitigation',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Liability Risk Assessment',
        content: {
          subject: 'Dr. {{last_name}} - {{specialty}} Liability Risk Analysis for {{practice_name}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>I've analyzed current liability trends affecting {{specialty}} practices like yours:</p>
          <h3>Liability Risk Assessment:</h3>
          <ul>
          <li><strong>{{specialty}} Claims:</strong> Up {{percentage}}% in {{time_period}}</li>
          <li><strong>Average Settlement:</strong> &dollar;{{average_settlement}} ({{year}})</li>
          <li><strong>Common Causes:</strong> {{common_cause_1}}, {{common_cause_2}}, {{common_cause_3}}</li>
          <li><strong>Technology Factor:</strong> {{tech_protection_stat}}% fewer claims with advanced technology</li>
          </ul>
          <p>{{device_name}} provides significant liability protection for {{practice_name}}.</p>`,
          body_text: 'Dr. {{last_name}}, Liability risk analysis and protection strategies for {{specialty}}.',
          personalization_tags: ['last_name', 'specialty', 'practice_name', 'percentage', 'average_settlement', 'device_name']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Risk Assessment Period',
        delay_hours: 96
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Protection Strategy Implementation',
        content: {
          subject: 'Liability Protection Strategy for {{practice_name}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your comprehensive liability protection plan:</p>
          <h3>Protection Strategy:</h3>
          <ul>
          <li><strong>Technology Upgrade:</strong> {{device_name}} meets latest safety standards</li>
          <li><strong>Documentation:</strong> Enhanced record-keeping and outcome tracking</li>
          <li><strong>Insurance Benefits:</strong> Potential {{insurance_discount}}% premium reduction</li>
          <li><strong>Legal Defense:</strong> Better outcomes = stronger legal position</li>
          </ul>
          <p><strong>Protection Investment:</strong> Small cost for significant risk reduction</p>`,
          body_text: 'Dr. {{last_name}}, Comprehensive liability protection strategy.',
          personalization_tags: ['last_name', 'practice_name', 'device_name', 'insurance_discount']
        }
      }
    ],
    triggers: [
      {
        type: 'liability_concern',
        conditions: { recent_claims: true, insurance_premium_increase: '>10%' },
        description: 'Recent liability concerns or insurance premium increases'
      },
      {
        type: 'risk_management_focus',
        conditions: { risk_management_priority: 'high', compliance_focused: true },
        description: 'Practice with strong focus on risk management'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'Risk Manager', 'Administrator'],
    personalization_variables: ['specialty', 'practice_name', 'percentage', 'device_name', 'insurance_discount'],
    success_metrics: ['Risk Assessment Engagement', 'Insurance Consultations', 'Protection Technology Adoption'],
    estimated_duration: '3-4 weeks',
    difficulty_level: 'Advanced'
  },

  {
    id: 'compliance_guardian',
    name: 'The Compliance Guardian',
    category: 'Risk & Protection',
    description: 'Ensure regulatory compliance and reduce audit risk through technology adoption',
    psychology: 'Addresses compliance anxiety and regulatory uncertainty',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Compliance Audit',
        content: {
          subject: 'Dr. {{last_name}} - {{practice_name}} Compliance Readiness Assessment',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>I've completed a compliance readiness assessment for {{practice_name}}:</p>
          <h3>Compliance Assessment:</h3>
          <ul>
          <li><strong>Current Status:</strong> {{compliance_score}}% compliant with {{regulation_set}}</li>
          <li><strong>Gap Areas:</strong> {{gap_area_1}}, {{gap_area_2}}, {{gap_area_3}}</li>
          <li><strong>Upcoming Changes:</strong> {{upcoming_regulation}} effective {{effective_date}}</li>
          <li><strong>Risk Level:</strong> {{risk_level}} for potential audit findings</li>
          </ul>
          <p>{{device_name}} addresses {{compliance_benefits}}% of identified gaps.</p>`,
          body_text: 'Dr. {{last_name}}, Compliance readiness assessment for {{practice_name}}.',
          personalization_tags: ['last_name', 'practice_name', 'compliance_score', 'regulation_set', 'device_name']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Compliance Planning Period',
        delay_hours: 120
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Compliance Action Plan',
        content: {
          subject: 'Complete Compliance Solution for {{practice_name}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your comprehensive compliance action plan:</p>
          <h3>Compliance Strategy:</h3>
          <ul>
          <li><strong>Technology Compliance:</strong> {{device_name}} meets all {{standard_type}} requirements</li>
          <li><strong>Documentation:</strong> Automated compliance reporting features</li>
          <li><strong>Training:</strong> Staff compliance certification program</li>
          <li><strong>Monitoring:</strong> Ongoing compliance tracking and alerts</li>
          </ul>
          <p><strong>Compliance Confidence:</strong> Audit-ready practice with reduced risk</p>`,
          body_text: 'Dr. {{last_name}}, Complete compliance solution for {{practice_name}}.',
          personalization_tags: ['last_name', 'practice_name', 'device_name', 'standard_type']
        }
      }
    ],
    triggers: [
      {
        type: 'compliance_deadline',
        conditions: { regulation_deadline: '<12 months', compliance_gap: 'identified' },
        description: 'Upcoming compliance deadline with identified gaps'
      },
      {
        type: 'audit_concern',
        conditions: { audit_history: true, compliance_focus: 'high' },
        description: 'Practice with audit history or high compliance focus'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'Compliance Officer', 'Administrator'],
    personalization_variables: ['practice_name', 'compliance_score', 'device_name', 'standard_type'],
    success_metrics: ['Compliance Gap Closure', 'Audit Readiness', 'Regulatory Confidence'],
    estimated_duration: '4-6 weeks',
    difficulty_level: 'Advanced'
  },

  // Social & Digital Template (1 template)
  {
    id: 'digital_influence_amplifier',
    name: 'The Digital Influence Amplifier',
    category: 'Social & Digital',
    description: 'Leverage social media and digital platforms to amplify practice influence',
    psychology: 'Appeals to desire for digital presence and online influence',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Digital Presence Analysis',
        content: {
          subject: 'Dr. {{last_name}} - Digital Influence Assessment for {{practice_name}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>I've analyzed {{practice_name}}'s digital influence and online presence:</p>
          <h3>Digital Presence Analysis:</h3>
          <ul>
          <li><strong>Social Media Reach:</strong> {{social_followers}} total followers across platforms</li>
          <li><strong>Online Reviews:</strong> {{review_rating}} stars ({{review_count}} reviews)</li>
          <li><strong>Content Engagement:</strong> {{engagement_rate}}% average engagement</li>
          <li><strong>Digital Authority:</strong> Ranking {{ranking_position}} for "{{specialty}} {{city}}"</li>
          </ul>
          <p>{{device_name}} provides compelling content opportunities to amplify your influence.</p>`,
          body_text: 'Dr. {{last_name}}, Digital influence assessment for {{practice_name}}.',
          personalization_tags: ['last_name', 'practice_name', 'social_followers', 'review_rating', 'specialty', 'device_name']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Digital Strategy Development',
        delay_hours: 72
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Digital Amplification Strategy',
        content: {
          subject: 'Amplify {{practice_name}}\'s Digital Influence',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your comprehensive digital influence amplification strategy:</p>
          <h3>Digital Strategy:</h3>
          <ul>
          <li><strong>Content Creation:</strong> {{device_name}} case studies and outcomes</li>
          <li><strong>Social Proof:</strong> Patient success stories and testimonials</li>
          <li><strong>Thought Leadership:</strong> Educational content about {{specialty}}</li>
          <li><strong>Platform Optimization:</strong> Enhanced presence on {{platform_1}} and {{platform_2}}</li>
          </ul>
          <p><strong>Digital ROI:</strong> Increased visibility drives {{patient_increase}}% more consultations</p>`,
          body_text: 'Dr. {{last_name}}, Digital influence amplification strategy for {{practice_name}}.',
          personalization_tags: ['last_name', 'practice_name', 'device_name', 'specialty', 'platform_1', 'patient_increase']
        }
      }
    ],
    triggers: [
      {
        type: 'digital_marketing_interest',
        conditions: { social_media_active: true, content_creation_interest: 'high' },
        description: 'Practice interested in digital marketing and social media'
      },
      {
        type: 'online_presence_gap',
        conditions: { digital_presence_score: '<70%', competitor_digital_advantage: true },
        description: 'Practice with digital presence gap compared to competitors'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'Marketing Manager'],
    personalization_variables: ['practice_name', 'social_followers', 'device_name', 'specialty', 'patient_increase'],
    success_metrics: ['Digital Engagement Growth', 'Content Creation', 'Online Influence Metrics'],
    estimated_duration: '6-8 weeks',
    difficulty_level: 'Medium'
  },

  // Education & Influence Templates (4 templates)
  {
    id: 'medical_educator_platform',
    name: 'The Medical Educator Platform',
    category: 'Education & Influence',
    description: 'Transform doctors into industry educators and training leaders',
    psychology: 'Appeals to desire to teach, mentor, and share knowledge with peers',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Educational Opportunity Assessment',
        content: {
          subject: 'Dr. {{last_name}} - Medical Education Leadership Opportunity',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your expertise in {{specialty}} positions you as an ideal medical educator:</p>
          <h3>Educational Leadership Opportunities:</h3>
          <ul>
          <li><strong>Training Programs:</strong> Lead {{device_name}} certification courses</li>
          <li><strong>Medical Education:</strong> Resident and fellow training modules</li>
          <li><strong>Peer Teaching:</strong> {{specialty}} society educational programs</li>
          <li><strong>Digital Learning:</strong> Online course development and delivery</li>
          </ul>
          <p>Your clinical outcomes with {{device_name}} make you an ideal educator and mentor.</p>`,
          body_text: 'Dr. {{last_name}}, Medical education leadership opportunity in {{specialty}}.',
          personalization_tags: ['last_name', 'specialty', 'device_name']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Educational Interest Assessment',
        delay_hours: 96
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Educational Platform Development',
        content: {
          subject: 'Build Your {{specialty}} Educational Platform',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your comprehensive medical education platform development plan:</p>
          <h3>Educational Platform Strategy:</h3>
          <ul>
          <li><strong>Curriculum Development:</strong> {{course_name}} certification program</li>
          <li><strong>Training Delivery:</strong> In-person and virtual training options</li>
          <li><strong>Certification Authority:</strong> Become recognized {{device_name}} expert</li>
          <li><strong>Revenue Stream:</strong> &dollar;{{education_revenue}} annual education income potential</li>
          </ul>
          <p><strong>Legacy Impact:</strong> Train the next generation of {{specialty}} leaders</p>`,
          body_text: 'Dr. {{last_name}}, Medical education platform development for {{specialty}}.',
          personalization_tags: ['last_name', 'specialty', 'course_name', 'device_name', 'education_revenue']
        }
      }
    ],
    triggers: [
      {
        type: 'teaching_interest',
        conditions: { academic_affiliation: true, resident_teaching: true },
        description: 'Doctor with academic affiliation and teaching interest'
      },
      {
        type: 'expertise_recognition',
        conditions: { clinical_excellence: true, peer_recognition: 'high' },
        description: 'Doctor with recognized expertise and peer recognition'
      }
    ],
    target_stakeholders: ['Doctor', 'Department Head', 'Academic Director'],
    personalization_variables: ['specialty', 'device_name', 'course_name', 'education_revenue'],
    success_metrics: ['Educational Program Development', 'Student Training Numbers', 'Teaching Revenue'],
    estimated_duration: '8-12 weeks',
    difficulty_level: 'Advanced'
  },

  {
    id: 'clinical_research_leader',
    name: 'The Clinical Research Leader',
    category: 'Education & Influence',
    description: 'Position doctors as leading clinical researchers driving evidence-based medicine',
    psychology: 'Appeals to scientific curiosity and desire for research recognition',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Research Opportunity Identification',
        content: {
          subject: 'Dr. {{last_name}} - Clinical Research Leadership in {{specialty}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your exceptional {{device_name}} outcomes present a unique research opportunity:</p>
          <h3>Research Leadership Opportunities:</h3>
          <ul>
          <li><strong>Multi-center Study:</strong> Lead {{study_name}} clinical trial</li>
          <li><strong>Publication Target:</strong> {{target_journal}} (Impact Factor: {{impact_factor}})</li>
          <li><strong>Research Funding:</strong> &dollar;{{funding_amount}} available through {{funding_source}}</li>
          <li><strong>Co-investigators:</strong> {{collaborator_1}}, {{collaborator_2}}, {{collaborator_3}}</li>
          </ul>
          <p>This research could establish new standards of care in {{specialty}}.</p>`,
          body_text: 'Dr. {{last_name}}, Lead clinical research opportunity in {{specialty}}.',
          personalization_tags: ['last_name', 'device_name', 'specialty', 'study_name', 'target_journal', 'funding_amount']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Research Interest Evaluation',
        delay_hours: 120
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Research Protocol Development',
        content: {
          subject: 'Clinical Research Protocol for Dr. {{last_name}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your comprehensive clinical research protocol:</p>
          <h3>Research Implementation Plan:</h3>
          <ul>
          <li><strong>Study Design:</strong> {{study_design}} with {{sample_size}} patients</li>
          <li><strong>Primary Endpoint:</strong> {{primary_endpoint}}</li>
          <li><strong>Data Collection:</strong> {{device_name}} automated outcome tracking</li>
          <li><strong>Timeline:</strong> {{study_duration}} study duration</li>
          </ul>
          <p><strong>Career Impact:</strong> Establish yourself as leading {{specialty}} researcher</p>`,
          body_text: 'Dr. {{last_name}}, Clinical research protocol for {{specialty}} leadership.',
          personalization_tags: ['last_name', 'study_design', 'sample_size', 'device_name', 'specialty']
        }
      }
    ],
    triggers: [
      {
        type: 'research_interest',
        conditions: { publications_authored: '>0', research_experience: true },
        description: 'Doctor with research background and publication experience'
      },
      {
        type: 'exceptional_outcomes',
        conditions: { outcomes_top_5_percent: true, data_quality: 'high' },
        description: 'Doctor with exceptional, well-documented outcomes'
      }
    ],
    target_stakeholders: ['Doctor', 'Research Director', 'Department Head'],
    personalization_variables: ['specialty', 'device_name', 'study_name', 'target_journal', 'funding_amount'],
    success_metrics: ['Research Protocol Development', 'Study Enrollment', 'Publication Success'],
    estimated_duration: '6-12 months',
    difficulty_level: 'Advanced'
  },

  {
    id: 'conference_keynote_maker',
    name: 'The Conference Keynote Maker',
    category: 'Education & Influence',
    description: 'Transform doctors into sought-after conference speakers and keynote presenters',
    psychology: 'Appeals to desire for professional recognition and platform influence',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Speaking Opportunity Assessment',
        content: {
          subject: 'Dr. {{last_name}} - Keynote Speaking Opportunities in {{specialty}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your {{device_name}} outcomes make you an ideal keynote speaker for major conferences:</p>
          <h3>Speaking Opportunities:</h3>
          <ul>
          <li><strong>{{conference_1}}:</strong> Keynote slot available ({{attendees_1}} attendees)</li>
          <li><strong>{{conference_2}}:</strong> Featured speaker opportunity ({{attendees_2}} attendees)</li>
          <li><strong>{{conference_3}}:</strong> Panel moderator position ({{attendees_3}} attendees)</li>
          <li><strong>Speaking Fee:</strong> &dollar;{{speaking_fee}} per engagement</li>
          </ul>
          <p>Your presentation on {{topic}} would draw significant attention.</p>`,
          body_text: 'Dr. {{last_name}}, Keynote speaking opportunities in {{specialty}}.',
          personalization_tags: ['last_name', 'device_name', 'specialty', 'conference_1', 'speaking_fee', 'topic']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Speaking Interest Assessment',
        delay_hours: 96
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Speaker Development Program',
        content: {
          subject: 'Your {{specialty}} Speaker Development Program',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your comprehensive speaker development and booking strategy:</p>
          <h3>Speaker Development Plan:</h3>
          <ul>
          <li><strong>Content Development:</strong> {{device_name}} case study presentations</li>
          <li><strong>Speaking Training:</strong> Professional presentation coaching</li>
          <li><strong>Speaker Bureau:</strong> Join {{company_name}} speaker network</li>
          <li><strong>Annual Revenue:</strong> &dollar;{{annual_speaking_revenue}} speaking income potential</li>
          </ul>
          <p><strong>Platform Impact:</strong> Reach {{total_audience}} professionals annually</p>`,
          body_text: 'Dr. {{last_name}}, Speaker development program for {{specialty}}.',
          personalization_tags: ['last_name', 'specialty', 'device_name', 'company_name', 'annual_speaking_revenue', 'total_audience']
        }
      }
    ],
    triggers: [
      {
        type: 'presentation_experience',
        conditions: { conference_presentations: '>2', presentation_quality: 'high' },
        description: 'Doctor with conference presentation experience'
      },
      {
        type: 'compelling_story',
        conditions: { unique_outcomes: true, case_studies: '>3' },
        description: 'Doctor with compelling clinical stories and outcomes'
      }
    ],
    target_stakeholders: ['Doctor', 'Department Head', 'Marketing Director'],
    personalization_variables: ['specialty', 'device_name', 'conference_1', 'speaking_fee', 'annual_speaking_revenue'],
    success_metrics: ['Speaking Engagements Booked', 'Audience Reach', 'Professional Recognition'],
    estimated_duration: '3-6 months',
    difficulty_level: 'Medium'
  },

  {
    id: 'industry_consultant_builder',
    name: 'The Industry Consultant Builder',
    category: 'Education & Influence',
    description: 'Transform successful doctors into high-paid industry consultants',
    psychology: 'Appeals to entrepreneurial ambition and desire for additional income streams',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Consulting Opportunity Assessment',
        content: {
          subject: 'Dr. {{last_name}} - Industry Consulting Opportunities',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your expertise with {{device_name}} creates valuable consulting opportunities:</p>
          <h3>Consulting Opportunities:</h3>
          <ul>
          <li><strong>Device Companies:</strong> Clinical advisory positions (&dollar;{{advisory_rate}}/hour)</li>
          <li><strong>Practice Consulting:</strong> Help other practices implement {{device_name}}</li>
          <li><strong>Training Services:</strong> Corporate training programs</li>
          <li><strong>Expert Testimony:</strong> Legal and regulatory consulting</li>
          </ul>
          <p>Your clinical success translates directly into consulting income.</p>`,
          body_text: 'Dr. {{last_name}}, Industry consulting opportunities with {{device_name}} expertise.',
          personalization_tags: ['last_name', 'device_name', 'advisory_rate']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Consulting Interest Evaluation',
        delay_hours: 120
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Consulting Practice Development',
        content: {
          subject: 'Build Your {{specialty}} Consulting Practice',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your comprehensive consulting practice development plan:</p>
          <h3>Consulting Practice Strategy:</h3>
          <ul>
          <li><strong>Service Offerings:</strong> {{service_1}}, {{service_2}}, {{service_3}}</li>
          <li><strong>Client Development:</strong> {{target_clients}} potential clients identified</li>
          <li><strong>Revenue Projections:</strong> &dollar;{{consulting_revenue}} annual consulting income</li>
          <li><strong>Business Structure:</strong> {{business_entity}} entity setup</li>
          </ul>
          <p><strong>Consulting Launch:</strong> First clients within {{timeline}} months</p>`,
          body_text: 'Dr. {{last_name}}, Consulting practice development for {{specialty}}.',
          personalization_tags: ['last_name', 'specialty', 'service_1', 'service_2', 'consulting_revenue', 'timeline']
        }
      }
    ],
    triggers: [
      {
        type: 'business_interest',
        conditions: { entrepreneurial_activities: '>0', additional_income_interest: true },
        description: 'Doctor with entrepreneurial interests and income diversification goals'
      },
      {
        type: 'recognized_expertise',
        conditions: { industry_recognition: 'high', consultation_requests: '>5' },
        description: 'Doctor with recognized expertise receiving consultation requests'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'Business Manager'],
    personalization_variables: ['specialty', 'device_name', 'advisory_rate', 'consulting_revenue', 'timeline'],
    success_metrics: ['Consulting Contracts Secured', 'Revenue Generation', 'Client Satisfaction'],
    estimated_duration: '4-8 weeks',
    difficulty_level: 'Advanced'
  },

  // Additional Risk & Protection Template (1 more)
  {
    id: 'insurance_optimization',
    name: 'The Insurance Optimization Engine',
    category: 'Risk & Protection',
    description: 'Optimize insurance relationships and coverage through technology adoption',
    psychology: 'Addresses insurance cost concerns and coverage optimization desires',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Insurance Analysis',
        content: {
          subject: 'Dr. {{last_name}} - Insurance Optimization Analysis for {{practice_name}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>I've analyzed {{practice_name}}'s insurance relationships and coverage optimization opportunities:</p>
          <h3>Insurance Optimization Analysis:</h3>
          <ul>
          <li><strong>Current Premiums:</strong> &dollar;{{current_premiums}} annually</li>
          <li><strong>Coverage Gaps:</strong> {{gap_1}}, {{gap_2}}, {{gap_3}}</li>
          <li><strong>Technology Discount:</strong> {{device_name}} users get {{discount}}% premium reduction</li>
          <li><strong>Risk Score:</strong> Improved by {{risk_improvement}} with advanced technology</li>
          </ul>
          <p>{{device_name}} adoption could significantly improve your insurance profile.</p>`,
          body_text: 'Dr. {{last_name}}, Insurance optimization analysis for {{practice_name}}.',
          personalization_tags: ['last_name', 'practice_name', 'current_premiums', 'device_name', 'discount', 'risk_improvement']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Insurance Review Period',
        delay_hours: 96
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Insurance Strategy Implementation',
        content: {
          subject: 'Optimize {{practice_name}} Insurance Strategy',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your comprehensive insurance optimization strategy:</p>
          <h3>Insurance Optimization Plan:</h3>
          <ul>
          <li><strong>Premium Reduction:</strong> Save &dollar;{{annual_savings}} annually</li>
          <li><strong>Coverage Enhancement:</strong> Better protection with {{improved_coverage}}</li>
          <li><strong>Carrier Relations:</strong> Preferred provider status opportunities</li>
          <li><strong>Risk Management:</strong> {{device_name}} reduces liability exposure</li>
          </ul>
          <p><strong>Total Benefit:</strong> Better coverage + lower costs = optimal insurance position</p>`,
          body_text: 'Dr. {{last_name}}, Complete insurance optimization strategy for {{practice_name}}.',
          personalization_tags: ['last_name', 'practice_name', 'annual_savings', 'improved_coverage', 'device_name']
        }
      }
    ],
    triggers: [
      {
        type: 'insurance_renewal',
        conditions: { renewal_approaching: '<6 months', premium_increase: '>10%' },
        description: 'Insurance renewal approaching with premium increases'
      },
      {
        type: 'coverage_concern',
        conditions: { coverage_gaps_identified: true, risk_management_focus: 'high' },
        description: 'Practice with identified coverage gaps or risk management focus'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'Risk Manager', 'CFO'],
    personalization_variables: ['practice_name', 'current_premiums', 'device_name', 'annual_savings', 'improved_coverage'],
    success_metrics: ['Premium Reductions Achieved', 'Coverage Improvements', 'Insurance Relationships'],
    estimated_duration: '3-4 weeks',
    difficulty_level: 'Medium'
  },

  // Additional Social & Digital Templates (2 more)  
  {
    id: 'viral_case_study_creator',
    name: 'The Viral Case Study Creator',
    category: 'Social & Digital',
    description: 'Create compelling patient success stories that go viral and drive referrals',
    psychology: 'Leverages social proof and storytelling to build practice reputation',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Case Study Identification',
        content: {
          subject: 'Dr. {{last_name}} - Transform Your {{device_name}} Success Into Viral Content',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your {{device_name}} success stories have viral potential:</p>
          <h3>Viral Content Opportunities:</h3>
          <ul>
          <li><strong>Patient Success:</strong> {{patient_case}} transformation story</li>
          <li><strong>Before/After:</strong> Dramatic {{outcome_type}} improvement</li>
          <li><strong>Video Testimonials:</strong> Compelling patient interviews</li>
          <li><strong>Social Reach:</strong> Potential {{reach_estimate}} views across platforms</li>
          </ul>
          <p>These stories could drive {{referral_increase}}% increase in referrals.</p>`,
          body_text: 'Dr. {{last_name}}, Transform {{device_name}} success into viral content.',
          personalization_tags: ['last_name', 'device_name', 'patient_case', 'outcome_type', 'referral_increase']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Content Development Period',
        delay_hours: 72
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Viral Content Strategy',
        content: {
          subject: 'Viral Marketing Strategy for {{practice_name}}',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your comprehensive viral content marketing strategy:</p>
          <h3>Viral Content Plan:</h3>
          <ul>
          <li><strong>Content Creation:</strong> Professional video production</li>
          <li><strong>Distribution:</strong> {{platform_1}}, {{platform_2}}, {{platform_3}} optimization</li>
          <li><strong>Engagement Strategy:</strong> Community building and interaction</li>
          <li><strong>Success Tracking:</strong> Views, shares, referrals, conversions</li>
          </ul>
          <p><strong>Viral Impact:</strong> Establish {{practice_name}} as the go-to {{specialty}} practice</p>`,
          body_text: 'Dr. {{last_name}}, Viral content strategy for {{practice_name}}.',
          personalization_tags: ['last_name', 'practice_name', 'platform_1', 'platform_2', 'specialty']
        }
      }
    ],
    triggers: [
      {
        type: 'remarkable_outcomes',
        conditions: { dramatic_improvements: true, patient_willingness: 'high' },
        description: 'Practice with remarkable, shareable patient outcomes'
      },
      {
        type: 'social_media_ready',
        conditions: { social_presence: true, content_creation_capability: 'available' },
        description: 'Practice ready for social media content creation'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'Marketing Manager'],
    personalization_variables: ['device_name', 'patient_case', 'outcome_type', 'practice_name', 'specialty'],
    success_metrics: ['Content Viral Metrics', 'Referral Increases', 'Brand Recognition'],
    estimated_duration: '4-6 weeks',
    difficulty_level: 'Medium'
  },

  {
    id: 'online_reputation_dominator',
    name: 'The Online Reputation Dominator',
    category: 'Social & Digital',
    description: 'Dominate online search and reputation to become the obvious choice',
    psychology: 'Addresses competitive pressure and desire for market dominance',
    workflow_steps: [
      {
        id: 'step1',
        type: 'email',
        name: 'Digital Reputation Analysis',
        content: {
          subject: 'Dr. {{last_name}} - Online Reputation Dominance Strategy',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Analysis of {{practice_name}}'s online reputation and competitive positioning:</p>
          <h3>Digital Reputation Assessment:</h3>
          <ul>
          <li><strong>Search Rankings:</strong> Currently #{{current_ranking}} for "{{specialty}} {{city}}"</li>
          <li><strong>Review Score:</strong> {{review_score}} stars ({{review_count}} reviews)</li>
          <li><strong>Competitor Analysis:</strong> {{top_competitor}} ranks higher</li>
          <li><strong>Opportunity:</strong> {{device_name}} success stories can dominate search</li>
          </ul>
          <p>Strategic content creation can make you the obvious choice for patients.</p>`,
          body_text: 'Dr. {{last_name}}, Online reputation dominance strategy for {{practice_name}}.',
          personalization_tags: ['last_name', 'practice_name', 'current_ranking', 'specialty', 'city', 'device_name']
        }
      },
      {
        id: 'step2',
        type: 'wait',
        name: 'Reputation Strategy Development',
        delay_hours: 96
      },
      {
        id: 'step3',
        type: 'email',
        name: 'Domination Implementation Plan',
        content: {
          subject: 'Dominate {{city}} {{specialty}} Online Presence',
          body_html: `<p>Dr. {{last_name}},</p>
          <p>Your comprehensive online reputation domination plan:</p>
          <h3>Domination Strategy:</h3>
          <ul>
          <li><strong>Content Dominance:</strong> {{device_name}} authority content creation</li>
          <li><strong>Review Generation:</strong> Systematic 5-star review campaigns</li>
          <li><strong>SEO Optimization:</strong> Rank #1 for {{target_keywords}}</li>
          <li><strong>Social Proof:</strong> Patient success story amplification</li>
          </ul>
          <p><strong>Domination Timeline:</strong> #1 ranking within {{timeline}} months</p>`,
          body_text: 'Dr. {{last_name}}, Online domination plan for {{city}} {{specialty}}.',
          personalization_tags: ['last_name', 'city', 'specialty', 'device_name', 'target_keywords', 'timeline']
        }
      }
    ],
    triggers: [
      {
        type: 'competitive_pressure',
        conditions: { competitor_growth: '>20%', market_share_loss: true },
        description: 'Practice facing competitive pressure and market share loss'
      },
      {
        type: 'growth_ambition',
        conditions: { growth_goals: 'aggressive', marketing_investment: 'willing' },
        description: 'Practice with aggressive growth goals and marketing investment capacity'
      }
    ],
    target_stakeholders: ['Doctor', 'Practice Owner', 'Marketing Manager'],
    personalization_variables: ['practice_name', 'specialty', 'city', 'device_name', 'target_keywords'],
    success_metrics: ['Search Ranking Improvements', 'Review Score Growth', 'Online Visibility'],
    estimated_duration: '6-8 weeks',
    difficulty_level: 'Advanced'
  }
];

// Template Categories
export const TEMPLATE_CATEGORIES = {
  'Psychological Warfare': 'Leverage professional psychology and competitive instincts',
  'Intelligence & Prediction': 'Use AI and data to predict future needs and trends',
  'Influence & Network': 'Tap into social networks and influence patterns',
  'Competitive & Market': 'Monitor and respond to competitive threats',
  'Status & Legacy': 'Appeal to professional legacy and status concerns',
  'Financial & ROI': 'Focus on financial outcomes and return on investment',
  'Risk & Protection': 'Address malpractice and liability concerns',
  'Social & Digital': 'Leverage social media and digital influence',
  'Education & Influence': 'Position through education and thought leadership'
};

// Helper functions
export const getTemplatesByCategory = (category: string): AutomationTemplate[] => {
  return MEDICAL_AUTOMATION_TEMPLATES.filter(template => template.category === category);
};

export const getTemplateById = (id: string): AutomationTemplate | undefined => {
  return MEDICAL_AUTOMATION_TEMPLATES.find(template => template.id === id);
};

export const getPopularTemplates = (): AutomationTemplate[] => {
  return MEDICAL_AUTOMATION_TEMPLATES.filter(template => 
    ['celebrity_doctor_maker', 'practice_jealousy_engine', 'crystal_ball_predictor', 'revenue_rescue_mission', 
     'ego_stroke_engine', 'thought_leader_maker', 'legacy_builder', 'profit_center_creator']
    .includes(template.id)
  );
};

export default MEDICAL_AUTOMATION_TEMPLATES;