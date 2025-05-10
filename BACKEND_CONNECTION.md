# Backend Connection Documentation

This document outlines how the SphereOsCrM frontend connects to the backend API.

## Overview

The frontend connects to the backend API at `https://osbackend-zl1h.onrender.com` using Axios for HTTP requests. The connection is primarily used for AI-related operations through the OpenRouter service.

## Implementation Details

### Environment Configuration

The backend URL is configured in the `.env.local` file:

```
REACT_APP_BACKEND_URL=https://osbackend-zl1h.onrender.com
```

### Connection Points

The frontend connects to the backend at the following endpoints:

1. **Webhook Endpoint** (`/webhook`)
   - Used for AI prompt processing
   - Handles requests from the `openRouterService.ts` file
   - Provides fallback to mock data if the backend is unavailable

2. **Health Endpoint** (`/health`)
   - Used to check if the backend is available
   - Simple GET request that returns status information

3. **Usage Endpoint** (`/user/usage`)
   - Retrieves usage statistics for the current user
   - Used for tracking API usage and quotas

### Error Handling

The implementation includes robust error handling:

- If the backend is unavailable, the AI services fall back to mock data
- A warning message is displayed to the user when using fallback data
- Console logging provides detailed error information for debugging

## Testing the Connection

A test script is included to verify the backend connection:

```bash
npm run test:backend
```

This script:
1. Tests the `/health` endpoint
2. Tests the `/webhook` endpoint with a simple prompt
3. Tests the `/user/usage` endpoint
4. Provides troubleshooting tips if the tests fail

## Troubleshooting

If you experience issues with the backend connection:

1. Check if the backend is running and accessible
2. Verify the `REACT_APP_BACKEND_URL` in your `.env.local` file
3. Check if your network allows connections to the backend URL
4. Look for any CORS issues in the browser console
5. Examine the browser's network tab for more details on failed requests

## Local Development

For local development, you may want to point to a local backend instance:

1. Update your `.env.local` file:
   ```
   REACT_APP_BACKEND_URL=http://localhost:3001
   ```

2. Start your local backend on port 3001
3. Run the frontend with `npm start`
4. Test the connection with `npm run test:backend`
