# Sphere oS CRM

A visually stunning and comprehensive CRM specifically designed for medical sales representatives in the aesthetic and dental industries.

Last updated: June 11, 2025

🚀 **Live at**: [crm.repspheres.com](https://crm.repspheres.com)

## Overview

RepSpheres CRM combines an intuitive, space-themed interface with powerful industry-specific features to help sales representatives in the medical field manage their contacts, track practices, monitor sales activity, and access comprehensive knowledge bases for dental and aesthetic procedures.

## Features

- **Visually Stunning Interface**: Space-themed dark mode with vibrant, thrilling colors
- **SUIS (Sphere Universal Intelligence System)**: AI-powered intelligence layer for personalized insights
- **Comprehensive Industry Data**: Specialized for dental and aesthetic industries
- **AI-Enhanced Tools**: Content generation, call analysis, and market intelligence
- **Advanced Contact & Practice Management**: Track relationships and engagement with contact marketplace
- **External Recording Upload**: Support for PLAUD and manual recording uploads with AI analysis
- **Procedure Knowledge Base**: Detailed information on dental and aesthetic procedures
- **Companies Database**: Comprehensive directory of industry vendors and manufacturers
- **Sales Performance Tracking**: Monitor goals, achievements, and activities with advanced analytics
- **Multi-Provider AI Integration**: Choice of OpenAI or Google Gemini for transcription and analysis
- **API Key Management**: Users can configure their own service API keys securely
- **Stripe Billing**: 5 subscription tiers (Explorer, Professional, Growth, Enterprise, Elite) with monthly and annual options
- **Live Payment Processing**: Production-ready Stripe integration with webhook support

## Tech Stack

- **Frontend**: React 18 with TypeScript, Material UI
- **Backend**: 
  - Supabase (PostgreSQL) for database
  - Node.js backend API on Render (osbackend-zl1h.onrender.com)
  - Netlify Functions for serverless operations
- **State Management**: React Context API
- **Styling**: CSS-in-JS with Material UI
- **Data Visualization**: Recharts, Chart.js
- **Authentication**: Supabase Auth with JWT
- **AI Integration**: 
  - OpenRouter API
  - Google Generative AI (Gemini)
  - OpenAI (via backend)
- **Payment Processing**: Stripe with Netlify Functions and webhook handling
- **Communication**: Twilio for calls and SMS
- **Hosting**: Netlify with custom domain (crm.repspheres.com)

## Project Structure

```
/
├── public/              # Static assets
├── src/                 # Source code
│   ├── assets/          # Images, icons, etc.
│   ├── components/      # Reusable components
│   │   ├── analytics/   # Analytics dashboards and charts
│   │   ├── calling/     # Twilio calling interface
│   │   ├── common/      # Generic UI components
│   │   ├── contacts/    # Contact management components
│   │   ├── dashboard/   # Dashboard-related components
│   │   ├── learning/    # Knowledge base and training
│   │   ├── market/      # Market intelligence
│   │   └── settings/    # User settings and API key management
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Top-level page components
│   ├── services/        # API and service integrations
│   │   ├── ai/          # AI service integrations
│   │   ├── supabase/    # Supabase integration
│   │   └── twilio/      # Twilio services
│   ├── suis/            # SUIS intelligent system components
│   │   ├── components/  # SUIS UI components
│   │   ├── services/    # SUIS backend services
│   │   └── types/       # SUIS TypeScript definitions
│   ├── themes/          # Theme configurations
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── netlify/             # Netlify Functions
│   └── functions/       # Serverless functions
├── scripts/             # Data enrichment and utility scripts
├── supabase/            # Supabase configuration
│   └── migrations/      # Database migrations
└── .env.example         # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- A Supabase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/BoweryJG/SphereOsCrM.git
   cd SphereOsCrM
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file based on `.env.example` and add your credentials:
   ```
   # Supabase Configuration (Required)
   REACT_APP_SUPABASE_URL=your_supabase_url_here
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here
   
   # Backend API Configuration
   REACT_APP_BACKEND_URL=https://osbackend-zl1h.onrender.com
   
   # Stripe Configuration (for subscriptions)
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   # Price IDs for 5 tiers
   STRIPE_PRICE_ID_EXPLORER_MONTHLY=price_xxx
   STRIPE_PRICE_ID_EXPLORER_ANNUAL=price_xxx
   STRIPE_PRICE_ID_PROFESSIONAL_MONTHLY=price_xxx
   STRIPE_PRICE_ID_PROFESSIONAL_ANNUAL=price_xxx
   STRIPE_PRICE_ID_GROWTH_MONTHLY=price_xxx
   STRIPE_PRICE_ID_GROWTH_ANNUAL=price_xxx
   STRIPE_PRICE_ID_ENTERPRISE_MONTHLY=price_xxx
   STRIPE_PRICE_ID_ENTERPRISE_ANNUAL=price_xxx
   STRIPE_PRICE_ID_ELITE_MONTHLY=price_xxx
   STRIPE_PRICE_ID_ELITE_ANNUAL=price_xxx
   
   # AI Services (Optional)
   REACT_APP_OPENROUTER_API_KEY=your_openrouter_api_key_here
   
   # URLs
   STRIPE_SUCCESS_URL=http://localhost:3000/subscribe/success
   STRIPE_CANCEL_URL=http://localhost:3000/subscribe/cancel
   ```

4. Set up your Supabase database by running the migrations in order:
   ```bash
   # Run migrations from supabase/migrations/ folder
   # These include: API keys, SUIS schema, contacts, linguistics, etc.
   ```

5. Start the development server:
   ```
   npm start
   ```

## Database Setup

RepSpheres CRM uses Supabase as a backend. The database schema includes:

- **Contacts**: Medical professionals in dental/aesthetic practices
- **Practices**: Dental and aesthetic clinics/offices
- **Procedures**: Detailed information on medical procedures
- **Companies**: Manufacturers and vendors in the industry
- **Sales Activities**: Call logs, meetings, demos, etc.
- **Call Analysis**: Recorded calls with sentiment and transcript data
- **Call Recordings**: Support for external recordings (PLAUD, manual uploads)
- **Tasks**: Follow-ups and to-dos
- **Market Intelligence**: Industry trends and insights
- **Public Contacts**: Demo contacts available to all users
- **API Keys**: User-specific API key management
- **SUIS Tables**: Intelligence profiles, insights, market feeds, and more
- **Contact Marketplace**: Shared contact data marketplace

Run migrations from `supabase/migrations/` folder in chronological order.

## Subscription Tiers

### Explorer ($49/mo | $490/yr)
- Test the waters with essential market insights
- Access to 25% of dental/aesthetic procedure database
- 5 AI Workspace prompts/month
- Basic category descriptions
- Weekly market digest email

### Professional ($149/mo | $1,490/yr)
- Everything you need to excel in your territory
- Full access to complete procedure database
- 50 AI Workspace prompts/month
- Linguistics module: 10 call analyses/month
- Export capabilities (PDF/CSV)

### Growth ($349/mo | $3,490/yr)
- Scale your success with advanced analytics
- Everything in Professional, plus:
- Unlimited AI Workspace prompts
- 50 call analyses/month with coaching insights
- Custom market reports (3/month)
- Team collaboration (up to 3 users)

### Enterprise ($749/mo | $7,490/yr)
- Command center for market domination
- Everything in Growth, plus:
- Unlimited call analyses with AI coaching
- Full CRM automation features
- AI-powered workflow automation (5 workflows)
- Team access (up to 10 users)

### Elite ($1,499/mo | $14,990/yr)
- Your personal AI-powered sales acceleration team
- Everything in Enterprise, plus:
- Unlimited workflow automations
- Custom AI agent configuration
- Dedicated success manager
- Unlimited team members

## Recent Updates (June 2025)

- ✅ SUIS (Sphere Universal Intelligence System) implementation
- ✅ External recording upload with AI analysis (PLAUD support)
- ✅ Multi-provider AI integration (OpenAI, Google Gemini)
- ✅ API key management system
- ✅ Contact marketplace functionality
- ✅ Enhanced payment processing with 5 subscription tiers
- ✅ Backend API migration for better scalability
- ✅ Advanced linguistics analysis
- ✅ Contact enrichment scripts

## Development Roadmap

- [x] Initial UI framework
- [x] Dashboard design and implementation
- [x] Supabase database schema
- [x] Data models and service layer
- [x] Stripe payment integration (5 tiers)
- [x] Subscription management
- [x] AI-powered features with multiple providers
- [x] SUIS intelligent system
- [x] External recording uploads
- [x] API key management
- [ ] Enhanced authentication with SSO
- [ ] Advanced team collaboration features
- [ ] Mobile app (React Native)
- [ ] Advanced reporting with custom dashboards
- [ ] Webhook integrations
- [ ] Salesforce integration

## License

All rights reserved.

## Contact

For more information, visit [repspheres.com](https://www.repspheres.com).
