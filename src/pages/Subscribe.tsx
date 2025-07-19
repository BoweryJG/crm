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
import DiamondIcon from '@mui/icons-material/Diamond';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useAppMode } from '../contexts/AppModeContext';

type BillingCycle = 'monthly' | 'annual';
type SubscriptionTier = 'repx1' | 'repx2' | 'repx3' | 'repx4' | 'repx5';

const Subscribe: React.FC = () => {
  const theme = useTheme();
  const { mode } = useAppMode();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('repx2');

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
    
    // Use the Render backend for Stripe checkout
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://osbackend-zl1h.onrender.com';
    const res = await fetch(`${backendUrl}/api/stripe/create-checkout-session`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tier,
        billingCycle,
        priceId: pricing[tier].priceIds[billingCycle]
      })
    });
    
    const data = await res.json();
    if (data.url) {
      window.location.assign(data.url);
    }
  };

  // RepX Enhancement Levels Pricing Configuration
  const pricing = {
    repx1: {
      monthly: 39,
      annual: 390,
      priceIds: {
        monthly: 'price_1RRuqbGRiAPUZqWu3f91wnNx', // Will need new Stripe price IDs
        annual: 'price_1RWMXEGRiAPUZqWuPwcgrovN'
      },
      productId: 'prod_SMe8fPX6r65llM',
      features: {
        basic: [
          'Your Professional Business Line for Life',
          'AI transcription of every sales call',
          'Transcriptions sent directly to your CRM',
          'Professional/personal call separation',
          'Basic call analytics and history',
          '100 calls per month',
          'Eternal professional phone number'
        ],
        premium: []
      }
    },
    repx2: {
      monthly: 97,
      annual: 970,
      priceIds: {
        monthly: 'price_1RRurNGRiAPUZqWuklICsE4P',
        annual: 'price_1RWMWjGRiAPUZqWu6YBZY7o4'
      },
      productId: 'prod_SMe9s5P6OirVgP',
      features: {
        basic: [
          'Everything in Rep<sup>x</sup>1, plus:',
          'Work email integration (no IT approval needed)',
          'Basic Market Data access (all procedures)',
          '200 calls per month',
          '50 emails per day',
          '10 Canvas practice scans per day',
          'Enhanced call analytics and insights'
        ],
        premium: []
      }
    },
    repx3: {
      monthly: 197,
      annual: 1970,
      priceIds: {
        monthly: 'price_1RWMW3GRiAPUZqWuoTA0eLUC',
        annual: 'price_1RRus5GRiAPUZqWup3jk1S8U'
      },
      productId: 'prod_SMeAJE1MaklEQi',
      features: {
        basic: [
          'Everything in Rep<sup>x</sup>2, plus:',
          'Full Canvas practice intelligence platform',
          'Territory mapping and local insights',
          'Advanced market analytics with trends',
          '400 calls per month',
          '100 emails per day',
          '25 Canvas practice scans per day',
          'Competitive intelligence reports'
        ],
        premium: []
      }
    },
    repx4: {
      monthly: 397,
      annual: 3970,
      priceIds: {
        monthly: 'price_1RRushGRiAPUZqWuIvqueK7h',
        annual: 'price_1RWMT4GRiAPUZqWuqiNhkZfw'
      },
      productId: 'prod_SMeBAukl5Fqeeh',
      features: {
        basic: [
          'Everything in Rep<sup>x</sup>3, plus:',
          'AI coaching insights and recommendations',
          'Workflow automation (up to 5 workflows)',
          'Advanced CRM integration and automation',
          '600 calls per month',
          '200 emails per day', 
          '50 Canvas practice scans per day',
          'Real-time sales performance analytics'
        ],
        premium: []
      }
    },
    repx5: {
      monthly: 697,
      annual: 6970,
      priceIds: {
        monthly: 'price_1RRutVGRiAPUZqWuDMSAqHsD',
        annual: 'price_1RWMSCGRiAPUZqWu30j19b9G'
      },
      productId: 'prod_SMeBmeB7knfARi',
      features: {
        basic: [
          'Everything in Rep<sup>x</sup>4, plus:',
          'Real-time AI whisper coaching during live calls',
          'Unlimited calls, emails, and Canvas scans',
          'Unlimited workflow automations',
          'Custom AI agent configuration'
        ],
        premium: [
          'Dedicated success manager',
          'Priority support and training',
          'Custom integrations and setup',
          'Early access to new AI features',
          'The complete "Enhanced Rep" experience'
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
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Choose Your Rep<sup style={{ fontSize: '0.75em' }}>x</sup> Enhancement Level
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
          Choose your Rep<sup style={{ fontSize: '0.75em' }}>x</sup> Enhancement Level - from professional calling to unlimited AI-powered sales acceleration
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
              Annual <Chip size="small" label="Save up to 17%" color="success" sx={{ ml: 1 }} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {/* RepX1 Plan */}
        <Grid item xs={12} md={4} lg={2.4}>
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
              Rep<sup style={{ fontSize: '0.75em' }}>x</sup>1
            </Typography>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              ${pricing.repx1[billingCycle]}
              <Typography component="span" variant="body1" color="text.secondary">
                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
              </Typography>
            </Typography>
            {billingCycle === 'annual' && (
              <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                Save ${getSavings('repx1').savings}/year
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
              Your Professional Business Line for Life
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense sx={{ flexGrow: 1 }}>
              {pricing.repx1.features.basic.map((feature, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={feature} 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
            
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth 
              sx={{ mt: 2 }}
              onClick={() => handleSubscribe('repx1')}
            >
              Get Started
            </Button>
          </Paper>
        </Grid>
        
        {/* RepX2 Plan */}
        <Grid item xs={12} md={4} lg={2.4}>
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
              Rep<sup style={{ fontSize: '0.75em' }}>x</sup>2
            </Typography>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              ${pricing.repx2[billingCycle]}
              <Typography component="span" variant="body1" color="text.secondary">
                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
              </Typography>
            </Typography>
            {billingCycle === 'annual' && (
              <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                Save ${getSavings('repx2').savings}/year
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
              Professional calling + work email integration
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense sx={{ flexGrow: 1 }}>
              {pricing.repx2.features.basic.map((feature, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={feature} 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ mt: 2 }}
              onClick={() => handleSubscribe('repx2')}
            >
              Get Rep<sup style={{ fontSize: '0.75em' }}>x</sup>2
            </Button>
          </Paper>
        </Grid>
        
        {/* RepX3 Plan */}
        <Grid item xs={12} md={4} lg={2.4}>
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
                Rep<sup style={{ fontSize: '0.75em' }}>x</sup>3
              </Typography>
              <StarIcon color="primary" sx={{ ml: 1 }} />
            </Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              ${pricing.repx3[billingCycle]}
              <Typography component="span" variant="body1" color="text.secondary">
                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
              </Typography>
            </Typography>
            {billingCycle === 'annual' && (
              <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                Save ${getSavings('repx3').savings}/year
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
              Full Canvas intelligence + territory mapping
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense sx={{ flexGrow: 1 }}>
              {pricing.repx3.features.basic.map((feature, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={feature} 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
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
              onClick={() => handleSubscribe('repx3')}
            >
              Get Rep<sup style={{ fontSize: '0.75em' }}>x</sup>3
            </Button>
          </Paper>
        </Grid>

        {/* RepX4 Plan */}
        <Grid item xs={12} md={4} lg={2.4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.secondary.main, 0.03),
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Rep<sup style={{ fontSize: '0.75em' }}>x</sup>4
              </Typography>
              <DiamondIcon color="secondary" sx={{ ml: 1 }} />
            </Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              ${pricing.repx4[billingCycle]}
              <Typography component="span" variant="body1" color="text.secondary">
                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
              </Typography>
            </Typography>
            {billingCycle === 'annual' && (
              <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                Save ${getSavings('repx4').savings}/year
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
              AI coaching insights + workflow automation
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense sx={{ flexGrow: 1 }}>
              {pricing.repx4.features.basic.map((feature, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={feature} 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
            
            <Button 
              variant="contained" 
              color="secondary" 
              fullWidth 
              sx={{ mt: 2 }}
              onClick={() => handleSubscribe('repx4')}
            >
              Get Rep<sup style={{ fontSize: '0.75em' }}>x</sup>4
            </Button>
          </Paper>
        </Grid>

        {/* RepX5 Plan */}
        <Grid item xs={12} md={4} lg={2.4}>
          <Paper 
            elevation={6} 
            sx={{ 
              p: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
              border: `2px solid ${theme.palette.warning.main}`,
              position: 'relative',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Chip 
              label="PREMIUM" 
              color="warning" 
              size="small" 
              sx={{ 
                position: 'absolute', 
                top: -12, 
                left: '50%', 
                transform: 'translateX(-50%)',
                fontWeight: 'bold'
              }} 
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Rep<sup style={{ fontSize: '0.75em' }}>x</sup>5
              </Typography>
              <EmojiEventsIcon color="warning" sx={{ ml: 1 }} />
            </Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              ${pricing.repx5[billingCycle]}
              <Typography component="span" variant="body1" color="text.secondary">
                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
              </Typography>
            </Typography>
            {billingCycle === 'annual' && (
              <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                Save ${getSavings('repx5').savings}/year
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
              The complete Enhanced Rep experience
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense sx={{ flexGrow: 1 }}>
              {pricing.repx5.features.basic.map((feature, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={feature} 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
              
              {pricing.repx5.features.premium.length > 0 && (
                <>
                  {pricing.repx5.features.premium.map((feature, index) => (
                    <ListItem key={`premium-${index}`} disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <EmojiEventsIcon color="warning" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature} 
                        primaryTypographyProps={{ 
                          fontWeight: 'medium',
                          variant: 'body2'
                        }}
                      />
                    </ListItem>
                  ))}
                </>
              )}
            </List>
            
            <Button 
              variant="contained" 
              fullWidth 
              sx={{ 
                mt: 2,
                backgroundColor: theme.palette.warning.main,
                color: theme.palette.warning.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.warning.dark,
                }
              }}
              onClick={() => handleSubscribe('repx5')}
            >
              Get Rep<sup style={{ fontSize: '0.75em' }}>x</sup>5
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