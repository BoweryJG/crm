import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  useTheme,
  alpha
} from '@mui/material';
import {
  AutoAwesome as MagicIcon,
  Dashboard as DashboardIcon,
  Security as ControlIcon,
  Build as AdvancedIcon
} from '@mui/icons-material';
import { useThemeContext } from '../themes/ThemeContext';
import MagicButtonGallery from '../components/automation/MagicButtonGallery';
import MasterControlPanel from '../components/automation/MasterControlPanel';
import AutomationHub from '../components/automation/AutomationHub';

const Automations: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      label: 'Magic Buttons',
      icon: <MagicIcon />,
      description: 'One-click automations that just work',
      component: <MagicButtonGallery />
    },
    {
      label: 'Control Panel', 
      icon: <ControlIcon />,
      description: 'Master controls and usage limits',
      component: <MasterControlPanel />
    },
    {
      label: 'Dashboard',
      icon: <DashboardIcon />,
      description: 'Manage your active automations',
      component: <AutomationHub />
    },
    {
      label: 'Advanced',
      icon: <AdvancedIcon />,
      description: 'Custom workflows and power features',
      component: (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>🚧 Advanced Builder Coming Soon</Typography>
          <Typography variant="body1" color="text.secondary">
            Visual drag-and-drop workflow builder and AI automation assistant
          </Typography>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
          🤖 Automations
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Your business runs itself. Start simple, get powerful.
        </Typography>

        {/* Progressive Disclosure Tabs */}
        <Card 
          sx={{ 
            maxWidth: 800, 
            mx: 'auto',
            background: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                minHeight: 80,
                textTransform: 'none',
                flexDirection: 'column',
                gap: 0.5
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.icon}
                label={
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {tab.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {tab.description}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Card>
      </Box>

      {/* Active Tab Content */}
      <Box sx={{ mt: 4 }}>
        {tabs[activeTab].component}
      </Box>

      {/* Helpful Tips */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          💡 <strong>Tip:</strong> Start with Magic Buttons if you're new to automation. 
          They work instantly and save hours every week!
        </Typography>
      </Box>
    </Box>
  );
};

export default Automations;