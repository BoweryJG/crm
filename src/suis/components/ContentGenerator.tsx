// SUIS Content Generator
// AI-Powered content generation with real integration

import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAppMode } from '../../contexts/AppModeContext';
import { generateContentTemplates } from '../../services/mockData/suisIntelligenceMockData';

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDemo } = useAppMode();
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
  const [demoLoading, setDemoLoading] = useState(false);
  const [mockTemplates] = useState(generateContentTemplates());

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
    
    if (isDemo || !user) {
      // Demo mode content generation
      setDemoLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate demo content based on request
        const demoContent = generateDemoContent(contentRequest);
        setGeneratedContent(demoContent);
        setEditedContent(demoContent.contentData.body);
      } catch (err: any) {
        setError('Failed to generate demo content');
      } finally {
        setDemoLoading(false);
      }
    } else {
      // Real content generation
      try {
        const result = await generateContent(contentRequest);
        setGeneratedContent(result);
        setEditedContent(result?.contentData?.body || '');
      } catch (err: any) {
        setError(err.message || 'Failed to generate content');
      }
    }
  };
  
  const generateDemoContent = (request: ContentRequest) => {
    const templates: Record<string, Record<string, string>> = {
      email: {
        dental: `Subject: Revolutionize Your Practice with Advanced Implant Solutions

Dear Dr. [Name],

I hope this message finds you well. I wanted to reach out regarding the latest advancements in dental implant technology that are transforming practices across [Location].

Our new YOMI robotic surgery system has helped practices like yours:
• Increase implant placement accuracy by 92%
• Reduce chair time by 45%
• Improve patient satisfaction scores by 38%

I'd love to schedule a brief 15-minute demo to show you how this technology could benefit your specific practice needs.

Best regards,
[Your Name]
[Your Title]
RepSphere AI`,
        aesthetic: `Subject: Elevate Your Med Spa with Next-Gen Body Contouring

Dear [Name],

I'm reaching out because I noticed your practice's commitment to offering cutting-edge aesthetic treatments.

Our latest BTL Exilis Ultra 360 system is revolutionizing non-invasive body contouring:
• Simultaneous fat reduction and skin tightening
• Zero downtime for patients
• 96% patient satisfaction rate
• ROI typically achieved within 4 months

Several leading med spas in your area have already integrated this technology. I'd be happy to share their success stories and discuss how this could fit into your current treatment menu.

Would you have 20 minutes this week for a virtual demonstration?

Warm regards,
[Your Name]
RepSphere AI`
      },
      presentation: {
        dental: `SLIDE 1: Title
"Digital Dentistry Revolution: Transforming Patient Care"

SLIDE 2: Current Challenges
• Increasing patient expectations
• Competition from DSOs
• Need for predictable outcomes
• Time efficiency demands

SLIDE 3: Our Solution
[Product Name] - Complete Digital Workflow
• Intraoral scanning in 3 minutes
• Same-day crown delivery
• 98.5% first-fit accuracy
• Seamless lab integration

SLIDE 4: ROI Analysis
• Average case increase: $2,500/month
• Time saved: 8 hours/week
• Patient retention: +34%
• 5-star reviews: +67%

SLIDE 5: Next Steps
• Hands-on demo at your practice
• Custom ROI calculation
• Flexible financing options
• Dedicated training support`,
        aesthetic: `SLIDE 1: Title
"The Future of Non-Invasive Aesthetics"

SLIDE 2: Market Opportunity
• 78% growth in body contouring demand
• Patients seeking non-surgical options
• Average spend per patient: $3,500
• High retention and referral rates

SLIDE 3: Technology Overview
[Product Name] - Multi-Application Platform
• RF + Ultrasound combination
• Face & body applications
• No consumables required
• Minimal training needed

SLIDE 4: Clinical Results
• 94% patient satisfaction
• Visible results in 4-6 weeks
• No downtime or recovery
• FDA cleared for multiple indications

SLIDE 5: Practice Integration
• Complements existing services
• Simple delegation to staff
• Marketing support included
• Proven revenue generator`
      },
      social: {
        dental: `🦷 Did you know? The latest digital implant planning technology can reduce surgery time by 50% while improving accuracy! 

Our partner practices are seeing incredible results with guided implant surgery. Swipe to see before/after cases!

#DigitalDentistry #DentalImplants #PracticeGrowth #DentalTechnology`,
        aesthetic: `✨ Transform your practice with the power of combination therapies! 

Our advanced energy-based devices are helping med spas achieve results that were previously only possible with surgery. 

Ready to elevate your treatment menu? Link in bio!

#MedSpa #Aesthetics #NonInvasive #BeautyTech`
      },
      proposal: {
        dental: `EXECUTIVE SUMMARY
[Practice Name] Digital Transformation Proposal

OBJECTIVES:
• Enhance patient experience through digital workflow
• Increase practice efficiency by 40%
• Improve clinical outcomes with precision technology
• Generate additional revenue streams

PROPOSED SOLUTION:
We recommend implementing our comprehensive digital dentistry suite:

1. Intraoral Scanning System
   - 3-minute full arch scans
   - Direct lab integration
   - Patient education tools
   - Investment: $45,000

2. CAD/CAM Milling Unit
   - Same-day crown delivery
   - Multiple material options
   - 98.5% fit accuracy
   - Investment: $85,000

3. 3D Imaging System
   - Cone beam CT capabilities
   - Implant planning software
   - Orthodontic analysis
   - Investment: $125,000

FINANCIAL ANALYSIS:
• Total Investment: $255,000
• Projected Monthly Revenue Increase: $35,000
• ROI Timeline: 8-10 months
• 5-Year Net Profit Projection: $1.8M

IMPLEMENTATION TIMELINE:
Week 1-2: Equipment installation
Week 3-4: Team training
Week 5-6: Soft launch with select patients
Week 7-8: Full implementation

Next Steps: Schedule executive meeting to discuss terms`,
        aesthetic: `MEDICAL SPA ENHANCEMENT PROPOSAL
[Practice Name] - Next Generation Aesthetics

EXECUTIVE OVERVIEW:
This proposal outlines a strategic investment in advanced energy-based devices to position your practice at the forefront of non-invasive aesthetics.

MARKET OPPORTUNITY:
• 78% annual growth in body contouring
• $4.2B market size by 2025
• 92% patient preference for non-surgical options
• Average treatment revenue: $3,500 per patient

RECOMMENDED TECHNOLOGY STACK:

1. BTL EMFACE
   - Revolutionary facial treatment
   - Simultaneous muscle toning & skin tightening
   - No needles, no downtime
   - Investment: $165,000

2. CoolSculpting Elite
   - Dual applicators for efficiency
   - Improved patient comfort
   - Proven fat reduction results
   - Investment: $125,000

3. Sofwave
   - Next-gen skin tightening
   - Single treatment protocol
   - Minimal discomfort
   - Investment: $95,000

REVENUE PROJECTIONS:
Year 1: $450,000
Year 2: $720,000
Year 3: $980,000

TRAINING & SUPPORT:
• Comprehensive staff certification
• Marketing launch package
• Ongoing clinical support
• KOL networking opportunities

FINANCING OPTIONS:
• 0% financing for 24 months
• Operating lease programs
• Revenue share partnerships

Contact us to schedule a detailed ROI analysis.`
      },
      follow_up: {
        dental: `Subject: Following Up - Digital Dentistry Demo

Hi Dr. [Name],

I wanted to follow up on our conversation last week about upgrading your practice's digital capabilities.

You mentioned that reducing remake rates and improving patient experience were top priorities. Based on our discussion, I've put together some specific case studies from practices similar to yours:

• Dr. Smith (Chicago): Reduced remakes by 87% in first 6 months
• Premier Dental Group: Increased case acceptance by 42%
• Family Dentistry Associates: Added $280K annual revenue

I'm also excited to share that we have a special promotion this month:
- 15% discount on scanner bundles
- Free advanced training package ($5,000 value)
- Extended warranty coverage

Would you be available for a 30-minute demo next Tuesday or Wednesday? I can bring the scanner to your office so your team can experience it firsthand.

Looking forward to helping you transform your practice!

Best regards,
[Your Name]
RepSphere AI`,
        aesthetic: `Subject: Quick Follow-Up - Treatment Menu Expansion

Dear [Name],

Thank you for taking the time to meet with me yesterday. Your vision for expanding the practice's body contouring services really resonated with me.

As promised, I'm sending over the key points we discussed:

✓ Current Challenges:
- Limited non-invasive body options
- Patient demand exceeding capacity
- Competition from new med spas

✓ Proposed Solution Benefits:
- Treat 4x more patients per day
- No consumables = higher profit margins
- Minimal staff training required
- Proven ROI within 4-6 months

I've also attached:
- Clinical white papers you requested
- ROI calculator customized for your practice
- Patient before/after gallery
- Competitive financing options

Next Steps:
1. Schedule live demo with your providers
2. Review financing terms
3. Plan marketing launch strategy

I have a cancellation next Thursday at 2 PM if you'd like to see the device in action at our demo facility. Shall I reserve that time for you?

Best regards,
[Your Name]
RepSphere AI`
      }
    };
    
    const content = templates[request.type]?.[request.targetAudience.specialty] || 
      `This is a demo ${request.type} for ${request.targetAudience.specialty} targeting ${request.targetAudience.role}. 
      
In the full version, our AI will generate completely personalized content based on:
- Your specific products and services
- Target audience insights
- Historical performance data
- Current market trends
- Compliance requirements

The content will be optimized for ${request.tone} tone and ${request.length} length.`;
    
    // Find a matching template
    const template = mockTemplates.find(t => t.type === request.type) || mockTemplates[0];
    
    return {
      id: `demo-${Date.now()}`,
      contentData: {
        body: content,
        metadata: {
          model: 'SUIS AI Demo',
          template: template.name,
          performance: template.performance
        }
      },
      created_at: new Date().toISOString()
    };
  };

  const handleCopy = () => {
    const content = isEditing ? editedContent : generatedContent?.contentData?.body;
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
          body: editedContent
        }
      });
    }
    setIsEditing(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          AI Content Generator
        </Typography>
        {(isDemo || !user) && (
          <Chip label="Demo Mode" color="primary" variant="outlined" size="small" />
        )}
      </Box>
      
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
                disabled={loading || demoLoading}
              >
                {(loading || demoLoading) ? 'Generating...' : 'Generate Content'}
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
                            setEditedContent(generatedContent?.contentData?.body || '');
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

              {(loading || demoLoading) && (
                <Box sx={{ py: 4 }}>
                  <LinearProgress />
                  <Typography align="center" sx={{ mt: 2 }}>
                    {isDemo || !user ? 'Generating demo content...' : 'Generating AI content...'}
                  </Typography>
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {generatedContent && !loading && !demoLoading && (
                <Paper variant="outlined" sx={{ p: 3, minHeight: 400 }}>
                  {!isEditing ? (
                    <Typography style={{ whiteSpace: 'pre-wrap' }}>
                      {generatedContent.contentData?.body || 'No content generated'}
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

              {!generatedContent && !loading && !demoLoading && (
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