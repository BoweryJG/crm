import { AppMode, useAppMode } from '../contexts/AppModeContext';
import * as mockDataService from './mockData/mockDataService';
import * as mockLinguisticsData from './mockData/mockLinguisticsData';
import { LinguisticsService } from './linguistics/linguisticsService';
import { CallAnalysisService } from './callAnalysis/callAnalysisService';
import { CallAnalysis, LinguisticsAnalysis } from '../types';

/**
 * Service factory that provides mode-aware services
 * This factory will return either real or mock services based on the current app mode
 */
export const createServiceFactory = (mode: AppMode) => {
  const isDemo = mode === 'demo';
  
  // Enhanced linguistics service with mode awareness
  const linguisticsService = {
    getAllLinguisticsAnalyses: async (): Promise<LinguisticsAnalysis[]> => {
      if (isDemo) {
        return mockLinguisticsData.generateMultipleMockLinguisticsAnalyses(20);
      } else {
        return LinguisticsService.getAllLinguisticsAnalyses();
      }
    },
    
    getLinguisticsAnalysisById: async (id: string): Promise<LinguisticsAnalysis | null> => {
      if (isDemo) {
        const allAnalyses = mockLinguisticsData.generateMultipleMockLinguisticsAnalyses(50);
        return allAnalyses.find(analysis => analysis.id === id) || null;
      } else {
        return LinguisticsService.getLinguisticsAnalysisById(id);
      }
    },
    
    createLinguisticsAnalysis: async (analysis: Omit<LinguisticsAnalysis, 'id'>): Promise<LinguisticsAnalysis | null> => {
      if (isDemo) {
        // In demo mode, just return a mock analysis
        const mockAnalysis = mockLinguisticsData.generateMultipleMockLinguisticsAnalyses(1)[0];
        return {
          ...mockAnalysis,
          ...analysis,
        };
      } else {
        return LinguisticsService.createLinguisticsAnalysis(analysis);
      }
    },
    
    updateLinguisticsAnalysis: async (id: string, updates: Partial<LinguisticsAnalysis>): Promise<LinguisticsAnalysis | null> => {
      if (isDemo) {
        // In demo mode, just return a mock updated analysis
        const mockAnalysis = mockLinguisticsData.generateMultipleMockLinguisticsAnalyses(1)[0];
        return {
          ...mockAnalysis,
          ...updates,
          id,
        };
      } else {
        return LinguisticsService.updateLinguisticsAnalysis(id, updates);
      }
    },
    
    deleteLinguisticsAnalysis: async (id: string): Promise<boolean> => {
      if (isDemo) {
        // In demo mode, just return success
        return true;
      } else {
        return LinguisticsService.deleteLinguisticsAnalysis(id);
      }
    },
    
    getLinguisticsAnalysesByCallId: async (callId: string): Promise<LinguisticsAnalysis[]> => {
      if (isDemo) {
        // In demo mode, generate a few mock analyses and pretend they're for this call
        return mockLinguisticsData.generateMultipleMockLinguisticsAnalyses(3).map(analysis => ({
          ...analysis,
          call_id: callId,
        }));
      } else {
        return LinguisticsService.getLinguisticsAnalysesByCallId(callId);
      }
    },
    
    getSentimentTrends: async (timeframe: 'day' | 'week' | 'month' = 'week'): Promise<any[]> => {
      if (isDemo) {
        // Generate mock sentiment trends
        const days = timeframe === 'day' ? 1 : timeframe === 'week' ? 7 : 30;
        return Array.from({ length: days }, (_, i) => ({
          date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          average_sentiment: parseFloat((Math.random() * 1.6 - 0.8).toFixed(2)),
          call_count: Math.floor(Math.random() * 10) + 1,
        }));
      } else {
        return LinguisticsService.getSentimentTrends(timeframe);
      }
    },
    
    getKeyPhraseFrequency: async (): Promise<any[]> => {
      if (isDemo) {
        // Generate mock key phrase frequency
        const phrases = [
          'dental implants', 'pricing options', 'follow-up demo', 'competitor comparison',
          'patient outcomes', 'financing plans', 'clinical studies', 'training program',
          'warranty coverage', 'implementation timeline'
        ];
        
        return phrases.map(phrase => ({
          phrase,
          count: Math.floor(Math.random() * 20) + 1,
          sentiment: parseFloat((Math.random() * 1.6 - 0.8).toFixed(2)),
        }));
      } else {
        return LinguisticsService.getKeyPhraseFrequency();
      }
    },
    
    submitCallForAnalysis: async (callId: string, audioUrl: string, transcript?: string): Promise<{ analysisId: string; status: string }> => {
      if (isDemo) {
        // In demo mode, just return a mock analysis ID
        return {
          analysisId: `demo-${Math.random().toString(36).substring(2, 15)}`,
          status: 'pending'
        };
      } else {
        return LinguisticsService.submitCallForAnalysis(callId, audioUrl, transcript);
      }
    },
    
    getAnalysisById: async (analysisId: string): Promise<any> => {
      if (isDemo) {
        // In demo mode, return a mock analysis
        const mockAnalysis = mockLinguisticsData.generateMultipleMockLinguisticsAnalyses(1)[0];
        return {
          ...mockAnalysis,
          id: analysisId,
        };
      } else {
        return LinguisticsService.getAnalysisById(analysisId);
      }
    },
    
    getAnalysisStatus: async (analysisId: string): Promise<'pending' | 'processing' | 'completed' | 'failed' | 'not_found'> => {
      if (isDemo) {
        // In demo mode, randomly return a status, but mostly 'completed'
        const statuses: ('pending' | 'processing' | 'completed' | 'failed' | 'not_found')[] = [
          'completed', 'completed', 'completed', 'completed', 'completed',
          'pending', 'processing', 'failed', 'not_found'
        ];
        return statuses[Math.floor(Math.random() * statuses.length)];
      } else {
        return LinguisticsService.getAnalysisStatus(analysisId);
      }
    }
  };
  
  // Enhanced call analysis service with mode awareness
  const callAnalysisService = {
    getAllCallAnalyses: async (): Promise<CallAnalysis[]> => {
      if (isDemo) {
        return mockLinguisticsData.generateMultipleMockCallAnalysesWithLinguistics(20);
      } else {
        return CallAnalysisService.getAllCallAnalyses();
      }
    },
    
    getCallAnalyses: async (filters: any): Promise<CallAnalysis[]> => {
      if (isDemo) {
        // In demo mode, generate mock call analyses and apply basic filtering
        let mockCalls = mockLinguisticsData.generateMultipleMockCallAnalysesWithLinguistics(50);
        
        // Apply some basic filtering if possible
        if (filters.startDate) {
          mockCalls = mockCalls.filter(call => new Date(call.call_date) >= new Date(filters.startDate));
        }
        
        if (filters.endDate) {
          mockCalls = mockCalls.filter(call => new Date(call.call_date) <= new Date(filters.endDate));
        }
        
        if (filters.contactId) {
          mockCalls = mockCalls.filter(call => call.contact_id === filters.contactId);
        }
        
        if (filters.practiceId) {
          mockCalls = mockCalls.filter(call => call.practice_id === filters.practiceId);
        }
        
        return mockCalls.slice(0, 20); // Return at most 20 calls
      } else {
        return CallAnalysisService.getCallAnalyses(filters);
      }
    },
    
    getCallAnalysisById: async (id: string): Promise<CallAnalysis | null> => {
      if (isDemo) {
        const mockCalls = mockLinguisticsData.generateMultipleMockCallAnalysesWithLinguistics(50);
        return mockCalls.find(call => call.id === id) || null;
      } else {
        return CallAnalysisService.getCallAnalysisById(id);
      }
    },
    
    createCallAnalysis: async (callAnalysis: Omit<CallAnalysis, 'id' | 'created_at' | 'updated_at'>): Promise<CallAnalysis | null> => {
      if (isDemo) {
        // In demo mode, just return a mock call analysis
        const mockCall = mockLinguisticsData.generateMultipleMockCallAnalysesWithLinguistics(1)[0];
        return {
          ...mockCall,
          ...callAnalysis,
        };
      } else {
        return CallAnalysisService.createCallAnalysis(callAnalysis);
      }
    },
    
    updateCallAnalysis: async (id: string, updates: Partial<CallAnalysis>): Promise<CallAnalysis | null> => {
      if (isDemo) {
        // In demo mode, just return a mock updated call analysis
        const mockCall = mockLinguisticsData.generateMultipleMockCallAnalysesWithLinguistics(1)[0];
        return {
          ...mockCall,
          ...updates,
          id,
        };
      } else {
        return CallAnalysisService.updateCallAnalysis(id, updates);
      }
    },
    
    deleteCallAnalysis: async (id: string): Promise<boolean> => {
      if (isDemo) {
        // In demo mode, just return success
        return true;
      } else {
        return CallAnalysisService.deleteCallAnalysis(id);
      }
    },
    
    submitCallForLinguisticsAnalysis: async (callId: string, recordingUrl: string, transcript?: string): Promise<string | null> => {
      if (isDemo) {
        // In demo mode, just return a mock analysis ID
        return `demo-${Math.random().toString(36).substring(2, 15)}`;
      } else {
        return CallAnalysisService.submitCallForLinguisticsAnalysis(callId, recordingUrl, transcript);
      }
    },
    
    getLinguisticsAnalysis: async (callId: string): Promise<LinguisticsAnalysis | null> => {
      if (isDemo) {
        // In demo mode, generate a mock linguistics analysis for this call
        const mockAnalysis = mockLinguisticsData.generateMultipleMockLinguisticsAnalyses(1)[0];
        return {
          ...mockAnalysis,
          call_id: callId,
        };
      } else {
        return CallAnalysisService.getLinguisticsAnalysis(callId);
      }
    },
    
    linkCallToLinguisticsAnalysis: async (callId: string, linguisticsAnalysisId: string): Promise<boolean> => {
      if (isDemo) {
        // In demo mode, just return success
        return true;
      } else {
        return CallAnalysisService.linkCallToLinguisticsAnalysis(callId, linguisticsAnalysisId);
      }
    },
    
    getLinguisticsAnalysisStatus: async (callId: string): Promise<'pending' | 'processing' | 'completed' | 'failed' | 'not_found'> => {
      if (isDemo) {
        // In demo mode, randomly return a status, but mostly 'completed'
        const statuses: ('pending' | 'processing' | 'completed' | 'failed' | 'not_found')[] = [
          'completed', 'completed', 'completed', 'completed', 'completed',
          'pending', 'processing', 'failed', 'not_found'
        ];
        return statuses[Math.floor(Math.random() * statuses.length)];
      } else {
        return CallAnalysisService.getLinguisticsAnalysisStatus(callId);
      }
    },
    
    getRecentCallsForContact: async (contactId: string, limit: number = 5): Promise<CallAnalysis[]> => {
      if (isDemo) {
        // In demo mode, generate mock calls for this contact
        const mockCalls = mockLinguisticsData.generateMultipleMockCallAnalysesWithLinguistics(limit);
        return mockCalls.map(call => ({
          ...call,
          contact_id: contactId,
        }));
      } else {
        return CallAnalysisService.getRecentCallsForContact(contactId, limit);
      }
    },
    
    getRecentCallsForPractice: async (practiceId: string, limit: number = 5): Promise<CallAnalysis[]> => {
      if (isDemo) {
        // In demo mode, generate mock calls for this practice
        const mockCalls = mockLinguisticsData.generateMultipleMockCallAnalysesWithLinguistics(limit);
        return mockCalls.map(call => ({
          ...call,
          practice_id: practiceId,
        }));
      } else {
        return CallAnalysisService.getRecentCallsForPractice(practiceId, limit);
      }
    },
    
    getCallsByTag: async (tag: string): Promise<CallAnalysis[]> => {
      if (isDemo) {
        // In demo mode, generate mock calls with this tag
        const mockCalls = mockLinguisticsData.generateMultipleMockCallAnalysesWithLinguistics(10);
        return mockCalls.map(call => ({
          ...call,
          tags: [...(call.tags || []), tag],
        }));
      } else {
        return CallAnalysisService.getCallsByTag(tag);
      }
    },
    
    getCallsWithHighSentiment: async (threshold: number = 0.7, limit: number = 10): Promise<CallAnalysis[]> => {
      if (isDemo) {
        // In demo mode, generate mock calls with high sentiment
        const mockCalls = mockLinguisticsData.generateMultipleMockCallAnalysesWithLinguistics(limit);
        return mockCalls.map(call => ({
          ...call,
          sentiment_score: Math.random() * 0.3 + threshold, // Ensure it's above threshold
        }));
      } else {
        return CallAnalysisService.getCallsWithHighSentiment(threshold, limit);
      }
    },
    
    getCallsWithLowSentiment: async (threshold: number = -0.3, limit: number = 10): Promise<CallAnalysis[]> => {
      if (isDemo) {
        // In demo mode, generate mock calls with low sentiment
        const mockCalls = mockLinguisticsData.generateMultipleMockCallAnalysesWithLinguistics(limit);
        return mockCalls.map(call => ({
          ...call,
          sentiment_score: Math.random() * 0.3 + threshold - 0.3, // Ensure it's below threshold
        }));
      } else {
        return CallAnalysisService.getCallsWithLowSentiment(threshold, limit);
      }
    }
  };
  
  // Return all services
  return {
    linguisticsService,
    callAnalysisService,
    // Add other services as needed...
  };
};

/**
 * React hook to use the service factory with the current app mode
 */
export const useServiceFactory = () => {
  // Use the AppMode context to get the current mode
  const { mode } = useAppMode();
  return createServiceFactory(mode);
};
