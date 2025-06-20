// Canvas Module - Strategic AI Intelligence System
// Where doctor-product combinations become strategic insights

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Autocomplete,
  Grid,
  Fade,
  LinearProgress,
} from '@mui/material';
import {
  AutoAwesome as AIIcon,
  Search as SearchIcon,
  Lightbulb as InsightIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { Monolith, Gallery } from '../components/gallery';
import glassEffects from '../themes/glassEffects';
import animations from '../themes/animations';

// Mock data for demo
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

const Canvas: React.FC = () => {
  const theme = useTheme();
  const [doctor, setDoctor] = useState<string | null>(null);
  const [product, setProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);

  const handleAnalyze = () => {
    if (!doctor || !product) return;
    
    setLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      setInsights([
        'High conversion probability (87%) based on practice specialization match',
        'Recommend leading with ROI calculator - average payback period 4.2 months',
        'Key objection likely: integration with existing workflow',
        'Competitive advantage: 40% faster treatment time vs alternatives',
        'Upsell opportunity: complementary skincare line ($45K annual revenue potential)',
      ]);
      setLoading(false);
    }, 2000);
  };

  return (
    <Gallery.Container maxWidth="lg">
      <Fade in timeout={animations.durations.deliberate}>
        <Box>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.primary.main,
                letterSpacing: '0.3em',
                display: 'block',
                mb: 2,
              }}
            >
              STRATEGIC AI INTELLIGENCE
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 200,
                letterSpacing: '0.15em',
                mb: 3,
              }}
            >
              CANVAS
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 600,
                mx: 'auto',
                letterSpacing: '0.05em',
              }}
            >
              Transform doctor-product combinations into strategic masterpieces. 
              Our AI sculpts insights from raw data with surgical precision.
            </Typography>
          </Box>

          {/* Input Section */}
          <Monolith
            variant="museum"
            elevation="floating"
            hover="glow"
            overline="CONFIGURATION"
            title="Strategic Parameters"
          >
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  value={doctor}
                  onChange={(_, newValue) => setDoctor(newValue)}
                  options={mockDoctors}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="SELECT DOCTOR"
                      variant="outlined"
                      sx={{
                        '& .MuiInputLabel-root': {
                          letterSpacing: '0.1em',
                        },
                      }}
                    />
                  )}
                  sx={{
                    '& .MuiAutocomplete-popupIndicator': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  value={product}
                  onChange={(_, newValue) => setProduct(newValue)}
                  options={mockProducts}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="SELECT PRODUCT"
                      variant="outlined"
                      sx={{
                        '& .MuiInputLabel-root': {
                          letterSpacing: '0.1em',
                        },
                      }}
                    />
                  )}
                  sx={{
                    '& .MuiAutocomplete-popupIndicator': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleAnalyze}
                disabled={!doctor || !product || loading}
                startIcon={<AIIcon />}
                sx={{
                  px: 6,
                  py: 1.5,
                  letterSpacing: '0.15em',
                }}
              >
                GENERATE INSIGHTS
              </Button>
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
                AI PROCESSING STRATEGIC ANALYSIS...
              </Typography>
            </Box>
          )}

          {/* Insights Display */}
          {insights.length > 0 && (
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
                  STRATEGIC INSIGHTS
                </Typography>
                <Gallery.Grid columns={{ xs: 1, md: 2 }} spacing={3}>
                  {insights.map((insight, index) => (
                    <Monolith
                      key={index}
                      variant={index === 0 ? 'goldInfused' : 'carbon'}
                      hover="subtle"
                      animationDelay={index * 100}
                    >
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <InsightIcon
                          sx={{
                            color: theme.palette.primary.main,
                            mt: 0.5,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            letterSpacing: '0.03em',
                            lineHeight: 1.8,
                          }}
                        >
                          {insight}
                        </Typography>
                      </Stack>
                    </Monolith>
                  ))}
                </Gallery.Grid>
              </Box>
            </Fade>
          )}

          {/* Empty State */}
          {!loading && insights.length === 0 && (
            <Box
              sx={{
                mt: 8,
                textAlign: 'center',
                py: 8,
                ...glassEffects.effects.museum,
                borderRadius: 0,
              }}
            >
              <SearchIcon
                sx={{
                  fontSize: 64,
                  color: alpha(theme.palette.primary.main, 0.2),
                  mb: 2,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  letterSpacing: '0.1em',
                  fontWeight: 300,
                }}
              >
                SELECT PARAMETERS TO BEGIN ANALYSIS
              </Typography>
            </Box>
          )}
        </Box>
      </Fade>
    </Gallery.Container>
  );
};

export default Canvas;