// Strategic Canvas Mobile - Chess-inspired strategy builder optimized for mobile
// Compact, swipeable, touch-first interface

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Fade,
  Container,
  useMediaQuery,
  useTheme,
  alpha,
  Fab,
  Button,
} from '@mui/material';
import {
  Psychology as StrategyIcon,
  TrendingUp as ValueIcon,
  Shield as DefenseIcon,
  EmojiEvents as TrophyIcon,
  PlayArrow as AnalyzeIcon,
  Save as SaveIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { CanvasBase, AIGenerateButton } from './CanvasBase';
import {
  QuickSelect,
  ResultTile,
  FloatingControls,
  SwipeableInputDrawer,
  MicroTabs,
} from './MicroComponents';
import { useAuth } from '../../../auth';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../../themes/ThemeContext';
import glassEffects from '../../../themes/glassEffects';

// Mock data
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

const StrategicCanvasMobile: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { themeMode } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [doctor, setDoctor] = useState<string | null>(null);
  const [product, setProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [strategies, setStrategies] = useState<StrategyMove[]>([]);
  const [inputDrawerOpen, setInputDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleAnalyze = () => {
    if (!doctor || !product) return;
    
    setLoading(true);
    setInputDrawerOpen(false);
    
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
          icon: <StrategyIcon />,
        },
      ]);
      setLoading(false);
    }, 2000);
  };

  const getThemeGlass = () => {
    switch (themeMode) {
      case 'cyber-neon':
        return {
          ...glassEffects.effects.obsidian,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
        };
      case 'chanel-noir':
        return glassEffects.effects.carbon;
      default:
        return glassEffects.effects.frostedSteel;
    }
  };

  const floatingActions = [
    {
      icon: <SaveIcon />,
      label: 'Save',
      onClick: () => console.log('Save strategy'),
      color: 'default' as const,
    },
    {
      icon: <ShareIcon />,
      label: 'Share',
      onClick: () => console.log('Share strategy'),
      color: 'default' as const,
    },
  ];

  const strategyTabs = [
    { label: 'Opening', icon: <TrophyIcon /> },
    { label: 'Midgame', icon: <ValueIcon /> },
    { label: 'Endgame', icon: <DefenseIcon /> },
  ];

  const filteredStrategies = strategies.filter(s => {
    if (activeTab === 0) return s.type === 'opening';
    if (activeTab === 1) return s.type === 'midgame';
    if (activeTab === 2) return s.type === 'endgame';
    return true;
  });

  return (
    <CanvasBase
      overline="CHESS MASTER AI"
      title="STRATEGIC CANVAS"
      subtitle={isMobile ? "Tap to configure" : "Chess-inspired sales strategies powered by AI"}
      emptyStateIcon={<StrategyIcon />}
      emptyStateMessage={isMobile ? "TAP + TO START" : "SELECT DOCTOR & PRODUCT TO GENERATE STRATEGY"}
      onSignInClick={() => navigate('/login')}
      isGenerating={loading}
      loadingMessage="CALCULATING OPTIMAL MOVES..."
    >
      <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
        {/* Mobile: Compact Selection Summary */}
        {isMobile && (doctor || product) && (
          <Box
            onClick={() => setInputDrawerOpen(true)}
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 2,
              cursor: 'pointer',
              ...getThemeGlass(),
              backgroundColor: alpha(theme.palette.background.paper, 0.3),
            }}
          >
            <Typography variant="caption" sx={{ letterSpacing: '0.1em', opacity: 0.7 }}>
              CURRENT MATCH
            </Typography>
            <Stack spacing={0.5}>
              {doctor && (
                <Typography variant="body2" noWrap>
                  👨‍⚕️ {doctor.split(' - ')[0]}
                </Typography>
              )}
              {product && (
                <Typography variant="body2" noWrap>
                  🔬 {product.split(' - ')[0]}
                </Typography>
              )}
            </Stack>
          </Box>
        )}

        {/* Desktop/Tablet: Inline Inputs */}
        {!isMobile && (
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ mb: 4 }}
          >
            <QuickSelect
              options={mockDoctors}
              value={doctor}
              onChange={setDoctor}
              label="Select Doctor"
              getOptionLabel={(option) => option}
              placeholder="Search doctors..."
              sx={{ flex: 1 }}
            />
            <QuickSelect
              options={mockProducts}
              value={product}
              onChange={setProduct}
              label="Select Product"
              getOptionLabel={(option) => option}
              placeholder="Search products..."
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              onClick={handleAnalyze}
              disabled={!doctor || !product || loading}
              startIcon={<AnalyzeIcon />}
              sx={{ 
                height: 36, 
                alignSelf: 'flex-end',
                px: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                },
              }}
            >
              ANALYZE
            </Button>
          </Stack>
        )}

        {/* Strategy Results */}
        {strategies.length > 0 && (
          <Fade in timeout={600}>
            <Box>
              {/* Tab Filter for Mobile */}
              {isMobile && (
                <MicroTabs
                  value={activeTab}
                  onChange={setActiveTab}
                  tabs={strategyTabs}
                />
              )}

              {/* Results Grid */}
              <Stack spacing={1}>
                {filteredStrategies.map((strategy, index) => (
                  <Fade
                    key={index}
                    in
                    timeout={300 + index * 100}
                  >
                    <div>
                      <ResultTile
                        title={strategy.title}
                        subtitle={`${strategy.type.toUpperCase()} STRATEGY`}
                        content={
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {strategy.description}
                          </Typography>
                        }
                        icon={strategy.icon}
                        value={strategy.value}
                        color={
                          strategy.type === 'opening' ? theme.palette.success.main :
                          strategy.type === 'midgame' ? theme.palette.info.main :
                          theme.palette.warning.main
                        }
                        defaultExpanded={!isMobile && index === 0}
                      />
                    </div>
                  </Fade>
                ))}
              </Stack>
            </Box>
          </Fade>
        )}

        {/* Mobile: Floating Action Button */}
        {isMobile && !inputDrawerOpen && (
          <Fab
            color="primary"
            onClick={() => setInputDrawerOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            <AnalyzeIcon />
          </Fab>
        )}

        {/* Mobile: Floating Controls for Save/Share */}
        {isMobile && strategies.length > 0 && (
          <FloatingControls
            actions={floatingActions}
            position="bottom-left"
          />
        )}

        {/* Mobile: Input Drawer */}
        {isMobile && (
          <SwipeableInputDrawer
            open={inputDrawerOpen}
            onOpen={() => setInputDrawerOpen(true)}
            onClose={() => setInputDrawerOpen(false)}
            title="MATCH CONFIGURATION"
            height="60vh"
          >
            <Stack spacing={3}>
              <QuickSelect
                options={mockDoctors}
                value={doctor}
                onChange={setDoctor}
                label="Select Doctor"
                getOptionLabel={(option) => option}
                placeholder="Search doctors..."
              />
              <QuickSelect
                options={mockProducts}
                value={product}
                onChange={setProduct}
                label="Select Product"
                getOptionLabel={(option) => option}
                placeholder="Search products..."
              />
              <AIGenerateButton
                onClick={handleAnalyze}
                disabled={!doctor || !product}
                loading={loading}
                label="GENERATE STRATEGY"
                fullWidth
              />
            </Stack>
          </SwipeableInputDrawer>
        )}
      </Container>
    </CanvasBase>
  );
};

export default StrategicCanvasMobile;