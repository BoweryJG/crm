# CRM - Deployment Guide

## Prerequisites
- Netlify account
- Supabase project (same as other RepSpheres apps)
- Twilio account (for call features)
- Stripe account
- API keys from .env.example

## Deployment Steps

### 1. Environment Variables in Netlify
Set these in Netlify Dashboard > Site Settings > Environment Variables:

#### Core Configuration
```
REACT_APP_BACKEND_URL=https://your-backend-url.com
REACT_APP_SUPABASE_URL=your_production_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_production_supabase_anon_key
REACT_APP_ENCRYPTION_KEY=generate_secure_random_string
```

#### Twilio Configuration (for Call Features)
```
REACT_APP_TWILIO_FUNCTION_URL=https://your-twilio-function-url
REACT_APP_TWILIO_API_KEY=your_twilio_api_key
REACT_APP_TWILIO_PHONE_NUMBER=+1234567890
```

#### Stripe Configuration
```
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PRICE_ID=price_your_stripe_price_id
```

#### AI & Additional Services
```
REACT_APP_OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key
REACT_APP_OPENROUTER_URL=https://openrouter.ai/api/v1/chat/completions
REACT_APP_SPHERE1A_URL=https://your-sphere1a-url.com
REACT_APP_SPHERE1A_API_KEY=your_sphere1a_api_key
```

#### Market Data Integration (if needed)
```
REACT_APP_MARKET_DATA_SUPABASE_URL=same_as_main_supabase_url
REACT_APP_MARKET_DATA_SUPABASE_ANON_KEY=same_as_main_anon_key
```

### 2. Pre-deployment Check
The build command includes environment validation:
```
node check-env.js && CI=false npm ci --legacy-peer-deps && CI=false npm run build
```

### 3. Domain Setup
Configure in Netlify:
- Primary domain: crm.repspheres.com
- SSL automatically provisioned

### 4. Netlify Functions
The CRM uses serverless functions for:
- Stripe webhooks
- Twilio integration
- Backend API proxying

### 5. Authentication
- Uses same Supabase project as other RepSpheres apps
- Users sign in with same credentials
- No cross-domain SSO (separate login required)

### 6. Post-Deployment Checklist
- [ ] Test login flow
- [ ] Verify contact/practice management
- [ ] Test Twilio call features (if configured)
- [ ] Check AI-powered features
- [ ] Verify Stripe integration
- [ ] Test data sync with market intelligence

## Quick Deploy
1. Connect GitHub repo to Netlify
2. Set all required environment variables
3. Deploy (build will validate env vars)
4. Configure custom domain
5. Test all features

## Troubleshooting
- If build fails, check check-env.js output
- Legacy peer deps flag handles React 18/19 compatibility
- CI=false prevents warnings from failing build