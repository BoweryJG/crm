// SUIS Phase 5: Research Module & OpenRouter Integration
// AI-Powered Research Assistant Component

import React, { useState, useRef, useEffect } from 'react';
import { useSUIS } from './SUISProvider';
import { ResearchQuery, ResearchResponse } from '../types';
import { 
  Brain, Search, Send, Loader, Copy, ThumbsUp, ThumbsDown,
  BookOpen, Target, TrendingUp, AlertCircle, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../auth';
import { useNavigate } from 'react-router-dom';
import { useAppMode } from '../../contexts/AppModeContext';
import { generateResearchProjects } from '../../services/mockData/suisIntelligenceMockData';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  data?: ResearchResponse;
  feedback?: { helpful: boolean };
}

const ResearchAssistant: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDemo } = useAppMode();
  const { state, actions } = useSUIS();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Move useEffect before conditional return to follow Rules of Hooks
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const contextOptions = {
    goals: state.intelligenceProfile?.goals || {},
    specializations: state.intelligenceProfile?.specializations || [],
    recentInsights: state.marketIntelligence.slice(0, 3)
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || demoLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    if (isDemo || !user) {
      // Demo mode research
      setDemoLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate demo response
        const demoResponse = generateDemoResponse(input);
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: demoResponse.summary,
          timestamp: new Date(),
          data: demoResponse
        };

        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'system',
          content: 'Sorry, I encountered an error in demo mode. Please try again.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setDemoLoading(false);
      }
    } else {
      // Real research
      setIsLoading(true);
      try {
        const response = await actions.performResearch(input, {
          currentOpportunities: [],
          activeProjects: [],
          recentInteractions: [],
          userGoals: contextOptions.goals && 'salesTargets' in contextOptions.goals 
            ? Object.values(contextOptions.goals.salesTargets || {}) 
            : [],
          marketConditions: {}
        });

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: response.responseData?.summary || 'I found some insights for you.',
          timestamp: new Date(),
          data: response.responseData
        };

        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'system',
          content: 'Sorry, I encountered an error while researching. Please try again.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const generateDemoResponse = (query: string): ResearchResponse => {
    const mockProjects = generateResearchProjects();
    const relatedProject = mockProjects.find(p => 
      query.toLowerCase().includes('implant') || 
      query.toLowerCase().includes('aesthetic') ||
      query.toLowerCase().includes('market')
    ) || mockProjects[0];
    
    return {
      summary: `Based on my analysis of "${query}", I've identified several key insights that can help inform your strategy. ${relatedProject.aiAnalysis.summary}`,
      keyFindings: relatedProject.findings.map(f => ({
        finding: f.insight,
        confidence: f.confidence / 100,
        sources: [`${f.sources} verified sources`],
        implications: []
      })),
      recommendations: relatedProject.aiAnalysis.recommendations,
      sources: relatedProject.findings.map((f, idx) => ({
        id: `source-${idx}`,
        title: f.title,
        type: 'industry_report' as const,
        credibility: f.confidence / 100,
        relevance: 0.9
      })),
      confidence: relatedProject.findings.reduce((acc, f) => acc + f.confidence, 0) / relatedProject.findings.length / 100,
      limitations: [],
      followUpQuestions: [
        `What specific ${query} models are you considering?`,
        `What is your current patient volume for ${query}?`,
        `What are your main challenges with ${query}?`
      ]
    };
  };

  const handleFeedback = (messageId: string, helpful: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback: { helpful } } : msg
    ));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  const suggestedQueries = [
    "What are the latest trends in aesthetic procedures?",
    "Compare dental implant systems in the market",
    "Best practices for approaching new practices",
    "Market analysis for injectables in my territory"
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Research Assistant
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isDemo || !user ? 'Demo mode - Experience AI research capabilities' : 'Powered by advanced AI for medical device insights'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(isDemo || !user) && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                Demo Mode
              </span>
            )}
            <button
              onClick={() => setShowContext(!showContext)}
              className="flex items-center px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Context
              <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showContext ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Context Panel */}
        {showContext && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Research Context:</p>
            <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
              <div>• Specializations: {contextOptions.specializations.join(', ') || 'None set'}</div>
              <div>• Recent insights: {contextOptions.recentInsights.length} available</div>
              <div>• Active goals: Sales targets configured</div>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Start Your Research
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ask me anything about medical devices, market trends, or sales strategies
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {suggestedQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(query)}
                  className="text-left p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {query}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-3xl ${message.type === 'user' ? 'order-1' : ''}`}>
              <div
                className={`rounded-lg p-4 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.type === 'assistant'
                    ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    : 'bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700'
                }`}
              >
                <p className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {message.content}
                </p>

                {/* Research Results */}
                {message.data && (
                  <div className="mt-4 space-y-3">
                    {/* Key Findings */}
                    {message.data.keyFindings.length > 0 && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                          <Target className="w-4 h-4 mr-1" />
                          Key Findings
                        </h4>
                        <ul className="space-y-1">
                          {message.data.keyFindings.map((finding, idx) => (
                            <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              {finding.finding}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    {message.data.recommendations.length > 0 && (
                      <div className="bg-blue-50 dark:bg-blue-900 rounded p-3">
                        <h4 className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Recommendations
                        </h4>
                        <ul className="space-y-1">
                          {message.data.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-xs text-blue-600 dark:text-blue-400">
                              {idx + 1}. {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Confidence Score */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        Confidence: {Math.round(message.data.confidence * 100)}%
                      </span>
                      {message.data.sources.length > 0 && (
                        <span className="text-gray-500 dark:text-gray-400">
                          {message.data.sources.length} sources
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {message.type === 'assistant' && (
                  <div className="mt-3 flex items-center space-x-3 text-xs">
                    <button
                      onClick={() => copyToClipboard(message.content)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, true)}
                      className={`${
                        message.feedback?.helpful === true
                          ? 'text-green-600'
                          : 'text-gray-500 hover:text-green-600'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, false)}
                      className={`${
                        message.feedback?.helpful === false
                          ? 'text-red-600'
                          : 'text-gray-500 hover:text-red-600'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {(isLoading || demoLoading) && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Loader className="w-4 h-4 animate-spin text-blue-600" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {demoLoading ? 'Generating demo insights...' : 'Researching...'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about procedures, market trends, competitors..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={isLoading || demoLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || demoLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:text-blue-700 disabled:text-gray-400"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          <AlertCircle className="w-3 h-3 inline mr-1" />
          AI-powered research may not always be 100% accurate. Verify important information.
        </p>
      </form>
    </div>
  );
};

export default ResearchAssistant;