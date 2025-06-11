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
type SubscriptionTier = 'explorer' | 'professional' | 'growth' | 'enterprise' | 'elite';

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
        billingCycle,
        priceId: pricing[tier].priceIds[billingCycle]
      })
    });
    
    const data = await res.json();
    if (data.url) {
      window.location.assign(data.url);
    }
  };

  // Pricing configuration from Stripe CSV
  const pricing = {
    explorer: {
      monthly: 49,
      annual: 490,
      priceIds: {
        monthly: 'price_1RRuqbGRiAPUZqWu3f91wnNx',
        annual: 'price_1RWMXEGRiAPUZqWuPwcgrovN'
      },
      productId: 'prod_SMe8fPX6r65llM',
      features: {
        basic: [
          'Test the waters with essential market insights',
          'Access to 25% of dental/aesthetic procedure database',
          'View market sizes and growth rates (top-level only)',
          '5 AI Workspace prompts/month',
          'Basic category descriptions',
          'Weekly market digest email',
          'Badge: Explorer Badge in community'
        ],
        premium: []
      }
    },
    professional: {
      monthly: 149,
      annual: 1490,
      priceIds: {
        monthly: 'price_1RRurNGRiAPUZqWuklICsE4P',
        annual: 'price_1RWMWjGRiAPUZqWu6YBZY7o4'
      },
      productId: 'prod_SMe9s5P6OirVgP',
      features: {
        basic: [
          'Everything you need to excel in your territory',
          'Full access to complete procedure database',
          'Detailed market insights with growth projections',
          '50 AI Workspace prompts/month',
          'Linguistics module: 10 call analyses/month',
          'Recent news article links',
          'Export capabilities (PDF/CSV)',
          'Badge: Professional Badge + priority support'
        ],
        premium: []
      }
    },
    growth: {
      monthly: 349,
      annual: 3490,
      priceIds: {
        monthly: 'price_1RWMW3GRiAPUZqWuoTA0eLUC',
        annual: 'price_1RRus5GRiAPUZqWup3jk1S8U'
      },
      productId: 'prod_SMeAJE1MaklEQi',
      features: {
        basic: [
          'Scale your success with advanced analytics',
          'Everything in Professional, plus:',
          'Unlimited AI Workspace prompts',
          '50 call analyses/month with coaching insights',
          'CRM module access (manual entry)',
          'Custom market reports (3/month)',
          'Team collaboration features (up to 3 users)',
          'API access for basic integrations',
          'Badge: Growth Badge + quarterly strategy call'
        ],
        premium: []
      }
    },
    enterprise: {
      monthly: 749,
      annual: 7490,
      priceIds: {
        monthly: 'price_1RRushGRiAPUZqWuIvqueK7h',
        annual: 'price_1RWMT4GRiAPUZqWuqiNhkZfw'
      },
      productId: 'prod_SMeBAukl5Fqeeh',
      features: {
        basic: [
          'Command center for market domination',
          'Everything in Growth, plus:',
          'Unlimited call analyses with AI coaching',
          'Full CRM automation features',
          'AI-powered workflow automation (5 workflows)',
          'Custom AI prompt library creation',
          'White-label reports for clients',
          'Team access (up to 10 users)',
          'Priority API access',
          'Badge: Enterprise Badge + monthly strategy calls'
        ],
        premium: []
      }
    },
    elite: {
      monthly: 1499,
      annual: 14990,
      priceIds: {
        monthly: 'price_1RRutVGRiAPUZqWuDMSAqHsD',
        annual: 'price_1RWMSCGRiAPUZqWu30j19b9G'
      },
      productId: 'prod_SMeBmeB7knfARi',
      features: {
        basic: [
          'Your personal AI-powered sales acceleration team',
          'Everything in Enterprise, plus:'
        ],
        premium: [
          'Unlimited workflow automations',
          'Custom AI agent configuration',
          'Done-for-you report generation',
          'Dedicated success manager',
          'Custom integrations',
          'Unlimited team members',
          'Quarterly business reviews',
          'Early access to new features',
          'Badge: Elite Badge + weekly check-ins'
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
              Annual <Chip size="small" label="Save up to 17%" color="success" sx={{ ml: 1 }} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {/* Explorer Plan */}
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
              Explorer
            </Typography>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              ${pricing.explorer[billingCycle]}
              <Typography component="span" variant="body1" color="text.secondary">
                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
              </Typography>
            </Typography>
            {billingCycle === 'annual' && (
              <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                Save ${getSavings('explorer').savings}/year
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
              Test the waters with essential market insights
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense sx={{ flexGrow: 1 }}>
              {pricing.explorer.features.basic.map((feature, index) => (
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
              onClick={() => handleSubscribe('explorer')}
            >
              Get Started
            </Button>
          </Paper>
        </Grid>
        
        {/* Professional Plan */}
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
                Save ${getSavings('professional').savings}/year
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
              Everything you need to excel in your territory
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense sx={{ flexGrow: 1 }}>
              {pricing.professional.features.basic.map((feature, index) => (
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
              onClick={() => handleSubscribe('professional')}
            >
              Get Professional
            </Button>
          </Paper>
        </Grid>
        
        {/* Growth Plan */}
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
                Growth
              </Typography>
              <StarIcon color="primary" sx={{ ml: 1 }} />
            </Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              ${pricing.growth[billingCycle]}
              <Typography component="span" variant="body1" color="text.secondary">
                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
              </Typography>
            </Typography>
            {billingCycle === 'annual' && (
              <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                Save ${getSavings('growth').savings}/year
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
              Scale your success with advanced analytics
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense sx={{ flexGrow: 1 }}>
              {pricing.growth.features.basic.map((feature, index) => (
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
              onClick={() => handleSubscribe('growth')}
            >
              Scale Up
            </Button>
          </Paper>
        </Grid>

        {/* Enterprise Plan */}
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
                Enterprise
              </Typography>
              <DiamondIcon color="secondary" sx={{ ml: 1 }} />
            </Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              ${pricing.enterprise[billingCycle]}
              <Typography component="span" variant="body1" color="text.secondary">
                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
              </Typography>
            </Typography>
            {billingCycle === 'annual' && (
              <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                Save ${getSavings('enterprise').savings}/year
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
              Command center for market domination
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense sx={{ flexGrow: 1 }}>
              {pricing.enterprise.features.basic.map((feature, index) => (
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
              onClick={() => handleSubscribe('enterprise')}
            >
              Go Enterprise
            </Button>
          </Paper>
        </Grid>

        {/* Elite Plan */}
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
                Elite
              </Typography>
              <EmojiEventsIcon color="warning" sx={{ ml: 1 }} />
            </Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              ${pricing.elite[billingCycle]}
              <Typography component="span" variant="body1" color="text.secondary">
                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
              </Typography>
            </Typography>
            {billingCycle === 'annual' && (
              <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                Save ${getSavings('elite').savings}/year
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
              Your personal AI-powered sales acceleration team
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense sx={{ flexGrow: 1 }}>
              {pricing.elite.features.basic.map((feature, index) => (
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
              
              {pricing.elite.features.premium.length > 0 && (
                <>
                  {pricing.elite.features.premium.map((feature, index) => (
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
              onClick={() => handleSubscribe('elite')}
            >
              Go Elite
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