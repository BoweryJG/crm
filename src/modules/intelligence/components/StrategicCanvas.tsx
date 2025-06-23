// Strategic Canvas - Chess-inspired strategy builder
// Where doctor-product combinations become strategic masterplays

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Stack,
  Autocomplete,
  Grid,
  Fade,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Psychology as StrategyIcon,
  TrendingUp as ValueIcon,
  Shield as DefenseIcon,
  EmojiEvents as TrophyIcon,
  Lightbulb as InsightIcon,
  Save as SaveIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { Monolith, Gallery } from '../../../components/gallery';
import glassEffects from '../../../themes/glassEffects';
import animations from '../../../themes/animations';
import { CanvasBase, AIGenerateButton, ResultCard } from './CanvasBase';
import { useAuth } from '../../../auth';
import { useNavigate } from 'react-router-dom';

// Mock data - same as original Canvas
const mockDoctors = [
  'Dr. Sarah Mitchell - Plastic Surgery',
  'Dr. James Chen - Dermatology',
  'Dr. Emily Rodriguez - Medical Spa',
  'Dr. Michael Thompson - Oral Surgery',
  'Dr. Lisa Anderson - Aesthetic Medicine',
];

const mockProducts = [
  'BTL Exilis Ultra - Body Contouring',
  'CoolSculpting Elite - Fat Reduction',
  'Morpheus8 - RF Microneedling',
  'HydraFacial MD - Skin Treatment',
  'Ultherapy - Skin Tightening',
];

interface StrategyMove {
  type: 'opening' | 'midgame' | 'endgame';
  title: string;
  description: string;
  value: number;
  icon: React.ReactNode;
}

const StrategicCanvas: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<string | null>(null);
  const [product, setProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [strategies, setStrategies] = useState<StrategyMove[]>([]);

  const handleAnalyze = () => {
    if (!doctor || !product) return;
    
    setLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      setStrategies([
        {
          type: 'opening',
          title: 'OPENING GAMBIT',
          description: 'Lead with ROI calculator demonstration. Average payback period: 4.2 months',
          value: 87,
          icon: <TrophyIcon />,
        },
        {
          type: 'midgame',
          title: 'TACTICAL ADVANTAGE',
          description: '40% faster treatment time positions you ahead of three local competitors',
          value: 75,
          icon: <ValueIcon />,
        },
        {
          type: 'midgame',
          title: 'DEFENSIVE POSITION',
          description: 'Address workflow integration concerns with turnkey implementation plan',
          value: 65,
          icon: <DefenseIcon />,
        },
        {
          type: 'endgame',
          title: 'WINNING MOVE',
          description: 'Bundle with complementary skincare line for $45K annual revenue boost',
          value: 92,
          icon: <InsightIcon />,
        },
      ]);
      setLoading(false);
    }, 2000);
  };

  const getValueColor = (value: number) => {
    if (value >= 80) return theme.palette.primary.main; // Gold
    if (value >= 60) return theme.palette.grey[400]; // Silver
    return theme.palette.warning.main; // Bronze
  };

  return (
    <CanvasBase
      overline="STRATEGIC INTELLIGENCE"
      title="STRATEGIC CANVAS"
      subtitle="Transform doctor-product combinations into winning strategies. Your chess board for medical sales mastery."
      emptyStateIcon={<StrategyIcon />}
      emptyStateMessage="SELECT YOUR PIECES TO BEGIN THE GAME"
      onSignInClick={() => navigate('/login')}
    >
      {/* Chess Board Input Section */}
      <Monolith
        variant="obsidian"
        elevation="floating"
        hover="none"
        overline="GAME BOARD"
        title="Position Your Pieces"
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                p: 3,
                background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)} 25%, transparent 25%, transparent 75%, ${alpha(theme.palette.primary.main, 0.05)} 75%, ${alpha(theme.palette.primary.main, 0.05)}) 0 0 / 40px 40px`,
                borderRadius: 1,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <Typography
                variant="overline"
                sx={{ color: theme.palette.primary.main, letterSpacing: '0.2em' }}
              >
                WHITE PIECE
              </Typography>
              <Autocomplete
                value={doctor}
                onChange={(_, newValue) => setDoctor(newValue)}
                options={mockDoctors}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="DOCTOR POSITION"
                    variant="outlined"
                    sx={{
                      mt: 1,
                      '& .MuiInputLabel-root': {
                        letterSpacing: '0.1em',
                      },
                    }}
                  />
                )}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                fontWeight: 100,
                color: theme.palette.text.secondary,
              }}
            >
              VS
            </Typography>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box
              sx={{
                p: 3,
                background: `linear-gradient(45deg, transparent 25%, ${alpha(theme.palette.primary.main, 0.05)} 25%, ${alpha(theme.palette.primary.main, 0.05)} 75%, transparent 75%, transparent) 0 0 / 40px 40px`,
                borderRadius: 1,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <Typography
                variant="overline"
                sx={{ color: theme.palette.primary.main, letterSpacing: '0.2em' }}
              >
                BLACK PIECE
              </Typography>
              <Autocomplete
                value={product}
                onChange={(_, newValue) => setProduct(newValue)}
                options={mockProducts}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="PRODUCT POSITION"
                    variant="outlined"
                    sx={{
                      mt: 1,
                      '& .MuiInputLabel-root': {
                        letterSpacing: '0.1em',
                      },
                    }}
                  />
                )}
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <AIGenerateButton
            onClick={handleAnalyze}
            disabled={!doctor || !product}
            loading={loading}
            label="CALCULATE STRATEGY"
          />
        </Box>
      </Monolith>

      {/* Loading State */}
      {loading && (
        <Box sx={{ my: 4 }}>
          <LinearProgress
            sx={{
              height: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 2,
              color: theme.palette.text.secondary,
              letterSpacing: '0.1em',
            }}
          >
            ANALYZING STRATEGIC POSITIONS...
          </Typography>
        </Box>
      )}

      {/* Strategy Results */}
      {strategies.length > 0 && (
        <Fade in timeout={animations.durations.normal}>
          <Box sx={{ mt: 6 }}>
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.primary.main,
                letterSpacing: '0.2em',
                display: 'block',
                mb: 3,
                textAlign: 'center',
              }}
            >
              STRATEGIC PLAYBOOK
            </Typography>

            <Grid container spacing={3}>
              {strategies.map((strategy, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <ResultCard
                    variant={strategy.value >= 80 ? 'primary' : strategy.value >= 60 ? 'secondary' : 'accent'}
                    animationDelay={index * 100}
                  >
                    <Stack spacing={2}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              color: getValueColor(strategy.value),
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            {strategy.icon}
                          </Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                            }}
                          >
                            {strategy.title}
                          </Typography>
                        </Stack>
                        <Chip
                          label={`${strategy.value}% WIN RATE`}
                          size="small"
                          sx={{
                            backgroundColor: alpha(getValueColor(strategy.value), 0.1),
                            color: getValueColor(strategy.value),
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                          }}
                        />
                      </Stack>

                      <Typography
                        variant="body2"
                        sx={{
                          letterSpacing: '0.03em',
                          lineHeight: 1.8,
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {strategy.description}
                      </Typography>

                      {user && (
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Tooltip title="Save to Playbook">
                            <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
                              <SaveIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Share Strategy">
                            <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
                              <ShareIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      )}
                    </Stack>
                  </ResultCard>
                </Grid>
              ))}
            </Grid>

            {/* Overall Strategy Score */}
            <Box
              sx={{
                mt: 4,
                p: 3,
                textAlign: 'center',
                ...glassEffects.effects.goldInfused,
                borderRadius: 0,
              }}
            >
              <Typography variant="overline" sx={{ letterSpacing: '0.2em' }}>
                MATCH QUALITY
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 100,
                  letterSpacing: '0.1em',
                  color: theme.palette.primary.main,
                }}
              >
                {Math.round(strategies.reduce((acc, s) => acc + s.value, 0) / strategies.length)}%
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                GRANDMASTER LEVEL STRATEGY
              </Typography>
            </Box>
          </Box>
        </Fade>
      )}
    </CanvasBase>
  );
};

export default StrategicCanvas;