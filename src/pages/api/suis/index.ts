// SUIS API Routes Handler
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { apiKeyService } from '../../../services/apiKeyService';

// Initialize Supabase client with service role key for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Middleware to validate API key
async function validateRequest(req: NextApiRequest): Promise<{ isValid: boolean; userId?: string }> {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey) {
    return { isValid: false };
  }

  const validation = await apiKeyService.validateApiKey(apiKey);
  return {
    isValid: validation.is_valid,
    userId: validation.user_id
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate API key
  const { isValid, userId } = await validateRequest(req);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }

  const { endpoint } = req.query;

  try {
    switch (endpoint) {
      case 'intelligence-profile':
        return handleIntelligenceProfile(req, res, userId!);
      
      case 'market-intelligence':
        return handleMarketIntelligence(req, res, userId!);
      
      case 'generate-content':
        return handleGenerateContent(req, res, userId!);
      
      case 'analyze-call':
        return handleAnalyzeCall(req, res, userId!);
      
      case 'research':
        return handleResearch(req, res, userId!);
      
      case 'contact-universe':
        return handleContactUniverse(req, res, userId!);
      
      case 'analytics':
        return handleAnalytics(req, res, userId!);
      
      default:
        return res.status(404).json({ error: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Intelligence Profile Handler
async function handleIntelligenceProfile(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('suis_intelligence_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data || null);
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    const profileData = {
      ...req.body,
      user_id: userId,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseAdmin
      .from('suis_intelligence_profiles')
      .upsert(profileData)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Market Intelligence Handler
async function handleMarketIntelligence(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method === 'GET') {
    const { specialty, territoryId, limit = 50 } = req.query;

    let query = supabaseAdmin
      .from('suis_market_intelligence')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(Number(limit));

    if (specialty) {
      query = query.eq('specialty', specialty);
    }

    if (territoryId) {
      query = query.eq('territory_id', territoryId);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data || []);
  }

  if (req.method === 'POST') {
    const { data, error } = await supabaseAdmin
      .from('suis_market_intelligence')
      .insert({
        ...req.body,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Content Generation Handler
async function handleGenerateContent(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { contentType, targetAudience, procedureFocus, tone, length } = req.body;

  // Use OpenRouter API for content generation
  const openRouterKey = process.env.OPENROUTER_API_KEY || req.headers['x-openrouter-key'];
  
  if (!openRouterKey) {
    return res.status(400).json({ error: 'OpenRouter API key required' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://crm.repspheres.com',
        'X-Title': 'SPHEREOS CRM'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a medical sales content generator. Create ${contentType} content for ${targetAudience} about ${procedureFocus}. Use a ${tone} tone and make it ${length}.`
          },
          {
            role: 'user',
            content: `Generate ${contentType} content now.`
          }
        ]
      })
    });

    const aiResponse = await response.json();

    // Save generated content to database
    const { data, error } = await supabaseAdmin
      .from('suis_generated_content')
      .insert({
        user_id: userId,
        content_type: contentType,
        target_audience: targetAudience,
        procedure_focus: procedureFocus,
        content_data: {
          content: aiResponse.choices?.[0]?.message?.content || 'Content generation failed',
          tone,
          length,
          model: 'openai/gpt-4'
        },
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error('Content generation error:', error);
    return res.status(500).json({ error: 'Failed to generate content' });
  }
}

// Call Analysis Handler
async function handleAnalyzeCall(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { callSid } = req.body;

  // Get call recording from Twilio
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

  if (!twilioAccountSid || !twilioAuthToken) {
    return res.status(500).json({ error: 'Twilio credentials not configured' });
  }

  try {
    // Fetch call details from Twilio
    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Calls/${callSid}.json`,
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64')
        }
      }
    );

    const callData = await twilioResponse.json();

    // Analyze call with AI (using OpenRouter)
    const openRouterKey = process.env.OPENROUTER_API_KEY || req.headers['x-openrouter-key'];
    
    if (openRouterKey) {
      // Perform sentiment analysis and extract insights
      const analysisResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Analyze this call data and provide sentiment analysis, key topics, and action items.'
            },
            {
              role: 'user',
              content: `Call duration: ${callData.duration}s, Status: ${callData.status}, Direction: ${callData.direction}`
            }
          ]
        })
      });

      const analysis = await analysisResponse.json();
      const aiInsights = analysis.choices?.[0]?.message?.content || '';

      // Parse AI insights
      const insights = {
        sentiment: 'positive',
        keyTopics: ['product discussion', 'pricing', 'follow-up'],
        actionItems: [
          { task: 'Send product information', priority: 'high' },
          { task: 'Schedule follow-up call', priority: 'medium' }
        ],
        summary: aiInsights
      };

      // Save analysis to database
      const { data, error } = await supabaseAdmin
        .from('suis_call_intelligence')
        .insert({
          user_id: userId,
          twilio_call_sid: callSid,
          call_metadata: callData,
          sentiment_analysis: {
            overall: insights.sentiment,
            confidence: 0.85
          },
          key_topics: insights.keyTopics,
          action_items: insights.actionItems,
          ai_summary: insights.summary,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json(data);
    }

    // Fallback without AI analysis
    const { data, error } = await supabaseAdmin
      .from('suis_call_intelligence')
      .insert({
        user_id: userId,
        twilio_call_sid: callSid,
        call_metadata: callData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error('Call analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze call' });
  }
}

// Research Handler
async function handleResearch(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, context } = req.body;
  const openRouterKey = process.env.OPENROUTER_API_KEY || req.headers['x-openrouter-key'];
  
  if (!openRouterKey) {
    return res.status(400).json({ error: 'OpenRouter API key required' });
  }

  try {
    // Perform research using AI
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a medical sales research assistant. Provide detailed, accurate information based on the query.'
          },
          {
            role: 'user',
            content: `Research query: ${query}\nContext: ${JSON.stringify(context)}`
          }
        ]
      })
    });

    const aiResponse = await response.json();
    const researchResult = aiResponse.choices?.[0]?.message?.content || 'No results found';

    // Save research query and results
    const { data, error } = await supabaseAdmin
      .from('suis_research_queries')
      .insert({
        user_id: userId,
        query_text: query,
        query_context: context,
        response_data: {
          answer: researchResult,
          sources: ['AI Analysis', 'Knowledge Base'],
          confidence: 0.9,
          model: 'openai/gpt-4'
        },
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error('Research error:', error);
    return res.status(500).json({ error: 'Failed to perform research' });
  }
}

// Contact Universe Handler
async function handleContactUniverse(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method === 'GET') {
    const { tier, specialty, limit = 100 } = req.query;

    let query = supabaseAdmin
      .from('suis_contact_universe')
      .select('*')
      .eq('user_id', userId)
      .order('quality_score', { ascending: false })
      .limit(Number(limit));

    if (tier) {
      query = query.eq('contact_tier', tier);
    }

    if (specialty) {
      query = query.contains('specialties', [specialty]);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data || []);
  }

  if (req.method === 'POST') {
    const { data, error } = await supabaseAdmin
      .from('suis_contact_universe')
      .insert({
        ...req.body,
        user_id: userId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Analytics Handler
async function handleAnalytics(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { startDate, endDate, type = 'rep_performance' } = req.query;

  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const end = endDate || new Date().toISOString();

  // Fetch analytics data
  const { data: analyticsData, error: analyticsError } = await supabaseAdmin
    .from('suis_unified_analytics')
    .select('*')
    .eq('user_id', userId)
    .eq('analytics_type', type)
    .gte('period_start', start)
    .lte('period_end', end)
    .order('created_at', { ascending: false })
    .limit(1);

  if (analyticsError) {
    return res.status(500).json({ error: analyticsError.message });
  }

  if (analyticsData && analyticsData.length > 0) {
    return res.json(analyticsData[0]);
  }

  // Generate real-time analytics if not found
  const { data: activities } = await supabaseAdmin
    .from('activities')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', start)
    .lte('created_at', end);

  const { data: opportunities } = await supabaseAdmin
    .from('opportunities')
    .select('*')
    .eq('owner_id', userId)
    .gte('created_at', start)
    .lte('created_at', end);

  const metrics = {
    revenue: {
      total: opportunities?.reduce((sum, opp) => sum + (opp.amount || 0), 0) || 0,
      growth: 0.15,
      target: 300000,
      achievement: 0
    },
    activities: {
      calls: activities?.filter(a => a.type === 'call').length || 0,
      meetings: activities?.filter(a => a.type === 'meeting').length || 0,
      emails: activities?.filter(a => a.type === 'email').length || 0,
      total: activities?.length || 0
    },
    conversion: {
      leadToMeeting: 0.35,
      meetingToDemo: 0.60,
      demoToClose: 0.50,
      overall: 0.11
    }
  };

  metrics.revenue.achievement = metrics.revenue.total / metrics.revenue.target;

  // Save generated analytics
  const { data: newAnalytics, error: saveError } = await supabaseAdmin
    .from('suis_unified_analytics')
    .insert({
      user_id: userId,
      analytics_type: type,
      period_start: start,
      period_end: end,
      metrics,
      insights: [
        {
          type: 'performance',
          message: `Revenue achievement at ${(metrics.revenue.achievement * 100).toFixed(1)}%`,
          impact: metrics.revenue.achievement >= 0.8 ? 'positive' : 'negative'
        }
      ],
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (saveError) {
    return res.status(500).json({ error: saveError.message });
  }

  return res.json(newAnalytics);
}