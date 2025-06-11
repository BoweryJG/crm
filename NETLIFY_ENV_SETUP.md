# Netlify Environment Variables Setup

## Production Environment Variables

Add these environment variables in Netlify Dashboard:
**Site Settings → Environment Variables**

### Required Variables

```
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://cbopynuvhcymbumjnvay.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNib3B5bnV2aGN5bWJ1bWpudmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTUxNzMsImV4cCI6MjA1OTU3MTE3M30.UZElMkoHugIt984RtYWyfrRuv2rB67opQdCrFVPCfzU

# OpenRouter API Key (for AI features)
REACT_APP_OPENROUTER_API_KEY=[YOUR_OPENROUTER_API_KEY]

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=[YOUR_STRIPE_PUBLISHABLE_KEY]
STRIPE_SECRET_KEY=[YOUR_STRIPE_SECRET_KEY]
STRIPE_PRICE_ID_PROFESSIONAL_MONTHLY=prod_SMeBmeB7knfARi
STRIPE_PRICE_ID_PROFESSIONAL_ANNUAL=prod_SMeBAukl5Fqeeh
STRIPE_PRICE_ID_INSIGHTS_MONTHLY=prod_SMeAJE1MaklEQi
STRIPE_PRICE_ID_INSIGHTS_ANNUAL=prod_SMe9s5P6OirVgP
STRIPE_PRICE_ID_ENTERPRISE=prod_SMe8fPX6r65llM
STRIPE_SUCCESS_URL=https://crm.repspheres.com/subscribe/success
STRIPE_CANCEL_URL=https://crm.repspheres.com/subscribe/cancel
```

### Important Notes

1. **Stripe URLs**: The success and cancel URLs point to your custom domain `crm.repspheres.com`
2. **Security**: Never commit these values to Git
3. **Netlify Auto Variables**: Netlify automatically provides:
   - `URL` - Your site's main URL
   - `DEPLOY_URL` - Unique URL for each deploy
   - `SITE_NAME` - Your site name

### Local Development

For local development, keep a separate `.env.local` file with:
```
STRIPE_SUCCESS_URL=http://localhost:3000/subscribe/success
STRIPE_CANCEL_URL=http://localhost:3000/subscribe/cancel
```

### Deployment Checklist

- [ ] All environment variables added to Netlify
- [ ] Custom domain configured (crm.repspheres.com)
- [ ] Stripe webhook endpoint updated (if using webhooks)
- [ ] Test subscription flow in production