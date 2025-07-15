import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Chip,
  Autocomplete,
  CircularProgress,
  Alert,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Save as SaveIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  Link as LinkIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { useAuth } from '../../auth';
import { Contact } from '../../types/models';
import { emailService } from '../../services/email/emailService';
import { supabase } from '../../services/supabase/supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface EmailComposerProps {
  open: boolean;
  onClose: () => void;
  prefilledTo?: string;
  prefilledSubject?: string;
  contact?: Contact;
  contacts?: Contact[];
}

const EmailComposer: React.FC<EmailComposerProps> = ({
  open,
  onClose,
  prefilledTo = '',
  prefilledSubject = '',
  contact,
  contacts = []
}) => {
  const { user } = useAuth();
  const [to, setTo] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [emailStats, setEmailStats] = useState<any>(null);

  // Quill editor modules
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  // Initialize with prefilled data
  useEffect(() => {
    if (prefilledTo) {
      setTo([prefilledTo]);
    } else if (contact?.email) {
      setTo([contact.email]);
    }
    if (prefilledSubject) {
      setSubject(prefilledSubject);
    }
  }, [prefilledTo, prefilledSubject, contact]);

  // Load email templates
  useEffect(() => {
    const loadTemplates = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('email_templates')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('name');
      
      if (data) {
        setTemplates(data);
      }
    };

    loadTemplates();
  }, [user]);

  // Load email stats
  useEffect(() => {
    const loadStats = async () => {
      const stats = await emailService.getEmailStats(user?.id);
      setEmailStats(stats);
    };

    if (open) {
      loadStats();
    }
  }, [open, user]);

  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setBody(template.html_content || template.text_content || '');
    }
  };

  // Handle email send
  const handleSend = async () => {
    if (to.length === 0 || !subject || !body) {
      setError('Please fill in all required fields');
      return;
    }

    setSending(true);
    setError(null);

    try {
      // Send to each recipient
      const sendPromises = to.map(recipient => 
        emailService.sendEmail({
          to: recipient,
          subject,
          html: body,
          contactId: contact?.id
        })
      );

      const results = await Promise.all(sendPromises);
      const failed = results.filter(r => !r.success);

      if (failed.length > 0) {
        setError(`Failed to send to ${failed.length} recipient(s)`);
      } else {
        setSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 1500);
      }
    } catch (err) {
      setError('Failed to send email');
      console.error('Email send error:', err);
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setTo([]);
    setSubject('');
    setBody('');
    setError(null);
    setSuccess(false);
    setSelectedTemplate('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '900px'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Compose Email</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {emailStats && (
            <Typography variant="caption" color="text.secondary">
              {emailStats.sentToday}/{emailStats.accountLimits.reduce((sum: number, acc: any) => sum + acc.limit, 0)} sent today
            </Typography>
          )}
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success">
            Email sent successfully!
          </Alert>
        )}

        {/* Template selector */}
        {templates.length > 0 && (
          <FormControl size="small">
            <InputLabel>Email Template</InputLabel>
            <Select
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              label="Email Template"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {templates.map(template => (
                <MenuItem key={template.id} value={template.id}>
                  {template.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* To field */}
        <Autocomplete
          multiple
          freeSolo
          options={contacts.map(c => c.email).filter(Boolean) as string[]}
          value={to}
          onChange={(_, newValue) => setTo(newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                size="small"
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="To"
              placeholder="Add recipients..."
              size="small"
              required
            />
          )}
        />

        {/* Subject field */}
        <TextField
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          fullWidth
          size="small"
          required
        />

        {/* Email body */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
            Message
          </Typography>
          <Paper variant="outlined" sx={{ flexGrow: 1, overflow: 'auto' }}>
            <ReactQuill
              theme="snow"
              value={body}
              onChange={setBody}
              modules={modules}
              style={{ height: '100%', minHeight: '300px' }}
            />
          </Paper>
        </Box>

        {/* Attachments placeholder */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            startIcon={<AttachFileIcon />}
            size="small"
            disabled
          >
            Attach files (coming soon)
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={sending}>
          Cancel
        </Button>
        <Button
          variant="outlined"
          startIcon={<SaveIcon />}
          disabled={sending || !to.length || !subject || !body}
        >
          Save as Draft
        </Button>
        <Button
          variant="contained"
          startIcon={sending ? <CircularProgress size={16} /> : <SendIcon />}
          onClick={handleSend}
          disabled={sending || !to.length || !subject || !body}
        >
          {sending ? 'Sending...' : 'Send'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailComposer;