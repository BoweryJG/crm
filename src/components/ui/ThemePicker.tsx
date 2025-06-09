import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Tabs,
  Tab,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Search as SearchIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Diamond as DiamondIcon,
  Close as CloseIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';
import { 
  themeLibrary, 
  themeCategories, 
  ExtendedTheme,
  getThemesByCategory,
  getPremiumThemes
} from '../../themes/themeLibrary';

interface ThemePickerProps {
  open: boolean;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{ height: '100%', overflow: 'auto' }}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

const ThemePicker: React.FC<ThemePickerProps> = ({ open, onClose }) => {
  const { themeMode, setThemeMode, favoriteThemes, toggleFavoriteTheme, recentThemes } = useThemeContext();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewTheme, setPreviewTheme] = useState<ExtendedTheme | null>(null);

  // Filter themes based on search and category
  const getFilteredThemes = (category?: string) => {
    let themes = category ? getThemesByCategory(category) : themeLibrary;
    
    if (searchTerm) {
      themes = themes.filter(theme => 
        theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theme.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return themes;
  };

  const handleCategoryChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedCategory(newValue);
  };

  const handleThemeSelect = (theme: ExtendedTheme) => {
    setThemeMode(theme.id);
    onClose();
  };

  const handlePreview = (theme: ExtendedTheme) => {
    setPreviewTheme(theme);
    // Could implement live preview here
  };

  const categories = [
    { key: 'all', label: 'All Themes', count: themeLibrary.length },
    { key: 'favorites', label: 'Favorites', count: favoriteThemes.length },
    { key: 'recent', label: 'Recent', count: recentThemes.length },
    { key: 'premium', label: 'Premium', count: getPremiumThemes().length },
    ...Object.entries(themeCategories).map(([key, label]) => ({
      key,
      label,
      count: getThemesByCategory(key).length
    }))
  ];

  const getCurrentThemes = () => {
    switch (selectedCategory) {
      case 1: // Favorites
        return themeLibrary.filter(theme => favoriteThemes.includes(theme.id));
      case 2: // Recent
        return themeLibrary.filter(theme => recentThemes.includes(theme.id));
      case 3: // Premium
        return getPremiumThemes().filter(theme => 
          !searchTerm || theme.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 0: // All
        return getFilteredThemes();
      default: // Category
        const categoryKey = Object.keys(themeCategories)[selectedCategory - 4];
        return getFilteredThemes(categoryKey);
    }
  };

  const currentThemes = getCurrentThemes();

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { 
          height: '80vh',
          bgcolor: 'background.paper'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PaletteIcon />
          <Typography variant="h5">Theme Gallery</Typography>
          <Chip 
            label={`${currentThemes.length} themes`} 
            size="small" 
            color="primary" 
          />
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Search Bar */}
        <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            fullWidth
            placeholder="Search themes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Box>

        {/* Category Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2 }}
          >
            {categories.map((category, index) => (
              <Tab
                key={category.key}
                label={
                  <Badge badgeContent={category.count} color="primary">
                    {category.label}
                  </Badge>
                }
              />
            ))}
          </Tabs>
        </Box>

        {/* Theme Grid */}
        <Box sx={{ p: 3, height: 'calc(100% - 140px)', overflow: 'auto' }}>
          <Grid container spacing={2}>
            {currentThemes.map((theme) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={theme.id}>
                <ThemePreviewCard
                  theme={theme}
                  isSelected={themeMode === theme.id}
                  isFavorite={favoriteThemes.includes(theme.id)}
                  onSelect={() => handleThemeSelect(theme)}
                  onPreview={() => handlePreview(theme)}
                  onToggleFavorite={() => toggleFavoriteTheme(theme.id)}
                />
              </Grid>
            ))}
          </Grid>
          
          {currentThemes.length === 0 && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              height: '200px',
              color: 'text.secondary'
            }}>
              <PaletteIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6">No themes found</Typography>
              <Typography variant="body2">
                Try adjusting your search or browse other categories
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>
          Close
        </Button>
        <Button variant="contained" onClick={onClose}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Theme Preview Card Component
interface ThemePreviewCardProps {
  theme: ExtendedTheme;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onToggleFavorite: () => void;
}

const ThemePreviewCard: React.FC<ThemePreviewCardProps> = ({
  theme,
  isSelected,
  isFavorite,
  onSelect,
  onPreview,
  onToggleFavorite
}) => {
  return (
    <Card 
      variant={isSelected ? "elevation" : "outlined"}
      elevation={isSelected ? 8 : 1}
      sx={{ 
        height: '100%',
        transition: 'all 0.2s ease-in-out',
        position: 'relative',
        border: isSelected ? '2px solid' : '1px solid',
        borderColor: isSelected ? 'primary.main' : 'divider',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <CardActionArea onClick={onSelect} sx={{ height: '100%' }}>
        <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Theme Color Preview */}
          <Box sx={{ 
            height: 60, 
            mb: 2, 
            borderRadius: 1,
            overflow: 'hidden',
            display: 'flex',
            position: 'relative'
          }}>
            <Box sx={{ 
              flex: 1, 
              bgcolor: theme.preview.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Box sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: theme.preview.secondary,
                border: '2px solid',
                borderColor: theme.preview.surface
              }} />
            </Box>
            <Box sx={{ 
              flex: 1, 
              bgcolor: theme.preview.background,
              borderLeft: `2px solid ${theme.preview.surface}`
            }} />
          </Box>

          {/* Theme Info */}
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                {theme.name}
              </Typography>
              {theme.premium && (
                <Tooltip title="Premium Theme">
                  <DiamondIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                </Tooltip>
              )}
            </Box>

            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                fontSize: '0.75rem',
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {theme.description}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
              <Chip 
                label={themeCategories[theme.category as keyof typeof themeCategories]} 
                size="small" 
                variant="outlined"
                sx={{ fontSize: '0.65rem', height: 20 }}
              />
              
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                sx={{ ml: 1 }}
              >
                {isFavorite ? (
                  <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                ) : (
                  <StarBorderIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            </Box>
          </Box>

          {/* Selected Indicator */}
          {isSelected && (
            <Box sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 'bold'
            }}>
              ✓
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ThemePicker;