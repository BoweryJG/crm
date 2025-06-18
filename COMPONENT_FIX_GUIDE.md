# Component Fix Guide

This guide provides specific code changes needed for each component to properly handle demo/auth modes.

## 1. CallAnalysis Page Fix

**File**: `src/pages/CallAnalysis.tsx`

**Current Issue**: Hardcoded `userId="demo-user"`

**Fix Required**:
```typescript
import React from 'react';
import { Box } from '@mui/material';
import CallAnalyticsDashboard from '../components/calls/CallAnalyticsDashboard';
import { useAuth } from '../auth';
import { useAppMode } from '../contexts/AppModeContext';

const CallAnalysisPage: React.FC = () => {
  const { user } = useAuth();
  const { isDemo } = useAppMode();
  
  // Use actual user ID or 'demo-user' for demo mode
  const userId = user?.id || 'demo-user';
  const usePublicData = !user || isDemo;
  
  return (
    <Box sx={{ height: '100%' }}>
      <CallAnalyticsDashboard 
        userId={userId} 
        usePublicData={usePublicData}
      />
    </Box>
  );
};

export default CallAnalysisPage;
```

## 2. CallAnalyticsDashboard Component Fix

**File**: `src/components/calls/CallAnalyticsDashboard.tsx`

**Add to interface**:
```typescript
interface CallAnalyticsDashboardProps {
  userId?: string;
  usePublicData?: boolean; // New prop
}
```

**Update data fetching**:
```typescript
const loadCallData = async () => {
  try {
    setLoading(true);
    
    if (usePublicData) {
      // Load from public tables
      const { data: callData } = await supabase
        .from('public_call_analysis')
        .select('*')
        .order('call_date', { ascending: false });
      
      setCalls(callData || []);
      
      // Generate mock statistics
      const mockStats = {
        total_calls: callData?.length || 0,
        total_duration: callData?.reduce((sum, call) => sum + call.duration, 0) || 0,
        avg_duration: callData?.length ? 
          callData.reduce((sum, call) => sum + call.duration, 0) / callData.length : 0,
        sentiment_trend: 0.72,
        conversion_rate: 65,
        top_objections: [
          { objection: 'Price concerns', count: 8 },
          { objection: 'Need approval', count: 5 }
        ],
        coaching_areas: [
          { area: 'Objection handling', score: 75 },
          { area: 'Closing techniques', score: 82 }
        ]
      };
      setStatistics(mockStats);
    } else {
      // Existing logic for authenticated users
      const callData = await twilioCallService.getUserCalls(userId);
      setCalls(callData);
      const stats = await twilioCallService.getCallStatistics(userId, timeframe);
      setStatistics(stats);
    }
  } catch (error) {
    console.error('Error loading call data:', error);
  } finally {
    setLoading(false);
  }
};
```

## 3. Research Module Fix

**File**: `src/services/research/researchService.ts`

**Add demo mode support to each function**:
```typescript
import { useAuth } from '../../auth';
import { useAppMode } from '../../contexts/AppModeContext';

// Update getResearchProjects
const getResearchProjects = async (isPublic: boolean = false): Promise<{ data: ResearchProject[] | null; error: Error | null }> => {
  try {
    const tableName = isPublic ? 'public_research_projects' : 'research_projects';
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching research projects:', error);
    return { data: null, error: error as Error };
  }
};
```

**Update Research.tsx page**:
```typescript
import { useAuth } from '../auth';
import { useAppMode } from '../contexts/AppModeContext';

const Research: React.FC = () => {
  const { user } = useAuth();
  const { isDemo } = useAppMode();
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [documents, setDocuments] = useState<ResearchDocument[]>([]);
  
  const isPublicMode = !user || isDemo;

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const { data: projData } = await researchService.getResearchProjects(isPublicMode);
        if (projData) setProjects(projData);
        const { data: docData } = await researchService.getResearchDocuments(undefined, isPublicMode);
        if (docData) setDocuments(docData);
      } catch (err) {
        console.error('Error loading research overview data', err);
      }
    };

    fetchOverviewData();
  }, [isPublicMode]);
  
  // Rest of component...
};
```

## 4. Practices Page Enhancement

**File**: `src/pages/Practices.tsx`

**Update to use public_practices table**:
```typescript
useEffect(() => {
  const fetchPractices = async () => {
    try {
      setLoading(true);
      
      const { user } = useAuth();
      const { isDemo } = useAppMode();
      const tableName = (!user || isDemo) ? 'public_practices' : 'practices';
      
      const { data: practices, error } = await supabase
        .from(tableName)
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching practices:', error);
        // Use fallback only if table doesn't exist
        if (error.code === 'PGRST204') {
          const fallbackPractices = generateFallbackPractices();
          setPractices(fallbackPractices);
        }
      } else {
        setPractices(practices || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchPractices();
}, []);
```

## 5. Analytics/RegionalAnalytics Component

**File**: `src/components/analytics/RegionalAnalytics.tsx`

**Add authentication check**:
```typescript
import { useAuth } from '../../auth';
import { useAppMode } from '../../contexts/AppModeContext';

const RegionalAnalytics: React.FC = () => {
  const { user } = useAuth();
  const { isDemo } = useAppMode();
  const isPublicMode = !user || isDemo;
  
  // When fetching data, use appropriate tables
  const fetchAnalyticsData = async () => {
    if (isPublicMode) {
      // Use aggregated mock data or public tables
      const mockData = generateMockRegionalData();
      setAnalyticsData(mockData);
    } else {
      // Fetch real user data
      const data = await regionalAnalyticsService.getAnalytics(user.id);
      setAnalyticsData(data);
    }
  };
  
  // Rest of component...
};
```

## General Pattern for All Components

```typescript
// 1. Import necessary hooks
import { useAuth } from '../auth';
import { useAppMode } from '../contexts/AppModeContext';

// 2. Inside component
const { user } = useAuth();
const { isDemo } = useAppMode();

// 3. Determine table name
const tableName = (!user || isDemo) ? 'public_tablename' : 'tablename';

// 4. Pass flag to services
const isPublicMode = !user || isDemo;

// 5. Handle write operations
if (isPublicMode) {
  console.log('Write operations disabled in demo mode');
  return;
}
```

## Testing Checklist

After implementing fixes:

1. **Test in logged-out state**: All features should show demo data
2. **Test in demo mode while logged in**: Should still show demo data
3. **Test in live mode while logged in**: Should show real user data
4. **Test write operations**: Should be blocked in demo mode
5. **Test data consistency**: Related data should maintain relationships

## Performance Optimization

For frequently accessed public data, consider:

1. **Client-side caching**: Cache public data in context or localStorage
2. **Memoization**: Use React.memo for components with public data
3. **Lazy loading**: Load detailed data only when needed
4. **Pagination**: Implement for large public datasets