import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Tooltip,
  Badge,
  Skeleton
} from '@mui/material';
import {
  Info as InfoIcon,
  PlayArrow as PlayIcon,
  Star as StarIcon,
  Psychology as PsychologyIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Security as SecurityIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { AutomationTemplate } from '../../services/automation/MedicalAutomationTemplates';

interface LazyTemplateCardProps {
  template: AutomationTemplate;
  onPreview: (template: AutomationTemplate) => void;
  onQuickStart: (templateId: string) => void;
  isVisible?: boolean;
  categoryIcons: { [key: string]: React.ReactElement };
  getDifficultyColor: (level: string) => any;
  popularTemplates: AutomationTemplate[];
}

const LazyTemplateCard = memo<LazyTemplateCardProps>(({
  template,
  onPreview,
  onQuickStart,
  isVisible = true,
  categoryIcons,
  getDifficultyColor,
  popularTemplates
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!cardRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          setIsIntersecting(true);
          // Delay loading slightly to improve perceived performance
          setTimeout(() => setIsLoaded(true), 50);
        }
      },
      {
        rootMargin: '50px 0px', // Load 50px before entering viewport
        threshold: 0.1
      }
    );

    observer.observe(cardRef.current);

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [isLoaded]);

  const handlePreview = useCallback(() => {
    onPreview(template);
  }, [template, onPreview]);

  const handleQuickStart = useCallback(() => {
    onQuickStart(template.id);
  }, [template.id, onQuickStart]);

  // Show skeleton while loading
  if (!isIntersecting && !isLoaded) {
    return (
      <div ref={cardRef}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" sx={{ ml: 1, flexGrow: 1 }} width="60%" />
              <Skeleton variant="circular" width={20} height={20} />
            </Box>
            <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="100%" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Skeleton variant="rounded" width={60} height={24} />
              <Skeleton variant="rounded" width={80} height={24} />
              <Skeleton variant="rounded" width={70} height={24} />
            </Box>
            <Skeleton variant="text" width="100%" />
          </CardContent>
          <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
            <Skeleton variant="rounded" width={80} height={32} />
            <Skeleton variant="rounded" width={100} height={32} />
          </CardActions>
        </Card>
      </div>
    );
  }

  return (
    <div ref={cardRef}>
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
            {categoryIcons[template.category as keyof typeof categoryIcons]}
            <Typography variant="h6" component="h3" sx={{ ml: 1, flexGrow: 1 }}>
              {template.name}
            </Typography>
            {popularTemplates.some(p => p.id === template.id) && (
              <Tooltip title="Popular template">
                <Badge color="secondary" variant="dot">
                  <StarIcon color="primary" fontSize="small" />
                </Badge>
              </Tooltip>
            )}
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
            onClick={handlePreview}
          >
            Preview
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<PlayIcon />}
            onClick={handleQuickStart}
          >
            Quick Start
          </Button>
        </CardActions>
      </Card>
    </div>
  );
});

LazyTemplateCard.displayName = 'LazyTemplateCard';

export default LazyTemplateCard;