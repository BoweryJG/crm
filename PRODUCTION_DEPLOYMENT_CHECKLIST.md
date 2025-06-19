# Production Deployment Checklist

## Pre-Deployment Steps

### 1. Environment Configuration
- [ ] Create `.env.production` file with all required keys:
  ```env
  REACT_APP_SUPABASE_URL=your_production_url
  REACT_APP_SUPABASE_ANON_KEY=your_production_anon_key
  REACT_APP_OPENAI_API_KEY=your_openai_key
  REACT_APP_OPENROUTER_API_KEY=your_openrouter_key
  REACT_APP_TWILIO_ACCOUNT_SID=your_twilio_sid
  REACT_APP_TWILIO_AUTH_TOKEN=your_twilio_token
  REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_key
  ```

### 2. Database Setup
- [ ] Run all Supabase migrations in production
- [ ] Verify RLS policies are enabled
- [ ] Check indexes on frequently queried columns
- [ ] Set up database backups

### 3. API Keys Security
- [ ] Store sensitive keys in environment variables only
- [ ] Never commit API keys to repository
- [ ] Set up key rotation schedule
- [ ] Configure rate limiting for API endpoints

### 4. Code Updates Required
1. **Replace current Sidebar.tsx**
   ```bash
   mv src/components/layout/Sidebar_UPDATED.tsx src/components/layout/Sidebar.tsx
   ```

2. **Update App.tsx with new routes**
   ```bash
   mv src/App_UPDATED_ROUTES.tsx src/App.tsx
   ```

3. **Integrate Transcription Service**
   - Update `twilioCallService.ts` to use real transcription
   - Connect to `transcriptionService.ts`

### 5. Build Optimization
- [ ] Run production build: `npm run build`
- [ ] Check bundle size: < 2MB for main chunk
- [ ] Enable code splitting for SUIS modules
- [ ] Implement lazy loading for heavy components

### 6. Testing Checklist
- [ ] Test all navigation paths
- [ ] Verify SUIS components load correctly
- [ ] Test call transcription with real audio
- [ ] Check responsive design on mobile
- [ ] Test error boundaries
- [ ] Verify demo mode still works

## Deployment Steps

### 1. Staging Deployment
```bash
# Build for staging
npm run build:staging

# Deploy to staging environment
netlify deploy --dir=build --alias=staging

# Run integration tests
npm run test:integration
```

### 2. Production Deployment
```bash
# Build for production
npm run build

# Deploy to production
netlify deploy --dir=build --prod

# Verify deployment
curl -I https://your-domain.com
```

### 3. Post-Deployment Verification
- [ ] Check all environment variables are loaded
- [ ] Test authentication flow
- [ ] Verify Supabase connection
- [ ] Test Twilio integration
- [ ] Check Stripe subscription flow
- [ ] Monitor error logs for 24 hours

## Monitoring Setup

### 1. Error Tracking
- [ ] Set up Sentry for error monitoring
- [ ] Configure error boundaries
- [ ] Set up alerts for critical errors

### 2. Performance Monitoring
- [ ] Set up Google Analytics
- [ ] Configure performance monitoring
- [ ] Set up uptime monitoring

### 3. API Usage Tracking
- [ ] Monitor OpenAI API usage
- [ ] Track OpenRouter API calls
- [ ] Monitor Twilio usage
- [ ] Set up cost alerts

## Rollback Plan

### If Issues Occur:
1. **Immediate Rollback**
   ```bash
   netlify rollback
   ```

2. **Database Rollback**
   - Restore from latest backup
   - Revert migrations if needed

3. **Feature Flags**
   - Disable problematic features
   - Gradually re-enable after fixes

## Security Checklist

- [ ] HTTPS enabled on all endpoints
- [ ] CORS properly configured
- [ ] Authentication required for all protected routes
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] SQL injection prevention (via Supabase RLS)
- [ ] Rate limiting on API endpoints
- [ ] Secure storage of audio recordings

## Performance Checklist

- [ ] Images optimized and lazy loaded
- [ ] CSS and JS minified
- [ ] Gzip compression enabled
- [ ] CDN configured for static assets
- [ ] Service worker for offline support
- [ ] Database queries optimized

## Final Checks

- [ ] All console.logs removed
- [ ] Error messages are user-friendly
- [ ] Loading states for all async operations
- [ ] Proper SEO meta tags
- [ ] Favicon and app icons updated
- [ ] Terms of Service and Privacy Policy linked
- [ ] Contact/support information visible

## Go-Live Communication

1. **Internal Team**
   - Notify development team
   - Alert customer support
   - Update documentation

2. **Users**
   - Send launch announcement
   - Provide feature tutorials
   - Set up support channels

## Success Metrics (First Week)

- [ ] < 1% error rate
- [ ] < 2s average page load time
- [ ] > 95% uptime
- [ ] < 100ms API response time
- [ ] Positive user feedback
- [ ] No critical security issues