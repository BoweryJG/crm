# Google Analytics Setup for TryYomi

## Current Status
Google Analytics tracking has been implemented with the following events:

### Page Views
- Automatic page views on index.html and simulation.html

### Custom Events
1. **Authentication Events**
   - `sign_in_attempt` - When user attempts to sign in (with method: google/facebook)
   - `sign_in_error` - When sign in fails (with method and error message)
   - `auth_required_shown` - When auth modal is shown because authentication is required

2. **Simulation Events**
   - `start_simulation_clicked` - When user clicks "Start Simulation" button
   - `simulation_started` - When simulation actually starts (with user_id)
   - `method_selected` - When user selects a surgical method (freehand/static/yomi)

## Configuration
All configuration is centralized in `config.js`:
- Replace `G-XXXXXXXXXX` with your actual Google Analytics 4 Measurement ID
- The Supabase configuration is also stored in this file

## Next Steps
1. Create a Google Analytics 4 property at https://analytics.google.com
2. Get your Measurement ID (format: G-XXXXXXXXXX)
3. Update `config.js` with your actual Measurement ID
4. Deploy and verify events are being tracked

## Testing
To test if GA is working:
1. Open Chrome DevTools
2. Go to Network tab
3. Filter by "collect" 
4. Interact with the app and verify GA requests are being sent