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
                <Box>
                  {/* Dental Procedures Overview */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4" color="primary" gutterBottom>
                            {dentalProcedures.length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Procedures
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4" color="success.main" gutterBottom>
                            {dentalProcedures.filter(p => (p.yearly_growth_percentage || 0) > 10).length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            High Growth (&gt;10%)
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4" color="info.main" gutterBottom>
                            {Math.round(dentalProcedures.reduce((sum, p) => sum + (p.yearly_growth_percentage || 0), 0) / dentalProcedures.length * 10) / 10}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Average Growth Rate
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4" color="warning.main" gutterBottom>
                            {new Set(dentalProcedures.map(p => p.category).filter(Boolean)).size}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Categories
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Top Procedures and Categories */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardHeader title="Top Growth Procedures" />
                        <CardContent>
                          {dentalProcedures
                            .filter(p => p.yearly_growth_percentage != null)
                            .sort((a, b) => (b.yearly_growth_percentage || 0) - (a.yearly_growth_percentage || 0))
                            .slice(0, 8)
                            .map((procedure, index) => (
                              <Box key={procedure.id} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {procedure.procedure_name}
                                  </Typography>
                                  <Chip 
                                    label={`+${procedure.yearly_growth_percentage}%`}
                                    color="success"
                                    size="small"
                                  />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    {procedure.category || 'General'}
                                  </Typography>
                                  {procedure.market_size_usd_millions && (
                                    <Typography variant="caption" color="text.secondary">
                                      • ${procedure.market_size_usd_millions}M market
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            ))
                          }
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardHeader title="Categories Breakdown" />
                        <CardContent>
                          {Array.from(new Set(dentalProcedures.map(p => p.category).filter(Boolean)))
                            .map(category => {
                              const categoryProcedures = dentalProcedures.filter(p => p.category === category);
                              const avgGrowth = categoryProcedures.reduce((sum, p) => sum + (p.yearly_growth_percentage || 0), 0) / categoryProcedures.length;
                              
                              return (
                                <Box key={category} sx={{ mb: 2 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {category}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {categoryProcedures.length} procedures
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                      Avg Growth: {Math.round(avgGrowth * 10) / 10}%
                                    </Typography>
                                    <Chip 
                                      label={avgGrowth > 10 ? 'High Growth' : avgGrowth > 5 ? 'Moderate' : 'Stable'}
                                      color={avgGrowth > 10 ? 'success' : avgGrowth > 5 ? 'warning' : 'default'}
                                      size="small"
                                    />
                                  </Box>
                                </Box>
                              );
                            })
                          }
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {activeTab === 2 && (
                <Box>
                  {/* Aesthetic Procedures Overview */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4" color="secondary.main" gutterBottom>
                            {aestheticProcedures.length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Procedures
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4" color="success.main" gutterBottom>
                            {aestheticProcedures.filter(p => (p.yearly_growth_percentage || 0) > 15).length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            High Growth (&gt;15%)
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4" color="info.main" gutterBottom>
                            {Math.round(aestheticProcedures.reduce((sum, p) => sum + (p.yearly_growth_percentage || 0), 0) / aestheticProcedures.length * 10) / 10}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Average Growth Rate
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4" color="warning.main" gutterBottom>
                            {new Set(aestheticProcedures.map(p => p.category).filter(Boolean)).size}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Categories
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Top Procedures and Market Analysis */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardHeader title="Trending Aesthetic Procedures" />
                        <CardContent>
                          {aestheticProcedures
                            .filter(p => p.yearly_growth_percentage != null)
                            .sort((a, b) => (b.yearly_growth_percentage || 0) - (a.yearly_growth_percentage || 0))
                            .slice(0, 8)
                            .map((procedure, index) => (
                              <Box key={procedure.id} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {procedure.procedure_name}
                                  </Typography>
                                  <Chip 
                                    label={`+${procedure.yearly_growth_percentage}%`}
                                    color={procedure.yearly_growth_percentage > 20 ? 'success' : 'primary'}
                                    size="small"
                                  />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    {procedure.category || 'General'}
                                  </Typography>
                                  {procedure.market_size_usd_millions && (
                                    <Typography variant="caption" color="text.secondary">
                                      • ${procedure.market_size_usd_millions}M market
                                    </Typography>
                                  )}
                                  {procedure.yearly_growth_percentage > 30 && (
                                    <Chip label="🔥 Hot" size="small" color="error" />
                                  )}
                                </Box>
                              </Box>
                            ))
                          }
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardHeader title="Aesthetic Categories Analysis" />
                        <CardContent>
                          {Array.from(new Set(aestheticProcedures.map(p => p.category).filter(Boolean)))
                            .map(category => {
                              const categoryProcedures = aestheticProcedures.filter(p => p.category === category);
                              const avgGrowth = categoryProcedures.reduce((sum, p) => sum + (p.yearly_growth_percentage || 0), 0) / categoryProcedures.length;
                              const totalMarketSize = categoryProcedures.reduce((sum, p) => sum + (p.market_size_usd_millions || 0), 0);
                              
                              return (
                                <Box key={category} sx={{ mb: 2 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {category}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {categoryProcedures.length} procedures
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                    <Typography variant="caption" color="text.secondary">
                                      Growth: {Math.round(avgGrowth * 10) / 10}%
                                    </Typography>
                                    {totalMarketSize > 0 && (
                                      <Typography variant="caption" color="text.secondary">
                                        • ${totalMarketSize}M market
                                      </Typography>
                                    )}
                                    <Chip 
                                      label={avgGrowth > 15 ? 'Booming' : avgGrowth > 8 ? 'Growing' : 'Stable'}
                                      color={avgGrowth > 15 ? 'success' : avgGrowth > 8 ? 'warning' : 'default'}
                                      size="small"
                                    />
                                  </Box>
                                </Box>
                              );
                            })
                          }
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {activeTab === 3 && (
                <Box>
                  {/* Companies Overview */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4" color="primary" gutterBottom>
                            {companies.length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Companies
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4" color="success.main" gutterBottom>
                            {companies.filter(c => c.industry?.toLowerCase().includes('dental')).length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Dental Companies
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4" color="secondary.main" gutterBottom>
                            {companies.filter(c => 
                              c.industry?.toLowerCase().includes('aesthetic') || 
                              c.industry?.toLowerCase().includes('cosmetic') ||
                              c.industry?.toLowerCase().includes('beauty')
                            ).length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Aesthetic Companies
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4" color="warning.main" gutterBottom>
                            {new Set(companies.map(c => c.industry).filter(Boolean)).size}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Industries
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Industry Breakdown and Recent Companies */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardHeader title="Industry Distribution" />
                        <CardContent>
                          {Array.from(new Set(companies.map(c => c.industry).filter(Boolean)))
                            .map(industry => {
                              const industryCompanies = companies.filter(c => c.industry === industry);
                              const percentage = Math.round((industryCompanies.length / companies.length) * 100);
                              
                              return (
                                <Box key={industry} sx={{ mb: 2 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {industry}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {industryCompanies.length} companies ({percentage}%)
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box 
                                      sx={{ 
                                        width: '100%', 
                                        height: 8, 
                                        backgroundColor: 'grey.200', 
                                        borderRadius: 4,
                                        overflow: 'hidden'
                                      }}
                                    >
                                      <Box 
                                        sx={{ 
                                          width: `${percentage}%`, 
                                          height: '100%', 
                                          backgroundColor: theme.palette.primary.main,
                                          transition: 'width 0.3s ease'
                                        }} 
                                      />
                                    </Box>
                                  </Box>
                                </Box>
                              );
                            })
                          }
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardHeader title="Recent Companies" />
                        <CardContent>
                          {companies
                            .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
                            .slice(0, 8)
                            .map((company, index) => (
                              <Box key={company.id} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {company.name}
                                  </Typography>
                                  <Chip 
                                    label={company.industry || 'Other'}
                                    size="small"
                                    color={
                                      company.industry?.toLowerCase().includes('dental') ? 'primary' :
                                      company.industry?.toLowerCase().includes('aesthetic') ? 'secondary' :
                                      'default'
                                    }
                                  />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {company.description && (
                                    <Typography variant="caption" color="text.secondary" noWrap>
                                      {company.description.length > 60 
                                        ? `${company.description.substring(0, 60)}...` 
                                        : company.description
                                      }
                                    </Typography>
                                  )}
                                </Box>
                                {company.website && (
                                  <Typography variant="caption" color="primary" sx={{ display: 'block' }}>
                                    {company.website}
                                  </Typography>
                                )}
                              </Box>
                            ))
                          }
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Company Insights */}
                  <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                      <Card>
                        <CardHeader title="Industry Insights" />
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <Box sx={{ textAlign: 'center', p: 2 }}>
                                <Typography variant="h6" color="primary" gutterBottom>
                                  Market Leaders
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {companies.filter(c => 
                                    c.industry?.toLowerCase().includes('dental') ||
                                    c.industry?.toLowerCase().includes('aesthetic')
                                  ).length} companies in core healthcare sectors
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Box sx={{ textAlign: 'center', p: 2 }}>
                                <Typography variant="h6" color="secondary" gutterBottom>
                                  Growth Sectors
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Aesthetic and digital health companies showing expansion
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Box sx={{ textAlign: 'center', p: 2 }}>
                                <Typography variant="h6" color="success.main" gutterBottom>
                                  Innovation Focus
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Technology integration across traditional healthcare
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {activeTab === 4 && (
                <Box>
                  {/* Call Analysis Overview */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4" color="primary" gutterBottom>
                            {recentCalls.length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Recent Calls Analyzed
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4" color="success.main" gutterBottom>
                            {recentCalls.filter(c => c.sentiment === 'positive').length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Positive Sentiment
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4" color="info.main" gutterBottom>
                            {recentCalls.length > 0 
                              ? Math.round(recentCalls.reduce((sum, c) => sum + (c.duration_seconds || 0), 0) / recentCalls.length / 60)
                              : 0
                            }m
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Average Duration
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4" color="warning.main" gutterBottom>
                            {recentCalls.filter(c => c.linguistics_analysis_id).length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            With Linguistics Data
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Call Analysis Details */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardHeader title="Recent Call Analysis" />
                        <CardContent>
                          {recentCalls.length > 0 ? (
                            recentCalls.map((call, index) => (
                              <Box key={call.id} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Call #{call.id.slice(-8)}
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Chip 
                                      label={call.sentiment || 'neutral'}
                                      color={
                                        call.sentiment === 'positive' ? 'success' :
                                        call.sentiment === 'negative' ? 'error' : 'default'
                                      }
                                      size="small"
                                    />
                                    {call.linguistics_analysis_id && (
                                      <Chip label="📊 Analyzed" size="small" color="info" />
                                    )}
                                  </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Duration: {Math.round((call.duration_seconds || 0) / 60)}m
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    • Confidence: {Math.round((call.confidence_score || 0) * 100)}%
                                  </Typography>
                                </Box>
                                {call.key_topics && call.key_topics.length > 0 && (
                                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                    {call.key_topics.slice(0, 3).map((topic, i) => (
                                      <Chip key={i} label={topic} size="small" variant="outlined" />
                                    ))}
                                  </Box>
                                )}
                              </Box>
                            ))
                          ) : (
                            <Typography color="text.secondary" align="center">
                              No call analysis data available
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardHeader title="Sentiment Analysis" />
                        <CardContent>
                          {recentCalls.length > 0 ? (
                            <>
                              <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" gutterBottom>
                                  Sentiment Distribution
                                </Typography>
                                {['positive', 'neutral', 'negative'].map(sentiment => {
                                  const count = recentCalls.filter(c => c.sentiment === sentiment).length;
                                  const percentage = Math.round((count / recentCalls.length) * 100);
                                  
                                  return (
                                    <Box key={sentiment} sx={{ mb: 1 }}>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                                          {sentiment}
                                        </Typography>
                                        <Typography variant="caption">
                                          {count} calls ({percentage}%)
                                        </Typography>
                                      </Box>
                                      <Box 
                                        sx={{ 
                                          width: '100%', 
                                          height: 6, 
                                          backgroundColor: 'grey.200', 
                                          borderRadius: 3,
                                          overflow: 'hidden'
                                        }}
                                      >
                                        <Box 
                                          sx={{ 
                                            width: `${percentage}%`, 
                                            height: '100%', 
                                            backgroundColor: 
                                              sentiment === 'positive' ? theme.palette.success.main :
                                              sentiment === 'negative' ? theme.palette.error.main :
                                              theme.palette.grey[500],
                                            transition: 'width 0.3s ease'
                                          }} 
                                        />
                                      </Box>
                                    </Box>
                                  );
                                })}
                              </Box>

                              {linguisticsData && (
                                <Box>
                                  <Typography variant="body2" gutterBottom>
                                    Linguistics Insights
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Chip 
                                      label={`Speaking Rate: ${linguisticsData.speaking_rate || 'N/A'} WPM`}
                                      size="small"
                                      variant="outlined"
                                    />
                                    <Chip 
                                      label={`Emotional Tone: ${linguisticsData.emotional_tone || 'Neutral'}`}
                                      size="small"
                                      variant="outlined"
                                    />
                                    {linguisticsData.language_complexity && (
                                      <Chip 
                                        label={`Complexity: ${linguisticsData.language_complexity}`}
                                        size="small"
                                        variant="outlined"
                                      />
                                    )}
                                  </Box>
                                </Box>
                              )}
                            </>
                          ) : (
                            <Typography color="text.secondary" align="center">
                              No sentiment data available
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Key Topics and Insights */}
                  {recentCalls.some(c => c.key_topics && c.key_topics.length > 0) && (
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                      <Grid item xs={12}>
                        <Card>
                          <CardHeader title="Common Topics & Themes" />
                          <CardContent>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {Array.from(new Set(recentCalls.flatMap(c => c.key_topics || [])))
                                .slice(0, 12)
                                .map((topic, index) => {
                                  const frequency = recentCalls.filter(c => 
                                    c.key_topics?.includes(topic)
                                  ).length;
                                  
                                  return (
                                    <Chip 
                                      key={index}
                                      label={`${topic} (${frequency})`}
                                      color={frequency > 2 ? 'primary' : 'default'}
                                      variant={frequency > 2 ? 'filled' : 'outlined'}
                                    />
                                  );
                                })
                              }
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  )}
                </Box>
              )}
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Analytics;
