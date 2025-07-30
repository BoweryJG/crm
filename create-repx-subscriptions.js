#!/usr/bin/env node

/**
 * RepX Subscription Products Creator
 * Creates all RepX subscription tiers in Stripe
 * 
 * Usage: node create-repx-subscriptions.js
 */

const Stripe = require('stripe');

// Initialize Stripe with environment variable
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_KEY) {
  console.error('❌ STRIPE_SECRET_KEY environment variable is required');
  console.error('Set it with: export STRIPE_SECRET_KEY=sk_live_your_key_here');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2023-10-16'
});

console.log('⚠️  WARNING: Using LIVE Stripe key - this will create REAL products!');

// RepX Tier Configurations
const REPX_TIERS = [
  {
    tier: 'repx1',
    name: 'Rep¹ - Login',
    description: 'Basic RepSpheres access with authentication across all apps',
    features: {
      login: true,
      email: false,
      phone: false,
      gmail: false,
      agentMinutes: 1,
      apps: ['crm', 'canvas', 'market-data', 'repconnect', 'global']
    },
    prices: {
      monthly: 9700, // $97 in cents
      annual: 97000  // $970 in cents
    }
  },
  {
    tier: 'repx2',
    name: 'Rep² - Login + Email',
    description: 'Email capabilities with Vultr SMTP for unlimited sending',
    features: {
      login: true,
      email: true,
      phone: false,
      gmail: false,
      agentMinutes: 5,
      smtpProvider: 'vultr',
      emailLimit: 'unlimited',
      apps: ['crm', 'canvas', 'market-data', 'repconnect', 'global']
    },
    prices: {
      monthly: 19700, // $197 in cents
      annual: 197000  // $1,970 in cents
    }
  },
  {
    tier: 'repx3',
    name: 'Rep³ - Login + Email + Phone',
    description: 'Twilio phone provisioning with dedicated number and cross-app calling',
    features: {
      login: true,
      email: true,
      phone: true,
      gmail: false,
      agentMinutes: 15,
      twilioProvisioning: true,
      dedicatedPhoneNumber: true,
      apps: ['crm', 'canvas', 'market-data', 'repconnect', 'global']
    },
    prices: {
      monthly: 29700, // $297 in cents
      annual: 297000  // $2,970 in cents
    }
  },
  {
    tier: 'repx4',
    name: 'Rep⁴ - Login + Email + Phone + Gmail',
    description: 'Full integration suite with Gmail sync and advanced features',
    features: {
      login: true,
      email: true,
      phone: true,
      gmail: true,
      agentMinutes: 30,
      gmailScopes: ['readonly', 'send', 'compose', 'modify'],
      advancedAnalytics: true,
      apps: ['crm', 'canvas', 'market-data', 'repconnect', 'global']
    },
    prices: {
      monthly: 49700, // $497 in cents
      annual: 497000  // $4,970 in cents
    }
  },
  {
    tier: 'repx5',
    name: 'Rep⁵ - Everything + Custom',
    description: 'Enterprise tier with white label options and unlimited agent conversations',
    features: {
      login: true,
      email: true,
      phone: true,
      gmail: true,
      agentMinutes: 'custom',
      whiteLabel: true,
      customIntegrations: true,
      dedicatedSupport: true,
      apps: ['crm', 'canvas', 'market-data', 'repconnect', 'global']
    },
    prices: {
      monthly: 99700, // $997 in cents
      annual: 997000  // $9,970 in cents
    }
  }
];

// App-specific entry points configuration
const APP_ENTRY_POINTS = {
  crm: {
    starter: { monthly: 9700, annual: 97000 },  // Same as Rep¹
    pro: { monthly: 29700, annual: 297000 }      // Same as Rep³
  },
  canvas: {
    starter: { monthly: 9700, annual: 97000 },  // Same as Rep¹
    pro: { monthly: 19700, annual: 197000 }      // Same as Rep²
  },
  'market-data': {
    free: { monthly: 0, annual: 0 },             // Free live data for all
    pro: { monthly: 19700, annual: 197000 }      // Same as Rep²
  },
  repconnect: {
    starter: { monthly: 9700, annual: 97000 },  // Same as Rep¹
    pro: { monthly: 29700, annual: 297000 }      // Same as Rep³
  }
};

async function createRepXProducts() {
  console.log('🚀 Creating RepX Subscription Products...\n');
  
  const createdProducts = {};
  
  try {
    // Create RepX tier products
    for (const tier of REPX_TIERS) {
      console.log(`📦 Creating ${tier.name}...`);
      
      // Create the product
      const product = await stripe.products.create({
        name: tier.name,
        description: tier.description,
        metadata: {
          tier: tier.tier,
          features: JSON.stringify(tier.features)
        }
      });
      
      console.log(`✅ Created product: ${product.id}`);
      
      // Create monthly price
      const monthlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: tier.prices.monthly,
        currency: 'usd',
        recurring: {
          interval: 'month'
        },
        nickname: `${tier.name} - Monthly`,
        metadata: {
          tier: tier.tier,
          billing_period: 'monthly'
        }
      });
      
      console.log(`💳 Created monthly price: ${monthlyPrice.id} ($${tier.prices.monthly / 100}/mo)`);
      
      // Create annual price
      const annualPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: tier.prices.annual,
        currency: 'usd',
        recurring: {
          interval: 'year'
        },
        nickname: `${tier.name} - Annual`,
        metadata: {
          tier: tier.tier,
          billing_period: 'annual'
        }
      });
      
      console.log(`💳 Created annual price: ${annualPrice.id} ($${tier.prices.annual / 100}/yr)`);
      
      // Store the created IDs
      createdProducts[tier.tier] = {
        productId: product.id,
        monthlyPriceId: monthlyPrice.id,
        annualPriceId: annualPrice.id,
        features: tier.features
      };
      
      console.log('');
    }
    
    // Create app-specific entry point products
    console.log('📱 Creating App-Specific Entry Points...\n');
    
    for (const [appName, tiers] of Object.entries(APP_ENTRY_POINTS)) {
      console.log(`Creating products for ${appName}...`);
      
      for (const [tierName, prices] of Object.entries(tiers)) {
        if (prices.monthly === 0) continue; // Skip free tiers
        
        const product = await stripe.products.create({
          name: `${appName.charAt(0).toUpperCase() + appName.slice(1)} - ${tierName.charAt(0).toUpperCase() + tierName.slice(1)}`,
          description: `${tierName} tier for ${appName} application`,
          metadata: {
            app: appName,
            app_tier: tierName,
            repx_equivalent: prices.monthly === 9700 ? 'repx1' : 
                           prices.monthly === 19700 ? 'repx2' : 
                           prices.monthly === 29700 ? 'repx3' : 'custom'
          }
        });
        
        const monthlyPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: prices.monthly,
          currency: 'usd',
          recurring: {
            interval: 'month'
          },
          metadata: {
            app: appName,
            app_tier: tierName
          }
        });
        
        const annualPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: prices.annual,
          currency: 'usd',
          recurring: {
            interval: 'year'
          },
          metadata: {
            app: appName,
            app_tier: tierName
          }
        });
        
        console.log(`✅ Created ${appName}/${tierName}: ${product.id}`);
      }
    }
    
    // Save the created product IDs to a file
    const fs = require('fs');
    const outputFile = {
      created_at: new Date().toISOString(),
      environment: 'LIVE',
      repx_tiers: createdProducts,
      app_entry_points: APP_ENTRY_POINTS,
      stripe_account: STRIPE_KEY.substring(0, 14) + '...'
    };
    
    fs.writeFileSync('repx-stripe-products.json', JSON.stringify(outputFile, null, 2));
    
    console.log('\n✅ All products created successfully!');
    console.log('📄 Product IDs saved to: repx-stripe-products.json');
    console.log('\n🎯 Next steps:');
    console.log('1. Update your apps with these price IDs');
    console.log('2. Test the checkout flow with each tier');
    console.log('3. Set up webhooks for subscription events');
    console.log('4. Configure Twilio auto-provisioning for Rep³+ subscribers');
    
  } catch (error) {
    console.error('\n❌ Error creating products:', error.message);
    console.error('Error type:', error.type);
    console.error('Error code:', error.code);
    
    if (error.type === 'StripeAuthenticationError') {
      console.error('🔑 Check your Stripe API key');
      console.error('Make sure the key starts with "sk_test_" for test mode');
    }
    
    // Show first few characters of key for debugging
    console.error('Using key:', STRIPE_KEY.substring(0, 14) + '...');
  }
}

// Run the script
createRepXProducts();