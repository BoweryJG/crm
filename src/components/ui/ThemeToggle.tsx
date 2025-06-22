import React, { useState, useRef } from 'react';
import {
  IconButton,
  Tooltip,
  Box,
  Typography,
  useTheme,
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  alpha,
  Chip,
  InputBase,
  InputAdornment
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Brightness4 as Brightness4Icon,
  Diamond as DiamondIcon,
  KeyboardArrowDown as ExpandIcon,
  Search as SearchIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';
import { getThemeById, themeLibrary, themeCategories } from '../../themes/themeLibrary';
import { useThemeSound, useButtonSound } from '../../hooks/useSound';

const ThemeToggle: React.FC = () => {
  const theme = useTheme();
  const { themeMode, toggleTheme, getCurrentTheme, setThemeMode, favoriteThemes, toggleFavoriteTheme } = useThemeContext();
  const { playThemeSwitch } = useThemeSound();
  const buttonSound = useButtonSound('secondary');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const open = Boolean(anchorEl);

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
            onClick={() => {
              playThemeSwitch();
              toggleTheme();
            }}
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
            size="small"
            {...buttonSound.handlers}
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
              setTimeout(() => searchInputRef.current?.focus(), 100);
            }}
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

      {/* Compact Theme Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          setAnchorEl(null);
          setSearchQuery('');
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 320,
            maxHeight: 480,
            overflow: 'hidden',
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }
        }}
      >
        {/* Search Bar */}
        <Box sx={{ p: 2, pb: 1 }}>
          <InputBase
            ref={searchInputRef}
            placeholder="Search themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            sx={{
              px: 1.5,
              py: 0.5,
              fontSize: '0.875rem',
              backgroundColor: alpha(theme.palette.action.hover, 0.5),
              borderRadius: 1,
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              '&:focus-within': {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.action.hover
              }
            }}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              </InputAdornment>
            }
          />
        </Box>
        
        <Divider />
        
        {/* Theme List */}
        <Box sx={{ maxHeight: 400, overflow: 'auto', py: 0.5 }}>
          {/* Favorites Section */}
          {favoriteThemes.length > 0 && searchQuery === '' && (
            <>
              <MenuItem disabled sx={{ opacity: 0.7, fontSize: '0.75rem', py: 0.5 }}>
                FAVORITES
              </MenuItem>
              {themeLibrary
                .filter(t => favoriteThemes.includes(t.id))
                .map((theme) => (
                  <ThemeMenuItem
                    key={theme.id}
                    theme={theme}
                    isSelected={themeMode === theme.id}
                    isFavorite={true}
                    onSelect={() => {
                      setThemeMode(theme.id);
                      playThemeSwitch();
                      setAnchorEl(null);
                      setSearchQuery('');
                    }}
                    onToggleFavorite={() => toggleFavoriteTheme(theme.id)}
                  />
                ))}
              <Divider sx={{ my: 0.5 }} />
            </>
          )}
          
          {/* All Themes or Search Results */}
          {searchQuery === '' && (
            <MenuItem disabled sx={{ opacity: 0.7, fontSize: '0.75rem', py: 0.5 }}>
              ALL THEMES
            </MenuItem>
          )}
          {themeLibrary
            .filter(theme => 
              searchQuery === '' || 
              theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              theme.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((theme) => (
              <ThemeMenuItem
                key={theme.id}
                theme={theme}
                isSelected={themeMode === theme.id}
                isFavorite={favoriteThemes.includes(theme.id)}
                onSelect={() => {
                  setThemeMode(theme.id);
                  playThemeSwitch();
                  setAnchorEl(null);
                  setSearchQuery('');
                }}
                onToggleFavorite={() => toggleFavoriteTheme(theme.id)}
              />
            ))}
        </Box>
      </Menu>
    </>
  );
};

// Compact Theme Menu Item Component
interface ThemeMenuItemProps {
  theme: any;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

const ThemeMenuItem: React.FC<ThemeMenuItemProps> = ({
  theme,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite
}) => {
  const muiTheme = useTheme();
  
  return (
    <MenuItem
      onClick={onSelect}
      sx={{
        py: 1,
        px: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        backgroundColor: isSelected ? alpha(muiTheme.palette.primary.main, 0.08) : 'transparent',
        '&:hover': {
          backgroundColor: isSelected 
            ? alpha(muiTheme.palette.primary.main, 0.12)
            : alpha(muiTheme.palette.action.hover, 0.8)
        }
      }}
    >
      {/* Color Preview */}
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: 1,
          overflow: 'hidden',
          display: 'flex',
          flexShrink: 0,
          border: `1px solid ${alpha(muiTheme.palette.divider, 0.2)}`
        }}
      >
        <Box
          sx={{
            width: '50%',
            backgroundColor: theme.preview?.primary || theme.palette?.primary?.main || '#1976d2'
          }}
        />
        <Box
          sx={{
            width: '50%',
            backgroundColor: theme.preview?.secondary || theme.palette?.secondary?.main || '#dc004e'
          }}
        />
      </Box>
      
      {/* Theme Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: isSelected ? 600 : 400,
            color: isSelected ? muiTheme.palette.primary.main : 'text.primary',
            fontSize: '0.875rem',
            lineHeight: 1.2
          }}
        >
          {theme.name}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            fontSize: '0.75rem',
            lineHeight: 1.2,
            mt: 0.25,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {theme.description}
        </Typography>
      </Box>
      
      {/* Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {isSelected && (
          <CheckIcon 
            sx={{ 
              fontSize: 18, 
              color: muiTheme.palette.primary.main,
              flexShrink: 0
            }} 
          />
        )}
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          sx={{
            p: 0.5,
            opacity: isFavorite ? 1 : 0.3,
            '&:hover': {
              opacity: 1
            }
          }}
        >
          {isFavorite ? (
            <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
          ) : (
            <StarBorderIcon sx={{ fontSize: 16 }} />
          )}
        </IconButton>
      </Box>
    </MenuItem>
  );
};

export default ThemeToggle;