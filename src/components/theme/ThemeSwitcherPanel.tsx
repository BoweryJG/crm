import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Drawer,
  Typography,
  Grid,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Tooltip,
  Badge,
  alpha,
  useTheme,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Search as SearchIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Close as CloseIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  FlightTakeoff as AviationIcon,
  Diamond as LuxuryIcon,
  LocalHospital as MedicalIcon,
  Face as BeautyIcon,
  Computer as ModernIcon,
  BusinessCenter as ClassicIcon,
  Park as NatureIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';
import { themeLibrary, themeCategories, ExtendedTheme } from '../../themes/themeLibrary';

const categoryIcons: Record<string, React.ReactElement> = {
  aviation: <AviationIcon />,
  luxury: <LuxuryIcon />,
  medical: <MedicalIcon />,
  beauty: <BeautyIcon />,
  modern: <ModernIcon />,
  classic: <ClassicIcon />,
  nature: <NatureIcon />,
};

interface ThemeSwitcherPanelProps {
  anchor?: 'left' | 'right' | 'top' | 'bottom';
}

const ThemeSwitcherPanel: React.FC<ThemeSwitcherPanelProps> = ({ anchor = 'right' }) => {
  const theme = useTheme();
  const {
    themeMode,
    setThemeMode,
    favoriteThemes,
    recentThemes,
    toggleFavoriteTheme,
    getAllAvailableThemes,
  } = useThemeContext();

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  const allThemes = getAllAvailableThemes();

  // Keyboard shortcut to open theme panel (Ctrl/Cmd + K)
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Filter themes based on search and category
  const filteredThemes = allThemes.filter((t) => {
    const matchesSearch = searchQuery === '' || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || t.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group themes by category for display
  const groupedThemes = filteredThemes.reduce((acc, theme) => {
    if (!acc[theme.category]) {
      acc[theme.category] = [];
    }
    acc[theme.category].push(theme);
    return acc;
  }, {} as Record<string, ExtendedTheme[]>);

  const handleThemeSelect = (themeId: string) => {
    setThemeMode(themeId);
    // Don't close immediately to allow user to see the change
    setTimeout(() => setOpen(false), 500);
  };

  const ThemePreview: React.FC<{ theme: ExtendedTheme }> = ({ theme: previewTheme }) => {
    const isActive = themeMode === previewTheme.id;
    const isFavorite = favoriteThemes.includes(previewTheme.id);
    const isRecent = recentThemes.includes(previewTheme.id);
    const isHovered = hoveredTheme === previewTheme.id;

    return (
      <Zoom in={true} style={{ transitionDelay: '50ms' }}>
        <Paper
          onClick={() => handleThemeSelect(previewTheme.id)}
          onMouseEnter={() => setHoveredTheme(previewTheme.id)}
          onMouseLeave={() => setHoveredTheme(null)}
          sx={{
            p: 2,
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isActive ? 'scale(1.05)' : isHovered ? 'scale(1.02)' : 'scale(1)',
            boxShadow: isActive ? 8 : isHovered ? 4 : 1,
            border: isActive ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, 
                ${previewTheme.preview.primary}20 0%, 
                ${previewTheme.preview.secondary}20 100%)`,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            },
          }}
        >
          {/* Color swatches */}
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5 }}>
            {Object.entries(previewTheme.preview).map(([key, color]) => (
              <Tooltip key={key} title={key} arrow>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    backgroundColor: color,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.2),
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                />
              </Tooltip>
            ))}
          </Box>

          {/* Theme name and description */}
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: isActive ? 700 : 600,
              mb: 0.5,
              color: isActive ? theme.palette.primary.main : 'inherit',
            }}
          >
            {previewTheme.name}
          </Typography>
          
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block',
              color: 'text.secondary',
              mb: 1,
              minHeight: '2.5em',
            }}
          >
            {previewTheme.description}
          </Typography>

          {/* Badges */}
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {previewTheme.premium && (
              <Chip
                label="Premium"
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.warning.main, 0.1),
                  color: theme.palette.warning.main,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            )}
            {isRecent && (
              <Chip
                label="Recent"
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.info.main, 0.1),
                  color: theme.palette.info.main,
                  fontSize: '0.7rem',
                }}
              />
            )}
            {isActive && (
              <Chip
                label="Active"
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            )}
          </Box>

          {/* Favorite button */}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavoriteTheme(previewTheme.id);
            }}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              '&:hover': {
                backgroundColor: theme.palette.background.paper,
              },
            }}
          >
            {isFavorite ? (
              <StarIcon sx={{ fontSize: 18, color: theme.palette.warning.main }} />
            ) : (
              <StarBorderIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>
        </Paper>
      </Zoom>
    );
  };

  return (
    <>
      {/* Floating theme switcher button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: theme.zIndex.speedDial,
        }}
      >
        <Tooltip 
          title={
            <Box>
              <Typography variant="body2">Theme Gallery</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Press Ctrl+K (or ⌘K on Mac)
              </Typography>
            </Box>
          } 
          arrow
        >
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              width: 56,
              height: 56,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              boxShadow: 4,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                transform: 'scale(1.1) rotate(180deg)',
                boxShadow: 8,
              },
            }}
          >
            <PaletteIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Theme selection drawer */}
      <Drawer
        anchor={anchor}
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 480, md: 600 },
            maxWidth: '100%',
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box
            sx={{
              p: 3,
              borderBottom: 1,
              borderColor: 'divider',
              background: alpha(theme.palette.primary.main, 0.05),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                Theme Gallery
              </Typography>
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Search bar */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search themes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Category filters */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="All"
                onClick={() => setSelectedCategory(null)}
                color={!selectedCategory ? 'primary' : 'default'}
                variant={!selectedCategory ? 'filled' : 'outlined'}
              />
              {Object.entries(themeCategories).map(([key, label]) => (
                <Chip
                  key={key}
                  label={label}
                  icon={categoryIcons[key]}
                  onClick={() => setSelectedCategory(key)}
                  color={selectedCategory === key ? 'primary' : 'default'}
                  variant={selectedCategory === key ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>

          {/* Theme grid */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
            {/* Favorites section */}
            {favoriteThemes.length > 0 && !searchQuery && !selectedCategory && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon sx={{ color: theme.palette.warning.main }} />
                  Favorites
                </Typography>
                <Grid container spacing={2}>
                  {favoriteThemes.map((themeId) => {
                    const favTheme = allThemes.find((t) => t.id === themeId);
                    return favTheme ? (
                      <Grid item xs={12} sm={6} key={themeId}>
                        <ThemePreview theme={favTheme} />
                      </Grid>
                    ) : null;
                  })}
                </Grid>
              </Box>
            )}

            {/* All themes by category */}
            {Object.entries(groupedThemes).map(([category, themes]) => (
              <Fade in={true} key={category}>
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {categoryIcons[category]}
                    {themeCategories[category as keyof typeof themeCategories]}
                  </Typography>
                  <Grid container spacing={2}>
                    {themes.map((t) => (
                      <Grid item xs={12} sm={6} key={t.id}>
                        <ThemePreview theme={t} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Fade>
            ))}

            {/* No results */}
            {filteredThemes.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No themes found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your search or filters
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default ThemeSwitcherPanel;