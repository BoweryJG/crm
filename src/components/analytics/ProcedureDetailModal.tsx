import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  AttachMoney as MoneyIcon,
  LocalHospital as MedicalIcon,
  Psychology as AnalysisIcon,
  BarChart as ChartIcon,
  Timeline as TimelineIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { DentalProcedure } from '../../types/procedures/dental';
import { AestheticProcedure } from '../../types/procedures/aesthetic';

interface ProcedureDetailModalProps {
  open: boolean;
  onClose: () => void;
  procedure: DentalProcedure | AestheticProcedure | null;
  type: 'dental' | 'aesthetic';
}

const ProcedureDetailModal: React.FC<ProcedureDetailModalProps> = ({
  open,
  onClose,
  procedure,
  type
}) => {
  const theme = useTheme();

  if (!procedure) return null;

  const displayName = procedure.procedure_name || procedure.name || 'Unknown Procedure';
  const growth = procedure.yearly_growth_percentage || 0;
  const marketSize = procedure.market_size_usd_millions || 0;

  const getTrendIcon = (growth: number) => {
    if (growth > 5) return <TrendingUpIcon sx={{ color: theme.palette.success.main }} />;
    if (growth < -5) return <TrendingDownIcon sx={{ color: theme.palette.error.main }} />;
    return <TrendingFlatIcon sx={{ color: theme.palette.warning.main }} />;
  };

  const getTrendColor = (growth: number) => {
    if (growth > 5) return theme.palette.success.main;
    if (growth < -5) return theme.palette.error.main;
    return theme.palette.warning.main;
  };

  const getGrowthDescription = (growth: number) => {
    if (growth > 15) return 'Explosive Growth';
    if (growth > 10) return 'High Growth';
    if (growth > 5) return 'Moderate Growth';
    if (growth > 0) return 'Steady Growth';
    if (growth > -5) return 'Stable';
    return 'Declining';
  };

  const generateMarketInsights = (procedure: DentalProcedure | AestheticProcedure) => {
    const insights = [];
    
    if (growth > 10) {
      insights.push({
        type: 'opportunity',
        icon: <TrendingUpIcon />,
        title: 'High Growth Opportunity',
        description: `This procedure shows ${growth}% annual growth, indicating strong market demand.`
      });
    }
    
    if (marketSize > 100) {
      insights.push({
        type: 'market',
        icon: <ChartIcon />,
        title: 'Large Market Size',
        description: `$${marketSize}M market size represents significant revenue potential.`
      });
    }

    if (type === 'dental' && procedure.category) {
      const category = procedure.category;
      if (category.includes('cosmetic') || category.includes('aesthetic')) {
        insights.push({
          type: 'trend',
          icon: <StarIcon />,
          title: 'Aesthetic Demand',
          description: 'Growing consumer interest in cosmetic dental procedures.'
        });
      }
    }

    if (type === 'aesthetic' && growth > 20) {
      insights.push({
        type: 'hot',
        icon: <TimelineIcon />,
        title: 'Trending Procedure',
        description: 'This procedure is currently trending in the aesthetic market.'
      });
    }

    return insights;
  };

  const insights = generateMarketInsights(procedure);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          maxHeight: '90vh',
          overflow: 'visible'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
        borderRadius: '12px 12px 0 0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: type === 'dental' ? theme.palette.primary.main : theme.palette.secondary.main,
            width: 48,
            height: 48
          }}>
            <MedicalIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {displayName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {procedure.category || `${type === 'dental' ? 'Dental' : 'Aesthetic'} Procedure`}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  {getTrendIcon(growth)}
                </Box>
                <Typography variant="h4" fontWeight="bold" sx={{ color: getTrendColor(growth) }}>
                  {growth > 0 ? '+' : ''}{growth}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Annual Growth
                </Typography>
                <Chip 
                  label={getGrowthDescription(growth)}
                  size="small"
                  sx={{ mt: 1, bgcolor: `${getTrendColor(growth)}20`, color: getTrendColor(growth) }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <MoneyIcon sx={{ color: theme.palette.success.main }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  ${marketSize}M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Market Size
                </Typography>
                <Chip 
                  label={marketSize > 100 ? 'Large Market' : marketSize > 50 ? 'Medium Market' : 'Niche Market'}
                  size="small"
                  sx={{ mt: 1 }}
                  color={marketSize > 100 ? 'success' : marketSize > 50 ? 'warning' : 'default'}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <AnalysisIcon sx={{ color: theme.palette.info.main }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="info.main">
                  {insights.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Market Insights
                </Typography>
                <Chip 
                  label="AI Analysis"
                  size="small"
                  sx={{ mt: 1 }}
                  color="info"
                  variant="outlined"
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Market Insights */}
        {insights.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Market Insights
            </Typography>
            <List>
              {insights.map((insight, index) => (
                <Paper key={index} elevation={1} sx={{ mb: 1, borderRadius: 2 }}>
                  <ListItem>
                    <ListItemIcon>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32,
                        bgcolor: insight.type === 'opportunity' ? theme.palette.success.main :
                                insight.type === 'market' ? theme.palette.info.main :
                                insight.type === 'trend' ? theme.palette.warning.main :
                                theme.palette.error.main
                      }}>
                        {insight.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          {insight.title}
                        </Typography>
                      }
                      secondary={insight.description}
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Detailed Information */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Procedure Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Category
              </Typography>
              <Chip 
                label={procedure.category || 'General'} 
                color="primary" 
                variant="outlined"
              />
            </Box>
            
            {procedure.description && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1">
                  {procedure.description}
                </Typography>
              </Box>
            )}

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Market Performance
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="body2">Growth Rate:</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(Math.abs(growth), 100)} 
                  sx={{ 
                    flexGrow: 1, 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getTrendColor(growth)
                    }
                  }} 
                />
                <Typography variant="body2" fontWeight="bold">
                  {growth}%
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Market Analysis
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Market Opportunity Score
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon 
                    key={star}
                    sx={{ 
                      color: star <= Math.ceil((growth + 50) / 20) ? theme.palette.warning.main : theme.palette.grey[300],
                      fontSize: 20
                    }}
                  />
                ))}
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {Math.ceil((growth + 50) / 20)}/5
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Investment Recommendations
              </Typography>
              <Box sx={{ display: 'flex', flex: 'column', gap: 1 }}>
                {growth > 10 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                    <Typography variant="body2">Recommended for investment</Typography>
                  </Box>
                )}
                {marketSize > 50 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoIcon sx={{ color: theme.palette.info.main, fontSize: 20 }} />
                    <Typography variant="body2">Large addressable market</Typography>
                  </Box>
                )}
                {growth < 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon sx={{ color: theme.palette.warning.main, fontSize: 20 }} />
                    <Typography variant="body2">Monitor market trends closely</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          size="large"
          sx={{ borderRadius: 2 }}
        >
          Close
        </Button>
        <Button 
          variant="contained" 
          size="large"
          sx={{ borderRadius: 2 }}
          startIcon={<ChartIcon />}
        >
          View Full Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProcedureDetailModal;