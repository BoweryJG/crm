// Command Room - Mission Control for Elite Reps
// The gallery where data becomes art and insights become power

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  Fade,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  AutoAwesome as CanvasIcon,
  Speed as QuotaIcon,
  Psychology as LinguistIcon,
  Folder as VaultIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { useThemeContext } from '../themes/ThemeContext';
import {
  Monolith,
  MonolithStat,
  Gallery,
  GalleryContainer,
  ExhibitionGrid,
  SculptureRow,
} from '../components/gallery';
import glassEffects from '../themes/glassEffects';
import animations from '../themes/animations';
import Canvas from '../modules/Canvas';
import QuotaCore from '../modules/QuotaCore';
import LinguistIQ from '../modules/LinguistIQ';
import CallVault from '../modules/CallVault';

const CommandRoom: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { setThemeMode } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);

  // Set the gallery-dominance theme when component mounts
  React.useEffect(() => {
    setThemeMode('gallery-dominance');
  }, [setThemeMode]);

  const navigationItems = [
    { id: 'canvas', label: 'Canvas', icon: CanvasIcon, description: 'Strategic AI Intelligence' },
    { id: 'quotacore', label: 'QuotaCore', icon: QuotaIcon, description: 'Performance Metrics' },
    { id: 'linguistiq', label: 'LinguistIQ', icon: LinguistIcon, description: 'Call Analytics' },
    { id: 'callvault', label: 'CallVault', icon: VaultIcon, description: 'Recording Archive' },
  ];

  const handleModuleClick = (moduleId: string) => {
    setActiveModule(moduleId);
    setDrawerOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Mobile Navigation Drawer
  const drawer = (
    <Box
      sx={{
        height: '100%',
        ...glassEffects.effects.obsidian,
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ letterSpacing: '0.1em' }}>
          COMMAND MODULES
        </Typography>
        <IconButton onClick={() => setDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: alpha(theme.palette.primary.main, 0.1) }} />
      <List sx={{ flex: 1, p: 2 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleModuleClick(item.id)}
              sx={{
                borderRadius: 0,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                ...animations.utils.createTransition(),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <item.icon sx={{ color: theme.palette.primary.main }} />
              </Box>
              <ListItemText
                primary={item.label}
                secondary={item.description}
                primaryTypographyProps={{
                  sx: { letterSpacing: '0.1em', fontWeight: 600 },
                }}
                secondaryTypographyProps={{
                  sx: { opacity: 0.7, fontSize: '0.75rem' },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: alpha(theme.palette.primary.main, 0.1) }} />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            borderRadius: 0,
            borderWidth: 2,
            py: 1.5,
            letterSpacing: '0.1em',
          }}
        >
          EXIT COMMAND ROOM
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        position: 'relative',
        overflow: 'hidden',
        // Subtle grid pattern in background
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 100px, ${alpha(theme.palette.primary.main, 0.02)} 100px, ${alpha(theme.palette.primary.main, 0.02)} 101px),
            repeating-linear-gradient(90deg, transparent, transparent 100px, ${alpha(theme.palette.primary.main, 0.02)} 100px, ${alpha(theme.palette.primary.main, 0.02)} 101px)
          `,
          pointerEvents: 'none',
        },
      }}
    >
      {/* App Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          ...glassEffects.effects.obsidian,
          backgroundColor: alpha(theme.palette.background.default, 0.9),
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flex: 1,
              letterSpacing: '0.2em',
              fontWeight: 300,
              background: `linear-gradient(90deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            REPSPHERES
          </Typography>
          {isMobile && (
            <IconButton
              edge="end"
              onClick={() => setDrawerOpen(true)}
              sx={{ color: theme.palette.primary.main }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 300,
            border: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      {activeModule === 'canvas' ? (
        <Canvas />
      ) : activeModule === 'quotacore' ? (
        <QuotaCore />
      ) : activeModule === 'linguistiq' ? (
        <LinguistIQ />
      ) : activeModule === 'callvault' ? (
        <CallVault />
      ) : (
        <GalleryContainer maxWidth="xl">
          <Fade in timeout={animations.durations.cinematic}>
            <Box>
            {/* Hero Section */}
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="overline"
                sx={{
                  color: theme.palette.primary.main,
                  letterSpacing: '0.3em',
                  display: 'block',
                  mb: 2,
                }}
              >
                MISSION CONTROL
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 100,
                  letterSpacing: '0.2em',
                  mb: 4,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                COMMAND ROOM
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  maxWidth: 600,
                  mx: 'auto',
                  mb: 6,
                  letterSpacing: '0.05em',
                  lineHeight: 2,
                }}
              >
                Where data becomes sculpture and insights become art. 
                Your personal gallery of dominance in the world of elite sales.
              </Typography>
              {!isMobile && (
                <Stack direction="row" spacing={2} justifyContent="center">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={activeModule === item.id ? 'contained' : 'outlined'}
                      onClick={() => handleModuleClick(item.id)}
                      startIcon={<item.icon />}
                      sx={{
                        borderRadius: 0,
                        px: 4,
                        py: 1.5,
                        borderWidth: 2,
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Stack>
              )}
            </Box>

            {/* Stats Overview */}
            <ExhibitionGrid columns={{ xs: 1, sm: 2, md: 4 }} spacing={3}>
              <Monolith variant="obsidian" hover="subtle" animationDelay={0}>
                <MonolithStat
                  label="PIPELINE VALUE"
                  value="2.4"
                  suffix="M"
                  trend="up"
                />
              </Monolith>
              <Monolith variant="carbon" hover="subtle" animationDelay={100}>
                <MonolithStat
                  label="VELOCITY"
                  value="147"
                  suffix="%"
                  trend="up"
                />
              </Monolith>
              <Monolith variant="goldInfused" hover="subtle" animationDelay={200}>
                <MonolithStat
                  label="CLOSE RATE"
                  value="84"
                  suffix="%"
                  trend="neutral"
                />
              </Monolith>
              <Monolith variant="frostedSteel" hover="subtle" animationDelay={300}>
                <MonolithStat
                  label="CALL QUALITY"
                  value="96"
                  suffix="/100"
                  trend="up"
                />
              </Monolith>
            </ExhibitionGrid>

            {/* Module Showcase */}
            <Gallery.Space height={80} />
            
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                mb: 6,
                fontWeight: 200,
                letterSpacing: '0.15em',
              }}
            >
              OPERATIONAL MODULES
            </Typography>

            <ExhibitionGrid columns={{ xs: 1, md: 2 }} spacing={4}>
              {/* Canvas Module */}
              <Monolith
                title="CANVAS"
                subtitle="Strategic AI Intelligence System"
                variant="museum"
                hover="dramatic"
                onClick={() => handleModuleClick('canvas')}
                animationDelay={400}
              >
                <Box sx={{ py: 2 }}>
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                    Transform doctor-product combinations into strategic masterpieces. 
                    Our AI sculpts insights from raw data.
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {['AI Analysis', 'Strategic Insights', 'Dynamic Content'].map((tag) => (
                      <Box
                        key={tag}
                        sx={{
                          px: 2,
                          py: 0.5,
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                          fontSize: '0.75rem',
                          letterSpacing: '0.1em',
                          mb: 1,
                        }}
                      >
                        {tag}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Monolith>

              {/* QuotaCore Module */}
              <Monolith
                title="QUOTACORE"
                subtitle="Kinetic Performance Metrics"
                variant="carbon"
                hover="dramatic"
                onClick={() => handleModuleClick('quotacore')}
                animationDelay={500}
              >
                <Box sx={{ py: 2 }}>
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                    Watch your metrics move like kinetic sculptures. 
                    Real-time performance visualization at its finest.
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {['Live Metrics', 'Goal Tracking', 'Velocity Analysis'].map((tag) => (
                      <Box
                        key={tag}
                        sx={{
                          px: 2,
                          py: 0.5,
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                          fontSize: '0.75rem',
                          letterSpacing: '0.1em',
                          mb: 1,
                        }}
                      >
                        {tag}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Monolith>

              {/* LinguistIQ Module */}
              <Monolith
                title="LINGUISTIQ"
                subtitle="Deconstructed Call Analysis"
                variant="goldInfused"
                hover="dramatic"
                onClick={() => handleModuleClick('linguistiq')}
                animationDelay={600}
              >
                <Box sx={{ py: 2 }}>
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                    Decompose conversations into their elemental forms. 
                    Understand tone, sentiment, and dominance patterns.
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {['Tone Analysis', 'Sentiment Tracking', 'Pattern Recognition'].map((tag) => (
                      <Box
                        key={tag}
                        sx={{
                          px: 2,
                          py: 0.5,
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                          fontSize: '0.75rem',
                          letterSpacing: '0.1em',
                          mb: 1,
                        }}
                      >
                        {tag}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Monolith>

              {/* CallVault Module */}
              <Monolith
                title="CALLVAULT"
                subtitle="Archival Recording System"
                variant="obsidian"
                hover="dramatic"
                onClick={() => handleModuleClick('callvault')}
                animationDelay={700}
              >
                <Box sx={{ py: 2 }}>
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                    Every call preserved like a monument. 
                    Auto-transcription and speaker intelligence included.
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {['Auto-Transcription', 'Speaker Labels', 'Archive Search'].map((tag) => (
                      <Box
                        key={tag}
                        sx={{
                          px: 2,
                          py: 0.5,
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                          fontSize: '0.75rem',
                          letterSpacing: '0.1em',
                          mb: 1,
                        }}
                      >
                        {tag}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Monolith>
            </ExhibitionGrid>

            {/* CTA Section */}
            <Gallery.Space height={120} pattern="dots" />
            
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => setActiveModule('canvas')}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.125rem',
                  letterSpacing: '0.2em',
                  borderRadius: 0,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    transition: 'left 0.6s ease',
                  },
                  '&:hover::before': {
                    left: '100%',
                  },
                }}
              >
                ENTER COMMAND ROOM
              </Button>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 2,
                  color: theme.palette.text.secondary,
                  letterSpacing: '0.1em',
                }}
              >
                Reserved for Elite Reps Only — Request Access
              </Typography>
            </Box>
          </Box>
        </Fade>
      </GalleryContainer>
      )}

      {/* Render Active Module */}
      {activeModule === 'canvas' && <Canvas />}
      {activeModule === 'quotacore' && <QuotaCore />}
      {activeModule === 'linguistiq' && <LinguistIQ />}
      {activeModule === 'callvault' && <CallVault />}
    </Box>
  );
};

export default CommandRoom;