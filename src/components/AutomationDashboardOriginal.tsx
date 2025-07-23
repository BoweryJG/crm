import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
  AreaChart,
  Area
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChartIcon,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from 'lucide-react';
import { templateAnalytics } from '@/analytics/TemplateAnalytics';
import { automationROITracker } from '@/analytics/AutomationROITracker';
import { engagementAnalytics } from '@/analytics/EngagementAnalytics';
import { abTestingEngine } from '@/analytics/ABTestingEngine';
import { optimizationRecommendations } from '@/analytics/OptimizationRecommendations';

interface DashboardProps {
  accountId?: string;
  timeRange?: { start: Date; end: Date };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const AutomationDashboard: React.FC<DashboardProps> = ({ accountId, timeRange: initialTimeRange }) => {
  const [timeRange, setTimeRange] = useState(initialTimeRange || {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    templateMetrics: [],
    roiData: null,
    stakeholderEngagement: [],
    channelPerformance: [],
    recommendations: [],
    insights: [],
    activeTests: []
  });

  useEffect(() => {
    loadDashboardData();
  }, [timeRange, accountId]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [
        templateMetrics,
        roiData,
        stakeholderEngagement,
        channelPerformance,
        recommendations,
        insights
      ] = await Promise.all([
        templateAnalytics.getAllTemplateMetrics(timeRange),
        automationROITracker.getROIDashboardData(timeRange),
        engagementAnalytics.getStakeholderEngagement(undefined, timeRange),
        engagementAnalytics.getChannelPerformance(timeRange),
        optimizationRecommendations.generateRecommendations(timeRange),
        optimizationRecommendations.getOptimizationInsights(timeRange)
      ]);

      setData({
        templateMetrics,
        roiData,
        stakeholderEngagement,
        channelPerformance,
        recommendations: recommendations.slice(0, 5),
        insights,
        activeTests: []
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getMetricIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <ArrowDownRight className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Automation Analytics Dashboard</h1>
        <div className="flex gap-4">
          <Select
            value={`${Math.round((Date.now() - timeRange.start.getTime()) / (24 * 60 * 60 * 1000))}`}
            onValueChange={(value) => {
              const days = parseInt(value);
              setTimeRange({
                start: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
                end: new Date()
              });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="180">Last 6 months</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadDashboardData} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.roiData?.totalRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              ROI: {formatPercentage(data.roiData?.totalROI || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.roiData?.overallStats?.activeTemplates || 0}</div>
            <p className="text-xs text-muted-foreground">
              of {data.roiData?.overallStats?.totalTemplates || 0} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(data.roiData?.overallStats?.averageSuccessRate || 0)}
            </div>
            <Progress value={data.roiData?.overallStats?.averageSuccessRate || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engaged Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stakeholderEngagement.reduce((sum: number, s: any) => sum + s.engagedContacts, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              across all stakeholders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.insights.map((insight: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{insight.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{insight.insight}</p>
                  <div className="space-y-2">
                    {insight.dataPoints.slice(0, 3).map((point: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-sm">{point.metric}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{point.value}</span>
                          {point.trend && getMetricIcon(point.trend)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Key metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.templateMetrics.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="templateName" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="successRate" stroke="#8884d8" name="Success Rate %" />
                  <Line type="monotone" dataKey="conversionRate" stroke="#82ca9d" name="Conversion Rate %" />
                  <Line type="monotone" dataKey="roi" stroke="#ffc658" name="ROI %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          {/* Top Performing Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Template Performance Matrix</CardTitle>
              <CardDescription>Success rate vs. execution volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.templateMetrics.sort((a: any, b: any) => b.roi - a.roi).slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="templateName" angle={-45} textAnchor="end" height={100} />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="successRate" fill="#8884d8" name="Success Rate %" />
                  <Bar yAxisId="right" dataKey="totalExecutions" fill="#82ca9d" name="Executions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Template Category Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(data.roiData?.roiByType || {}).map(([key, value]: [string, any]) => ({
                        name: key,
                        value: value.revenue
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(data.roiData?.roiByType || {}).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Template Health Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['improving', 'stable', 'declining'].map(trend => {
                    const count = data.templateMetrics.filter((t: any) => t.performanceTrend === trend).length;
                    const percentage = (count / data.templateMetrics.length) * 100;
                    return (
                      <div key={trend}>
                        <div className="flex justify-between mb-2">
                          <span className="capitalize">{trend}</span>
                          <span>{count} templates</span>
                        </div>
                        <Progress 
                          value={percentage} 
                          className={
                            trend === 'improving' ? 'bg-green-100' :
                            trend === 'declining' ? 'bg-red-100' : ''
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          {/* Stakeholder Engagement Radar */}
          <Card>
            <CardHeader>
              <CardTitle>Stakeholder Engagement Profile</CardTitle>
              <CardDescription>Engagement metrics by stakeholder type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={data.stakeholderEngagement}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="stakeholderType" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Engagement Rate" dataKey="engagementRate" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Response Rate" dataKey="averageResponseTime" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Channel Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.channelPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="channel" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="openRate" fill="#8884d8" name="Open Rate %" />
                    <Bar dataKey="clickRate" fill="#82ca9d" name="Click Rate %" />
                    <Bar dataKey="responseRate" fill="#ffc658" name="Response Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Heatmap Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground mb-2">Best engagement times:</div>
                  {data.stakeholderEngagement.slice(0, 3).map((stakeholder: any, idx: number) => (
                    <div key={idx} className="border rounded-lg p-3">
                      <div className="font-medium">{stakeholder.stakeholderType}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Peak times: {Object.entries(stakeholder.preferredTimes || {})
                          .sort(([, a]: any, [, b]: any) => b - a)
                          .slice(0, 2)
                          .map(([time]) => time.replace('_', ' '))
                          .join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roi" className="space-y-4">
          {/* ROI Attribution */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Attribution Model</CardTitle>
              <CardDescription>How revenue is attributed across touchpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'First Touch', value: data.roiData?.attributionBreakdown?.firstTouch || 0 },
                      { name: 'Last Touch', value: data.roiData?.attributionBreakdown?.lastTouch || 0 },
                      { name: 'Multi-Touch', value: data.roiData?.attributionBreakdown?.multiTouch || 0 }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[0, 1, 2].map((index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top ROI Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top ROI Performers</CardTitle>
              <CardDescription>Automations with highest return on investment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.roiData?.topPerformers?.map((automation: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{automation.automationName}</div>
                      <div className="text-sm text-muted-foreground">{automation.automationType}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{formatPercentage(automation.metrics.roiPercentage)}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(automation.metrics.revenue)} revenue
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {/* AI Recommendations */}
          {data.recommendations.map((rec: any, idx: number) => (
            <Alert key={idx} className="border-l-4" style={{ borderLeftColor: getPriorityColor(rec.priority) === 'destructive' ? '#ef4444' : '#f59e0b' }}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="flex items-center justify-between">
                <span>{rec.title}</span>
                <Badge variant={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
              </AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-3">{rec.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="font-medium mb-2">Action Items:</div>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {rec.actionItems.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium mb-2">Expected Impact:</div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">{rec.impact.metric}:</span>
                        <span className="ml-2">{rec.impact.currentValue} → {rec.impact.projectedValue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Improvement:</span>
                        <span className="font-medium text-green-600">
                          +{rec.impact.improvementPercentage.toFixed(0)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Confidence:</span>
                        <Progress value={rec.impact.confidenceLevel} className="mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <Clock className="inline w-3 h-3 mr-1" />
                    {rec.implementation.estimatedTime} • {rec.implementation.difficulty} difficulty
                  </div>
                  <Button size="sm">Implement</Button>
                </div>
              </AlertDescription>
            </Alert>
          ))}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Optimization Actions</CardTitle>
              <CardDescription>One-click optimizations based on AI analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <Zap className="mr-2 h-4 w-4" />
                  Auto-optimize send times
                </Button>
                <Button variant="outline" className="justify-start">
                  <Target className="mr-2 h-4 w-4" />
                  Enable smart segmentation
                </Button>
                <Button variant="outline" className="justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Start recommended A/B tests
                </Button>
                <Button variant="outline" className="justify-start">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Apply content improvements
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationDashboard;