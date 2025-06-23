// Aesthetic Sales Call Scenarios - Realistic conversations for demo mode

import { DemoCall } from './dentalCalls';

export const aestheticCalls: DemoCall[] = [
  {
    id: 'demo-aesthetic-1',
    title: 'Dr. Maria Martinez - Laser Equipment Presentation',
    contact: {
      name: 'Dr. Maria Martinez',
      practice: 'Radiance Medical Spa',
      phone: '555-0234'
    },
    date: '2024-01-19',
    duration: 1087, // 18:07
    outcome: 'follow-up',
    industry: 'aesthetic',
    tags: ['Laser Equipment', 'High Interest', 'Technical Demo', 'Premium'],
    valueScore: 82,
    transcript: [
      {
        timestamp: 0,
        speaker: 'rep',
        text: "Good morning Dr. Martinez, this is Sophie from AestheticPro Systems. I'm following up on your inquiry about the new Harmony XL Pro laser platform. I understand you're looking to expand your treatment offerings?",
        sentiment: 'positive'
      },
      {
        timestamp: 18,
        speaker: 'prospect',
        text: "Hi Sophie, yes! We're seeing huge demand for combination treatments - skin resurfacing with IPL, especially for melasma and sun damage. Our current laser is limited.",
        sentiment: 'positive',
        keywords: ['combination treatments', 'melasma', 'sun damage']
      },
      {
        timestamp: 38,
        speaker: 'rep',
        text: "Perfect timing then. The Harmony XL Pro is specifically designed for combination therapies. It has 7 different handpieces including our advanced IPL with 10 different filters, Q-switched laser, and our new fractional erbium. You can perform over 65 FDA-cleared treatments with one platform.",
        sentiment: 'positive'
      },
      {
        timestamp: 65,
        speaker: 'prospect',
        text: "That's impressive. We're particularly interested in treating darker skin types safely. That's been a challenge with our current system.",
        sentiment: 'neutral',
        keywords: ['darker skin types', 'safely', 'challenge']
      },
      {
        timestamp: 82,
        speaker: 'rep',
        text: "Absolutely crucial for any modern practice. The Harmony XL Pro has specific protocols for Fitzpatrick types IV-VI, with built-in skin reading technology that automatically adjusts parameters. We've had zero adverse events in over 50,000 treatments on darker skin types.",
        sentiment: 'positive'
      },
      {
        timestamp: 108,
        speaker: 'prospect',
        text: "That's exactly what we need. What about training? I have two new nurse practitioners starting next month.",
        sentiment: 'positive',
        keywords: ['training', 'nurse practitioners']
      },
      {
        timestamp: 125,
        speaker: 'rep',
        text: "We provide comprehensive clinical training - 3 days on-site, plus access to our online university with over 200 hours of content. Your NPs will get certified on each modality. Plus, we offer quarterly advanced technique workshops. Dr. Chen from Glow Aesthetics just had her team certified and they're already seeing amazing results.",
        sentiment: 'positive'
      },
      {
        timestamp: 155,
        speaker: 'prospect',
        text: "Dr. Chen is a friend - she raves about your support. Now, let's discuss investment. What are we looking at?",
        sentiment: 'positive',
        keywords: ['investment', 'Dr. Chen']
      },
      {
        timestamp: 172,
        speaker: 'rep',
        text: "The complete Harmony XL Pro with all 7 handpieces and your choice of treatment protocols is $165,000. However, we're offering a special this month - $145,000 with an additional fractional handpiece included, that's a $20,000 value. Most practices see ROI within 8-10 months.",
        sentiment: 'positive'
      },
      {
        timestamp: 200,
        speaker: 'prospect',
        text: "That's a significant investment. What financing options do you offer? We prefer to maintain cash reserves.",
        sentiment: 'neutral',
        keywords: ['financing options', 'cash reserves']
      },
      {
        timestamp: 218,
        speaker: 'rep',
        text: "Smart thinking. We have several options - most popular is our 60-month lease at $2,650 monthly with $1 buyout. We also have 0% financing for 18 months if you prefer. With average treatment prices, you'd cover the lease with just 12-15 treatments monthly.",
        sentiment: 'positive'
      },
      {
        timestamp: 245,
        speaker: 'prospect',
        text: "The lease sounds reasonable. Can we see the system in action? I'd like my medical director to evaluate it too.",
        sentiment: 'positive',
        keywords: ['see in action', 'medical director']
      },
      {
        timestamp: 262,
        speaker: 'rep',
        text: "Absolutely! I can arrange a demo at our Miami showroom next Tuesday or Thursday. You'll see live treatments, meet our clinical team, and your medical director can hands-on test each modality. We'll even treat a few of your staff members so they can experience results firsthand.",
        sentiment: 'positive'
      },
      {
        timestamp: 290,
        speaker: 'prospect',
        text: "Thursday works better for us. Can we bring 3 team members?",
        sentiment: 'positive'
      },
      {
        timestamp: 302,
        speaker: 'rep',
        text: "Perfect! Bring your whole team. I'll reserve Thursday from 10 AM to 2 PM, includes lunch and complete clinical demonstration. I'll also prepare a customized ROI analysis based on your specific treatment menu and pricing. This is going to revolutionize your practice!",
        sentiment: 'positive'
      },
      {
        timestamp: 328,
        speaker: 'prospect',
        text: "Excellent. Send me the details and the ROI analysis beforehand so we can review. Looking forward to Thursday!",
        sentiment: 'positive',
        keywords: ['ROI analysis', 'Thursday']
      }
    ],
    analytics: {
      sentiment: 'positive',
      talkRatio: { rep: 62, prospect: 38 },
      keyTopics: ['Harmony XL Pro', 'Darker skin safety', 'Combination treatments', 'ROI analysis', 'Live demo'],
      objections: ['High investment cost', 'Cash flow concerns', 'Need hands-on demo'],
      nextSteps: ['Thursday demo at Miami showroom', 'Prepare ROI analysis', 'Include medical director'],
      coachingTips: [
        'Great job addressing skin type safety concerns',
        'Effective use of peer reference (Dr. Chen)',
        'Smart to offer hands-on demo with team',
        'Could have mentioned competitive advantages earlier'
      ]
    }
  },
  {
    id: 'demo-aesthetic-2',
    title: 'Dr. Robert Thompson - Dermal Filler Product Line',
    contact: {
      name: 'Dr. Robert Thompson',
      practice: 'Thompson Aesthetic Medicine',
      phone: '555-0567'
    },
    date: '2024-01-18',
    duration: 745, // 12:25
    outcome: 'objection',
    industry: 'aesthetic',
    tags: ['Dermal Fillers', 'Price Objection', 'Product Line', 'Competition'],
    valueScore: 65,
    transcript: [
      {
        timestamp: 0,
        speaker: 'rep',
        text: "Dr. Thompson, this is Rachel from BeautyMed Direct. Thank you for your interest in our RejuvaFill product line. I see you're currently using multiple filler brands - how's that working for your practice?",
        sentiment: 'neutral'
      },
      {
        timestamp: 18,
        speaker: 'prospect',
        text: "Hi Rachel. It's okay, but managing inventory from different suppliers is complicated. However, I'm concerned about switching everything to one brand. What if there are supply issues?",
        sentiment: 'negative',
        keywords: ['inventory', 'complicated', 'supply issues']
      },
      {
        timestamp: 38,
        speaker: 'rep',
        text: "Valid concern. That's why we maintain 6-month inventory reserves in three US warehouses. We've never had a stockout in 8 years. Plus, consolidating to RejuvaFill gives you 20% volume discounts and simplified ordering. What specific fillers are you using most?",
        sentiment: 'positive'
      },
      {
        timestamp: 62,
        speaker: 'prospect',
        text: "Mainly HA fillers for lips and cheeks, some calcium hydroxylapatite for deeper volumizing. We go through about 200 syringes monthly.",
        sentiment: 'neutral',
        keywords: ['HA fillers', '200 syringes', 'volumizing']
      },
      {
        timestamp: 80,
        speaker: 'rep',
        text: "Perfect volume for our Platinum tier. RejuvaFill HA line covers all those applications with 5 different formulations. At 200 syringes monthly, you'd save approximately $18,000 annually compared to buying from multiple vendors. Plus, our loyalty program adds another 5% back in credits.",
        sentiment: 'positive'
      },
      {
        timestamp: 108,
        speaker: 'prospect',
        text: "The savings sound good, but I'm worried about product quality. My patients are used to premium brands. How does RejuvaFill compare?",
        sentiment: 'negative',
        keywords: ['product quality', 'premium brands', 'compare']
      },
      {
        timestamp: 128,
        speaker: 'rep',
        text: "RejuvaFill is manufactured in the same Swiss facilities as the top brands, with identical quality standards. We have clinical studies showing 18-month longevity, comparable to the market leaders. Dr. Stevens at Premier Aesthetics switched last year and patient satisfaction actually increased.",
        sentiment: 'positive'
      },
      {
        timestamp: 155,
        speaker: 'prospect',
        text: "I know Dr. Stevens. Still, my patients specifically ask for certain brands. How do I handle that?",
        sentiment: 'negative',
        keywords: ['patients ask', 'certain brands']
      },
      {
        timestamp: 172,
        speaker: 'rep',
        text: "We provide marketing materials that focus on results rather than brands. Our 'Results First' campaign helps educate patients. Plus, when they see the same beautiful outcomes at 15% less cost, they're typically very happy. We also offer sample syringes for you to test.",
        sentiment: 'positive'
      },
      {
        timestamp: 198,
        speaker: 'prospect',
        text: "What about training? Some of these premium brands offer excellent injection workshops.",
        sentiment: 'neutral',
        keywords: ['training', 'injection workshops']
      },
      {
        timestamp: 212,
        speaker: 'rep',
        text: "We partner with the Aesthetic Training Institute for monthly masterclasses. As a Platinum member, you get 4 free seats annually, plus access to our online technique library. We also bring in celebrity injectors quarterly for advanced training.",
        sentiment: 'positive'
      },
      {
        timestamp: 238,
        speaker: 'prospect',
        text: "The training sounds comprehensive. Let's talk specific pricing. What exactly would I pay per syringe?",
        sentiment: 'neutral',
        keywords: ['pricing', 'per syringe']
      },
      {
        timestamp: 255,
        speaker: 'rep',
        text: "At your volume, RejuvaFill HA is $165 per syringe, compared to the $210-230 you're likely paying now. The calcium hydroxylapatite equivalent is $195. With your monthly volume, that's over $1,500 in monthly savings, not including the loyalty rewards.",
        sentiment: 'positive'
      },
      {
        timestamp: 282,
        speaker: 'prospect',
        text: "Those prices are attractive, but I need to think about this. Changing suppliers is a big decision, and I have contracts with some current vendors.",
        sentiment: 'negative',
        keywords: ['think about this', 'contracts', 'big decision']
      },
      {
        timestamp: 302,
        speaker: 'rep',
        text: "I understand completely. How about we start with a trial? Order 50 syringes at the Platinum pricing, test them with your team, see the results. We also have a contract buyout program that might help with your current obligations. When do your current contracts expire?",
        sentiment: 'positive'
      },
      {
        timestamp: 330,
        speaker: 'prospect',
        text: "Most expire in 3-4 months. The trial sounds reasonable, but I need to discuss with my partners first. Can you send me detailed information?",
        sentiment: 'neutral',
        keywords: ['3-4 months', 'trial', 'partners']
      },
      {
        timestamp: 350,
        speaker: 'rep',
        text: "Absolutely. I'll send a complete proposal including the trial offer, pricing comparison, and contract buyout details. Would it make sense to schedule a follow-up call next week after you've reviewed with your partners?",
        sentiment: 'positive'
      },
      {
        timestamp: 370,
        speaker: 'prospect',
        text: "Yes, let's do that. Tuesday afternoon would work.",
        sentiment: 'neutral'
      }
    ],
    analytics: {
      sentiment: 'neutral',
      talkRatio: { rep: 64, prospect: 36 },
      keyTopics: ['Dermal fillers', 'Volume discounts', 'Brand loyalty', 'Contract obligations'],
      objections: ['Brand recognition concerns', 'Quality worries', 'Existing contracts', 'Partner approval needed'],
      nextSteps: ['Send detailed proposal', 'Schedule Tuesday follow-up', 'Include trial offer details'],
      coachingTips: [
        'Good attempt at trial close',
        'Contract buyout program was smart',
        'Should have addressed brand concerns more strongly',
        'Consider bringing up patient financing options'
      ]
    }
  },
  {
    id: 'demo-aesthetic-3',
    title: 'Dr. Jennifer Anderson - Medical Spa Equipment Bundle',
    contact: {
      name: 'Dr. Jennifer Anderson',
      practice: 'Luxe Medical Aesthetics',
      phone: '555-0890'
    },
    date: '2024-01-17',
    duration: 1523, // 25:23
    outcome: 'closed',
    industry: 'aesthetic',
    tags: ['Equipment Bundle', 'New Practice', 'Complete Package', 'High Value'],
    valueScore: 92,
    transcript: [
      {
        timestamp: 0,
        speaker: 'rep',
        text: "Good afternoon Dr. Anderson, this is David from MedSpa Solutions. Congratulations on your new practice opening! I understand you're looking for a complete equipment package to launch your aesthetic services?",
        sentiment: 'positive'
      },
      {
        timestamp: 18,
        speaker: 'prospect',
        text: "Hi David, yes! We're opening in 6 weeks and need everything - lasers, body contouring, injectables setup. I want to offer comprehensive services from day one.",
        sentiment: 'positive',
        keywords: ['opening in 6 weeks', 'everything', 'comprehensive services']
      },
      {
        timestamp: 38,
        speaker: 'rep',
        text: "Exciting times! Based on your practice size and target demographics, I've put together our Elite Startup Package. This includes our top 5 revenue-generating technologies: IPL photofacial, fractional CO2 laser, CoolSculpting unit, Ultherapy system, and HydraFacial MD. This combination covers 90% of aesthetic treatment requests.",
        sentiment: 'positive'
      },
      {
        timestamp: 68,
        speaker: 'prospect',
        text: "That sounds comprehensive. I'm particularly interested in body contouring - it's huge in our area. Tell me more about the CoolSculpting system.",
        sentiment: 'positive',
        keywords: ['body contouring', 'CoolSculpting', 'huge in our area']
      },
      {
        timestamp: 85,
        speaker: 'rep',
        text: "Great choice! The CoolSculpting Elite has the new C-shaped applicators that treat areas 18% faster with better comfort. Most practices charge $750-1000 per area and see 20-30 treatments monthly. With our package, you get 8 applicators covering all body areas. That's typically a $280,000 value.",
        sentiment: 'positive'
      },
      {
        timestamp: 115,
        speaker: 'prospect',
        text: "Impressive. What about the newest technologies? I want to position as the most advanced practice in the area.",
        sentiment: 'positive',
        keywords: ['newest technologies', 'most advanced']
      },
      {
        timestamp: 132,
        speaker: 'rep',
        text: "You're thinking exactly right. That's why I included Ultherapy - the only FDA-cleared ultrasound lifting treatment. And the new HydraFacial Syndeo device with RFID-tagged tips and digital tracking. These position you as cutting-edge. Your competitors are probably still using 5-year-old technology.",
        sentiment: 'positive'
      },
      {
        timestamp: 162,
        speaker: 'prospect',
        text: "Perfect. Now, the big question - what's the total investment? And do you offer practice startup support?",
        sentiment: 'neutral',
        keywords: ['total investment', 'startup support']
      },
      {
        timestamp: 178,
        speaker: 'rep',
        text: "The complete Elite Package retail value is $485,000. However, for new practices, we offer it at $385,000 - that's $100,000 in savings. But here's the real value: we include our Practice Launch Program - marketing materials, staff training, treatment protocols, and a practice consultant for your first 90 days.",
        sentiment: 'positive'
      },
      {
        timestamp: 210,
        speaker: 'prospect',
        text: "That's still a significant investment. What financing options are available?",
        sentiment: 'neutral',
        keywords: ['financing options']
      },
      {
        timestamp: 225,
        speaker: 'rep',
        text: "We have excellent options. Most new practices choose our 72-month lease at $6,200 monthly. But here's what's powerful - based on average treatment prices, you'll generate $15,000-20,000 monthly revenue from day one. The equipment essentially pays for itself while you profit.",
        sentiment: 'positive'
      },
      {
        timestamp: 255,
        speaker: 'prospect',
        text: "Those projections seem optimistic. How can you be sure?",
        sentiment: 'negative',
        keywords: ['optimistic', 'how can you be sure']
      },
      {
        timestamp: 270,
        speaker: 'rep',
        text: "Fair question. These are based on our 200+ practice launches. Dr. Kim opened Bella Aesthetics last year with this exact package - she hit $65,000 revenue in month one, now averaging $125,000 monthly. I can connect you with her and three other recent launches for real numbers.",
        sentiment: 'positive'
      },
      {
        timestamp: 300,
        speaker: 'prospect',
        text: "That would be helpful. What about installation and training timing? We need everything operational before our grand opening.",
        sentiment: 'positive',
        keywords: ['installation', 'training timing', 'grand opening']
      },
      {
        timestamp: 320,
        speaker: 'rep',
        text: "We'll coordinate everything. Installation takes 3 days, then intensive staff training over 5 days. We'll have you fully operational 2 weeks before opening. Plus, we'll send a clinical specialist for your first week to ensure smooth operations. No detail is left to chance.",
        sentiment: 'positive'
      },
      {
        timestamp: 348,
        speaker: 'prospect',
        text: "That's reassuring. Can we add microneedling with RF? I've had several inquiries already.",
        sentiment: 'positive',
        keywords: ['microneedling with RF', 'inquiries']
      },
      {
        timestamp: 365,
        speaker: 'rep',
        text: "Absolutely! I'll include our Morpheus8 system at a 25% package discount - normally $45,000, you'd get it for $33,750. This brings your total to $418,750, or about $6,700 monthly on the lease. Still incredible value for a complete practice setup.",
        sentiment: 'positive'
      },
      {
        timestamp: 392,
        speaker: 'prospect',
        text: "I like the complete package approach. What guarantees do you offer?",
        sentiment: 'positive',
        keywords: ['guarantees']
      },
      {
        timestamp: 408,
        speaker: 'rep',
        text: "Every device has a 3-year warranty with 24/7 support. But more importantly, we guarantee your success - if you don't hit $50,000 monthly revenue within 6 months, we provide additional marketing support and training at no cost until you do. We're invested in your success.",
        sentiment: 'positive'
      },
      {
        timestamp: 438,
        speaker: 'prospect',
        text: "That's a strong commitment. I'm ready to move forward. What's needed to secure this package and timeline?",
        sentiment: 'positive',
        keywords: ['ready to move forward']
      },
      {
        timestamp: 455,
        speaker: 'rep',
        text: "Fantastic decision, Dr. Anderson! To secure your installation date and package pricing, we need a signed agreement and first month's lease payment. I'll have everything prepared and sent within 2 hours. Our team will contact you tomorrow to begin planning your installation. You're about to have the most advanced aesthetic practice in your market!",
        sentiment: 'positive'
      },
      {
        timestamp: 488,
        speaker: 'prospect',
        text: "Perfect. Include the reference contacts you mentioned. I'm excited to get started!",
        sentiment: 'positive'
      }
    ],
    analytics: {
      sentiment: 'positive',
      talkRatio: { rep: 68, prospect: 32 },
      keyTopics: ['Complete equipment package', 'New practice launch', 'Revenue projections', 'Success guarantee'],
      objections: ['High investment amount', 'Revenue projection skepticism', 'Timeline concerns'],
      nextSteps: ['Send agreement within 2 hours', 'Installation planning tomorrow', 'Include reference contacts'],
      coachingTips: [
        'Excellent package bundling strategy',
        'Strong ROI presentation with real examples',
        'Success guarantee was key differentiator',
        'Good upsell on Morpheus8 addition'
      ]
    }
  }
];