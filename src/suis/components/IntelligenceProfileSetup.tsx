// SUIS Intelligence Profile Setup Component
// Onboarding flow for new users to configure their intelligence profile

import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Grid,
  Card,
  CardContent,
  CardHeader,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Slider,
  Alert,
  CircularProgress,
  Paper,
  Avatar,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  TrendingUp as GoalIcon,
  Settings as PreferencesIcon,
  CheckCircle as CompleteIcon,
  LocalHospital as MedicalIcon,
  Face as AestheticIcon,
  Science as SurgicalIcon
} from '@mui/icons-material';
import { useSUIS } from '../../hooks/useSUIS';
import { IntelligenceProfile } from '../types';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    label: 'Profile Type',
    icon: <PersonIcon />,
    description: 'Select your role in the organization'
  },
  {
    label: 'Specializations',
    icon: <BusinessIcon />,
    description: 'Choose your areas of expertise'
  },
  {
    label: 'Goals & Targets',
    icon: <GoalIcon />,
    description: 'Set your sales and performance goals'
  },
  {
    label: 'Preferences',
    icon: <PreferencesIcon />,
    description: 'Customize your SUIS experience'
  }
];

const IntelligenceProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { state, actions } = useSUIS();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile form state
  const [profileData, setProfileData] = useState<Partial<IntelligenceProfile>>({
    profileType: 'rep',
    specializations: [],
    territoryIds: [],
    goals: {
      salesTargets: {
        monthly: 100000,
        quarterly: 300000,
        annual: 1200000
      },
      procedureFocus: [],
      territoryExpansion: false,
      skillDevelopment: [],
      clientRetention: 80
    },
    preferences: {
      notificationFrequency: 'real_time',
      insightDepth: 'detailed',
      automationLevel: 'assisted',
      communicationStyle: 'formal',
      dashboardLayout: {
        layout: 'grid',
        widgets: [],
        customizations: {
          autoArrange: true,
          compactMode: false,
          gridSize: 12,
          padding: 16,
          allowOverlap: false
        },
        responsiveBreakpoints: {
          xs: 480,
          sm: 768,
          md: 1024,
          lg: 1280,
          xl: 1920
        }
      }
    }
  });

  // Check if user already has a profile
  useEffect(() => {
    if (state.intelligenceProfile) {
      navigate('/intelligence');
    }
  }, [state.intelligenceProfile, navigate]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await actions.updateIntelligenceProfile(profileData);
      navigate('/intelligence');
    } catch (err) {
      setError('Failed to create profile. Please try again.');
      console.error('Profile creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // Profile Type
        return (
          <Box>
            <FormControl component="fieldset">
              <RadioGroup
                value={profileData.profileType}
                onChange={(e) => setProfileData({
                  ...profileData,
                  profileType: e.target.value as 'rep' | 'manager' | 'executive'
                })}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        border: profileData.profileType === 'rep' ? 2 : 0,
                        borderColor: 'primary.main'
                      }}
                      onClick={() => setProfileData({ ...profileData, profileType: 'rep' })}
                    >
                      <CardContent>
                        <FormControlLabel
                          value="rep"
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="h6">Sales Representative</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Field sales, direct customer engagement
                              </Typography>
                            </Box>
                          }
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        border: profileData.profileType === 'manager' ? 2 : 0,
                        borderColor: 'primary.main'
                      }}
                      onClick={() => setProfileData({ ...profileData, profileType: 'manager' })}
                    >
                      <CardContent>
                        <FormControlLabel
                          value="manager"
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="h6">Sales Manager</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Team leadership, territory management
                              </Typography>
                            </Box>
                          }
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        border: profileData.profileType === 'executive' ? 2 : 0,
                        borderColor: 'primary.main'
                      }}
                      onClick={() => setProfileData({ ...profileData, profileType: 'executive' })}
                    >
                      <CardContent>
                        <FormControlLabel
                          value="executive"
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="h6">Executive</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Strategic oversight, company leadership
                              </Typography>
                            </Box>
                          }
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 1: // Specializations
        return (
          <Box>
            <Typography variant="body1" gutterBottom>
              Select all areas where you have expertise:
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    border: profileData.specializations?.includes('aesthetics') ? 2 : 0,
                    borderColor: 'primary.main'
                  }}
                  onClick={() => {
                    const specs = profileData.specializations || [];
                    if (specs.includes('aesthetics')) {
                      setProfileData({
                        ...profileData,
                        specializations: specs.filter(s => s !== 'aesthetics')
                      });
                    } else {
                      setProfileData({
                        ...profileData,
                        specializations: [...specs, 'aesthetics']
                      });
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2 }}>
                      <AestheticIcon />
                    </Avatar>
                    <Typography variant="h6">Aesthetics</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cosmetic procedures, injectables, skin treatments
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    border: profileData.specializations?.includes('dental') ? 2 : 0,
                    borderColor: 'primary.main'
                  }}
                  onClick={() => {
                    const specs = profileData.specializations || [];
                    if (specs.includes('dental')) {
                      setProfileData({
                        ...profileData,
                        specializations: specs.filter(s => s !== 'dental')
                      });
                    } else {
                      setProfileData({
                        ...profileData,
                        specializations: [...specs, 'dental']
                      });
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                      <MedicalIcon />
                    </Avatar>
                    <Typography variant="h6">Dental</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Implants, orthodontics, restorative procedures
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    border: profileData.specializations?.includes('surgical') ? 2 : 0,
                    borderColor: 'primary.main'
                  }}
                  onClick={() => {
                    const specs = profileData.specializations || [];
                    if (specs.includes('surgical')) {
                      setProfileData({
                        ...profileData,
                        specializations: specs.filter(s => s !== 'surgical')
                      });
                    } else {
                      setProfileData({
                        ...profileData,
                        specializations: [...specs, 'surgical']
                      });
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'error.main', mx: 'auto', mb: 2 }}>
                      <SurgicalIcon />
                    </Avatar>
                    <Typography variant="h6">Surgical</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Advanced surgical devices, OR equipment
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      case 2: // Goals & Targets
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Sales Targets
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Monthly Target"
                  type="number"
                  value={profileData.goals?.salesTargets?.monthly || 0}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    goals: {
                      ...profileData.goals!,
                      salesTargets: {
                        ...profileData.goals!.salesTargets!,
                        monthly: parseInt(e.target.value) || 0
                      }
                    }
                  })}
                  InputProps={{
                    startAdornment: '$'
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Quarterly Target"
                  type="number"
                  value={profileData.goals?.salesTargets?.quarterly || 0}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    goals: {
                      ...profileData.goals!,
                      salesTargets: {
                        ...profileData.goals!.salesTargets!,
                        quarterly: parseInt(e.target.value) || 0
                      }
                    }
                  })}
                  InputProps={{
                    startAdornment: '$'
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Annual Target"
                  type="number"
                  value={profileData.goals?.salesTargets?.annual || 0}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    goals: {
                      ...profileData.goals!,
                      salesTargets: {
                        ...profileData.goals!.salesTargets!,
                        annual: parseInt(e.target.value) || 0
                      }
                    }
                  })}
                  InputProps={{
                    startAdornment: '$'
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" gutterBottom>
                  Client Retention Target
                </Typography>
                <Slider
                  value={profileData.goals?.clientRetention || 80}
                  onChange={(e, value) => setProfileData({
                    ...profileData,
                    goals: {
                      ...profileData.goals!,
                      clientRetention: value as number
                    }
                  })}
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={0}
                  max={100}
                  valueLabelFormat={(value) => `${value}%`}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={profileData.goals?.territoryExpansion || false}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        goals: {
                          ...profileData.goals!,
                          territoryExpansion: e.target.checked
                        }
                      })}
                    />
                  }
                  label="I'm interested in territory expansion opportunities"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3: // Preferences
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Notification Frequency</InputLabel>
                  <Select
                    value={profileData.preferences?.notificationFrequency || 'real_time'}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      preferences: {
                        ...profileData.preferences!,
                        notificationFrequency: e.target.value as any
                      }
                    })}
                  >
                    <MenuItem value="real_time">Real-time</MenuItem>
                    <MenuItem value="hourly">Hourly</MenuItem>
                    <MenuItem value="daily">Daily Digest</MenuItem>
                    <MenuItem value="weekly">Weekly Summary</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Insight Depth</InputLabel>
                  <Select
                    value={profileData.preferences?.insightDepth || 'detailed'}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      preferences: {
                        ...profileData.preferences!,
                        insightDepth: e.target.value as any
                      }
                    })}
                  >
                    <MenuItem value="summary">Summary Only</MenuItem>
                    <MenuItem value="balanced">Balanced</MenuItem>
                    <MenuItem value="detailed">Detailed Analysis</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Automation Level</InputLabel>
                  <Select
                    value={profileData.preferences?.automationLevel || 'assisted'}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      preferences: {
                        ...profileData.preferences!,
                        automationLevel: e.target.value as any
                      }
                    })}
                  >
                    <MenuItem value="manual">Manual Control</MenuItem>
                    <MenuItem value="assisted">AI-Assisted</MenuItem>
                    <MenuItem value="automated">Fully Automated</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>AI Communication Style</InputLabel>
                  <Select
                    value={profileData.preferences?.communicationStyle || 'formal'}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      preferences: {
                        ...profileData.preferences!,
                        communicationStyle: e.target.value as any
                      }
                    })}
                  >
                    <MenuItem value="casual">Casual & Friendly</MenuItem>
                    <MenuItem value="formal">Professional & Formal</MenuItem>
                    <MenuItem value="technical">Technical & Detailed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome to SUIS Intelligence
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Let's set up your intelligence profile to personalize your experience and optimize insights for your role.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={() => (
                  <Avatar
                    sx={{
                      bgcolor: activeStep >= index ? 'primary.main' : 'grey.300',
                      width: 32,
                      height: 32
                    }}
                  >
                    {activeStep > index ? <CompleteIcon /> : step.icon}
                  </Avatar>
                )}
              >
                <Typography variant="h6">{step.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </StepLabel>
              <StepContent>
                <Box sx={{ mb: 2, mt: 2 }}>
                  {renderStepContent(index)}
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={index === steps.length - 1 ? handleComplete : handleNext}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : index === steps.length - 1 ? (
                      'Complete Setup'
                    ) : (
                      'Continue'
                    )}
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length && (
          <Paper
            square
            elevation={0}
            sx={{
              p: 3,
              mt: 3,
              textAlign: 'center',
              bgcolor: 'success.light'
            }}
          >
            <Typography variant="h5" gutterBottom>
              All steps completed! 🎉
            </Typography>
            <Typography variant="body1">
              Your intelligence profile is being created...
            </Typography>
          </Paper>
        )}
      </Paper>
    </Box>
  );
};

export default IntelligenceProfileSetup;