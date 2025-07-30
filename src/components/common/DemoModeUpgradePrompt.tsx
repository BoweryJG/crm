import React, { useState } from 'react';
import { AlertCircle, Zap, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getDemoModeConfig } from '../../services/demoModeService';

interface DemoModeUpgradePromptProps {
  context?: 'contacts' | 'pipeline' | 'analytics' | 'general';
  onDismiss?: () => void;
}

export const DemoModeUpgradePrompt: React.FC<DemoModeUpgradePromptProps> = ({ 
  context = 'general',
  onDismiss 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  
  const demoConfig = getDemoModeConfig(user);
  
  // Don't show if not in demo mode
  if (!demoConfig.isDemo || !demoConfig.showUpgradePrompts || !isVisible) {
    return null;
  }
  
  const handleUpgrade = () => {
    navigate('/pricing');
  };
  
  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };
  
  const contextMessages = {
    contacts: {
      title: 'Viewing Demo Contacts',
      message: 'You\'re viewing sample data. Upgrade to access real contact management with unlimited storage.',
      features: ['Import your real contacts', 'Advanced search & filtering', 'Email & SMS integration']
    },
    pipeline: {
      title: 'Demo Pipeline Data',
      message: 'This pipeline shows example deals. Upgrade to track your real opportunities.',
      features: ['Real-time deal tracking', 'Custom pipeline stages', 'Revenue forecasting']
    },
    analytics: {
      title: 'Sample Analytics',
      message: 'These are demo metrics. Upgrade to see your actual performance data.',
      features: ['Real performance metrics', 'Custom dashboards', 'Export reports']
    },
    general: {
      title: 'Demo Mode Active',
      message: 'You\'re in demo mode with limited features. Upgrade for full access.',
      features: ['Unlimited contacts', 'Full CRM features', 'Priority support']
    }
  };
  
  const content = contextMessages[context];
  
  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-2xl border border-purple-400/20 overflow-hidden z-50">
      <div className="relative p-4">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">{content.title}</h3>
        </div>
        
        {/* Message */}
        <p className="text-white/90 text-sm mb-4">
          {content.message}
        </p>
        
        {/* Features */}
        <div className="space-y-2 mb-4">
          {content.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-white/80 text-sm">
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <button
          onClick={handleUpgrade}
          className="w-full py-3 px-4 bg-white text-purple-600 font-semibold rounded-lg
                   flex items-center justify-center gap-2 hover:bg-white/90 transition-all
                   transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Zap className="w-5 h-5" />
          Upgrade for Real Data
        </button>
        
        {/* Disclaimer */}
        <p className="text-xs text-white/60 text-center mt-3">
          Limited to 40 demo contacts • Read-only access
        </p>
      </div>
      
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-lg pointer-events-none">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 
                      opacity-20 blur-sm animate-pulse" />
      </div>
    </div>
  );
};

export default DemoModeUpgradePrompt;