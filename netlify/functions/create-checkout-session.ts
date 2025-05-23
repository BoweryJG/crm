import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecret, { apiVersion: '2022-11-15' });

export const handler: Handler = async () => {
  try {
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      throw new Error('Missing STRIPE_PRICE_ID');
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: process.env.STRIPE_SUCCESS_URL || 'http://localhost:3000/subscribe/success',
      cancel_url: process.env.STRIPE_CANCEL_URL || 'http://localhost:3000/subscribe/cancel'
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
