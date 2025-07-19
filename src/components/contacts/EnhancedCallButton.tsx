import React, { useState } from 'react';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Phone as PhoneIcon,
  CallEnd as CallEndIcon,
  MicOff as MicOffIcon,
  Mic as MicIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Lock as LockIcon,
  Upgrade as UpgradeIcon
} from '@mui/icons-material';
import { callContact, updateCallStatus } from '../../services/twilio/twilioService';
import { useAuth } from '../../auth';
import { Contact } from '../../types/models';
import { useButtonSound, useNotificationSound } from '../../hooks/useSound';
import { useAppMode } from '../../contexts/AppModeContext';
import { useSubscription } from '../../hooks/useSubscription';
import RepxFeatureGuard from '../common/RepxFeatureGuard';
import { Link } from 'react-router-dom';

interface EnhancedCallButtonProps {
  contact: Contact;
}

const EnhancedCallButton: React.FC<EnhancedCallButtonProps> = ({ contact }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const { repxTier, hasRepxAccess, getRepxFeatureLimits } = useAppMode();
  const { usage, trackUsage, validateAccess } = useSubscription();
  const buttonSound = useButtonSound('primary');
  const notificationSound = useNotificationSound();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [callState, setCallState] = useState<'idle' | 'connecting' | 'in-progress' | 'completed' | 'failed' | 'blocked'>('idle');
  const [callSid, setCallSid] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [notes, setNotes] = useState('');
  const [outcome, setOutcome] = useState<'successful' | 'unsuccessful' | 'follow_up_required' | 'no_decision'>('successful');
  const [nextSteps, setNextSteps] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [durationInterval, setDurationInterval] = useState<NodeJS.Timeout | null>(null);
  const [blockReason, setBlockReason] = useState<string>('');

  // Check if user has access to calling feature
  const hasCallAccess = hasRepxAccess('calls');
  const limits = getRepxFeatureLimits();
  const currentCallUsage = usage?.calls || 0;

  // Function to format seconds into MM:SS format
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Function to handle initiating a call with Rep^x validation
  const handleCall = async () => {
    // Check Rep^x access first
    if (!hasCallAccess) {
      setBlockReason('Calling feature requires Rep^x subscription');
      setCallState('blocked');
      setIsDialogOpen(true);
      return;
    }

    // Check usage limits
    const hasUsageAccess = await validateAccess('calls');
    if (!hasUsageAccess) {
      setBlockReason(`You've reached your calling limit. Current usage: ${currentCallUsage}${limits ? `/${limits.calls}` : ''}`);
      setCallState('blocked');
      setIsDialogOpen(true);
      return;
    }

    setIsDialogOpen(true);
    setCallState('connecting');
    
    try {
      // Make the call using Twilio
      const userId = user?.id || 'anonymous';
      const result = await callContact(contact, userId);
      
      if (result.success && result.callSid) {
        setCallSid(result.callSid);
        setCallState('in-progress');
        notificationSound.success();
        
        // Track usage in Rep^x
        await trackUsage('calls', 1);
        
        // Start tracking call duration
        const interval = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
        
        setDurationInterval(interval);
      } else {
        setCallState('failed');
        notificationSound.error();
      }
    } catch (error) {
      console.error('Error initiating call:', error);
      setCallState('failed');
    }
  };

  // Function to handle ending a call
  const handleEndCall = async () => {
    if (callSid) {
      try {
        // Update call status in Supabase
        await updateCallStatus({
          callSid,
          status: 'completed',
          duration: callDuration
        });
        
        // Clear the duration interval
        if (durationInterval) {
          clearInterval(durationInterval);
          setDurationInterval(null);
        }
        
        setCallState('completed');
      } catch (error) {
        console.error('Error ending call:', error);
      }
    }
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    // If call is still in progress, end it first
    if (callState === 'in-progress' && callSid) {
      handleEndCall();
    }
    
    // Reset all states
    setIsDialogOpen(false);
    setCallState('idle');
    setCallSid(null);
    setCallDuration(0);
    setNotes('');
    setOutcome('successful');
    setNextSteps('');
    setIsMuted(false);
    setIsSpeakerOn(true);
    setBlockReason('');
    
    if (durationInterval) {
      clearInterval(durationInterval);
      setDurationInterval(null);
    }
  };

  // Function to toggle mute
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, this would interact with the actual call
  };

  // Function to toggle speaker
  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // In a real implementation, this would interact with the actual call
  };

  // Render call button with Rep^x integration
  return (
    <>
      <RepxFeatureGuard
        feature="calls"
        showUpgradePrompt={false}
        fallback={
          <IconButton 
            color="default" 
            aria-label="call contact - requires subscription"
            disabled
            sx={{ opacity: 0.5 }}
          >
            <LockIcon />
          </IconButton>
        }
      >
        <IconButton 
          color="primary" 
          aria-label="call contact"
          {...buttonSound.handlers}
          onClick={handleCall}
          sx={{ 
            position: 'relative',
            ...(limits?.calls !== 'unlimited' && currentCallUsage >= (limits?.calls || 0) * 0.8 && {
              '&::after': {
                content: '""',
                position: 'absolute',
                top: -2,
                right: -2,
                width: 8,
                height: 8,
                backgroundColor: currentCallUsage >= (limits?.calls || 0) ? 'error.main' : 'warning.main',
                borderRadius: '50%',
                border: '1px solid white'
              }
            })
          }}
        >
          <PhoneIcon />
        </IconButton>
      </RepxFeatureGuard>
      
      {/* Call Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={callState !== 'in-progress' ? handleCloseDialog : undefined}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {callState === 'connecting' && 'Connecting...'}
          {callState === 'in-progress' && 'Call in Progress'}
          {callState === 'completed' && 'Call Completed'}
          {callState === 'failed' && 'Call Failed'}
          {callState === 'blocked' && (
            <>
              <LockIcon color="error" />
              Feature Blocked
            </>
          )}
          
          {repxTier && callState !== 'blocked' && (
            <Chip 
              label={repxTier.toUpperCase()} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          )}
        </DialogTitle>
        
        <DialogContent>
          {/* Blocked state */}
          {callState === 'blocked' && (
            <Box sx={{ my: 2 }}>
              <Alert severity="error">
                <AlertTitle>Access Restricted</AlertTitle>
                <Typography variant="body2" paragraph>
                  {blockReason}
                </Typography>
                
                {!repxTier ? (
                  <Typography variant="body2" paragraph>
                    Get Rep^x to access professional calling features.
                  </Typography>
                ) : (
                  <Typography variant="body2" paragraph>
                    Upgrade your Rep^x plan for higher limits.
                  </Typography>
                )}
                
                <Box sx={{ mt: 2 }}>
                  <Button
                    component={Link}
                    to="/subscribe"
                    variant="contained"
                    startIcon={<UpgradeIcon />}
                    size="small"
                  >
                    {repxTier ? 'Upgrade Plan' : 'Get Rep^x'}
                  </Button>
                </Box>
              </Alert>
            </Box>
          )}

          {/* Normal call interface */}
          {callState !== 'blocked' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
              {/* Contact info */}
              <Typography variant="h6">
                {contact.first_name} {contact.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {contact.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Practice ID: {contact.practice_id}
              </Typography>
              
              {/* Rep^x usage info */}
              {limits && callState === 'connecting' && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Rep^x Usage: {currentCallUsage + 1} / {limits.calls === 'unlimited' ? '∞' : limits.calls} calls
                  </Typography>
                </Box>
              )}
              
              {/* Call status */}
              <Box sx={{ mt: 3, mb: 2 }}>
                {callState === 'connecting' && (
                  <CircularProgress size={60} />
                )}
                
                {callState === 'in-progress' && (
                  <>
                    <Chip 
                      label="Call in progress" 
                      color="success" 
                      sx={{ mb: 2 }} 
                    />
                    <Typography variant="h4" sx={{ fontFamily: 'monospace' }}>
                      {formatDuration(callDuration)}
                    </Typography>
                  </>
                )}
                
                {callState === 'completed' && (
                  <>
                    <Chip 
                      label="Call ended" 
                      color="default" 
                      sx={{ mb: 2 }} 
                    />
                    <Typography variant="body1">
                      Duration: {formatDuration(callDuration)}
                    </Typography>
                  </>
                )}
                
                {callState === 'failed' && (
                  <Chip 
                    label="Call failed" 
                    color="error" 
                    sx={{ mb: 2 }} 
                  />
                )}
              </Box>
              
              {/* Call controls - only show during active call */}
              {callState === 'in-progress' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, my: 2 }}>
                  <IconButton 
                    onClick={handleToggleMute}
                    color={isMuted ? 'default' : 'primary'}
                    sx={{ 
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: '50%',
                      p: 1
                    }}
                  >
                    {isMuted ? <MicOffIcon /> : <MicIcon />}
                  </IconButton>
                  
                  <IconButton 
                    onClick={handleEndCall}
                    color="error"
                    sx={{ 
                      border: `1px solid ${theme.palette.error.main}`,
                      borderRadius: '50%',
                      p: 1
                    }}
                  >
                    <CallEndIcon />
                  </IconButton>
                  
                  <IconButton 
                    onClick={handleToggleSpeaker}
                    color={isSpeakerOn ? 'primary' : 'default'}
                    sx={{ 
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: '50%',
                      p: 1
                    }}
                  >
                    {isSpeakerOn ? <VolumeUpIcon /> : <VolumeOffIcon />}
                  </IconButton>
                </Box>
              )}
            </Box>
          )}
          
          {/* Call notes and outcome - show when call is completed */}
          {(callState === 'completed' || callState === 'failed') && (
            <Box sx={{ mt: 3 }}>
              <TextField
                label="Call Notes"
                multiline
                rows={4}
                fullWidth
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                margin="normal"
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel id="call-outcome-label">Call Outcome</InputLabel>
                <Select
                  labelId="call-outcome-label"
                  value={outcome}
                  label="Call Outcome"
                  onChange={(e) => setOutcome(e.target.value as any)}
                >
                  <MenuItem value="successful">Successful</MenuItem>
                  <MenuItem value="unsuccessful">Unsuccessful</MenuItem>
                  <MenuItem value="follow_up_required">Follow-up Required</MenuItem>
                  <MenuItem value="no_decision">No Decision</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Next Steps"
                fullWidth
                value={nextSteps}
                onChange={(e) => setNextSteps(e.target.value)}
                margin="normal"
              />
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          {callState === 'in-progress' ? (
            <Button 
              onClick={handleEndCall} 
              color="error" 
              variant="contained"
              startIcon={<CallEndIcon />}
            >
              End Call
            </Button>
          ) : (
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EnhancedCallButton;