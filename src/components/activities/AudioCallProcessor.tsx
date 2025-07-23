import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  AudioFile as AudioIcon,
  Analytics as AnalyticsIcon,
  Save as SaveIcon,
  CheckCircle as CheckIcon,
  Schedule as DurationIcon,
  Label as TopicIcon,
  Assignment as ActionIcon
} from '@mui/icons-material';
import { processCallRecording, audioAnalysisToCRMFormat } from '../../services/audio/audioProcessor';
import { createCallActivityWithAnalysis } from '../../services/supabase/supabaseService';

interface AudioCallProcessorProps {
  contactId: string;
  practiceId: string;
  contactName: string;
  practiceName: string;
  onSuccess?: () => void;
  apiKey: string; // OpenAI API key for transcription
}

const AudioCallProcessor: React.FC<AudioCallProcessorProps> = ({
  contactId,
  practiceId,
  contactName,
  practiceName,
  onSuccess,
  apiKey
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/mp4'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please select a valid audio file (MP3, WAV, M4A)');
        return;
      }

      // Validate file size (max 25MB for OpenAI)
      if (selectedFile.size > 25 * 1024 * 1024) {
        setError('File size must be less than 25MB');
        return;
      }

      setFile(selectedFile);
      setError(null);
      setActiveStep(1);
    }
  };

  const processAudio = async () => {
    if (!file) return;

    setProcessing(true);
    setError(null);

    try {
      // Process the audio file
      const analysis = await processCallRecording(file, apiKey);
      
      // Convert to CRM format
      const crmData = audioAnalysisToCRMFormat(analysis, contactId, practiceId);
      
      setAnalysisResult({
        ...analysis,
        crmData
      });
      
      setActiveStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process audio file');
    } finally {
      setProcessing(false);
    }
  };

  const saveToCRM = async () => {
    if (!analysisResult?.crmData) return;

    setSaving(true);
    setError(null);

    try {
      const { callAnalysis, salesActivity } = analysisResult.crmData;
      
      await createCallActivityWithAnalysis(
        salesActivity,
        callAnalysis
      );

      setActiveStep(3);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save to CRM');
    } finally {
      setSaving(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'success';
      case 'negative': return 'error';
      default: return 'warning';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AudioIcon color="primary" />
          Process Call Recording
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Upload and analyze call recording for {contactName} at {practiceName}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ my: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} orientation="vertical" sx={{ mt: 3 }}>
          {/* Step 1: Upload File */}
          <Step>
            <StepLabel>Upload Audio File</StepLabel>
            <StepContent>
              <Box sx={{ my: 2 }}>
                <input
                  accept="audio/*"
                  style={{ display: 'none' }}
                  id="audio-file-upload"
                  type="file"
                  onChange={handleFileSelect}
                />
                <label htmlFor="audio-file-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<UploadIcon />}
                  >
                    Choose Audio File
                  </Button>
                </label>
                
                {file && (
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      icon={<AudioIcon />}
                      label={`${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`}
                      onDelete={() => {
                        setFile(null);
                        setActiveStep(0);
                      }}
                    />
                  </Box>
                )}
              </Box>
            </StepContent>
          </Step>

          {/* Step 2: Process Audio */}
          <Step>
            <StepLabel>Process & Analyze</StepLabel>
            <StepContent>
              <Box sx={{ my: 2 }}>
                <Typography variant="body2" gutterBottom>
                  This will transcribe the audio and analyze the conversation for insights.
                </Typography>
                <Button
                  variant="contained"
                  onClick={processAudio}
                  disabled={!file || processing}
                  startIcon={processing ? <CircularProgress size={20} /> : <AnalyticsIcon />}
                  sx={{ mt: 1 }}
                >
                  {processing ? 'Processing...' : 'Start Processing'}
                </Button>
                {processing && (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Transcribing and analyzing audio... This may take a few moments.
                    </Typography>
                  </Box>
                )}
              </Box>
            </StepContent>
          </Step>

          {/* Step 3: Review Results */}
          <Step>
            <StepLabel>Review Results</StepLabel>
            <StepContent>
              {analysisResult && (
                <Box sx={{ my: 2 }}>
                  {/* Summary */}
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Call Summary
                    </Typography>
                    <Typography variant="body2">
                      {analysisResult.summary}
                    </Typography>
                  </Paper>

                  {/* Metadata */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DurationIcon color="action" />
                      <Typography variant="body2">
                        Duration: {formatDuration(analysisResult.duration)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={analysisResult.sentiment}
                        color={getSentimentColor(analysisResult.sentiment)}
                        size="small"
                      />
                      <Typography variant="body2">
                        Score: {analysisResult.sentimentScore.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Key Topics */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Key Topics
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {analysisResult.keyTopics.map((topic: string, index: number) => (
                        <Chip
                          key={index}
                          icon={<TopicIcon />}
                          label={topic}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Action Items */}
                  {analysisResult.actionItems.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Action Items
                      </Typography>
                      <List dense>
                        {analysisResult.actionItems.map((item: string, index: number) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <ActionIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={item} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  <Button
                    variant="contained"
                    onClick={saveToCRM}
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    sx={{ mt: 2 }}
                  >
                    {saving ? 'Saving...' : 'Save to CRM'}
                  </Button>
                </Box>
              )}
            </StepContent>
          </Step>

          {/* Step 4: Complete */}
          <Step>
            <StepLabel>Saved to CRM</StepLabel>
            <StepContent>
              <Box sx={{ my: 2 }}>
                <Alert severity="success" icon={<CheckIcon />}>
                  Call recording has been processed and saved to CRM successfully!
                </Alert>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  The audio file has been processed and discarded. Only the transcript and analysis have been saved.
                </Typography>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
      </CardContent>
    </Card>
  );
};

export default AudioCallProcessor;