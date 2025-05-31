import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid as MuiGrid,
  Card,
  CardContent,
  CardHeader,
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
  SelectChangeEvent,
  TextField,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

import { useThemeContext } from '../themes/ThemeContext';
import { DentalProceduresService } from '../services/knowledgeBase/dentalProcedures';
import { AestheticProceduresService } from '../services/knowledgeBase/aestheticProcedures';
import { CompaniesService } from '../services/knowledgeBase/companiesService';
import { CallAnalysisService } from '../services/callAnalysis/callAnalysisService';
import { LinguisticsService } from '../services/linguistics/linguisticsService';
import RegionalAnalytics from '../components/analytics/RegionalAnalytics';
import { 
  DentalProcedure, 
  DentalProcedureCategory,
  AestheticProcedure, 
  AestheticProcedureCategory,
  Company,
  CallAnalysis,
  LinguisticsAnalysis
} from '../types';

// Create a Grid component that works with the expected props
const Grid = (props: any) => <MuiGrid {...props} />;

const Analytics: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Data states
  const [dentalProcedures, setDentalProcedures] = useState<DentalProcedure[]>([]);
  const [aestheticProcedures, setAestheticProcedures] = useState<AestheticProcedure[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [recentCalls, setRecentCalls] = useState<CallAnalysis[]>([]);
  const [linguisticsData, setLinguisticsData] = useState<LinguisticsAnalysis | null>(null);
  
  // Filter states
  const [dentalCategory, setDentalCategory] = useState<DentalProcedureCategory | ''>('');
  const [aestheticCategory, setAestheticCategory] = useState<AestheticProcedureCategory | ''>('');
  const [companyIndustry, setCompanyIndustry] = useState<'dental' | 'aesthetic' | 'both' | 'other' | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel
      const [dentalData, aestheticData, companiesData, callsData] = await Promise.all([
        DentalProceduresService.getAllProcedures(),
        AestheticProceduresService.getAllProcedures(),
        CompaniesService.getAllCompanies(),
        CallAnalysisService.getAllCallAnalyses()
      ]);
      
      setDentalProcedures(dentalData);
      setAestheticProcedures(aestheticData);
      setCompanies(companiesData);
      setRecentCalls(callsData.slice(0, 5)); // Get 5 most recent calls
      
      // If there are calls with linguistics analysis, fetch the first one
      if (callsData.length > 0 && callsData[0].linguistics_analysis_id) {
        const linguisticsAnalysis = await CallAnalysisService.getLinguisticsAnalysis(callsData[0].id);
        setLinguisticsData(linguisticsAnalysis);
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSearchTerm('');
  };

  // Render the main component
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Industry Knowledge Analytics
      </Typography>
      
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
            <Tab label="Regional Analytics" />
            <Tab label="Dental Procedures" />
            <Tab label="Aesthetic Procedures" />
            <Tab label="Companies" />
            <Tab label="Call Analysis" />
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
            <IconButton onClick={fetchData} title="Refresh data">
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ p: 2 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">
              Error loading data: {error.message}
            </Typography>
          ) : (
            <>
              {activeTab === 0 && (
                <RegionalAnalytics />
              )}
              {activeTab === 1 && (
                <Typography>Dental Procedures Analytics</Typography>
              )}
              {activeTab === 2 && (
                <Typography>Aesthetic Procedures Analytics</Typography>
              )}
              {activeTab === 3 && (
                <Typography>Companies Analytics</Typography>
              )}
              {activeTab === 4 && (
                <Typography>Call Analysis with Linguistics</Typography>
              )}
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Analytics;
