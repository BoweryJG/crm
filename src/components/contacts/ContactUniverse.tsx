// Contact Universe Component - Practice Discovery and Batch Acquisition
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
  Badge,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Psychology as AIIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { contactUniverseService, ContactBatch, PracticeUniverseEntry, BatchFilterCriteria } from '../../services/contactUniverseService';

interface ContactUniverseProps {
  userId?: string;
}

const ContactUniverse: React.FC<ContactUniverseProps> = ({ userId = 'demo-user' }) => {
  const theme = useTheme();
  
  // State management
  const [practices, setPractices] = useState<PracticeUniverseEntry[]>([]);
  const [selectedPractices, setSelectedPractices] = useState<Set<string>>(new Set());
  const [batches, setBatches] = useState<ContactBatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  // Filter state
  const [filters, setFilters] = useState<BatchFilterCriteria>({
    specialties: ['dental', 'aesthetic'],
    territories: { states: ['CA'] },
    practice_sizes: ['small', 'medium', 'large'],
    opportunity_score_min: 50,
    competitive_status: ['unknown', 'prospect']
  });

  // Batch creation state
  const [selectedBatchSize, setSelectedBatchSize] = useState<20 | 50 | 100>(50);
  const [batchStrategy, setBatchStrategy] = useState({
    target_procedures: ['Botox', 'Dental Implants'],
    engagement_approach: 'balanced'
  });

  const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const SPECIALTIES = [
    'dental', 'aesthetic', 'dermatology', 'plastic_surgery', 
    'ophthalmology', 'oral_surgery', 'cosmetic_surgery'
  ];

  const HIGH_VALUE_PROCEDURES = [
    'Botox', 'Restylane', 'Dental Implants', 'Invisalign', 
    'Chemical Peel', 'Laser Skin Resurfacing', 'Teeth Whitening',
    'Dental Veneers', 'Breast Augmentation'
  ];

  // Load initial data
  useEffect(() => {
    loadBatches();
  }, [userId]);

  const loadBatches = async () => {
    try {
      const batchData = await contactUniverseService.getContactBatches(userId);
      setBatches(batchData);
    } catch (error) {
      console.error('Error loading batches:', error);
    }
  };

  const searchPractices = async () => {
    try {
      setLoading(true);
      const discoveredPractices = await contactUniverseService.discoverPractices(filters, 200);
      setPractices(discoveredPractices);
      setSearchDialogOpen(false);
    } catch (error) {
      console.error('Error searching practices:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBatch = async () => {
    try {
      setLoading(true);
      
      const batch = await contactUniverseService.createContactBatch(
        userId,
        selectedBatchSize,
        filters,
        {
          target_procedures: batchStrategy.target_procedures,
          acquisition_approach: selectedBatchSize === 20 ? 'precision' : selectedBatchSize === 50 ? 'expansion' : 'saturation'
        }
      );

      setBatches(prev => [batch, ...prev]);
      setBatchDialogOpen(false);
      setActiveStep(0);
      
      // Show success message or notification
      console.log('Batch created successfully:', batch);
    } catch (error) {
      console.error('Error creating batch:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBatchTypeInfo = (size: 20 | 50 | 100) => {
    switch (size) {
      case 20:
        return {
          title: 'Precision Targeting',
          description: 'High-touch, personalized approach',
          features: ['Deep research', 'Custom outreach', 'High conversion'],
          cost: '$250/contact',
          expectedROI: '300%+',
          timeframe: '2-3 weeks'
        };
      case 50:
        return {
          title: 'Territory Expansion',
          description: 'Balanced approach for steady growth',
          features: ['Balanced outreach', 'Template customization', 'Good conversion'],
          cost: '$125/contact',
          expectedROI: '200%+',
          timeframe: '3-4 weeks'
        };
      case 100:
        return {
          title: 'Market Saturation',
          description: 'Volume approach for broad coverage',
          features: ['Bulk outreach', 'Standard templates', 'Volume conversion'],
          cost: '$75/contact',
          expectedROI: '150%+',
          timeframe: '4-6 weeks'
        };
    }
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  const getOpportunityColor = (score: number) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.info.main;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return theme.palette.success.main;
      case 'processing': return theme.palette.warning.main;
      case 'failed': return theme.palette.error.main;
      default: return theme.palette.info.main;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Contact Universe
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover and acquire high-value prospects with AI-powered intelligence
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={() => setSearchDialogOpen(true)}
          >
            Discover Practices
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setBatchDialogOpen(true)}
          >
            Create Batch
          </Button>
        </Box>
      </Box>

      {/* Batch Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[20, 50, 100].map((size) => {
          const info = getBatchTypeInfo(size as 20 | 50 | 100);
          const recentBatch = batches.find(b => b.batch_size === size);
          
          return (
            <Grid item xs={12} md={4} key={size}>
              <Card 
                elevation={0} 
                sx={{ 
                  borderRadius: 3, 
                  height: '100%',
                  border: selectedBatchSize === size ? `2px solid ${theme.palette.primary.main}` : '1px solid',
                  borderColor: selectedBatchSize === size ? 'primary.main' : 'divider',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => setSelectedBatchSize(size as 20 | 50 | 100)}
              >
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {size}
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">
                        {info.title}
                      </Typography>
                    </Box>
                  }
                  subheader={info.description}
                />
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    {info.features.map((feature, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <CheckIcon fontSize="small" color="success" />
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))}
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Cost per Contact</Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {info.cost}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Expected ROI</Typography>
                      <Typography variant="h6" fontWeight="bold" color="success.main">
                        {info.expectedROI}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Typography variant="caption" color="text.secondary">
                    Timeframe: {info.timeframe}
                  </Typography>

                  {recentBatch && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary">Latest Batch:</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight="bold">
                          {recentBatch.successful_imports}/{recentBatch.total_contacts} imported
                        </Typography>
                        <Chip 
                          label={recentBatch.processing_status} 
                          size="small" 
                          sx={{ 
                            backgroundColor: getStatusColor(recentBatch.processing_status),
                            color: 'white'
                          }}
                        />
                      </Box>
                      {recentBatch.processing_status === 'processing' && (
                        <LinearProgress 
                          variant="determinate" 
                          value={recentBatch.completion_percentage} 
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Recent Batches */}
      <Card elevation={0} sx={{ borderRadius: 3 }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AnalyticsIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Recent Contact Batches
              </Typography>
              <Badge badgeContent={batches.length} color="primary" />
            </Box>
          }
          action={
            <IconButton onClick={loadBatches}>
              <RefreshIcon />
            </IconButton>
          }
        />
        <CardContent>
          {batches.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No contact batches yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first batch to start discovering high-value prospects
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {batches.map((batch) => (
                <Grid item xs={12} md={6} lg={4} key={batch.id}>
                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {batch.batch_type.replace('_', ' ').toUpperCase()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(batch.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip 
                        label={batch.processing_status} 
                        size="small" 
                        sx={{ 
                          backgroundColor: getStatusColor(batch.processing_status),
                          color: 'white'
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Progress</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={batch.completion_percentage} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {batch.successful_imports}/{batch.total_contacts} contacts ({batch.completion_percentage}%)
                      </Typography>
                    </Box>

                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Batch Size</Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                          {batch.batch_size}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">ROI Projection</Typography>
                        <Typography variant="h6" fontWeight="bold" color="success.main">
                          {formatCurrency(batch.roi_projection || 0)}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined" fullWidth>
                        View Details
                      </Button>
                      {batch.processing_status === 'completed' && (
                        <IconButton size="small">
                          <DownloadIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Search Dialog */}
      <Dialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Discover Practices</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                options={SPECIALTIES}
                value={filters.specialties || []}
                onChange={(_, value) => setFilters(prev => ({ ...prev, specialties: value }))}
                renderInput={(params) => (
                  <TextField {...params} label="Specialties" placeholder="Select specialties" />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                options={US_STATES}
                value={filters.territories?.states || []}
                onChange={(_, value) => setFilters(prev => ({ 
                  ...prev, 
                  territories: { ...prev.territories, states: value }
                }))}
                renderInput={(params) => (
                  <TextField {...params} label="States" placeholder="Select states" />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Minimum Opportunity Score</InputLabel>
                <Select
                  value={filters.opportunity_score_min || 50}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    opportunity_score_min: e.target.value as number 
                  }))}
                >
                  <MenuItem value={30}>30+ (All prospects)</MenuItem>
                  <MenuItem value={50}>50+ (Good prospects)</MenuItem>
                  <MenuItem value={70}>70+ (High-quality prospects)</MenuItem>
                  <MenuItem value={80}>80+ (Premium prospects)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                options={['solo', 'small', 'medium', 'large']}
                value={filters.practice_sizes || []}
                onChange={(_, value) => setFilters(prev => ({ 
                  ...prev, 
                  practice_sizes: value as ('solo' | 'small' | 'medium' | 'large')[]
                }))}
                renderInput={(params) => (
                  <TextField {...params} label="Practice Sizes" placeholder="Select sizes" />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={searchPractices} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Search Practices'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Batch Creation Dialog */}
      <Dialog open={batchDialogOpen} onClose={() => setBatchDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Contact Acquisition Batch</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Batch Size</StepLabel>
            </Step>
            <Step>
              <StepLabel>Filters</StepLabel>
            </Step>
            <Step>
              <StepLabel>Strategy</StepLabel>
            </Step>
            <Step>
              <StepLabel>Review</StepLabel>
            </Step>
          </Stepper>

          {activeStep === 0 && (
            <Grid container spacing={3}>
              {[20, 50, 100].map((size) => {
                const info = getBatchTypeInfo(size as 20 | 50 | 100);
                return (
                  <Grid item xs={12} md={4} key={size}>
                    <Card 
                      variant="outlined"
                      sx={{ 
                        cursor: 'pointer',
                        border: selectedBatchSize === size ? `2px solid ${theme.palette.primary.main}` : undefined
                      }}
                      onClick={() => setSelectedBatchSize(size as 20 | 50 | 100)}
                    >
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                          {size}
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {info.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {info.description}
                        </Typography>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          {info.cost}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  options={SPECIALTIES}
                  value={filters.specialties || []}
                  onChange={(_, value) => setFilters(prev => ({ ...prev, specialties: value }))}
                  renderInput={(params) => (
                    <TextField {...params} label="Target Specialties" />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  options={US_STATES}
                  value={filters.territories?.states || []}
                  onChange={(_, value) => setFilters(prev => ({ 
                    ...prev, 
                    territories: { ...prev.territories, states: value }
                  }))}
                  renderInput={(params) => (
                    <TextField {...params} label="Territory States" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={HIGH_VALUE_PROCEDURES}
                  value={filters.high_value_procedures || []}
                  onChange={(_, value) => setFilters(prev => ({ 
                    ...prev, 
                    high_value_procedures: value
                  }))}
                  renderInput={(params) => (
                    <TextField {...params} label="Target Procedures" />
                  )}
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Acquisition Strategy</Typography>
                <Autocomplete
                  multiple
                  options={HIGH_VALUE_PROCEDURES}
                  value={batchStrategy.target_procedures}
                  onChange={(_, value) => setBatchStrategy(prev => ({ 
                    ...prev, 
                    target_procedures: value
                  }))}
                  renderInput={(params) => (
                    <TextField {...params} label="Primary Target Procedures" />
                  )}
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>Batch Summary</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Batch Size:</Typography>
                  <Typography variant="h6" fontWeight="bold">{selectedBatchSize} contacts</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Estimated Cost:</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {formatCurrency(selectedBatchSize * 125)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Target Procedures:</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                    {batchStrategy.target_procedures.map((proc) => (
                      <Chip key={proc} label={proc} size="small" />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBatchDialogOpen(false)}>Cancel</Button>
          <Button 
            disabled={activeStep === 0}
            onClick={() => setActiveStep(prev => prev - 1)}
          >
            Back
          </Button>
          {activeStep < 3 ? (
            <Button 
              variant="contained"
              onClick={() => setActiveStep(prev => prev + 1)}
            >
              Next
            </Button>
          ) : (
            <Button 
              variant="contained"
              onClick={createBatch}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Create Batch'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactUniverse;