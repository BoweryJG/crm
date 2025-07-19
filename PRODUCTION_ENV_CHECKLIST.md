# Production Environment Variables Checklist

## ✅ Complete Netlify Environment Variables Required

Add these to your Netlify dashboard under "Site settings" → "Environment variables":

### **Core Database & Authentication**
```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Twilio Integration (Master Account for Rep Provisioning)**
```
REACT_APP_TWILIO_ACCOUNT_SID=your_twilio_account_sid
REACT_APP_TWILIO_AUTH_TOKEN=your_twilio_auth_token
REACT_APP_TWILIO_PHONE_NUMBER=your_twilio_phone_number
REACT_APP_TWILIO_API_KEY=your_twilio_api_key
REACT_APP_TWILIO_API_SECRET=your_twilio_api_secret
REACT_APP_BASE_WEBHOOK_URL=https://crm.repspheres.com/api/twilio
```

### **Stripe Payment Processing**
```
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PRICE_ID_PROFESSIONAL_MONTHLY=prod_SMeBmeB7knfARi
STRIPE_PRICE_ID_PROFESSIONAL_ANNUAL=prod_SMeBAukl5Fqeeh
STRIPE_PRICE_ID_INSIGHTS_MONTHLY=prod_SMeAJE1MaklEQi
STRIPE_PRICE_ID_INSIGHTS_ANNUAL=prod_SMe9s5P6OirVgP
STRIPE_PRICE_ID_ENTERPRISE=prod_SMe8fPX6r65llM
STRIPE_SUCCESS_URL=https://crm.repspheres.com/subscribe/success
STRIPE_CANCEL_URL=https://crm.repspheres.com/subscribe/cancel
```

### **Email & Backend Services**
```
REACT_APP_BACKEND_URL=https://osbackend-zl1h.onrender.com
REACT_APP_ENCRYPTION_KEY=your_32_character_encryption_key
```

### **Optional - Monitoring & Security**
```
VITE_ADMIN_EMAILS=your-admin@email.com
VITE_SENTRY_DSN=your_sentry_dsn_if_using_sentry
```

### **Google OAuth (for Gmail Integration)**
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
REACT_APP_GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

## 🔧 How Multi-Tenant Architecture Works

### **Twilio Strategy**
- **Your Master Account**: Used to provision individual phone numbers for each rep
- **Rep Phone Numbers**: Each rep gets their own number provisioned via `TwilioProvisioningService`
- **Webhook Isolation**: Each rep gets unique webhook URLs (`/api/twilio/voice/{rep_id}`)

### **Gmail Strategy**
- **Individual OAuth**: Each rep connects their own Gmail via OAuth2
- **Rep-Specific Tokens**: Gmail tokens stored per rep ID in database
- **Isolated Automations**: Email campaigns isolated by rep_id

### **Billing Strategy**
- **Stripe Webhooks**: Handle subscription events automatically
- **Rep Receipts**: Automated receipts sent with their specific phone number
- **Plan Enforcement**: Feature access controlled by subscription tier

## 🚀 Production Deployment Flow

1. **New User Signs Up** → Stripe checkout
2. **Payment Successful** → `RepOnboardingService.onboardNewRep()`
3. **Auto-Provisioning**:
   - Creates rep profile
   - Provisions Twilio phone number using your master account
   - Sets up rep-specific webhooks
   - Initializes personal dashboard
   - Sends welcome email with phone number
   - Sends billing receipt

## ✅ Security Features Already Implemented

- **Row Level Security (RLS)**: Each rep only sees their data
- **Rate Limiting**: Applied to all Netlify functions
- **Input Validation**: XSS and SQL injection protection
- **Secure Headers**: CSP, HSTS, XSS protection
- **Environment Variables**: No hardcoded credentials
- **Error Monitoring**: Sentry integration ready

## 🎯 Ready for Production!

Your system automatically handles:
- ✅ Sign up → Payment → Phone provisioning → Receipt delivery
- ✅ Multi-tenant isolation (each rep has their own data/phone)
- ✅ Gmail OAuth per rep for email automation
- ✅ Automated billing and documentation
- ✅ Scalable architecture for unlimited reps

**Just add the environment variables to Netlify and you're live!**