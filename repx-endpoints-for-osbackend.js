// Add these endpoints to your osbackend for centralized Rep^x subscription management
// File: routes/repx-subscriptions.js

import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Rep^x Plans Configuration - Single Source of Truth
const REPX_PLANS = {
  repx1: {
    name: 'RepX1 Professional Business Line',
    monthly: 39,
    annual: 390,
    priceIds: {
      monthly: 'price_1RRutVGRiAPUZqWuDMSAqHsD',
      annual: 'price_1RWMSCGRiAPUZqWu30j19b9G'
    },
    productId: 'prod_SMeBmeB7knfARi',
    features: {
      calls: 100,
      emails: 0,
      canvas_scans: 0,
      basic: [
        'Your Professional Business Line for Life',
        'AI transcription of every sales call',
        'Transcriptions sent directly to your CRM',
        'Professional/personal call separation',
        'Basic call analytics and history',
        '100 calls per month',
        'Eternal professional phone number'
      ],
      premium: []
    }
  },
  repx2: {
    name: 'RepX2 Market Intelligence',
    monthly: 97,
    annual: 970,
    priceIds: {
      monthly: 'price_1RRushGRiAPUZqWuIvqueK7h',
      annual: 'price_1RWMT4GRiAPUZqWuqiNhkZfw'
    },
    productId: 'prod_SMeBAukl5Fqeeh',
    features: {
      calls: 200,
      emails: 50,
      canvas_scans: 10,
      basic: [
        'Everything in RepX1, plus:',
        'Work email integration (no IT approval needed)',
        'Basic Market Data access (all procedures)',
        '200 calls per month',
        '50 emails per day',
        '10 Canvas practice scans per day',
        'Enhanced call analytics and insights'
      ],
      premium: []
    }
  },
  repx3: {
    name: 'RepX3 Territory Command',
    monthly: 197,
    annual: 1970,
    priceIds: {
      monthly: 'price_1RWMW3GRiAPUZqWuoTA0eLUC',
      annual: 'price_1RRus5GRiAPUZqWup3jk1S8U'
    },
    productId: 'prod_SMeAJE1MaklEQi',
    features: {
      calls: 400,
      emails: 100,
      canvas_scans: 25,
      basic: [
        'Everything in RepX2, plus:',
        'Full Canvas practice intelligence platform',
        'Territory mapping and local insights',
        'Advanced market analytics with trends',
        '400 calls per month',
        '100 emails per day',
        '25 Canvas practice scans per day',
        'Competitive intelligence reports'
      ],
      premium: []
    }
  },
  repx4: {
    name: 'RepX4 Executive Operations',
    monthly: 397,
    annual: 3970,
    priceIds: {
      monthly: 'price_1RRurNGRiAPUZqWuklICsE4P',
      annual: 'price_1RWMWjGRiAPUZqWu6YBZY7o4'
    },
    productId: 'prod_SMe9s5P6OirVgP',
    features: {
      calls: 800,
      emails: 200,
      canvas_scans: 50,
      basic: [
        'Everything in RepX3, plus:',
        'AI coaching insights and recommendations',
        'Workflow automation (up to 5 workflows)',
        'Advanced CRM integration and automation',
        '800 calls per month',
        '200 emails per day',
        '50 Canvas practice scans per day',
        'Real-time sales performance analytics'
      ],
      premium: []
    }
  },
  repx5: {
    name: 'RepX5 Elite Global',
    monthly: 797,
    annual: 7970,
    priceIds: {
      monthly: 'price_1RRuqbGRiAPUZqWu3f91wnNx',
      annual: 'price_1RWMXEGRiAPUZqWuPwcgrovN'
    },
    productId: 'prod_SMe8fPX6r65llM',
    features: {
      calls: 'unlimited',
      emails: 'unlimited',
      canvas_scans: 'unlimited',
      basic: [
        'Everything in RepX4, plus:',
        'Real-time AI whisper coaching during live calls',
        'Unlimited calls, emails, and Canvas scans',
        'Unlimited workflow automations',
        'Custom AI agent configuration'
      ],
      premium: [
        'Dedicated success manager',
        'Priority support and training',
        'Custom integrations and setup',
        'Early access to new AI features',
        'The complete "Enhanced Rep" experience'
      ]
    }
  }
};

// GET /api/repx/plans - Get all Rep^x plans and pricing
router.get('/plans', (req, res) => {
  try {
    res.json({
      success: true,
      data: REPX_PLANS
    });
  } catch (error) {
    console.error('Error fetching Rep^x plans:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch plans'
    });
  }
});

// GET /api/repx/plans/:tier - Get specific plan details
router.get('/plans/:tier', (req, res) => {
  try {
    const { tier } = req.params;
    
    if (!REPX_PLANS[tier]) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found'
      });
    }
    
    res.json({
      success: true,
      data: REPX_PLANS[tier]
    });
  } catch (error) {
    console.error('Error fetching Rep^x plan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch plan'
    });
  }
});

// POST /api/repx/checkout - Create Stripe checkout session for Rep^x
router.post('/checkout', async (req, res) => {
  try {
    const { 
      tier, 
      billingCycle, 
      customerEmail, 
      successUrl, 
      cancelUrl 
    } = req.body;
    
    // Validate tier
    if (!REPX_PLANS[tier]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid subscription tier'
      });
    }
    
    // Validate billing cycle
    if (!['monthly', 'annual'].includes(billingCycle)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid billing cycle'
      });
    }
    
    const plan = REPX_PLANS[tier];
    const priceId = plan.priceIds[billingCycle];
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      success_url: successUrl || `${req.headers.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.origin}/subscription/cancel`,
      metadata: {
        tier,
        billingCycle,
        plan_name: plan.name
      },
      subscription_data: {
        metadata: {
          tier,
          billingCycle,
          plan_name: plan.name
        }
      }
    });
    
    res.json({
      success: true,
      data: {
        url: session.url,
        sessionId: session.id
      }
    });
    
  } catch (error) {
    console.error('Error creating Rep^x checkout session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create checkout session'
    });
  }
});

// GET /api/repx/features/:tier - Get feature limits for tier
router.get('/features/:tier', (req, res) => {
  try {
    const { tier } = req.params;
    
    if (!REPX_PLANS[tier]) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found'
      });
    }
    
    const plan = REPX_PLANS[tier];
    
    res.json({
      success: true,
      data: {
        tier,
        name: plan.name,
        limits: {
          calls: plan.features.calls,
          emails: plan.features.emails,
          canvas_scans: plan.features.canvas_scans
        },
        features: {
          basic: plan.features.basic,
          premium: plan.features.premium
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching Rep^x features:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch features'
    });
  }
});

// POST /api/repx/validate-access - Check if user has access to feature
router.post('/validate-access', async (req, res) => {
  try {
    const { userTier, feature, usage = {} } = req.body;
    
    if (!REPX_PLANS[userTier]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user tier'
      });
    }
    
    const plan = REPX_PLANS[userTier];
    const limits = plan.features;
    
    let hasAccess = true;
    let reason = '';
    
    // Check feature-specific limits
    switch (feature) {
      case 'calls':
        if (limits.calls !== 'unlimited' && usage.calls >= limits.calls) {
          hasAccess = false;
          reason = `Monthly call limit of ${limits.calls} reached`;
        }
        break;
        
      case 'emails':
        if (limits.emails === 0) {
          hasAccess = false;
          reason = 'Email feature not available in this tier';
        } else if (limits.emails !== 'unlimited' && usage.emails >= limits.emails) {
          hasAccess = false;
          reason = `Daily email limit of ${limits.emails} reached`;
        }
        break;
        
      case 'canvas_scans':
        if (limits.canvas_scans === 0) {
          hasAccess = false;
          reason = 'Canvas scanning not available in this tier';
        } else if (limits.canvas_scans !== 'unlimited' && usage.canvas_scans >= limits.canvas_scans) {
          hasAccess = false;
          reason = `Daily Canvas scan limit of ${limits.canvas_scans} reached`;
        }
        break;
        
      default:
        hasAccess = true;
    }
    
    res.json({
      success: true,
      data: {
        hasAccess,
        reason,
        tier: userTier,
        feature,
        limits: {
          calls: limits.calls,
          emails: limits.emails,
          canvas_scans: limits.canvas_scans
        }
      }
    });
    
  } catch (error) {
    console.error('Error validating Rep^x access:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate access'
    });
  }
});

export default router;

// To use in your main app.js:
// import repxRoutes from './routes/repx-subscriptions.js';
// app.use('/api/repx', repxRoutes);