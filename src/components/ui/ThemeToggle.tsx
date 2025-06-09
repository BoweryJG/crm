import React, { useState } from 'react';
import {
  IconButton,
  Tooltip,
  Box,
  Typography,
  useTheme,
  Button,
  ButtonGroup
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Brightness4 as Brightness4Icon,
  Diamond as DiamondIcon,
  KeyboardArrowDown as ExpandIcon
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';
import ThemePicker from './ThemePicker';
import { getThemeById } from '../../themes/themeLibrary';

const ThemeToggle: React.FC = () => {
  const theme = useTheme();
  const { themeMode, toggleTheme, getCurrentTheme } = useThemeContext();
  const [pickerOpen, setPickerOpen] = useState(false);

  const currentThemeData = getCurrentTheme();

  const getThemeIcon = () => {
    if (currentThemeData) {
      // Use category-based icons for new themes
      switch (currentThemeData.category) {
        case 'aviation': return <Brightness4Icon />;
        case 'luxury': return <DiamondIcon />;
        case 'beauty': return <DiamondIcon />;
        default: return <PaletteIcon />;
      }
    }
    
    // Legacy theme support
    switch (themeMode) {
      case 'space': return <Brightness4Icon />;
      case 'corporate': return <PaletteIcon />;
      case 'luxury': return <DiamondIcon />;
      default: return <PaletteIcon />;
    }
  };

  const getThemeLabel = () => {
    if (currentThemeData) {
      return currentThemeData.name;
    }
    
    // Legacy theme support
    switch (themeMode) {
      case 'space': return 'Space Theme';
      case 'corporate': return 'Corporate Theme';
      case 'luxury': return 'Luxury Aviation Theme';
      default: return 'Default Theme';
    }
  };

  const getThemeDescription = () => {
    if (currentThemeData) {
      return currentThemeData.description;
    }
    
    // Legacy theme support
    switch (themeMode) {
      case 'space': return 'Deep space exploration aesthetic';
      case 'corporate': return 'Professional business interface';
      case 'luxury': return 'High-end aviation gauges with Cartier luxury';
      default: return 'Standard theme';
    }
  };

  // Check if current theme uses luxury styling
  const isLuxuryStyle = currentThemeData?.category === 'luxury' || currentThemeData?.category === 'beauty' || themeMode === 'luxury';

  return (
    <>
      <ButtonGroup variant="outlined" size="small">
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
                Click to cycle favorites
              </Typography>
            </Box>
          }
          placement="bottom"
        >
          <IconButton
            onClick={toggleTheme}
            sx={{
              color: isLuxuryStyle ? '#C9B037' : theme.palette.primary.main,
              backgroundColor: isLuxuryStyle 
                ? 'rgba(201, 176, 55, 0.1)' 
                : 'rgba(255, 255, 255, 0.1)',
              border: isLuxuryStyle 
                ? '1px solid rgba(201, 176, 55, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: isLuxuryStyle 
                  ? 'rgba(201, 176, 55, 0.2)' 
                  : 'rgba(255, 255, 255, 0.2)',
                borderColor: isLuxuryStyle 
                  ? 'rgba(201, 176, 55, 0.5)'
                  : 'rgba(255, 255, 255, 0.3)',
                boxShadow: isLuxuryStyle 
                  ? '0 0 15px rgba(201, 176, 55, 0.3)'
                  : '0 0 10px rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
              ...(isLuxuryStyle && {
                animation: 'luxuryPulse 3s ease-in-out infinite'
              })
            }}
          >
            {getThemeIcon()}
          </IconButton>
        </Tooltip>

        <Tooltip title="Browse all themes" placement="bottom">
          <IconButton
            onClick={() => setPickerOpen(true)}
            size="small"
            sx={{
              color: isLuxuryStyle ? '#C9B037' : theme.palette.primary.main,
              backgroundColor: isLuxuryStyle 
                ? 'rgba(201, 176, 55, 0.1)' 
                : 'rgba(255, 255, 255, 0.1)',
              border: isLuxuryStyle 
                ? '1px solid rgba(201, 176, 55, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              borderLeft: 'none',
              '&:hover': {
                backgroundColor: isLuxuryStyle 
                  ? 'rgba(201, 176, 55, 0.2)' 
                  : 'rgba(255, 255, 255, 0.2)',
                borderColor: isLuxuryStyle 
                  ? 'rgba(201, 176, 55, 0.5)'
                  : 'rgba(255, 255, 255, 0.3)',
              },
              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            }}
          >
            <ExpandIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </ButtonGroup>

      <ThemePicker 
        open={pickerOpen} 
        onClose={() => setPickerOpen(false)} 
      />
    </>
  );
};

export default ThemeToggle;