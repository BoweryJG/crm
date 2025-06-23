import React, { useState } from 'react';
import { Box, Button, Typography, Paper, List, ListItem, ListItemText, Chip, Alert } from '@mui/material';
import { useSound } from '../../hooks/useSound';
import { useSoundContext } from '../../contexts/SoundContext';

const AudioDebugger: React.FC = () => {
  const { soundEnabled, toggleSound } = useSoundContext();
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
  
  const testSound = (soundName: string) => {
    const sound = useSound(soundName);
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
  };
  
  const testAllSounds = async () => {
    for (const soundName of soundsToTest) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between sounds
      testSound(soundName);
    }
  };
  
  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Audio System Debugger</Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        Sound System: {soundEnabled ? 'ENABLED ✅' : 'DISABLED ❌'}
      </Alert>
      
      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={toggleSound}
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