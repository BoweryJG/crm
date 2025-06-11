// SUIS Content Generator
// AI-Powered content generation with real integration

import React, { useState } from 'react';
import { 
  Box, Card, CardContent, Typography, TextField, Button, 
  Select, MenuItem, FormControl, InputLabel, Chip, Grid,
  LinearProgress, Alert, IconButton, Paper, Divider
} from '@mui/material';
import { 
  Mail, FileText, Share2, Send, Copy, Download, 
  Wand2, Edit3, Save, X
} from 'lucide-react';
import { useSUISFeatures } from '../hooks/useSUISFeatures';
import { useAuth } from '../../hooks/useAuth';

interface ContentRequest {
  type: 'email' | 'presentation' | 'social' | 'proposal' | 'follow_up';
  targetAudience: {
    specialty: string;
    role: string;
    interests?: string[];
    painPoints?: string[];
  };
  procedureFocus?: string;
  tone?: 'professional' | 'friendly' | 'educational' | 'persuasive';
  length?: 'short' | 'medium' | 'long';
  context?: string;
}

const ContentGenerator: React.FC = () => {
  const { user } = useAuth();
  const { generateContent, loading } = useSUISFeatures();
  
  const [contentRequest, setContentRequest] = useState<ContentRequest>({
    type: 'email',
    targetAudience: {
      specialty: 'dental',
      role: 'practice_owner'
    },
    tone: 'professional',
    length: 'medium'
  });
  
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const contentTypes = [
    { value: 'email', label: 'Email', icon: <Mail size={20} /> },
    { value: 'presentation', label: 'Presentation', icon: <FileText size={20} /> },
    { value: 'social', label: 'Social Media', icon: <Share2 size={20} /> },
    { value: 'proposal', label: 'Proposal', icon: <FileText size={20} /> },
    { value: 'follow_up', label: 'Follow-up', icon: <Send size={20} /> }
  ];

  const specialties = [
    { value: 'dental', label: 'Dental' },
    { value: 'aesthetic', label: 'Aesthetic' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'plastic_surgery', label: 'Plastic Surgery' }
  ];

  const roles = [
    { value: 'practice_owner', label: 'Practice Owner' },
    { value: 'physician', label: 'Physician/Dentist' },
    { value: 'office_manager', label: 'Office Manager' },
    { value: 'clinical_director', label: 'Clinical Director' }
  ];

  const handleGenerate = async () => {
    setError(null);
    try {
      const result = await generateContent(contentRequest);
      setGeneratedContent(result);
      setEditedContent(result?.contentData?.content || '');
    } catch (err: any) {
      setError(err.message || 'Failed to generate content');
    }
  };

  const handleCopy = () => {
    const content = isEditing ? editedContent : generatedContent?.contentData?.content;
    if (content) {
      navigator.clipboard.writeText(content);
      // Could show a toast notification here
    }
  };

  const handleSave = () => {
    // Update the generated content with edited version
    if (generatedContent) {
      setGeneratedContent({
        ...generatedContent,
        contentData: {
          ...generatedContent.contentData,
          content: editedContent
        }
      });
    }
    setIsEditing(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        AI Content Generator
      </Typography>
      
      <Grid container spacing={3}>
        {/* Configuration Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Content Configuration
              </Typography>
              
              {/* Content Type */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Content Type</InputLabel>
                <Select
                  value={contentRequest.type}
                  onChange={(e) => setContentRequest({
                    ...contentRequest,
                    type: e.target.value as any
                  })}
                >
                  {contentTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {type.icon}
                        {type.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Target Specialty */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Target Specialty</InputLabel>
                <Select
                  value={contentRequest.targetAudience.specialty}
                  onChange={(e) => setContentRequest({
                    ...contentRequest,
                    targetAudience: {
                      ...contentRequest.targetAudience,
                      specialty: e.target.value
                    }
                  })}
                >
                  {specialties.map(spec => (
                    <MenuItem key={spec.value} value={spec.value}>
                      {spec.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Target Role */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Target Role</InputLabel>
                <Select
                  value={contentRequest.targetAudience.role}
                  onChange={(e) => setContentRequest({
                    ...contentRequest,
                    targetAudience: {
                      ...contentRequest.targetAudience,
                      role: e.target.value
                    }
                  })}
                >
                  {roles.map(role => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Procedure Focus */}
              <TextField
                fullWidth
                label="Procedure Focus (Optional)"
                value={contentRequest.procedureFocus || ''}
                onChange={(e) => setContentRequest({
                  ...contentRequest,
                  procedureFocus: e.target.value
                })}
                sx={{ mb: 2 }}
                placeholder="e.g., Dental Implants, Botox"
              />

              {/* Tone */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Tone</InputLabel>
                <Select
                  value={contentRequest.tone}
                  onChange={(e) => setContentRequest({
                    ...contentRequest,
                    tone: e.target.value as any
                  })}
                >
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="friendly">Friendly</MenuItem>
                  <MenuItem value="educational">Educational</MenuItem>
                  <MenuItem value="persuasive">Persuasive</MenuItem>
                </Select>
              </FormControl>

              {/* Length */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Length</InputLabel>
                <Select
                  value={contentRequest.length}
                  onChange={(e) => setContentRequest({
                    ...contentRequest,
                    length: e.target.value as any
                  })}
                >
                  <MenuItem value="short">Short</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="long">Long</MenuItem>
                </Select>
              </FormControl>

              {/* Additional Context */}
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Additional Context (Optional)"
                value={contentRequest.context || ''}
                onChange={(e) => setContentRequest({
                  ...contentRequest,
                  context: e.target.value
                })}
                sx={{ mb: 2 }}
              />

              <Button
                fullWidth
                variant="contained"
                startIcon={<Wand2 />}
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Content'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Generated Content Panel */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">
                  Generated Content
                </Typography>
                
                {generatedContent && (
                  <Box display="flex" gap={1}>
                    <IconButton onClick={handleCopy} size="small">
                      <Copy size={20} />
                    </IconButton>
                    {!isEditing ? (
                      <IconButton onClick={() => setIsEditing(true)} size="small">
                        <Edit3 size={20} />
                      </IconButton>
                    ) : (
                      <>
                        <IconButton onClick={handleSave} size="small" color="primary">
                          <Save size={20} />
                        </IconButton>
                        <IconButton 
                          onClick={() => {
                            setIsEditing(false);
                            setEditedContent(generatedContent?.contentData?.content || '');
                          }} 
                          size="small" 
                          color="error"
                        >
                          <X size={20} />
                        </IconButton>
                      </>
                    )}
                  </Box>
                )}
              </Box>

              {loading && (
                <Box sx={{ py: 4 }}>
                  <LinearProgress />
                  <Typography align="center" sx={{ mt: 2 }}>
                    Generating AI content...
                  </Typography>
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {generatedContent && !loading && (
                <Paper variant="outlined" sx={{ p: 3, minHeight: 400 }}>
                  {!isEditing ? (
                    <Typography style={{ whiteSpace: 'pre-wrap' }}>
                      {generatedContent.contentData?.content || 'No content generated'}
                    </Typography>
                  ) : (
                    <TextField
                      fullWidth
                      multiline
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      style={{ whiteSpace: 'pre-wrap' }}
                    />
                  )}
                  
                  {generatedContent.contentData?.metadata && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip 
                          label={`Model: ${generatedContent.contentData.metadata.model || 'AI'}`} 
                          size="small" 
                        />
                        <Chip 
                          label={`Generated: ${new Date(generatedContent.created_at).toLocaleDateString()}`} 
                          size="small" 
                        />
                      </Box>
                    </>
                  )}
                </Paper>
              )}

              {!generatedContent && !loading && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography color="textSecondary">
                    Configure your content preferences and click "Generate Content" to create AI-powered content
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContentGenerator;