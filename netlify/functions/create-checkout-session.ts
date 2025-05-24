import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecret, { apiVersion: '2024-04-10' });

// Price IDs for different tiers and billing cycles
const PRICE_IDS = {
  professional: {
    monthly: process.env.STRIPE_PRICE_ID_PROFESSIONAL_MONTHLY || '',
    annual: process.env.STRIPE_PRICE_ID_PROFESSIONAL_ANNUAL || ''
  },
  insights: {
    monthly: process.env.STRIPE_PRICE_ID_INSIGHTS_MONTHLY || '',
    annual: process.env.STRIPE_PRICE_ID_INSIGHTS_ANNUAL || ''
  }
};

// Fallback to the original price ID if the specific ones are not set
const DEFAULT_PRICE_ID = process.env.STRIPE_PRICE_ID || '';

export const handler: Handler = async (event) => {
  try {
    // Parse the request body to get tier and billing cycle
    const { tier = 'professional', billingCycle = 'monthly' } = 
      event.body ? JSON.parse(event.body) : {};
    
    // Get the appropriate price ID based on tier and billing cycle
    let priceId = '';
    
    if (tier === 'professional') {
      priceId = billingCycle === 'monthly' 
        ? PRICE_IDS.professional.monthly 
        : PRICE_IDS.professional.annual;
    } else if (tier === 'insights') {
      priceId = billingCycle === 'monthly' 
        ? PRICE_IDS.insights.monthly 
        : PRICE_IDS.insights.annual;
    }
    
    // Fallback to default price ID if the specific one is not set
    if (!priceId) {
      priceId = DEFAULT_PRICE_ID;
      console.warn(`Price ID not found for tier: ${tier}, billingCycle: ${billingCycle}. Using default.`);
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
      metadata // Store metadata in the session
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
