import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Chip,
  IconButton,
  Button,
  Grid,
  Card,
  Stack,
  TextField,
  LinearProgress,
  Slider,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
  Collapse,
} from '@mui/material';
import {
  Create as CreateIcon,
  Email as EmailIcon,
  Description as ProposalIcon,
  Campaign as SocialIcon,
  Article as BlogIcon,
  AutoAwesome as AIIcon,
  Send as SendIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  Refresh as RegenerateIcon,
  TuneOutlined as TuneIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';
import glassEffects from '../../themes/glassEffects';
import { getThemeAccents, getThemeGlass } from '../dashboard/ThemeAwareComponents';

type ContentType = 'email' | 'proposal' | 'social' | 'blog' | 'followup';
type ContentTone = 'professional' | 'friendly' | 'persuasive' | 'casual' | 'formal';

interface ContentTemplate {
  id: string;
  type: ContentType;
  name: string;
  description: string;
  lastUsed?: string;
  popularity: number;
}

const mockTemplates: ContentTemplate[] = [
  { id: '1', type: 'email', name: 'Introduction Email', description: 'First contact with potential client', lastUsed: '2 hours ago', popularity: 95 },
  { id: '2', type: 'proposal', name: 'Service Proposal', description: 'Detailed service offering template', lastUsed: 'Yesterday', popularity: 88 },
  { id: '3', type: 'social', name: 'LinkedIn Post', description: 'Professional network update', lastUsed: '3 days ago', popularity: 76 },
  { id: '4', type: 'followup', name: 'Meeting Follow-up', description: 'Post-meeting summary and next steps', popularity: 92 },
];

const ContentForgeHub: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [selectedType, setSelectedType] = useState<ContentType>('email');
  const [tone, setTone] = useState<ContentTone>('professional');
  const [creativity, setCreativity] = useState(50);
  const [length, setLength] = useState(100);
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [context, setContext] = useState('');
  
  const themeAccents = getThemeAccents(themeMode);
  const themeGlass = getThemeGlass(themeMode);

  const contentTypes = [
    { value: 'email', label: 'Email', icon: <EmailIcon /> },
    { value: 'proposal', label: 'Proposal', icon: <ProposalIcon /> },
    { value: 'social', label: 'Social', icon: <SocialIcon /> },
    { value: 'blog', label: 'Blog', icon: <BlogIcon /> },
    { value: 'followup', label: 'Follow-up', icon: <EmailIcon /> },
  ];

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'persuasive', label: 'Persuasive' },
    { value: 'casual', label: 'Casual' },
    { value: 'formal', label: 'Formal' },
  ];

  const handleGenerate = () => {
    setGenerating(true);
    // Simulate content generation
    setTimeout(() => {
      setGeneratedContent(`Subject: Introducing Our Premium Medical Solutions

Dear Dr. Smith,

I hope this message finds you well. I wanted to reach out to introduce our latest innovations in medical technology that have been transforming practices across the country.

Our solutions have helped practices like yours:
• Increase efficiency by 40%
• Reduce patient wait times by 25%
• Improve patient satisfaction scores by 35%

I'd love to schedule a brief 15-minute call to discuss how we can help your practice achieve similar results. Would next Tuesday or Wednesday afternoon work for your schedule?

Looking forward to connecting.

Best regards,
[Your Name]`);
      setGenerating(false);
    }, 2000);
  };

  const stats = {
    contentGenerated: 847,
    timeSaved: '23.5 hrs',
    avgEngagement: '68%',
    templates: 24,
  };

  return (
    <Box>
      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Content Generated', value: stats.contentGenerated, color: themeAccents.primary },
          { label: 'Time Saved', value: stats.timeSaved, color: themeAccents.secondary },
          { label: 'Avg Engagement', value: stats.avgEngagement, color: themeAccents.glow },
          { label: 'Templates', value: stats.templates, color: themeAccents.primary },
        ].map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Card
              sx={{
                ...themeGlass,
                p: 2,
                textAlign: 'center',
                border: `1px solid ${alpha(stat.color, 0.2)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  borderColor: alpha(stat.color, 0.4),
                },
              }}
            >
              <Typography variant="h4" sx={{ color: stat.color, fontWeight: 600 }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {stat.label}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Content Creation Panel */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              ...themeGlass,
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CreateIcon sx={{ color: themeAccents.primary }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Content Forge
                </Typography>
              </Box>
              <IconButton onClick={() => setShowAdvanced(!showAdvanced)}>
                <TuneIcon />
              </IconButton>
            </Box>

            {/* Content Type Selector */}
            <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                {contentTypes.map((type) => (
                  <Chip
                    key={type.value}
                    label={type.label}
                    icon={type.icon}
                    onClick={() => setSelectedType(type.value as ContentType)}
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: selectedType === type.value 
                        ? alpha(themeAccents.primary, 0.2)
                        : 'transparent',
                      borderColor: selectedType === type.value 
                        ? themeAccents.primary
                        : alpha(theme.palette.divider, 0.2),
                      border: '1px solid',
                      '&:hover': {
                        backgroundColor: alpha(themeAccents.primary, 0.1),
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Content Configuration */}
            <Box sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* Context Input */}
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Context & Requirements"
                  placeholder="Describe what you need: target audience, key points, specific requirements..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.3),
                    },
                  }}
                />

                {/* Tone Selector */}
                <FormControl fullWidth size="small">
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Tone
                  </Typography>
                  <Select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as ContentTone)}
                    sx={{
                      backgroundColor: alpha(theme.palette.background.paper, 0.3),
                    }}
                  >
                    {toneOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Advanced Options */}
                <Collapse in={showAdvanced}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Creativity Level: {creativity}%
                      </Typography>
                      <Slider
                        value={creativity}
                        onChange={(_, value) => setCreativity(value as number)}
                        sx={{
                          color: themeAccents.primary,
                          '& .MuiSlider-thumb': {
                            backgroundColor: themeAccents.glow,
                          },
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Content Length: {length} words
                      </Typography>
                      <Slider
                        value={length}
                        onChange={(_, value) => setLength(value as number)}
                        min={50}
                        max={500}
                        step={50}
                        sx={{
                          color: themeAccents.secondary,
                          '& .MuiSlider-thumb': {
                            backgroundColor: themeAccents.glow,
                          },
                        }}
                      />
                    </Box>
                  </Stack>
                </Collapse>

                {/* Generate Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<AIIcon />}
                  onClick={handleGenerate}
                  disabled={generating || !context}
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    background: generating 
                      ? undefined
                      : `linear-gradient(135deg, ${themeAccents.primary}, ${themeAccents.glow})`,
                  }}
                >
                  {generating ? 'Generating...' : 'Generate Content'}
                </Button>

                {generating && (
                  <LinearProgress
                    sx={{
                      backgroundColor: alpha(themeAccents.primary, 0.1),
                      '& .MuiLinearProgress-bar': {
                        background: `linear-gradient(90deg, ${themeAccents.primary}, ${themeAccents.glow})`,
                      },
                    }}
                  />
                )}
              </Stack>
            </Box>

            {/* Generated Content */}
            {generatedContent && (
              <Fade in>
                <Box
                  sx={{
                    p: 3,
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Generated Content
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small" onClick={() => navigator.clipboard.writeText(generatedContent)}>
                        <CopyIcon />
                      </IconButton>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={handleGenerate}>
                        <RegenerateIcon />
                      </IconButton>
                    </Stack>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: alpha(theme.palette.background.paper, 0.3),
                      borderRadius: '12px',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                    }}
                  >
                    {generatedContent}
                  </Box>
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<SendIcon />}
                      sx={{
                        background: `linear-gradient(135deg, ${themeAccents.primary}, ${themeAccents.glow})`,
                      }}
                    >
                      Send Now
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<SaveIcon />}
                    >
                      Save as Template
                    </Button>
                  </Stack>
                </Box>
              </Fade>
            )}
          </Box>
        </Grid>

        {/* Templates Sidebar */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              ...themeGlass,
              borderRadius: '16px',
              p: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Popular Templates
            </Typography>
            <Stack spacing={2}>
              {mockTemplates.map((template) => (
                <Card
                  key={template.id}
                  sx={{
                    p: 2,
                    backgroundColor: alpha(theme.palette.background.paper, 0.3),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.5),
                      borderColor: alpha(themeAccents.primary, 0.3),
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {template.name}
                    </Typography>
                    <Chip
                      label={`${template.popularity}%`}
                      size="small"
                      sx={{
                        backgroundColor: alpha(themeAccents.glow, 0.1),
                        color: themeAccents.glow,
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    {template.description}
                  </Typography>
                  {template.lastUsed && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
                      Last used: {template.lastUsed}
                    </Typography>
                  )}
                </Card>
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContentForgeHub;