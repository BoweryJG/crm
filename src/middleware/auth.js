const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Logger utility for consistent logging
 */
const logger = {
  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AUTH DEBUG] ${message}`, data || '');
    }
  },
  info: (message, data = null) => {
    console.log(`[AUTH INFO] ${message}`, data || '');
  },
  warn: (message, data = null) => {
    console.warn(`[AUTH WARN] ${message}`, data || '');
  },
  error: (message, error = null) => {
    console.error(`[AUTH ERROR] ${message}`, error || '');
  }
};

/**
 * Extract JWT token from request headers or cookies
 * @param {Request} req - Express request object
 * @returns {string|null} JWT token or null if not found
 */
const extractToken = (req) => {
  let token = null;

  // Check Authorization header first (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
    logger.debug('Token extracted from Authorization header');
  }

  // Check session cookie if no Bearer token
  if (!token && req.cookies) {
    // Check for Supabase session cookie
    const sessionCookie = req.cookies['sb-cbopynuvhcymbumjnvay-auth-token'];
    if (sessionCookie) {
      try {
        const sessionData = JSON.parse(sessionCookie);
        token = sessionData.access_token;
        logger.debug('Token extracted from session cookie');
      } catch (error) {
        logger.warn('Failed to parse session cookie', error.message);
      }
    }
  }

  // Check for custom auth cookie as fallback
  if (!token && req.cookies && req.cookies.auth_token) {
    token = req.cookies.auth_token;
    logger.debug('Token extracted from auth_token cookie');
  }

  return token;
};

/**
 * Verify JWT token using Supabase
 * @param {string} token - JWT token to verify
 * @returns {Promise<Object>} User data if valid, throws error if invalid
 */
const verifyToken = async (token) => {
  try {
    // Use Supabase to verify the JWT token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      logger.error('Token verification failed', error);
      throw new Error('Invalid token');
    }

    if (!user) {
      throw new Error('User not found');
    }

    logger.debug('Token verified successfully for user:', user.email);
    return user;
  } catch (error) {
    logger.error('Token verification error', error);
    throw error;
  }
};

/**
 * Validate session with Supabase
 * @param {string} token - JWT token
 * @returns {Promise<Object>} Session data if valid
 */
const validateSession = async (token) => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession(token);
    
    if (error) {
      logger.error('Session validation failed', error);
      throw new Error('Invalid session');
    }

    if (!session) {
      throw new Error('No active session');
    }

    // Check if session is expired
    if (session.expires_at && session.expires_at < Math.floor(Date.now() / 1000)) {
      throw new Error('Session expired');
    }

    logger.debug('Session validated successfully');
    return session;
  } catch (error) {
    logger.error('Session validation error', error);
    throw error;
  }
};

/**
 * Create user object with additional metadata
 * @param {Object} supabaseUser - User data from Supabase
 * @returns {Object} Enhanced user object
 */
const createUserObject = (supabaseUser) => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    user_metadata: supabaseUser.user_metadata || {},
    app_metadata: supabaseUser.app_metadata || {},
    created_at: supabaseUser.created_at,
    subscription: supabaseUser.user_metadata?.subscription || {
      tier: 'free',
      status: 'active'
    },
    isAdmin: supabaseUser.app_metadata?.roles?.includes('admin') || false
  };
};

/**
 * Handle authentication errors consistently
 * @param {Response} res - Express response object
 * @param {Error} error - Error object
 * @param {string} message - Custom error message
 */
const handleAuthError = (res, error, message = 'Authentication failed') => {
  logger.error(message, error);
  
  const statusCode = error.message?.includes('expired') ? 401 : 
                    error.message?.includes('Invalid') ? 401 : 
                    error.message?.includes('not found') ? 404 : 403;
  
  res.status(statusCode).json({
    error: message,
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

/**
 * Middleware that requires authentication
 * Validates JWT token and adds user info to req.user
 */
const requireAuth = async (req, res, next) => {
  try {
    logger.debug('RequireAuth middleware executing for:', req.path);
    
    // Extract token from request
    const token = extractToken(req);
    
    if (!token) {
      logger.warn('No token provided for protected route:', req.path);
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'No authentication token provided' 
      });
    }

    // Verify token with Supabase
    const supabaseUser = await verifyToken(token);
    
    // Validate session
    await validateSession(token);
    
    // Create enhanced user object
    const user = createUserObject(supabaseUser);
    
    // Add user info to request object
    req.user = user;
    req.token = token;
    
    logger.debug('User authenticated successfully:', user.email);
    next();
    
  } catch (error) {
    handleAuthError(res, error, 'Authentication required');
  }
};

/**
 * Middleware that optionally adds user info if token is present
 * Does not require authentication but adds user info if available
 */
const optionalAuth = async (req, res, next) => {
  try {
    logger.debug('OptionalAuth middleware executing for:', req.path);
    
    // Extract token from request
    const token = extractToken(req);
    
    if (!token) {
      logger.debug('No token provided for optional auth route:', req.path);
      req.user = null;
      req.token = null;
      return next();
    }

    try {
      // Verify token with Supabase
      const supabaseUser = await verifyToken(token);
      
      // Validate session (optional - don't fail if session is invalid)
      await validateSession(token);
      
      // Create enhanced user object
      const user = createUserObject(supabaseUser);
      
      // Add user info to request object
      req.user = user;
      req.token = token;
      
      logger.debug('User optionally authenticated:', user.email);
      
    } catch (authError) {
      logger.debug('Optional auth failed, continuing without user:', authError.message);
      req.user = null;
      req.token = null;
    }
    
    next();
    
  } catch (error) {
    logger.error('OptionalAuth middleware error:', error);
    // For optional auth, we don't fail the request
    req.user = null;
    req.token = null;
    next();
  }
};

/**
 * Middleware to check if user has admin role
 * Must be used after requireAuth middleware
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'This middleware requires prior authentication' 
    });
  }

  if (!req.user.isAdmin) {
    logger.warn('Admin access denied for user:', req.user.email);
    return res.status(403).json({ 
      error: 'Admin access required',
      message: 'You do not have permission to access this resource' 
    });
  }

  logger.debug('Admin access granted for user:', req.user.email);
  next();
};

/**
 * Middleware to check subscription tier
 * Must be used after requireAuth middleware
 */
const requireSubscription = (requiredTier = 'pro') => {
  const tierLevels = {
    'free': 0,
    'pro': 1,
    'genius': 2,
    'enterprise': 3
  };

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'This middleware requires prior authentication' 
      });
    }

    const userTier = req.user.subscription?.tier || 'free';
    const userLevel = tierLevels[userTier] || 0;
    const requiredLevel = tierLevels[requiredTier] || 0;

    if (userLevel < requiredLevel) {
      logger.warn(`Subscription tier ${requiredTier} required for user ${req.user.email}, has ${userTier}`);
      return res.status(403).json({ 
        error: 'Subscription upgrade required',
        message: `This feature requires a ${requiredTier} subscription`,
        currentTier: userTier,
        requiredTier: requiredTier
      });
    }

    logger.debug(`Subscription check passed for user ${req.user.email}: ${userTier} >= ${requiredTier}`);
    next();
  };
};

/**
 * Utility function to refresh user session
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} New session data
 */
const refreshUserSession = async (refreshToken) => {
  try {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error) {
      throw error;
    }

    logger.debug('Session refreshed successfully');
    return data;
  } catch (error) {
    logger.error('Session refresh failed', error);
    throw error;
  }
};

// Export middleware functions and utilities
module.exports = {
  requireAuth,
  optionalAuth,
  requireAdmin,
  requireSubscription,
  refreshUserSession,
  extractToken,
  verifyToken,
  validateSession,
  createUserObject,
  handleAuthError,
  logger
};