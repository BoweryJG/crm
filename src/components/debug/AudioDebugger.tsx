import React, { useState, useCallback, useMemo } from 'react';
import { Box, Button, Typography, Paper, List, ListItem, ListItemText, Chip, Alert } from '@mui/material';
import { useSound } from '../../hooks/useSound';
import { useSoundContext } from '../../contexts/SoundContext';

const AudioDebugger: React.FC = () => {
  const { soundEnabled, setSoundEnabled } = useSoundContext();
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error' | 'pending'>>({});
  
  const soundsToTest = [
    'ui-click-primary',
    'ui-click-secondary',
    'ui-hover',
    'ui-toggle',
    'notification-success',
    'notification-error',
    'navigation-forward',
    'navigation-back',
    'gauge-tick',
  ];
  
  // Pre-load all sounds at component level
  const uiClickPrimary = useSound('ui-click-primary');
  const uiClickSecondary = useSound('ui-click-secondary');
  const uiHover = useSound('ui-hover');
  const uiToggle = useSound('ui-toggle');
  const notificationSuccess = useSound('notification-success');
  const notificationError = useSound('notification-error');
  const navigationForward = useSound('navigation-forward');
  const navigationBack = useSound('navigation-back');
  const gaugeTick = useSound('gauge-tick');
  
  const sounds = useMemo(() => ({
    'ui-click-primary': uiClickPrimary,
    'ui-click-secondary': uiClickSecondary,
    'ui-hover': uiHover,
    'ui-toggle': uiToggle,
    'notification-success': notificationSuccess,
    'notification-error': notificationError,
    'navigation-forward': navigationForward,
    'navigation-back': navigationBack,
    'gauge-tick': gaugeTick,
  }), [uiClickPrimary, uiClickSecondary, uiHover, uiToggle, notificationSuccess, notificationError, navigationForward, navigationBack, gaugeTick]);
  
  const testSound = useCallback((soundName: string) => {
    const sound = sounds[soundName as keyof typeof sounds];
    if (!sound) {
      console.error(`Sound ${soundName} not found`);
      setTestResults(prev => ({ ...prev, [soundName]: 'error' }));
      return;
    }
    
    setTestResults(prev => ({ ...prev, [soundName]: 'pending' }));
    
    try {
      sound.play()
        .then(() => {
          setTestResults(prev => ({ ...prev, [soundName]: 'success' }));
        })
        .catch((error) => {
          console.error(`Error playing ${soundName}:`, error);
          setTestResults(prev => ({ ...prev, [soundName]: 'error' }));
        });
    } catch (error) {
      console.error(`Error with ${soundName}:`, error);
      setTestResults(prev => ({ ...prev, [soundName]: 'error' }));
    }
  }, [sounds]);
  
  const testAllSounds = useCallback(async () => {
    for (const soundName of soundsToTest) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between sounds
      testSound(soundName);
    }
  }, [testSound, soundsToTest]);
  
  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Audio System Debugger</Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        Sound System: {soundEnabled ? 'ENABLED ✅' : 'DISABLED ❌'}
      </Alert>
      
      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={() => setSoundEnabled(!soundEnabled)}
          sx={{ mr: 2 }}
        >
          {soundEnabled ? 'Disable' : 'Enable'} Sounds
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={testAllSounds}
          disabled={!soundEnabled}
        >
          Test All Sounds
        </Button>
      </Box>
      
      <Typography variant="h6" sx={{ mb: 1 }}>Sound Files Test:</Typography>
      <List>
        {soundsToTest.map(soundName => (
          <ListItem key={soundName} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText primary={soundName} />
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {testResults[soundName] && (
                <Chip 
                  label={testResults[soundName]} 
                  color={
                    testResults[soundName] === 'success' ? 'success' : 
                    testResults[soundName] === 'error' ? 'error' : 
                    'default'
                  }
                  size="small"
                />
              )}
              <Button 
                size="small" 
                onClick={() => testSound(soundName)}
                disabled={!soundEnabled}
              >
                Test
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
      
      <Alert severity="warning" sx={{ mt: 2 }}>
        If sounds are failing, check the browser console for detailed error messages.
        The "EncodingError: Unable to decode audio data" typically means the audio file is corrupted or in an unsupported format.
      </Alert>
    </Paper>
  );
};

export default AudioDebugger;