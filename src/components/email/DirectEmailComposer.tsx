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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Star as StarIcon,
  Google as GoogleIcon,
  Microsoft as MicrosoftIcon,
  Mail as MailIcon
} from '@mui/icons-material';
import DirectSMTPService, { WorkEmailAccount, DirectSendOptions } from '../../services/email/DirectSMTPService';
import WorkEmailSetupModal from './WorkEmailSetupModal';
import { useAuth } from '../../auth/AuthContext';

interface DirectEmailComposerProps {
  open: boolean;
  onClose: () => void;
  initialTo?: string[];
  initialSubject?: string;
  initialBody?: string;
  onSent?: (result: { success: boolean; message_id?: string; error?: string }) => void;
}

const DirectEmailComposer: React.FC<DirectEmailComposerProps> = ({
  open,
  onClose,
  initialTo = [],
  initialSubject = '',
  initialBody = '',
  onSent
}) => {
  const { user } = useAuth();
  const [workAccounts, setWorkAccounts] = useState<WorkEmailAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [to, setTo] = useState(initialTo.join(', '));
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  useEffect(() => {
    if (open && user?.id) {
      loadWorkAccounts();
    }
  }, [open, user?.id]);

  useEffect(() => {
    if (open) {
      setTo(initialTo.join(', '));
      setSubject(initialSubject);
      setBody(initialBody);
      setError(null);
      setSuccess(null);
    }
  }, [open, initialTo, initialSubject, initialBody]);

  const loadWorkAccounts = async () => {
    try {
      const accounts = await DirectSMTPService.getWorkEmailAccounts(user?.id || '');
      setWorkAccounts(accounts);
      
      // Auto-select primary account
      if (!selectedAccountId && accounts.length > 0) {
        const primary = accounts.find(acc => acc.is_primary) || accounts[0];
        setSelectedAccountId(primary.id);
      }
    } catch (error) {
      console.error('Failed to load work accounts:', error);
    }
  };

  const handleSend = async () => {
    try {
      setError(null);
      setSuccess(null);
      setSending(true);

      // Validation
      if (!selectedAccountId) {
        setError('Please select a work email account');
        return;
      }

      if (!to.trim()) {
        setError('Please enter at least one recipient');
        return;
      }

      if (!subject.trim()) {
        setError('Please enter a subject');
        return;
      }

      if (!body.trim()) {
        setError('Please enter a message');
        return;
      }

      // Parse email addresses
      const toAddresses = to.split(',').map(email => email.trim()).filter(Boolean);
      const ccAddresses = cc.split(',').map(email => email.trim()).filter(Boolean);
      const bccAddresses = bcc.split(',').map(email => email.trim()).filter(Boolean);

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const allAddresses = [...toAddresses, ...ccAddresses, ...bccAddresses];
      
      for (const email of allAddresses) {
        if (!emailRegex.test(email)) {
          setError(`Invalid email address: ${email}`);
          return;
        }
      }

      const sendOptions: DirectSendOptions = {
        from_account_id: selectedAccountId,
        to: toAddresses,
        cc: ccAddresses.length > 0 ? ccAddresses : undefined,
        bcc: bccAddresses.length > 0 ? bccAddresses : undefined,
        subject: subject.trim(),
        body: body.trim(),
        is_html: true
      };

      const result = await DirectSMTPService.sendDirectEmail(sendOptions);

      if (result.success) {
        setSuccess(`Email sent successfully from your work email!`);
        onSent?.(result);
        
        // Close after short delay
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Failed to send email');
      }

    } catch (error) {
      console.error('Send failed:', error);
      setError('An unexpected error occurred while sending');
    } finally {
      setSending(false);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'gmail':
        return <GoogleIcon sx={{ color: '#EA4335', fontSize: 16 }} />;
      case 'outlook':
      case 'office365':
        return <MicrosoftIcon sx={{ color: '#0078D4', fontSize: 16 }} />;
      default:
        return <MailIcon sx={{ fontSize: 16 }} />;
    }
  };

  const selectedAccount = workAccounts.find(acc => acc.id === selectedAccountId);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <WorkIcon color="primary" />
              <Typography variant="h6">Send from Work Email</Typography>
            </Box>
            <IconButton onClick={onClose} disabled={sending}>
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

          {/* Work Email Account Selector */}
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Send From (Work Email)</InputLabel>
              <Select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                label="Send From (Work Email)"
                disabled={sending}
                renderValue={(value) => {
                  const account = workAccounts.find(acc => acc.id === value);
                  if (!account) return '';
                  
                  return (
                    <Box display="flex" alignItems="center" gap={1}>
                      {getProviderIcon(account.provider)}
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {account.display_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {account.email_address}
                        </Typography>
                      </Box>
                      {account.is_primary && (
                        <StarIcon sx={{ fontSize: 14, color: '#ffd700' }} />
                      )}
                    </Box>
                  );
                }}
              >
                {workAccounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    <Box display="flex" alignItems="center" gap={1} width="100%">
                      {getProviderIcon(account.provider)}
                      <Box flex={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {account.display_name}
                          </Typography>
                          <WorkIcon sx={{ fontSize: 12, color: '#1976d2' }} />
                          {account.is_primary && (
                            <StarIcon sx={{ fontSize: 12, color: '#ffd700' }} />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {account.email_address}
                        </Typography>
                        <Box display="flex" gap={0.5} mt={0.5}>
                          <Chip 
                            label="Work" 
                            size="small" 
                            color="primary"
                            sx={{ fontSize: 10, height: 16 }}
                          />
                          <Chip 
                            label={account.provider.toUpperCase()} 
                            size="small" 
                            variant="outlined"
                            sx={{ fontSize: 10, height: 16 }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
                
                <MenuItem onClick={() => setShowSetupModal(true)}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <AddIcon color="primary" />
                    <Typography color="primary">Add Work Email Account</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            {selectedAccount && (
              <Alert severity="info" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  Sending from: <strong>{selectedAccount.email_address}</strong> 
                  {selectedAccount.provider === 'gmail' && ' (using Gmail App Password)'}
                </Typography>
              </Alert>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Recipients */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@company.com, another@company.com"
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
                placeholder="cc@company.com"
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
                placeholder="bcc@company.com"
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

          {/* Message Body */}
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type your professional message here..."
            disabled={sending}
            variant="outlined"
          />

          {workAccounts.length === 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                No work email accounts configured. 
                <Button 
                  color="primary" 
                  onClick={() => setShowSetupModal(true)}
                  sx={{ ml: 1 }}
                >
                  Add Work Email
                </Button>
              </Typography>
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={sending}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={sending ? <CircularProgress size={16} /> : <SendIcon />}
            onClick={handleSend}
            disabled={
              sending || 
              !selectedAccountId || 
              !to.trim() || 
              !subject.trim() || 
              !body.trim() ||
              workAccounts.length === 0
            }
          >
            {sending ? 'Sending...' : 'Send from Work Email'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Work Email Setup Modal */}
      <WorkEmailSetupModal
        open={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        onSuccess={() => {
          setShowSetupModal(false);
          loadWorkAccounts();
        }}
      />
    </>
  );
};

export default DirectEmailComposer;