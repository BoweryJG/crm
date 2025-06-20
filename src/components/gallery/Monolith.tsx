// Monolith Card Component - The foundational sculpture of our UI
// Each card is a minimalist monument to data

import React, { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Divider,
  Fade,
  Grow,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { MoreVert as MoreIcon } from '@mui/icons-material';
import glassEffects from '../../themes/glassEffects';
import animations from '../../themes/animations';

interface MonolithProps {
  // Content
  title?: string;
  subtitle?: string;
  overline?: string;
  children: ReactNode;
  actions?: ReactNode;
  
  // Styling variants
  variant?: 'obsidian' | 'carbon' | 'museum' | 'goldInfused' | 'frostedSteel';
  elevation?: 'surface' | 'elevated' | 'floating' | 'modal';
  hover?: 'subtle' | 'dramatic' | 'glow' | 'none';
  
  // Behavior
  onClick?: () => void;
  menuItems?: Array<{ label: string; onClick: () => void }>;
  loading?: boolean;
  disabled?: boolean;
  
  // Layout
  fullHeight?: boolean;
  maxWidth?: string | number;
  minHeight?: string | number;
  
  // Animation
  animateOnMount?: boolean;
  animationDelay?: number;
}

const Monolith: React.FC<MonolithProps> = ({
  title,
  subtitle,
  overline,
  children,
  actions,
  variant = 'obsidian',
  elevation = 'elevated',
  hover = 'subtle',
  onClick,
  menuItems,
  loading = false,
  disabled = false,
  fullHeight = false,
  maxWidth,
  minHeight,
  animateOnMount = true,
  animationDelay = 0,
}) => {
  const theme = useTheme();
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // Combine glass effects with hover states
  const glassStyle: any = {
    ...glassEffects.effects[variant],
    ...(hover !== 'none' && glassEffects.hover[hover]),
    ...glassEffects.depth[elevation],
  };

  // Loading overlay style
  const loadingOverlayStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: alpha(theme.palette.background.default, 0.7),
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  };

  // Animation wrapper props
  const animationProps = animateOnMount ? {
    in: true,
    timeout: animations.durations.deliberate + animationDelay,
    style: { transitionDelay: `${animationDelay}ms` },
  } : {};

  const cardContent = (
    <Card
      sx={{
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        height: fullHeight ? '100%' : 'auto',
        ...(maxWidth && { maxWidth }),
        ...(minHeight && { minHeight }),
        display: 'flex',
        flexDirection: 'column',
        ...glassStyle,
        // Override default MUI card styles
        backgroundImage: 'none',
        // Ensure animations work properly
        transition: animations.utils.createTransition(
          animations.durations.normal,
          animations.easings.metal
        ).transition,
        // Gold accent line at top
        '&::before': {
          ...(glassStyle['&::before'] || {}),
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::before': {
          opacity: 1,
        },
      }}
      onClick={onClick}
    >
      {/* Header Section */}
      {(overline || title || subtitle || menuItems) && (
        <Box sx={{ p: 3, pb: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              {overline && (
                <Typography
                  variant="overline"
                  sx={{
                    color: theme.palette.primary.main,
                    display: 'block',
                    mb: 0.5,
                    opacity: 0.8,
                  }}
                >
                  {overline}
                </Typography>
              )}
              {title && (
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 300,
                    letterSpacing: '0.1em',
                    mb: subtitle ? 1 : 2,
                    color: theme.palette.text.primary,
                  }}
                >
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: 2,
                    letterSpacing: '0.05em',
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
            {menuItems && (
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <MoreIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      )}

      {/* Main Content */}
      <CardContent sx={{ flex: 1, p: 3, pt: (overline || title || subtitle) ? 2 : 3 }}>
        {children}
      </CardContent>

      {/* Actions Section */}
      {actions && (
        <>
          <Divider
            sx={{
              borderColor: alpha(theme.palette.primary.main, 0.08),
              mx: 3,
            }}
          />
          <CardActions sx={{ p: 2, px: 3, justifyContent: 'flex-end' }}>
            {actions}
          </CardActions>
        </>
      )}

      {/* Loading Overlay */}
      {loading && (
        <Fade in={loading}>
          <Box sx={loadingOverlayStyle}>
            <Box
              sx={{
                width: 60,
                height: 60,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderTopColor: theme.palette.primary.main,
                borderRadius: '50%',
                animation: `${animations.loading.pedestalRotate.split('animation: ')[1]}`,
              }}
            />
          </Box>
        </Fade>
      )}

      {/* Menu Dropdown */}
      {menuItems && menuAnchor && (
        <Box
          sx={{
            position: 'absolute',
            top: menuAnchor.getBoundingClientRect().bottom,
            right: 24,
            ...glassEffects.effects.carbon,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 0,
            minWidth: 200,
            py: 1,
            boxShadow: theme.shadows[8],
            zIndex: 1300,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {menuItems.map((item, index) => (
            <Box
              key={index}
              onClick={() => {
                item.onClick();
                handleMenuClose();
              }}
              sx={{
                px: 3,
                py: 1.5,
                cursor: 'pointer',
                color: theme.palette.text.primary,
                ...animations.utils.createTransition(animations.durations.quick, animations.easings.metal),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  color: theme.palette.primary.main,
                },
              }}
            >
              <Typography variant="body2" sx={{ letterSpacing: '0.05em' }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Card>
  );

  // Wrap in animation component if enabled
  if (animateOnMount) {
    return (
      <Grow {...animationProps}>
        <Box sx={{ height: fullHeight ? '100%' : 'auto' }}>
          {cardContent}
        </Box>
      </Grow>
    );
  }

  return cardContent;
};

// Compound components for specific use cases
export const MonolithStat: React.FC<{
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  suffix?: string;
}> = ({ label, value, trend, suffix }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      <Typography
        variant="overline"
        sx={{
          color: theme.palette.text.secondary,
          display: 'block',
          mb: 1,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 100,
          letterSpacing: '0.1em',
          color: trend === 'up' 
            ? theme.palette.primary.main 
            : trend === 'down' 
            ? theme.palette.error.main 
            : theme.palette.text.primary,
        }}
      >
        {value}
        {suffix && (
          <Typography
            component="span"
            variant="h5"
            sx={{
              ml: 0.5,
              opacity: 0.7,
              fontWeight: 300,
            }}
          >
            {suffix}
          </Typography>
        )}
      </Typography>
    </Box>
  );
};

export default Monolith;