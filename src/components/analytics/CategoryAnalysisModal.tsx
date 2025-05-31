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
  ListItemText,
  useTheme,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Category as CategoryIcon,
  Psychology as AnalysisIcon,
  Groups as DemographicsIcon,
  BarChart as ChartIcon,
  Timeline as TimelineIcon,
  Star as StarIcon,
  AttachMoney as MoneyIcon,
  Speed as SpeedIcon,
  LocalHospital as MedicalIcon,
  Business as BusinessIcon,
  Insights as InsightsIcon
} from '@mui/icons-material';

interface CategoryData {
  name: string;
  procedureCount: number;
  averageGrowth: number;
  totalMarketSize?: number;
  topProcedures?: string[];
  marketTrends?: string[];
  competitionLevel?: 'low' | 'medium' | 'high';
  investmentPotential?: number; // 1-5 scale
}

interface CategoryAnalysisModalProps {
  open: boolean;
  onClose: () => void;
  category: CategoryData | null;
  type: 'dental' | 'aesthetic';
}

const CategoryAnalysisModal: React.FC<CategoryAnalysisModalProps> = ({
  open,
  onClose,
  category,
  type
}) => {
  const theme = useTheme();

  if (!category) return null;

  const getTrendIcon = (growth: number) => {
    if (growth > 5) return <TrendingUpIcon sx={{ color: theme.palette.success.main }} />;
    if (growth < -5) return <TrendingDownIcon sx={{ color: theme.palette.error.main }} />;
    return <CategoryIcon sx={{ color: theme.palette.warning.main }} />;
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.success.main;
      default: return theme.palette.grey[500];
    }
  };

  const getMarketInsights = (category: CategoryData) => {
    const insights = [];
    
    if (category.averageGrowth > 10) {
      insights.push({
        icon: <TrendingUpIcon />,
        title: 'High Growth Category',
        description: `${category.averageGrowth.toFixed(1)}% average growth indicates strong market expansion.`,
        type: 'growth'
      });
    }

    if (category.procedureCount > 20) {
      insights.push({
        icon: <MedicalIcon />,
        title: 'Diverse Category',
        description: `${category.procedureCount} procedures offer multiple revenue streams.`,
        type: 'diversity'
      });
    }

    if (category.competitionLevel === 'low') {
      insights.push({
        icon: <BusinessIcon />,
        title: 'Low Competition',
        description: 'Market entry opportunity with reduced competitive pressure.',
        type: 'competition'
      });
    }

    if (category.totalMarketSize && category.totalMarketSize > 500) {
      insights.push({
        icon: <MoneyIcon />,
        title: 'Large Market',
        description: `$${category.totalMarketSize}M total addressable market.`,
        type: 'market'
      });
    }

    return insights;
  };

  const insights = getMarketInsights(category);

  const generateCategoryStrategies = (category: CategoryData) => {
    const strategies = [];

    if (category.averageGrowth > 10) {
      strategies.push({
        title: 'Market Expansion Strategy',
        description: 'Focus on scaling operations to capture growing demand.',
        priority: 'High'
      });
    }

    if (category.competitionLevel === 'low') {
      strategies.push({
        title: 'Market Penetration',
        description: 'Aggressive expansion while competition is limited.',
        priority: 'High'
      });
    }

    if (category.procedureCount > 15) {
      strategies.push({
        title: 'Portfolio Optimization',
        description: 'Focus on highest-performing procedures within category.',
        priority: 'Medium'
      });
    }

    return strategies;
  };

  const strategies = generateCategoryStrategies(category);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
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
        background: `linear-gradient(135deg, ${type === 'dental' ? theme.palette.primary.main : theme.palette.secondary.main}15, ${theme.palette.info.main}15)`,
        borderRadius: '12px 12px 0 0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: type === 'dental' ? theme.palette.primary.main : theme.palette.secondary.main,
            width: 56,
            height: 56
          }}>
            <CategoryIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {category.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {type === 'dental' ? 'Dental' : 'Aesthetic'} Category Analysis
            </Typography>
            <Chip 
              label={`${category.procedureCount} Procedures`}
              size="small"
              color="primary"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Key Performance Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ height: '100%', borderRadius: 3, bgcolor: 'primary.50' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ 
                  bgcolor: theme.palette.primary.main, 
                  mx: 'auto', 
                  mb: 2,
                  width: 48,
                  height: 48
                }}>
                  <MedicalIcon />
                </Avatar>
                <Typography variant="h3" fontWeight="bold" color="primary.main">
                  {category.procedureCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Procedures
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ height: '100%', borderRadius: 3, bgcolor: 'success.50' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ 
                  bgcolor: theme.palette.success.main, 
                  mx: 'auto', 
                  mb: 2,
                  width: 48,
                  height: 48
                }}>
                  {getTrendIcon(category.averageGrowth)}
                </Avatar>
                <Typography variant="h3" fontWeight="bold" color="success.main">
                  {category.averageGrowth > 0 ? '+' : ''}{category.averageGrowth.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Growth
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ height: '100%', borderRadius: 3, bgcolor: 'info.50' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ 
                  bgcolor: theme.palette.info.main, 
                  mx: 'auto', 
                  mb: 2,
                  width: 48,
                  height: 48
                }}>
                  <MoneyIcon />
                </Avatar>
                <Typography variant="h3" fontWeight="bold" color="info.main">
                  ${category.totalMarketSize || 0}M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Market Size
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ height: '100%', borderRadius: 3, bgcolor: 'warning.50' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ 
                  bgcolor: getCompetitionColor(category.competitionLevel || 'medium'), 
                  mx: 'auto', 
                  mb: 2,
                  width: 48,
                  height: 48
                }}>
                  <BusinessIcon />
                </Avatar>
                <Typography variant="h3" fontWeight="bold" sx={{ color: getCompetitionColor(category.competitionLevel || 'medium') }}>
                  {category.competitionLevel?.toUpperCase() || 'MED'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Competition Level
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Market Performance */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Market Performance Analysis
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Growth Trajectory
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <CircularProgress 
                    variant="determinate" 
                    value={Math.min(Math.abs(category.averageGrowth) * 2, 100)}
                    size={60}
                    thickness={6}
                    sx={{
                      color: category.averageGrowth > 5 ? theme.palette.success.main : 
                             category.averageGrowth > 0 ? theme.palette.warning.main : 
                             theme.palette.error.main
                    }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {category.averageGrowth > 10 ? 'Excellent' :
                       category.averageGrowth > 5 ? 'Good' :
                       category.averageGrowth > 0 ? 'Moderate' : 'Declining'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Growth Performance
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(Math.abs(category.averageGrowth) * 2, 100)}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: category.averageGrowth > 5 ? theme.palette.success.main : 
                               category.averageGrowth > 0 ? theme.palette.warning.main : 
                               theme.palette.error.main
                    }
                  }}
                />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Investment Score
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon 
                      key={star}
                      sx={{ 
                        color: star <= (category.investmentPotential || 3) ? theme.palette.warning.main : theme.palette.grey[300],
                        fontSize: 32
                      }}
                    />
                  ))}
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  {category.investmentPotential || 3}/5 Stars
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Investment Potential Rating
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Market Insights */}
        {insights.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Key Market Insights
            </Typography>
            <Grid container spacing={2}>
              {insights.map((insight, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper elevation={2} sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: insight.type === 'growth' ? theme.palette.success.main :
                                insight.type === 'diversity' ? theme.palette.info.main :
                                insight.type === 'competition' ? theme.palette.warning.main :
                                theme.palette.primary.main,
                        width: 40,
                        height: 40
                      }}>
                        {insight.icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          {insight.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {insight.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Strategic Recommendations */}
        {strategies.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Strategic Recommendations
            </Typography>
            <List>
              {strategies.map((strategy, index) => (
                <Paper key={index} elevation={1} sx={{ mb: 2, borderRadius: 2 }}>
                  <ListItem sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
                      <Avatar sx={{ 
                        bgcolor: strategy.priority === 'High' ? theme.palette.error.main : theme.palette.warning.main,
                        width: 32,
                        height: 32
                      }}>
                        <InsightsIcon fontSize="small" />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {strategy.title}
                          </Typography>
                          <Chip 
                            label={`${strategy.priority} Priority`}
                            size="small"
                            color={strategy.priority === 'High' ? 'error' : 'warning'}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {strategy.description}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                </Paper>
              ))}
            </List>
          </Box>
        )}

        {/* Top Procedures */}
        {category.topProcedures && category.topProcedures.length > 0 && (
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Top Performing Procedures
            </Typography>
            <Grid container spacing={2}>
              {category.topProcedures.map((procedure, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper elevation={2} sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2" fontWeight="medium">
                      {procedure}
                    </Typography>
                    <Chip 
                      label={`#${index + 1}`}
                      size="small"
                      color="primary"
                      sx={{ mt: 1 }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
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
          Export Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryAnalysisModal;