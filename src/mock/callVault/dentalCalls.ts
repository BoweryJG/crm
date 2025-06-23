// Dental Sales Call Scenarios - Realistic conversations for demo mode

export interface TranscriptSegment {
  timestamp: number;
  speaker: 'rep' | 'prospect';
  text: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  keywords?: string[];
}

export interface DemoCall {
  id: string;
  title: string;
  contact: {
    name: string;
    practice: string;
    phone: string;
  };
  date: string;
  duration: number;
  outcome: 'closed' | 'follow-up' | 'objection' | 'no-decision';
  industry: 'dental' | 'aesthetic';
  tags: string[];
  valueScore: number;
  transcript: TranscriptSegment[];
  analytics: {
    sentiment: 'positive' | 'neutral' | 'negative';
    talkRatio: { rep: number; prospect: number };
    keyTopics: string[];
    objections: string[];
    nextSteps: string[];
    coachingTips: string[];
  };
}

export const dentalCalls: DemoCall[] = [
  {
    id: 'demo-dental-1',
    title: 'Dr. Sarah Johnson - Invisalign System Demo',
    contact: {
      name: 'Dr. Sarah Johnson',
      practice: 'Johnson Family Dentistry',
      phone: '555-0123'
    },
    date: '2024-01-20',
    duration: 892, // 14:52
    outcome: 'closed',
    industry: 'dental',
    tags: ['Product Demo', 'Invisalign', 'Closed Deal', 'High Value'],
    valueScore: 95,
    transcript: [
      {
        timestamp: 0,
        speaker: 'rep',
        text: "Good morning Dr. Johnson, this is Alex from MedTech Solutions. I'm calling about our conversation last week regarding the new Invisalign Pro system. Do you have about 15 minutes to discuss how this could streamline your orthodontic offerings?",
        sentiment: 'positive'
      },
      {
        timestamp: 18,
        speaker: 'prospect',
        text: "Hi Alex, yes, perfect timing actually. We just had our monthly team meeting and everyone's excited about potentially adding clear aligners to our services.",
        sentiment: 'positive',
        keywords: ['clear aligners', 'team meeting', 'excited']
      },
      {
        timestamp: 35,
        speaker: 'rep',
        text: "That's wonderful to hear! Based on our last discussion, you mentioned you're seeing about 40-50 patients monthly who could benefit from orthodontic treatment. The Invisalign Pro system could really help capture that revenue. What specific aspects would you like to focus on today?",
        sentiment: 'positive'
      },
      {
        timestamp: 58,
        speaker: 'prospect',
        text: "I'm particularly interested in the scanning technology and how quickly we can get cases approved. Some of my colleagues mentioned long turnaround times with other systems.",
        sentiment: 'neutral',
        keywords: ['scanning technology', 'turnaround times']
      },
      {
        timestamp: 78,
        speaker: 'rep',
        text: "Great question. Our new iTero Element 5D Plus scanner integrates directly with the Invisalign system. You can submit cases in real-time, and we guarantee case approval within 24 hours. Most practices see approval in just 4-6 hours.",
        sentiment: 'positive'
      },
      {
        timestamp: 102,
        speaker: 'prospect',
        text: "That's impressive. What about the learning curve for my staff? We have two new hygienists.",
        sentiment: 'neutral',
        keywords: ['learning curve', 'staff training']
      },
      {
        timestamp: 118,
        speaker: 'rep',
        text: "We include comprehensive onsite training for your entire team. Plus, you get access to our online certification program and 24/7 support. Most teams are comfortable with the system within a week. Dr. Chen from Smile Dental started last month and his team is already processing 15 cases weekly.",
        sentiment: 'positive'
      },
      {
        timestamp: 145,
        speaker: 'prospect',
        text: "Dr. Chen mentioned you at the dental conference. He seemed very happy. What about pricing? I need to understand the ROI.",
        sentiment: 'positive',
        keywords: ['pricing', 'ROI']
      },
      {
        timestamp: 165,
        speaker: 'rep',
        text: "Absolutely. The complete system, including the scanner and first-year software license, is $42,000. However, with our current promotion, we can offer it at $38,500. Based on your patient volume, charging the average $4,500 per Invisalign case, you'd break even after just 9 cases. Most practices see 3-5 cases monthly.",
        sentiment: 'positive'
      },
      {
        timestamp: 195,
        speaker: 'prospect',
        text: "Those numbers make sense. What financing options do you have? I'd prefer to preserve cash flow.",
        sentiment: 'positive',
        keywords: ['financing', 'cash flow']
      },
      {
        timestamp: 210,
        speaker: 'rep',
        text: "We work with several healthcare financing partners. Most popular is our 60-month lease at $750 per month with a $1 buyout. This actually becomes cash-flow positive after your first case each month. We also have 0% financing for 24 months if you prefer.",
        sentiment: 'positive'
      },
      {
        timestamp: 235,
        speaker: 'prospect',
        text: "The lease option sounds perfect. Can you include the advanced training package we discussed?",
        sentiment: 'positive',
        keywords: ['lease option', 'training package']
      },
      {
        timestamp: 250,
        speaker: 'rep',
        text: "Absolutely! I'll include our Premium Training Package at no additional cost - that's a $3,000 value. This includes advanced case planning, complex case management, and marketing materials to help you launch the service.",
        sentiment: 'positive'
      },
      {
        timestamp: 270,
        speaker: 'prospect',
        text: "Excellent. Let's move forward. What are the next steps?",
        sentiment: 'positive',
        keywords: ['move forward', 'next steps']
      },
      {
        timestamp: 282,
        speaker: 'rep',
        text: "Fantastic, Dr. Johnson! I'll email you the agreement within the hour. Once signed, we can schedule installation for next week. Our team will handle everything - installation, training, and even help with your first few cases. You'll be seeing your ROI within the first month.",
        sentiment: 'positive'
      },
      {
        timestamp: 305,
        speaker: 'prospect',
        text: "Perfect. Send it to my practice email. Looking forward to getting started!",
        sentiment: 'positive'
      }
    ],
    analytics: {
      sentiment: 'positive',
      talkRatio: { rep: 65, prospect: 35 },
      keyTopics: ['Invisalign Pro', 'ROI', 'Training', 'Financing', 'Fast approval'],
      objections: ['Turnaround time concerns', 'Staff training needs', 'Cash flow preference'],
      nextSteps: ['Send agreement within hour', 'Schedule installation next week', 'Coordinate team training'],
      coachingTips: [
        'Excellent use of social proof (Dr. Chen reference)',
        'Strong ROI presentation with specific numbers',
        'Good handling of financing objection',
        'Consider asking about competitor systems earlier'
      ]
    }
  },
  {
    id: 'demo-dental-2',
    title: 'Dr. Michael Chen - Digital Scanner Objection Handling',
    contact: {
      name: 'Dr. Michael Chen',
      practice: 'Advanced Dental Care',
      phone: '555-0456'
    },
    date: '2024-01-19',
    duration: 512, // 8:32
    outcome: 'follow-up',
    industry: 'dental',
    tags: ['Digital Scanner', 'Objection', 'Technical', 'Follow-up'],
    valueScore: 72,
    transcript: [
      {
        timestamp: 0,
        speaker: 'rep',
        text: "Hi Dr. Chen, this is Maria from DentalTech Innovations. I wanted to follow up on the intraoral scanner demo from last week. How did your team feel about the 3Shape TRIOS?",
        sentiment: 'neutral'
      },
      {
        timestamp: 15,
        speaker: 'prospect',
        text: "Hi Maria. Well, the technology is impressive, but I have some concerns. We already have a scanner that works fine, and this seems like a big investment.",
        sentiment: 'negative',
        keywords: ['concerns', 'big investment', 'already have']
      },
      {
        timestamp: 32,
        speaker: 'rep',
        text: "I understand your perspective. May I ask which scanner you're currently using and what challenges you've experienced with it?",
        sentiment: 'neutral'
      },
      {
        timestamp: 45,
        speaker: 'prospect',
        text: "We have an older Cerec system. It works, but the images aren't as clear as they used to be, and it takes multiple scans sometimes. Plus, sending to the lab is still a separate process.",
        sentiment: 'neutral',
        keywords: ['older Cerec', 'multiple scans', 'separate process']
      },
      {
        timestamp: 68,
        speaker: 'rep',
        text: "Those are common pain points with older systems. The TRIOS 5 would solve all three issues - it has 30% better accuracy, captures full arch in under 60 seconds, and integrates directly with over 300 labs. How much time do you think your team spends on rescans each week?",
        sentiment: 'positive'
      },
      {
        timestamp: 92,
        speaker: 'prospect',
        text: "Probably 2-3 hours between rescans and managing lab communications. But the price difference is significant.",
        sentiment: 'negative',
        keywords: ['2-3 hours', 'price difference']
      },
      {
        timestamp: 108,
        speaker: 'rep',
        text: "Let's look at the numbers. At 2.5 hours weekly, that's 130 hours annually. With your hourly production rate, that's roughly $19,500 in lost revenue. The TRIOS 5 is $28,000, but with our trade-in program, we can offer $8,000 for your Cerec, bringing it to $20,000.",
        sentiment: 'positive'
      },
      {
        timestamp: 135,
        speaker: 'prospect',
        text: "I didn't know about the trade-in program. That does change things. But I need to discuss this with my partner first.",
        sentiment: 'neutral',
        keywords: ['trade-in program', 'discuss with partner']
      },
      {
        timestamp: 152,
        speaker: 'rep',
        text: "Of course. Would it be helpful if I prepared a comparison showing your current workflow costs versus the TRIOS 5 ROI? I could also include testimonials from practices that switched from Cerec.",
        sentiment: 'positive'
      },
      {
        timestamp: 170,
        speaker: 'prospect',
        text: "Yes, that would be very helpful. Can you also include information about the warranty and support?",
        sentiment: 'positive',
        keywords: ['warranty', 'support']
      },
      {
        timestamp: 185,
        speaker: 'rep',
        text: "Absolutely. I'll include our 5-year warranty details and unlimited support package. When would be a good time to review this with you and your partner? I could do a brief Zoom call to walk through everything.",
        sentiment: 'positive'
      },
      {
        timestamp: 205,
        speaker: 'prospect',
        text: "How about Thursday afternoon? We're both free after 3 PM.",
        sentiment: 'positive'
      },
      {
        timestamp: 218,
        speaker: 'rep',
        text: "Perfect. I'll send a calendar invite for Thursday at 3 PM, along with the comparison report beforehand. We'll make this a quick 20-minute call focused on your specific needs.",
        sentiment: 'positive'
      }
    ],
    analytics: {
      sentiment: 'neutral',
      talkRatio: { rep: 60, prospect: 40 },
      keyTopics: ['Digital scanner upgrade', 'Trade-in program', 'ROI analysis', 'Workflow efficiency'],
      objections: ['Already have working scanner', 'High investment cost', 'Need partner approval'],
      nextSteps: ['Send comparison report', 'Schedule Thursday 3 PM call', 'Include warranty information'],
      coachingTips: [
        'Good job uncovering pain points',
        'Effective use of ROI calculation',
        'Trade-in program was key differentiator',
        'Could have asked about specific procedures earlier'
      ]
    }
  },
  {
    id: 'demo-dental-3',
    title: 'Dr. Emily Williams - Practice Management Software',
    contact: {
      name: 'Dr. Emily Williams',
      practice: 'Williams & Associates Dental',
      phone: '555-0789'
    },
    date: '2024-01-18',
    duration: 1342, // 22:22
    outcome: 'closed',
    industry: 'dental',
    tags: ['Software', 'Practice Management', 'Negotiation', 'Multi-location'],
    valueScore: 88,
    transcript: [
      {
        timestamp: 0,
        speaker: 'rep',
        text: "Good afternoon Dr. Williams, this is Jason from CloudDent Solutions. Thank you for taking the time to discuss modernizing your practice management across all three locations. I've reviewed your current setup - how are things going with your existing system?",
        sentiment: 'positive'
      },
      {
        timestamp: 20,
        speaker: 'prospect',
        text: "Hi Jason. Honestly, it's been challenging. We're using different systems at each location, and getting consolidated reports is a nightmare. We spend hours every week just trying to get basic metrics.",
        sentiment: 'negative',
        keywords: ['challenging', 'different systems', 'nightmare', 'hours']
      },
      {
        timestamp: 42,
        speaker: 'rep',
        text: "That's exactly why multi-location practices are moving to cloud-based solutions. CloudDent would unify all three locations in real-time. You'd have instant access to consolidated reports, patient records, and scheduling across all sites. What specific metrics are most important for your practice?",
        sentiment: 'positive'
      },
      {
        timestamp: 68,
        speaker: 'prospect',
        text: "Production per provider, case acceptance rates, and patient retention. Also, insurance verification is killing us - my staff spends half their day on hold with insurance companies.",
        sentiment: 'negative',
        keywords: ['production', 'case acceptance', 'insurance verification']
      },
      {
        timestamp: 88,
        speaker: 'rep',
        text: "Those are critical metrics. CloudDent provides real-time dashboards for all of those, plus our AI-powered insurance verification cuts verification time by 75%. We integrate with all major insurers and can batch-verify overnight. Most practices save 15-20 hours per week on admin tasks alone.",
        sentiment: 'positive'
      },
      {
        timestamp: 115,
        speaker: 'prospect',
        text: "That sounds amazing. What about patient communication? We're still calling for appointment reminders.",
        sentiment: 'neutral',
        keywords: ['patient communication', 'appointment reminders']
      },
      {
        timestamp: 130,
        speaker: 'rep',
        text: "Our automated communication suite handles all of that - texts, emails, even voice calls. Customizable by patient preference. Plus, patients can confirm, reschedule, or cancel directly from the message. This typically reduces no-shows by 40% and frees up your front desk completely.",
        sentiment: 'positive'
      },
      {
        timestamp: 155,
        speaker: 'prospect',
        text: "I like what I'm hearing. What's involved in switching over? I can't afford downtime with three locations.",
        sentiment: 'positive',
        keywords: ['switching over', 'downtime', 'three locations']
      },
      {
        timestamp: 172,
        speaker: 'rep',
        text: "Great question. We have a proven migration process that ensures zero downtime. We transfer all your data over a weekend, train your staff in phases, and provide on-site support for the first week at each location. Most practices are fully operational by Monday morning.",
        sentiment: 'positive'
      },
      {
        timestamp: 198,
        speaker: 'prospect',
        text: "That's reassuring. Let's talk numbers. What's the investment for three locations?",
        sentiment: 'neutral',
        keywords: ['investment', 'three locations']
      },
      {
        timestamp: 212,
        speaker: 'rep',
        text: "For three locations with full features, it's typically $2,800 per month. However, I can offer our multi-location discount bringing it to $2,200 monthly. This includes all updates, support, and unlimited users. Compared to your current three separate systems, you'll likely save money while gaining functionality.",
        sentiment: 'positive'
      },
      {
        timestamp: 240,
        speaker: 'prospect',
        text: "We're paying about $2,500 now for inferior systems. But I need to ensure the ROI justifies the switch. What kind of results do similar practices see?",
        sentiment: 'neutral',
        keywords: ['ROI', 'results', 'similar practices']
      },
      {
        timestamp: 260,
        speaker: 'rep',
        text: "Dr. Martinez with five locations saw 23% production increase in six months, mainly from better case presentation tools and reduced admin time. Dr. Thompson's three locations saved $180,000 annually through better insurance processing and reduced no-shows. I can connect you with them for references.",
        sentiment: 'positive'
      },
      {
        timestamp: 288,
        speaker: 'prospect',
        text: "Those are impressive numbers. What if we started with one location as a pilot?",
        sentiment: 'neutral',
        keywords: ['pilot', 'one location']
      },
      {
        timestamp: 302,
        speaker: 'rep',
        text: "We could do that, but honestly, the magic happens when all locations are connected. How about this - we'll guarantee your ROI. If you don't see at least 15% improvement in collections within 6 months, we'll refund three months of service. Plus, I'll include our Premium Analytics package free for the first year.",
        sentiment: 'positive'
      },
      {
        timestamp: 335,
        speaker: 'prospect',
        text: "That's a strong guarantee. Can you also include training for my new office manager?",
        sentiment: 'positive',
        keywords: ['guarantee', 'training', 'office manager']
      },
      {
        timestamp: 350,
        speaker: 'rep',
        text: "Absolutely. We'll provide dedicated admin training plus access to our monthly webinar series. Your office manager will become a CloudDent expert. Should we move forward with all three locations?",
        sentiment: 'positive'
      },
      {
        timestamp: 370,
        speaker: 'prospect',
        text: "Yes, let's do it. The guarantee gives me confidence, and we need to modernize. When can we start?",
        sentiment: 'positive',
        keywords: ['yes', 'modernize', 'start']
      },
      {
        timestamp: 385,
        speaker: 'rep',
        text: "Excellent decision, Dr. Williams! I'll have our implementation team contact you within 24 hours to schedule the migration. We can have you fully operational within 3 weeks. You're going to love how this transforms your practice operations.",
        sentiment: 'positive'
      }
    ],
    analytics: {
      sentiment: 'positive',
      talkRatio: { rep: 58, prospect: 42 },
      keyTopics: ['Multi-location management', 'ROI guarantee', 'Insurance automation', 'Zero downtime migration'],
      objections: ['Switching concerns', 'Downtime fears', 'ROI justification', 'Pilot preference'],
      nextSteps: ['Implementation team contact in 24 hours', 'Migration in 3 weeks', 'Include premium analytics'],
      coachingTips: [
        'Excellent ROI guarantee to close deal',
        'Good use of peer references',
        'Strong handling of pilot program objection',
        'Identified and solved major pain points'
      ]
    }
  }
];