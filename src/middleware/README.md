# RepConnect Authentication Middleware

This middleware provides authentication and authorization for your RepConnect backend API using Supabase JWT tokens.

## Features

- **JWT Token Verification**: Validates tokens using Supabase
- **Multiple Token Sources**: Supports both Authorization headers and cookies
- **Session Validation**: Ensures sessions are active and not expired
- **Flexible Authentication**: Required and optional authentication modes
- **Role-Based Access**: Admin and subscription-tier authorization
- **Comprehensive Logging**: Debug and error logging for troubleshooting
- **Error Handling**: Consistent error responses with proper HTTP status codes

## Installation

Make sure you have the required dependencies:

```bash
npm install @supabase/supabase-js jsonwebtoken cookie-parser
```

## Environment Variables

Set the following environment variables:

```bash
# Required
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional (for development)
NODE_ENV=development
```

## Usage

### Basic Setup

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const { requireAuth, optionalAuth } = require('./middleware/auth');

const app = express();

// Required middleware
app.use(express.json());
app.use(cookieParser()); // Required for cookie support

// Use the auth middleware
app.get('/api/protected', requireAuth, (req, res) => {
  res.json({ user: req.user });
});
```

### Available Middleware Functions

#### `requireAuth`
Requires valid authentication. Blocks request if no valid token is provided.

```javascript
app.get('/api/profile', requireAuth, (req, res) => {
  // req.user will contain authenticated user info
  res.json({ user: req.user });
});
```

#### `optionalAuth`
Adds user info if token is present, but doesn't require authentication.

```javascript
app.get('/api/dashboard', optionalAuth, (req, res) => {
  if (req.user) {
    res.json({ message: `Welcome back, ${req.user.email}!` });
  } else {
    res.json({ message: 'Welcome, guest!' });
  }
});
```

#### `requireAdmin`
Requires admin role. Must be used after `requireAuth`.

```javascript
app.get('/api/admin/users', requireAuth, requireAdmin, (req, res) => {
  // Only admin users can access this
  res.json({ adminData: 'sensitive data' });
});
```

#### `requireSubscription(tier)`
Requires specific subscription tier. Must be used after `requireAuth`.

```javascript
// Require Pro subscription
app.get('/api/premium', requireAuth, requireSubscription('pro'), (req, res) => {
  res.json({ premiumFeatures: true });
});

// Require Enterprise subscription
app.get('/api/enterprise', requireAuth, requireSubscription('enterprise'), (req, res) => {
  res.json({ enterpriseFeatures: true });
});
```

## Token Sources

The middleware supports multiple token sources:

### 1. Authorization Header (Recommended)
```javascript
// Client-side
fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### 2. Session Cookie
The middleware automatically reads Supabase session cookies:
```javascript
// Cookie name: sb-cbopynuvhcymbumjnvay-auth-token
// Format: JSON containing access_token
```

### 3. Custom Auth Cookie
```javascript
// Cookie name: auth_token
// Format: JWT token string
```

## User Object Structure

After authentication, `req.user` contains:

```javascript
{
  id: 'user-uuid',
  email: 'user@example.com',
  user_metadata: {
    full_name: 'John Doe',
    avatar_url: 'https://...',
    company: 'Company Name'
  },
  app_metadata: {
    provider: 'email',
    providers: ['email'],
    roles: ['user'] // or ['admin']
  },
  created_at: '2023-01-01T00:00:00Z',
  subscription: {
    tier: 'pro', // 'free', 'pro', 'genius', 'enterprise'
    status: 'active'
  },
  isAdmin: false
}
```

## Error Responses

The middleware returns consistent error responses:

```javascript
// 401 Unauthorized
{
  "error": "Authentication required",
  "message": "No authentication token provided"
}

// 403 Forbidden
{
  "error": "Admin access required",
  "message": "You do not have permission to access this resource"
}

// 401 Token Expired
{
  "error": "Authentication required",
  "details": "Session expired"
}
```

## Subscription Tiers

The middleware supports four subscription tiers:

- **free** (level 0): Basic access
- **pro** (level 1): Professional features
- **genius** (level 2): Advanced features
- **enterprise** (level 3): Enterprise features

Higher tiers include access to lower tier features.

## Logging

The middleware includes comprehensive logging:

- **Debug**: Token extraction, verification steps (development only)
- **Info**: Successful authentications
- **Warn**: Access denied, invalid tokens
- **Error**: Authentication failures, system errors

## Utility Functions

### `refreshUserSession(refreshToken)`
Manually refresh a user session:

```javascript
const { refreshUserSession } = require('./middleware/auth');

try {
  const newSession = await refreshUserSession(refreshToken);
  console.log('Session refreshed:', newSession);
} catch (error) {
  console.error('Refresh failed:', error);
}
```

### `extractToken(req)`
Extract token from request:

```javascript
const { extractToken } = require('./middleware/auth');

const token = extractToken(req);
if (token) {
  console.log('Token found:', token);
}
```

## Best Practices

1. **Always use HTTPS** in production
2. **Set secure cookie flags** for session cookies
3. **Implement token refresh** for long-lived sessions
4. **Use requireAuth for sensitive endpoints**
5. **Use optionalAuth for public endpoints with personalization**
6. **Implement proper error handling** in your routes
7. **Monitor authentication logs** for security issues

## Example Implementation

See `auth-example.js` for a complete example of using all middleware functions.

## Security Considerations

- Tokens are verified against Supabase for each request
- Sessions are validated for expiration
- Admin roles are checked server-side
- Subscription tiers are enforced at the middleware level
- All authentication errors are logged for monitoring