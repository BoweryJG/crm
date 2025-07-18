/**
 * Example usage of the authentication middleware
 * This file demonstrates how to use the auth middleware in your Express routes
 */

const express = require('express');
const cookieParser = require('cookie-parser');
const { 
  requireAuth, 
  optionalAuth, 
  requireAdmin, 
  requireSubscription 
} = require('./auth');

const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser()); // Required for reading cookies

// Example routes using different auth middleware

// 1. Public route - no authentication required
app.get('/api/public', (req, res) => {
  res.json({ message: 'This is a public endpoint' });
});

// 2. Optional authentication - user info added if token present
app.get('/api/dashboard', optionalAuth, (req, res) => {
  if (req.user) {
    res.json({ 
      message: `Welcome back, ${req.user.email}!`,
      user: req.user,
      isAuthenticated: true
    });
  } else {
    res.json({ 
      message: 'Welcome, guest!',
      isAuthenticated: false
    });
  }
});

// 3. Protected route - authentication required
app.get('/api/profile', requireAuth, (req, res) => {
  res.json({
    message: 'This is your protected profile',
    user: req.user
  });
});

// 4. Admin only route - requires authentication + admin role
app.get('/api/admin/users', requireAuth, requireAdmin, (req, res) => {
  res.json({
    message: 'Admin access granted',
    user: req.user,
    data: 'Sensitive admin data here'
  });
});

// 5. Subscription-gated route - requires pro subscription
app.get('/api/premium/features', requireAuth, requireSubscription('pro'), (req, res) => {
  res.json({
    message: 'Premium features access',
    user: req.user,
    features: ['Advanced analytics', 'Priority support']
  });
});

// 6. Enterprise route - requires enterprise subscription
app.get('/api/enterprise/dashboard', requireAuth, requireSubscription('enterprise'), (req, res) => {
  res.json({
    message: 'Enterprise dashboard access',
    user: req.user,
    features: ['White-label', 'Custom integrations', 'Dedicated support']
  });
});

// 7. Route with custom error handling
app.get('/api/contacts', requireAuth, async (req, res) => {
  try {
    // Your business logic here
    const contacts = []; // Fetch from database
    
    res.json({
      message: 'Contacts retrieved successfully',
      user: req.user,
      contacts: contacts
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve contacts',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;