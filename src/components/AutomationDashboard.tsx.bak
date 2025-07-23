import React, { useState, useEffect, memo, useCallback, useMemo, lazy, Suspense } from 'react';
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
import usePerformanceMonitoring from '../hooks/usePerformanceMonitoring';
import useMobileOptimization from '../hooks/useMobileOptimization';

// Lazy load heavy components to reduce initial bundle size
const OptimizedCharts = lazy(() => import('./charts/OptimizedCharts'));
const VirtualizedList = lazy(() => import('./VirtualizedList'));

// Lazy load analytics modules
const templateAnalytics = lazy(() => import('@/analytics/TemplateAnalytics').then(m => ({ default: m.templateAnalytics })));
const automationROITracker = lazy(() => import('@/analytics/AutomationROITracker').then(m => ({ default: m.automationROITracker })));
const engagementAnalytics = lazy(() => import('@/analytics/EngagementAnalytics').then(m => ({ default: m.engagementAnalytics })));
const optimizationRecommendations = lazy(() => import('@/analytics/OptimizationRecommendations').then(m => ({ default: m.optimizationRecommendations })));

interface DashboardProps {
  accountId?: string;
  timeRange?: { start: Date; end: Date };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Memoized components for better performance
const MetricCard = memo<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
}>(({ title, value, subtitle, icon, trend }) => {
  const { getTouchFriendlySize, getMobileStyles } = useMobileOptimization();
  
  return (
    <Card style={getMobileStyles()}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle 
          className="text-sm font-medium"
          style={{ minHeight: getTouchFriendlySize(24) }}
        >
          {title}
        </CardTitle>
        <div style={{ minWidth: getTouchFriendlySize(16), minHeight: getTouchFriendlySize(16) }}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
});

MetricCard.displayName = 'MetricCard';

const LoadingFallback = memo(() => (
  <div className="flex items-center justify-center h-96">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

const ChartFallback = memo(() => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-pulse bg-gray-200 rounded w-full h-full"></div>
  </div>
));

ChartFallback.displayName = 'ChartFallback';

export const AutomationDashboard: React.FC<DashboardProps> = memo(({ accountId, timeRange: initialTimeRange }) => {
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

  const { measureRender, measureInteraction, measureAPI } = usePerformanceMonitoring({
    onMetric: (metric) => {
      if (metric.value > 100) {
        console.warn(`Slow dashboard operation: ${metric.name} took ${metric.value}ms`);
      }
    }
  });

  const {
    deviceCapabilities,
    optimizationLevel,
    getAnimationDuration,
    shouldDefer,
    getDebounceDelay,
    shouldEnableFeature,
    getMobileStyles
  } = useMobileOptimization();

  // Measure component render time
  useEffect(() => {
    const endRender = measureRender('AutomationDashboard');
    return endRender;
  }, [measureRender]);

  // Optimized data loading with proper cleanup
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    const endAPI = measureAPI('dashboard_data_load');
    
    try {
      // Use dynamic imports for analytics modules
      const [
        { default: templateAnalyticsModule },
        { default: roiTrackerModule },
        { default: engagementModule },
        { default: recommendationsModule }
      ] = await Promise.all([
        import('@/analytics/TemplateAnalytics'),
        import('@/analytics/AutomationROITracker'),
        import('@/analytics/EngagementAnalytics'),
        import('@/analytics/OptimizationRecommendations')
      ]);

      // Load data based on optimization level
      const loadPromises = [
        templateAnalyticsModule.templateAnalytics.getAllTemplateMetrics(timeRange),
        roiTrackerModule.automationROITracker.getROIDashboardData(timeRange)
      ];

      // Load additional data only if device can handle it
      if (shouldEnableFeature('medium')) {
        loadPromises.push(
          engagementModule.engagementAnalytics.getStakeholderEngagement(undefined, timeRange),
          engagementModule.engagementAnalytics.getChannelPerformance(timeRange)
        );
      }

      if (shouldEnableFeature('low')) {
        loadPromises.push(
          recommendationsModule.optimizationRecommendations.generateRecommendations(timeRange),
          recommendationsModule.optimizationRecommendations.getOptimizationInsights(timeRange)
        );
      }

      const results = await Promise.all(loadPromises);

      setData({
        templateMetrics: results[0] || [],
        roiData: results[1] || null,
        stakeholderEngagement: results[2] || [],
        channelPerformance: results[3] || [],
        recommendations: (results[4] || []).slice(0, 5),
        insights: results[5] || [],
        activeTests: []
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      endAPI();
    }
  }, [timeRange, measureAPI, shouldEnableFeature]);

  // Debounced time range change
  const debouncedTimeRangeChange = useMemo(() => {
    let timeout: NodeJS.Timeout;
    return (newTimeRange: { start: Date; end: Date }) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setTimeRange(newTimeRange);
      }, getDebounceDelay(300));
    };
  }, [getDebounceDelay]);

  useEffect(() => {
    if (!shouldDefer()) {
      loadDashboardData();
    } else {
      // Defer loading if device is low on battery
      const timeout = setTimeout(loadDashboardData, 2000);
      return () => clearTimeout(timeout);
    }
  }, [loadDashboardData, shouldDefer]);

  // Memoized formatters
  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }, []);

  const formatPercentage = useCallback((value: number) => {
    return `${value.toFixed(1)}%`;
  }, []);

  const getMetricIcon = useCallback((trend: 'up' | 'down' | 'stable') => {
    const iconSize = deviceCapabilities.hasTouch ? 20 : 16;
    if (trend === 'up') return <ArrowUpRight size={iconSize} className="text-green-500" />;
    if (trend === 'down') return <ArrowDownRight size={iconSize} className="text-red-500" />;
    return <Activity size={iconSize} className="text-gray-500" />;
  }, [deviceCapabilities.hasTouch]);

  const handleTabChange = useCallback((value: string) => {
    const endInteraction = measureInteraction('dashboard_tab_change');
    setSelectedTab(value);
    endInteraction();
  }, [measureInteraction]);

  const handleRefresh = useCallback(() => {
    const endInteraction = measureInteraction('dashboard_refresh');
    loadDashboardData();
    endInteraction();
  }, [loadDashboardData, measureInteraction]);

  // Key metrics data (memoized)
  const keyMetrics = useMemo(() => [
    {
      title: "Total Revenue",
      value: formatCurrency(data.roiData?.totalRevenue || 0),
      subtitle: `ROI: ${formatPercentage(data.roiData?.totalROI || 0)}`,
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      trend: 'up' as const
    },
    {
      title: "Active Templates",
      value: data.roiData?.overallStats?.activeTemplates || 0,
      subtitle: `of ${data.roiData?.overallStats?.totalTemplates || 0} total`,
      icon: <BarChart3 className="h-4 w-4 text-muted-foreground" />,
      trend: 'stable' as const
    },
    {
      title: "Avg Success Rate",
      value: formatPercentage(data.roiData?.overallStats?.averageSuccessRate || 0),
      icon: <Target className="h-4 w-4 text-muted-foreground" />,
      trend: 'up' as const
    },
    {
      title: "Engaged Contacts",
      value: data.stakeholderEngagement.reduce((sum: number, s: any) => sum + (s.engagedContacts || 0), 0),
      subtitle: "across all stakeholders",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      trend: 'up' as const
    }
  ], [data, formatCurrency, formatPercentage]);

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <div className="space-y-6" style={getMobileStyles()}>
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Automation Analytics Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Select
            value={`${Math.round((Date.now() - timeRange.start.getTime()) / (24 * 60 * 60 * 1000))}`}
            onValueChange={(value) => {
              const days = parseInt(value);
              debouncedTimeRangeChange({
                start: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
                end: new Date()
              });
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="180">Last 6 months</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} variant="outline" className="w-full sm:w-auto">
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={selectedTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="overview" className="text-xs lg:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="templates" className="text-xs lg:text-sm">Templates</TabsTrigger>
          {shouldEnableFeature('medium') && (
            <>
              <TabsTrigger value="engagement" className="text-xs lg:text-sm">Engagement</TabsTrigger>
              <TabsTrigger value="roi" className="text-xs lg:text-sm">ROI Analysis</TabsTrigger>
            </>
          )}
          {shouldEnableFeature('low') && (
            <TabsTrigger value="recommendations" className="text-xs lg:text-sm">Recommendations</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Insights Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.insights.slice(0, deviceCapabilities.isLowEnd ? 2 : 4).map((insight: any, index: number) => (
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

          {/* Performance Trends Chart - Only load if device can handle it */}
          {shouldEnableFeature('medium') && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Key metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<ChartFallback />}>
                  <OptimizedCharts
                    type="line"
                    data={data.templateMetrics.slice(0, deviceCapabilities.isLowEnd ? 5 : 10)}
                    height={deviceCapabilities.isMobile ? 250 : 300}
                  />
                </Suspense>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Other tab contents would follow similar patterns */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Performance Matrix</CardTitle>
              <CardDescription>Success rate vs. execution volume</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ChartFallback />}>
                <OptimizedCharts
                  type="bar"
                  data={data.templateMetrics.sort((a: any, b: any) => b.roi - a.roi).slice(0, deviceCapabilities.isLowEnd ? 5 : 10)}
                  height={deviceCapabilities.isMobile ? 300 : 400}
                />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        {shouldEnableFeature('low') && (
          <TabsContent value="recommendations" className="space-y-4">
            {data.recommendations.map((rec: any, idx: number) => (
              <Alert key={idx} className="border-l-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  <span>{rec.title}</span>
                  <Badge variant={rec.priority === 'critical' ? 'destructive' : 'secondary'}>
                    {rec.priority}
                  </Badge>
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <p className="mb-3">{rec.description}</p>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                      <Clock className="inline w-3 h-3 mr-1" />
                      {rec.implementation?.estimatedTime} • {rec.implementation?.difficulty} difficulty
                    </div>
                    <Button size="sm" className="w-full lg:w-auto">
                      Implement
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
});

AutomationDashboard.displayName = 'AutomationDashboard';

export default AutomationDashboard;