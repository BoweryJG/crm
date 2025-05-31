import React from 'react';
import {
  IconButton,
  Tooltip,
  Box,
  Typography,
  useTheme
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Brightness4 as Brightness4Icon,
  Diamond as DiamondIcon
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';

const ThemeToggle: React.FC = () => {
  const theme = useTheme();
  const { themeMode, toggleTheme } = useThemeContext();

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'space':
        return <Brightness4Icon />;
      case 'corporate':
        return <PaletteIcon />;
      case 'luxury':
        return <DiamondIcon />;
      default:
        return <PaletteIcon />;
    }
  };

  const getThemeLabel = () => {
    switch (themeMode) {
      case 'space':
        return 'Space Theme';
      case 'corporate':
        return 'Corporate Theme';
      case 'luxury':
        return 'Luxury Aviation Theme';
      default:
        return 'Default Theme';
    }
  };

  const getThemeDescription = () => {
    switch (themeMode) {
      case 'space':
        return 'Deep space exploration aesthetic';
      case 'corporate':
        return 'Professional business interface';
      case 'luxury':
        return 'High-end aviation gauges with Cartier luxury';
      default:
        return 'Standard theme';
    }
  };

  return (
    <Tooltip 
      title={
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">
            {getThemeLabel()}
          </Typography>
          <Typography variant="caption">
            {getThemeDescription()}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 0.5, fontStyle: 'italic' }}>
            Click to cycle themes
          </Typography>
        </Box>
      }
      placement="bottom"
    >
      <IconButton
        onClick={toggleTheme}
        sx={{
          color: themeMode === 'luxury' ? '#C9B037' : theme.palette.primary.main,
          backgroundColor: themeMode === 'luxury' 
            ? 'rgba(201, 176, 55, 0.1)' 
            : 'rgba(255, 255, 255, 0.1)',
          border: themeMode === 'luxury' 
            ? '1px solid rgba(201, 176, 55, 0.3)'
            : '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            backgroundColor: themeMode === 'luxury' 
              ? 'rgba(201, 176, 55, 0.2)' 
              : 'rgba(255, 255, 255, 0.2)',
            borderColor: themeMode === 'luxury' 
              ? 'rgba(201, 176, 55, 0.5)'
              : 'rgba(255, 255, 255, 0.3)',
            boxShadow: themeMode === 'luxury' 
              ? '0 0 15px rgba(201, 176, 55, 0.3)'
              : '0 0 10px rgba(255, 255, 255, 0.2)',
            transform: 'scale(1.05)'
          },
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          ...(themeMode === 'luxury' && {
            animation: 'luxuryPulse 3s ease-in-out infinite'
          })
        }}
      >
        {getThemeIcon()}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;