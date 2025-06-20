import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  useTheme,
  Fade,
  Container
} from '@mui/material';
import { 
  Person as PersonIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import Contacts from './Contacts';
import Practices from './Practices';
import { useThemeContext } from '../themes/ThemeContext';

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
      id={`relationships-tabpanel-${index}`}
      aria-labelledby={`relationships-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={true} timeout={500}>
          <Box>{children}</Box>
        </Fade>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `relationships-tab-${index}`,
    'aria-controls': `relationships-tabpanel-${index}`,
  };
}

const Relationships: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: themeMode === 'space'
              ? 'linear-gradient(45deg, #8860D0 0%, #5CE1E6 100%)'
              : 'linear-gradient(45deg, #3D52D5 0%, #44CFCB 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Smart CRM
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all your contacts and practices in one unified view
        </Typography>
      </Box>

      <Paper
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: theme.palette.background.paper,
          boxShadow: themeMode === 'space'
            ? '0 4px 20px rgba(138, 96, 208, 0.1)'
            : theme.shadows[1]
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="relationships tabs"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                minHeight: 64,
                '&.Mui-selected': {
                  color: themeMode === 'space' ? '#8860D0' : '#3D52D5'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: themeMode === 'space' ? '#8860D0' : '#3D52D5',
                height: 3
              }
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon />
                  <span>Contacts</span>
                </Box>
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon />
                  <span>Practices</span>
                </Box>
              }
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <Contacts />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Practices />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Relationships;