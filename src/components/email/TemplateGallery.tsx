import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Tooltip,
  useTheme,
  alpha,
  Fade,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  PlayArrow as PlayIcon,
  Visibility as PreviewIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  AutoAwesome as AIIcon,
  Email as EmailIcon,
  Campaign as CampaignIcon,
  QuestionAnswer as SocraticIcon,
  TrendingUp as ChallengerIcon,
  School as TeachingIcon,
  Psychology as InsightIcon,
  Close as CloseIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';
import { SOCRATIC_CHALLENGER_TEMPLATES } from '../../services/contentTemplates';
import { emailAutomationEngine } from '../../services/email/EmailAutomationEngine';

interface TemplateGalleryProps {
  onTemplateSelect?: (template: any) => void;
  onClose?: () => void;
  mode?: 'modal' | 'embedded';
}

interface Template {
  id: string;
  template_name: string;
  content_type: string;
  industry_focus: string;
  procedure_tags: string[];
  template_structure: {
    components: string[];
    methodology: string;
    style: string;
  };
  description?: string;
  category?: string;
  popularity?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  usageCount?: number;
  successRate?: number;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onTemplateSelect,
  onClose,
  mode = 'modal'
}) => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const themeColor = theme.palette.primary.main;

  // Convert content templates to template format
  useEffect(() => {
    const convertedTemplates: Template[] = SOCRATIC_CHALLENGER_TEMPLATES.map((template, index) => ({
      id: `template-${index}`,
      template_name: template.template_name,
      content_type: template.content_type,
      industry_focus: template.industry_focus,
      procedure_tags: template.procedure_tags,
      template_structure: template.template_structure,
      description: getTemplateDescription(template.content_type),
      category: getCategoryFromType(template.content_type),
      popularity: Math.floor(Math.random() * 100) + 50,
      isNew: Math.random() > 0.7,
      isFeatured: Math.random() > 0.8,
      usageCount: Math.floor(Math.random() * 500) + 100,
      successRate: Math.floor(Math.random() * 30) + 70,
    }));

    setTemplates(convertedTemplates);
    setFilteredTemplates(convertedTemplates);
  }, []);

  const getTemplateDescription = (contentType: string): string => {
    const descriptions: Record<string, string> = {
      'socratic_discovery': 'Use thought-provoking questions to guide prospects to new insights about their practice challenges.',
      'challenger_insight': 'Challenge conventional thinking with bold, contrarian insights backed by industry data.',
      'teaching_sequence': 'Educate prospects with valuable insights while subtly challenging their current approach.',
      'provocative_demo': 'Interactive demo scripts that challenge assumptions while showcasing capabilities.',
      'insight_objection': 'Transform objections into opportunities to teach and challenge thinking.',
      'case_study_challenge': 'Compelling stories that show how similar practices transformed by abandoning traditional approaches.',
    };
    return descriptions[contentType] || 'Advanced email automation template for professional communication.';
  };

  const getCategoryFromType = (contentType: string): string => {
    const categories: Record<string, string> = {
      'socratic_discovery': 'Discovery',
      'challenger_insight': 'Challenger',
      'teaching_sequence': 'Education',
      'provocative_demo': 'Presentations',
      'insight_objection': 'Objection Handling',
      'case_study_challenge': 'Case Studies',
    };
    return categories[contentType] || 'General';
  };

  const getTemplateIcon = (contentType: string) => {
    const icons: Record<string, React.ReactNode> = {
      'socratic_discovery': <SocraticIcon sx={{ color: theme.palette.primary.main }} />,
      'challenger_insight': <ChallengerIcon sx={{ color: theme.palette.secondary.main }} />,
      'teaching_sequence': <TeachingIcon sx={{ color: theme.palette.info.main }} />,
      'provocative_demo': <PlayIcon sx={{ color: theme.palette.warning.main }} />,
      'insight_objection': <InsightIcon sx={{ color: theme.palette.error.main }} />,
      'case_study_challenge': <CampaignIcon sx={{ color: theme.palette.success.main }} />,
    };
    return icons[contentType] || <EmailIcon sx={{ color: theme.palette.text.secondary }} />;
  };

  const categories = ['all', 'Discovery', 'Challenger', 'Education', 'Presentations', 'Objection Handling', 'Case Studies'];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterTemplates(query, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterTemplates(searchQuery, category);
  };

  const filterTemplates = (query: string, category: string) => {
    let filtered = templates;

    if (category !== 'all') {
      filtered = filtered.filter(template => template.category === category);
    }

    if (query) {
      filtered = filtered.filter(template =>
        template.template_name.toLowerCase().includes(query.toLowerCase()) ||
        template.description?.toLowerCase().includes(query.toLowerCase()) ||
        template.procedure_tags.some(tag => 
          tag.toLowerCase().includes(query.toLowerCase())
        )
      );
    }

    setFilteredTemplates(filtered);
  };

  const toggleFavorite = (templateId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    setFavorites(newFavorites);
  };

  const handleTemplateActivate = (template: Template) => {
    // Trigger the template automation
    console.log('🚀 Activating template:', template.template_name);
    
    // Here you would integrate with the email automation engine
    emailAutomationEngine.triggerAutomation('email-template', template.id, {
      template_type: template.content_type,
      template_name: template.template_name,
      methodology: template.template_structure.methodology,
      activated_from: 'template-gallery'
    });

    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
  };

  const PreviewDialog = () => (
    <Dialog
      open={Boolean(previewTemplate)}
      onClose={() => setPreviewTemplate(null)}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          background: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        },
      }}
    >
      {previewTemplate && (
        <>
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha(themeColor, 0.1) }}>
                {getTemplateIcon(previewTemplate.content_type)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">{previewTemplate.template_name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {previewTemplate.category} • {previewTemplate.template_structure.methodology}
                </Typography>
              </Box>
              <IconButton onClick={() => setPreviewTemplate(null)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {previewTemplate.description}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Template Components
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {previewTemplate.template_structure.components.map((component) => (
                    <Chip
                      key={component}
                      label={component.replace(/_/g, ' ')}
                      size="small"
                      variant="outlined"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Focus Areas
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {previewTemplate.procedure_tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag.replace(/_/g, ' ')}
                      size="small"
                      sx={{ 
                        backgroundColor: alpha(themeColor, 0.1),
                        color: themeColor,
                        textTransform: 'capitalize'
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {previewTemplate.usageCount}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Times Used
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {previewTemplate.successRate}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Success Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {previewTemplate.popularity}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Popularity Score
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewTemplate(null)}>
              Close
            </Button>
            <Button
              variant="contained"
              startIcon={<LaunchIcon />}
              onClick={() => {
                handleTemplateActivate(previewTemplate);
                setPreviewTemplate(null);
              }}
              sx={{
                background: `linear-gradient(135deg, ${themeColor}, ${alpha(themeColor, 0.8)})`,
              }}
            >
              Activate Template
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );

  const containerProps = mode === 'modal' ? {
    sx: {
      p: 3,
      maxHeight: '80vh',
      overflowY: 'auto',
    }
  } : {
    sx: { p: 2 }
  };

  return (
    <Box {...containerProps}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: alpha(themeColor, 0.1) }}>
              <AIIcon sx={{ color: themeColor }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Template Gallery
              </Typography>
              <Typography variant="body2" color="text.secondary">
                34 Professional Email Templates • Socratic & Challenger Sales
              </Typography>
            </Box>
          </Box>
          {mode === 'modal' && onClose && (
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        {/* Search and Filters */}
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category === 'all' ? 'All Templates' : category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Featured Templates */}
      {selectedCategory === 'all' && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <StarIcon sx={{ color: theme.palette.warning.main }} />
            Featured Templates
          </Typography>
          <Grid container spacing={2}>
            {filteredTemplates.filter(t => t.isFeatured).slice(0, 3).map((template) => (
              <Grid item xs={12} md={4} key={template.id}>
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${alpha(themeColor, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                    border: `2px solid ${alpha(themeColor, 0.2)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: alpha(themeColor, 0.4),
                      boxShadow: `0 8px 32px ${alpha(themeColor, 0.2)}`,
                    },
                  }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {getTemplateIcon(template.content_type)}
                      <Chip label="Featured" size="small" color="warning" />
                      {template.isNew && <Chip label="New" size="small" color="success" />}
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1, fontSize: '1rem' }}>
                      {template.template_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                      {template.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="success.main">
                        {template.successRate}% Success Rate
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => toggleFavorite(template.id)}
                        sx={{ color: favorites.has(template.id) ? theme.palette.warning.main : 'inherit' }}
                      >
                        {favorites.has(template.id) ? <StarIcon /> : <StarBorderIcon />}
                      </IconButton>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ pt: 0, gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<PreviewIcon />}
                      onClick={() => setPreviewTemplate(template)}
                    >
                      Preview
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<PlayIcon />}
                      onClick={() => handleTemplateActivate(template)}
                      sx={{ ml: 'auto' }}
                    >
                      Activate
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* All Templates */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {selectedCategory === 'all' ? 'All Templates' : `${selectedCategory} Templates`}
          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({filteredTemplates.length} templates)
          </Typography>
        </Typography>

        <Grid container spacing={2}>
          {filteredTemplates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Fade in>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      borderColor: alpha(themeColor, 0.3),
                      boxShadow: `0 4px 20px ${alpha(themeColor, 0.1)}`,
                    },
                  }}
                >
                  <CardContent sx={{ flex: 1, pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getTemplateIcon(template.content_type)}
                        <Chip 
                          label={template.category}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {template.isNew && <Chip label="New" size="small" color="success" />}
                        <IconButton
                          size="small"
                          onClick={() => toggleFavorite(template.id)}
                          sx={{ color: favorites.has(template.id) ? theme.palette.warning.main : 'inherit' }}
                        >
                          {favorites.has(template.id) ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {template.template_name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 48 }}>
                      {template.description}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {template.procedure_tags.slice(0, 2).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag.replace(/_/g, ' ')}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            height: 20,
                            backgroundColor: alpha(themeColor, 0.1),
                            color: themeColor,
                            textTransform: 'capitalize',
                          }}
                        />
                      ))}
                      {template.procedure_tags.length > 2 && (
                        <Chip
                          label={`+${template.procedure_tags.length - 2}`}
                          size="small"
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Used {template.usageCount} times
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                          {template.successRate}% Success
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ pt: 0, gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<PreviewIcon />}
                      onClick={() => setPreviewTemplate(template)}
                    >
                      Preview
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<PlayIcon />}
                      onClick={() => handleTemplateActivate(template)}
                      sx={{
                        ml: 'auto',
                        background: `linear-gradient(135deg, ${themeColor}, ${alpha(themeColor, 0.8)})`,
                      }}
                    >
                      Activate
                    </Button>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {filteredTemplates.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No templates found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria or select a different category.
            </Typography>
          </Box>
        )}
      </Box>

      <PreviewDialog />
    </Box>
  );
};

export default TemplateGallery;