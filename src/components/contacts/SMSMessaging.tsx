import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  CircularProgress,
  IconButton,
  Tooltip,
  Avatar,
  useTheme
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  Sms as SmsIcon
} from '@mui/icons-material';
import { fetchSMSHistory, sendSMSToContact, SMSHistoryItem } from '../../services/twilio/smsService';
import { useAuth } from '../../auth/AuthContext';
import { Contact } from '../../types/models';
import { formatDistanceToNow } from 'date-fns';

interface SMSMessagingProps {
  contact: Contact;
}

const SMSMessaging: React.FC<SMSMessagingProps> = ({ contact }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState<SMSHistoryItem[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load SMS history
  useEffect(() => {
    const loadSMSHistory = async () => {
      try {
        setLoading(true);
        const { data, error } = await fetchSMSHistory(contact.id);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Sort messages by date (oldest first)
          const sortedMessages = [...data].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          setMessages(sortedMessages);
        }
      } catch (err) {
        console.error('Error loading SMS history:', err);
        setError('Failed to load message history');
      } finally {
        setLoading(false);
      }
    };

    if (contact.id) {
      loadSMSHistory();
    }
  }, [contact.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    
    setSending(true);
    try {
      const result = await sendSMSToContact(contact, user.id, newMessage);
      
      if (result.success) {
        // Add the new message to the list (optimistic update)
        const newSMS: SMSHistoryItem = {
          id: Date.now().toString(), // Temporary ID
          contact_id: contact.id,
          practice_id: contact.practice_id || 'unknown',
          user_id: user.id,
          type: 'sms',
          date: new Date().toISOString(),
          message_sid: result.messageSid || '',
          message_status: 'sent',
          message_body: newMessage,
          message_direction: 'outbound',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, newSMS]);
        setNewMessage('');
      } else {
        setError(`Failed to send message: ${result.error}`);
      }
    } catch (err) {
      console.error('Error sending SMS:', err);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Handle pressing Enter to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, bgcolor: theme.palette.primary.main, color: 'white' }}>
        <Typography variant="h6">
          Messages with {contact.first_name} {contact.last_name}
        </Typography>
        <Typography variant="body2">
          {contact.phone}
        </Typography>
      </Box>
      
      <Divider />
      
      {/* Messages area */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          bgcolor: theme.palette.background.default
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={40} />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            opacity: 0.7
          }}>
            <SmsIcon sx={{ fontSize: 48, mb: 2, color: theme.palette.text.secondary }} />
            <Typography variant="body1" color="text.secondary">
              No messages yet. Send your first message below.
            </Typography>
          </Box>
        ) : (
          messages.map((message) => (
            <Box 
              key={message.id}
              sx={{ 
                display: 'flex',
                flexDirection: message.message_direction === 'outbound' ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 1
              }}
            >
              {message.message_direction === 'inbound' && (
                <Avatar sx={{ width: 32, height: 32 }}>
                  <PersonIcon fontSize="small" />
                </Avatar>
              )}
              
              <Box 
                sx={{ 
                  maxWidth: '70%',
                  p: 2,
                  borderRadius: 2,
                  bgcolor: message.message_direction === 'outbound' 
                    ? theme.palette.primary.main 
                    : theme.palette.background.paper,
                  color: message.message_direction === 'outbound' 
                    ? theme.palette.primary.contrastText 
                    : theme.palette.text.primary,
                  boxShadow: 1
                }}
              >
                <Typography variant="body1">
                  {message.message_body}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    mt: 1,
                    opacity: 0.7,
                    textAlign: message.message_direction === 'outbound' ? 'right' : 'left'
                  }}
                >
                  <Tooltip title={new Date(message.date).toLocaleString()}>
                    <span>{formatDistanceToNow(new Date(message.date), { addSuffix: true })}</span>
                  </Tooltip>
                </Typography>
              </Box>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>
      
      <Divider />
      
      {/* Message input area */}
      <Box sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
        <Paper
          variant="outlined"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            p: 1
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type your message..."
            variant="standard"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            InputProps={{
              disableUnderline: true,
            }}
            sx={{ px: 1 }}
          />
          <IconButton 
            color="primary" 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
        </Paper>
      </Box>
    </Box>
  );
};

export default SMSMessaging;
