/**
 * SUIS Intelligence Mock Data
 * Comprehensive mock data for all SUIS Intelligence modules
 */

export interface IntelligenceMetrics {
  totalContacts: number;
  activeEngagements: number;
  contentGenerated: number;
  researchProjects: number;
  marketInsights: number;
  learningProgress: number;
  aiInteractions: number;
  dataPoints: number;
}

export interface IntelligenceInsight {
  id: string;
  type: 'contact' | 'market' | 'research' | 'learning' | 'content';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  timestamp: string;
  impact: number; // 1-10
  category: string;
  aiGenerated: boolean;
}

export interface ContactUniverseData {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  practice: string;
  specialty: string;
  location: string;
  engagementScore: number;
  lastContact: string;
  preferredChannel: 'email' | 'phone' | 'in-person' | 'digital';
  interests: string[];
  purchaseHistory: {
    product: string;
    date: string;
    value: number;
  }[];
  aiScore: number;
  nextBestAction: string;
  tags: string[];
}

export interface ContentTemplate {
  id: string;
  name: string;
  type: 'email' | 'social' | 'presentation' | 'article' | 'video_script';
  category: string;
  tone: 'professional' | 'friendly' | 'educational' | 'persuasive';
  length: 'short' | 'medium' | 'long';
  performance: {
    opens: number;
    clicks: number;
    conversions: number;
    engagement: number;
  };
  aiOptimized: boolean;
  lastUsed: string;
  successRate: number;
}

export interface ResearchProject {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'planned';
  type: 'market' | 'competitor' | 'product' | 'clinical';
  startDate: string;
  completionDate?: string;
  findings: {
    title: string;
    insight: string;
    confidence: number;
    sources: number;
  }[];
  dataPoints: number;
  aiAnalysis: {
    summary: string;
    keyTakeaways: string[];
    recommendations: string[];
  };
}

export interface MarketIntelligence {
  id: string;
  region: string;
  segment: string;
  trend: 'growing' | 'stable' | 'declining';
  opportunity: string;
  competitorActivity: {
    company: string;
    action: string;
    impact: 'high' | 'medium' | 'low';
  }[];
  marketSize: number;
  growthRate: number;
  aiPrediction: {
    nextQuarter: number;
    confidence: number;
    factors: string[];
  };
}

export interface LearningModule {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  completionRate: number;
  userProgress: number;
  certificationAvailable: boolean;
  aiPersonalized: boolean;
  topics: string[];
  assessments: {
    name: string;
    score?: number;
    completed: boolean;
  }[];
}

// Generate mock Intelligence Hub metrics
export const generateIntelligenceMetrics = (): IntelligenceMetrics => ({
  totalContacts: 5847,
  activeEngagements: 423,
  contentGenerated: 1256,
  researchProjects: 38,
  marketInsights: 152,
  learningProgress: 78,
  aiInteractions: 3421,
  dataPoints: 125000
});

// Generate mock insights
export const generateIntelligenceInsights = (count: number = 10): IntelligenceInsight[] => {
  const insights: IntelligenceInsight[] = [
    {
      id: '1',
      type: 'contact',
      title: 'High-Value Prosthodontist Network Identified',
      description: 'AI analysis revealed 23 prosthodontists in Manhattan with 85%+ likelihood of premium implant adoption based on practice patterns',
      priority: 'high',
      actionable: true,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      impact: 9,
      category: 'Opportunity',
      aiGenerated: true
    },
    {
      id: '2',
      type: 'market',
      title: 'Emerging Trend: Digital Workflow Adoption Surge',
      description: 'Market intelligence indicates 45% increase in digital scanner inquiries among aesthetic practices in Q4',
      priority: 'high',
      actionable: true,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      impact: 8,
      category: 'Market Trend',
      aiGenerated: true
    },
    {
      id: '3',
      type: 'research',
      title: 'Competitor Pricing Strategy Shift Detected',
      description: 'Analysis of 500+ data points reveals major competitor adjusting premium implant pricing in Northeast markets',
      priority: 'medium',
      actionable: true,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      impact: 7,
      category: 'Competitive Intelligence',
      aiGenerated: true
    },
    {
      id: '4',
      type: 'content',
      title: 'Top Performing Email Template Identified',
      description: 'AI optimization increased open rates by 43% for aesthetic practice outreach campaigns',
      priority: 'medium',
      actionable: true,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      impact: 6,
      category: 'Performance',
      aiGenerated: true
    },
    {
      id: '5',
      type: 'learning',
      title: 'Skill Gap Identified: Advanced Bone Grafting',
      description: 'Territory analysis shows 67% of target accounts seeking advanced bone grafting education',
      priority: 'high',
      actionable: true,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      impact: 8,
      category: 'Education Opportunity',
      aiGenerated: true
    }
  ];

  // Add more generated insights
  for (let i = 6; i <= count; i++) {
    insights.push({
      id: i.toString(),
      type: ['contact', 'market', 'research', 'learning', 'content'][Math.floor(Math.random() * 5)] as any,
      title: `AI-Generated Insight #${i}`,
      description: 'Advanced pattern recognition identified actionable opportunity in your territory',
      priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as any,
      actionable: Math.random() > 0.3,
      timestamp: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
      impact: Math.floor(Math.random() * 10) + 1,
      category: ['Opportunity', 'Risk', 'Performance', 'Market Trend'][Math.floor(Math.random() * 4)],
      aiGenerated: true
    });
  }

  return insights;
};

// Generate Contact Universe data
export const generateContactUniverseData = (count: number = 50): ContactUniverseData[] => {
  const firstNames = ['James', 'Sarah', 'Michael', 'Emily', 'David', 'Jennifer', 'Robert', 'Lisa', 'John', 'Maria'];
  const lastNames = ['Chen', 'Patel', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
  const titles = ['Practice Owner', 'Lead Dentist', 'Clinical Director', 'Managing Partner', 'Chief of Prosthodontics'];
  const practices = ['Elite Dental Manhattan', 'Aesthetic Smiles NYC', 'Park Avenue Dental', 'Tribeca Dental Studio', 'Upper East Side Dental'];
  const specialties = ['Prosthodontics', 'Oral Surgery', 'Periodontics', 'Endodontics', 'Aesthetic Dentistry'];
  const locations = ['Manhattan, NY', 'Brooklyn, NY', 'Queens, NY', 'Long Island, NY', 'Westchester, NY'];
  const interests = ['Digital Dentistry', 'Implantology', 'Aesthetic Cases', 'Complex Rehabilitation', 'Bone Grafting', 'CAD/CAM'];
  const products = ['Premium Implant System', 'Digital Scanner', 'Bone Graft Material', 'Surgical Guide System', 'Aesthetic Crown'];

  return Array.from({ length: count }, (_, i) => ({
    id: `contact-${i + 1}`,
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    title: titles[Math.floor(Math.random() * titles.length)],
    practice: practices[Math.floor(Math.random() * practices.length)],
    specialty: specialties[Math.floor(Math.random() * specialties.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    engagementScore: Math.floor(Math.random() * 100),
    lastContact: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
    preferredChannel: ['email', 'phone', 'in-person', 'digital'][Math.floor(Math.random() * 4)] as any,
    interests: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => 
      interests[Math.floor(Math.random() * interests.length)]
    ).filter((v, i, a) => a.indexOf(v) === i),
    purchaseHistory: Array.from({ length: Math.floor(Math.random() * 5) }, () => ({
      product: products[Math.floor(Math.random() * products.length)],
      date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
      value: Math.floor(Math.random() * 50000) + 5000
    })),
    aiScore: Math.floor(Math.random() * 100),
    nextBestAction: [
      'Schedule product demo for new scanner',
      'Follow up on implant case discussion',
      'Invite to advanced training workshop',
      'Share aesthetic case studies',
      'Discuss volume pricing options'
    ][Math.floor(Math.random() * 5)],
    tags: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
      ['VIP', 'High Volume', 'Early Adopter', 'Opinion Leader', 'Digital Ready'][Math.floor(Math.random() * 5)]
    ).filter((v, i, a) => a.indexOf(v) === i)
  }));
};

// Generate Content Templates
export const generateContentTemplates = (): ContentTemplate[] => [
  {
    id: 'template-1',
    name: 'Premium Implant Introduction',
    type: 'email',
    category: 'Product Launch',
    tone: 'professional',
    length: 'medium',
    performance: {
      opens: 847,
      clicks: 234,
      conversions: 45,
      engagement: 72
    },
    aiOptimized: true,
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    successRate: 82
  },
  {
    id: 'template-2',
    name: 'Digital Workflow Benefits',
    type: 'presentation',
    category: 'Educational',
    tone: 'educational',
    length: 'long',
    performance: {
      opens: 623,
      clicks: 189,
      conversions: 38,
      engagement: 85
    },
    aiOptimized: true,
    lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    successRate: 78
  },
  {
    id: 'template-3',
    name: 'Case Study: Complex Rehabilitation',
    type: 'article',
    category: 'Case Study',
    tone: 'professional',
    length: 'long',
    performance: {
      opens: 512,
      clicks: 145,
      conversions: 28,
      engagement: 91
    },
    aiOptimized: true,
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    successRate: 86
  },
  {
    id: 'template-4',
    name: 'Social Media: Innovation Spotlight',
    type: 'social',
    category: 'Brand Awareness',
    tone: 'friendly',
    length: 'short',
    performance: {
      opens: 2341,
      clicks: 567,
      conversions: 89,
      engagement: 68
    },
    aiOptimized: true,
    lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    successRate: 74
  },
  {
    id: 'template-5',
    name: 'Workshop Invitation: Advanced Techniques',
    type: 'email',
    category: 'Event',
    tone: 'persuasive',
    length: 'medium',
    performance: {
      opens: 934,
      clicks: 312,
      conversions: 67,
      engagement: 79
    },
    aiOptimized: true,
    lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    successRate: 88
  }
];

// Generate Research Projects
export const generateResearchProjects = (): ResearchProject[] => [
  {
    id: 'research-1',
    title: 'Premium Implant Market Analysis - Northeast Region',
    status: 'active',
    type: 'market',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    findings: [
      {
        title: 'Market Growth Acceleration',
        insight: 'Premium implant segment growing 23% YoY, outpacing standard implants by 3x',
        confidence: 92,
        sources: 45
      },
      {
        title: 'Digital Integration Correlation',
        insight: 'Practices with digital scanners show 67% higher premium implant adoption',
        confidence: 88,
        sources: 128
      },
      {
        title: 'Price Sensitivity Analysis',
        insight: 'Premium pricing accepted when coupled with comprehensive training programs',
        confidence: 85,
        sources: 73
      }
    ],
    dataPoints: 3847,
    aiAnalysis: {
      summary: 'The premium implant market in the Northeast shows strong growth potential, particularly among digitally-enabled practices',
      keyTakeaways: [
        'Digital workflow integration is a key driver of premium adoption',
        'Training and education programs significantly reduce price sensitivity',
        'Early adopter practices influence 3-5 additional practices on average'
      ],
      recommendations: [
        'Focus on practices with existing digital infrastructure',
        'Develop comprehensive training programs for new adopters',
        'Leverage early adopter success stories in marketing'
      ]
    }
  },
  {
    id: 'research-2',
    title: 'Competitor Analysis: Aesthetic Solutions Landscape',
    status: 'completed',
    type: 'competitor',
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    completionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    findings: [
      {
        title: 'Market Positioning Gaps',
        insight: 'Identified underserved segment in mid-tier aesthetic practices',
        confidence: 90,
        sources: 234
      },
      {
        title: 'Pricing Strategy Opportunities',
        insight: 'Competitors leaving 15-20% margin opportunity in bundled solutions',
        confidence: 87,
        sources: 156
      }
    ],
    dataPoints: 5621,
    aiAnalysis: {
      summary: 'Competitive landscape analysis reveals significant opportunities in mid-tier aesthetic market',
      keyTakeaways: [
        'Mid-tier practices underserved by current premium offerings',
        'Bundle pricing provides margin expansion opportunity',
        'Service differentiation more impactful than product features alone'
      ],
      recommendations: [
        'Develop targeted solutions for mid-tier aesthetic practices',
        'Create value bundles combining products and services',
        'Enhance service offerings to differentiate from competitors'
      ]
    }
  }
];

// Generate Market Intelligence
export const generateMarketIntelligence = (): MarketIntelligence[] => [
  {
    id: 'market-1',
    region: 'Northeast',
    segment: 'Premium Implants',
    trend: 'growing',
    opportunity: 'Rapid adoption of digital workflows creating demand for compatible premium implant systems',
    competitorActivity: [
      {
        company: 'CompetitorA',
        action: 'Launched new premium line with aggressive pricing',
        impact: 'medium'
      },
      {
        company: 'CompetitorB',
        action: 'Acquired local distributor network',
        impact: 'high'
      }
    ],
    marketSize: 125000000,
    growthRate: 18.5,
    aiPrediction: {
      nextQuarter: 132500000,
      confidence: 85,
      factors: [
        'Seasonal procedure increase',
        'New practice openings',
        'Digital adoption acceleration'
      ]
    }
  },
  {
    id: 'market-2',
    region: 'West Coast',
    segment: 'Digital Scanners',
    trend: 'growing',
    opportunity: 'Tech-forward practices seeking integrated digital solutions',
    competitorActivity: [
      {
        company: 'TechDental Inc',
        action: 'Partnership with major DSO announced',
        impact: 'high'
      }
    ],
    marketSize: 89000000,
    growthRate: 24.3,
    aiPrediction: {
      nextQuarter: 98500000,
      confidence: 88,
      factors: [
        'DSO expansion plans',
        'Technology adoption curve',
        'Training program availability'
      ]
    }
  }
];

// Generate Learning Modules
export const generateLearningModules = (): LearningModule[] => [
  {
    id: 'module-1',
    title: 'Advanced Implant Placement Techniques',
    category: 'Clinical Excellence',
    difficulty: 'advanced',
    duration: 180,
    completionRate: 73,
    userProgress: 65,
    certificationAvailable: true,
    aiPersonalized: true,
    topics: [
      'Immediate placement protocols',
      'Bone grafting techniques',
      'Soft tissue management',
      'Digital planning integration'
    ],
    assessments: [
      { name: 'Pre-assessment', score: 78, completed: true },
      { name: 'Module 1 Quiz', score: 85, completed: true },
      { name: 'Module 2 Quiz', score: 82, completed: true },
      { name: 'Final Exam', completed: false }
    ]
  },
  {
    id: 'module-2',
    title: 'Digital Workflow Mastery',
    category: 'Technology',
    difficulty: 'intermediate',
    duration: 120,
    completionRate: 89,
    userProgress: 100,
    certificationAvailable: true,
    aiPersonalized: true,
    topics: [
      'Scanner operation and maintenance',
      'CAD/CAM design principles',
      'Material selection',
      'Lab communication'
    ],
    assessments: [
      { name: 'Initial Assessment', score: 91, completed: true },
      { name: 'Practical Exercise', score: 88, completed: true },
      { name: 'Certification Exam', score: 93, completed: true }
    ]
  },
  {
    id: 'module-3',
    title: 'Practice Growth Strategies',
    category: 'Business Development',
    difficulty: 'beginner',
    duration: 90,
    completionRate: 82,
    userProgress: 45,
    certificationAvailable: false,
    aiPersonalized: true,
    topics: [
      'Patient communication',
      'Treatment planning',
      'Financial presentations',
      'Marketing strategies'
    ],
    assessments: [
      { name: 'Module 1 Check', score: 86, completed: true },
      { name: 'Module 2 Check', completed: false },
      { name: 'Final Project', completed: false }
    ]
  }
];

// Main export function for all mock data
export const generateAllSUISMockData = () => ({
  metrics: generateIntelligenceMetrics(),
  insights: generateIntelligenceInsights(20),
  contacts: generateContactUniverseData(100),
  contentTemplates: generateContentTemplates(),
  researchProjects: generateResearchProjects(),
  marketIntelligence: generateMarketIntelligence(),
  learningModules: generateLearningModules()
});