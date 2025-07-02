import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { checkRateLimit, rateLimitResponse } from './rate-limiter.js';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecret, { apiVersion: '2024-04-10' });

// Price IDs for different tiers and billing cycles from Stripe CSV
const PRICE_IDS = {
  explorer: {
    monthly: process.env.STRIPE_PRICE_ID_EXPLORER_MONTHLY || 'price_1RRuqbGRiAPUZqWu3f91wnNx',
    annual: process.env.STRIPE_PRICE_ID_EXPLORER_ANNUAL || 'price_1RWMXEGRiAPUZqWuPwcgrovN'
  },
  professional: {
    monthly: process.env.STRIPE_PRICE_ID_PROFESSIONAL_MONTHLY || 'price_1RRurNGRiAPUZqWuklICsE4P',
    annual: process.env.STRIPE_PRICE_ID_PROFESSIONAL_ANNUAL || 'price_1RWMWjGRiAPUZqWu6YBZY7o4'
  },
  growth: {
    monthly: process.env.STRIPE_PRICE_ID_GROWTH_MONTHLY || 'price_1RWMW3GRiAPUZqWuoTA0eLUC',
    annual: process.env.STRIPE_PRICE_ID_GROWTH_ANNUAL || 'price_1RRus5GRiAPUZqWup3jk1S8U'
  },
  enterprise: {
    monthly: process.env.STRIPE_PRICE_ID_ENTERPRISE_MONTHLY || 'price_1RRushGRiAPUZqWuIvqueK7h',
    annual: process.env.STRIPE_PRICE_ID_ENTERPRISE_ANNUAL || 'price_1RWMT4GRiAPUZqWuqiNhkZfw'
  },
  elite: {
    monthly: process.env.STRIPE_PRICE_ID_ELITE_MONTHLY || 'price_1RRutVGRiAPUZqWuDMSAqHsD',
    annual: process.env.STRIPE_PRICE_ID_ELITE_ANNUAL || 'price_1RWMSCGRiAPUZqWu30j19b9G'
  }
};

// Fallback to professional monthly if no tier specified
const DEFAULT_PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_1RRurNGRiAPUZqWuklICsE4P';

export const handler: Handler = async (event) => {
  // Check rate limit
  const rateLimitResult = checkRateLimit(event, { maxRequests: 10, windowMs: 60000 }); // 10 requests per minute
  if (!rateLimitResult.allowed) {
    return rateLimitResponse(rateLimitResult.resetTime!);
  }

  try {
    // Parse the request body to get tier, billing cycle, and price ID
    const { tier = 'professional', billingCycle = 'monthly', priceId: directPriceId } = 
      event.body ? JSON.parse(event.body) : {};
    
    // Use the direct price ID if provided, otherwise look it up
    let priceId = directPriceId || '';
    
    if (!priceId) {
      // Get the appropriate price ID based on tier and billing cycle
      const tierPrices = PRICE_IDS[tier as keyof typeof PRICE_IDS];
      
      if (tierPrices) {
        priceId = billingCycle === 'annual' ? tierPrices.annual : tierPrices.monthly;
      }
      
      // Fallback to default price ID if the specific one is not found
      if (!priceId) {
        priceId = DEFAULT_PRICE_ID;
        console.warn(`Price ID not found for tier: ${tier}, billingCycle: ${billingCycle}. Using default.`);
      }
    }
    
    if (!priceId) {
      throw new Error('No valid price ID found');
    }

    // Create metadata to store the tier and billing cycle
    const metadata = {
      tier,
      billingCycle
    };

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: process.env.STRIPE_SUCCESS_URL || 'http://localhost:3000/subscribe/success',
      cancel_url: process.env.STRIPE_CANCEL_URL || 'http://localhost:3000/subscribe/cancel',
      metadata, // Store metadata in the session
      allow_promotion_codes: true, // Allow discount codes
      billing_address_collection: 'required', // Collect billing address
      customer_email: undefined, // Let Stripe collect email in checkout
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create checkout session' })
    };
  }
};