# How to Run the App Mode and Feature Tier System

This guide explains how to run the application with the new app mode and feature tier system, including how to test the different modes and tiers.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase project set up with the necessary tables
- Environment variables configured in `.env.local`

## Step 1: Apply Database Migrations

Before running the application, you need to apply the database migrations to create the necessary tables and insert initial data.

1. Make sure your Supabase credentials are set in your environment or `.env.local` file:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   SUPABASE_DB_HOST=your_db_host
   SUPABASE_DB_PORT=your_db_port
   SUPABASE_DB_NAME=your_db_name
   SUPABASE_DB_USER=your_db_user
   SUPABASE_DB_PASSWORD=your_db_password
   ```

2. Run the migration script:
   ```bash
   ./apply_app_mode_migrations.sh
   ```

3. Verify that the migrations were applied successfully by checking the output of the script.

## Step 2: Install Dependencies

If you haven't already, install the project dependencies:

```bash
npm install
# or
yarn install
```

## Step 3: Run the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application should now be running at http://localhost:3000 (or another port if configured differently).

## Step 4: Test the App Mode and Feature Tier System

### Testing the UI Toggles

1. Log in to the application
2. Look for the App Mode toggle in the header (shows "Demo" and "Live" options)
3. Look for the Feature Tier toggle in the header (shows "Basic" and "Premium" options)
4. Try switching between different modes and tiers

### Testing with Different User Types

To fully test the system, you should test with different types of users:

1. **Free User**:
   - Should only have access to Demo mode
   - Should only have access to Basic features
   - Attempting to switch to Live mode or Premium features should prompt for upgrade

2. **Professional Subscription User**:
   - Should have access to both Demo and Live modes
   - Should only have access to Basic features
   - Attempting to switch to Premium features should prompt for upgrade

3. **Insights Subscription User**:
   - Should have access to both Demo and Live modes
   - Should have access to both Basic and Premium features
   - Should be able to freely switch between all modes and tiers

### Testing the Subscription Page

1. Navigate to the Subscribe page
2. Test the billing cycle toggle (Monthly/Annual)
3. Verify that the pricing and features are displayed correctly for each tier

### Testing Service Behavior

To test that services behave differently based on mode and tier:

1. **Demo Mode**:
   - Services should return mock data
   - No real API calls should be made
   - Check the console for logs indicating mock data is being used

2. **Live Mode**:
   - Services should make real API calls
   - Real data should be displayed
   - Check the console for logs indicating real services are being used

3. **Basic Tier**:
   - Limited features should be available
   - Premium features should be hidden or prompt for upgrade

4. **Premium Tier**:
   - All features should be available
   - Enhanced analytics and insights should be displayed

## Troubleshooting

### Database Migration Issues

If you encounter issues with the database migrations:

1. Check that your Supabase credentials are correct
2. Verify that you have the necessary permissions to create tables and triggers
3. Look for error messages in the migration script output
4. Try running the SQL scripts manually through the Supabase dashboard

### UI Toggle Issues

If the UI toggles don't appear or don't work:

1. Check the browser console for errors
2. Verify that the AppModeContext is properly initialized in App.tsx
3. Check that the toggles are properly imported in the Header component

### Service Factory Issues

If services don't behave differently based on mode and tier:

1. Check that you're using the useServiceFactory hook to get services
2. Verify that the service implementations check the current mode and tier
3. Look for console logs indicating which service implementation is being used

## Additional Resources

- See `APP_MODE_FEATURE_TIER.md` for detailed documentation on the system
- Check the `src/contexts/AppModeContext.tsx` file for the context implementation
- Look at `src/services/serviceFactory.ts` for the service factory implementation
