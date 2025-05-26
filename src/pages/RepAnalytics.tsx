// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  useTheme,
  CircularProgress,
  IconButton
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Insights as InsightsIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Notifications as NotificationsIcon,
  ArrowForward as ArrowForwardIcon,
  Alarm as AlarmIcon,
  Timer as TimerIcon,
  Bolt as BoltIcon
} from '@mui/icons-material';

import { useThemeContext } from '../themes/ThemeContext';
import { supabase } from '../services/supabase/supabase';
import mockDataService from '../services/mockData/mockDataService';
import NowCardsStack from '../components/dashboard/NowCardsStack';

// Using the standard Grid from MUI

// These components would be imported from their respective files
// For now, we'll use the types defined in this file to avoid import errors
type InsightPriority = 'high' | 'medium' | 'low';
type InsightCategory = 'visit' | 'follow_up' | 'connect' | 'trend' | 'news' | 'opportunity';

// UrgentAction types and mock service
type UrgentActionProps = {
  id: string;
  title: string;
  description: string;
  timeRemaining?: string;
  expiresAt?: string;
  source: 'website_activity' | 'call_analysis' | 'market_intelligence' | 'social_media' | 'competitor_activity';
  sourceDetail?: string;
  actionText?: string;
  targetId?: string;
  targetType?: 'practice' | 'contact' | 'company';
  onActionClick?: () => void;
  onDismiss?: () => void;
};

// Mock UrgentActionService
const UrgentActionService = {
  async getUrgentActions(userId: string): Promise<UrgentActionProps[]> {
    try {
      const { data, error } = await supabase
        .from('public_contacts')
        .select('id, first_name, last_name, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching urgent actions:', error);
      }

      if (data && data.length > 0) {
        return data.map((c) => ({
          id: `contact-urgent-${c.id}`,
          title: `Follow up with ${c.first_name} ${c.last_name}`,
          description: `${c.first_name} ${c.last_name} recently interacted with our content and may require immediate attention.`,
          timeRemaining: '15 minutes',
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          source: 'website_activity',
          sourceDetail: 'Recent contact activity',
          actionText: 'Call Now',
          targetId: c.id,
          targetType: 'contact'
        }));
      }

      // Fallback to mock data if no records were returned
      const mockContacts = mockDataService.generateMockContacts(5);
      return mockContacts.map((c, idx) => ({
        id: `mock-urgent-${idx}-${Date.now()}`,
        title: `Follow up with ${c.first_name} ${c.last_name}`,
        description: `${c.first_name} ${c.last_name} recently interacted with our content and may require immediate attention.`,
        timeRemaining: '15 minutes',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        source: 'website_activity',
        sourceDetail: 'Mock contact activity',
        actionText: 'Call Now',
        targetId: c.id,
        targetType: 'contact'
      }));
    } catch (err) {
      console.error('Error fetching urgent actions:', err);
      const mockContacts = mockDataService.generateMockContacts(5);
      return mockContacts.map((c, idx) => ({
        id: `mock-urgent-${idx}-${Date.now()}`,
        title: `Follow up with ${c.first_name} ${c.last_name}`,
        description: `${c.first_name} ${c.last_name} recently interacted with our content and may require immediate attention.`,
        timeRemaining: '15 minutes',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        source: 'website_activity',
        sourceDetail: 'Mock contact activity',
        actionText: 'Call Now',
        targetId: c.id,
        targetType: 'contact'
      }));
    }
  },
  async markActionCompleted(actionId: string, userId: string): Promise<boolean> {
    console.log(`Marking action ${actionId} as completed by user ${userId}`);
    return true;
  },
  async dismissAction(actionId: string, userId: string): Promise<boolean> {
    console.log(`Dismissing action ${actionId} by user ${userId}`);
    return true;
  }
};

interface ActionableInsightProps {
  id: string;
  title: string;
  description: string;
  priority: InsightPriority;
  category: InsightCategory;
  actionText?: string;
  targetId?: string;
  targetType?: 'practice' | 'contact' | 'company';
  dueDate?: string;
  onActionClick?: () => void;
  onMarkComplete?: () => void;
  onSave?: () => void;
  onSchedule?: () => void;
}

interface Territory {
  id: string;
  name: string;
  region: string;
  numPractices: number;
  numContacts: number;
  zipCodes: string[];
  cities: string[];
  states: string[];
}

interface RepInsight extends ActionableInsightProps {
  generatedDate: string;
  expirationDate?: string;
  score: number;
  territory: string;
  zipCodes?: string[];
  cities?: string[];
  states?: string[];
  metadata: {
    sourceType: 'crm' | 'call_analysis' | 'linguistics' | 'website_visit' | 'market_intelligence' | 'social_media';
    sourceId?: string;
  };
  // Add linguistics data
  linguistics?: {
    sentiment_score?: number;
    key_phrases?: string[];
    transcript?: string;
    analysis_result?: any;
    language_metrics?: {
      speaking_pace?: number;
      talk_to_listen_ratio?: number;
      filler_word_frequency?: number;
      technical_language_level?: number;
      interruption_count?: number;
      average_response_time?: number;
    };
    topic_segments?: {
      topic: string;
      start_time: number;
      end_time: number;
      keywords: string[];
      summary: string;
    }[];
    action_items?: {
      description: string;
      timestamp: number;
      priority: 'low' | 'medium' | 'high';
      status: 'pending' | 'in_progress' | 'completed';
    }[];
  };
}

interface InsightFilterOptions {
  territory?: string;
  zipCodes?: string[];
  cities?: string[];
  states?: string[];
  minRelevance?: number;
  categories?: InsightCategory[];
  priorities?: InsightPriority[];
  sourceTypes?: ('crm' | 'call_analysis' | 'linguistics' | 'website_visit' | 'market_intelligence' | 'social_media')[];
  // Pagination parameters
  page?: number;
  limit?: number;
}

const RepInsightsService = {
  async getInsights(userId: string, filters?: InsightFilterOptions): Promise<RepInsight[]> {
    try {
      console.log('Fetching comprehensive insights from public_contacts...');
      
      // Set default pagination values if not provided
      const page = filters?.page || 1;
      const limit = filters?.limit || 20; // Increased limit for better data display
      const offset = (page - 1) * limit;
      
      console.log(`Pagination: page ${page}, limit ${limit}, offset ${offset}`);
      
      // Fetch comprehensive data starting from public_contacts table
      const { data: contactsData, error: contactsError } = await supabase
        .from('public_contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (contactsError) {
        console.error('Error fetching contacts:', contactsError);
        throw contactsError;
      }
      
      const insights: RepInsight[] = [];
      
      // For each contact, fetch related analytics data
      for (const contact of contactsData || []) {
        // Fetch call analysis data for this contact
        const { data: callData } = await supabase
          .from('call_analysis')
          .select(`
            *,
            linguistics_analysis:linguistics_analysis_id(*)
          `)
          .eq('contact_id', contact.id)
          .order('call_date', { ascending: false })
          .limit(5);
        
        // Create insights based on contact and their activities
        const contactInsights = this.createContactInsights(contact, callData || []);
        insights.push(...contactInsights);
      }
      
      // Sort insights by score and priority
      insights.sort((a, b) => {
        if (a.priority !== b.priority) {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return b.score - a.score;
      });
      
      return insights.slice(0, limit);
    } catch (err) {
      console.error('Error in getInsights:', err);
      
      // Generate fallback insights from mock data
      const mockContacts = mockDataService.generateMockContacts(20);
      const fallbackInsights: RepInsight[] = [];
      
      mockContacts.forEach(contact => {
        const mockCalls = mockDataService.generateMockCallAnalyses(Math.floor(Math.random() * 3) + 1);
        const insights = this.createContactInsights(contact, mockCalls);
        fallbackInsights.push(...insights);
      });
      
      return fallbackInsights.slice(0, limit);
    }
  },
  
  // Create insights from a contact and their activities
  createContactInsights(contact: any, callAnalyses: any[]): RepInsight[] {
    const insights: RepInsight[] = [];
    const mockLinguisticsData = require('../services/mockData/mockLinguisticsData');
    
    // Determine if this is a dental or aesthetic contact
    const isAesthetic = ['aesthetic_doctor', 'plastic_surgeon', 'dermatologist', 
                        'cosmetic_dermatologist', 'nurse_practitioner', 
                        'physician_assistant', 'aesthetician'].includes(contact.type);
    
    // Calculate days since last contact
    const lastContactDate = contact.last_contact_date || contact.updated_at || contact.created_at;
    const daysSinceContact = Math.floor((new Date().getTime() - new Date(lastContactDate).getTime()) / (1000 * 60 * 60 * 24));
    
    // 1. Follow-up insights based on contact timing
    if (daysSinceContact > 7 && daysSinceContact < 30) {
      insights.push({
        id: `follow-up-${contact.id}-${Date.now()}`,
        title: `Follow up with ${contact.first_name} ${contact.last_name}`,
        description: `It's been ${daysSinceContact} days since last contact. ${isAesthetic ? 'They may be ready to discuss new aesthetic procedures.' : 'Time to check on their dental equipment needs.'}`,
        generatedDate: new Date().toISOString(),
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        score: 85 - daysSinceContact,
        priority: daysSinceContact > 14 ? 'high' : 'medium',
        category: 'follow_up',
        territory: contact.territory || 'All Territories',
        targetId: contact.id,
        targetType: 'contact',
        actionText: 'Schedule Call',
        onActionClick: () => {},
        onMarkComplete: () => {},
        onSave: () => {},
        onSchedule: () => {},
        metadata: {
          sourceType: 'crm',
          sourceId: contact.id
        }
      });
    }
    
    // 2. New opportunity insights
    if (daysSinceContact < 3) {
      insights.push({
        id: `opportunity-${contact.id}-${Date.now()}`,
        title: `Hot lead: ${contact.first_name} ${contact.last_name}`,
        description: `Recently engaged contact at ${contact.practice_name || 'their practice'}. ${isAesthetic ? 'Interest in aesthetic equipment upgrades.' : 'Exploring dental technology solutions.'}`,
        generatedDate: new Date().toISOString(),
        expirationDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        score: 95,
        priority: 'high',
        category: 'opportunity',
        territory: contact.territory || 'All Territories',
        targetId: contact.id,
        targetType: 'contact',
        actionText: 'Call Now',
        onActionClick: () => {},
        onMarkComplete: () => {},
        onSave: () => {},
        onSchedule: () => {},
        metadata: {
          sourceType: 'crm',
          sourceId: contact.id
        }
      });
    }
    
    // 3. Visit insights based on location and value
    if (contact.city && contact.state && Math.random() > 0.5) {
      insights.push({
        id: `visit-${contact.id}-${Date.now()}`,
        title: `Schedule visit: ${contact.practice_name || contact.first_name + ' ' + contact.last_name}`,
        description: `High-value ${isAesthetic ? 'aesthetic' : 'dental'} practice in ${contact.city}, ${contact.state}. In-person demo could close the deal.`,
        generatedDate: new Date().toISOString(),
        expirationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        score: 80,
        priority: 'medium',
        category: 'visit',
        territory: contact.territory || 'All Territories',
        targetId: contact.id,
        targetType: 'contact',
        actionText: 'Plan Visit',
        onActionClick: () => {},
        onMarkComplete: () => {},
        onSave: () => {},
        onSchedule: () => {},
        metadata: {
          sourceType: 'crm',
          sourceId: contact.id
        }
      });
    }
    
    // 4. Insights from call analyses
    callAnalyses.forEach((call, index) => {
      // Get linguistics data if available
      let linguisticsData = call.linguistics_analysis;
      if (!linguisticsData) {
        // Generate mock linguistics data
        const mockData = mockLinguisticsData.generateMultipleMockLinguisticsAnalyses(1)[0];
        linguisticsData = mockData;
      }
      
      // Determine insight category and priority based on sentiment and metrics
      const sentiment = linguisticsData?.sentiment_score || call.sentiment_score || 0;
      let category: InsightCategory = 'follow_up';
      let priority: InsightPriority = 'medium';
      
      if (sentiment < -0.3) {
        category = 'follow_up';
        priority = 'high';
      } else if (sentiment > 0.5) {
        category = 'opportunity';
        priority = 'high';
      }
      
      // Create insight from call analysis
      insights.push({
        id: call.id || `call-${contact.id}-${index}`,
        title: `${sentiment < 0 ? 'Address concerns' : 'Capitalize on interest'}: ${contact.first_name} ${contact.last_name}`,
        description: call.summary || `Recent call revealed ${sentiment < 0 ? 'concerns that need addressing' : 'strong interest in your solutions'}. ${linguisticsData?.action_items?.length ? `${linguisticsData.action_items.length} action items identified.` : ''}`,
        generatedDate: call.created_at || new Date().toISOString(),
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        score: Math.max(0, Math.min(100, (sentiment + 1) * 50 + (linguisticsData?.closing_readiness_score || 5) * 5)),
        priority,
        category,
        territory: contact.territory || 'All Territories',
        targetId: contact.id,
        targetType: 'contact',
        actionText: 'View Analysis',
        onActionClick: () => {},
        onMarkComplete: () => {},
        onSave: () => {},
        onSchedule: () => {},
        metadata: {
          sourceType: 'call_analysis',
          sourceId: call.id
        },
        linguistics: linguisticsData ? {
          sentiment_score: linguisticsData.sentiment_score,
          key_phrases: linguisticsData.key_phrases || linguisticsData.key_topics,
          transcript: linguisticsData.transcript,
          analysis_result: linguisticsData.analysis_result,
          language_metrics: linguisticsData.analysis_result?.language_metrics || linguisticsData.language_metrics,
          topic_segments: linguisticsData.analysis_result?.topic_segments || linguisticsData.topic_segments,
          action_items: linguisticsData.action_items || linguisticsData.analysis_result?.action_items,
          trust_rapport_score: linguisticsData.trust_rapport_score,
          influence_effectiveness_score: linguisticsData.influence_effectiveness_score,
          buyer_personality_type: linguisticsData.buyer_personality_type,
          closing_readiness_score: linguisticsData.closing_readiness_score,
          recommended_follow_up_timing: linguisticsData.recommended_follow_up_timing,
          coaching_recommendations: linguisticsData.coaching_recommendations
        } : undefined
      });
    });
    
    // 5. Market intelligence insights
    if (Math.random() > 0.6) {
      const trends = isAesthetic 
        ? ['New FDA-approved laser technology', 'Rising demand for body contouring', 'Competitor pricing changes']
        : ['Digital dentistry adoption surge', 'Insurance reimbursement updates', 'New implant technology trends'];
      
      insights.push({
        id: `trend-${contact.id}-${Date.now()}`,
        title: `Market trend affecting ${contact.practice_name || 'practice'}`,
        description: trends[Math.floor(Math.random() * trends.length)] + ' in your territory. Great conversation starter.',
        generatedDate: new Date().toISOString(),
        expirationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        score: 70,
        priority: 'low',
        category: 'trend',
        territory: contact.territory || 'All Territories',
        targetId: contact.id,
        targetType: 'contact',
        actionText: 'Share Insight',
        onActionClick: () => {},
        onMarkComplete: () => {},
        onSave: () => {},
        onSchedule: () => {},
        metadata: {
          sourceType: 'market_intelligence',
          sourceId: contact.id
        }
      });
    }
    
    return insights;
  },
  
  // Helper method to transform call analyses to insights
  transformCallAnalysesToInsights(calls: any[]): RepInsight[] {
    // Import mock data service for fallback
    const mockLinguisticsData = require('../services/mockData/mockLinguisticsData');
    
    return calls.map(call => {
      // Extract contact name if available
      let contactName = '';
      if (call.contacts && call.contacts.first_name && call.contacts.last_name) {
        contactName = `${call.contacts.first_name} ${call.contacts.last_name}`;
      } else {
        console.log('Contact information not available for call:', call.id);
      }
      
      // Extract linguistics data if available
      let linguisticsData = null;
      if (call.linguistics_analysis) {
        console.log('Linguistics data found for call:', call.id);
        linguisticsData = {
          sentiment_score: call.linguistics_analysis.sentiment_score,
          key_phrases: call.linguistics_analysis.key_phrases || call.linguistics_analysis.key_topics,
          transcript: call.linguistics_analysis.transcript,
          analysis_result: call.linguistics_analysis.analysis_result,
          language_metrics: call.linguistics_analysis.analysis_result?.language_metrics || {},
          topic_segments: call.linguistics_analysis.analysis_result?.topic_segments || [],
          action_items: call.linguistics_analysis.action_items || call.linguistics_analysis.analysis_result?.action_items || []
        };
      } else {
        console.log('No linguistics data available for call:', call.id);
        // Generate mock linguistics data for this call as fallback
        const mockData = mockLinguisticsData.generateMultipleMockLinguisticsAnalyses(1)[0];
        linguisticsData = {
          sentiment_score: mockData.sentiment_score,
          key_phrases: mockData.key_phrases,
          transcript: mockData.transcript,
          analysis_result: mockData.analysis_result,
          language_metrics: mockData.analysis_result.language_metrics || {},
          topic_segments: mockData.analysis_result.topic_segments || [],
          action_items: mockData.analysis_result.action_items || []
        };
        console.log('Generated mock linguistics data as fallback for call:', call.id);
      }
      
      // Create a RepInsight from call analysis data
      const insight: RepInsight = {
        id: call.id,
        title: call.title || `Call with ${contactName || 'Unknown Contact'} on ${new Date(call.call_date).toLocaleDateString()}`,
        description: call.summary || 'No summary available',
        generatedDate: call.created_at || new Date().toISOString(),
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        score: call.sentiment_score ? (call.sentiment_score + 1) * 50 : 50, // Convert -1 to 1 scale to 0-100
        priority: call.sentiment_score < -0.3 ? 'high' : call.sentiment_score > 0.3 ? 'low' : 'medium',
        category: 'follow_up', // Call analyses are typically followed up on
        territory: 'All Territories', // Placeholder - should ideally come from contact/practice data
        targetId: call.contact_id || undefined,
        targetType: call.contact_id ? 'contact' : undefined,
        actionText: 'View Details',
        onActionClick: () => {}, // Placeholder function
        onMarkComplete: () => {}, // Placeholder function
        onSave: () => {}, // Placeholder function
        onSchedule: () => {}, // Placeholder function
        metadata: {
          sourceType: 'call_analysis',
          sourceId: call.id
        },
        // Add linguistics data to the insight
        linguistics: linguisticsData
      };
      
      return insight;
    });
  }
};

// Mock territories data
const mockTerritories: Territory[] = [
  {
    id: 'northeast',
    name: 'Northeast',
    region: 'East Coast',
    numPractices: 124,
    numContacts: 342,
    zipCodes: ['02108', '02109', '02110', '02111', '02112'],
    cities: ['Boston', 'Cambridge', 'Brookline', 'Somerville', 'Newton'],
    states: ['MA', 'NH', 'ME', 'VT', 'RI', 'CT']
  },
  {
    id: 'southeast',
    name: 'Southeast',
    region: 'East Coast',
    numPractices: 98,
    numContacts: 276,
    zipCodes: ['33101', '33102', '33103', '33104', '33105'],
    cities: ['Miami', 'Tampa', 'Orlando', 'Jacksonville', 'Fort Lauderdale'],
    states: ['FL', 'GA', 'SC', 'NC', 'AL']
  },
  {
    id: 'midwest',
    name: 'Midwest',
    region: 'Central',
    numPractices: 87,
    numContacts: 231,
    zipCodes: ['60601', '60602', '60603', '60604', '60605'],
    cities: ['Chicago', 'Detroit', 'Indianapolis', 'Columbus', 'Milwaukee'],
    states: ['IL', 'MI', 'IN', 'OH', 'WI', 'MN', 'IA', 'MO']
  }
];

const RepAnalytics: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const itemsPerPage = 10; // Limit to 10 items per page
  const [selectedTerritory, setSelectedTerritory] = useState<string | null>(null);
  const [insights, setInsights] = useState<RepInsight[]>([]);
  const [filteredInsights, setFilteredInsights] = useState<RepInsight[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<InsightCategory[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<InsightPriority[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [urgentActions, setUrgentActions] = useState<UrgentActionProps[]>([]);
  const [loadingUrgentActions, setLoadingUrgentActions] = useState(false);

  // Fetch user ID on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.warn("Auth error:", error.message);
          // Use a mock user ID for development
          const mockUserId = '00000000-0000-0000-0000-000000000000';
          console.log("Using mock user ID for development:", mockUserId);
          setUserId(mockUserId);
        } else if (data?.user) {
          console.log("Authenticated user:", data.user.id);
          setUserId(data.user.id);
        } else {
          console.warn("No user session found or user data unavailable.");
          // Use a mock user ID for development
          const mockUserId = '00000000-0000-0000-0000-000000000000';
          console.log("Using mock user ID for development:", mockUserId);
          setUserId(mockUserId);
        }
      } catch (err) {
        console.error("Unexpected error during auth:", err);
        // Use a mock user ID for development
        const mockUserId = '00000000-0000-0000-0000-000000000000';
        console.log("Using mock user ID for development:", mockUserId);
        setUserId(mockUserId);
      }
    };
    
    fetchUser();
  }, []);

  // Fetch insights when user ID or territory changes
  useEffect(() => {
    if (userId) {
      fetchInsights(1, false); // Reset to page 1 when territory changes
      fetchUrgentActions();
    }
  }, [userId, selectedTerritory]);

  // Filter insights when search or filters change
  useEffect(() => {
    filterInsights();
  }, [insights, searchTerm, selectedCategories, selectedPriorities]);

  const fetchInsights = async (page: number = 1, loadMore: boolean = false) => {
    if (!userId) return;
    
    if (loadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      const filters: InsightFilterOptions = {};
      
      if (selectedTerritory) {
        filters.territory = selectedTerritory;
      }
      
      // Add pagination parameters
      filters.page = page;
      filters.limit = itemsPerPage;
      
      const insightData = await RepInsightsService.getInsights(userId, filters);
      
      // Check if we've reached the end of the data
      if (insightData.length < itemsPerPage) {
        setHasMoreData(false);
      } else {
        setHasMoreData(true);
      }
      
      if (loadMore) {
        // Append new data to existing insights
        setInsights(prevInsights => [...prevInsights, ...insightData]);
      } else {
        // Replace existing data
        setInsights(insightData);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error('Error fetching insights:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };
  
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchInsights(nextPage, true);
  };

  const filterInsights = () => {
    let filtered = [...insights];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(insight => 
        insight.title.toLowerCase().includes(term) || 
        insight.description.toLowerCase().includes(term)
      );
    }
    
    // Apply category filters
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(insight => 
        selectedCategories.includes(insight.category)
      );
    }
    
    // Apply priority filters
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter(insight => 
        selectedPriorities.includes(insight.priority)
      );
    }
    
    setFilteredInsights(filtered);
  };

  const handleTerritoryChange = (territoryId: string | null) => {
    setSelectedTerritory(territoryId);
  };

  const handleCategoryToggle = (category: InsightCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handlePriorityToggle = (priority: InsightPriority) => {
    if (selectedPriorities.includes(priority)) {
      setSelectedPriorities(selectedPriorities.filter(p => p !== priority));
    } else {
      setSelectedPriorities([...selectedPriorities, priority]);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    fetchInsights(1, false);
    fetchUrgentActions();
  };

  const fetchUrgentActions = async () => {
    if (!userId) return;
    
    setLoadingUrgentActions(true);
    
    try {
      const actions = await UrgentActionService.getUrgentActions(userId);
      setUrgentActions(actions);
    } catch (err) {
      console.error('Error fetching urgent actions:', err);
    } finally {
      setLoadingUrgentActions(false);
    }
  };
  
  const handleUrgentAction = async (actionId: string) => {
    try {
      await UrgentActionService.markActionCompleted(actionId, userId || '');
      setUrgentActions(urgentActions.filter(action => action.id !== actionId));
    } catch (err) {
      console.error('Error handling urgent action:', err);
    }
  };
  
  const handleDismissUrgentAction = async (actionId: string) => {
    try {
      await UrgentActionService.dismissAction(actionId, userId || '');
      setUrgentActions(urgentActions.filter(action => action.id !== actionId));
    } catch (err) {
      console.error('Error dismissing urgent action:', err);
    }
  };

  const handleMarkComplete = (insightId: string) => {
    // In a real implementation, this would update the insight status
    console.log('Marking insight complete:', insightId);
    setInsights(insights.filter(insight => insight.id !== insightId));
  };

  const handleSaveInsight = (insightId: string) => {
    // In a real implementation, this would save the insight for later
    console.log('Saving insight for later:', insightId);
  };

  const handleSchedule = (insightId: string) => {
    // In a real implementation, this would open a scheduling dialog
    console.log('Scheduling follow-up for insight:', insightId);
  };

  const navigate = useNavigate();

  const handleAction = (insightId: string) => {
    navigate(`/rep-analytics/${insightId}`);
  };

  const getPriorityColor = (priority: InsightPriority) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.info.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getCategoryIcon = (category: InsightCategory) => {
    switch (category) {
      case 'visit':
        return <LocationIcon fontSize="small" />;
      case 'follow_up':
        return <PhoneIcon fontSize="small" />;
      case 'connect':
        return <BusinessIcon fontSize="small" />;
      case 'trend':
        return <TrendingUpIcon fontSize="small" />;
      case 'news':
        return <NotificationsIcon fontSize="small" />;
      case 'opportunity':
        return <InsightsIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: InsightCategory) => {
    switch (category) {
      case 'visit':
        return theme.palette.primary.main; // Blue for visits
      case 'follow_up':
        return theme.palette.secondary.main; // Secondary color for follow-ups
      case 'connect':
        return theme.palette.success.main; // Green for connections
      case 'trend':
        return theme.palette.info.main; // Light blue for trends
      case 'news':
        return theme.palette.warning.main; // Orange for news
      case 'opportunity':
        return theme.palette.error.main; // Red for opportunities
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <InsightsIcon sx={{ mr: 1 }} />
        Rep Analytics
      </Typography>
      
      {/* Enhanced AI Insights Cards - Now Cards Stack */}
      <Box sx={{ mb: 4 }}>
        <NowCardsStack />
      </Box>
      
      
      {/* TerritorySelector would be used here */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationIcon color="primary" sx={{ mr: 1 }} />
            Territory Analysis
          </Typography>
        </Box>

        <FormControl fullWidth>
          <InputLabel id="territory-select-label">Select Territory</InputLabel>
          <Select
            labelId="territory-select-label"
            id="territory-select"
            value={selectedTerritory || ''}
            label="Select Territory"
            onChange={(e) => handleTerritoryChange(e.target.value)}
          >
            <MenuItem value="">All Territories</MenuItem>
            {mockTerritories.map((territory) => (
              <MenuItem key={territory.id} value={territory.id}>
                {territory.name} ({territory.region})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
      
      <Paper 
        elevation={0}
        sx={{ 
          mb: 3, 
          borderRadius: 2,
          backgroundColor: themeMode === 'space'
            ? 'rgba(22, 27, 44, 0.7)'
            : theme.palette.background.paper,
          backdropFilter: 'blur(8px)',
          border: `1px solid ${
            themeMode === 'space'
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.06)'
          }`
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', px: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="analytics tabs">
            <Tab label="All Insights" />
            <Tab label="High Priority" />
            <Tab label="Visits" />
            <Tab label="Follow-ups" />
            <Tab label="Opportunities" />
          </Tabs>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />
              }}
              sx={{ mr: 2 }}
            />
            <IconButton onClick={handleRefresh} title="Refresh data">
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ p: 2 }}>
          {/* Filter chips */}
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
              <FilterListIcon fontSize="small" sx={{ mr: 0.5 }} />
              Filters:
            </Typography>
            
            {/* Filter chips would be used here */}
            <Button 
              variant={selectedCategories.includes('visit') ? "contained" : "outlined"} 
              size="small" 
              onClick={() => handleCategoryToggle('visit')}
              sx={{ mb: 1, mr: 1 }}
            >
              Visit
            </Button>
            <Button 
              variant={selectedCategories.includes('follow_up') ? "contained" : "outlined"} 
              size="small" 
              onClick={() => handleCategoryToggle('follow_up')}
              sx={{ mb: 1, mr: 1 }}
            >
              Follow Up
            </Button>
            <Button 
              variant={selectedCategories.includes('connect') ? "contained" : "outlined"} 
              size="small" 
              onClick={() => handleCategoryToggle('connect')}
              sx={{ mb: 1, mr: 1 }}
            >
              Connect
            </Button>
            <Button 
              variant={selectedCategories.includes('trend') ? "contained" : "outlined"} 
              size="small" 
              onClick={() => handleCategoryToggle('trend')}
              sx={{ mb: 1, mr: 1 }}
            >
              Trending
            </Button>
            <Button 
              variant={selectedCategories.includes('news') ? "contained" : "outlined"} 
              size="small" 
              onClick={() => handleCategoryToggle('news')}
              sx={{ mb: 1, mr: 1 }}
            >
              News
            </Button>
            <Button 
              variant={selectedCategories.includes('opportunity') ? "contained" : "outlined"} 
              size="small" 
              onClick={() => handleCategoryToggle('opportunity')}
              sx={{ mb: 1, mr: 1 }}
            >
              Opportunity
            </Button>
            
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            
            <Button 
              variant={selectedPriorities.includes('high') ? "contained" : "outlined"} 
              color="error"
              size="small" 
              onClick={() => handlePriorityToggle('high')}
              sx={{ mb: 1, mr: 1 }}
            >
              High Priority
            </Button>
            <Button 
              variant={selectedPriorities.includes('medium') ? "contained" : "outlined"} 
              color="warning"
              size="small" 
              onClick={() => handlePriorityToggle('medium')}
              sx={{ mb: 1, mr: 1 }}
            >
              Medium Priority
            </Button>
            <Button 
              variant={selectedPriorities.includes('low') ? "contained" : "outlined"} 
              color="info"
              size="small" 
              onClick={() => handlePriorityToggle('low')}
              sx={{ mb: 1, mr: 1 }}
            >
              Low Priority
            </Button>
          </Stack>
          
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">
              Error loading insights: {error.message}
            </Typography>
          ) : filteredInsights.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No insights found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or selecting a different territory
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<RefreshIcon />} 
                onClick={handleRefresh}
                sx={{ mt: 2 }}
              >
                Refresh Data
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={2}>
                {filteredInsights.map((insight) => (
                  <Grid item xs={12} md={6} key={insight.id}>
                    <Card sx={{ 
                      mb: 2, 
                      borderLeft: `6px solid ${getCategoryColor(insight.category)}`, 
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease-in-out'
                      }
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box sx={{ flex: 1, mr: 2 }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ 
                                display: 'inline-flex', 
                                color: getCategoryColor(insight.category),
                                bgcolor: `${getCategoryColor(insight.category)}20`,
                                borderRadius: '50%',
                                p: 0.5
                              }}>
                                {getCategoryIcon(insight.category)}
                              </Box>
                              {insight.title}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
                            <Chip
                              label={insight.category.replace('_', ' ').toUpperCase()}
                              size="small"
                              sx={{
                                bgcolor: getCategoryColor(insight.category),
                                color: 'white',
                                fontWeight: 'medium',
                                fontSize: '0.75rem'
                              }}
                            />
                            <Chip
                              label={insight.priority.toUpperCase()}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: getPriorityColor(insight.priority),
                                color: getPriorityColor(insight.priority),
                                fontWeight: 'bold',
                                fontSize: '0.7rem'
                              }}
                            />
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{insight.description}</Typography>
                        
                        {/* Display linguistics data if available */}
                        {insight.linguistics && (
                          <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Linguistics Analysis
                            </Typography>
                            
                            <Grid container spacing={1}>
                              <Grid item xs={12} sm={6}>
                                {insight.linguistics.sentiment_score !== undefined && (
                                  <Typography variant="body2">
                                    <strong>Sentiment Score:</strong> {insight.linguistics.sentiment_score.toFixed(2)}
                                  </Typography>
                                )}
                                
                                {insight.linguistics.key_phrases && insight.linguistics.key_phrases.length > 0 && (
                                  <Typography variant="body2">
                                    <strong>Key Phrases:</strong> {insight.linguistics.key_phrases.slice(0, 3).join(', ')}
                                    {insight.linguistics.key_phrases.length > 3 && '...'}
                                  </Typography>
                                )}
                                
                                {insight.linguistics.language_metrics && (
                                  <>
                                    {insight.linguistics.language_metrics.speaking_pace && (
                                      <Typography variant="body2">
                                        <strong>Speaking Pace:</strong> {insight.linguistics.language_metrics.speaking_pace} WPM
                                      </Typography>
                                    )}
                                    
                                    {insight.linguistics.language_metrics.talk_to_listen_ratio && (
                                      <Typography variant="body2">
                                        <strong>Talk/Listen Ratio:</strong> {insight.linguistics.language_metrics.talk_to_listen_ratio.toFixed(2)}
                                      </Typography>
                                    )}
                                  </>
                                )}
                              </Grid>
                              
                              <Grid item xs={12} sm={6}>
                                {/* Advanced metrics from the enhanced schema */}
                                {insight.linguistics.trust_rapport_score !== undefined && (
                                  <Typography variant="body2">
                                    <strong>Trust/Rapport:</strong> {insight.linguistics.trust_rapport_score.toFixed(1)}/10
                                  </Typography>
                                )}
                                
                                {insight.linguistics.influence_effectiveness_score !== undefined && (
                                  <Typography variant="body2">
                                    <strong>Influence Score:</strong> {insight.linguistics.influence_effectiveness_score.toFixed(1)}/10
                                  </Typography>
                                )}
                                
                                {insight.linguistics.buyer_personality_type && (
                                  <Typography variant="body2">
                                    <strong>Buyer Type:</strong> {insight.linguistics.buyer_personality_type}
                                  </Typography>
                                )}
                                
                                {insight.linguistics.closing_readiness_score !== undefined && (
                                  <Typography variant="body2">
                                    <strong>Closing Readiness:</strong> {insight.linguistics.closing_readiness_score.toFixed(1)}/10
                                  </Typography>
                                )}
                              </Grid>
                              
                              {insight.linguistics.action_items && insight.linguistics.action_items.length > 0 && (
                                <Grid item xs={12}>
                                  <Typography variant="body2">
                                    <strong>Action Items:</strong> {insight.linguistics.action_items.length} identified
                                  </Typography>
                                </Grid>
                              )}
                              
                              {insight.linguistics.recommended_follow_up_timing && (
                                <Grid item xs={12}>
                                  <Typography variant="body2">
                                    <strong>Recommended Follow-up:</strong> {insight.linguistics.recommended_follow_up_timing}
                                  </Typography>
                                </Grid>
                              )}
                            </Grid>
                            
                            {/* Show coaching recommendations if available */}
                            {insight.linguistics.coaching_recommendations && (
                              <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed rgba(0, 0, 0, 0.1)' }}>
                                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                  <strong>Coaching:</strong> {insight.linguistics.coaching_recommendations.length > 100 
                                    ? `${insight.linguistics.coaching_recommendations.substring(0, 100)}...` 
                                    : insight.linguistics.coaching_recommendations}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}
                        
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                          <Button size="small" onClick={() => handleAction(insight.id)}>
                            {insight.actionText || 'View Details'}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              {/* Load More Button */}
              {hasMoreData && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  {isLoadingMore ? (
                    <CircularProgress size={24} sx={{ my: 1 }} />
                  ) : (
                    <Button 
                      variant="outlined" 
                      onClick={handleLoadMore}
                      startIcon={<RefreshIcon />}
                    >
                      Load More
                    </Button>
                  )}
                </Box>
              )}
            </>
          )}
        </Box>
      </Paper>
      
      {/* Performance Metrics */}
      <Paper
        elevation={0}
        sx={{ 
          p: 2,
          borderRadius: 2,
          backgroundColor: themeMode === 'space'
            ? 'rgba(22, 27, 44, 0.7)'
            : theme.palette.background.paper,
          backdropFilter: 'blur(8px)',
          border: `1px solid ${
            themeMode === 'space'
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.06)'
          }`
        }}
      >
        <Typography variant="h6" gutterBottom>
          Performance Metrics
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Visits This Month
                </Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  24
                </Typography>
                <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                  +12% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Insights Actioned
                </Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  18
                </Typography>
                <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                  42% action rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  <TimerIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '0.9rem' }} /> Time to Resolution
                </Typography>
                <Typography variant="h6" mt={1} color="primary.main">
                  3.2 Days
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Average time from inquiry to resolution
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Add Linguistics Metrics Card */}
          <Grid item xs={12} md={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  <InsightsIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '0.9rem' }} /> Linguistics Analysis Metrics
                </Typography>
                
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} sm={4}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', height: '100%' }}>
                      <Typography variant="body2" color="text.secondary">
                        Average Sentiment Score
                      </Typography>
                      <Typography variant="h6" color="primary.main">
                        0.42
                      </Typography>
                      <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                        +0.08 from last month
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', height: '100%' }}>
                      <Typography variant="body2" color="text.secondary">
                        Average Speaking Pace
                      </Typography>
                      <Typography variant="h6" color="primary.main">
                        145 WPM
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Ideal range: 120-160 WPM
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', height: '100%' }}>
                      <Typography variant="body2" color="text.secondary">
                        Talk-to-Listen Ratio
                      </Typography>
                      <Typography variant="h6" color="primary.main">
                        0.85
                      </Typography>
                      <Typography variant="caption" color="success.main">
                        Good balance (ideal: 0.8-1.2)
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default RepAnalytics;
