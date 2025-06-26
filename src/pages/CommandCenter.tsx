import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Stack,
  Fade,
  Paper,
  Grid,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Dashboard as MissionControlIcon,
  Business as OperationsIcon,
  AutoMode as AutomationIcon,
  Create as ContentForgeIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { useThemeContext } from '../themes/ThemeContext';
// Remove MissionControlHub - no longer needed
import OperationsCenter from '../components/dashboard/OperationsCenter';
import AutomationHub from '../components/automation/AutomationHub';
import ContentForgeHub from '../components/content/ContentForgeHub';
import glassEffects from '../themes/glassEffects';
import animations from '../themes/animations';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`command-center-tabpanel-${index}`}
      aria-labelledby={`command-center-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={value === index} timeout={300}>
          <Box>{children}</Box>
        </Fade>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `command-center-tab-${index}`,
    'aria-controls': `command-center-tabpanel-${index}`,
  };
}

const CommandCenter: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { themeMode } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const tabItems = [
    { label: 'Operations', icon: OperationsIcon, description: 'Live activity & quick actions' },
    { label: 'Automations', icon: AutomationIcon, description: 'Workflow management' },
    { label: 'Content Forge', icon: ContentForgeIcon, description: 'AI-powered content creation' },
  ];

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
          COMMAND CENTER
        </Typography>
        <IconButton onClick={() => setDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: alpha(theme.palette.primary.main, 0.1) }} />
      <List sx={{ flex: 1, p: 2 }}>
        {tabItems.map((item, index) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={activeTab === index}
              onClick={() => {
                setActiveTab(index);
                setDrawerOpen(false);
              }}
              sx={{
                borderRadius: '12px',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                mb: 1.5,
                mx: 1,
                backdropFilter: 'blur(10px)',
                background: alpha(theme.palette.background.paper, 0.05),
                ...animations.utils.createTransition(),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  transform: 'translateX(4px)',
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                },
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                <item.icon />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                secondary={item.description}
                primaryTypographyProps={{
                  sx: { letterSpacing: '0.05em', fontWeight: 600 },
                }}
                secondaryTypographyProps={{
                  sx: { opacity: 0.7, fontSize: '0.75rem' },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          ...glassEffects.effects.obsidian,
          backgroundColor: alpha(theme.palette.background.default, 0.9),
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          borderRadius: '0 0 20px 20px',
        }}
      >
        <Toolbar
          sx={{
            borderRadius: '0 0 20px 20px',
            px: 3,
          }}
        >
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
            COMMAND CENTER
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        {/* Mobile Navigation */}
        {isMobile && (
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<MenuIcon />}
              onClick={() => setDrawerOpen(true)}
              sx={{
                width: '100%',
                justifyContent: 'flex-start',
                borderRadius: '12px',
                borderColor: alpha(theme.palette.primary.main, 0.2),
                color: theme.palette.text.primary,
                backdropFilter: 'blur(10px)',
                ...animations.utils.createTransition(),
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              }}
            >
              {tabItems[activeTab].label}
            </Button>
          </Box>
        )}

        {/* Desktop Tabs */}
        {!isMobile && (
          <Paper
            elevation={0}
            sx={{
              mb: 4,
              ...glassEffects.effects.obsidian,
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              borderRadius: '18px',
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isTablet ? 'scrollable' : 'fullWidth'}
              scrollButtons={isTablet ? 'auto' : false}
              sx={{
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                '& .MuiTab-root': {
                  minHeight: 80,
                  textTransform: 'none',
                  fontWeight: 400,
                  fontSize: '0.95rem',
                  color: theme.palette.text.secondary,
                  borderRadius: '12px',
                  margin: '8px',
                  transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                  },
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                },
                '& .MuiTabs-indicator': {
                  display: 'none', // Remove the default indicator
                },
              }}
            >
              {tabItems.map((item, index) => (
                <Tab
                  key={item.label}
                  label={
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <item.icon fontSize="small" />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.label}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
                          {item.description}
                        </Typography>
                      </Box>
                    </Stack>
                  }
                  {...a11yProps(index)}
                />
              ))}
            </Tabs>
          </Paper>
        )}

        <TabPanel value={activeTab} index={0}>
          <Fade in timeout={300}>
            <Box>
              <Paper
                elevation={0}
                sx={{
                  mb: 4,
                  p: 3,
                  ...glassEffects.effects.frostedSteel,
                  backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  borderRadius: '16px',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    color: theme.palette.primary.main,
                    letterSpacing: '0.3em',
                    display: 'block',
                    mb: 1,
                  }}
                >
                  TACTICAL EXECUTION
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 200, letterSpacing: '0.05em', mb: 2 }}>
                  Operations Center
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                  Quick actions, communications, and live activity tracking
                </Typography>
              </Paper>
              <OperationsCenter />
            </Box>
          </Fade>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Fade in timeout={300}>
            <Box>
              <Paper
                elevation={0}
                sx={{
                  mb: 4,
                  p: 3,
                  ...glassEffects.effects.goldInfused,
                  backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  borderRadius: '16px',
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    color: theme.palette.secondary.main,
                    letterSpacing: '0.3em',
                    display: 'block',
                    mb: 1,
                  }}
                >
                  WORKFLOW AUTOMATION
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 200, letterSpacing: '0.05em', mb: 2 }}>
                  Automation Hub
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                  Create, manage, and monitor automated workflows
                </Typography>
              </Paper>
              <AutomationHub />
            </Box>
          </Fade>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Fade in timeout={300}>
            <Box>
              <Paper
                elevation={0}
                sx={{
                  mb: 4,
                  p: 3,
                  ...glassEffects.effects.museum,
                  backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  borderRadius: '16px',
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    color: theme.palette.warning.main,
                    letterSpacing: '0.3em',
                    display: 'block',
                    mb: 1,
                  }}
                >
                  AI-POWERED CREATION
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 200, letterSpacing: '0.05em', mb: 2 }}>
                  Content Forge
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                  Generate compelling content with AI assistance
                </Typography>
              </Paper>
              <ContentForgeHub />
            </Box>
          </Fade>
        </TabPanel>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            backgroundColor: theme.palette.background.default,
            borderTopRightRadius: '20px',
            borderBottomRightRadius: '20px',
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default CommandCenter;