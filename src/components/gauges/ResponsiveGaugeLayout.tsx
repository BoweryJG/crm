// Responsive Gauge Layout Component
// Handles proper gauge display across all screen sizes with no overlap

import React from 'react';
import {
  Box,
  useTheme,
  useMediaQuery,
  Typography,
  styled,
} from '@mui/material';

interface ResponsiveGaugeLayoutProps {
  children: React.ReactNode[];
  title?: string;
  sidebarWidth?: number;
}

const GaugeTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Orbitron", monospace',
  fontSize: '1.5rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: '#C9B037',
  textAlign: 'center',
  marginBottom: theme.spacing(3),
  textTransform: 'uppercase',
  textShadow: '0 0 20px rgba(201, 176, 55, 0.5)',
}));

export const ResponsiveGaugeLayout: React.FC<ResponsiveGaugeLayoutProps> = ({
  children,
  title,
  sidebarWidth = 280,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.down('md')); // < 900px
  const isDesktop = useMediaQuery(theme.breakpoints.down('lg')); // < 1200px
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg')); // >= 1200px

  // Determine how many gauges to show based on screen size
  const getVisibleGauges = () => {
    if (isMobile) return 1; // Only show 1 gauge on mobile
    if (isTablet) return 2; // Show 2 gauges on tablet
    if (isDesktop) return 3; // Show 3 gauges on desktop
    return children.length; // Show all gauges on large desktop
  };

  const visibleCount = getVisibleGauges();
  const visibleChildren = children.slice(0, visibleCount);

  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 2, sm: 3 },
        // Account for sidebar on desktop
        ml: { xs: 0, md: `${sidebarWidth}px` },
        transition: 'margin-left 0.3s ease',
      }}
    >
      {title && <GaugeTitle>{title}</GaugeTitle>}
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr', // 1 column on mobile
            sm: 'repeat(2, 1fr)', // 2 columns on tablet
            md: 'repeat(3, 1fr)', // 3 columns on desktop
            lg: `repeat(${children.length}, 1fr)`, // All columns on large desktop
          },
          gap: { xs: 2, sm: 3, md: 4 },
          justifyItems: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: {
            xs: '100%',
            sm: '640px',
            md: '960px',
            lg: '1200px',
            xl: '1400px',
          },
          mx: 'auto',
        }}
      >
        {visibleChildren.map((child, index) => (
          <Box
            key={index}
            sx={{
              width: '100%',
              maxWidth: {
                xs: '280px', // Smaller on mobile
                sm: '300px', // Medium on tablet
                md: '320px', // Larger on desktop
              },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              // Fade in animation
              opacity: 0,
              animation: 'fadeIn 0.5s ease forwards',
              animationDelay: `${index * 0.1}s`,
              '@keyframes fadeIn': {
                to: {
                  opacity: 1,
                },
              },
            }}
          >
            {child}
          </Box>
        ))}
      </Box>

      {/* Indicator showing more gauges available */}
      {children.length > visibleCount && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: 2,
            color: 'text.secondary',
            letterSpacing: '0.1em',
          }}
        >
          {children.length - visibleCount} MORE GAUGE{children.length - visibleCount > 1 ? 'S' : ''} AVAILABLE ON LARGER SCREEN
        </Typography>
      )}
    </Box>
  );
};