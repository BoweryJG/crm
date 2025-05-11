import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
  Button,
  TextField,
  Chip,
  Stack,
  useTheme
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';

import { ResearchProject, ResearchDocument, ResearchDocumentType } from '../../types/research';
import researchAIService from '../../services/research/researchAIService';
import researchService from '../../services/research/researchService';

interface ResearchInsightsProps {
  project?: ResearchProject;
  documents?: ResearchDocument[];
  userId: string;
  onInsightGenerated?: (document: ResearchDocument) => void;
}

interface Insight {
  id: string;
  title: string;
  content: string;
  type: 'trend' | 'opportunity' | 'risk' | 'recommendation';
  confidence: number;
  tags: string[];
}

const ResearchInsights: React.FC<ResearchInsightsProps> = ({
  project,
  documents = [],
  userId,
  onInsightGenerated
}) => {
  const theme = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [customQuery, setCustomQuery] = useState('');
  const [selectedInsightTypes, setSelectedInsightTypes] = useState<string[]>([
    'trend', 'opportunity', 'risk', 'recommendation'
  ]);

  // Load insights when project or documents change
  useEffect(() => {
    if (project && documents.length > 0) {
      extractInsightsFromDocuments();
    }
  }, [project, documents]);

  // Extract insights from existing documents
  const extractInsightsFromDocuments = () => {
    // Find documents that are already insights
    const insightDocs = documents.filter(doc => 
      doc.tags?.includes('insight') || 
      doc.title.toLowerCase().includes('insight') ||
      doc.title.toLowerCase().includes('analysis')
    );
    
    if (insightDocs.length === 0) return;
    
    // Convert documents to insight format
    const extractedInsights: Insight[] = insightDocs.map(doc => {
      // Determine insight type based on tags or content
      let type: 'trend' | 'opportunity' | 'risk' | 'recommendation' = 'recommendation';
      
      if (doc.tags?.includes('trend') || doc.title.toLowerCase().includes('trend')) {
        type = 'trend';
      } else if (doc.tags?.includes('opportunity') || doc.title.toLowerCase().includes('opportunity')) {
        type = 'opportunity';
      } else if (doc.tags?.includes('risk') || doc.title.toLowerCase().includes('risk')) {
        type = 'risk';
      }
      
      // Extract confidence level if present in content
      let confidence = 85; // Default confidence
      const confidenceMatch = doc.content.match(/confidence:?\s*(\d+)%/i);
      if (confidenceMatch && confidenceMatch[1]) {
        confidence = parseInt(confidenceMatch[1], 10);
      }
      
      return {
        id: doc.id,
        title: doc.title,
        content: doc.content,
        type,
        confidence,
        tags: doc.tags || []
      };
    });
    
    setInsights(extractedInsights);
  };

  // Generate new insights based on research documents
  const generateInsights = async () => {
    if (!project) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Get research prompts from the service
      const { data: prompts, error: promptsError } = await researchService.getResearchPrompts();
      if (promptsError) throw promptsError;
      
      // Find a suitable prompt for insights or use the first one
      const insightPrompt = prompts?.find(p => 
        p.category.toLowerCase().includes('insight') || 
        p.prompt_name.toLowerCase().includes('insight')
      );
      
      if (!insightPrompt) {
        throw new Error('No suitable insight prompt found');
      }
      
      // Extract variables from research data
      const variables = researchAIService.extractResearchVariables(
        project,
        documents
      );
      
      // Add custom query if provided
      if (customQuery) {
        variables.custom_query = customQuery;
      }
      
      // Add filter for insight types
      variables.insight_types = selectedInsightTypes.join(', ');
      
      // Generate content
      const result = await researchAIService.generateResearchContent(
        insightPrompt.id,
        variables
      );
      
      if (result.error) throw result.error;
      if (!result.content) throw new Error('No insights were generated');
      
      // Save as document
      const newDocument: Omit<ResearchDocument, 'id' | 'created_at' | 'updated_at'> = {
        title: customQuery 
          ? `Insights: ${customQuery}` 
          : `Research Insights for ${project.title}`,
        content: result.content,
        document_type: ResearchDocumentType.OTHER,
        created_by: userId,
        is_ai_generated: true,
        version: 1,
        project_id: project.id,
        tags: ['insights', 'ai-generated', ...selectedInsightTypes]
      };
      
      const { data: savedDoc, error: saveError } = await researchService.createResearchDocument(newDocument);
      
      if (saveError) throw saveError;
      
      // Notify parent component
      if (savedDoc && onInsightGenerated) {
        onInsightGenerated(savedDoc);
      }
      
      // Parse insights from the generated content
      const parsedInsights = parseInsightsFromContent(result.content);
      setInsights(prevInsights => [...parsedInsights, ...prevInsights]);
      
      // Reset custom query
      setCustomQuery('');
      
    } catch (err) {
      console.error('Error generating insights:', err);
      setError(err as Error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Parse insights from generated content
  const parseInsightsFromContent = (content: string): Insight[] => {
    const parsedInsights: Insight[] = [];
    
    // Split content by sections (assuming each insight is separated by headers)
    const sections = content.split(/#{2,3}\s+/);
    
    sections.forEach((section, index) => {
      if (index === 0 && !section.trim().length) return; // Skip empty first section
      
      const lines = section.split('\n').filter(line => line.trim().length > 0);
      if (lines.length === 0) return;
      
      const title = lines[0].replace(/^[#\s]+/, '').trim();
      const content = lines.slice(1).join('\n').trim();
      
      // Determine type based on content
      let type: 'trend' | 'opportunity' | 'risk' | 'recommendation' = 'recommendation';
      
      if (title.toLowerCase().includes('trend') || content.toLowerCase().includes('trend analysis')) {
        type = 'trend';
      } else if (title.toLowerCase().includes('opportunity') || content.toLowerCase().includes('opportunity')) {
        type = 'opportunity';
      } else if (title.toLowerCase().includes('risk') || content.toLowerCase().includes('risk')) {
        type = 'risk';
      }
      
      // Extract confidence if present
      let confidence = 85; // Default confidence
      const confidenceMatch = content.match(/confidence:?\s*(\d+)%/i);
      if (confidenceMatch && confidenceMatch[1]) {
        confidence = parseInt(confidenceMatch[1], 10);
      }
      
      // Extract tags
      const tags: string[] = ['insight'];
      tags.push(type);
      
      // Look for keywords to add as tags
      const keywordMatches = content.match(/keywords?:?\s*([^.]+)/i);
      if (keywordMatches && keywordMatches[1]) {
        const keywords = keywordMatches[1].split(',').map(k => k.trim().toLowerCase());
        tags.push(...keywords);
      }
      
      parsedInsights.push({
        id: `insight-${Date.now()}-${index}`,
        title,
        content,
        type,
        confidence,
        tags
      });
    });
    
    return parsedInsights;
  };

  // Toggle insight type selection
  const toggleInsightType = (type: string) => {
    setSelectedInsightTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Get icon for insight type
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUpIcon />;
      case 'opportunity':
        return <LightbulbIcon />;
      case 'risk':
        return <PsychologyIcon />;
      case 'recommendation':
      default:
        return <SearchIcon />;
    }
  };

  // Get color for insight type
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend':
        return theme.palette.info.main;
      case 'opportunity':
        return theme.palette.success.main;
      case 'risk':
        return theme.palette.error.main;
      case 'recommendation':
      default:
        return theme.palette.secondary.main;
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Research Insights
      </Typography>
      
      {!project ? (
        <Typography color="text.secondary">
          Please select a project to view insights.
        </Typography>
      ) : (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Generate AI Insights
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Insight Types:
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                {['trend', 'opportunity', 'risk', 'recommendation'].map(type => (
                  <Chip
                    key={type}
                    label={type.charAt(0).toUpperCase() + type.slice(1)}
                    color={selectedInsightTypes.includes(type) ? 'primary' : 'default'}
                    onClick={() => toggleInsightType(type)}
                    icon={getInsightIcon(type)}
                  />
                ))}
              </Stack>
            </Box>
            
            <TextField
              label="Custom Insight Query (optional)"
              fullWidth
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="E.g., 'Identify emerging trends in dental implant technology' or 'Analyze competitive landscape for NYC aesthetic practices'"
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={generateInsights}
                disabled={isGenerating || documents.length === 0}
                startIcon={isGenerating ? <CircularProgress size={20} /> : <LightbulbIcon />}
              >
                {isGenerating ? 'Generating...' : 'Generate Insights'}
              </Button>
            </Box>
            
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                Error: {error.message}
              </Typography>
            )}
            
            {documents.length === 0 && (
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                No research documents available. Add some documents to generate insights.
              </Typography>
            )}
          </Paper>
          
          {insights.length > 0 ? (
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                {insights.map((insight) => (
                  <Card key={insight.id} sx={{ height: '100%' }}>
                    <CardHeader
                      title={insight.title}
                      titleTypographyProps={{ variant: 'h6' }}
                      avatar={
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: `${getInsightColor(insight.type)}20`,
                            color: getInsightColor(insight.type)
                          }}
                        >
                          {getInsightIcon(insight.type)}
                        </Box>
                      }
                      action={
                        <Chip 
                          label={`${insight.confidence}% Confidence`}
                          size="small"
                          color={
                            insight.confidence > 85 ? 'success' :
                            insight.confidence > 70 ? 'info' :
                            insight.confidence > 50 ? 'warning' : 'error'
                          }
                        />
                      }
                    />
                    <Divider />
                    <CardContent>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {insight.content.length > 300 
                          ? `${insight.content.substring(0, 300)}...` 
                          : insight.content}
                      </Typography>
                      
                      {insight.tags.length > 0 && (
                        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {insight.tags.filter(tag => tag !== 'insight' && tag !== insight.type).map(tag => (
                            <Chip key={tag} label={tag} size="small" variant="outlined" />
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          ) : (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              No insights available. Generate insights or add documents with insights.
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default ResearchInsights;
