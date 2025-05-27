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
      {/*
        Place the animated orbs to the right of the title. The wrapper
        stretches the height of the hero section so the orbs can be
        vertically centred between the bottom of the menu bar (the top of
        this container) and the hero title. Using flexbox keeps the orb
        group aligned to the right while allowing the hero text to remain
        on the left.
      */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          pointerEvents: 'none',
          pr: { xs: 2, md: 4 }
        }}
      >
        <AnimatedOrbHeroBG
          sx={{
            width: { xs: 160, sm: 200, md: 240 },
            height: { xs: 160, sm: 200, md: 240 }
          }}
        />
      </Box>
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
