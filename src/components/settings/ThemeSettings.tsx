import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Tabs,
  Tab,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Badge,
  Button,
  Divider,
  alpha,
  useTheme,
  Fade,
  Zoom,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Diamond as DiamondIcon,
  Palette as PaletteIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  FlightTakeoff as AviationIcon,
  Diamond as LuxuryIcon,
  LocalHospital as MedicalIcon,
  Face as BeautyIcon,
  Computer as ModernIcon,
  BusinessCenter as ClassicIcon,
  Park as NatureIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';
import { 
  allThemes,
  themeCategories, 
  ExtendedTheme,
  getThemesByCategory,
  getPremiumThemes
} from '../../themes/themeLibrary';

const categoryIcons: Record<string, React.ReactElement> = {
  aviation: <AviationIcon />,
  luxury: <LuxuryIcon />,
  medical: <MedicalIcon />,
  beauty: <BeautyIcon />,
  modern: <ModernIcon />,
  classic: <ClassicIcon />,
  nature: <NatureIcon />,
};

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
      style={{ height: '100%' }}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

const ThemeSettings: React.FC = () => {
  const theme = useTheme();
  const {
    themeMode,
    setThemeMode,
    favoriteThemes,
    recentThemes,
    toggleFavoriteTheme,
    getAllAvailableThemes,
    getCurrentTheme,
  } = useThemeContext();

  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewTheme, setPreviewTheme] = useState<ExtendedTheme | null>(null);
  const [autoThemeSwitch, setAutoThemeSwitch] = useState(false);
  const [themeSchedule, setThemeSchedule] = useState({
    dayTheme: 'cartier-gold',
    nightTheme: 'cyber-neon',
    switchTime: '18:00',
  });

  const currentTheme = getCurrentTheme();

  // Filter themes based on search and category
  const getFilteredThemes = (category?: string) => {
    let themes = category ? getThemesByCategory(category) : allThemes;
    
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
    setPreviewTheme(null);
  };

  const handlePreview = (theme: ExtendedTheme) => {
    setPreviewTheme(theme);
    // Could implement live preview here
  };

  const categories = [
    { key: 'all', label: 'All Themes', count: allThemes.length },
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
        return allThemes.filter(theme => favoriteThemes.includes(theme.id));
      case 2: // Recent
        return allThemes.filter(theme => recentThemes.includes(theme.id));
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

  const ThemePreviewCard: React.FC<{ theme: ExtendedTheme }> = ({ theme: cardTheme }) => {
    const isActive = themeMode === cardTheme.id;
    const isFavorite = favoriteThemes.includes(cardTheme.id);
    const isRecent = recentThemes.includes(cardTheme.id);

    return (
      <Zoom in={true} style={{ transitionDelay: '50ms' }}>
        <Card 
          variant={isActive ? "elevation" : "outlined"}
          elevation={isActive ? 8 : 1}
          sx={{ 
            height: '100%',
            transition: 'all 0.2s ease-in-out',
            position: 'relative',
            border: isActive ? '2px solid' : '1px solid',
            borderColor: isActive ? 'primary.main' : 'divider',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 4
            }
          }}
        >
          <CardActionArea onClick={() => handleThemeSelect(cardTheme)} sx={{ height: '100%' }}>
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
                  bgcolor: cardTheme.preview.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Box sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: cardTheme.preview.secondary,
                    border: '2px solid',
                    borderColor: cardTheme.preview.surface
                  }} />
                </Box>
                <Box sx={{ 
                  flex: 1, 
                  bgcolor: cardTheme.preview.background,
                  borderLeft: `2px solid ${cardTheme.preview.surface}`
                }} />
              </Box>

              {/* Theme Info */}
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                    {cardTheme.name}
                  </Typography>
                  {cardTheme.premium && (
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
                  {cardTheme.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Chip 
                      label={themeCategories[cardTheme.category as keyof typeof themeCategories]} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontSize: '0.65rem', height: 20 }}
                    />
                    {isRecent && (
                      <Chip
                        label="Recent"
                        size="small"
                        sx={{
                          fontSize: '0.65rem',
                          height: 20,
                          backgroundColor: alpha(theme.palette.info.main, 0.1),
                          color: theme.palette.info.main,
                        }}
                      />
                    )}
                  </Box>
                  
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteTheme(cardTheme.id);
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
              {isActive && (
                <Box sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 'bold'
                }}>
                  <CheckIcon sx={{ fontSize: 16 }} />
                </Box>
              )}
            </CardContent>
          </CardActionArea>
        </Card>
      </Zoom>
    );
  };

  return (
    <Box>
      {/* Current Theme Info */}
      <Box sx={{ mb: 4, p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Current Theme
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: 2,
            overflow: 'hidden',
            display: 'flex',
            border: '2px solid',
            borderColor: 'divider'
          }}>
            {currentTheme && (
              <>
                <Box sx={{ flex: 1, bgcolor: currentTheme.preview.primary }} />
                <Box sx={{ flex: 1, bgcolor: currentTheme.preview.secondary }} />
                <Box sx={{ flex: 1, bgcolor: currentTheme.preview.background }} />
              </>
            )}
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {currentTheme?.name || 'Unknown Theme'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentTheme?.description || 'No description available'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip 
                label={currentTheme ? themeCategories[currentTheme.category as keyof typeof themeCategories] : 'Unknown'} 
                size="small" 
                icon={currentTheme ? categoryIcons[currentTheme.category] : undefined}
              />
              {currentTheme?.premium && (
                <Chip 
                  label="Premium" 
                  size="small" 
                  icon={<DiamondIcon />}
                  color="warning"
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Theme Schedule */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Theme Schedule
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Automatically switch themes based on time of day
        </Alert>
        <FormControlLabel
          control={
            <Switch
              checked={autoThemeSwitch}
              onChange={(e) => setAutoThemeSwitch(e.target.checked)}
            />
          }
          label="Enable automatic theme switching"
        />
        {autoThemeSwitch && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Day Theme"
                value={themeSchedule.dayTheme}
                onChange={(e) => setThemeSchedule({ ...themeSchedule, dayTheme: e.target.value })}
                SelectProps={{
                  native: true,
                }}
              >
                {allThemes.map(theme => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Night Theme"
                value={themeSchedule.nightTheme}
                onChange={(e) => setThemeSchedule({ ...themeSchedule, nightTheme: e.target.value })}
                SelectProps={{
                  native: true,
                }}
              >
                {allThemes.map(theme => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Switch Time"
                type="time"
                value={themeSchedule.switchTime}
                onChange={(e) => setThemeSchedule({ ...themeSchedule, switchTime: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Theme Gallery */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Theme Gallery
        </Typography>
        
        {/* Search Bar */}
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
          sx={{ mb: 3 }}
        />

        {/* Category Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {categories.map((category) => (
              <Tab
                key={category.key}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {category.label}
                    <Chip label={category.count} size="small" />
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        {/* Theme Grid */}
        <Grid container spacing={2}>
          {currentThemes.map((theme) => (
            <Grid item xs={12} sm={6} md={4} key={theme.id}>
              <ThemePreviewCard theme={theme} />
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

      {/* Reset Theme Button */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          startIcon={<RefreshIcon />}
          onClick={() => setThemeMode('cartier-gold')}
          sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
        >
          Reset to Default Theme
        </Button>
      </Box>
    </Box>
  );
};

export default ThemeSettings;