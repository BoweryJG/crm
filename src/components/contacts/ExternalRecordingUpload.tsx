import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  AudioFile as AudioIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
  Mic as MicIcon,
  SmartToy as AIIcon,
  Description as TranscriptIcon
} from '@mui/icons-material';
import { geminiService } from '../../services/ai/geminiService';
import { useAuth } from '../../auth';

interface ExternalRecordingUploadProps {
  contactId: string;
  contactName?: string;
  practiceId?: string;
  onUploadComplete?: (recordingId: string) => void;
  onClose?: () => void;
}

const ACCEPTED_AUDIO_TYPES = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/webm'];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const ExternalRecordingUpload: React.FC<ExternalRecordingUploadProps> = ({
  contactId,
  contactName,
  practiceId,
  onUploadComplete,
  onClose
}) => {
  const theme = useTheme();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [source, setSource] = useState<'plaud' | 'manual' | 'other'>('plaud');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [transcriptionProvider, setTranscriptionProvider] = useState<'openai' | 'gemini'>('gemini');
  const [analysisProvider, setAnalysisProvider] = useState<'openai' | 'gemini'>('gemini');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
      setError('Please select a valid audio file (MP3, WAV, M4A, or WebM)');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 100MB');
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    setUploadProgress(10);
    setError(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      // Process the recording with selected providers
      const result = await geminiService.processRecording({
        audioFile: selectedFile,
        contactId,
        contactName,
        practiceId,
        userId: user.id,
        source,
        externalId: notes, // Using notes field to store any external ID
        transcriptionProvider,
        analysisProvider
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.data) {
        setSuccess(true);
        setAnalysisResult(result.data);
        
        // Notify parent component
        if (onUploadComplete && result.recordingId) {
          onUploadComplete(result.recordingId);
        }
      } else {
        throw new Error(result.error || 'Failed to process recording');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload and process recording');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSource('plaud');
    setNotes('');
    setError(null);
    setSuccess(false);
    setAnalysisResult(null);
    setUploadProgress(0);
    setTranscriptionProvider('gemini');
    setAnalysisProvider('gemini');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <MicIcon color="primary" sx={{ mr: 2 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Upload External Recording
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {!success ? (
        <>
          {/* File Upload Area */}
          <Box
            sx={{
              border: `2px dashed ${theme.palette.divider}`,
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.05)
              }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept={ACCEPTED_AUDIO_TYPES.join(',')}
              onChange={handleFileSelect}
            />
            
            {selectedFile ? (
              <Box>
                <AudioIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }} />
                <Typography variant="subtitle1" gutterBottom>
                  {selectedFile.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatBytes(selectedFile.size)}
                </Typography>
              </Box>
            ) : (
              <Box>
                <UploadIcon sx={{ fontSize: 48, color: theme.palette.action.disabled, mb: 1 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Click to select audio file
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supports MP3, WAV, M4A, WebM (max 100MB)
                </Typography>
              </Box>
            )}
          </Box>

          {/* Recording Source */}
          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>Recording Source</InputLabel>
            <Select
              value={source}
              onChange={(e) => setSource(e.target.value as any)}
              label="Recording Source"
            >
              <MenuItem value="plaud">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MicIcon sx={{ mr: 1, fontSize: 20 }} />
                  PLAUD Device
                </Box>
              </MenuItem>
              <MenuItem value="manual">Manual Recording</MenuItem>
              <MenuItem value="other">Other Source</MenuItem>
            </Select>
          </FormControl>

          {/* AI Provider Selection */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Transcription Provider</InputLabel>
              <Select
                value={transcriptionProvider}
                onChange={(e) => setTranscriptionProvider(e.target.value as 'openai' | 'gemini')}
                label="Transcription Provider"
              >
                <MenuItem value="gemini">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AIIcon sx={{ mr: 1, fontSize: 20 }} />
                    Gemini
                  </Box>
                </MenuItem>
                <MenuItem value="openai">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AIIcon sx={{ mr: 1, fontSize: 20 }} />
                    OpenAI Whisper
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Analysis Provider</InputLabel>
              <Select
                value={analysisProvider}
                onChange={(e) => setAnalysisProvider(e.target.value as 'openai' | 'gemini')}
                label="Analysis Provider"
              >
                <MenuItem value="gemini">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AIIcon sx={{ mr: 1, fontSize: 20 }} />
                    Gemini
                  </Box>
                </MenuItem>
                <MenuItem value="openai">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AIIcon sx={{ mr: 1, fontSize: 20 }} />
                    GPT-4
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Notes */}
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any context or external ID..."
            sx={{ mt: 2 }}
          />

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Processing with {transcriptionProvider === 'openai' ? 'OpenAI Whisper' : 'Gemini'} for transcription
                and {analysisProvider === 'openai' ? 'GPT-4' : 'Gemini'} for analysis...
              </Typography>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              startIcon={<AIIcon />}
              fullWidth
            >
              {isUploading ? 'Processing...' : 'Upload & Analyze'}
            </Button>
            {selectedFile && !isUploading && (
              <Button
                variant="outlined"
                onClick={handleReset}
                sx={{ minWidth: 120 }}
              >
                Clear
              </Button>
            )}
          </Box>
        </>
      ) : (
        /* Success State */
        <Box>
          <Alert
            severity="success"
            icon={<SuccessIcon />}
            sx={{ mb: 3 }}
          >
            Recording uploaded and analyzed successfully!
          </Alert>

          {analysisResult && (
            <Box>
              {/* Summary */}
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Summary
                </Typography>
                <Typography variant="body2">
                  {analysisResult.summary}
                </Typography>
              </Paper>

              {/* Key Metrics */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={`Sentiment: ${analysisResult.sentiment}`}
                  color={
                    analysisResult.sentiment === 'positive' ? 'success' :
                    analysisResult.sentiment === 'negative' ? 'error' : 'default'
                  }
                  size="small"
                />
                {analysisResult.callMetrics?.questionCount && (
                  <Chip
                    label={`${analysisResult.callMetrics.questionCount} Questions`}
                    size="small"
                    variant="outlined"
                  />
                )}
                {analysisResult.callMetrics?.nextStepsIdentified && (
                  <Chip
                    label="Next Steps Defined"
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                )}
              </Box>

              {/* Key Points */}
              {analysisResult.keyPoints?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Key Points
                  </Typography>
                  <List dense>
                    {analysisResult.keyPoints.slice(0, 3).map((point: string, index: number) => (
                      <ListItem key={index} sx={{ pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Chip label={index + 1} size="small" />
                        </ListItemIcon>
                        <ListItemText primary={point} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Action Items */}
              {analysisResult.actionItems?.length > 0 && (
                <Alert severity="info" icon={<TranscriptIcon />} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Action Items
                  </Typography>
                  <List dense sx={{ mt: 1 }}>
                    {analysisResult.actionItems.map((item: string, index: number) => (
                      <ListItem key={index} sx={{ pl: 0, py: 0 }}>
                        <ListItemText primary={`• ${item}`} />
                      </ListItem>
                    ))}
                  </List>
                </Alert>
              )}
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleReset}
              fullWidth
            >
              Upload Another Recording
            </Button>
            {onClose && (
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{ minWidth: 120 }}
              >
                Close
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

// Utility function for formatting file sizes
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}