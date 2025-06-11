// SUIS Phase 6: Content Generator & Call Analysis
// AI-Powered Content Generation Component

import React, { useState } from 'react';
import { useSUIS } from './SUISProvider';
import { ContentType, GeneratedContent, TargetAudience } from '../types';
import { 
  Mail, FileText, Share2, FileSignature, MessageSquare, Newspaper,
  Wand2, Copy, Download, Eye, Edit3, Check, X, Loader
} from 'lucide-react';

interface ContentTemplate {
  id: string;
  type: ContentType;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const ContentGenerator: React.FC = () => {
  const { state, actions } = useSUIS();
  const [selectedType, setSelectedType] = useState<ContentType>('email');
  const [targetAudience, setTargetAudience] = useState<Partial<TargetAudience>>({
    demographics: {},
    professionalProfile: {
      title: '',
      industry: 'dental',
      experience: 'intermediate',
      companySize: 'medium',
      decisionLevel: 'influencer'
    },
    interests: [],
    painPoints: [],
    preferredTone: 'professional'
  });
  const [procedureFocus, setProcedureFocus] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  const contentTemplates: ContentTemplate[] = [
    {
      id: 'email',
      type: 'email',
      name: 'Email',
      description: 'Professional sales emails',
      icon: <Mail className="w-5 h-5" />,
      color: 'blue'
    },
    {
      id: 'presentation',
      type: 'presentation',
      name: 'Presentation',
      description: 'Sales deck content',
      icon: <FileText className="w-5 h-5" />,
      color: 'purple'
    },
    {
      id: 'social',
      type: 'social',
      name: 'Social Media',
      description: 'LinkedIn & social posts',
      icon: <Share2 className="w-5 h-5" />,
      color: 'green'
    },
    {
      id: 'proposal',
      type: 'proposal',
      name: 'Proposal',
      description: 'Business proposals',
      icon: <FileSignature className="w-5 h-5" />,
      color: 'indigo'
    },
    {
      id: 'follow_up',
      type: 'follow_up',
      name: 'Follow-up',
      description: 'Post-meeting messages',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'yellow'
    },
    {
      id: 'newsletter',
      type: 'newsletter',
      name: 'Newsletter',
      description: 'Educational content',
      icon: <Newspaper className="w-5 h-5" />,
      color: 'pink'
    }
  ];

  const procedureOptions = [
    'Botox & Fillers',
    'Laser Treatments',
    'Body Contouring',
    'Dental Implants',
    'Clear Aligners',
    'Teeth Whitening',
    'Digital Dentistry',
    'Practice Management'
  ];

  const painPointOptions = [
    'Patient acquisition',
    'Revenue growth',
    'Operational efficiency',
    'Competition',
    'Technology adoption',
    'Regulatory compliance',
    'Staff training',
    'Patient satisfaction'
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const content = await actions.generateContent({
        contentType: selectedType,
        targetAudience: targetAudience as TargetAudience,
        procedureFocus,
        tone: targetAudience.preferredTone,
        customInstructions
      });
      
      setGeneratedContent(content);
      setEditedContent(content.contentData.body);
    } catch (error) {
      console.error('Failed to generate content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = editMode ? editedContent : generatedContent?.contentData.body || '';
    navigator.clipboard.writeText(textToCopy);
    // Show toast notification
  };

  const handleDownload = () => {
    const content = editMode ? editedContent : generatedContent?.contentData.body || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedType}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveEdit = () => {
    if (generatedContent) {
      setGeneratedContent({
        ...generatedContent,
        contentData: {
          ...generatedContent.contentData,
          body: editedContent
        }
      });
    }
    setEditMode(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Content Generator</h2>
        <p className="text-gray-600 dark:text-gray-400">Create AI-powered content for your sales activities</p>
      </div>

      {/* Content Type Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Content Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {contentTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedType(template.type)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedType === template.type
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className={`text-${template.color}-600 mb-2`}>{template.icon}</div>
              <p className="text-sm font-medium">{template.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Target Audience */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Target Audience</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Professional Title
              </label>
              <input
                type="text"
                value={targetAudience.professionalProfile?.title || ''}
                onChange={(e) => setTargetAudience({
                  ...targetAudience,
                  professionalProfile: {
                    ...targetAudience.professionalProfile!,
                    title: e.target.value
                  }
                })}
                placeholder="e.g., Medical Director, Practice Owner"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Industry Focus
              </label>
              <select
                value={targetAudience.professionalProfile?.industry || 'dental'}
                onChange={(e) => setTargetAudience({
                  ...targetAudience,
                  professionalProfile: {
                    ...targetAudience.professionalProfile!,
                    industry: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="dental">Dental</option>
                <option value="aesthetic">Aesthetic</option>
                <option value="medical">Medical</option>
                <option value="combined">Combined Practice</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tone Preference
              </label>
              <select
                value={targetAudience.preferredTone || 'professional'}
                onChange={(e) => setTargetAudience({
                  ...targetAudience,
                  preferredTone: e.target.value as any
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="technical">Technical</option>
                <option value="friendly">Friendly</option>
                <option value="authoritative">Authoritative</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pain Points
              </label>
              <div className="grid grid-cols-2 gap-2">
                {painPointOptions.map((point) => (
                  <label key={point} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={targetAudience.painPoints?.includes(point) || false}
                      onChange={(e) => {
                        const painPoints = targetAudience.painPoints || [];
                        if (e.target.checked) {
                          setTargetAudience({
                            ...targetAudience,
                            painPoints: [...painPoints, point]
                          });
                        } else {
                          setTargetAudience({
                            ...targetAudience,
                            painPoints: painPoints.filter(p => p !== point)
                          });
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{point}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Configuration */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Content Configuration</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Procedure Focus
              </label>
              <select
                value={procedureFocus}
                onChange={(e) => setProcedureFocus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a procedure...</option>
                {procedureOptions.map((proc) => (
                  <option key={proc} value={proc}>{proc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Custom Instructions
              </label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Add any specific requirements or details..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !procedureFocus}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate Content
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Content */}
      {generatedContent && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Generated Content</h3>
            <div className="flex space-x-2">
              {editMode ? (
                <>
                  <button
                    onClick={handleSaveEdit}
                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setEditedContent(generatedContent.contentData.body);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCopy}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {editMode ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {generatedContent.contentData.body}
              </pre>
            </div>
          )}

          {/* Metadata */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Word Count:</span>
                <span className="ml-2 font-medium">
                  {generatedContent.contentData.metadata.wordCount}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Reading Time:</span>
                <span className="ml-2 font-medium">
                  {generatedContent.contentData.metadata.readingTime} min
                </span>
              </div>
              <div>
                <span className="text-gray-500">Tone:</span>
                <span className="ml-2 font-medium capitalize">
                  {generatedContent.contentData.metadata.tone}
                </span>
              </div>
              <div>
                <span className="text-gray-500">AI Model:</span>
                <span className="ml-2 font-medium">
                  {generatedContent.aiModelUsed}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;