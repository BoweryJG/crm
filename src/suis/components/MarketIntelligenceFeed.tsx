// SUIS Phase 7: Market Intelligence & Notifications
// Real-time Market Intelligence Feed Component

import React, { useState, useEffect } from 'react';
import { useSUIS } from './SUISProvider';
import { MarketIntelligence, SUISNotification } from '../types';
import { 
  TrendingUp, AlertTriangle, Info, Bell, Filter, 
  Globe, Building, Briefcase, Calendar, ExternalLink,
  ChevronRight, Star, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../auth';
import { useNavigate } from 'react-router-dom';

interface IntelligenceItemProps {
  item: MarketIntelligence;
  onSelect: (item: MarketIntelligence) => void;
}

const IntelligenceItem: React.FC<IntelligenceItemProps> = ({ item, onSelect }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(item)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactColor(item.impactAssessment.businessImpact)}`}>
              {item.impactAssessment.businessImpact.toUpperCase()}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {item.intelligenceType.replace(/_/g, ' ').charAt(0).toUpperCase() + item.intelligenceType.slice(1)}
          </h3>
        </div>
        {getTrendIcon(item.trendDirection)}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {item.data.summary || 'New market intelligence available'}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span className="flex items-center">
            <Globe className="w-3 h-3 mr-1" />
            {item.geographicScope}
          </span>
          {item.specialty && (
            <span className="flex items-center">
              <Briefcase className="w-3 h-3 mr-1" />
              {item.specialty}
            </span>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>

      {item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

interface NotificationItemProps {
  notification: SUISNotification;
  onRead: (id: string) => void;
  onAction: (notification: SUISNotification, actionId: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRead, onAction }) => {
  const getIcon = () => {
    switch (notification.notificationType) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'insight':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'recommendation':
        return <Star className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-red-500';
      case 'high':
        return 'border-orange-500';
      case 'medium':
        return 'border-yellow-500';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
        !notification.readAt ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
      onClick={() => !notification.readAt && onRead(notification.id)}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {notification.content.summary}
          </p>
          
          {notification.actionItems.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {notification.actionItems.map((action) => (
                <button
                  key={action.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction(notification, action.id);
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded ${
                    action.primary
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-2">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

const MarketIntelligenceFeed: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, actions } = useSUIS();
  const [selectedIntelligence, setSelectedIntelligence] = useState<MarketIntelligence | null>(null);
  const [activeTab, setActiveTab] = useState<'intelligence' | 'notifications'>('intelligence');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // If no user, show login prompt
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h2 className="text-xl font-semibold">Authentication Required</h2>
        <p className="text-gray-600">The SUIS Market Intelligence Feed requires authentication to access.</p>
        <button 
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const sources = ['all', 'sphere1a', 'market_feed', 'competitor', 'news', 'regulatory'];

  const filteredIntelligence = state.marketIntelligence.filter(item => 
    filterSource === 'all' || item.source === filterSource
  );

  const unreadNotifications = state.notifications.filter(n => !n.readAt);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await actions.fetchMarketIntelligence();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleNotificationAction = async (notification: SUISNotification, actionId: string) => {
    const action = notification.actionItems.find(a => a.id === actionId);
    if (action) {
      switch (action.actionType) {
        case 'navigate':
          // Navigate to the specified URL
          if (action.url) window.location.href = action.url;
          break;
        case 'api_call':
          // Make API call with payload
          console.log('API call:', action.payload);
          break;
        case 'external_link':
          if (action.url) window.open(action.url, '_blank');
          break;
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Market Intelligence & Alerts
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time insights and notifications
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('intelligence')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'intelligence'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Market Intelligence
            {filteredIntelligence.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                {filteredIntelligence.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm relative ${
              activeTab === 'notifications'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Notifications
            {unreadNotifications.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs">
                {unreadNotifications.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'intelligence' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Intelligence Feed */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {sources.map(source => (
                    <option key={source} value={source}>
                      {source === 'all' ? 'All Sources' : source.replace(/_/g, ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Intelligence Items */}
            {filteredIntelligence.length > 0 ? (
              filteredIntelligence.map(item => (
                <IntelligenceItem
                  key={item.id}
                  item={item}
                  onSelect={setSelectedIntelligence}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No intelligence data available
                </p>
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            {selectedIntelligence ? (
              <div>
                <h3 className="font-semibold text-lg mb-4">Intelligence Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Impact Assessment</p>
                    <p className="text-sm mt-1">
                      {selectedIntelligence.impactAssessment.businessImpact} impact expected{' '}
                      {selectedIntelligence.impactAssessment.timeToImpact.replace(/_/g, ' ')}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Affected Areas</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedIntelligence.impactAssessment.affectedAreas.map((area, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Recommended Actions</p>
                    <ul className="mt-1 space-y-1">
                      {selectedIntelligence.impactAssessment.recommendedActions.map((action, idx) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Confidence Score</p>
                    <div className="mt-1 flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${selectedIntelligence.confidenceScore * 100}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {Math.round(selectedIntelligence.confidenceScore * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Info className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  Select an intelligence item to view details
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {state.notifications.length > 0 ? (
            state.notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={actions.markNotificationRead}
                onAction={handleNotificationAction}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No notifications
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketIntelligenceFeed;