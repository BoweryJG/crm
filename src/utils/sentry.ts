import * as Sentry from '@sentry/react';
import { logger } from './logger';

// Initialize Sentry only in production
export function initSentry() {
  const dsn = process.env.REACT_APP_SENTRY_DSN;
  const environment = process.env.NODE_ENV || 'development';
  
  if (!dsn) {
    logger.warn('Sentry DSN not configured. Error monitoring disabled.');
    return;
  }

  if (environment === 'production') {
    Sentry.init({
      dsn,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      environment,
      tracesSampleRate: 0.1, // 10% of transactions
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
      beforeSend(event, hint) {
        // Filter out sensitive information
        if (event.request?.cookies) {
          delete event.request.cookies;
        }
        
        // Don't send events in development
        if (environment !== 'production') {
          return null;
        }
        
        // Log the error locally as well
        logger.error('Sentry error captured:', hint.originalException);
        
        return event;
      },
    });
    
    logger.info('Sentry error monitoring initialized');
  } else {
    logger.info('Sentry disabled in development environment');
  }
}

// Export Sentry for use in error boundaries and manual error capture
export { Sentry };