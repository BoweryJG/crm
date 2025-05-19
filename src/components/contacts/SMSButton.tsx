import React, { useState } from 'react';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Chip,
  useTheme
} from '@mui/material';
import {
  Sms as SmsIcon,
  Send as SendIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { sendSMSToContact } from '../../services/twilio/smsService';
import { useAuth } from '../../hooks/useAuth';
import { Contact } from '../../types/models';

interface SMSButtonProps {
  contact: Contact;
  onMessageSent?: () => void;
}

const SMSButton: React.FC<SMSButtonProps> = ({ contact, onMessageSent }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);

  // Maximum SMS character count (standard SMS limit)
  const MAX_CHARS = 160;

  // Handle opening the SMS dialog
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    setSent(false);
    setError(null);
  };

  // Handle closing the SMS dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setMessage('');
    setSending(false);
    setSent(false);
    setError(null);
    setCharCount(0);
  };

  // Handle sending the SMS
  const handleSendSMS = async () => {
    if (!message.trim() || !user) return;
    
    setSending(true);
    setError(null);
    
    try {
      const result = await sendSMSToContact(contact, user.id, message);
      
      if (result.success) {
        setSent(true);
        // Call the optional callback if provided
        if (onMessageSent) {
          onMessageSent();
        }
      } else {
        setError(result.error || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending SMS:', err);
      setError('An unexpected error occurred');
    } finally {
      setSending(false);
    }
  };

  // Handle message input change
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setMessage(text);
    setCharCount(text.length);
  };

  return (
    <>
      <IconButton 
        color="primary" 
        onClick={handleOpenDialog}
        aria-label="send SMS to contact"
      >
        <SmsIcon />
      </IconButton>
      
      {/* SMS Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Send SMS to {contact.first_name} {contact.last_name}
            </Typography>
            <IconButton edge="end" onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Phone: {contact.phone}
            </Typography>
            
            {sent ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Chip 
                  label="Message Sent" 
                  color="success" 
                  icon={<SendIcon />}
                  sx={{ mb: 2 }} 
                />
                <Typography variant="body1">
                  Your message has been sent successfully.
                </Typography>
              </Box>
            ) : (
              <>
                <TextField
                  label="Message"
                  multiline
                  rows={4}
                  fullWidth
                  value={message}
                  onChange={handleMessageChange}
                  placeholder="Type your message here..."
                  disabled={sending}
                  error={!!error || charCount > MAX_CHARS}
                  helperText={
                    error ? error : 
                    charCount > MAX_CHARS ? 
                      `Message too long (${charCount}/${MAX_CHARS})` : 
                      `${charCount}/${MAX_CHARS} characters`
                  }
                  sx={{ mb: 2 }}
                />
                
                {error && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {error}
                  </Typography>
                )}
              </>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {sent ? (
            <Button 
              onClick={handleCloseDialog} 
              color="primary"
              variant="contained"
            >
              Close
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleCloseDialog} 
                color="inherit"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendSMS}
                color="primary"
                variant="contained"
                startIcon={sending ? <CircularProgress size={20} /> : <SendIcon />}
                disabled={!message.trim() || sending || charCount > MAX_CHARS}
              >
                Send
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SMSButton;
