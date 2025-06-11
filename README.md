# Sphere oS CRM

A visually stunning and comprehensive CRM specifically designed for medical sales representatives in the aesthetic and dental industries.

Last updated: January 6, 2025

🚀 **Live at**: [crm.repspheres.com](https://crm.repspheres.com)

## Overview

RepSpheres CRM combines an intuitive, space-themed interface with powerful industry-specific features to help sales representatives in the medical field manage their contacts, track practices, monitor sales activity, and access comprehensive knowledge bases for dental and aesthetic procedures.

## Features

- **Visually Stunning Interface**: Space-themed dark mode with vibrant, thrilling colors
- **Comprehensive Industry Data**: Specialized for dental and aesthetic industries
- **AI-Enhanced Tools**: Content generation, call analysis, and market intelligence
- **Advanced Contact & Practice Management**: Track relationships and engagement
- **Procedure Knowledge Base**: Detailed information on dental and aesthetic procedures
- **Companies Database**: Comprehensive directory of industry vendors and manufacturers
- **Sales Performance Tracking**: Monitor goals, achievements, and activities
- **Stripe Billing**: Flexible subscription tiers with monthly and annual options
- **Live Payment Processing**: Production-ready Stripe integration

## Tech Stack

- **Frontend**: React 18 with TypeScript, Material UI
- **Backend**: Supabase (PostgreSQL)
- **State Management**: React Context API
- **Styling**: CSS-in-JS with Material UI
- **Data Visualization**: Recharts
- **Authentication**: Supabase Auth
- **Payment Processing**: Stripe with Netlify Functions
- **Hosting**: Netlify with custom domain (crm.repspheres.com)

## Project Structure

```
/
├── public/              # Static assets
├── src/                 # Source code
│   ├── assets/          # Images, icons, etc.
│   ├── components/      # Reusable components
│   │   ├── common/      # Generic UI components
│   │   ├── dashboard/   # Dashboard-related components
│   │   └── layout/      # Layout components (header, sidebar, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Top-level page components
│   ├── services/        # API and service integrations
│   │   └── supabase/    # Supabase integration
│   ├── themes/          # Theme configurations
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── supabase/            # Supabase configuration
│   └── schema.sql       # Database schema
└── .env.local.example   # Environment variables template
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

3. Create a `.env.local` file based on `.env.local.example` and add your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url_here
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here
   SUPABASE_DB_HOST=db.your_project_ref.supabase.co
   SUPABASE_DB_PORT=5432
   SUPABASE_DB_NAME=postgres
   SUPABASE_DB_USER=postgres
   SUPABASE_DB_PASSWORD=your_db_password_here
   
   # Stripe Configuration
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   STRIPE_PRICE_ID_PROFESSIONAL_MONTHLY=your_price_id_here
   STRIPE_PRICE_ID_PROFESSIONAL_ANNUAL=your_price_id_here
   STRIPE_PRICE_ID_INSIGHTS_MONTHLY=your_price_id_here
   STRIPE_PRICE_ID_INSIGHTS_ANNUAL=your_price_id_here
   STRIPE_SUCCESS_URL=http://localhost:3000/subscribe/success
   STRIPE_CANCEL_URL=http://localhost:3000/subscribe/cancel
   
   # OpenRouter API (for AI features)
   REACT_APP_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```
   The database values can be found in your Supabase dashboard under **Settings → Database → Connection Info**.

4. Set up your Supabase database using the schema in `supabase/schema.sql`.

5. (Optional) Run the migration script to initialize app mode data:
   ```bash
   chmod +x apply_app_mode_migrations.sh  # run once
   ./apply_app_mode_migrations.sh
   ```

6. Start the development server:
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
- **Tasks**: Follow-ups and to-dos
- **Market Intelligence**: Industry trends and insights
- **Public Contacts**: Demo contacts available to all users

Import the schema from `supabase/schema.sql` to set up your database structure.

## Subscription Tiers

### Professional Tier
- Full CRM access
- Contact and practice management
- Basic analytics
- Email support
- Monthly: $49/month | Annual: $470/year (save $118)

### Insights Tier
- Everything in Professional
- AI-powered call analysis
- Advanced analytics
- Market intelligence
- Priority support
- Monthly: $99/month | Annual: $950/year (save $238)

### Enterprise
- Custom pricing
- Dedicated support
- Custom integrations
- Team management
- Contact sales

## Development Roadmap

- [x] Initial UI framework
- [x] Dashboard design and implementation
- [x] Supabase database schema
- [x] Data models and service layer
- [x] Stripe payment integration
- [x] Subscription management
- [x] AI-powered features with OpenRouter
- [ ] Enhanced authentication
- [ ] Team collaboration features
- [ ] Mobile optimization
- [ ] Advanced reporting

## License

All rights reserved.

## Contact

For more information, visit [repspheres.com](https://www.repspheres.com).
