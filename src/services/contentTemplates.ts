// Content Templates - Socratic & Challenger Sales Methodology
// Pre-built templates for generating AI-powered sales content

export const SOCRATIC_CHALLENGER_TEMPLATES = [
  {
    template_name: 'Socratic Discovery Email',
    content_type: 'socratic_discovery',
    industry_focus: 'general',
    procedure_tags: ['botox', 'dental_implants', 'invisalign', 'restylane'],
    template_structure: {
      components: ['provocative_question', 'industry_insight', 'guided_questions', 'soft_cta'],
      methodology: 'socratic_method',
      style: 'question_driven'
    },
    ai_prompts: {
      system_prompt: `You are an expert sales consultant specializing in Socratic questioning and the Challenger Sales methodology. Your role is to create thought-provoking emails that challenge prospects' assumptions and guide them to new insights about their practice.

Key Principles:
1. NEVER pitch products directly - instead, challenge thinking
2. Use Socratic questioning to guide discovery
3. Present industry insights that contradict conventional wisdom
4. Ask questions that make prospects question their current approach
5. Lead with customer problems, not solutions
6. Use data and insights to reframe their thinking

Tone: Professional yet provocative, educational but challenging
Structure: Hook question → Industry insight → Guided questions → Soft call-to-action`,

      user_prompt_template: `Create a Socratic discovery email for {{PRACTICE_NAME}} ({{SPECIALTY}} practice) targeting {{PROCEDURES}}.

Practice Context:
- Practice Name: {{PRACTICE_NAME}}
- Provider: {{PROVIDER_NAME}}  
- Specialty: {{SPECIALTY}}
- Practice Size: {{PRACTICE_SIZE}}
- Target Procedures: {{PROCEDURES}}

Content Requirements:
- Start with a provocative question about their current approach
- Present a counterintuitive industry insight
- Include 2-3 Socratic questions that challenge their assumptions
- End with a curiosity-driven call-to-action
- Tone: {{TONE}}
- Focus Benefits: {{KEY_BENEFITS}}

Market Intelligence to Incorporate:
{{MARKET_DATA}}

Generate the email in this JSON format:
{
  "subject_line": "A thought-provoking question-based subject",
  "content_body": "The main email content using Socratic method",
  "call_to_action": "Curiosity-driven CTA that doesn't pitch",
  "methodology_notes": "How this uses Socratic principles"
}`,

      customization_variables: [
        'PRACTICE_NAME', 'PROVIDER_NAME', 'SPECIALTY', 'PRACTICE_SIZE', 
        'PROCEDURES', 'TONE', 'KEY_BENEFITS', 'MARKET_DATA'
      ]
    }
  },

  {
    template_name: 'Challenger Insight Email',
    content_type: 'challenger_insight',
    industry_focus: 'general',
    procedure_tags: ['all_procedures'],
    template_structure: {
      components: ['reframe', 'insight', 'evidence', 'implication', 'next_step'],
      methodology: 'challenger_sales',
      style: 'insight_driven'
    },
    ai_prompts: {
      system_prompt: `You are a Challenger Sales expert creating emails that reframe how prospects think about their business. Your goal is to teach prospects something new about their industry, challenge their status quo, and lead them to a new way of thinking.

Challenger Sales Framework:
1. REFRAME their thinking with a bold, contrarian insight
2. Present EVIDENCE that supports this new perspective  
3. Show the IMPLICATIONS of not changing
4. Guide them toward a NEW SOLUTION PATH

Core Principles:
- Lead with insight, not product features
- Challenge their comfortable assumptions
- Use data to support contrarian viewpoints
- Create constructive tension
- Position yourself as a trusted advisor who thinks differently

Structure: Bold reframe → Supporting evidence → Cost of inaction → Guided next step`,

      user_prompt_template: `Create a Challenger Sales insight email for {{PRACTICE_NAME}} challenging their approach to {{FOCUS_PROCEDURES}}.

Practice Details:
- Practice: {{PRACTICE_NAME}} ({{PROVIDER_NAME}})
- Specialty: {{SPECIALTY}} 
- Size: {{PRACTICE_SIZE}}
- Current Focus: {{PROCEDURES}}
- Target Benefits: {{KEY_BENEFITS}}

Challenger Framework:
1. Start with a bold, contrarian insight about their industry
2. Present evidence from market data that challenges conventional thinking
3. Show the cost of maintaining status quo
4. Guide toward a new approach without pitching products

Tone: {{TONE}} - be provocative but respectful
Call-to-Action: {{CTA_TYPE}}

Market Intelligence:
{{MARKET_DATA}}

Generate in JSON format:
{
  "subject_line": "Bold, contrarian subject that challenges thinking",
  "content_body": "Email using Challenger Sales reframe methodology",
  "call_to_action": "CTA that advances the conversation without pitching",
  "challenger_elements": {
    "reframe": "The contrarian insight presented",
    "evidence": "Supporting data and proof points",
    "implications": "Cost of not changing"
  }
}`,

      customization_variables: [
        'PRACTICE_NAME', 'PROVIDER_NAME', 'SPECIALTY', 'PRACTICE_SIZE',
        'PROCEDURES', 'FOCUS_PROCEDURES', 'KEY_BENEFITS', 'TONE', 'CTA_TYPE', 'MARKET_DATA'
      ]
    }
  },

  {
    template_name: 'Teaching Email Sequence',
    content_type: 'teaching_sequence',
    industry_focus: 'general', 
    procedure_tags: ['educational_series'],
    template_structure: {
      components: ['lesson_hook', 'core_teaching', 'application', 'next_lesson'],
      methodology: 'teaching_selling',
      style: 'educational_challenger'
    },
    ai_prompts: {
      system_prompt: `You are creating educational content that teaches prospects new ways of thinking about their business while subtly challenging their current approach. This is part of a "teaching selling" methodology that establishes expertise through education.

Teaching Principles:
1. TEACH first, sell second (or never)
2. Challenge conventional wisdom through education
3. Use stories and examples to illustrate points
4. Build credibility through insights
5. Create "aha moments" that shift perspective

Educational Framework:
- Hook: Surprising fact or contrarian statement
- Teach: New perspective with supporting evidence  
- Apply: How this applies to their specific situation
- Advance: Natural next step in learning journey`,

      user_prompt_template: `Create an educational email that teaches {{PRACTICE_NAME}} a new perspective on {{FOCUS_PROCEDURES}} while challenging their current thinking.

Practice Context:
- Practice: {{PRACTICE_NAME}} ({{PROVIDER_NAME}})
- Focus Area: {{SPECIALTY}} - {{PROCEDURES}}
- Educational Goal: Challenge thinking about {{FOCUS_PROCEDURES}}
- Tone: {{TONE}} (educational but thought-provoking)

Educational Framework:
1. Start with a surprising industry fact that challenges assumptions
2. Teach a new perspective using data and examples
3. Apply this insight to their specific practice type
4. End with a natural next learning step

Key Benefits to Weave In: {{KEY_BENEFITS}}
Market Data to Reference: {{MARKET_DATA}}

Generate as JSON:
{
  "subject_line": "Educational subject that promises insight",
  "content_body": "Teaching-focused email that challenges through education",
  "call_to_action": "Next step in educational journey",
  "teaching_elements": {
    "core_insight": "Main teaching point",
    "supporting_evidence": "Data and examples",
    "application": "How it applies to their practice"
  }
}`,

      customization_variables: [
        'PRACTICE_NAME', 'PROVIDER_NAME', 'SPECIALTY', 'PROCEDURES', 
        'FOCUS_PROCEDURES', 'KEY_BENEFITS', 'TONE', 'MARKET_DATA'
      ]
    }
  },

  {
    template_name: 'Provocative Demo Script',
    content_type: 'provocative_demo',
    industry_focus: 'general',
    procedure_tags: ['demo_presentation'],
    template_structure: {
      components: ['assumption_challenge', 'insight_demo', 'interactive_questions', 'reframe_close'],
      methodology: 'challenger_sales',
      style: 'interactive_challenge'
    },
    ai_prompts: {
      system_prompt: `Create a demo script that uses Challenger Sales principles to challenge prospects' assumptions during product demonstrations. The goal is to reframe their thinking while showcasing capabilities.

Demo Structure:
1. CHALLENGE their current approach before showing solutions
2. Use INTERACTIVE QUESTIONS throughout the demo
3. Present features as responses to their challenged assumptions
4. Create TENSION about their status quo
5. REFRAME their criteria for making decisions

Key Techniques:
- Ask questions that expose flaws in current thinking
- Use "What if..." scenarios to open new possibilities
- Challenge their decision criteria
- Make them question their assumptions
- Lead them to new insights about their needs`,

      user_prompt_template: `Create a provocative demo script for {{PRACTICE_NAME}} that challenges their approach to {{FOCUS_PROCEDURES}} while demonstrating solutions.

Demo Context:
- Practice: {{PRACTICE_NAME}} ({{PROVIDER_NAME}})
- Focus: {{SPECIALTY}} procedures, specifically {{PROCEDURES}}
- Audience: {{PRACTICE_SIZE}} practice decision makers
- Demo Goal: Challenge current approach to {{FOCUS_PROCEDURES}}

Demo Strategy:
1. Open by challenging their current method
2. Use interactive questions throughout
3. Reframe their evaluation criteria  
4. Show how solutions address newly identified needs
5. Close with commitment to new thinking

Tone: {{TONE}} - confident but collaborative
Benefits to Highlight: {{KEY_BENEFITS}}

Generate as JSON:
{
  "content_body": "Full demo script with Challenger methodology",
  "talking_points": ["Key challenging questions to ask", "Assumption challenges", "Reframing statements"],
  "call_to_action": "Next step that advances challenged thinking",
  "demo_elements": {
    "opening_challenge": "How you challenge their status quo",
    "interactive_questions": ["Questions to ask during demo"],
    "reframe_close": "How you reframe their decision criteria"
  }
}`,

      customization_variables: [
        'PRACTICE_NAME', 'PROVIDER_NAME', 'SPECIALTY', 'PRACTICE_SIZE',
        'PROCEDURES', 'FOCUS_PROCEDURES', 'KEY_BENEFITS', 'TONE'
      ]
    }
  },

  {
    template_name: 'Insight-Based Objection Handling',
    content_type: 'insight_objection',
    industry_focus: 'general',
    procedure_tags: ['objection_responses'],
    template_structure: {
      components: ['acknowledge', 'reframe_question', 'insight_response', 'evidence', 'advance'],
      methodology: 'challenger_sales',
      style: 'reframe_response'
    },
    ai_prompts: {
      system_prompt: `Create objection handling responses that use Challenger Sales methodology to reframe objections as opportunities to teach and challenge thinking.

Objection Handling Framework:
1. ACKNOWLEDGE the concern (don't dismiss)
2. REFRAME with a challenging question
3. PROVIDE INSIGHT that shifts perspective
4. OFFER EVIDENCE that supports new thinking
5. ADVANCE the conversation forward

Key Principles:
- Don't defend - reframe the conversation
- Use objections as teaching moments
- Challenge the assumption behind the objection
- Provide contrarian insights
- Lead them to question their own objection`,

      user_prompt_template: `Create objection handling responses for {{PRACTICE_NAME}} that reframe common concerns about {{FOCUS_PROCEDURES}} using Challenger methodology.

Context:
- Practice: {{PRACTICE_NAME}} ({{SPECIALTY}})
- Common Concerns: Budget, timing, effectiveness, competition
- Focus Areas: {{PROCEDURES}}
- Goal: Reframe objections as opportunities to challenge thinking

Response Strategy:
1. Acknowledge their concern respectfully
2. Ask a challenging question that reframes the issue
3. Provide insight that shifts their perspective
4. Support with evidence/data
5. Advance to next step

Tone: {{TONE}} - respectful but challenging
Key Benefits: {{KEY_BENEFITS}}

Generate as JSON:
{
  "content_body": "Overview of objection handling approach",
  "objection_responses": {
    "price_objection": "Response that reframes cost concerns",
    "timing_objection": "Response that challenges timing assumptions", 
    "effectiveness_objection": "Response that reframes effectiveness criteria",
    "competition_objection": "Response that challenges comparison methodology"
  },
  "call_to_action": "How to advance after handling objections",
  "reframe_principles": "Key reframing techniques used"
}`,

      customization_variables: [
        'PRACTICE_NAME', 'SPECIALTY', 'PROCEDURES', 'FOCUS_PROCEDURES', 
        'KEY_BENEFITS', 'TONE'
      ]
    }
  },

  {
    template_name: 'Case Study Challenge',
    content_type: 'case_study_challenge',
    industry_focus: 'general',
    procedure_tags: ['success_stories'],
    template_structure: {
      components: ['similar_situation', 'conventional_approach', 'challenge_moment', 'new_approach', 'results'],
      methodology: 'story_selling',
      style: 'narrative_challenge'
    },
    ai_prompts: {
      system_prompt: `Create case study stories that challenge conventional thinking by showing how similar practices transformed their results by abandoning traditional approaches.

Story Structure:
1. SITUATION: Describe a similar practice with same challenges
2. CONVENTIONAL APPROACH: What they initially tried (like prospect)
3. CHALLENGE MOMENT: What made them question their approach
4. NEW APPROACH: The contrarian path they took
5. RESULTS: Unexpected outcomes from new thinking

Storytelling Principles:
- Make the story relatable to prospect's situation
- Show the cost of conventional thinking
- Highlight the "aha moment" of realization
- Focus on business outcomes, not product features
- End with a question that applies to their situation`,

      user_prompt_template: `Create a challenging case study for {{PRACTICE_NAME}} about a similar {{SPECIALTY}} practice that transformed their {{FOCUS_PROCEDURES}} approach.

Story Parameters:
- Protagonist: Similar {{PRACTICE_SIZE}} {{SPECIALTY}} practice
- Challenge: Common problem with {{PROCEDURES}}
- Conventional Approach: What most practices do
- Challenger Insight: What made them think differently
- Transformation: How they changed their approach
- Results: Measurable business outcomes

Target Audience: {{PRACTICE_NAME}} ({{PROVIDER_NAME}})
Story Purpose: Challenge their assumptions about {{FOCUS_PROCEDURES}}
Tone: {{TONE}} - inspiring but thought-provoking

Generate as JSON:
{
  "content_body": "Complete case study story using challenge methodology",
  "call_to_action": "Question that applies the story to their situation",
  "story_elements": {
    "situation": "Similar practice's starting point",
    "conventional_approach": "What they tried first",
    "challenge_moment": "What made them question their approach", 
    "new_approach": "The contrarian path they took",
    "results": "Measurable outcomes achieved"
  },
  "challenge_question": "Question that applies this story to prospect"
}`,

      customization_variables: [
        'PRACTICE_NAME', 'PROVIDER_NAME', 'SPECIALTY', 'PRACTICE_SIZE',
        'PROCEDURES', 'FOCUS_PROCEDURES', 'TONE'
      ]
    }
  }
];

// Initialize templates in database
export const initializeContentTemplates = async () => {
  const { createClient } = await import('@supabase/supabase-js');
  
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials not found');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Insert templates
    const { error } = await supabase
      .from('content_generation_templates')
      .upsert(
        SOCRATIC_CHALLENGER_TEMPLATES.map(template => ({
          ...template,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })),
        { onConflict: 'template_name' }
      );

    if (error) {
      console.error('Error inserting templates:', error);
    } else {
      console.log('Content templates initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing templates:', error);
  }
};

// Template helpers
export const getTemplateByType = (contentType: string) => {
  return SOCRATIC_CHALLENGER_TEMPLATES.find(t => t.content_type === contentType);
};

export const getTemplatesByIndustry = (industry: 'aesthetic' | 'dental' | 'general') => {
  return SOCRATIC_CHALLENGER_TEMPLATES.filter(t => 
    t.industry_focus === industry || t.industry_focus === 'general'
  );
};

export const getSocraticQuestionStarters = () => [
  "What if I told you that most practices are approaching this completely wrong?",
  "Have you ever wondered why your current method isn't delivering the results you expected?",
  "What would you say if I suggested that your biggest challenge isn't what you think it is?",
  "If you could start over, knowing what you know now, would you still choose your current approach?",
  "What assumptions about your practice might be limiting your growth?",
  "Why do you think your competitors are struggling with the same issues you are?",
  "What would need to change for you to double your results in this area?",
  "How confident are you that your current approach is the best possible solution?",
  "What evidence would convince you to completely rethink your strategy?",
  "If your most successful competitor was doing the opposite of what you're doing, what would that look like?"
];

export const getChallengerInsightFrameworks = () => [
  {
    framework: "The Hidden Cost",
    description: "Reveal unexpected costs of their current approach",
    example: "While most practices focus on upfront costs, the real expense is in the opportunity cost of patients who don't return..."
  },
  {
    framework: "The Contrarian Truth", 
    description: "Present data that contradicts conventional wisdom",
    example: "Industry data shows that practices using traditional methods are actually losing market share to..."
  },
  {
    framework: "The Competitive Blind Spot",
    description: "Show them what their competition is doing differently",
    example: "Your most successful competitors have discovered something that 73% of practices don't know..."
  },
  {
    framework: "The Future Reality",
    description: "Paint a picture of where the industry is heading",
    example: "In two years, practices that haven't adapted to this trend will find themselves..."
  },
  {
    framework: "The Status Quo Trap",
    description: "Challenge their comfort with current approaches",
    example: "The reason your current approach feels safe is exactly why it's becoming risky..."
  }
];

export default SOCRATIC_CHALLENGER_TEMPLATES;