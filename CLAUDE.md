# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
- `npm start` - Start development server
- `npm run build` - Build for production  
- `npm test` - Run tests in watch mode
- `npm test -- --watch` - Run tests with additional watch options
- `npm run test:backend` - Test backend connection (uses ts-node)

### Build Process
The build command includes environment checks and specific npm configurations:
```bash
node check-env.js && CI=false npm ci --legacy-peer-deps && CI=false npm run build
```
- `check-env.js` validates required environment variables before build
- `CI=false` prevents warnings from failing the build
- `--legacy-peer-deps` handles dependency conflicts

### Deployment
- Automatic deployment via Netlify on push to main branch
- Manual deployment: `npm run build` then deploy `build/` folder
- Functions deployed automatically from `netlify/functions/`

## Architecture Overview

### Core Application Structure
This is a **React 18 + TypeScript CRM** built for medical device and aesthetic sales representatives. The application operates in multiple modes with sophisticated service switching.

### Key Architectural Patterns

#### 1. Service Factory Pattern (`src/services/serviceFactory.ts`)
The heart of the application's data layer. Provides mode-aware services that switch between real Supabase data and mock data based on:
- **App Mode**: `demo` (mock data) vs `live` (real data)  
- **Feature Tier**: `basic` (limited features) vs `premium` (full features)

Example usage:
```typescript
const { linguisticsService } = useServiceFactory();
// Returns mock or real service based on current mode
```

#### 2. App Mode Context (`src/contexts/AppModeContext.tsx`)
Manages the application's operational state:
- **Demo Mode**: Full-featured demo with mock data for evaluation
- **Live Mode**: Real data access (requires subscription)
- **Feature Tiers**: Basic (limited) vs Premium (full analytics)
- **Subscription Management**: Integration with Stripe subscriptions

#### 3. Authentication System (`src/auth/`)
**Cross-domain authentication** across the RepSpheres ecosystem:
- Single sign-on using Supabase Auth
- Domain-wide cookies (`.repspheres.com`)
- Admin user detection (`src/config/adminUsers.ts`)
- Public/unauthenticated mode support

#### 4. Theme System (`src/themes/`)
**30+ dynamic themes** with runtime switching:
- Space, Corporate, Luxury Aviation, Beauty, Cyber themes
- Material-UI theme integration
- Animation and glass effects
- Mobile-responsive theme adjustments

### Component Architecture

#### Layout Components (`src/components/layout/`)
- **Header**: Navigation with cross-app switcher
- **Sidebar**: Main navigation with theme-aware styling
- **Layout**: Main container with responsive behavior

#### Business Logic Components
- **Contact Management**: CSV import, bulk processing, duplicate detection
- **Call Analytics**: AI-powered linguistics analysis of sales calls
- **Practice Database**: Healthcare practice tracking
- **SUIS (Sales Unified Intelligence System)**: AI sales assistant

#### Common Components (`src/components/common/`)
- **AuthGuard**: Route protection with public mode support
- **LoadingScreen**: Theme-aware loading states
- **FeatureGuard**: Feature tier-based access control

### Data Flow

#### 1. Authentication Flow
```
User Login → Supabase Auth → Cross-domain Cookie → App Mode Detection → Service Factory Initialization
```

#### 2. Service Resolution
```
Component → useServiceFactory() → AppModeContext → ServiceFactory → Mock/Real Service
```

#### 3. Data Fetching
- **Demo Mode**: Immediate mock data responses
- **Live Mode**: Supabase queries with error handling
- **Feature Gating**: Premium features limited by subscription tier

### Integration Points

#### Cross-App Navigation
The app integrates with the RepSpheres ecosystem:
- **Market Data** (`marketdata.repspheres.com`)
- **Canvas** (`canvas.repspheres.com`) 
- **Podcast** (`podcast.repspheres.com`)
- **Main Site** (`repspheres.com`)

#### External Services
- **Supabase**: Database and authentication
- **Twilio**: Voice calling and SMS
- **Stripe**: Subscription management
- **Google AI**: Generative AI features
- **Netlify**: Hosting and serverless functions

### State Management

#### React Context Usage
- **AppModeContext**: Application mode and feature tier
- **AuthContext**: User authentication state
- **ThemeContext**: Theme selection and customization
- **SoundContext**: Audio feedback system
- **NotificationContext**: App-wide notifications

#### Data Persistence
- **Supabase**: Primary database (PostgreSQL)
- **Local Storage**: Theme preferences, app settings
- **Session Storage**: Temporary UI state

### Important Development Notes

#### Environment Variables
Required for full functionality:
- `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` (core database)
- `REACT_APP_TWILIO_*` variables (calling features)
- `STRIPE_*` variables (subscription management)

#### Build Configuration
- **Netlify deployment** with custom build command
- **Content Security Policy** configured for external integrations
- **Function support** for serverless backend operations

#### Error Handling
- Graceful fallback to demo mode when services fail
- Service factory handles missing API keys
- Mock data ensures app remains functional in all states

#### Mobile Considerations
- Responsive design with device type detection
- Performance optimizations for mobile devices
- Touch-friendly interface elements

### Testing Strategy
- **Service Factory**: Mock services enable comprehensive testing
- **Auth System**: Public mode allows testing without credentials
- **Theme System**: All themes testable in demo mode
- **API Integration**: Mock responses for reliable testing

This architecture enables the app to provide a full-featured demo experience while seamlessly upgrading to real data when users subscribe, making it an effective sales and conversion tool for the RepSpheres platform.