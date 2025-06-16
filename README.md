# RepSpheres CRM

A sophisticated Customer Relationship Management system built for medical device and aesthetic sales representatives. Part of the RepSpheres ecosystem of sales tools.

## 🚀 Overview

RepSpheres CRM is a React-based application that provides comprehensive contact management, practice tracking, and sales analytics specifically designed for healthcare sales professionals. The app features both demo and live modes, with seamless integration across the RepSpheres platform.

## ✨ Key Features

### Core Functionality
- **Contact Management** - Track doctors, practices, and key decision makers
- **Practice Database** - Comprehensive practice information and interaction history
- **Sales Analytics** - Track performance metrics and identify opportunities
- **Call Insights** - AI-powered call analysis and coaching
- **Market Intelligence** - Real-time market data integration
- **SUIS (Sales Unified Intelligence System)** - Advanced AI-powered sales assistant

### Authentication & Modes
- **Cross-Domain Authentication** - Single sign-on across all RepSpheres apps
- **Demo Mode** - Full-featured demo with mock data for evaluation
- **Live Mode** - Real data access with subscription
- **Public/Teaser Mode** - Limited access for non-authenticated users

### User Experience
- **Multiple Themes** - Space, Corporate, Luxury Aviation, and more
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Real-time Updates** - Live data synchronization
- **Offline Support** - Continue working without internet connection

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Material-UI
- **State Management**: React Context API
- **Authentication**: Supabase Auth with cross-domain cookies
- **Database**: Supabase (PostgreSQL)
- **Styling**: Emotion, Material-UI theming
- **Build**: Create React App, Netlify
- **APIs**: Twilio (calling), Stripe (payments), Google Generative AI

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Netlify account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/BoweryJG/crm.git
cd crm

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm start
```

### Environment Variables

Required environment variables:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional: Twilio Configuration (for calling features)
REACT_APP_TWILIO_FUNCTION_URL=your-twilio-function-url
REACT_APP_TWILIO_API_KEY=your-twilio-api-key
REACT_APP_TWILIO_PHONE_NUMBER=your-twilio-phone

# Optional: Stripe Configuration (for subscriptions)
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## 🏗️ Architecture

### Directory Structure

```
src/
├── auth/              # Authentication components and hooks
├── components/        # Reusable UI components
│   ├── common/       # Shared components
│   ├── layout/       # Layout components
│   └── ...
├── contexts/         # React Context providers
├── pages/           # Page components
├── services/        # API and service layers
├── themes/          # Theme configurations
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

### Key Components

- **AuthGuard** - Protects routes and enables public mode
- **AppModeContext** - Manages demo/live mode switching
- **ServiceFactory** - Provides mock or real services based on mode
- **RepSpheresAppSwitcher** - Cross-app navigation component

## 🔐 Authentication Flow

1. User logs in via any RepSpheres app
2. Auth cookie set on `.repspheres.com` domain
3. Cookie accessible by all subdomains
4. User remains authenticated across all apps
5. Logout from any app logs out everywhere

## 🎨 Theming

The app supports multiple themes that can be switched dynamically:

- **Space Theme** - Deep space exploration aesthetic
- **Corporate Theme** - Professional business interface
- **Luxury Aviation** - High-end aviation gauges with luxury styling
- **Beauty Themes** - Aesthetic-focused themes for cosmetic sales
- **Aviation Themes** - Military and civilian aviation inspired

## 📱 Cross-App Integration

RepSpheres CRM integrates seamlessly with:

- **Market Data** (`marketdata.repspheres.com`) - Real-time market analytics
- **Canvas** (`canvas.repspheres.com`) - Creative design tools
- **Podcast** (`podcast.repspheres.com`) - Audio content platform
- **Main Site** (`repspheres.com`) - Central hub and authentication

## 🚀 Deployment

The app is configured for automatic deployment via Netlify:

```bash
# Build for production
npm run build

# Deploy to Netlify
# Automatic via GitHub integration
```

### Netlify Configuration

The `netlify.toml` file includes:
- Build settings
- Environment variable configuration
- Redirect rules for SPA routing
- Function directory setup

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Build and check for errors
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software owned by RepSpheres. All rights reserved.

## 🔗 Links

- **Production**: [crm.repspheres.com](https://crm.repspheres.com)
- **Main Site**: [repspheres.com](https://repspheres.com)
- **Documentation**: Coming soon
- **Support**: support@repspheres.com

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced AI insights
- [ ] Territory mapping
- [ ] Team collaboration features
- [ ] Enhanced offline capabilities
- [ ] Integration with medical databases
- [ ] Automated follow-up scheduling

---

Built with ❤️ by the RepSpheres team# Deploy trigger Sun Jun 15 20:38:35 EDT 2025
