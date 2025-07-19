import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextareaAutosize,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Autocomplete
} from '@mui/material';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Phone as PhoneIcon,
  AccessTime as DurationIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { 
  createCallActivityWithAnalysis,
  CallActivityData,
  CallAnalysisData,
  fetchContacts,
  fetchPractices
} from '../../services/supabase/supabaseService';
import { Contact, Practice } from '../../types/models';

interface CallActivityFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  prefilledData?: {
    contactId?: string;
    practiceId?: string;
    contactName?: string;
    practiceName?: string;
  };
}

const CallActivityForm: React.FC<CallActivityFormProps> = ({
  open,
  onClose,
  onSuccess,
  prefilledData
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [practices, setPractices] = useState<Practice[]>([]);
  
  // Form state
  const [formData, setFormData] = useState<{
    contactId: string;
    practiceId: string;
    callDate: Date;
    duration: number;
    outcome: CallActivityData['outcome'];
    notes: string;
    nextSteps: string;
    title: string;
    summary: string;
    keyTopics: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    recordingUrl?: string;
    transcript?: string;
  }>({
    contactId: prefilledData?.contactId || '',
    practiceId: prefilledData?.practiceId || '',
    callDate: new Date(),
    duration: 0,
    outcome: 'successful',
    notes: '',
    nextSteps: '',
    title: '',
    summary: '',
    keyTopics: [],
    sentiment: 'neutral',
    recordingUrl: '',
    transcript: ''
  });

  const [newTopic, setNewTopic] = useState('');

  useEffect(() => {
    fetchContactsAndPractices();
  }, []);

  const fetchContactsAndPractices = async () => {
    try {
      const [contactsResult, practicesResult] = await Promise.all([
        fetchContacts(),
        fetchPractices()
      ]);
      
      if (contactsResult.data) setContacts(contactsResult.data);
      if (practicesResult.data) setPractices(practicesResult.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const callActivityData: CallActivityData = {
        contact_id: formData.contactId,
        practice_id: formData.practiceId,
        date: formData.callDate.toISOString(),
        duration: formData.duration,
        notes: formData.notes,
        outcome: formData.outcome,
        next_steps: formData.nextSteps
      };

      const callAnalysisData: CallAnalysisData = {
        title: formData.title,
        call_date: formData.callDate.toISOString(),
        duration: formData.duration,
        contact_id: formData.contactId,
        practice_id: formData.practiceId,
        recording_url: formData.recordingUrl,
        transcript: formData.transcript,
        summary: formData.summary,
        sentiment_score: formData.sentiment === 'positive' ? 0.7 : 
                        formData.sentiment === 'negative' ? -0.5 : 0,
        tags: formData.keyTopics,
        notes: formData.notes
      };

      const { error } = await createCallActivityWithAnalysis(
        callActivityData,
        callAnalysisData
      );

      if (error) throw error;

      onSuccess?.();
      onClose();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save call activity');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      contactId: '',
      practiceId: '',
      callDate: new Date(),
      duration: 0,
      outcome: 'successful',
      notes: '',
      nextSteps: '',
      title: '',
      summary: '',
      keyTopics: [],
      sentiment: 'neutral',
      recordingUrl: '',
      transcript: ''
    });
    setNewTopic('');
  };

  const handleAddTopic = () => {
    if (newTopic.trim() && !formData.keyTopics.includes(newTopic.trim())) {
      setFormData({
        ...formData,
        keyTopics: [...formData.keyTopics, newTopic.trim()]
      });
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setFormData({
      ...formData,
      keyTopics: formData.keyTopics.filter(t => t !== topic)
    });
  };

  return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon color="primary" />
            <Typography variant="h6">Log Call Activity</Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {/* Basic Information */}
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1 }}>
              Basic Information
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Autocomplete
                options={contacts}
                getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
                value={contacts.find(c => c.id === formData.contactId) || null}
                onChange={(_, value) => setFormData({ ...formData, contactId: value?.id || '' })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Contact"
                    required
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                )}
              />

              <Autocomplete
                options={practices}
                getOptionLabel={(option) => option.name}
                value={practices.find(p => p.id === formData.practiceId) || null}
                onChange={(_, value) => setFormData({ ...formData, practiceId: value?.id || '' })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Practice"
                    required
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                )}
              />

              <TextField
                label="Call Date & Time"
                type="datetime-local"
                value={formData.callDate.toISOString().slice(0, 16)}
                onChange={(e) => setFormData({ ...formData, callDate: new Date(e.target.value) })}
                required
                fullWidth
              />

              <TextField
                label="Duration (minutes)"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                InputProps={{
                  startAdornment: <DurationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                required
              />
            </Box>

            {/* Call Details */}
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
              Call Details
            </Typography>

            <TextField
              label="Call Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              required
            />

            <FormControl fullWidth>
              <InputLabel>Call Outcome</InputLabel>
              <Select
                value={formData.outcome}
                onChange={(e) => setFormData({ ...formData, outcome: e.target.value as CallActivityData['outcome'] })}
                label="Call Outcome"
              >
                <MenuItem value="successful">Successful</MenuItem>
                <MenuItem value="unsuccessful">Unsuccessful</MenuItem>
                <MenuItem value="follow_up_required">Follow-up Required</MenuItem>
                <MenuItem value="no_decision">No Decision</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Overall Sentiment</InputLabel>
              <Select
                value={formData.sentiment}
                onChange={(e) => setFormData({ ...formData, sentiment: e.target.value as any })}
                label="Overall Sentiment"
              >
                <MenuItem value="positive">Positive</MenuItem>
                <MenuItem value="neutral">Neutral</MenuItem>
                <MenuItem value="negative">Negative</MenuItem>
              </Select>
            </FormControl>

            {/* Analysis Section */}
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AnalyticsIcon />
                Call Analysis
              </Box>
            </Typography>

            <TextField
              label="Call Summary"
              multiline
              rows={3}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              fullWidth
              placeholder="Brief summary of what was discussed..."
            />

            <TextField
              label="Key Notes"
              multiline
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              fullWidth
              required
              placeholder="Important points, decisions made, customer needs..."
            />

            <TextField
              label="Next Steps"
              multiline
              rows={2}
              value={formData.nextSteps}
              onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
              fullWidth
              placeholder="Action items and follow-up tasks..."
            />

            {/* Key Topics */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>Key Topics Discussed</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                {formData.keyTopics.map((topic) => (
                  <Chip
                    key={topic}
                    label={topic}
                    onDelete={() => handleRemoveTopic(topic)}
                    size="small"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Add topic..."
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTopic()}
                  sx={{ flex: 1 }}
                />
                <Button onClick={handleAddTopic} size="small">Add</Button>
              </Box>
            </Box>

            {/* Optional Fields */}
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
              Optional Information
            </Typography>

            <TextField
              label="Recording URL"
              value={formData.recordingUrl}
              onChange={(e) => setFormData({ ...formData, recordingUrl: e.target.value })}
              fullWidth
              placeholder="Link to call recording if available..."
            />

            <TextField
              label="Transcript"
              multiline
              rows={4}
              value={formData.transcript}
              onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
              fullWidth
              placeholder="Paste call transcript here if available..."
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !formData.contactId || !formData.practiceId || !formData.title}
            startIcon={loading ? <CircularProgress size={20} /> : <PhoneIcon />}
          >
            {loading ? 'Saving...' : 'Save Call Activity'}
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default CallActivityForm;