import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { emailService } from '../services/email/emailService';
import { translationService } from '../services/email/TranslationService';
import { emailAnalyticsService } from '../services/email/EmailAnalyticsService';

interface EmailContextType {
  // Email composition
  composeEmail: (options: ComposeEmailOptions) => void;
  replyToEmail: (originalEmail: any, content: string) => void;
  forwardEmail: (originalEmail: any, recipients: string[]) => void;
  
  // Templates
  loadTemplate: (templateId: string) => Promise<any>;
  saveTemplate: (template: any) => Promise<void>;
  
  // Translation
  translateText: (text: string, targetLanguage: string) => Promise<string>;
  detectLanguage: (text: string) => Promise<string>;
  
  // Analytics
  getEmailStats: () => Promise<any>;
  trackEmailOpen: (emailId: string) => void;
  trackEmailClick: (emailId: string, linkUrl: string) => void;
  
  // State
  isOnline: boolean;
  pendingEmails: number;
  lastSyncTime: Date | null;
  unreadCount: number;
  
  // Actions
  syncOfflineEmails: () => Promise<void>;
  refreshStats: () => Promise<void>;
  markAsRead: (emailId: string) => void;
}

interface ComposeEmailOptions {
  to?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject?: string;
  content?: string;
  template?: string;
  priority?: 'low' | 'normal' | 'high';
  scheduleAt?: Date;
  trackOpens?: boolean;
  trackClicks?: boolean;
  autoTranslate?: boolean;
  targetLanguage?: string;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

interface EmailProviderProps {
  children: ReactNode;
}

export const EmailProvider: React.FC<EmailProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingEmails, setPendingEmails] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Email composition
  const composeEmail = useCallback(async (options: ComposeEmailOptions) => {
    try {
      // Prepare email data
      const emailData = {
        to: Array.isArray(options.to) ? options.to.filter(Boolean) as string[] : [options.to].filter(Boolean) as string[],
        cc: Array.isArray(options.cc) ? options.cc.filter(Boolean) as string[] : [options.cc].filter(Boolean) as string[],
        bcc: Array.isArray(options.bcc) ? options.bcc.filter(Boolean) as string[] : [options.bcc].filter(Boolean) as string[],
        subject: options.subject || '',
        content: options.content || '',
        priority: options.priority || 'normal',
        scheduleAt: options.scheduleAt,
        trackOpens: options.trackOpens !== false,
        trackClicks: options.trackClicks !== false,
      };

      // Auto-translate if requested
      if (options.autoTranslate && options.targetLanguage) {
        const subjectResult = await translationService.translate({
          text: emailData.subject,
          sourceLanguage: 'auto',
          targetLanguage: options.targetLanguage
        });
        emailData.subject = subjectResult.translatedText;

        const contentResult = await translationService.translate({
          text: emailData.content,
          sourceLanguage: 'auto',
          targetLanguage: options.targetLanguage
        });
        emailData.content = contentResult.translatedText;
      }

      // Send email
      const result = await emailService.sendEmail(emailData);
      
      if (result.success) {
        console.log('Email sent successfully:', result);
      }

      return result;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }, []);

  const replyToEmail = useCallback(async (originalEmail: any, content: string) => {
    const replySubject = originalEmail.subject.startsWith('Re: ') 
      ? originalEmail.subject 
      : `Re: ${originalEmail.subject}`;
    
    return composeEmail({
      to: originalEmail.from,
      subject: replySubject,
      content: `${content}\n\n--- Original Message ---\n${originalEmail.content}`,
      priority: originalEmail.priority,
    });
  }, [composeEmail]);

  const forwardEmail = useCallback(async (originalEmail: any, recipients: string[]) => {
    const forwardSubject = originalEmail.subject.startsWith('Fwd: ') 
      ? originalEmail.subject 
      : `Fwd: ${originalEmail.subject}`;
    
    return composeEmail({
      to: recipients,
      subject: forwardSubject,
      content: `--- Forwarded Message ---\nFrom: ${originalEmail.from}\nDate: ${originalEmail.date}\nSubject: ${originalEmail.subject}\n\n${originalEmail.content}`,
    });
  }, [composeEmail]);

  // Templates
  const loadTemplate = useCallback(async (templateId: string) => {
    try {
      // Placeholder template loading
      return { id: templateId, subject: 'Template Subject', content: 'Template Content' };
    } catch (error) {
      console.error('Failed to load template:', error);
      throw error;
    }
  }, []);

  const saveTemplate = useCallback(async (template: any): Promise<void> => {
    try {
      // Placeholder template saving
      console.log('Saving template:', template);
    } catch (error) {
      console.error('Failed to save template:', error);
      throw error;
    }
  }, []);

  // Translation
  const translateText = useCallback(async (text: string, targetLanguage: string) => {
    try {
      const result = await translationService.translate({
        text,
        sourceLanguage: 'auto',
        targetLanguage
      });
      return result.translatedText;
    } catch (error) {
      console.error('Translation failed:', error);
      throw error;
    }
  }, []);

  const detectLanguage = useCallback(async (text: string) => {
    try {
      const result = await translationService.detectLanguage(text);
      return result.language;
    } catch (error) {
      console.error('Language detection failed:', error);
      throw error;
    }
  }, []);

  // Analytics
  const getEmailStats = useCallback(async () => {
    // Placeholder analytics
    return { sent: 0, delivered: 0, opened: 0, clicked: 0, unreadCount: 0, pendingCount: 0 };
  }, []);

  const trackEmailOpen = useCallback(async (emailId: string) => {
    try {
      // Placeholder email tracking
      console.log('Email opened:', emailId);
    } catch (error) {
      console.error('Failed to track email open:', error);
    }
  }, []);

  const trackEmailClick = useCallback(async (emailId: string, linkUrl: string) => {
    try {
      // Placeholder click tracking
      console.log('Email clicked:', emailId, linkUrl);
    } catch (error) {
      console.error('Failed to track email click:', error);
    }
  }, []);

  // Sync and state management
  const syncOfflineEmails = useCallback(async () => {
    try {
      // Placeholder offline sync
      console.log('Syncing offline emails...');
      setLastSyncTime(new Date());
      await refreshStats();
    } catch (error) {
      console.error('Failed to sync offline emails:', error);
      throw error;
    }
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const stats = await getEmailStats();
      setUnreadCount(stats.unreadCount || 0);
      setPendingEmails(stats.pendingCount || 0);
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    }
  }, [getEmailStats]);

  const markAsRead = useCallback(async (emailId: string) => {
    try {
      // Placeholder mark as read
      console.log('Marking as read:', emailId);
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }, []);

  // Online/offline detection
  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineEmails();
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncOfflineEmails]);

  // Auto-refresh stats periodically
  React.useEffect(() => {
    const interval = setInterval(refreshStats, 30000); // Every 30 seconds
    refreshStats(); // Initial load

    return () => clearInterval(interval);
  }, [refreshStats]);

  const value: EmailContextType = {
    // Email composition
    composeEmail,
    replyToEmail,
    forwardEmail,
    
    // Templates
    loadTemplate,
    saveTemplate,
    
    // Translation
    translateText,
    detectLanguage,
    
    // Analytics
    getEmailStats,
    trackEmailOpen,
    trackEmailClick,
    
    // State
    isOnline,
    pendingEmails,
    lastSyncTime,
    unreadCount,
    
    // Actions
    syncOfflineEmails,
    refreshStats,
    markAsRead,
  };

  return <EmailContext.Provider value={value}>{children}</EmailContext.Provider>;
};

export const useEmailClient = (): EmailContextType => {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error('useEmailClient must be used within an EmailProvider');
  }
  return context;
};

// Convenience hooks for specific features
export const useEmailComposer = () => {
  const { composeEmail, replyToEmail, forwardEmail } = useEmailClient();
  return { composeEmail, replyToEmail, forwardEmail };
};

export const useEmailTranslation = () => {
  const { translateText, detectLanguage } = useEmailClient();
  return { translateText, detectLanguage };
};

export const useEmailAnalytics = () => {
  const { getEmailStats, trackEmailOpen, trackEmailClick, refreshStats } = useEmailClient();
  return { getEmailStats, trackEmailOpen, trackEmailClick, refreshStats };
};

export const useEmailState = () => {
  const { isOnline, pendingEmails, lastSyncTime, unreadCount } = useEmailClient();
  return { isOnline, pendingEmails, lastSyncTime, unreadCount };
};

export default useEmailClient;