// Gallery Layout Components - Spatial arrangements inspired by museum curation

import React, { ReactNode } from 'react';
import {
  Box,
  Container,
  Grid,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import animations from '../../themes/animations';

interface GalleryContainerProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  gutterBottom?: boolean;
  centered?: boolean;
}

export const GalleryContainer: React.FC<GalleryContainerProps> = ({
  children,
  maxWidth = 'xl',
  gutterBottom = true,
  centered = false,
}) => {
  const theme = useTheme();
  
  return (
    <Container
      maxWidth={maxWidth}
      sx={{
        py: { xs: 3, md: 6 },
        mb: gutterBottom ? { xs: 4, md: 8 } : 0,
        textAlign: centered ? 'center' : 'left',
        position: 'relative',
        // Subtle gallery boundary lines
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.1)}, transparent)`,
        },
        '&::before': {
          top: 0,
        },
        '&::after': {
          bottom: 0,
        },
      }}
    >
      {children}
    </Container>
  );
};

interface ExhibitionGridProps {
  children: ReactNode;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  spacing?: number;
  stagger?: boolean;
}

export const ExhibitionGrid: React.FC<ExhibitionGridProps> = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  spacing = 4,
  stagger = true,
}) => {
  const childrenArray = React.Children.toArray(children);
  
  return (
    <Grid container spacing={spacing}>
      {childrenArray.map((child, index) => (
        <Grid
          item
          key={index}
          xs={12 / (columns.xs || 1)}
          sm={12 / (columns.sm || 2)}
          md={12 / (columns.md || 3)}
          lg={12 / (columns.lg || 4)}
          xl={12 / (columns.xl || columns.lg || 4)}
          sx={{
            ...(stagger && {
              '& > *': {
                animationDelay: `${index * 100}ms`,
              },
            }),
          }}
        >
          {child}
        </Grid>
      ))}
    </Grid>
  );
};

interface SculptureRowProps {
  children: ReactNode;
  spacing?: number;
  direction?: 'row' | 'column';
  alignItems?: string;
  justifyContent?: string;
}

export const SculptureRow: React.FC<SculptureRowProps> = ({
  children,
  spacing = 3,
  direction = 'row',
  alignItems = 'stretch',
  justifyContent = 'flex-start',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Stack
      direction={isMobile ? 'column' : direction}
      spacing={spacing}
      alignItems={alignItems}
      justifyContent={justifyContent}
      sx={{
        width: '100%',
        // Add subtle connection lines between items
        '& > *:not(:last-child)::after': {
          content: '""',
          position: 'absolute',
          [direction === 'row' ? 'right' : 'bottom']: spacing * -8 / 2,
          [direction === 'row' ? 'top' : 'left']: '50%',
          [direction === 'row' ? 'width' : 'height']: `${spacing * 8}px`,
          [direction === 'row' ? 'height' : 'width']: '1px',
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          transform: direction === 'row' ? 'translateY(-50%)' : 'translateX(-50%)',
        },
      }}
    >
      {children}
    </Stack>
  );
};

interface GalleryWallProps {
  children: ReactNode;
  title?: string;
  variant?: 'left' | 'center' | 'right';
}

export const GalleryWall: React.FC<GalleryWallProps> = ({
  children,
  title,
  variant = 'left',
}) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        position: 'relative',
        mb: 8,
        // Wall effect with perspective
        perspective: '1000px',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: variant === 'right' ? 'auto' : 0,
          right: variant === 'left' ? 'auto' : 0,
          bottom: 0,
          width: '3px',
          background: `linear-gradient(180deg, transparent, ${theme.palette.primary.main}, transparent)`,
          opacity: 0.2,
        },
      }}
    >
      {title && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            [variant]: 0,
            transform: variant === 'center' ? 'translateX(-50%)' : 'none',
            [variant === 'center' ? 'left' : '']: variant === 'center' ? '50%' : '',
          }}
        >
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              px: 3,
              py: 1,
              backgroundColor: theme.palette.background.default,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              borderRadius: 0,
              transform: 'rotate(-90deg) translateX(-100%)',
              transformOrigin: 'left top',
              position: 'absolute',
              left: variant === 'right' ? 'auto' : '40px',
              right: variant === 'left' ? 'auto' : '40px',
              top: '40px',
            }}
          >
            <Box
              component="span"
              sx={{
                fontVariant: 'small-caps',
                letterSpacing: '0.2em',
                fontSize: '0.875rem',
                color: theme.palette.text.secondary,
              }}
            >
              {title}
            </Box>
          </Box>
        </Box>
      )}
      <Box
        sx={{
          pl: variant === 'left' ? 8 : 0,
          pr: variant === 'right' ? 8 : 0,
          mx: variant === 'center' ? 'auto' : 0,
          maxWidth: variant === 'center' ? '80%' : '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

interface FloatingDisplayProps {
  children: ReactNode;
  elevation?: number;
  float?: 'left' | 'right' | 'center';
}

export const FloatingDisplay: React.FC<FloatingDisplayProps> = ({
  children,
  elevation = 40,
  float = 'center',
}) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-block',
        mx: float === 'center' ? 'auto' : 0,
        ml: float === 'right' ? 'auto' : 0,
        mr: float === 'left' ? 'auto' : 0,
        // Floating shadow effect
        filter: `drop-shadow(0 ${elevation}px ${elevation * 2}px ${alpha(theme.palette.common.black, 0.4)})`,
        // Subtle float animation
        animation: `float-gentle ${animations.durations.cinematic * 3}ms ${animations.easings.gallery} infinite`,
        '@keyframes float-gentle': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        // Perspective tilt on hover
        transition: animations.utils.createTransition(
          animations.durations.normal,
          animations.easings.metal
        ).transition,
        '&:hover': {
          transform: 'perspective(1000px) rotateX(5deg) rotateY(-5deg)',
        },
      }}
    >
      {children}
    </Box>
  );
};

interface NegativeSpaceProps {
  height?: string | number;
  pattern?: 'dots' | 'lines' | 'grid' | 'none';
}

export const NegativeSpace: React.FC<NegativeSpaceProps> = ({
  height = 120,
  pattern = 'none',
}) => {
  const theme = useTheme();
  
  const patterns = {
    dots: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.05)} 1px, transparent 1px)`,
    lines: `repeating-linear-gradient(90deg, transparent, transparent 50px, ${alpha(theme.palette.primary.main, 0.03)} 50px, ${alpha(theme.palette.primary.main, 0.03)} 51px)`,
    grid: `
      repeating-linear-gradient(0deg, transparent, transparent 50px, ${alpha(theme.palette.primary.main, 0.03)} 50px, ${alpha(theme.palette.primary.main, 0.03)} 51px),
      repeating-linear-gradient(90deg, transparent, transparent 50px, ${alpha(theme.palette.primary.main, 0.03)} 50px, ${alpha(theme.palette.primary.main, 0.03)} 51px)
    `,
    none: 'none',
  };
  
  return (
    <Box
      sx={{
        height,
        width: '100%',
        position: 'relative',
        backgroundImage: patterns[pattern],
        backgroundSize: pattern === 'dots' ? '20px 20px' : 'auto',
        // Fade edges
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          height: '40px',
          pointerEvents: 'none',
        },
        '&::before': {
          top: 0,
          background: `linear-gradient(180deg, ${theme.palette.background.default}, transparent)`,
        },
        '&::after': {
          bottom: 0,
          background: `linear-gradient(0deg, ${theme.palette.background.default}, transparent)`,
        },
      }}
    />
  );
};

const GalleryLayout = {
  Container: GalleryContainer,
  Grid: ExhibitionGrid,
  Row: SculptureRow,
  Wall: GalleryWall,
  Float: FloatingDisplay,
  Space: NegativeSpace,
};

export default GalleryLayout;