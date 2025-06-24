import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Stack,
  Fade,
  Paper,
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
import MissionControlHub from '../components/dashboard/MissionControlHub';
import OperationsCenter from '../components/dashboard/OperationsCenter';
import AutomationButton from '../components/research/AutomationButton';
import ContentForge from '../modules/intelligence/components/ContentForge';
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
        <Box sx={{ py: 3 }}>
          <Fade in timeout={animations.durations.normal}>
            <Box>{children}</Box>
          </Fade>
        </Box>
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
  const { signOut } = useAuth();
  const { themeMode } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const tabItems = [
    { label: 'Mission Control', icon: MissionControlIcon, description: 'Strategic overview and monitoring' },
    { label: 'Operations', icon: OperationsIcon, description: 'Day-to-day execution' },
    { label: 'Automation', icon: AutomationIcon, description: 'Automated workflows' },
    { label: 'Content Forge', icon: ContentForgeIcon, description: 'Content creation' },
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
                borderRadius: 0,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                ...animations.utils.createTransition(),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                },
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  borderColor: theme.palette.primary.main,
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
            COMMAND CENTER
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

      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3, maxWidth: 1600, mx: 'auto' }}>
        {!isMobile && (
          <Paper
            elevation={0}
            sx={{
              ...glassEffects.effects.obsidian,
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: 0,
              mb: 3,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  py: 2.5,
                  letterSpacing: '0.1em',
                  fontWeight: 500,
                  minHeight: 'auto',
                  ...animations.utils.createTransition(),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  backgroundColor: theme.palette.primary.main,
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
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.primary.main,
                letterSpacing: '0.3em',
                display: 'block',
                mb: 1,
              }}
            >
              STRATEGIC OVERVIEW
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 200, letterSpacing: '0.05em', mb: 2 }}>
              Mission Control
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
              Monitor high-priority alerts, AI insights, and strategic metrics
            </Typography>
          </Box>
          <MissionControlHub />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box sx={{ mb: 4 }}>
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
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
              Quick actions, communications, and live activity tracking
            </Typography>
          </Box>
          <OperationsCenter />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.primary.main,
                letterSpacing: '0.3em',
                display: 'block',
                mb: 1,
              }}
            >
              PROCESS AUTOMATION
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 200, letterSpacing: '0.05em', mb: 2 }}>
              Automation Hub
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
              Manage automated workflows and scheduled activities
            </Typography>
          </Box>
          <Paper
            elevation={0}
            sx={{
              ...glassEffects.effects.obsidian,
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: 0,
              p: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, letterSpacing: '0.05em' }}>
              Automation Workflows
            </Typography>
            <AutomationButton
              documentId="demo"
              isEditing={false}
              onWorkflowComplete={(workflowId) => {
                console.log('Workflow completed:', workflowId);
              }}
            />
            <Typography variant="body2" sx={{ mt: 4, color: theme.palette.text.secondary }}>
              Configure and manage automated research, content generation, and outreach workflows
            </Typography>
          </Paper>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.primary.main,
                letterSpacing: '0.3em',
                display: 'block',
                mb: 1,
              }}
            >
              CONTENT CREATION
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 200, letterSpacing: '0.05em', mb: 2 }}>
              Content Forge
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
              AI-powered content generation for all communication needs
            </Typography>
          </Box>
          <ContentForge />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default CommandCenter;