import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Slider,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  IconButton,
  Button,
  Chip,
  Tooltip,
  Divider,
  Stack,
  useTheme
} from '@mui/material';
import {
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  GraphicEq as GraphicEqIcon,
  Headset as HeadsetIcon,
  FlightTakeoff as FlightIcon,
  LocalFireDepartment as FireIcon,
  Diamond as DiamondIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import { soundManager, PerformanceMode, SoundCategory } from '../../services/sound/SoundManager';
import { useThemeContext } from '../../themes/ThemeContext';
import { useSound } from '../../hooks/useSound';
import { useSoundContext } from '../../contexts/SoundContext';

interface VolumeControlProps {
  category: SoundCategory;
  label: string;
  icon?: React.ReactNode;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ category, label, icon }) => {
  const [volume, setVolume] = useState(100);
  const { play } = useSound('ui-hover', { volume: volume / 100 });
  
  useEffect(() => {
    // Initialize with saved volume
    const savedVolume = localStorage.getItem(`sound-volume-${category}`);
    if (savedVolume) {
      setVolume(parseFloat(savedVolume) * 100);
    }
  }, [category]);
  
  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    const value = newValue as number;
    setVolume(value);
    soundManager.setCategoryVolume(category, value / 100);
    localStorage.setItem(`sound-volume-${category}`, String(value / 100));
    play();
  };
  
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          {label}
        </Typography>
        <Typography variant="caption" sx={{ minWidth: 40, textAlign: 'right' }}>
          {volume}%
        </Typography>
      </Box>
      <Slider
        value={volume}
        onChange={handleVolumeChange}
        min={0}
        max={100}
        sx={{
          '& .MuiSlider-rail': {
            opacity: 0.3,
            backgroundColor: '#C9B037'
          },
          '& .MuiSlider-track': {
            backgroundColor: '#C9B037'
          },
          '& .MuiSlider-thumb': {
            backgroundColor: '#C9B037',
            '&:hover': {
              boxShadow: '0 0 20px rgba(201, 176, 55, 0.5)'
            }
          }
        }}
      />
    </Box>
  );
};

const SoundSettings: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const { 
    soundEnabled, 
    setSoundEnabled, 
    masterVolume: contextMasterVolume, 
    setMasterVolume: setContextMasterVolume,
    performanceMode: contextPerformanceMode,
    setPerformanceMode: setContextPerformanceMode
  } = useSoundContext();
  
  const [testingSound, setTestingSound] = useState<string | null>(null);
  
  // Test sound hooks
  const buttonTest = useSound('ui-click-primary');
  const notificationTest = useSound('notification-success');
  const errorTest = useSound('notification-error');
  const navigationTest = useSound('navigation-forward');
  const gaugeTest = useSound('gauge-tick');
  
  useEffect(() => {
    // Update soundManager when context values change
    soundManager.setEnabled(soundEnabled);
    soundManager.setMasterVolume(contextMasterVolume);
    soundManager.setPerformanceMode(contextPerformanceMode);
  }, [soundEnabled, contextMasterVolume, contextPerformanceMode]);
  
  const handleEnabledChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSoundEnabled(event.target.checked);
  };
  
  const handleMasterVolumeChange = (_: Event, newValue: number | number[]) => {
    const value = (newValue as number) / 100;
    setContextMasterVolume(value);
  };
  
  const handlePerformanceModeChange = (event: any) => {
    setContextPerformanceMode(event.target.value as PerformanceMode);
  };
  
  const testSound = (soundId: string, playFunc: () => void) => {
    setTestingSound(soundId);
    playFunc();
    setTimeout(() => setTestingSound(null), 1000);
  };
  
  const getPerformanceModeIcon = (mode: PerformanceMode) => {
    switch (mode) {
      case 'cinema': return <GraphicEqIcon />;
      case 'office': return <HeadsetIcon />;
      case 'silent': return <VolumeOffIcon />;
      case 'asmr': return <PsychologyIcon />;
    }
  };
  
  const getThemeIcon = () => {
    if (themeMode.includes('boeing') || themeMode.includes('airbus')) return <FlightIcon />;
    if (themeMode.includes('f16') || themeMode.includes('viper')) return <FireIcon />;
    return <DiamondIcon />;
  };
  
  return (
    <Paper 
      sx={{ 
        p: 3,
        background: 'rgba(10, 10, 10, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(201, 176, 55, 0.3)',
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <GraphicEqIcon sx={{ mr: 1, color: '#C9B037' }} />
        Sound Settings
      </Typography>
      
      {/* Master Controls */}
      <Box sx={{ mb: 4 }}>
        <FormControlLabel
          control={
            <Switch
              checked={soundEnabled}
              onChange={handleEnabledChange}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#C9B037'
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#C9B037'
                }
              }}
            />
          }
          label="Enable Sound Effects"
        />
        
        <Box sx={{ mt: 3, opacity: soundEnabled ? 1 : 0.5 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Master Volume
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <VolumeOffIcon />
            <Slider
              value={contextMasterVolume * 100}
              onChange={handleMasterVolumeChange}
              disabled={!soundEnabled}
              sx={{
                '& .MuiSlider-rail': {
                  opacity: 0.3,
                  backgroundColor: '#C9B037'
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#C9B037'
                },
                '& .MuiSlider-thumb': {
                  backgroundColor: '#C9B037',
                  '&:hover': {
                    boxShadow: '0 0 20px rgba(201, 176, 55, 0.5)'
                  }
                }
              }}
            />
            <VolumeUpIcon />
            <Typography variant="caption" sx={{ minWidth: 40 }}>
              {Math.round(contextMasterVolume * 100)}%
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Performance Mode */}
      <Box sx={{ mb: 4, opacity: soundEnabled ? 1 : 0.5 }}>
        <FormControl fullWidth disabled={!soundEnabled}>
          <InputLabel>Performance Mode</InputLabel>
          <Select
            value={contextPerformanceMode}
            onChange={handlePerformanceModeChange}
            label="Performance Mode"
            startAdornment={getPerformanceModeIcon(contextPerformanceMode)}
          >
            <MenuItem value="cinema">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GraphicEqIcon />
                <Box>
                  <Typography>Cinema Mode</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Full immersion, highest quality
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            <MenuItem value="office">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HeadsetIcon />
                <Box>
                  <Typography>Office Mode</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Balanced for productivity
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            <MenuItem value="asmr">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PsychologyIcon />
                <Box>
                  <Typography>ASMR Mode</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Enhanced tactile feedback
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            <MenuItem value="silent">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VolumeOffIcon />
                <Box>
                  <Typography>Silent Mode</Typography>
                  <Typography variant="caption" color="text.secondary">
                    No sounds (saves battery)
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Category Volumes */}
      <Box sx={{ mb: 4, opacity: soundEnabled && contextPerformanceMode !== 'silent' ? 1 : 0.5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Category Volumes
        </Typography>
        <VolumeControl category="ui-primary" label="UI Primary" icon={<PlayIcon />} />
        <VolumeControl category="ui-secondary" label="UI Secondary" icon={<PlayIcon />} />
        <VolumeControl category="navigation" label="Navigation" icon={<PlayIcon />} />
        <VolumeControl category="notification" label="Notifications" icon={<PlayIcon />} />
        <VolumeControl category="gauge" label="Gauges" icon={<GraphicEqIcon />} />
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Test Sounds */}
      <Box sx={{ opacity: soundEnabled && contextPerformanceMode !== 'silent' ? 1 : 0.5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Test Sounds
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PlayIcon />}
            onClick={() => testSound('button', buttonTest.play)}
            disabled={!soundEnabled || contextPerformanceMode === 'silent'}
            sx={{
              borderColor: testingSound === 'button' ? '#C9B037' : 'rgba(255,255,255,0.2)',
              color: testingSound === 'button' ? '#C9B037' : 'inherit'
            }}
          >
            Button Click
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PlayIcon />}
            onClick={() => testSound('success', notificationTest.play)}
            disabled={!soundEnabled || contextPerformanceMode === 'silent'}
            sx={{
              borderColor: testingSound === 'success' ? '#C9B037' : 'rgba(255,255,255,0.2)',
              color: testingSound === 'success' ? '#C9B037' : 'inherit'
            }}
          >
            Success
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PlayIcon />}
            onClick={() => testSound('error', errorTest.play)}
            disabled={!soundEnabled || contextPerformanceMode === 'silent'}
            sx={{
              borderColor: testingSound === 'error' ? '#C9B037' : 'rgba(255,255,255,0.2)',
              color: testingSound === 'error' ? '#C9B037' : 'inherit'
            }}
          >
            Error
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PlayIcon />}
            onClick={() => testSound('navigation', navigationTest.play)}
            disabled={!soundEnabled || contextPerformanceMode === 'silent'}
            sx={{
              borderColor: testingSound === 'navigation' ? '#C9B037' : 'rgba(255,255,255,0.2)',
              color: testingSound === 'navigation' ? '#C9B037' : 'inherit'
            }}
          >
            Navigation
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PlayIcon />}
            onClick={() => testSound('gauge', gaugeTest.play)}
            disabled={!soundEnabled || contextPerformanceMode === 'silent'}
            sx={{
              borderColor: testingSound === 'gauge' ? '#C9B037' : 'rgba(255,255,255,0.2)',
              color: testingSound === 'gauge' ? '#C9B037' : 'inherit'
            }}
          >
            Gauge Tick
          </Button>
        </Stack>
      </Box>
      
      {/* Current Theme Info */}
      <Box sx={{ mt: 3, p: 2, background: 'rgba(201, 176, 55, 0.1)', borderRadius: 1 }}>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getThemeIcon()}
          Current Theme: <strong>{themeMode}</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Theme-specific sounds will be loaded automatically
        </Typography>
      </Box>
    </Paper>
  );
};

export default SoundSettings;