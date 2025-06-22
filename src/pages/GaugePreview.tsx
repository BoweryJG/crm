import React, { useState } from 'react';
import { Box, Typography, Slider, Button, Paper } from '@mui/material';
import PanthereMeridianControlBoard from '../components/dashboard/PanthereMeridianControlBoard';

const GaugePreview: React.FC = () => {
  const [progress, setProgress] = useState(68);
  const goal = 1300000; // $1.3M goal
  const current = (goal * progress) / 100;
  
  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#0a0a0a',
      p: 4,
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Typography 
          variant="h3" 
          sx={{ 
            color: '#B87333', 
            mb: 4, 
            textAlign: 'center',
            fontFamily: "'Futura', sans-serif",
            fontWeight: 700,
            letterSpacing: 5,
            textTransform: 'uppercase',
          }}
        >
          Panthère Meridian™ Control Board
        </Typography>
        
        {/* Main gauge display */}
        <Box sx={{ mb: 6 }}>
          <PanthereMeridianControlBoard
            current={current}
            goal={goal}
            progress={progress}
            formatValue={formatCurrency}
          />
        </Box>
        
        {/* Controls */}
        <Paper sx={{ p: 4, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
            Interactive Controls
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ color: '#888', mb: 2 }}>
              Progress: {progress}% ({formatCurrency(current)} of {formatCurrency(goal)})
            </Typography>
            <Slider
              value={progress}
              onChange={(e, value) => setProgress(value as number)}
              min={0}
              max={100}
              sx={{
                color: '#d4af37',
                '& .MuiSlider-thumb': {
                  backgroundColor: 'currentColor',
                  boxShadow: '0 0 10px currentColor',
                },
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="outlined" 
              onClick={() => setProgress(0)}
              sx={{ color: '#fff', borderColor: '#333' }}
            >
              Start (0%)
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setProgress(25)}
              sx={{ color: '#fff', borderColor: '#333' }}
            >
              Quarter (25%)
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setProgress(50)}
              sx={{ color: '#fff', borderColor: '#333' }}
            >
              Halfway (50%)
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setProgress(68)}
              sx={{ color: '#00ff41', borderColor: '#00ff41' }}
            >
              Current (68%)
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setProgress(85)}
              sx={{ color: '#ffaa00', borderColor: '#ffaa00' }}
            >
              Redline (85%)
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setProgress(100)}
              sx={{ color: '#dc143c', borderColor: '#dc143c' }}
            >
              Target (100%)
            </Button>
          </Box>
          
          <Box sx={{ mt: 4, p: 3, background: 'rgba(0,0,0,0.5)', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#B87333', mb: 2, fontFamily: "'Futura', sans-serif" }}>
              Control Systems:
            </Typography>
            <Typography sx={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.8 }}>
              • Steampunk pressure gauge with octagonal Cartier bezel<br/>
              • Brass velocity tubes with golden liquid indicators<br/>
              • Steam venting system at progress milestones<br/>
              • GT500-inspired tachometer and velocity calculator<br/>
              • Spinning governor mechanisms for speed regulation<br/>
              • BOOST mode activation at 85% with warning systems<br/>
              • Panther-shaped needle with sapphire eye<br/>
              • Cartier Racing Ateliers Detroit/Paris plaque
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default GaugePreview;