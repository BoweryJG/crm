// Content Forge - Minimalist workshop for crafting perfect messages
// Where raw ideas are forged into compelling content

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Stack,
  Grid,
  Fade,
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Article as ArticleIcon,
  Campaign as CampaignIcon,
  Description as ProposalIcon,
  Reply as FollowUpIcon,
  LocalFireDepartment as ForgeIcon,
  ContentCopy as CopyIcon,
  Send as SendIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  AutoAwesome as SparkIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { Monolith, Gallery } from '../../../components/gallery';
import glassEffects from '../../../themes/glassEffects';
import animations from '../../../themes/animations';
import { CanvasBase, AIGenerateButton } from './CanvasBase';
import { useAuth } from '../../../auth';
import { useNavigate } from 'react-router-dom';

interface ForgeMold {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface ForgeSettings {
  temperature: number; // Tone: 0=Professional, 50=Balanced, 100=Friendly
  pressure: number; // Length: 0=Concise, 50=Standard, 100=Detailed
  material: string; // Context/topic
}

const ContentForge: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedMold, setSelectedMold] = useState<string>('email');
  const [loading, setLoading] = useState(false);
  const [forgedContent, setForgedContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [settings, setSettings] = useState<ForgeSettings>({
    temperature: 50,
    pressure: 50,
    material: '',
  });

  const molds: ForgeMold[] = [
    { id: 'email', name: 'Email', icon: <EmailIcon />, description: 'Professional outreach' },
    { id: 'social', name: 'Social', icon: <CampaignIcon />, description: 'Social media posts' },
    { id: 'proposal', name: 'Proposal', icon: <ProposalIcon />, description: 'Business proposals' },
    { id: 'article', name: 'Article', icon: <ArticleIcon />, description: 'Blog & articles' },
    { id: 'followup', name: 'Follow-up', icon: <FollowUpIcon />, description: 'Follow-up messages' },
  ];

  const handleForge = () => {
    if (!settings.material) return;
    
    setLoading(true);
    // Simulate AI processing with sparks
    setTimeout(() => {
      const tone = settings.temperature < 33 ? 'professional' : settings.temperature < 67 ? 'balanced' : 'friendly';
      const length = settings.pressure < 33 ? 'concise' : settings.pressure < 67 ? 'standard' : 'detailed';
      
      // Generate demo content based on settings
      let content = '';
      if (selectedMold === 'email') {
        content = `Subject: Revolutionary ${settings.material} Solutions for Your Practice\n\nDear Dr. [Name],\n\nI hope this message finds you well. I wanted to reach out regarding an exciting opportunity that could transform your practice's approach to ${settings.material}.\n\nOur latest innovation has helped practices like yours achieve:\n• 40% increase in patient satisfaction\n• 30% reduction in treatment time\n• ROI within 4-6 months\n\nI'd love to schedule a brief call to discuss how this could benefit your specific needs.\n\nBest regards,\n[Your Name]`;
      } else if (selectedMold === 'social') {
        content = `🚀 Exciting news in ${settings.material}!\n\nJust witnessed an incredible transformation at Dr. Smith's practice. Their new approach to patient care is setting new standards in the industry.\n\n✨ Key highlights:\n→ Cutting-edge technology\n→ Patient-first approach\n→ Measurable results\n\n#MedicalInnovation #${settings.material.replace(/\s+/g, '')} #HealthcareExcellence`;
      }
      
      setForgedContent(content);
      setEditedContent(content);
      setLoading(false);
    }, 2000);
  };

  const getToneLabel = (value: number) => {
    if (value < 33) return 'PROFESSIONAL';
    if (value < 67) return 'BALANCED';
    return 'FRIENDLY';
  };

  const getLengthLabel = (value: number) => {
    if (value < 33) return 'CONCISE';
    if (value < 67) return 'STANDARD';
    return 'DETAILED';
  };

  return (
    <CanvasBase
      overline="CONTENT WORKSHOP"
      title="CONTENT FORGE"
      subtitle="Transform raw ideas into polished communications. Your workshop for crafting compelling messages."
      emptyStateIcon={<ForgeIcon />}
      emptyStateMessage="SELECT A MOLD AND ADD MATERIAL TO BEGIN FORGING"
      onSignInClick={() => navigate('/login')}
    >
      <Grid container spacing={3}>
        {/* Left Panel - Mold Selection */}
        <Grid item xs={12} md={3}>
          <Monolith
            variant="carbon"
            elevation="elevated"
            hover="none"
            title="SELECT MOLD"
            fullHeight
          >
            <Stack spacing={2}>
              {molds.map((mold) => (
                <Paper
                  key={mold.id}
                  onClick={() => setSelectedMold(mold.id)}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    backgroundColor: selectedMold === mold.id
                      ? alpha(theme.palette.primary.main, 0.1)
                      : alpha(theme.palette.background.paper, 0.3),
                    border: `1px solid ${selectedMold === mold.id
                      ? alpha(theme.palette.primary.main, 0.3)
                      : alpha(theme.palette.divider, 0.1)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        color: selectedMold === mold.id
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                      }}
                    >
                      {mold.icon}
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          letterSpacing: '0.05em',
                          fontWeight: selectedMold === mold.id ? 600 : 400,
                        }}
                      >
                        {mold.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          letterSpacing: '0.03em',
                        }}
                      >
                        {mold.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Monolith>
        </Grid>

        {/* Center Panel - Forge Workspace */}
        <Grid item xs={12} md={6}>
          <Monolith
            variant="obsidian"
            elevation="floating"
            hover="none"
            title="FORGE WORKSPACE"
            fullHeight
          >
            {/* Material Input */}
            <TextField
              fullWidth
              multiline
              rows={3}
              value={settings.material}
              onChange={(e) => setSettings({ ...settings, material: e.target.value })}
              placeholder="Add your raw material here... (topic, key points, or rough ideas)"
              variant="outlined"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.3),
                  '& fieldset': {
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  },
                  '&:hover fieldset': {
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  },
                },
                '& .MuiInputBase-input': {
                  letterSpacing: '0.02em',
                },
              }}
            />

            <Divider sx={{ my: 3, opacity: 0.1 }} />

            {/* Forged Content Display */}
            {forgedContent ? (
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: theme.palette.primary.main,
                      letterSpacing: '0.2em',
                    }}
                  >
                    FORGED CONTENT
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => setIsEditing(!isEditing)}
                        sx={{ color: theme.palette.primary.main }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy">
                      <IconButton
                        size="small"
                        onClick={() => navigator.clipboard.writeText(editedContent)}
                        sx={{ color: theme.palette.primary.main }}
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {user && (
                      <>
                        <Tooltip title="Save Template">
                          <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
                            <SaveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Send">
                          <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
                            <SendIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Stack>
                </Stack>

                {isEditing ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={10}
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: alpha(theme.palette.background.paper, 0.5),
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                      },
                    }}
                  />
                ) : (
                  <Paper
                    sx={{
                      p: 3,
                      ...glassEffects.effects.museum,
                      backgroundColor: alpha(theme.palette.background.paper, 0.3),
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'inherit',
                      letterSpacing: '0.02em',
                      lineHeight: 1.8,
                    }}
                  >
                    {editedContent}
                  </Paper>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  py: 8,
                  textAlign: 'center',
                  opacity: 0.5,
                }}
              >
                <SparkIcon sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="body2" sx={{ letterSpacing: '0.1em' }}>
                  YOUR FORGED CONTENT WILL APPEAR HERE
                </Typography>
              </Box>
            )}
          </Monolith>
        </Grid>

        {/* Right Panel - Forge Controls */}
        <Grid item xs={12} md={3}>
          <Monolith
            variant="frostedSteel"
            elevation="elevated"
            hover="none"
            title="FORGE CONTROLS"
            fullHeight
          >
            <Stack spacing={4}>
              {/* Temperature Control (Tone) */}
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    display: 'block',
                    mb: 2,
                    letterSpacing: '0.1em',
                    color: theme.palette.text.secondary,
                  }}
                >
                  TEMPERATURE (TONE)
                </Typography>
                <Slider
                  value={settings.temperature}
                  onChange={(_, value) => setSettings({ ...settings, temperature: value as number })}
                  sx={{
                    color: theme.palette.primary.main,
                    '& .MuiSlider-thumb': {
                      backgroundColor: theme.palette.primary.main,
                      '&:hover': {
                        boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.16)}`,
                      },
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    textAlign: 'center',
                    mt: 1,
                    letterSpacing: '0.1em',
                    color: theme.palette.primary.main,
                  }}
                >
                  {getToneLabel(settings.temperature)}
                </Typography>
              </Box>

              {/* Pressure Control (Length) */}
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    display: 'block',
                    mb: 2,
                    letterSpacing: '0.1em',
                    color: theme.palette.text.secondary,
                  }}
                >
                  PRESSURE (LENGTH)
                </Typography>
                <Slider
                  value={settings.pressure}
                  onChange={(_, value) => setSettings({ ...settings, pressure: value as number })}
                  sx={{
                    color: theme.palette.primary.main,
                    '& .MuiSlider-thumb': {
                      backgroundColor: theme.palette.primary.main,
                      '&:hover': {
                        boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.16)}`,
                      },
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    textAlign: 'center',
                    mt: 1,
                    letterSpacing: '0.1em',
                    color: theme.palette.primary.main,
                  }}
                >
                  {getLengthLabel(settings.pressure)}
                </Typography>
              </Box>

              <Divider sx={{ opacity: 0.1 }} />

              {/* Forge Button */}
              <AIGenerateButton
                onClick={handleForge}
                disabled={!settings.material}
                loading={loading}
                label="FORGE CONTENT"
                fullWidth
              />

              {/* Sparks Animation */}
              {loading && (
                <Box
                  sx={{
                    position: 'relative',
                    height: 60,
                    overflow: 'hidden',
                  }}
                >
                  {[...Array(5)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: `${20 * i}%`,
                        width: 4,
                        height: 4,
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: '50%',
                        animation: `spark-${i} 1s ease-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                        [`@keyframes spark-${i}`]: {
                          '0%': {
                            transform: 'translateY(0) scale(1)',
                            opacity: 1,
                          },
                          '100%': {
                            transform: `translateY(-60px) translateX(${(Math.random() - 0.5) * 40}px) scale(0)`,
                            opacity: 0,
                          },
                        },
                      }}
                    />
                  ))}
                </Box>
              )}
            </Stack>
          </Monolith>
        </Grid>
      </Grid>
    </CanvasBase>
  );
};

export default ContentForge;