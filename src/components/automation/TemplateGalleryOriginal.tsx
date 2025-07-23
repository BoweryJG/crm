import React, { useState, useMemo, memo, useCallback, lazy, Suspense } from 'react';
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
  Badge
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

interface TemplateGalleryProps {
  onTemplateSelect?: (template: AutomationTemplate) => void;
  onQuickStart?: (templateId: string) => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onTemplateSelect,
  onQuickStart
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState<AutomationTemplate | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

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

  // Filter templates
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

  const handlePreview = useCallback((template: AutomationTemplate) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  }, []);

  const handleQuickStart = useCallback((templateId: string) => {
    if (onQuickStart) {
      onQuickStart(templateId);
    }
  }, [onQuickStart]);

  const TemplateCard = memo(({ template }: { template: AutomationTemplate }) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
        '@media (hover: hover)': {
          '&:hover': {
            transform: 'translate3d(0, -4px, 0)',
            boxShadow: 4,
          }
        },
        '@media (max-width: 768px)': {
          '&:active': {
            transform: 'translate3d(0, -2px, 0)',
            transition: 'transform 0.1s ease'
          }
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {categoryIcons[template.category]}
          <Typography variant="h6" component="h3" sx={{ ml: 1, flexGrow: 1 }}>
            {template.name}
          </Typography>
          <Tooltip title="Popular template">
            {popularTemplates.some(p => p.id === template.id) && (
              <Badge color="secondary" variant="dot">
                <StarIcon color="primary" fontSize="small" />
              </Badge>
            )}
          </Tooltip>
        </Box>

        <Chip
          label={template.category}
          size="small"
          sx={{ mb: 2 }}
          color="primary"
          variant="outlined"
        />

        <Typography variant="body2" color="text.secondary" paragraph>
          {template.description}
        </Typography>

        <Typography variant="body2" color="text.primary" sx={{ mb: 2, fontStyle: 'italic' }}>
          💡 {template.psychology}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={`${template.difficulty_level} Level`}
            size="small"
            color={getDifficultyColor(template.difficulty_level)}
          />
          <Chip 
            label={template.estimated_duration}
            size="small"
            variant="outlined"
          />
          <Chip 
            label={`${template.workflow_steps.length} Steps`}
            size="small"
            variant="outlined"
          />
        </Box>

        <Typography variant="body2" color="text.secondary">
          <strong>Targets:</strong> {template.target_stakeholders.join(', ')}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          size="small"
          startIcon={<InfoIcon />}
          onClick={() => handlePreview(template)}
        >
          Preview
        </Button>
        <Button
          size="small"
          variant="contained"
          startIcon={<PlayIcon />}
          onClick={() => handleQuickStart(template.id)}
        >
          Quick Start
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box>
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
      <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ flexGrow: 1 }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
                <TemplateCard template={template} />
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
                <TemplateCard template={template} />
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
      >
        {selectedTemplate && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {categoryIcons[selectedTemplate.category]}
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
};

export default TemplateGallery;