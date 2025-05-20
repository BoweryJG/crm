import React from 'react';
import { Box, Typography } from '@mui/material';
import { useThemeContext } from '../../themes/ThemeContext';
import AnimatedOrbHeroBG from '../dashboard/AnimatedOrbHeroBG';

const ResearchHero: React.FC = () => {
  const { themeMode } = useThemeContext();

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        mb: 4,
        p: { xs: 4, md: 6 },
        backgroundColor:
          themeMode === 'space'
            ? 'rgba(22, 27, 44, 0.7)'
            : 'rgba(245, 247, 250, 0.7)',
      }}
    >
      <AnimatedOrbHeroBG
        sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Research Module
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Streamline your market research with AI-assisted tools
        </Typography>
      </Box>
    </Box>
  );
};

export default ResearchHero;
