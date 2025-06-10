import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Slider } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { 
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Speed as SpeedIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

interface ProgressBar {
  id: string;
  color1: string;
  color2: string;
  speed: number; // seconds to complete
  value: number; // 0-100
  label: string;
}

const progressFlow = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
`;

const TickerContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(10, 10, 10, 0.95)',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '12px 20px',
  position: 'relative',
  backdropFilter: 'blur(10px)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
    animation: `${progressFlow} 3s linear infinite`
  }
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 12,
  paddingBottom: 8,
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
}));

const ProgressBarsContainer = styled(Box)<{ visible: boolean }>(({ visible }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  maxHeight: visible ? 300 : 0,
  overflow: 'hidden',
  transition: 'max-height 0.5s ease',
  opacity: visible ? 1 : 0
}));

const ProgressBarWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: 12
}));

const ProgressBarTrack = styled(Box)(({ theme }) => ({
  flex: 1,
  height: 24,
  borderRadius: 12,
  background: 'rgba(255, 255, 255, 0.05)',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
}));

const ProgressBarFill = styled(Box)<{ 
  gradient: string; 
  duration: number;
  playing: boolean;
}>(({ gradient, duration, playing }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  background: gradient,
  backgroundSize: '200% 100%',
  borderRadius: 12,
  animation: playing ? `${progressFlow} ${duration}s linear infinite` : 'none',
  animationPlayState: playing ? 'running' : 'paused',
  boxShadow: '0 0 20px rgba(0,0,0,0.3)',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
    borderRadius: 12
  }
}));

const ProgressLabel = styled(Typography)(({ theme }) => ({
  minWidth: 120,
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.05em',
  color: 'rgba(255, 255, 255, 0.7)',
  fontFamily: '"Inter", sans-serif'
}));

const ProgressValue = styled(Typography)(({ theme }) => ({
  minWidth: 50,
  fontSize: '0.8rem',
  fontWeight: 700,
  color: '#ffffff',
  fontFamily: '"Inter", sans-serif',
  textAlign: 'right'
}));

const SpeedControl = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '4px 12px',
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: 20,
  minWidth: 150
}));

const defaultBars: ProgressBar[] = [
  {
    id: '1',
    color1: '#9D4EDD',
    color2: '#5A189A',
    speed: 8,
    value: 0,
    label: 'NEURAL SYNC'
  },
  {
    id: '2',
    color1: '#FF006E',
    color2: '#C9184A',
    speed: 12,
    value: 0,
    label: 'QUANTUM FLOW'
  },
  {
    id: '3',
    color1: '#06FFA5',
    color2: '#00B871',
    speed: 10,
    value: 0,
    label: 'DATA STREAM'
  },
  {
    id: '4',
    color1: '#FFB700',
    color2: '#FF6B00',
    speed: 15,
    value: 0,
    label: 'ENERGY PULSE'
  },
  {
    id: '5',
    color1: '#00B4D8',
    color2: '#0077B6',
    speed: 9,
    value: 0,
    label: 'WAVE PATTERN'
  }
];

const MultiColorProgressTicker: React.FC = () => {
  const [bars, setBars] = useState<ProgressBar[]>(defaultBars);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(true);
  const [globalSpeed, setGlobalSpeed] = useState(1);

  useEffect(() => {
    if (!playing) return;

    const interval = setInterval(() => {
      setBars(prevBars => 
        prevBars.map(bar => ({
          ...bar,
          value: (bar.value + (100 / (bar.speed * 10)) * globalSpeed) % 100
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, [playing, globalSpeed]);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVisibilityToggle = () => {
    setVisible(!visible);
  };

  const handleSpeedChange = (event: Event, newValue: number | number[]) => {
    setGlobalSpeed(newValue as number);
  };

  return (
    <TickerContainer>
      <ControlsContainer>
        <IconButton 
          onClick={handlePlayPause}
          size="small"
          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
        
        <IconButton 
          onClick={handleVisibilityToggle}
          size="small"
          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          {visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>

        <SpeedControl>
          <SpeedIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }} />
          <Slider
            value={globalSpeed}
            onChange={handleSpeedChange}
            min={0.1}
            max={3}
            step={0.1}
            size="small"
            sx={{
              color: '#06FFA5',
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12
              }
            }}
          />
          <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', minWidth: 30 }}>
            {globalSpeed.toFixed(1)}x
          </Typography>
        </SpeedControl>

        <Typography sx={{ 
          ml: 'auto', 
          fontSize: '0.75rem', 
          color: 'rgba(255, 255, 255, 0.5)',
          fontWeight: 600,
          letterSpacing: '0.1em'
        }}>
          SYSTEM METRICS
        </Typography>
      </ControlsContainer>

      <ProgressBarsContainer visible={visible}>
        {bars.map((bar) => (
          <ProgressBarWrapper key={bar.id}>
            <ProgressLabel>{bar.label}</ProgressLabel>
            <ProgressBarTrack>
              <ProgressBarFill
                gradient={`linear-gradient(90deg, ${bar.color1} 0%, ${bar.color2} 50%, ${bar.color1} 100%)`}
                duration={bar.speed / globalSpeed}
                playing={playing}
                sx={{
                  transform: `scaleX(${bar.value / 100})`,
                  transformOrigin: 'left center',
                  transition: 'transform 0.1s linear'
                }}
              />
            </ProgressBarTrack>
            <ProgressValue>{Math.round(bar.value)}%</ProgressValue>
          </ProgressBarWrapper>
        ))}
      </ProgressBarsContainer>
    </TickerContainer>
  );
};

export default MultiColorProgressTicker;