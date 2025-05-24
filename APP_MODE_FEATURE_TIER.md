# App Mode and Feature Tier System

This document explains the app mode and feature tier system implemented in SphereOS CRM. This system allows users to switch between demo/live modes and basic/premium feature tiers.

## Overview

The application supports two distinct concepts:

1. **App Mode**: Controls whether the app is using real data (`live`) or mock data (`demo`)
2. **Feature Tier**: Controls which features are available to the user (`basic` or `premium`)

These two concepts are independent of each other, allowing for four possible combinations:

- Demo mode + Basic features
- Demo mode + Premium features
- Live mode + Basic features
- Live mode + Premium features

## App Mode

### Demo Mode

- Uses mock data generated on the fly
- No real API calls to external services
- Safe for testing and demonstrations
- Available to all users, including those without a subscription

### Live Mode

- Uses real data from the database and external APIs
- Makes actual API calls to services like Twilio
- Requires an active subscription
- Used for production use cases

## Feature Tier

### Basic Tier

- Core functionality of the application
- Limited analytics and insights
- Available to all users with a Professional subscription

### Premium Tier

- Advanced analytics and insights
- Enhanced linguistics analysis
- AI-powered features
- Requires an Insights subscription

## Implementation Details

### Context Provider

The `AppModeProvider` in `src/contexts/AppModeContext.tsx` manages both the app mode and feature tier. It provides:

- Current mode and tier states
- Functions to change mode and tier
- Helper properties like `isDemo`, `isLive`, `isBasic`, `isPremium`
- Access control properties like `canAccessLiveMode` and `canAccessPremiumFeatures`

### Service Factory

The `serviceFactory.ts` implements the logic for providing different service implementations based on the current mode and tier:

- In demo mode, it returns mock implementations that generate fake data
- In live mode, it returns real implementations that interact with the database and external APIs
- For premium features, it checks the feature tier before providing enhanced functionality

### UI Components

Several UI components are provided to interact with the mode and tier system:

- `AppModeToggle`: Allows users to switch between demo and live modes
- `FeatureTierToggle`: Allows users to switch between basic and premium features
- `SubscriptionUpgradeModal`: Shown when a user tries to access live mode without a subscription
- `FeatureUpgradeModal`: Shown when a user tries to access premium features without the required subscription

### Database Schema

Two tables in the database store user preferences and subscription information:

- `app_settings`: Stores user preferences for app mode and feature tier
- `user_subscriptions`: Stores subscription information including tier and billing cycle

## How to Implement New Features

When implementing new features, consider the following:

### For Mode-Aware Features

1. Use the `useAppMode` hook to access the current mode:
   ```typescript
   const { mode, isDemo, isLive } = useAppMode();
   ```

2. Conditionally render or behave based on the mode:
   ```typescript
   {isLive && <RealDataComponent />}
   {isDemo && <MockDataComponent />}
   ```

3. For services, use the `useServiceFactory` hook to get the appropriate service implementation:
   ```typescript
   const { linguisticsService } = useServiceFactory();
   // linguisticsService will automatically use the right implementation based on mode
   ```

### For Tier-Restricted Features

1. Use the `useAppMode` hook to access the current feature tier:
   ```typescript
   const { featureTier, isPremium, canAccessPremiumFeatures } = useAppMode();
   ```

2. Conditionally render premium features:
   ```typescript
   {isPremium && <PremiumFeatureComponent />}
   {!isPremium && <BasicFeatureComponent />}
   ```

3. For premium features that require a subscription, check access before showing:
   ```typescript
   const handleUsePremiumFeature = () => {
     if (!canAccessPremiumFeatures) {
       // This will show the upgrade modal
       setFeatureTier('premium');
       return;
     }
     
     // Proceed with premium feature
   };
   ```

4. In services, implement tier-aware functionality:
   ```typescript
   const getAnalytics = () => {
     if (isPremium) {
       return getDetailedAnalytics();
     } else {
       return getBasicAnalytics();
     }
   };
   ```

## Subscription Management

The subscription system is integrated with Stripe for payment processing. When a user subscribes:

1. Their subscription tier is stored in the `user_subscriptions` table
2. The `canAccessLiveMode` and `canAccessPremiumFeatures` properties are updated based on their subscription
3. If they try to use a feature they don't have access to, they are prompted to upgrade

## Testing

When testing, you can use the toggles in the header to switch between modes and tiers. This allows you to test all four combinations of mode and tier without needing to change your subscription.

## Best Practices

1. Always use the service factory to get service implementations
2. Check for premium feature access before using premium features
3. Provide graceful fallbacks for users without premium access
4. Use the `isDemo` and `isPremium` helpers for conditional rendering
5. Consider adding visual indicators for premium features
