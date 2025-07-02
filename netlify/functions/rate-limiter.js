// Simple in-memory rate limiter for Netlify Functions
// For production, consider using Redis or a dedicated rate limiting service

const requestCounts = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

function cleanupOldEntries() {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now - data.firstRequest > WINDOW_MS) {
      requestCounts.delete(key);
    }
  }
}

function getRateLimitKey(event) {
  // Use IP address as the key for rate limiting
  const forwarded = event.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0] : event.headers['client-ip'] || 'unknown';
  return ip;
}

export function checkRateLimit(event, options = {}) {
  const maxRequests = options.maxRequests || MAX_REQUESTS;
  const windowMs = options.windowMs || WINDOW_MS;
  
  cleanupOldEntries();
  
  const key = getRateLimitKey(event);
  const now = Date.now();
  
  if (!requestCounts.has(key)) {
    requestCounts.set(key, {
      count: 1,
      firstRequest: now
    });
    return { allowed: true, remaining: maxRequests - 1 };
  }
  
  const data = requestCounts.get(key);
  const timeSinceFirst = now - data.firstRequest;
  
  if (timeSinceFirst > windowMs) {
    // Reset the window
    requestCounts.set(key, {
      count: 1,
      firstRequest: now
    });
    return { allowed: true, remaining: maxRequests - 1 };
  }
  
  if (data.count >= maxRequests) {
    return { 
      allowed: false, 
      remaining: 0,
      resetTime: data.firstRequest + windowMs
    };
  }
  
  data.count++;
  return { allowed: true, remaining: maxRequests - data.count };
}

export function rateLimitResponse(resetTime) {
  return {
    statusCode: 429,
    headers: {
      'Content-Type': 'application/json',
      'X-RateLimit-Limit': MAX_REQUESTS.toString(),
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': new Date(resetTime).toISOString(),
      'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString()
    },
    body: JSON.stringify({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.'
    })
  };
}