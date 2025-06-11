// SUIS Phase 3: Unified Analytics Engine
// Intelligence Dashboard Component

import React, { useEffect, useState } from 'react';
import { useSUIS } from './SUISProvider';
import { UnifiedAnalytics, PerformanceMetrics, Insight } from '../types';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, TrendingDown, AlertCircle, CheckCircle,
  Activity, Target, Users, DollarSign
} from 'lucide-react';

const IntelligenceDashboard: React.FC = () => {
  const { state, actions } = useSUIS();
  const [analytics, setAnalytics] = useState<UnifiedAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch analytics data based on time range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
      }

      // This would normally call the API
      // const data = await actions.fetchAnalytics(startDate, endDate);
      // setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'stable';
  }> = ({ title, value, change, icon, trend }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change !== undefined && (
            <div className="mt-2 flex items-center">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : trend === 'down' ? (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              ) : null}
              <span className={`text-sm ${
                trend === 'up' ? 'text-green-600' : 
                trend === 'down' ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );

  const InsightCard: React.FC<{ insight: Insight }> = ({ insight }) => {
    const getIcon = () => {
      switch (insight.type) {
        case 'opportunity':
          return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'risk':
          return <AlertCircle className="w-5 h-5 text-red-500" />;
        default:
          return <Activity className="w-5 h-5 text-blue-500" />;
      }
    };

    return (
      <div className="border-l-4 border-blue-500 bg-white dark:bg-gray-800 p-4 rounded shadow">
        <div className="flex items-start">
          <div className="mr-3">{getIcon()}</div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              {insight.title}
            </h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {insight.description}
            </p>
            {insight.actionable && (
              <button className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium">
                Take Action →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Intelligence Dashboard
        </h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Revenue"
          value="$125,432"
          change={12.5}
          trend="up"
          icon={<DollarSign className="w-6 h-6 text-blue-600" />}
        />
        <MetricCard
          title="Active Deals"
          value="23"
          change={8.3}
          trend="up"
          icon={<Target className="w-6 h-6 text-blue-600" />}
        />
        <MetricCard
          title="Contacts Engaged"
          value="156"
          change={-2.1}
          trend="down"
          icon={<Users className="w-6 h-6 text-blue-600" />}
        />
        <MetricCard
          title="Conversion Rate"
          value="18.5%"
          change={3.2}
          trend="up"
          icon={<Activity className="w-6 h-6 text-blue-600" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[
              { name: 'Week 1', sales: 4000 },
              { name: 'Week 2', sales: 3000 },
              { name: 'Week 3', sales: 5000 },
              { name: 'Week 4', sales: 4500 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#3B82F6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Activity Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Calls', value: 400 },
                  { name: 'Emails', value: 300 },
                  { name: 'Meetings', value: 200 },
                  { name: 'Demos', value: 100 }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#3B82F6" />
                <Cell fill="#10B981" />
                <Cell fill="#F59E0B" />
                <Cell fill="#EF4444" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
        <div className="space-y-4">
          <InsightCard
            insight={{
              type: 'opportunity',
              title: 'High engagement with aesthetic practices',
              description: 'Your engagement rate with aesthetic practices is 23% higher than average. Consider focusing more resources here.',
              data: {},
              confidence: 0.85,
              actionable: true,
              priority: 'high'
            }}
          />
          <InsightCard
            insight={{
              type: 'risk',
              title: 'Follow-up rate declining',
              description: 'Follow-up activities have decreased by 15% this week. This may impact conversion rates.',
              data: {},
              confidence: 0.9,
              actionable: true,
              priority: 'medium'
            }}
          />
          <InsightCard
            insight={{
              type: 'trend',
              title: 'Injectables market growing',
              description: 'The injectables market in your territory has grown 18% YoY. New opportunities may be available.',
              data: {},
              confidence: 0.75,
              actionable: false,
              priority: 'low'
            }}
          />
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Recommended Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded p-4">
            <h4 className="font-medium mb-2">Schedule Follow-ups</h4>
            <p className="text-sm opacity-90">You have 8 contacts awaiting follow-up</p>
            <button className="mt-3 bg-white text-blue-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100">
              View Contacts
            </button>
          </div>
          <div className="bg-white/10 rounded p-4">
            <h4 className="font-medium mb-2">Update Pipeline</h4>
            <p className="text-sm opacity-90">3 deals need status updates</p>
            <button className="mt-3 bg-white text-blue-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100">
              Update Now
            </button>
          </div>
          <div className="bg-white/10 rounded p-4">
            <h4 className="font-medium mb-2">Review Analytics</h4>
            <p className="text-sm opacity-90">New market insights available</p>
            <button className="mt-3 bg-white text-blue-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100">
              View Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceDashboard;