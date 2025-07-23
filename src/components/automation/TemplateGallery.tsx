import React, { useState, useMemo, memo, useCallback, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Badge,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  PlayArrow as PlayIcon,
  Info as InfoIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { 
  MEDICAL_AUTOMATION_TEMPLATES, 
  TEMPLATE_CATEGORIES,
  AutomationTemplate,
  getTemplatesByCategory,
  getPopularTemplates
} from '../../services/automation/MedicalAutomationTemplates';
import LazyTemplateCard from './LazyTemplateCard';
import usePerformanceMonitoring from '../../hooks/usePerformanceMonitoring';

interface TemplateGalleryProps {
  onTemplateSelect?: (template: AutomationTemplate) => void;
  onQuickStart?: (templateId: string) => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = memo(({
  onTemplateSelect,
  onQuickStart
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState<AutomationTemplate | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { measureRender, measureInteraction, getMobilePerformanceScore } = usePerformanceMonitoring({
    onMetric: (metric) => {
      // Log performance metrics for optimization
      if (metric.name.includes('template') && metric.value > 100) {
        console.warn(`Slow template operation: ${metric.name} took ${metric.value}ms`);
      }
    }
  });

  // Measure component render time
  useEffect(() => {
    const endRender = measureRender('TemplateGallery');
    return endRender;
  }, [measureRender]);

  // Category icons mapping - memoized to prevent recreation
  const categoryIcons = useMemo(() => ({
    'Psychological Warfare': <PsychologyIcon />,
    'Intelligence & Prediction': <AnalyticsIcon />,
    'Influence & Network': <TrendingUpIcon />,
    'Competitive & Market': <TrendingUpIcon />,
    'Status & Legacy': <StarIcon />,
    'Financial & ROI': <MoneyIcon />,
    'Risk & Protection': <SecurityIcon />,
    'Social & Digital': <TrendingUpIcon />,
    'Education & Influence': <SchoolIcon />
  }), []);

  // Difficulty colors
  const getDifficultyColor = useCallback((level: string) => {
    switch (level) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning'; 
      case 'Advanced': return 'error';
      default: return 'default';
    }
  }, []);

  // Filter templates - debounced for performance
  const filteredTemplates = useMemo(() => {
    let filtered = MEDICAL_AUTOMATION_TEMPLATES;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = getTemplatesByCategory(selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.psychology.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [searchTerm, selectedCategory]);

  const popularTemplates = useMemo(() => getPopularTemplates(), []);

  // Performance-optimized search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const endInteraction = measureInteraction('template_search');
    setSearchTerm(e.target.value);
    endInteraction();
  }, [measureInteraction]);

  // Performance-optimized category change
  const handleCategoryChange = useCallback((value: string) => {
    const endInteraction = measureInteraction('category_filter');
    setSelectedCategory(value);
    endInteraction();
  }, [measureInteraction]);

  const handlePreview = useCallback((template: AutomationTemplate) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  }, []);

  const handleQuickStart = useCallback((templateId: string) => {
    if (onQuickStart) {
      onQuickStart(templateId);
    }
  }, [onQuickStart]);

  return (
    <Box sx={{
      '@media (max-width: 768px)': {
        px: 1,
        '& .MuiGrid-container': {
          spacing: 1
        }
      }
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Medical Device Automation Templates
        </Typography>
        <Typography variant="body1" color="text.secondary">
          34 revolutionary automation templates designed specifically for medical device sales
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        gap: 2, 
        alignItems: 'center',
        '@media (max-width: 768px)': {
          flexDirection: 'column',
          gap: 1,
          '& .MuiTextField-root': {
            width: '100%'
          },
          '& .MuiFormControl-root': {
            width: '100%',
            minWidth: 'unset'
          }
        }
      }}>
        <TextField
          placeholder="Search templates..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ flexGrow: 1 }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            label="Category"
          >
            <MenuItem value="All">All Categories</MenuItem>
            {Object.keys(TEMPLATE_CATEGORIES).map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Popular Templates Section */}
      {selectedCategory === 'All' && !searchTerm && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            🌟 Popular Templates
          </Typography>
          <Grid container spacing={3}>
            {popularTemplates.map((template) => (
              <Grid item xs={12} md={6} lg={4} key={template.id}>
                <LazyTemplateCard 
                  template={template}
                  onPreview={handlePreview}
                  onQuickStart={handleQuickStart}
                  categoryIcons={categoryIcons}
                  getDifficultyColor={getDifficultyColor}
                  popularTemplates={popularTemplates}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* All Templates */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {selectedCategory === 'All' ? 'All Templates' : selectedCategory}
          <Chip 
            label={`${filteredTemplates.length} templates`} 
            size="small" 
            sx={{ ml: 2 }} 
          />
        </Typography>
        
        {filteredTemplates.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No templates found matching your criteria
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredTemplates.map((template) => (
              <Grid item xs={12} md={6} lg={4} key={template.id}>
                <LazyTemplateCard 
                  template={template}
                  onPreview={handlePreview}
                  onQuickStart={handleQuickStart}
                  categoryIcons={categoryIcons}
                  getDifficultyColor={getDifficultyColor}
                  popularTemplates={popularTemplates}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Template Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '@media (max-width: 768px)': {
            '& .MuiDialog-paper': {
              margin: 1,
              width: 'calc(100% - 16px)'
            }
          }
        }}
      >
        {selectedTemplate && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {categoryIcons[selectedTemplate.category as keyof typeof categoryIcons]}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {selectedTemplate.name}
                </Typography>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={selectedTemplate.category} 
                  color="primary" 
                  sx={{ mr: 1 }} 
                />
                <Chip 
                  label={`${selectedTemplate.difficulty_level} Level`}
                  color={getDifficultyColor(selectedTemplate.difficulty_level)}
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={selectedTemplate.estimated_duration}
                  variant="outlined"
                />
              </Box>

              <Typography variant="body1" paragraph>
                {selectedTemplate.description}
              </Typography>

              <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', color: 'primary.main' }}>
                💡 Psychology: {selectedTemplate.psychology}
              </Typography>

              <Typography variant="h6" gutterBottom>
                Workflow Steps ({selectedTemplate.workflow_steps.length})
              </Typography>
              
              {selectedTemplate.workflow_steps.map((step, index) => (
                <Box key={step.id} sx={{ mb: 2, pl: 2, borderLeft: '3px solid', borderColor: 'primary.main' }}>
                  <Typography variant="subtitle2">
                    Step {index + 1}: {step.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {step.type.toUpperCase()}
                    {step.delay_hours && ` • Wait: ${step.delay_hours} hours`}
                  </Typography>
                  {step.content && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Subject: {step.content.subject}
                    </Typography>
                  )}
                </Box>
              ))}

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Success Metrics
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedTemplate.success_metrics.map((metric, index) => (
                  <Chip key={index} label={metric} size="small" variant="outlined" />
                ))}
              </Box>
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setPreviewOpen(false)}>
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                onClick={() => {
                  handleQuickStart(selectedTemplate.id);
                  setPreviewOpen(false);
                }}
              >
                Start This Template
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
});

TemplateGallery.displayName = 'TemplateGallery';

export default TemplateGallery;