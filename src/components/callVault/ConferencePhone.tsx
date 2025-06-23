// Conference Phone Component - Retro UI Design
import React from 'react';
import { Box, IconButton, Typography, Stack } from '@mui/material';
import {
  Phone as PhoneIcon,
  CallEnd as CallEndIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as MuteIcon,
  Dialpad as DialpadIcon,
  Pause as HoldIcon,
  PlayArrow as ResumeIcon,
  KeyboardVoice as RecordIcon
} from '@mui/icons-material';

interface ConferencePhoneProps {
  isConnected: boolean;
  isMuted: boolean;
  isOnHold: boolean;
  isRecording: boolean;
  volume: number;
  callDuration: number;
  callerInfo?: {
    name: string;
    number: string;
    company?: string;
  };
  onCall: () => void;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleHold: () => void;
  onToggleDialpad: () => void;
  onVolumeChange: (volume: number) => void;
}

const ConferencePhone: React.FC<ConferencePhoneProps> = ({
  isConnected,
  isMuted,
  isOnHold,
  isRecording,
  volume,
  callDuration,
  callerInfo,
  onCall,
  onEndCall,
  onToggleMute,
  onToggleHold,
  onToggleDialpad,
  onVolumeChange
}) => {
  // Format duration to MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // LED positions around the speaker (12 LEDs like clock positions)
  const ledPositions = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const radius = 140;
    return {
      top: `${50 + Math.sin(angle) * radius}px`,
      left: `${50 + Math.cos(angle) * radius}px`
    };
  });

  return (
    <Box className="conference-phone">
      {/* LCD Display */}
      <Box className="lcd-display">
        <Box>
          <Typography className="lcd-text">
            {isConnected ? formatDuration(callDuration) : '00:00'}
          </Typography>
          <Typography className="lcd-status">
            {isConnected ? (isOnHold ? 'ON HOLD' : 'CONNECTED') : 'READY'}
          </Typography>
        </Box>
        {callerInfo && (
          <Box sx={{ textAlign: 'right' }}>
            <Typography className="lcd-text" sx={{ fontSize: '16px !important' }}>
              {callerInfo.name}
            </Typography>
            <Typography className="lcd-status">
              {callerInfo.number}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Speaker Grille with LED Ring */}
      <Box className="speaker-grille">
        <Box className="led-ring">
          {ledPositions.map((pos, i) => (
            <Box
              key={i}
              className={`led-indicator ${isConnected && !isOnHold ? 'active' : ''}`}
              sx={{
                top: pos.top,
                left: pos.left,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </Box>
        <Box className="speaker-mesh">
          {/* Central Call Timer Display */}
          {isConnected && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}
            >
              <Typography className="call-timer">
                {formatDuration(callDuration)}
              </Typography>
              {isRecording && (
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                  <RecordIcon sx={{ color: '#ff3b30', fontSize: 20 }} />
                  <Typography sx={{ color: '#ff3b30', fontSize: 12 }}>
                    RECORDING
                  </Typography>
                </Stack>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Control Buttons */}
      <Box className="button-grid">
        {/* Main Call Button */}
        <button
          className={`phone-button ${isConnected ? 'danger' : 'primary'}`}
          onClick={isConnected ? onEndCall : onCall}
          style={{ gridColumn: 'span 3' }}
        >
          {isConnected ? (
            <>
              <CallEndIcon sx={{ mr: 1 }} />
              END CALL
            </>
          ) : (
            <>
              <PhoneIcon sx={{ mr: 1 }} />
              CALL
            </>
          )}
        </button>

        {/* Secondary Controls */}
        <button
          className="phone-button"
          onClick={onToggleMute}
          disabled={!isConnected}
        >
          {isMuted ? <MicOffIcon /> : <MicIcon />}
        </button>

        <button
          className="phone-button"
          onClick={onToggleHold}
          disabled={!isConnected}
        >
          {isOnHold ? <ResumeIcon /> : <HoldIcon />}
        </button>

        <button
          className="phone-button"
          onClick={onToggleDialpad}
          disabled={!isConnected}
        >
          <DialpadIcon />
        </button>
      </Box>

      {/* Volume Control */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ mt: 3, justifyContent: 'center' }}
      >
        <MuteIcon sx={{ color: '#666' }} />
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
        />
        <VolumeIcon sx={{ color: '#666' }} />
      </Stack>
    </Box>
  );
};

export default ConferencePhone;