import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  TextField,
  Typography,
  Collapse,
  CircularProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon
} from '@mui/icons-material';
import { contactAssistantService } from '../../services/contacts/contactAssistantService';
import { Contact } from '../../types/models';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  contacts?: Contact[];
}

interface ContactChatWidgetProps {
  onContactsUpdate?: (contacts: Contact[]) => void;
}

const ContactChatWidget: React.FC<ContactChatWidgetProps> = ({ onContactsUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your contact assistant. Try asking me things like:\n• 'Show me top 10 engaged prosthodontists in NY'\n• 'Find aesthetic doctors I haven't contacted in 30 days'\n• 'List all dental contacts in California'",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await contactAssistantService.processNaturalLanguageQuery(inputValue);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: result.summary,
        sender: 'assistant',
        timestamp: new Date(),
        contacts: result.contacts
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update the main contacts view if callback provided
      if (onContactsUpdate && result.contacts.length > 0) {
        onContactsUpdate(result.contacts);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I couldn't process that query. Please try rephrasing it.",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderContactPreview = (contact: Contact) => (
    <ListItem 
      key={contact.id}
      sx={{ 
        bgcolor: 'background.paper', 
        borderRadius: 1, 
        mb: 0.5,
        '&:hover': { bgcolor: 'action.hover' }
      }}
    >
      <ListItemAvatar>
        <Avatar>
          {contact.first_name?.[0]}{contact.last_name?.[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={`${contact.first_name} ${contact.last_name}`}
        secondary={
          <Box>
            <Typography variant="caption" display="block">
              {contact.practice_type === 'aesthetic' ? '💉' : '🦷'} {contact.practice_name}
            </Typography>
            {contact.specialty && (
              <Chip label={contact.specialty} size="small" sx={{ mt: 0.5 }} />
            )}
          </Box>
        }
      />
    </ListItem>
  );

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: isOpen ? 'none' : 'flex'
        }}
      >
        <ChatIcon />
      </Fab>

      {/* Chat Widget */}
      <Collapse in={isOpen}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            width: 400,
            height: 600,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1300
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <BotIcon />
              <Typography variant="h6">Contact Assistant</Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              sx={{ color: 'inherit' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  mb: 2,
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <Box
                  sx={{
                    maxWidth: '80%',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                    color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary'
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {message.sender === 'assistant' ? <BotIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                    <Typography variant="caption">
                      {message.sender === 'assistant' ? 'Assistant' : 'You'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {message.text}
                  </Typography>
                  
                  {/* Contact Results */}
                  {message.contacts && message.contacts.length > 0 && (
                    <List sx={{ mt: 2 }}>
                      {message.contacts.slice(0, 3).map(contact => renderContactPreview(contact))}
                    </List>
                  )}
                </Box>
              </Box>
            ))}
            {isLoading && (
              <Box display="flex" justifyContent="flex-start" mb={2}>
                <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                  <CircularProgress size={20} />
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask about your contacts..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default ContactChatWidget;