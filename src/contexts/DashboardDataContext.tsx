import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dashboardService, DashboardMetrics } from '../services/supabase/dashboardService';
import { getMockDashboardData } from '../services/mockData/mockDataService';
import { useAuth } from '../auth';
import { useAppMode } from './AppModeContext';

interface DashboardDataContextType {
  dashboardData: DashboardMetrics | null;
  loading: boolean;
  refreshData: () => Promise<void>;
  mockActivities: any[];
  mockTasks: any[];
}

const DashboardDataContext = createContext<DashboardDataContextType | undefined>(undefined);

export const useDashboardData = () => {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error('useDashboardData must be used within a DashboardDataProvider');
  }
  return context;
};

interface DashboardDataProviderProps {
  children: ReactNode;
}

export const DashboardDataProvider: React.FC<DashboardDataProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { isDemo } = useAppMode();
  const [dashboardData, setDashboardData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [mockActivities, setMockActivities] = useState<any[]>([]);
  const [mockTasks, setMockTasks] = useState<any[]>([]);

  const loadDashboardData = async () => {
    setLoading(true);
    
    if (isDemo || !user?.id) {
      // Use mock data in demo mode or when not authenticated
      const mockData = getMockDashboardData();
      
      // Store the activities and tasks separately so they're consistent
      setMockActivities(mockData.recentActivities);
      setMockTasks(mockData.upcomingTasks);
      
      // Ensure sales_goal_progress and quota_percentage are synchronized
      const salesGoalProgress = mockData.stats.salesGoalProgress;
      
      setDashboardData({
        user_id: user?.id || 'demo',
        total_contacts: mockData.stats.totalContacts,
        contacts_change: mockData.stats.contactsChange,
        active_practices: mockData.stats.activePractices,
        practices_change: mockData.stats.practicesChange,
        revenue_generated: mockData.stats.revenueGenerated * 100, // Convert to cents
        revenue_change: mockData.stats.revenueChange,
        active_campaigns: mockData.stats.activeCampaigns,
        campaigns_change: mockData.stats.campaignsChange,
        sales_goal: mockData.stats.salesGoal * 100, // Convert to cents
        current_revenue: mockData.stats.currentRevenue * 100, // Convert to cents
        sales_goal_progress: salesGoalProgress,
        quota_percentage: salesGoalProgress, // Ensure quota matches sales goal progress
        pipeline_value: mockData.stats.revenueGenerated * 1.5 * 100, // Mock pipeline value in cents
        conversion_rate: 45 // Mock conversion rate
      });
    } else {
      // Load real data from Supabase
      let metrics = await dashboardService.getMetrics(user.id);
      
      // If no metrics exist, initialize them
      if (!metrics) {
        await dashboardService.initializeMetrics(user.id);
        metrics = await dashboardService.getMetrics(user.id);
      }
      
      if (metrics) {
        // Sync percentages to ensure quota matches sales goal progress
        await dashboardService.syncPercentages(user.id);
        // Reload to get synced data
        metrics = await dashboardService.getMetrics(user.id);
        setDashboardData(metrics);
        
        // Generate consistent mock activities and tasks for real data too
        const mockData = getMockDashboardData();
        setMockActivities(mockData.recentActivities);
        setMockTasks(mockData.upcomingTasks);
      } else {
        // Fallback to mock data if something goes wrong
        const mockData = getMockDashboardData();
        setMockActivities(mockData.recentActivities);
        setMockTasks(mockData.upcomingTasks);
        
        const salesGoalProgress = mockData.stats.salesGoalProgress;
        
        setDashboardData({
          user_id: user.id,
          total_contacts: mockData.stats.totalContacts,
          contacts_change: mockData.stats.contactsChange,
          active_practices: mockData.stats.activePractices,
          practices_change: mockData.stats.practicesChange,
          revenue_generated: mockData.stats.revenueGenerated * 100, // Convert to cents
          revenue_change: mockData.stats.revenueChange,
          active_campaigns: mockData.stats.activeCampaigns,
          campaigns_change: mockData.stats.campaignsChange,
          sales_goal: mockData.stats.salesGoal * 100, // Convert to cents
          current_revenue: mockData.stats.currentRevenue * 100, // Convert to cents
          sales_goal_progress: salesGoalProgress,
          quota_percentage: salesGoalProgress,
          pipeline_value: mockData.stats.revenueGenerated * 1.5 * 100, // Convert to cents
          conversion_rate: 45
        });
      }
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
    
    // Refresh data every 5 minutes
    const intervalId = setInterval(loadDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isDemo]);

  const value = {
    dashboardData,
    loading,
    refreshData: loadDashboardData,
    mockActivities,
    mockTasks
  };

  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  );
};