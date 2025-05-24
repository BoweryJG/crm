// @ts-nocheck
import React, { useState, useEffect } from 'react';
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
    // This would be implemented to fetch real urgent actions
    return [
      {
        id: `website-urgent-${Date.now()}`,
        title: 'High-Value Prospect on Website Now',
        description: 'Dr. Sarah Johnson from Bright Smiles Dental is currently browsing our implant solutions page for the 3rd time today. Our AI predicts a 85% chance of purchase intent.',
        timeRemaining: '15 minutes',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        source: 'website_activity',
        sourceDetail: 'Real-time website analytics',
        actionText: 'Call Now',
        targetId: 'contact-123',
        targetType: 'contact'
      }
    ];
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
      console.log('Fetching insights from call_analysis table...');
      
      // Set default pagination values if not provided
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const offset = (page - 1) * limit;
      
      console.log(`Pagination: page ${page}, limit ${limit}, offset ${offset}`);
      
      // Fetch real data from call_analysis table with proper joins
      const { data, error } = await supabase
        .from('call_analysis')
        .select(`
          *,
          contacts:contact_id(first_name, last_name)
        `)
        .order('call_date', { ascending: false })
        .range(offset, offset + limit - 1); // Apply pagination
      
    // If we have data, use the proper join to get linguistics data
    if (!error && data && data.length > 0) {
      console.log('Successfully fetched call analyses, now fetching linguistics data...');
      
      // Use a proper join to get linguistics data
      const { data: callsWithLinguistics, error: joinError } = await supabase
        .from('call_analysis')
        .select(`
          *,
          contacts:contact_id(first_name, last_name),
          linguistics:linguistics_analysis_id(*)
        `)
        .in('id', data.map(call => call.id))
        .order('call_date', { ascending: false });
      
      if (!joinError && callsWithLinguistics) {
        console.log(`Successfully fetched ${callsWithLinguistics.length} call analyses with linguistics data`);
        // Replace the data with the joined data
        data = callsWithLinguistics;
      } else {
        console.error('Error fetching call analyses with linguistics data:', joinError);
      }
    }
        
      if (error) {
        console.error('Error fetching call analyses:', error);
        // Fallback: load contacts to use as insights
        console.log('Fetching contacts as fallback to present live mock data');
        const { data: contactsData, error: contactsError } = await supabase
          .from('public_contacts')
          .select('id, first_name, last_name, created_at')
          .order('created_at', { ascending: false })
          .limit(20);

        let fallbackCalls: any[];
        if (contactsError || !contactsData) {
          console.error('Error fetching contacts fallback or no contacts found:', contactsError);
          fallbackCalls = mockDataService.generateMockCallAnalyses(10);
          console.log('Using generated mock call data');
        } else {
          console.log(`Fetched ${contactsData.length} contacts for fallback insights`);
          fallbackCalls = contactsData.map(c => ({
            id: c.id,
            call_date: c.created_at,
            title: `${c.first_name} ${c.last_name}`,
            transcript: '',
            summary: '',
            sentiment_score: 0,
            contact_id: c.id,
            created_at: c.created_at,
            contacts: { first_name: c.first_name, last_name: c.last_name }
          }));
        }
        return this.transformCallAnalysesToInsights(fallbackCalls);
      }
      
      if (!data || data.length === 0) {
        console.log('No call analyses found in call_analysis table, using contacts fallback');
        console.log('Fetching contacts as fallback to present live mock data');
        const { data: contactsData, error: contactsError } = await supabase
          .from('public_contacts')
          .select('id, first_name, last_name, created_at')
          .order('created_at', { ascending: false })
          .limit(20);

        let fallbackCalls: any[];
        if (contactsError || !contactsData) {
          console.error('Error fetching contacts fallback or no contacts found:', contactsError);
          fallbackCalls = mockDataService.generateMockCallAnalyses(10);
          console.log('Using generated mock call data');
        } else {
          console.log(`Fetched ${contactsData.length} contacts for fallback insights`);
          fallbackCalls = contactsData.map(c => ({
            id: c.id,
            call_date: c.created_at,
            title: `${c.first_name} ${c.last_name}`,
            transcript: '',
            summary: '',
            sentiment_score: 0,
            contact_id: c.id,
            created_at: c.created_at,
            contacts: { first_name: c.first_name, last_name: c.last_name }
          }));
        }
        return this.transformCallAnalysesToInsights(fallbackCalls);
      }
      
      console.log(`Successfully fetched ${data.length} call analyses from call_analysis table`);
      
      // Transform to expected format
      return this.transformCallAnalysesToInsights(data);
    } catch (err) {
      console.error('Error in getInsights:', err);
      
      // Use mock data as fallback
      const mockCalls = mockDataService.generateMockCallAnalyses(10);
      return this.transformCallAnalysesToInsights(mockCalls);
    }
  },
  
  // Helper method to transform call analyses to insights
  transformCallAnalysesToInsights(calls: any[]): RepInsight[] {
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
      if (call.linguistics) {
        console.log('Linguistics data found for call:', call.id);
        linguisticsData = {
          sentiment_score: call.linguistics.sentiment_score,
          key_phrases: call.linguistics.key_phrases || call.linguistics.key_topics,
          transcript: call.linguistics.transcript,
          analysis_result: call.linguistics.analysis_result,
          language_metrics: call.linguistics.analysis_result?.language_metrics || {},
          topic_segments: call.linguistics.analysis_result?.topic_segments || [],
          action_items: call.linguistics.action_items || call.linguistics.analysis_result?.action_items || []
        };
      } else {
        console.log('No linguistics data available for call:', call.id);
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

  const handleAction = (insightId: string) => {
    // In a real implementation, this would navigate to the relevant page
    console.log('Taking action on insight:', insightId);
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

  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <InsightsIcon sx={{ mr: 1 }} />
        Rep Analytics
      </Typography>
      
      {/* Do This Now Section */}
      {urgentActions.length > 0 && (
        <Paper 
          elevation={3}
          sx={{ 
            mb: 4, 
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'error.main'
          }}
        >
          <Box 
            sx={{ 
              bgcolor: 'error.main', 
              color: 'white', 
              py: 1.5, 
              px: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AlarmIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                DO THIS NOW
              </Typography>
            </Box>
            <Button 
              size="small" 
              variant="outlined" 
              startIcon={<RefreshIcon />}
              onClick={fetchUrgentActions}
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Refresh
            </Button>
          </Box>
          
          <Box sx={{ p: 2 }}>
            {loadingUrgentActions ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress color="error" />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {urgentActions.map((action) => (
                  <Grid item xs={12} key={action.id}>
                    <Card 
                      sx={{ 
                        mb: 2, 
                        borderRadius: 2,
                        backgroundColor: themeMode === 'space'
                          ? 'rgba(220, 53, 69, 0.15)'
                          : 'rgba(220, 53, 69, 0.08)',
                        border: '1px solid',
                        borderColor: 'error.main',
                        boxShadow: `0 4px 12px ${
                          themeMode === 'space'
                            ? 'rgba(220, 53, 69, 0.25)'
                            : 'rgba(220, 53, 69, 0.15)'
                        }`,
                        position: 'relative',
                        overflow: 'visible'
                      }}
                    >
                      {/* Urgent badge */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: 20,
                          backgroundColor: 'error.main',
                          color: 'white',
                          fontSize: '0.75rem',
                          height: '22px',
                          minWidth: '80px',
                          borderRadius: '11px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          px: 1
                        }}
                      >
                        <AlarmIcon fontSize="small" sx={{ mr: 0.5 }} />
                        DO THIS NOW
                      </Box>
                      
                      <CardContent sx={{ pt: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: 'error.main' }}>
                            {action.title}
                          </Typography>
                          <Chip 
                            label={action.source.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} 
                            size="small" 
                            color="error"
                            icon={<BoltIcon fontSize="small" />}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                        
                        <Typography variant="body1" sx={{ mb: 1.5 }}>
                          {action.description}
                        </Typography>
                        
                        {action.sourceDetail && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>
                            Source: {action.sourceDetail}
                          </Typography>
                        )}
                        
                        {action.timeRemaining && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <TimerIcon fontSize="small" color="error" sx={{ mr: 1 }} />
                            <Typography 
                              variant="body2" 
                              color="error.main"
                              fontWeight="bold"
                            >
                              Time remaining: {action.timeRemaining}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                      
                      <Divider />
                      
                      <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
                        <Button 
                          size="small" 
                          onClick={() => handleDismissUrgentAction(action.id)}
                          color="inherit"
                        >
                          Dismiss
                        </Button>
                        
                        <Button 
                          variant="contained"
                          color="error"
                          size="medium" 
                          endIcon={<ArrowForwardIcon />} 
                          onClick={() => handleUrgentAction(action.id)}
                          sx={{ ml: 'auto', fontWeight: 'bold' }}
                        >
                          {action.actionText || 'Take Action Now'}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Paper>
      )}
      
      
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
                    <Card sx={{ mb: 2, borderLeft: '4px solid #f50057', borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6">{insight.title}</Typography>
                        <Typography variant="body2">{insight.description}</Typography>
                        
                        {/* Display linguistics data if available */}
                        {insight.linguistics && (
                          <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Linguistics Analysis
                            </Typography>
                            
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
                            
                            {insight.linguistics.action_items && insight.linguistics.action_items.length > 0 && (
                              <Typography variant="body2">
                                <strong>Action Items:</strong> {insight.linguistics.action_items.length} identified
                              </Typography>
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
