import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  FormControlLabel,
  Switch,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Send as SendIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  AttachFile as AttachIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon
} from '@mui/icons-material';
import EmailSenderDropdown from './EmailSenderDropdown';
import MultiEmailSendingService, { SendEmailOptions } from '../../services/email/MultiEmailSendingService';
import { useAuth } from '../../auth/AuthContext';

interface MultiEmailComposerProps {
  open: boolean;
  onClose: () => void;
  initialTo?: string[];
  initialSubject?: string;
  initialBody?: string;
  onSent?: (result: { success: boolean; message_id?: string; error?: string }) => void;
}

const MultiEmailComposer: React.FC<MultiEmailComposerProps> = ({
  open,
  onClose,
  initialTo = [],
  initialSubject = '',
  initialBody = '',
  onSent
}) => {
  const { user } = useAuth();
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [to, setTo] = useState(initialTo.join(', '));
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [isHtml, setIsHtml] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setTo(initialTo.join(', '));
      setSubject(initialSubject);
      setBody(initialBody);
      setError(null);
      setSuccess(null);
    } else {
      // Reset form when closing
      setTo('');
      setCc('');
      setBcc('');
      setSubject('');
      setBody('');
      setError(null);
      setSuccess(null);
    }
  }, [open, initialTo, initialSubject, initialBody]);

  const handleSend = async () => {
    try {
      setError(null);
      setSuccess(null);
      setSending(true);

      // Validate inputs
      if (!selectedAccountId) {
        setError('Please select an email account to send from');
        return;
      }

      if (!to.trim()) {
        setError('Please enter at least one recipient');
        return;
      }

      if (!subject.trim()) {
        setError('Please enter a subject line');
        return;
      }

      if (!body.trim()) {
        setError('Please enter an email body');
        return;
      }

      // Parse email addresses
      const toAddresses = to.split(',').map(email => email.trim()).filter(Boolean);
      const ccAddresses = cc.split(',').map(email => email.trim()).filter(Boolean);
      const bccAddresses = bcc.split(',').map(email => email.trim()).filter(Boolean);

      // Validate email format (basic validation)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const allAddresses = [...toAddresses, ...ccAddresses, ...bccAddresses];
      
      for (const email of allAddresses) {
        if (!emailRegex.test(email)) {
          setError(`Invalid email address: ${email}`);
          return;
        }
      }

      const emailOptions: SendEmailOptions = {
        from_account_id: selectedAccountId,
        to: toAddresses,
        cc: ccAddresses.length > 0 ? ccAddresses : undefined,
        bcc: bccAddresses.length > 0 ? bccAddresses : undefined,
        subject: subject.trim(),
        body: body.trim(),
        is_html: isHtml
      };

      const result = await MultiEmailSendingService.sendFromAccount(emailOptions);

      if (result.success) {
        setSuccess(`Email sent successfully! Message ID: ${result.message_id}`);
        onSent?.(result);
        
        // Close dialog after short delay
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Failed to send email');
      }

    } catch (error) {
      console.error('Failed to send email:', error);
      setError('An unexpected error occurred while sending the email');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
      onClose();
    }
  };

  const addEmailToField = (field: 'to' | 'cc' | 'bcc', email: string) => {
    const setField = field === 'to' ? setTo : field === 'cc' ? setCc : setBcc;
    const currentValue = field === 'to' ? to : field === 'cc' ? cc : bcc;
    
    if (currentValue) {
      setField(currentValue + ', ' + email);
    } else {
      setField(email);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '70vh',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Compose Email</Typography>
          <IconButton onClick={handleClose} disabled={sending}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Email Account Selector */}
        <Box sx={{ mb: 2 }}>
          <EmailSenderDropdown
            selectedAccountId={selectedAccountId}
            onAccountChange={setSelectedAccountId}
            disabled={sending}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Recipients */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="recipient@example.com, another@example.com"
            disabled={sending}
            margin="dense"
            helperText="Separate multiple emails with commas"
          />

          <Box display="flex" gap={1} mt={1}>
            {!showCc && (
              <Button size="small" onClick={() => setShowCc(true)}>
                Add Cc
              </Button>
            )}
            {!showBcc && (
              <Button size="small" onClick={() => setShowBcc(true)}>
                Add Bcc
              </Button>
            )}
          </Box>

          {showCc && (
            <TextField
              fullWidth
              label="Cc"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="cc@example.com"
              disabled={sending}
              margin="dense"
              sx={{ mt: 1 }}
            />
          )}

          {showBcc && (
            <TextField
              fullWidth
              label="Bcc"
              value={bcc}
              onChange={(e) => setBcc(e.target.value)}
              placeholder="bcc@example.com"
              disabled={sending}
              margin="dense"
              sx={{ mt: 1 }}
            />
          )}
        </Box>

        {/* Subject */}
        <TextField
          fullWidth
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={sending}
          margin="dense"
          sx={{ mb: 2 }}
        />

        {/* Email Body */}
        <Box sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography variant="subtitle2">Message</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isHtml}
                    onChange={(e) => setIsHtml(e.target.checked)}
                    disabled={sending}
                    size="small"
                  />
                }
                label="HTML"
                sx={{ mr: 0 }}
              />
              <Tooltip title="Bold (Ctrl+B)">
                <IconButton size="small" disabled={!isHtml || sending}>
                  <BoldIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Italic (Ctrl+I)">
                <IconButton size="small" disabled={!isHtml || sending}>
                  <ItalicIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Attach File">
                <IconButton size="small" disabled={sending}>
                  <AttachIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={12}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={isHtml ? 
              "Type your message here... You can use HTML formatting." : 
              "Type your message here..."
            }
            disabled={sending}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: isHtml ? 'monospace' : 'inherit'
              }
            }}
          />
        </Box>

        {/* Quick Templates */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Quick Templates
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Chip
              label="Introduction"
              clickable
              size="small"
              onClick={() => setBody(prev => prev + "\n\nHi [Name],\n\nI hope this email finds you well. I wanted to reach out to introduce myself and discuss how we can help your practice.")}
              disabled={sending}
            />
            <Chip
              label="Follow Up"
              clickable
              size="small"
              onClick={() => setBody(prev => prev + "\n\nHi [Name],\n\nI wanted to follow up on our previous conversation about...")}
              disabled={sending}
            />
            <Chip
              label="Meeting Request"
              clickable
              size="small"
              onClick={() => setBody(prev => prev + "\n\nHi [Name],\n\nWould you be available for a brief call next week to discuss your practice's needs?")}
              disabled={sending}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Box display="flex" gap={1} width="100%" justifyContent="space-between">
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              startIcon={<ScheduleIcon />}
              disabled={sending}
              onClick={() => {
                // TODO: Implement scheduled sending
                alert('Scheduled sending coming soon!');
              }}
            >
              Schedule
            </Button>
          </Box>
          <Button
            variant="contained"
            startIcon={sending ? <CircularProgress size={16} /> : <SendIcon />}
            onClick={handleSend}
            disabled={sending || !selectedAccountId || !to.trim() || !subject.trim() || !body.trim()}
          >
            {sending ? 'Sending...' : 'Send Email'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default MultiEmailComposer;