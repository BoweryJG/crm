import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid as MuiGrid,
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  useTheme,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
  Insights as InsightsIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

import { useThemeContext } from '../themes/ThemeContext';

// Create a Grid component that works with the expected props
const Grid = (props: any) => <MuiGrid {...props} />;
// These components would be imported from their respective files
// For now, we'll use the types defined in this file to avoid import errors
type InsightPriority = 'high' | 'medium' | 'low';
type InsightCategory = 'visit' | 'follow_up' | 'connect' | 'trend' | 'news' | 'opportunity';

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
}

// Mock service implementation
const RepInsightsService = {
  async getInsights(userId: string, filters?: InsightFilterOptions): Promise<RepInsight[]> {
    // This would be implemented to fetch real data
    return [];
  }
};
import { supabase } from '../services/supabase/supabase';

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
  const [error, setError] = useState<Error | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<string | null>(null);
  const [insights, setInsights] = useState<RepInsight[]>([]);
  const [filteredInsights, setFilteredInsights] = useState<RepInsight[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<InsightCategory[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<InsightPriority[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user ID on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    
    fetchUser();
  }, []);

  // Fetch insights when user ID or territory changes
  useEffect(() => {
    if (userId) {
      fetchInsights();
    }
  }, [userId, selectedTerritory]);

  // Filter insights when search or filters change
  useEffect(() => {
    filterInsights();
  }, [insights, searchTerm, selectedCategories, selectedPriorities]);

  const fetchInsights = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const filters: InsightFilterOptions = {};
      
      if (selectedTerritory) {
        filters.territory = selectedTerritory;
      }
      
      const insightData = await RepInsightsService.getInsights(userId, filters);
      setInsights(insightData);
    } catch (err) {
      console.error('Error fetching insights:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
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
    fetchInsights();
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <InsightsIcon sx={{ mr: 1 }} />
        Rep Analytics
      </Typography>
      
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
            <Grid container spacing={2}>
              {filteredInsights.map((insight) => (
                <Grid item xs={12} md={6} key={insight.id}>
                  {/* ActionableInsightCard would be used here */}
                  <Card sx={{ mb: 2, borderLeft: '4px solid #f50057', borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{insight.title}</Typography>
                      <Typography variant="body2">{insight.description}</Typography>
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
                  Opportunities Created
                </Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  8
                </Typography>
                <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                  +3 from last month
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
        </Grid>
      </Paper>
    </Box>
  );
};

export default RepAnalytics;
