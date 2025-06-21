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
    // Play test sound
    play();
  };
  
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {icon && <Box sx={{ mr: 1 }}>{icon}</Box>}
        <Typography variant="subtitle2" sx={{ flex: 1 }}>
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
  const [enabled, setEnabled] = useState(true);
  const [masterVolume, setMasterVolume] = useState(70);
  const [performanceMode, setPerformanceMode] = useState<PerformanceMode>('office');
  const [testingSound, setTestingSound] = useState<string | null>(null);
  
  // Test sound hooks
  const buttonTest = useSound('ui-click-primary');
  const notificationTest = useSound('notification-success');
  const errorTest = useSound('notification-error');
  const navigationTest = useSound('navigation-forward');
  const gaugeTest = useSound('gauge-tick');
  
  useEffect(() => {
    // Load saved preferences
    const savedEnabled = localStorage.getItem('sound-enabled');
    const savedMaster = localStorage.getItem('sound-master-volume');
    const savedMode = localStorage.getItem('sound-performance-mode');
    
    if (savedEnabled !== null) setEnabled(savedEnabled === 'true');
    if (savedMaster !== null) setMasterVolume(parseFloat(savedMaster) * 100);
    if (savedMode !== null) setPerformanceMode(savedMode as PerformanceMode);
  }, []);
  
  const handleEnabledChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    setEnabled(value);
    soundManager.setEnabled(value);
  };
  
  const handleMasterVolumeChange = (_: Event, newValue: number | number[]) => {
    const value = newValue as number;
    setMasterVolume(value);
    soundManager.setMasterVolume(value / 100);
  };
  
  const handlePerformanceModeChange = (event: any) => {
    const mode = event.target.value as PerformanceMode;
    setPerformanceMode(mode);
    soundManager.setPerformanceMode(mode);
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
    if (themeMode === 'boeing-747') return <FlightIcon />;
    if (themeMode === 'f16-viper') return <FireIcon />;
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
              checked={enabled}
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
        
        <Box sx={{ mt: 3, opacity: enabled ? 1 : 0.5 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Master Volume
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <VolumeOffIcon />
            <Slider
              value={masterVolume}
              onChange={handleMasterVolumeChange}
              disabled={!enabled}
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
              {masterVolume}%
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Performance Mode */}
      <Box sx={{ mb: 4, opacity: enabled ? 1 : 0.5 }}>
        <FormControl fullWidth disabled={!enabled}>
          <InputLabel>Performance Mode</InputLabel>
          <Select
            value={performanceMode}
            onChange={handlePerformanceModeChange}
            label="Performance Mode"
            startAdornment={getPerformanceModeIcon(performanceMode)}
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
      
      {/* Category Volume Controls */}
      <Box sx={{ mb: 4, opacity: enabled ? 1 : 0.5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Category Volumes
        </Typography>
        
        <VolumeControl category="ui-primary" label="Primary Actions" />
        <VolumeControl category="ui-secondary" label="Secondary Actions" />
        <VolumeControl category="navigation" label="Navigation" />
        <VolumeControl category="notification" label="Notifications" />
        <VolumeControl category="gauge" label="Gauge Sounds" />
        <VolumeControl category="ambient" label="Ambient Sounds" />
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Sound Theme */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          {getThemeIcon()}
          <Box sx={{ ml: 1 }}>Current Theme: {themeMode}</Box>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Sound effects automatically match your selected visual theme
        </Typography>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Test Sounds */}
      <Box sx={{ opacity: enabled ? 1 : 0.5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Test Sounds
        </Typography>
        
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            label="Button Click"
            onClick={() => testSound('button', buttonTest.play)}
            icon={testingSound === 'button' ? <PlayIcon /> : undefined}
            variant={testingSound === 'button' ? 'filled' : 'outlined'}
            disabled={!enabled}
          />
          <Chip
            label="Success"
            onClick={() => testSound('success', notificationTest.play)}
            icon={testingSound === 'success' ? <PlayIcon /> : undefined}
            variant={testingSound === 'success' ? 'filled' : 'outlined'}
            disabled={!enabled}
          />
          <Chip
            label="Error"
            onClick={() => testSound('error', errorTest.play)}
            icon={testingSound === 'error' ? <PlayIcon /> : undefined}
            variant={testingSound === 'error' ? 'filled' : 'outlined'}
            disabled={!enabled}
          />
          <Chip
            label="Navigation"
            onClick={() => testSound('nav', navigationTest.play)}
            icon={testingSound === 'nav' ? <PlayIcon /> : undefined}
            variant={testingSound === 'nav' ? 'filled' : 'outlined'}
            disabled={!enabled}
          />
          <Chip
            label="Gauge Tick"
            onClick={() => testSound('gauge', gaugeTest.play)}
            icon={testingSound === 'gauge' ? <PlayIcon /> : undefined}
            variant={testingSound === 'gauge' ? 'filled' : 'outlined'}
            disabled={!enabled}
          />
        </Stack>
      </Box>
    </Paper>
  );
};

export default SoundSettings;