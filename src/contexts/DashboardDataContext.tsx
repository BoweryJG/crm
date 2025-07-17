import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dashboardService, DashboardMetrics } from '../services/supabase/dashboardService';
import { getMockDashboardData } from '../services/mockData/mockDataService';
import mockDataService from '../services/mockData/mockDataService';
import { supabase } from '../services/supabase/supabase';
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
      
      if (metrics) {
        setDashboardData(metrics);
        
        // Load real activities and tasks based on actual contact data
        try {
          // Determine which table to use based on user email
          const userEmail = user.email;
          let tableName = 'public_contacts';
          if (userEmail === 'jasonwilliamgolden@gmail.com' || userEmail === 'jgolden@bowerycreativeagency.com') {
            tableName = 'personal_contacts';
          }
          
          console.log(`Loading real activities/tasks from ${tableName} for user: ${userEmail}`);
          
          // Fetch actual contacts to generate real activities and tasks
          const { data: contacts } = await supabase
            .from(tableName)
            .select('first_name, last_name, notes, created_at, updated_at, status, specialty')
            .order('updated_at', { ascending: false });
          
          if (contacts && contacts.length > 0) {
            // Generate real activities from contact data
            const realActivities = await mockDataService.generateRecentActivitiesFromContacts(contacts, 5);
            setMockActivities(realActivities);
            
            // Generate real tasks from contact data
            const realTasks = await mockDataService.generateUpcomingTasksFromContacts(contacts, 5);
            setMockTasks(realTasks);
            
            console.log('Generated real activities and tasks:', {
              activitiesCount: realActivities.length,
              tasksCount: realTasks.length,
              hasGregPedro: contacts.some(c => 
                `${c.first_name} ${c.last_name}`.toLowerCase().includes('greg pedro')
              ),
              hasEmmanuel: contacts.some(c => 
                `${c.first_name} ${c.last_name}`.toLowerCase().includes('emmanuel')
              )
            });
          } else {
            // Fallback to mock data if no contacts found
            console.log('No contacts found, using mock activities and tasks');
            const mockData = getMockDashboardData();
            setMockActivities(mockData.recentActivities);
            setMockTasks(mockData.upcomingTasks);
          }
        } catch (error) {
          console.error('Error loading real activities/tasks:', error);
          // Fallback to mock data
          const mockData = getMockDashboardData();
          setMockActivities(mockData.recentActivities);
          setMockTasks(mockData.upcomingTasks);
        }
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