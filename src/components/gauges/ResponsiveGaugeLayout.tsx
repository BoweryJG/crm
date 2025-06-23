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
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = React.useState(children.length);

  // Calculate how many gauges can fit without cutoff
  React.useEffect(() => {
    const calculateVisibleGauges = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const gaugeMinWidth = 250; // Minimum width for a gauge
      const gaugeMaxWidth = 280; // Maximum width for a gauge
      const gap = 32; // Gap between gauges (2rem)
      
      // Account for padding
      const padding = window.innerWidth < 600 ? 16 : window.innerWidth < 900 ? 32 : 48;
      const availableWidth = containerWidth - (padding * 2);
      
      // Calculate how many gauges can fit
      let gaugesPerRow = 1;
      
      // Try to fit as many gauges as possible
      for (let i = children.length; i >= 1; i--) {
        const totalGaugeWidth = i * gaugeMinWidth;
        const totalGapWidth = (i - 1) * gap;
        const totalWidth = totalGaugeWidth + totalGapWidth;
        
        if (totalWidth <= availableWidth) {
          gaugesPerRow = i;
          break;
        }
      }
      
      // Only show complete rows
      setVisibleCount(gaugesPerRow);
    };

    // Initial calculation
    calculateVisibleGauges();
    
    // Recalculate on resize with debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateVisibleGauges, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [children.length]);

  const visibleChildren = children.slice(0, visibleCount);

  return (
    <Box
      ref={containerRef}
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
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {visibleChildren.map((child, index) => (
          <Box
            key={index}
            sx={{
              flex: '1 0 22%', // Allow 4 per row max, can wrap
              minWidth: '250px', // Minimum size before wrapping
              maxWidth: '280px',
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