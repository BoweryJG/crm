// SUIS Phase 8: Learning Center & System Optimization
// AI-Powered Learning Pathway Component

import React, { useState, useEffect } from 'react';
import { useSUISSafe } from '../hooks/useSUISSafe';
import { LearningModule, UserProgress } from '../../services/learningCenterService';
import { 
  BookOpen, Award, Clock, CheckCircle, PlayCircle, 
  Lock, TrendingUp, Users, Brain, Trophy, ChevronRight,
  Star, BarChart, Target, Zap
} from 'lucide-react';
import { useAuth } from '../../auth';
import { useNavigate } from 'react-router-dom';
import { useAppMode } from '../../contexts/AppModeContext';

// Local interface for mock learning paths
interface LearningPath {
  id: string;
  name: string;
  description: string;
  modules: LearningModule[];
  targetAudience: string[];
  totalCredits: number;
  estimatedDuration: number;
  createdAt: string;
  updatedAt: string;
}

interface ModuleCardProps {
  module: LearningModule;
  progress?: UserProgress;
  onStart: (moduleId: string) => void;
  isLocked: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, progress, onStart, isLocked }) => {
  const getStatusIcon = () => {
    if (isLocked) return <Lock className="w-5 h-5 text-gray-400" />;
    if (progress?.status === 'completed' || progress?.status === 'certified') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (progress?.status === 'in_progress') return <PlayCircle className="w-5 h-5 text-blue-500" />;
    return <BookOpen className="w-5 h-5 text-gray-500" />;
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completionPercentage = progress?.progress_percentage || 0;

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all p-6 ${
        isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={() => !isLocked && onStart(module.id)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            {getStatusIcon()}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-2">
              {module.title}
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {module.description}
          </p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(module.difficulty_level)}`}>
          {module.difficulty_level}
        </span>
      </div>

      <div className="space-y-3">
        {/* Progress Bar */}
        {progress && progress.status === 'in_progress' && (
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{progress.sections_completed.length} sections completed</span>
              <span>{Math.round(completionPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Module Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            {module.estimated_duration} min
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Award className="w-4 h-4 mr-1" />
            {module.ce_credits || 0} credits
          </div>
        </div>

        {/* Prerequisites */}
        {module.prerequisites.length > 0 && (
          <div className="text-xs text-gray-500">
            Prerequisites: {module.prerequisites.join(', ')}
          </div>
        )}

        {/* Action Button */}
        <button
          disabled={isLocked}
          className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
            isLocked 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : progress?.status === 'completed'
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : progress?.status === 'in_progress'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isLocked ? 'Locked' : 
           progress?.status === 'completed' ? 'Review' :
           progress?.status === 'in_progress' ? 'Continue' :
           'Start'}
        </button>
      </div>
    </div>
  );
};

interface PathwayProgressProps {
  path: LearningPath;
  totalCredits: number;
  completedModules: number;
}

const PathwayProgress: React.FC<PathwayProgressProps> = ({ path, totalCredits, completedModules }) => {
  const totalModules = path.modules.length;
  const progressPercentage = (completedModules / totalModules) * 100;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold">{path.name}</h2>
          <p className="text-blue-100">{path.description}</p>
        </div>
        <Trophy className="w-12 h-12 text-yellow-300" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-blue-100 mb-1">Progress</p>
          <div className="flex items-end">
            <span className="text-3xl font-bold">{Math.round(progressPercentage)}%</span>
            <span className="text-sm text-blue-100 ml-2 mb-1">
              ({completedModules}/{totalModules} modules)
            </span>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-blue-100 mb-1">Credits Earned</p>
          <div className="flex items-center">
            <span className="text-3xl font-bold">{totalCredits}</span>
            <Award className="w-6 h-6 ml-2 text-yellow-300" />
          </div>
        </div>
        
        <div>
          <p className="text-sm text-blue-100 mb-1">Current Streak</p>
          <div className="flex items-center">
            <span className="text-3xl font-bold">7</span>
            <span className="text-sm text-blue-100 ml-2">days</span>
            <Zap className="w-6 h-6 ml-2 text-yellow-300" />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="w-full bg-white/20 rounded-full h-3">
          <div 
            className="bg-white h-3 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const LearningPathway: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDemo } = useAppMode();
  const { state, actions } = useSUISSafe();
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [userProgress, setUserProgress] = useState<Map<string, UserProgress>>(new Map());
  const [activeModule, setActiveModule] = useState<LearningModule | null>(null);

  // Mock learning paths
  const learningPaths: LearningPath[] = [
    {
      id: '1',
      name: 'Sales Excellence Pathway',
      description: 'Master the art of medical device sales',
      modules: [
        {
          id: 'mod1',
          title: 'Understanding Medical Device Sales',
          description: 'Foundation course on medical device industry and sales process',
          category: 'sales' as const,
          difficulty_level: 'beginner',
          estimated_duration: 45,
          content_type: 'mixed',
          content: {
            sections: [],
            resources: []
          },
          prerequisites: [],
          learning_objectives: ['Understand basics of medical device sales', 'Learn industry terminology'],
          certification_eligible: true,
          ce_credits: 10,
          tags: ['Industry Knowledge', 'Sales Fundamentals'],
          instructor: {
            name: 'Dr. Smith',
            credentials: 'MBA, PhD',
            bio: 'Expert in medical device sales'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          published: true,
          enrollment_count: 0,
          average_rating: 0,
          completion_rate: 0
        },
        {
          id: 'mod2',
          title: 'Advanced Consultative Selling',
          description: 'Deep dive into consultative selling techniques for medical professionals',
          category: 'sales' as const,
          difficulty_level: 'intermediate',
          estimated_duration: 60,
          content_type: 'mixed',
          content: {
            sections: [],
            resources: []
          },
          prerequisites: ['mod1'],
          learning_objectives: ['Master consultative selling techniques', 'Learn needs analysis'],
          certification_eligible: true,
          ce_credits: 15,
          tags: ['Consultative Selling', 'Needs Analysis'],
          instructor: {
            name: 'Dr. Smith',
            credentials: 'MBA, PhD',
            bio: 'Expert in medical device sales'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          published: true,
          enrollment_count: 0,
          average_rating: 0,
          completion_rate: 0
        },
        {
          id: 'mod3',
          title: 'Negotiation Mastery',
          description: 'Advanced negotiation strategies for high-value medical device deals',
          category: 'sales' as const,
          difficulty_level: 'advanced',
          estimated_duration: 90,
          content_type: 'mixed',
          content: {
            sections: [],
            resources: []
          },
          prerequisites: ['mod2'],
          learning_objectives: ['Master negotiation techniques', 'Learn deal closing strategies'],
          certification_eligible: true,
          ce_credits: 20,
          tags: ['Negotiation', 'Deal Closing'],
          instructor: {
            name: 'Dr. Smith',
            credentials: 'MBA, PhD',
            bio: 'Expert in medical device sales'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          published: true,
          enrollment_count: 0,
          average_rating: 0,
          completion_rate: 0
        }
      ],
      targetAudience: ['sales_rep', 'account_manager'],
      totalCredits: 45,
      estimatedDuration: 195,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Product Specialist Certification',
      description: 'Become a certified product specialist',
      modules: [
        {
          id: 'mod4',
          title: 'Product Knowledge Essentials',
          description: 'Comprehensive overview of product portfolio',
          category: 'sales' as const,
          difficulty_level: 'beginner',
          estimated_duration: 30,
          content_type: 'mixed',
          content: {
            sections: [],
            resources: []
          },
          prerequisites: [],
          learning_objectives: ['Understand product portfolio', 'Learn product features'],
          certification_eligible: true,
          ce_credits: 8,
          tags: ['Product Knowledge'],
          instructor: {
            name: 'Dr. Johnson',
            credentials: 'MD',
            bio: 'Product specialist'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          published: true,
          enrollment_count: 0,
          average_rating: 0,
          completion_rate: 0
        }
      ],
      targetAudience: ['product_specialist'],
      totalCredits: 8,
      estimatedDuration: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Mock progress data - moved before conditional return to follow Rules of Hooks
  useEffect(() => {
    const mockProgress = new Map<string, UserProgress>();
    mockProgress.set('mod1', {
      user_id: state.user?.id || '',
      module_id: 'mod1',
      status: 'completed',
      progress_percentage: 100,
      time_spent: 42,
      sections_completed: ['section1', 'section2', 'section3', 'section4', 'section5'],
      quiz_scores: [
        { section_id: 'quiz1', score: 85, attempts: 1, best_score: 85 },
        { section_id: 'quiz2', score: 90, attempts: 1, best_score: 90 },
        { section_id: 'quiz3', score: 88, attempts: 1, best_score: 88 }
      ],
      assessment_scores: [],
      notes: '',
      bookmarks: [],
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      certificate_issued: new Date().toISOString(),
      last_accessed: new Date().toISOString()
    });
    mockProgress.set('mod2', {
      user_id: state.user?.id || '',
      module_id: 'mod2',
      status: 'in_progress',
      progress_percentage: Math.round((3 / 7) * 100),
      time_spent: 25,
      sections_completed: ['section1', 'section2', 'section3'],
      quiz_scores: [
        { section_id: 'quiz1', score: 82, attempts: 1, best_score: 82 }
      ],
      assessment_scores: [],
      notes: '',
      bookmarks: [],
      started_at: new Date().toISOString(),
      last_accessed: new Date().toISOString()
    });
    setUserProgress(mockProgress);
    setSelectedPath(learningPaths[0]);
  }, []);

  const isModuleLocked = (module: LearningModule): boolean => {
    if (module.prerequisites.length === 0) return false;
    
    // Check if all prerequisites are completed
    return !module.prerequisites.every(prereq => {
      const prereqModule = selectedPath?.modules.find(m => m.title === prereq);
      if (!prereqModule) return false;
      const progress = userProgress.get(prereqModule.id);
      return progress?.status === 'completed' || progress?.status === 'certified';
    });
  };

  const handleStartModule = (moduleId: string) => {
    const module = selectedPath?.modules.find(m => m.id === moduleId);
    if (module && !isModuleLocked(module)) {
      setActiveModule(module);
    }
  };

  const calculateTotalCredits = (): number => {
    let total = 0;
    userProgress.forEach((progress) => {
      if (progress.status === 'completed' || progress.status === 'certified') {
        const module = selectedPath?.modules.find(m => m.id === progress.module_id);
        if (module) total += module.ce_credits || 0;
      }
    });
    return total;
  };

  const calculateCompletedModules = (): number => {
    let count = 0;
    userProgress.forEach((progress) => {
      if (progress.status === 'completed' || progress.status === 'certified') count++;
    });
    return count;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Learning Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isDemo || !user ? 'Demo mode - Explore AI-powered learning pathways' : 'Enhance your skills with AI-powered learning pathways'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {(isDemo || !user) && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
              Demo Mode
            </span>
          )}
          <button className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200">
            <BarChart className="w-5 h-5 mr-2" />
            My Progress
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Brain className="w-5 h-5 mr-2" />
            AI Recommendations
          </button>
        </div>
      </div>

      {/* Pathway Selector */}
      <div className="flex space-x-4 overflow-x-auto pb-2 suis-scrollable horizontal-scroll-container" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#d1d5db transparent'
      }}>
        {learningPaths.map(path => (
          <button
            key={path.id}
            onClick={() => setSelectedPath(path)}
            className={`px-6 py-3 rounded-lg whitespace-nowrap transition-all ${
              selectedPath?.id === path.id
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
            }`}
          >
            {path.name}
          </button>
        ))}
      </div>

      {selectedPath && (
        <>
          {/* Progress Overview */}
          <PathwayProgress 
            path={selectedPath} 
            totalCredits={calculateTotalCredits()}
            completedModules={calculateCompletedModules()}
          />

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedPath.modules.map(module => (
              <ModuleCard
                key={module.id}
                module={module}
                progress={userProgress.get(module.id)}
                onStart={handleStartModule}
                isLocked={isModuleLocked(module)}
              />
            ))}
          </div>

          {/* Recommended Next Steps */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              Recommended Next Steps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Complete Current Module
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Finish "Advanced Consultative Selling" to unlock next modules
                </p>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Continue Learning →
                </button>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Practice with AI Coach
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Role-play sales scenarios with our AI-powered coach
                </p>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Start Practice →
                </button>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Join Study Group
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Connect with peers on similar learning journeys
                </p>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Find Groups →
                </button>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Recent Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
                <p className="text-sm font-medium">First Module</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-sm font-medium">7-Day Streak</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
              <div className="text-center opacity-50">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium">Team Leader</p>
                <p className="text-xs text-gray-500">Locked</p>
              </div>
              <div className="text-center opacity-50">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium">Expert Level</p>
                <p className="text-xs text-gray-500">Locked</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LearningPathway;