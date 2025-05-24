import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Grid, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  alpha
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import { useAppMode } from '../contexts/AppModeContext';

type BillingCycle = 'monthly' | 'annual';
type SubscriptionTier = 'explorer' | 'professional' | 'insights';

const Subscribe: React.FC = () => {
  const theme = useTheme();
  const { mode } = useAppMode();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('professional');

  const handleBillingCycleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newBillingCycle: BillingCycle | null,
  ) => {
    if (newBillingCycle !== null) {
      setBillingCycle(newBillingCycle);
    }
  };

  const handleSubscribe = async (tier: SubscriptionTier) => {
    // Set the selected tier before proceeding to checkout
    setSelectedTier(tier);
    
    // In a real implementation, we would pass the tier and billing cycle to the API
    const res = await fetch('/api/create-checkout-session', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tier,
        billingCycle
      })
    });
    
    const data = await res.json();
    if (data.url) {
      window.location.assign(data.url);
    }
  };

  // Pricing configuration
  const pricing = {
    explorer: {
      monthly: 0,
      annual: 0,
      features: {
        basic: [
          'Demo mode only',
          'Limited call recording (5 calls/month)',
          'Basic call transcription',
          'Sample linguistics insights'
        ],
        premium: []
      }
    },
    professional: {
      monthly: 29,
      annual: 290, // Save ~17%
      features: {
        basic: [
          'Live mode access',
          'Unlimited call recording and storage',
          'Full call transcription',
          'Basic sentiment analysis',
          'Call tagging and organization',
          '10 linguistics analyses per month'
        ],
        premium: []
      }
    },
    insights: {
      monthly: 79,
      annual: 790, // Save ~17%
      features: {
        basic: [
          'Everything in Professional plan',
          'Unlimited linguistics analyses',
          'Detailed sentiment progression tracking',
          'Key phrase extraction',
          'Topic segmentation'
        ],
        premium: [
          'Action item identification',
          'Speaking pace and talk-to-listen ratio',
          'Competitive intelligence extraction',
          'Custom dashboards and reports'
        ]
      }
    }
  };

  // Calculate savings for annual billing
  const getSavings = (tier: SubscriptionTier) => {
    const monthlyCost = pricing[tier].monthly;
    const annualCost = pricing[tier].annual;
    const monthlyCostForYear = monthlyCost * 12;
    const savings = monthlyCostForYear - annualCost;
    const savingsPercentage = Math.round((savings / monthlyCostForYear) * 100);
    return { savings, savingsPercentage };
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Choose Your Plan
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
          Unlock the full potential of SphereOS CRM with a plan that fits your needs
        </Typography>
        
        {/* Billing cycle toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <ToggleButtonGroup
            color="primary"
            value={billingCycle}
            exclusive
            onChange={handleBillingCycleChange}
            aria-label="billing cycle"
            sx={{ 
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[1],
              borderRadius: 2
            }}
          >
            <ToggleButton value="monthly" aria-label="monthly billing">
              Monthly
            </ToggleButton>
            <ToggleButton value="annual" aria-label="annual billing">
              Annual <Chip size="small" label="Save 17%" color="success" sx={{ ml: 1 }} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {/* Explorer Plan (Free) */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 2,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Explorer
            </Typography>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Free
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Try out SphereOS CRM with limited features
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense sx={{ flexGrow: 1 }}>
              {pricing.explorer.features.basic.map((feature, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
            
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth 
              sx={{ mt: 2 }}
              disabled={mode === 'demo'}
            >
              Current Plan
            </Button>
          </Paper>
        </Grid>
        
        {/* Professional Plan */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={6} 
            sx={{ 
              p: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 2,
              border: `2px solid ${theme.palette.primary.main}`,
              position: 'relative',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Chip 
              label="MOST POPULAR" 
              color="primary" 
              size="small" 
              sx={{ 
                position: 'absolute', 
                top: -12, 
                left: '50%', 
                transform: 'translateX(-50%)',
                fontWeight: 'bold'
              }} 
            />
            
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Professional
            </Typography>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              ${pricing.professional[billingCycle]}
              <Typography component="span" variant="body1" color="text.secondary">
                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
              </Typography>
            </Typography>
            {billingCycle === 'annual' && (
              <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                Save ${getSavings('professional').savings}/year ({getSavings('professional').savingsPercentage}% off)
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Perfect for sales reps who need live data and call recording
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense sx={{ flexGrow: 1 }}>
              {pricing.professional.features.basic.map((feature, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ mt: 2 }}
              onClick={() => handleSubscribe('professional')}
            >
              {mode === 'live' ? 'Upgrade Now' : 'Get Started'}
            </Button>
          </Paper>
        </Grid>
        
        {/* Insights Plan */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.03),
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Insights
              </Typography>
              <StarIcon color="primary" sx={{ ml: 1 }} />
            </Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              ${pricing.insights[billingCycle]}
              <Typography component="span" variant="body1" color="text.secondary">
                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
              </Typography>
            </Typography>
            {billingCycle === 'annual' && (
              <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                Save ${getSavings('insights').savings}/year ({getSavings('insights').savingsPercentage}% off)
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Advanced linguistics analysis for sales professionals who want to maximize every call
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense sx={{ flexGrow: 1 }}>
              {pricing.insights.features.basic.map((feature, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
              
              {pricing.insights.features.premium.length > 0 && (
                <>
                  <ListItem sx={{ pt: 2 }}>
                    <Typography variant="subtitle2" color="primary" fontWeight="bold">
                      Premium Features:
                    </Typography>
                  </ListItem>
                  
                  {pricing.insights.features.premium.map((feature, index) => (
                    <ListItem key={`premium-${index}`} disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <StarIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature} 
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                    </ListItem>
                  ))}
                </>
              )}
            </List>
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ 
                mt: 2,
                backgroundColor: theme.palette.primary.dark,
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                }
              }}
              onClick={() => handleSubscribe('insights')}
            >
              Get Premium
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Money-back guarantee and support info */}
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="body2" color="text.secondary">
          All plans come with a 30-day money-back guarantee. No questions asked.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Need help choosing? Contact our sales team at sales@sphereoscrm.com
        </Typography>
      </Box>
    </Box>
  );
};

export default Subscribe;
