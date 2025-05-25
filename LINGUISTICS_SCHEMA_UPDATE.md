# Linguistics Analysis Schema Update

This document explains the enhanced linguistics analysis schema that adds advanced sales analytics capabilities to the SphereOsCrM platform.

## Overview

The linguistics analysis schema has been expanded to include a comprehensive set of sales performance metrics, coaching recommendations, and buyer psychology insights. These enhancements enable deeper analysis of sales calls and provide more actionable insights for sales representatives.

## Key Features

The enhanced schema includes:

- **Persuasion Techniques Analysis**: Measures how effectively sales reps use proven persuasion principles like reciprocity, social proof, and scarcity
- **Sales Strategy Adherence**: Evaluates how well reps follow the sales methodology
- **Psychological Profiling**: Identifies buyer communication styles and decision-making patterns
- **Trust & Rapport Metrics**: Quantifies the relationship quality established during calls
- **Coaching Recommendations**: Provides specific, actionable feedback for improvement
- **Harvey Specter Analysis**: Evaluates sales techniques through the lens of the famous fictional closer
- **Power Dynamics Analysis**: Tracks negotiation leverage throughout the conversation
- **Closing Readiness Score**: Predicts how ready the prospect is to make a decision
- **Follow-up Recommendations**: Suggests optimal timing and focus for next steps

## Implementation

To implement this schema update:

1. Copy the SQL from `direct_linguistics_schema_update.sql`
2. Paste it into the Supabase SQL Editor
3. Execute the SQL to create or update the linguistics_analysis table

The SQL will:
- Create the table if it doesn't exist
- Add all the new fields with appropriate data types
- Set up proper indexes and constraints
- Create RLS policies for security
- Add sample data for testing

## Using the Enhanced Data

The enhanced linguistics data is now available in the RepAnalytics component, which has been updated to display:

- Trust/Rapport scores
- Influence Effectiveness scores
- Buyer Personality Types
- Closing Readiness scores
- Recommended Follow-up Timing
- Coaching Recommendations

## Mock Data

The `mockLinguisticsData.ts` file has been updated to generate realistic mock data for all the new fields, ensuring that the application works correctly even when real data is not available.

## Next Steps

After implementing this schema update:

1. Restart the application using `./start_app_with_linguistics_fix.sh`
2. Navigate to the RepAnalytics page to see the enhanced data visualization
3. Check the CallInsightDetail page for individual call analysis with the new metrics

## Troubleshooting

If you encounter issues:

- Verify that the SQL executed without errors in the Supabase console
- Check that the linguistics_analysis table has all the expected columns
- Ensure that the RLS policies are correctly applied
- Confirm that the sample data was inserted properly
