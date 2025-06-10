import { supabase } from '../../auth/supabase';

export interface DashboardMetrics {
  id?: string;
  user_id: string;
  total_contacts: number;
  contacts_change: number;
  active_practices: number;
  practices_change: number;
  revenue_generated: number;
  revenue_change: number;
  active_campaigns: number;
  campaigns_change: number;
  sales_goal: number;
  current_revenue: number;
  sales_goal_progress: number;
  quota_percentage: number; // This will sync with the QUOTA gauge
  pipeline_value: number;
  conversion_rate: number;
  created_at?: string;
  updated_at?: string;
}

export interface RevenueGoal {
  id?: string;
  user_id: string;
  goal_amount: number;
  current_amount: number;
  period_start: string;
  period_end: string;
  created_at?: string;
  updated_at?: string;
}

class DashboardService {
  // Get current dashboard metrics for a user
  async getMetrics(userId: string): Promise<DashboardMetrics | null> {
    try {
      const { data, error } = await supabase
        .from('dashboard_metrics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching dashboard metrics:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getMetrics:', error);
      return null;
    }
  }

  // Update dashboard metrics
  async updateMetrics(userId: string, metrics: Partial<DashboardMetrics>): Promise<boolean> {
    try {
      // Calculate sales goal progress if current_revenue or sales_goal is updated
      if (metrics.current_revenue !== undefined || metrics.sales_goal !== undefined) {
        const currentMetrics = await this.getMetrics(userId);
        const currentRevenue = metrics.current_revenue ?? currentMetrics?.current_revenue ?? 0;
        const salesGoal = metrics.sales_goal ?? currentMetrics?.sales_goal ?? 1300000;
        
        metrics.sales_goal_progress = Math.round((currentRevenue / salesGoal) * 100);
        metrics.quota_percentage = metrics.sales_goal_progress; // Sync with quota gauge
      }

      const { error } = await supabase
        .from('dashboard_metrics')
        .upsert({
          ...metrics,
          user_id: userId,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error updating dashboard metrics:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateMetrics:', error);
      return false;
    }
  }

  // Get revenue goal for a user
  async getRevenueGoal(userId: string): Promise<RevenueGoal | null> {
    try {
      const { data, error } = await supabase
        .from('revenue_goals')
        .select('*')
        .eq('user_id', userId)
        .gte('period_end', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching revenue goal:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getRevenueGoal:', error);
      return null;
    }
  }

  // Update revenue goal
  async updateRevenueGoal(userId: string, goal: Partial<RevenueGoal>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('revenue_goals')
        .upsert({
          ...goal,
          user_id: userId,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,period_start'
        });

      if (error) {
        console.error('Error updating revenue goal:', error);
        return false;
      }

      // Update the sales goal in dashboard metrics
      if (goal.goal_amount) {
        await this.updateMetrics(userId, { sales_goal: goal.goal_amount });
      }

      return true;
    } catch (error) {
      console.error('Error in updateRevenueGoal:', error);
      return false;
    }
  }

  // Initialize default metrics for a new user
  async initializeMetrics(userId: string): Promise<boolean> {
    try {
      const defaultMetrics: DashboardMetrics = {
        user_id: userId,
        total_contacts: 0,
        contacts_change: 0,
        active_practices: 0,
        practices_change: 0,
        revenue_generated: 0,
        revenue_change: 0,
        active_campaigns: 0,
        campaigns_change: 0,
        sales_goal: 1300000, // Default $1.3M goal
        current_revenue: 0,
        sales_goal_progress: 0,
        quota_percentage: 0,
        pipeline_value: 0,
        conversion_rate: 0
      };

      const { error } = await supabase
        .from('dashboard_metrics')
        .insert(defaultMetrics);

      if (error) {
        console.error('Error initializing dashboard metrics:', error);
        return false;
      }

      // Also create a default revenue goal
      const currentDate = new Date();
      const startOfQuarter = new Date(currentDate.getFullYear(), Math.floor(currentDate.getMonth() / 3) * 3, 1);
      const endOfQuarter = new Date(currentDate.getFullYear(), Math.floor(currentDate.getMonth() / 3) * 3 + 3, 0);

      await supabase
        .from('revenue_goals')
        .insert({
          user_id: userId,
          goal_amount: 1300000,
          current_amount: 0,
          period_start: startOfQuarter.toISOString(),
          period_end: endOfQuarter.toISOString()
        });

      return true;
    } catch (error) {
      console.error('Error in initializeMetrics:', error);
      return false;
    }
  }

  // Calculate and sync all percentages
  async syncPercentages(userId: string): Promise<boolean> {
    try {
      const metrics = await this.getMetrics(userId);
      if (!metrics) return false;

      const updates: Partial<DashboardMetrics> = {};

      // Calculate quota percentage (matches sales goal progress)
      if (metrics.sales_goal > 0) {
        updates.quota_percentage = Math.round((metrics.current_revenue / metrics.sales_goal) * 100);
        updates.sales_goal_progress = updates.quota_percentage;
      }

      // Calculate conversion rate if needed
      if (metrics.total_contacts > 0 && metrics.revenue_generated > 0) {
        // Simplified conversion calculation - you can make this more sophisticated
        updates.conversion_rate = Math.round((metrics.active_practices / metrics.total_contacts) * 100);
      }

      return await this.updateMetrics(userId, updates);
    } catch (error) {
      console.error('Error in syncPercentages:', error);
      return false;
    }
  }
}

export const dashboardService = new DashboardService();