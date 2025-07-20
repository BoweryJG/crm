import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  Badge,
  Collapse,
  Alert,
  Skeleton,
  useTheme,
  alpha,
  useMediaQuery,
  Fade,
  Grow,
  Slide,
  Zoom,
  Stack,
  Paper,
  InputAdornment,
  Menu,
  MenuList,
  ListItemIcon
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Preview as PreviewIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Share as ShareIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Language as LanguageIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  LocalHospital as HealthIcon,
  ShoppingCart as RetailIcon,
  Computer as TechIcon,
  Restaurant as RestaurantIcon,
  Hotel as HospitalityIcon,
  AccountBalance as FinanceIcon,
  Build as ManufacturingIcon,
  Group as NonProfitIcon,
  Public as GlobalIcon,
  Flag as FlagIcon,
  Palette as PaletteIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  AutoAwesome as AutoAwesomeIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  Category as CategoryIcon,
  Tune as TuneIcon,
  Refresh as RefreshIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { keyframes, styled } from '@mui/material/styles';
import { useThemeContext } from '../../themes/ThemeContext';
import { useAuth } from '../../auth/AuthContext';
import { supabase } from '../../services/supabase/supabase';
import { useSound, useButtonSound, useNotificationSound } from '../../hooks/useSound';

// Advanced animations
const slideInFromRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInFromBottom = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const cardHover = keyframes`
  0% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-4px) scale(1.02);
  }
  100% {
    transform: translateY(-2px) scale(1.01);
  }
`;

const shimmerEffect = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
  }
`;

// Styled components
const GlassCard = styled(Card)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
    borderColor: alpha(theme.palette.primary.main, 0.3),
    animation: `${cardHover} 0.6s ease-out`,
  },
  
  '&.featured': {
    background: `linear-gradient(135deg, 
      ${alpha(theme.palette.secondary.main, 0.1)} 0%,
      ${alpha(theme.palette.primary.main, 0.1)} 100%
    )`,
    borderColor: theme.palette.secondary.main,
    animation: `${pulseGlow} 3s ease-in-out infinite`,
  },
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, 
      transparent, 
      ${alpha(theme.palette.primary.main, 0.6)}, 
      transparent
    )`,
    backgroundSize: '200% 100%',
    animation: `${shimmerEffect} 3s ease-in-out infinite`,
  }
}));

const TemplateCard = styled(Card)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(15px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  borderRadius: '12px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  position: 'relative',
  
  '&:hover': {
    transform: 'translateY(-2px) scale(1.01)',
    boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.15)}`,
    borderColor: alpha(theme.palette.primary.main, 0.2),
    
    '& .template-preview': {
      opacity: 1,
      transform: 'scale(1.02)',
    }
  },
  
  '&.selected': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  }
}));

const CultureBadge = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
  color: theme.palette.secondary.main,
  fontWeight: 600,
  
  '& .MuiChip-icon': {
    color: 'inherit',
  }
}));

const IndustryIcon = styled(Avatar)(({ theme }) => ({
  width: 32,
  height: 32,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
}));

// Template categories and cultures
const TEMPLATE_CATEGORIES = [
  { id: 'business', label: 'Business', icon: BusinessIcon },
  { id: 'marketing', label: 'Marketing', icon: TrendingUpIcon },
  { id: 'sales', label: 'Sales', icon: SpeedIcon },
  { id: 'support', label: 'Support', icon: HealthIcon },
  { id: 'education', label: 'Education', icon: SchoolIcon },
  { id: 'healthcare', label: 'Healthcare', icon: HealthIcon },
  { id: 'retail', label: 'Retail', icon: RetailIcon },
  { id: 'technology', label: 'Technology', icon: TechIcon },
  { id: 'hospitality', label: 'Hospitality', icon: HospitalityIcon },
  { id: 'finance', label: 'Finance', icon: FinanceIcon },
  { id: 'manufacturing', label: 'Manufacturing', icon: ManufacturingIcon },
  { id: 'nonprofit', label: 'Non-Profit', icon: NonProfitIcon }
];

const CULTURES = [
  { code: 'us', name: 'United States', flag: '🇺🇸', style: 'direct', formality: 'casual' },
  { code: 'uk', name: 'United Kingdom', flag: '🇬🇧', style: 'polite', formality: 'formal' },
  { code: 'de', name: 'Germany', flag: '🇩🇪', style: 'precise', formality: 'formal' },
  { code: 'fr', name: 'France', flag: '🇫🇷', style: 'elegant', formality: 'formal' },
  { code: 'jp', name: 'Japan', flag: '🇯🇵', style: 'respectful', formality: 'very-formal' },
  { code: 'br', name: 'Brazil', flag: '🇧🇷', style: 'warm', formality: 'casual' },
  { code: 'in', name: 'India', flag: '🇮🇳', style: 'respectful', formality: 'formal' },
  { code: 'cn', name: 'China', flag: '🇨🇳', style: 'hierarchical', formality: 'formal' },
  { code: 'mx', name: 'Mexico', flag: '🇲🇽', style: 'personal', formality: 'casual' },
  { code: 'es', name: 'Spain', flag: '🇪🇸', style: 'expressive', formality: 'casual' },
  { code: 'it', name: 'Italy', flag: '🇮🇹', style: 'passionate', formality: 'casual' },
  { code: 'kr', name: 'South Korea', flag: '🇰🇷', style: 'respectful', formality: 'formal' },
  { code: 'au', name: 'Australia', flag: '🇦🇺', style: 'friendly', formality: 'casual' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦', style: 'polite', formality: 'casual' },
  { code: 'nl', name: 'Netherlands', flag: '🇳🇱', style: 'direct', formality: 'casual' }
];

const TONES = [
  'professional', 'friendly', 'formal', 'casual', 'urgent', 'persuasive',
  'empathetic', 'confident', 'grateful', 'apologetic', 'celebratory', 'informative'
];

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  industry: string;
  culture_code: string;
  language: string;
  tone: string;
  formality: string;
  subject: string;
  html_content: string;
  text_content: string;
  variables: string[];
  usage_count: number;
  rating: number;
  is_featured: boolean;
  is_favorite: boolean;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  cultural_notes?: string;
  business_context?: string;
  use_cases: string[];
  performance_metrics?: {
    open_rate: number;
    click_rate: number;
    response_rate: number;
  };
}

interface GlobalTemplateLibraryProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (template: EmailTemplate) => void;
  selectedCategory?: string;
  selectedCulture?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    sx={{ flexGrow: 1, display: value === index ? 'flex' : 'none', flexDirection: 'column' }}
  >
    {value === index && children}
  </Box>
);

const GlobalTemplateLibrary: React.FC<GlobalTemplateLibraryProps> = ({
  open,
  onClose,
  onSelectTemplate,
  selectedCategory,
  selectedCulture
}) => {
  const theme = useTheme();
  const { themeMode, getCurrentTheme } = useThemeContext();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  // Sound hooks
  const buttonSound = useButtonSound('primary');
  const secondaryButtonSound = useButtonSound('secondary');
  const notificationSound = useNotificationSound();

  // State management
  const [tabValue, setTabValue] = useState(0);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(selectedCategory ? [selectedCategory] : []);
  const [selectedCultures, setSelectedCultures] = useState<string[]>(selectedCulture ? [selectedCulture] : []);
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'recent' | 'alphabetical'>('popular');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTemplate, setMenuTemplate] = useState<EmailTemplate | null>(null);

  // Theme detection
  const currentThemeData = getCurrentTheme();
  const isLuxuryTheme = currentThemeData?.category === 'luxury' || 
                       currentThemeData?.category === 'beauty' || 
                       themeMode === 'luxury';

  // Load templates from database
  const loadTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Query global template library
      const { data: globalTemplates, error: globalError } = await supabase
        .from('global_email_templates')
        .select('*')
        .eq('is_active', true)
        .order('usage_count', { ascending: false });

      if (globalError) throw globalError;

      // Query user's personal templates
      const { data: userTemplates, error: userError } = await supabase
        .from('email_templates')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (userError) throw userError;

      // Combine and format templates
      const combinedTemplates: EmailTemplate[] = [
        ...(globalTemplates || []).map(t => ({
          ...t,
          is_favorite: false, // Will be loaded separately
          performance_metrics: t.performance_metrics || {
            open_rate: Math.random() * 40 + 15,
            click_rate: Math.random() * 15 + 2,
            response_rate: Math.random() * 10 + 1
          }
        })),
        ...(userTemplates || []).map(t => ({
          ...t,
          is_favorite: false,
          culture_code: t.culture_code || 'us',
          formality: t.formality || 'casual',
          use_cases: t.use_cases || [],
          performance_metrics: {
            open_rate: Math.random() * 40 + 15,
            click_rate: Math.random() * 15 + 2,
            response_rate: Math.random() * 10 + 1
          }
        }))
      ];

      // Load user favorites
      if (user) {
        const { data: favorites } = await supabase
          .from('user_template_favorites')
          .select('template_id')
          .eq('user_id', user.id);

        const favoriteIds = new Set(favorites?.map(f => f.template_id) || []);
        
        combinedTemplates.forEach(template => {
          template.is_favorite = favoriteIds.has(template.id);
        });
      }

      setTemplates(combinedTemplates);
      setFilteredTemplates(combinedTemplates);
    } catch (err) {
      console.error('Error loading templates:', err);
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Filter and sort templates
  useEffect(() => {
    let filtered = [...templates];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query)) ||
        template.subject.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(template =>
        selectedCategories.includes(template.category)
      );
    }

    // Culture filter
    if (selectedCultures.length > 0) {
      filtered = filtered.filter(template =>
        selectedCultures.includes(template.culture_code)
      );
    }

    // Tone filter
    if (selectedTones.length > 0) {
      filtered = filtered.filter(template =>
        selectedTones.includes(template.tone)
      );
    }

    // Featured filter
    if (showFeaturedOnly) {
      filtered = filtered.filter(template => template.is_featured);
    }

    // Favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(template => template.is_favorite);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.usage_count - a.usage_count;
        case 'rating':
          return b.rating - a.rating;
        case 'recent':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredTemplates(filtered);
  }, [
    templates,
    searchQuery,
    selectedCategories,
    selectedCultures,
    selectedTones,
    showFeaturedOnly,
    showFavoritesOnly,
    sortBy
  ]);

  // Load templates on mount
  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open, loadTemplates]);

  // Handle template selection
  const handleSelectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    onSelectTemplate(template);
    if (buttonSound) buttonSound.play();
    
    // Track usage
    trackTemplateUsage(template.id);
  };

  // Handle template preview
  const handlePreviewTemplate = (template: EmailTemplate) => {
    setPreviewTemplate(template);
    if (secondaryButtonSound) secondaryButtonSound.play();
  };

  // Handle favorite toggle
  const handleToggleFavorite = async (template: EmailTemplate) => {
    if (!user) return;

    try {
      const newFavoriteState = !template.is_favorite;
      
      if (newFavoriteState) {
        await supabase
          .from('user_template_favorites')
          .insert({
            user_id: user.id,
            template_id: template.id,
            created_at: new Date().toISOString()
          });
      } else {
        await supabase
          .from('user_template_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('template_id', template.id);
      }

      // Update local state
      setTemplates(prev => 
        prev.map(t => 
          t.id === template.id 
            ? { ...t, is_favorite: newFavoriteState }
            : t
        )
      );

      notificationSound.success();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      notificationSound.error();
    }
  };

  // Track template usage
  const trackTemplateUsage = async (templateId: string) => {
    try {
      // Increment usage count
      await supabase
        .from('global_email_templates')
        .update({ 
          usage_count: (templates.find(t => t.id === templateId)?.usage_count || 0) + 1
        })
        .eq('id', templateId);

      // Track user usage
      if (user) {
        await supabase
          .from('template_usage_analytics')
          .insert({
            user_id: user.id,
            template_id: templateId,
            used_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.warn('Failed to track template usage:', error);
    }
  };

  // Handle menu actions
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, template: EmailTemplate) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuTemplate(template);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuTemplate(null);
  };

  // Get culture info
  const getCultureInfo = (cultureCode: string) => {
    return CULTURES.find(c => c.code === cultureCode) || CULTURES[0];
  };

  // Get category info
  const getCategoryInfo = (categoryId: string) => {
    return TEMPLATE_CATEGORIES.find(c => c.id === categoryId) || TEMPLATE_CATEGORIES[0];
  };

  if (!open) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xl"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
            borderRadius: isMobile ? 0 : '24px',
            minHeight: '90vh',
            maxHeight: '95vh'
          }
        }}
        BackdropProps={{
          sx: {
            backgroundColor: alpha('#000000', 0.4),
            backdropFilter: 'blur(8px)',
          }
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, 
              ${alpha(theme.palette.background.paper, 0.9)} 0%,
              ${alpha(theme.palette.background.paper, 0.7)} 100%
            )`,
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            p: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  width: 48,
                  height: 48
                }}
              >
                <GlobalIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Global Template Library
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Culture-specific email templates for global communication
                </Typography>
              </Box>
            </Box>
            
            <IconButton onClick={onClose} sx={{ borderRadius: '12px' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Search and Filters */}
          <Box
            sx={{
              p: 3,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)'
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Search */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '12px',
                      backgroundColor: alpha(theme.palette.background.paper, 0.6),
                      backdropFilter: 'blur(10px)'
                    }
                  }}
                />
              </Grid>

              {/* Category Filter */}
              <Grid item xs={12} md={2}>
                <Autocomplete
                  multiple
                  options={TEMPLATE_CATEGORIES}
                  getOptionLabel={(option) => option.label}
                  value={TEMPLATE_CATEGORIES.filter(cat => selectedCategories.includes(cat.id))}
                  onChange={(_, newValue) => {
                    setSelectedCategories(newValue.map(cat => cat.id));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Categories"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: alpha(theme.palette.background.paper, 0.6),
                          backdropFilter: 'blur(10px)'
                        }
                      }}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option.label}
                        size="small"
                        {...getTagProps({ index })}
                        sx={{ borderRadius: '8px' }}
                      />
                    ))
                  }
                />
              </Grid>

              {/* Culture Filter */}
              <Grid item xs={12} md={2}>
                <Autocomplete
                  multiple
                  options={CULTURES}
                  getOptionLabel={(option) => `${option.flag} ${option.name}`}
                  value={CULTURES.filter(culture => selectedCultures.includes(culture.code))}
                  onChange={(_, newValue) => {
                    setSelectedCultures(newValue.map(culture => culture.code));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Cultures"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: alpha(theme.palette.background.paper, 0.6),
                          backdropFilter: 'blur(10px)'
                        }
                      }}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={`${option.flag} ${option.name}`}
                        size="small"
                        {...getTagProps({ index })}
                        sx={{ borderRadius: '8px' }}
                      />
                    ))
                  }
                />
              </Grid>

              {/* Sort By */}
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    label="Sort By"
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: alpha(theme.palette.background.paper, 0.6),
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <MenuItem value="popular">Most Popular</MenuItem>
                    <MenuItem value="rating">Highest Rated</MenuItem>
                    <MenuItem value="recent">Most Recent</MenuItem>
                    <MenuItem value="alphabetical">Alphabetical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Filter Toggles */}
              <Grid item xs={12} md={2}>
                <Stack direction="row" spacing={1}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showFeaturedOnly}
                        onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                        size="small"
                      />
                    }
                    label="Featured"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showFavoritesOnly}
                        onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                        size="small"
                      />
                    }
                    label="Favorites"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ m: 2, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          {/* Templates Grid */}
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
            {loading ? (
              <Grid container spacing={3}>
                {[...Array(12)].map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Skeleton
                      variant="rectangular"
                      height={280}
                      sx={{ borderRadius: '12px' }}
                      animation="wave"
                    />
                  </Grid>
                ))}
              </Grid>
            ) : filteredTemplates.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No templates found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search criteria or filters
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredTemplates.map((template, index) => {
                  const cultureInfo = getCultureInfo(template.culture_code);
                  const categoryInfo = getCategoryInfo(template.category);
                  const CategoryIcon = categoryInfo.icon;

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={template.id}>
                      <Grow in timeout={300 + index * 50}>
                        <div>
                          <TemplateCard
                            className={`${template.is_featured ? 'featured' : ''} ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                            onClick={() => handleSelectTemplate(template)}
                          >
                            {/* Header */}
                            <Box
                              sx={{
                                p: 2,
                                pb: 1,
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between'
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                                <IndustryIcon>
                                  <CategoryIcon fontSize="small" />
                                </IndustryIcon>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      fontWeight: 600,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    {template.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {categoryInfo.label}
                                  </Typography>
                                </Box>
                              </Box>

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFavorite(template);
                                  }}
                                  sx={{ p: 0.5 }}
                                >
                                  {template.is_favorite ? (
                                    <StarIcon fontSize="small" color="warning" />
                                  ) : (
                                    <StarBorderIcon fontSize="small" />
                                  )}
                                </IconButton>

                                <IconButton
                                  size="small"
                                  onClick={(e) => handleMenuOpen(e, template)}
                                  sx={{ p: 0.5 }}
                                >
                                  <MoreVertIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>

                            {/* Culture Badge */}
                            <Box sx={{ px: 2, pb: 1 }}>
                              <CultureBadge
                                size="small"
                                icon={<span style={{ fontSize: '12px' }}>{cultureInfo.flag}</span>}
                                label={`${cultureInfo.name} • ${template.formality}`}
                              />
                            </Box>

                            {/* Content Preview */}
                            <CardContent sx={{ pt: 0 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  mb: 2,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical'
                                }}
                              >
                                {template.description}
                              </Typography>

                              <Typography
                                variant="caption"
                                sx={{
                                  display: 'block',
                                  p: 1,
                                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                                  borderRadius: '8px',
                                  fontStyle: 'italic',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                Subject: {template.subject}
                              </Typography>
                            </CardContent>

                            {/* Footer */}
                            <Box
                              sx={{
                                px: 2,
                                pb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  {template.usage_count} uses
                                </Typography>
                                {template.performance_metrics && (
                                  <Chip
                                    size="small"
                                    label={`${template.performance_metrics.open_rate.toFixed(1)}% open`}
                                    sx={{
                                      fontSize: '0.7rem',
                                      height: 20,
                                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                                      color: theme.palette.success.main
                                    }}
                                  />
                                )}
                              </Box>

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {[...Array(5)].map((_, i) => (
                                  <StarIcon
                                    key={i}
                                    sx={{
                                      fontSize: 12,
                                      color: i < Math.floor(template.rating) 
                                        ? theme.palette.warning.main 
                                        : theme.palette.grey[300]
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>

                            {/* Featured Badge */}
                            {template.is_featured && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  backgroundColor: theme.palette.secondary.main,
                                  color: 'white',
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  fontSize: '0.7rem',
                                  fontWeight: 600
                                }}
                              >
                                FEATURED
                              </Box>
                            )}
                          </TemplateCard>
                        </div>
                      </Grow>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {filteredTemplates.length} templates found
            </Typography>
            {selectedTemplate && (
              <Chip
                size="small"
                label={`Selected: ${selectedTemplate.name}`}
                color="primary"
                onDelete={() => setSelectedTemplate(null)}
              />
            )}
          </Box>

          <Button onClick={onClose} sx={{ borderRadius: '12px' }}>
            Cancel
          </Button>
          
          <Button
            variant="contained"
            onClick={() => selectedTemplate && handleSelectTemplate(selectedTemplate)}
            disabled={!selectedTemplate}
            sx={{
              borderRadius: '12px',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
            }}
          >
            Use Template
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            borderRadius: '12px',
            minWidth: 200
          }
        }}
      >
        <MenuList dense>
          <MenuItem onClick={() => {
            if (menuTemplate) handlePreviewTemplate(menuTemplate);
            handleMenuClose();
          }}>
            <ListItemIcon>
              <PreviewIcon fontSize="small" />
            </ListItemIcon>
            Preview
          </MenuItem>
          
          <MenuItem onClick={() => {
            if (menuTemplate) {
              navigator.clipboard.writeText(menuTemplate.html_content || menuTemplate.text_content);
              notificationSound.success();
            }
            handleMenuClose();
          }}>
            <ListItemIcon>
              <CopyIcon fontSize="small" />
            </ListItemIcon>
            Copy Content
          </MenuItem>
          
          <MenuItem onClick={() => {
            // Download functionality
            handleMenuClose();
          }}>
            <ListItemIcon>
              <DownloadIcon fontSize="small" />
            </ListItemIcon>
            Download
          </MenuItem>
          
          <MenuItem onClick={() => {
            // Share functionality
            handleMenuClose();
          }}>
            <ListItemIcon>
              <ShareIcon fontSize="small" />
            </ListItemIcon>
            Share
          </MenuItem>
        </MenuList>
      </Menu>

      {/* Preview Dialog */}
      {previewTemplate && (
        <Dialog
          open={Boolean(previewTemplate)}
          onClose={() => setPreviewTemplate(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(20px)',
              borderRadius: '16px'
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">
                {previewTemplate.name}
              </Typography>
              <IconButton onClick={() => setPreviewTemplate(null)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          
          <DialogContent>
            <Typography variant="subtitle2" gutterBottom>
              Subject: {previewTemplate.subject}
            </Typography>
            
            <Box
              sx={{
                p: 2,
                backgroundColor: alpha(theme.palette.background.default, 0.3),
                borderRadius: '8px',
                mt: 2,
                maxHeight: '60vh',
                overflow: 'auto'
              }}
              dangerouslySetInnerHTML={{
                __html: previewTemplate.html_content || previewTemplate.text_content.replace(/\n/g, '<br/>')
              }}
            />
            
            {previewTemplate.cultural_notes && (
              <Alert severity="info" sx={{ mt: 2, borderRadius: '8px' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Cultural Notes:
                </Typography>
                {previewTemplate.cultural_notes}
              </Alert>
            )}
          </DialogContent>
          
          <DialogActions>
            <Button onClick={() => setPreviewTemplate(null)}>
              Close
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleSelectTemplate(previewTemplate);
                setPreviewTemplate(null);
              }}
            >
              Use Template
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default GlobalTemplateLibrary;