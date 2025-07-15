import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Email as EmailIcon,
  Send as SendIcon,
  Inbox as InboxIcon,
  OpenInNew as OpenInNewIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { supabase } from '../../services/supabase/supabaseClient';
import { useAuth } from '../../auth';

interface EmailHistoryProps {
  contactId: string;
}

interface EmailLog {
  id: string;
  message_id: string;
  from_email: string;
  to_email: string;
  subject: string;
  status: 'sent' | 'failed' | 'pending' | 'bounced';
  sent_at: string;
  opened_at?: string;
  clicked_at?: string;
}

const EmailHistory: React.FC<EmailHistoryProps> = ({ contactId }) => {
  const { user } = useAuth();
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEmailHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('email_logs')
        .select('*')
        .eq('contact_id', contactId)
        .order('sent_at', { ascending: false });

      if (fetchError) throw fetchError;

      setEmails(data || []);
    } catch (err) {
      console.error('Error loading email history:', err);
      setError('Failed to load email history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contactId) {
      loadEmailHistory();
    }
  }, [contactId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'success';
      case 'failed':
        return 'error';
      case 'pending':
        return 'warning';
      case 'bounced':
        return 'error';
      default:
        return 'default';
    }
  };

  const isIncoming = (email: EmailLog) => {
    return email.to_email === user?.email;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (emails.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <EmailIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          No emails found for this contact
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Email History ({emails.length})
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={loadEmailHistory} size="small">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <List sx={{ bgcolor: 'background.paper' }}>
        {emails.map((email, index) => {
          const incoming = isIncoming(email);
          return (
            <React.Fragment key={email.id}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip
                      label={email.status}
                      size="small"
                      color={getStatusColor(email.status) as any}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" display="block" color="text.secondary">
                      {format(new Date(email.sent_at), 'MMM d, h:mm a')}
                    </Typography>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: incoming ? 'primary.main' : 'secondary.main' }}>
                    {incoming ? <InboxIcon /> : <SendIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box>
                      <Typography variant="subtitle2" component="span">
                        {email.subject}
                      </Typography>
                      {email.opened_at && (
                        <Chip
                          label="Opened"
                          size="small"
                          sx={{ ml: 1, height: 20 }}
                          color="success"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" component="span">
                        {incoming ? 'From: ' : 'To: '}
                        {incoming ? email.from_email : email.to_email}
                      </Typography>
                      {email.opened_at && (
                        <Typography variant="caption" display="block" color="success.main">
                          Opened: {format(new Date(email.opened_at), 'MMM d, h:mm a')}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
              {index < emails.length - 1 && <Divider component="li" />}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};

export default EmailHistory;