# Mock Data Summary

## Currently Available Mock Data

### 1. Client-Side Mock Data (via mockDataService.ts)

#### Available Generators:
- **generateMockContacts(count)**: Creates diverse contacts (dental & aesthetic)
- **generateMockPractices(count)**: Creates practices across US locations
- **generateDashboardStats()**: Dashboard metrics with realistic values
- **generateMockCallAnalyses(count)**: Call records with AI insights
- **generateMockLinguisticsAnalyses(calls)**: Speech pattern analysis
- **generateMockSalesActivities(count)**: Activity tracking data
- **generateMockResearchProjects(count)**: Research project data
- **generateMockResearchDocuments(projects)**: Research documents
- **generateMockResearchTasks(projects)**: Research tasks
- **generateMockPublicContacts(count)**: Public contact records

### 2. Database Mock Data (Existing)

#### public_contacts table ✅
- **Count**: 20 records (appears in multiple migrations)
- **Distribution**: 10 dental, 10 aesthetic professionals
- **Locations**: NYC metro area (all 5 boroughs)
- **Details**: Full contact info, specializations, notes, tags

#### dashboard_metrics table ✅
- **Demo User ID**: '00000000-0000-0000-0000-000000000001'
- **Sample metrics**: Revenue, contacts, practices, campaigns
- **Includes**: Percentage changes and progress indicators

### 3. Newly Created Mock Data (via migration files)

#### public_practices table ✅ (NEW)
- **Count**: 10 practices
- **Types**: 5 dental, 5 aesthetic
- **Sizes**: Mix of small, medium, large
- **Features**: Technologies, procedures, specialties
- **Geographic**: NYC metro area coverage

#### public_call_analysis table ✅ (NEW)
- **Count**: 5 call records
- **Features**: Transcripts, sentiment scores, action items
- **Relationships**: Links to public_contacts and public_practices
- **Insights**: Buying signals, objections, next steps

#### public_linguistics_analysis table ✅ (NEW)
- **Count**: 5 analyses
- **Features**: Sentiment scores, key phrases, summaries
- **Relationships**: One per call analysis

#### public_sales_activities table ✅ (NEW)
- **Count**: 5 activities
- **Types**: Calls, emails, meetings
- **Outcomes**: Various stages of sales process

#### public_research_projects table ✅ (NEW)
- **Count**: 3 projects
- **Statuses**: Active and completed
- **Topics**: Market analysis, trends, M&A

#### public_research_documents table ✅ (NEW)
- **Count**: 3 documents
- **Types**: Summary, analysis, report
- **AI Generated**: Mix of AI and human-created

#### public_companies table ✅ (NEW)
- **Count**: 3 companies
- **Industries**: Dental and aesthetic leaders
- **Details**: Products, market share, revenue

#### public_procedures table ✅ (NEW)
- **Count**: 5 procedures
- **Categories**: Mix of dental and aesthetic
- **Details**: Costs, duration, benefits

## Mock Data Quality Assessment

### Strengths:
1. **Realistic Names & Locations**: Diverse, believable contact names
2. **Industry-Specific Details**: Accurate procedures, technologies, specialties
3. **Proper Relationships**: Foreign keys maintain data integrity
4. **Time-Based Variations**: Dates span realistic timeframes
5. **Geographic Diversity**: Covers all NYC boroughs

### Areas for Enhancement:
1. **Volume**: Some tables have limited records (3-5)
2. **Regional Coverage**: Currently NYC-focused, could expand
3. **Temporal Data**: Could add more historical data
4. **Variety**: Some patterns are repetitive

## Mock Data Usage Guide

### For Developers:

1. **Public Mode Detection**:
```typescript
const isPublicMode = !user || isDemo;
const tableName = isPublicMode ? 'public_contacts' : 'contacts';
```

2. **Fallback Pattern**:
```typescript
try {
  const { data } = await supabase.from(tableName).select('*');
  if (!data) throw new Error('No data');
  return data;
} catch (error) {
  // Fallback to client-side mock data
  return mockDataService.generateMockContacts();
}
```

3. **Consistent IDs**: Use predictable UUIDs for relationships:
- Demo user: '00000000-0000-0000-0000-000000000001'
- Practices: '11111111-1111-1111-1111-111111111111' format
- Contacts: Referenced by name queries

### For Testing:

1. **Logged Out**: Should see all public data
2. **Demo Mode**: Same public data, no writes
3. **Live Mode**: Real user data, full access

## Recommendations for Improvement

1. **Increase Volume**:
   - Add 10-15 more public_practices
   - Add 20-30 more public_call_analysis records
   - Add 50+ public_sales_activities

2. **Add Variety**:
   - Include practices from other major US cities
   - Add more procedure types
   - Include failed sales scenarios

3. **Enhance Realism**:
   - Add seasonal patterns to data
   - Include multi-touch sales journeys
   - Add competitive loss scenarios

4. **Performance**:
   - Create materialized views for complex queries
   - Add appropriate indexes
   - Consider data pagination strategies