import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface MissionStatus {
  id?: string;
  current_revenue: number;
  target_revenue: number;
  momentum_status: 'stable' | 'accelerating' | 'at_risk';
  eta_days: number;
  progress_percent: number;
  created_at?: string;
  updated_at?: string;
}

interface UseMissionStatusReturn {
  data: MissionStatus | null;
  loading: boolean;
  error: Error | null;
}

// Mock data for development/fallback
const mockMissionStatus: MissionStatus = {
  current_revenue: 806000,
  target_revenue: 1300000,
  momentum_status: 'accelerating',
  eta_days: 11,
  progress_percent: 62
};

export const useMissionStatus = (live: boolean = true): UseMissionStatusReturn => {
  const [data, setData] = useState<MissionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    const fetchMissionStatus = async () => {
      try {
        setLoading(true);
        
        if (!live) {
          // Use mock data in preview mode
          setData(mockMissionStatus);
          setLoading(false);
          return;
        }

        // Try to fetch from Supabase
        const { data: missionData, error: fetchError } = await supabase
          .from('mission_status')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (fetchError) {
          console.warn('Mission status fetch error:', fetchError);
          // Fall back to mock data
          setData(mockMissionStatus);
        } else {
          setData(missionData);
        }

        // Set up real-time subscription only if live
        if (live && !fetchError) {
          channel = supabase
            .channel('mission_status_changes')
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'mission_status'
              },
              (payload) => {
                console.log('Mission status update:', payload);
                
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                  setData(payload.new as MissionStatus);
                }
              }
            )
            .subscribe((status) => {
              console.log('Subscription status:', status);
            });
        }
      } catch (err) {
        console.error('Error in useMissionStatus:', err);
        setError(err as Error);
        // Fall back to mock data on error
        setData(mockMissionStatus);
      } finally {
        setLoading(false);
      }
    };

    fetchMissionStatus();

    // Cleanup subscription
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [live]);

  return { data, loading, error };
};