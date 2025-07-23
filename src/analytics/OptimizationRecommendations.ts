import { templateAnalytics } from './TemplateAnalytics';
import { automationROITracker } from './AutomationROITracker';
import { engagementAnalytics } from './EngagementAnalytics';
import { abTestingEngine } from './ABTestingEngine';
import { supabase } from '../services/supabase/supabase';
import type { AutomationLog, AutomationTemplate, Contact, Account } from '../db/schema';

export interface Recommendation {
  id: string;
  type: 'template' | 'timing' | 'audience' | 'content' | 'channel' | 'sequence';
  priority: 'critical' | 'high' | 'medium' | 'low';
  impact: {
    metric: string;
    currentValue: number;
    projectedValue: number;
    improvementPercentage: number;
    confidenceLevel: number;
  };
  title: string;
  description: string;
  actionItems: string[];
  implementation: {
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedTime: string;
    requiredResources: string[];
  };
  relatedData?: any;
}

export interface OptimizationInsight {
  category: string;
  insight: string;
  dataPoints: Array<{
    metric: string;
    value: number | string;
    trend?: 'up' | 'down' | 'stable';
  }>;
  recommendations: string[];
}

export class OptimizationRecommendations {
  private static instance: OptimizationRecommendations;

  private constructor() {}

  static getInstance(): OptimizationRecommendations {
    if (!this.instance) {
      this.instance = new OptimizationRecommendations();
    }
    return this.instance;
  }

  async generateRecommendations(
    timeRange?: { start: Date; end: Date }
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Get comprehensive analytics data
    const [
      templateMetrics,
      roiData,
      stakeholderEngagement,
      channelPerformance,
      testRecommendations
    ] = await Promise.all([
      templateAnalytics.getAllTemplateMetrics(timeRange),
      automationROITracker.getROIDashboardData(timeRange),
      engagementAnalytics.getStakeholderEngagement(undefined, timeRange),
      engagementAnalytics.getChannelPerformance(timeRange),
      abTestingEngine.getTestRecommendations(5)
    ]);

    // Template performance recommendations
    const templateRecs = await this.analyzeTemplatePerformance(templateMetrics);
    recommendations.push(...templateRecs);

    // Timing optimization recommendations
    const timingRecs = await this.analyzeTimingPatterns(timeRange);
    recommendations.push(...timingRecs);

    // Audience segmentation recommendations
    const audienceRecs = await this.analyzeAudienceSegmentation(stakeholderEngagement);
    recommendations.push(...audienceRecs);

    // Channel optimization recommendations
    const channelRecs = this.analyzeChannelPerformance(channelPerformance);
    recommendations.push(...channelRecs);

    // Content optimization recommendations
    const contentRecs = await this.analyzeContentPerformance(timeRange);
    recommendations.push(...contentRecs);

    // Sequence optimization recommendations
    const sequenceRecs = await this.analyzeSequencePerformance(timeRange);
    recommendations.push(...sequenceRecs);

    // Sort by priority and impact
    return recommendations.sort((a, b) => {
      const priorityScore = { critical: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityScore[a.priority];
      const bPriority = priorityScore[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return b.impact.improvementPercentage - a.impact.improvementPercentage;
    });
  }

  private async analyzeTemplatePerformance(
    templateMetrics: any[]
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Identify underperforming templates
    const avgSuccessRate = templateMetrics.reduce((sum, m) => sum + m.successRate, 0) / templateMetrics.length;
    const underperformers = templateMetrics.filter(m => m.successRate < avgSuccessRate * 0.7);

    for (const template of underperformers) {
      const recommendation: Recommendation = {
        id: `template-${template.templateId}`,
        type: 'template',
        priority: template.totalExecutions > 100 ? 'high' : 'medium',
        impact: {
          metric: 'Success Rate',
          currentValue: template.successRate,
          projectedValue: avgSuccessRate,
          improvementPercentage: ((avgSuccessRate - template.successRate) / template.successRate) * 100,
          confidenceLevel: 85
        },
        title: `Optimize Underperforming Template: ${template.templateName}`,
        description: `This template has a ${template.successRate.toFixed(1)}% success rate, significantly below the ${avgSuccessRate.toFixed(1)}% average. Analysis suggests improvements in content and timing.`,
        actionItems: [
          'Review and update email subject lines for higher open rates',
          'Simplify content and add clearer call-to-action buttons',
          'Test different send times based on stakeholder availability',
          'Consider A/B testing different content variations'
        ],
        implementation: {
          difficulty: 'medium',
          estimatedTime: '2-3 days',
          requiredResources: ['Content writer', 'Email designer', 'Analytics access']
        },
        relatedData: template
      };

      recommendations.push(recommendation);
    }

    // Identify templates with declining performance
    const decliningTemplates = templateMetrics.filter(m => m.performanceTrend === 'declining');
    
    for (const template of decliningTemplates) {
      if (underperformers.find(u => u.templateId === template.templateId)) continue;

      recommendations.push({
        id: `trend-${template.templateId}`,
        type: 'template',
        priority: 'medium',
        impact: {
          metric: 'Performance Trend',
          currentValue: template.successRate,
          projectedValue: template.successRate * 0.8,
          improvementPercentage: -20,
          confidenceLevel: 75
        },
        title: `Address Declining Performance: ${template.templateName}`,
        description: `This template's performance has been declining over the past 30 days. Early intervention can prevent further degradation.`,
        actionItems: [
          'Analyze recent changes in audience behavior',
          'Check for email deliverability issues',
          'Review competitor communications for market changes',
          'Consider refreshing content to combat fatigue'
        ],
        implementation: {
          difficulty: 'easy',
          estimatedTime: '1-2 days',
          requiredResources: ['Analytics access', 'Content reviewer']
        }
      });
    }

    return recommendations;
  }

  private async analyzeTimingPatterns(
    timeRange?: { start: Date; end: Date }
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Get engagement heatmap data
    const heatmapData = await engagementAnalytics.getEngagementHeatmap(undefined, timeRange);
    
    // Group by stakeholder type
    const stakeholderPatterns: Record<string, any[]> = {};
    heatmapData.forEach(data => {
      if (!stakeholderPatterns[data.stakeholderType]) {
        stakeholderPatterns[data.stakeholderType] = [];
      }
      stakeholderPatterns[data.stakeholderType].push(data);
    });

    for (const [stakeholder, patterns] of Object.entries(stakeholderPatterns)) {
      // Find optimal times
      const sortedByEngagement = [...patterns].sort((a, b) => b.engagementScore - a.engagementScore);
      const topTimes = sortedByEngagement.slice(0, 3);
      const bottomTimes = sortedByEngagement.slice(-3);

      const avgEngagement = patterns.reduce((sum, p) => sum + p.engagementScore, 0) / patterns.length;
      const topAvgEngagement = topTimes.reduce((sum, p) => sum + p.engagementScore, 0) / topTimes.length;

      if (topAvgEngagement > avgEngagement * 1.5) {
        recommendations.push({
          id: `timing-${stakeholder}`,
          type: 'timing',
          priority: 'high',
          impact: {
            metric: 'Engagement Rate',
            currentValue: avgEngagement,
            projectedValue: topAvgEngagement,
            improvementPercentage: ((topAvgEngagement - avgEngagement) / avgEngagement) * 100,
            confidenceLevel: 90
          },
          title: `Optimize Send Times for ${stakeholder}s`,
          description: `${stakeholder}s show significantly higher engagement during specific time windows. Adjusting send times could improve engagement by ${((topAvgEngagement - avgEngagement) / avgEngagement * 100).toFixed(0)}%.`,
          actionItems: [
            `Schedule ${stakeholder} communications for ${this.formatOptimalTimes(topTimes)}`,
            `Avoid sending during ${this.formatOptimalTimes(bottomTimes)}`,
            'Set up automated scheduling rules based on recipient role',
            'Test time-zone adjusted sending for better results'
          ],
          implementation: {
            difficulty: 'easy',
            estimatedTime: '1 day',
            requiredResources: ['Automation platform access']
          }
        });
      }
    }

    return recommendations;
  }

  private async analyzeAudienceSegmentation(
    stakeholderEngagement: any[]
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Find stakeholder groups with low engagement
    const lowEngagementGroups = stakeholderEngagement.filter(
      s => s.engagementRate < 15 && s.totalContacts > 50
    );

    for (const group of lowEngagementGroups) {
      // Analyze why engagement is low
      const topTemplates = group.topTemplates || [];
      const hasSuccessfulTemplates = topTemplates.some((t: any) => t.responseRate > 20);

      recommendations.push({
        id: `audience-${group.stakeholderType}`,
        type: 'audience',
        priority: group.totalContacts > 200 ? 'high' : 'medium',
        impact: {
          metric: 'Stakeholder Engagement',
          currentValue: group.engagementRate,
          projectedValue: 25,
          improvementPercentage: ((25 - group.engagementRate) / group.engagementRate) * 100,
          confidenceLevel: 80
        },
        title: `Improve ${group.stakeholderType} Engagement Strategy`,
        description: `${group.stakeholderType}s show only ${group.engagementRate.toFixed(1)}% engagement rate. Targeted content and personalization can significantly improve results.`,
        actionItems: [
          `Create role-specific content for ${group.stakeholderType}s`,
          'Implement dynamic personalization based on past interactions',
          'Use preferred channels: ' + Object.keys(group.preferredChannels).join(', '),
          hasSuccessfulTemplates
            ? `Expand use of successful templates: ${topTemplates[0]?.templateName}`
            : 'Develop new templates specifically for this audience'
        ],
        implementation: {
          difficulty: 'medium',
          estimatedTime: '3-5 days',
          requiredResources: ['Content strategist', 'Segmentation tools', 'Personalization platform']
        }
      });
    }

    // Recommend microsegmentation for high-value groups
    const highValueGroups = stakeholderEngagement.filter(
      s => s.engagementRate > 30 && s.totalContacts > 100
    );

    if (highValueGroups.length > 0) {
      recommendations.push({
        id: 'audience-microsegmentation',
        type: 'audience',
        priority: 'medium',
        impact: {
          metric: 'Conversion Rate',
          currentValue: 5,
          projectedValue: 8,
          improvementPercentage: 60,
          confidenceLevel: 70
        },
        title: 'Implement Microsegmentation for High-Value Stakeholders',
        description: 'Further segment your most engaged stakeholder groups to deliver hyper-personalized experiences.',
        actionItems: [
          'Create sub-segments based on specialty, department, and seniority',
          'Develop persona-specific content libraries',
          'Implement behavioral trigger campaigns',
          'Use predictive analytics to anticipate needs'
        ],
        implementation: {
          difficulty: 'hard',
          estimatedTime: '2-3 weeks',
          requiredResources: ['Data analyst', 'Segmentation platform', 'Content team']
        }
      });
    }

    return recommendations;
  }

  private analyzeChannelPerformance(
    channelPerformance: any[]
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Find underperforming channels
    for (const channel of channelPerformance) {
      if (channel.deliveryRate < 95 && channel.channel === 'email') {
        recommendations.push({
          id: `channel-delivery-${channel.channel}`,
          type: 'channel',
          priority: 'critical',
          impact: {
            metric: 'Email Delivery Rate',
            currentValue: channel.deliveryRate,
            projectedValue: 98,
            improvementPercentage: ((98 - channel.deliveryRate) / channel.deliveryRate) * 100,
            confidenceLevel: 95
          },
          title: 'Critical: Improve Email Deliverability',
          description: `Email delivery rate is ${channel.deliveryRate.toFixed(1)}%, indicating potential spam or authentication issues.`,
          actionItems: [
            'Verify SPF, DKIM, and DMARC records',
            'Review and clean email lists for invalid addresses',
            'Check sender reputation scores',
            'Implement double opt-in for new subscribers',
            'Monitor blocklist status'
          ],
          implementation: {
            difficulty: 'medium',
            estimatedTime: '2-3 days',
            requiredResources: ['Email administrator', 'DNS access', 'Email validation service']
          }
        });
      }

      if (channel.openRate < 20 && channel.channel === 'email' && channel.deliveryRate > 90) {
        recommendations.push({
          id: `channel-open-${channel.channel}`,
          type: 'channel',
          priority: 'high',
          impact: {
            metric: 'Email Open Rate',
            currentValue: channel.openRate,
            projectedValue: 30,
            improvementPercentage: ((30 - channel.openRate) / channel.openRate) * 100,
            confidenceLevel: 85
          },
          title: 'Improve Email Open Rates',
          description: `Email open rate of ${channel.openRate.toFixed(1)}% is below industry standards.`,
          actionItems: [
            'A/B test subject lines focusing on value and urgency',
            'Optimize preview text to complement subject lines',
            'Personalize sender names and email addresses',
            'Test emoji usage in subject lines',
            'Segment lists for more relevant messaging'
          ],
          implementation: {
            difficulty: 'easy',
            estimatedTime: '1-2 days',
            requiredResources: ['Email marketing platform', 'Copywriter']
          }
        });
      }

      // Multi-channel recommendations
      if (channel.responseRate > 10 && channel.totalSent > 1000) {
        const otherChannels = channelPerformance.filter(c => c.channel !== channel.channel);
        const hasLowPerformingAlternative = otherChannels.some(c => c.responseRate < channel.responseRate * 0.5);

        if (hasLowPerformingAlternative) {
          recommendations.push({
            id: `channel-mix-${channel.channel}`,
            type: 'channel',
            priority: 'medium',
            impact: {
              metric: 'Overall Response Rate',
              currentValue: 8,
              projectedValue: 12,
              improvementPercentage: 50,
              confidenceLevel: 75
            },
            title: `Leverage High-Performing ${channel.channel} Channel`,
            description: `${channel.channel} shows ${channel.responseRate.toFixed(1)}% response rate. Shifting more communications to this channel could improve overall performance.`,
            actionItems: [
              `Increase ${channel.channel} usage for initial outreach`,
              'Develop channel-specific content strategies',
              'Create omnichannel sequences starting with best performer',
              'Set up automated channel preference detection'
            ],
            implementation: {
              difficulty: 'medium',
              estimatedTime: '1 week',
              requiredResources: ['Multi-channel platform', 'Content adaptation']
            }
          });
        }
      }
    }

    return recommendations;
  }

  private async analyzeContentPerformance(
    timeRange?: { start: Date; end: Date }
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Get content performance data
    const contentPerformance = await engagementAnalytics.getContentPerformance(undefined, timeRange);
    
    // Group by content type
    const contentTypes: Record<string, any[]> = {};
    contentPerformance.forEach(content => {
      const type = content.contentType || 'Unknown';
      if (!contentTypes[type]) {
        contentTypes[type] = [];
      }
      contentTypes[type].push(content);
    });

    // Analyze each content type
    for (const [type, contents] of Object.entries(contentTypes)) {
      const avgOpenRate = contents.reduce((sum, c) => sum + c.openRate, 0) / contents.length;
      const avgClickRate = contents.reduce((sum, c) => sum + c.clickRate, 0) / contents.length;
      const avgConversionRate = contents.reduce((sum, c) => sum + c.conversionRate, 0) / contents.length;

      // Find top performers
      const topPerformers = contents
        .sort((a, b) => b.conversionRate - a.conversionRate)
        .slice(0, 3);

      if (topPerformers.length > 0 && topPerformers[0].conversionRate > avgConversionRate * 2) {
        recommendations.push({
          id: `content-${type}`,
          type: 'content',
          priority: 'high',
          impact: {
            metric: 'Content Conversion Rate',
            currentValue: avgConversionRate,
            projectedValue: topPerformers[0].conversionRate * 0.7,
            improvementPercentage: ((topPerformers[0].conversionRate * 0.7 - avgConversionRate) / avgConversionRate) * 100,
            confidenceLevel: 80
          },
          title: `Replicate High-Performing ${type} Content`,
          description: `Top-performing ${type} content converts at ${topPerformers[0].conversionRate.toFixed(1)}%, significantly higher than the ${avgConversionRate.toFixed(1)}% average.`,
          actionItems: [
            'Analyze common elements in top-performing content',
            'Create templates based on successful patterns',
            'A/B test variations of high-performing messages',
            'Train team on effective copywriting techniques',
            topPerformers[0].subjectLine ? `Use similar subject lines: "${topPerformers[0].subjectLine}"` : 'Document successful messaging patterns'
          ],
          implementation: {
            difficulty: 'easy',
            estimatedTime: '3-4 days',
            requiredResources: ['Content analyst', 'Copywriter', 'A/B testing tools']
          },
          relatedData: { topPerformers }
        });
      }

      // Low sentiment scores
      const avgSentiment = contents.reduce((sum, c) => sum + c.sentimentScore, 0) / contents.length;
      if (avgSentiment < 0.5 && contents.length > 10) {
        recommendations.push({
          id: `content-sentiment-${type}`,
          type: 'content',
          priority: 'medium',
          impact: {
            metric: 'Content Sentiment',
            currentValue: avgSentiment,
            projectedValue: 0.7,
            improvementPercentage: ((0.7 - avgSentiment) / avgSentiment) * 100,
            confidenceLevel: 70
          },
          title: `Improve ${type} Content Tone and Messaging`,
          description: `${type} content has low sentiment scores, suggesting recipients may find it irrelevant or poorly targeted.`,
          actionItems: [
            'Review and update value propositions',
            'Reduce promotional language, increase educational content',
            'Add more personalization tokens',
            'Include social proof and testimonials',
            'Simplify complex technical language'
          ],
          implementation: {
            difficulty: 'medium',
            estimatedTime: '1 week',
            requiredResources: ['Content strategist', 'Customer feedback data']
          }
        });
      }
    }

    return recommendations;
  }

  private async analyzeSequencePerformance(
    timeRange?: { start: Date; end: Date }
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Analyze multi-touch sequences
    const { data: logs, error } = await supabase
      .from('automation_logs')
      .select('metadata')
      .not('metadata->>sequenceStep', 'is', null);

    if (error || !logs) {
      console.error('Error fetching sequence data:', error);
      return [];
    }

    // Process sequence data
    const sequenceGroups: Record<string, Record<number, any[]>> = {};
    
    logs.forEach(log => {
      const templateId = log.metadata?.templateId;
      const sequenceStep = Number(log.metadata?.sequenceStep);
      
      if (templateId && !isNaN(sequenceStep)) {
        if (!sequenceGroups[templateId]) {
          sequenceGroups[templateId] = {};
        }
        if (!sequenceGroups[templateId][sequenceStep]) {
          sequenceGroups[templateId][sequenceStep] = [];
        }
        sequenceGroups[templateId][sequenceStep].push(log);
      }
    });

    // Calculate metrics for each template/step
    const sequenceData: any[] = [];
    
    Object.entries(sequenceGroups).forEach(([templateId, steps]) => {
      Object.entries(steps).forEach(([step, logs]) => {
        const sequenceStep = Number(step);
        const totalInSequence = logs.length;
        const completedSequence = logs.filter(log => log.metadata?.sequenceCompleted === 'true').length;
        const droppedOffLogs = logs.filter(log => log.metadata?.droppedOff === 'true');
        const avgDropoffStep = droppedOffLogs.length > 0
          ? droppedOffLogs.reduce((sum, log) => sum + Number(log.metadata?.sequenceStep || 0), 0) / droppedOffLogs.length
          : null;
          
        sequenceData.push({
          templateId,
          sequenceStep,
          totalInSequence,
          completedSequence,
          avgDropoffStep
        });
      });
    });

    // Group by template
    const sequencesByTemplate: Record<string, any[]> = {};
    sequenceData.forEach(seq => {
      if (!sequencesByTemplate[seq.templateId]) {
        sequencesByTemplate[seq.templateId] = [];
      }
      sequencesByTemplate[seq.templateId].push(seq);
    });

    for (const [templateId, sequences] of Object.entries(sequencesByTemplate)) {
      const totalStarts = sequences.find(s => s.sequenceStep === 1)?.totalInSequence || 0;
      const totalCompleted = sequences.reduce((sum, s) => sum + s.completedSequence, 0);
      const completionRate = totalStarts > 0 ? (totalCompleted / totalStarts) * 100 : 0;

      if (completionRate < 20 && totalStarts > 50) {
        // Find drop-off points
        const dropoffAnalysis = sequences
          .sort((a, b) => a.sequenceStep - b.sequenceStep)
          .map((seq, index, arr) => {
            const nextStep = arr[index + 1];
            const dropoffRate = nextStep 
              ? ((seq.totalInSequence - nextStep.totalInSequence) / seq.totalInSequence) * 100
              : 0;
            return { step: seq.sequenceStep, dropoffRate };
          });

        const highestDropoff = dropoffAnalysis.reduce((max, curr) => 
          curr.dropoffRate > max.dropoffRate ? curr : max
        );

        recommendations.push({
          id: `sequence-${templateId}`,
          type: 'sequence',
          priority: 'high',
          impact: {
            metric: 'Sequence Completion Rate',
            currentValue: completionRate,
            projectedValue: 35,
            improvementPercentage: ((35 - completionRate) / completionRate) * 100,
            confidenceLevel: 75
          },
          title: 'Optimize Multi-Touch Sequence Flow',
          description: `This sequence has only ${completionRate.toFixed(1)}% completion rate with highest drop-off at step ${highestDropoff.step} (${highestDropoff.dropoffRate.toFixed(1)}% drop).`,
          actionItems: [
            `Review and improve content at step ${highestDropoff.step}`,
            'Reduce sequence length or combine steps',
            'Add value-driven content earlier in sequence',
            'Implement re-engagement campaigns for drop-offs',
            'Test different timing between sequence steps'
          ],
          implementation: {
            difficulty: 'medium',
            estimatedTime: '3-5 days',
            requiredResources: ['Sequence designer', 'Analytics tools', 'Content writer']
          },
          relatedData: { dropoffAnalysis }
        });
      }
    }

    return recommendations;
  }

  async getOptimizationInsights(
    timeRange?: { start: Date; end: Date }
  ): Promise<OptimizationInsight[]> {
    const insights: OptimizationInsight[] = [];

    // ROI Insights
    const roiData = await automationROITracker.getROIDashboardData(timeRange);
    insights.push({
      category: 'Revenue Impact',
      insight: `Automation efforts have generated $${roiData.totalRevenue.toLocaleString()} in attributed revenue with an overall ROI of ${roiData.totalROI.toFixed(0)}%.`,
      dataPoints: [
        { metric: 'Total Revenue', value: `$${roiData.totalRevenue.toLocaleString()}`, trend: 'up' },
        { metric: 'Total Cost', value: `$${roiData.totalCost.toLocaleString()}` },
        { metric: 'ROI', value: `${roiData.totalROI.toFixed(0)}%`, trend: roiData.totalROI > 100 ? 'up' : 'down' },
        { metric: 'Top Performer', value: roiData.topPerformers[0]?.automationName || 'N/A' }
      ],
      recommendations: [
        `Scale up ${roiData.topPerformers[0]?.automationName || 'top performing'} automation`,
        'Reduce investment in automations with negative ROI',
        'Focus on multi-touch attribution for complex sales cycles'
      ]
    });

    // Engagement Insights
    const stakeholderEngagement = await engagementAnalytics.getStakeholderEngagement(undefined, timeRange);
    const topEngaged = stakeholderEngagement.sort((a, b) => b.engagementRate - a.engagementRate)[0];
    const lowEngaged = stakeholderEngagement.sort((a, b) => a.engagementRate - b.engagementRate)[0];

    insights.push({
      category: 'Stakeholder Engagement',
      insight: `${topEngaged.stakeholderType}s show the highest engagement at ${topEngaged.engagementRate.toFixed(1)}%, while ${lowEngaged.stakeholderType}s lag at ${lowEngaged.engagementRate.toFixed(1)}%.`,
      dataPoints: [
        { metric: 'Most Engaged', value: `${topEngaged.stakeholderType} (${topEngaged.engagementRate.toFixed(1)}%)`, trend: 'up' },
        { metric: 'Least Engaged', value: `${lowEngaged.stakeholderType} (${lowEngaged.engagementRate.toFixed(1)}%)`, trend: 'down' },
        { metric: 'Avg Response Time', value: `${topEngaged.averageResponseTime.toFixed(1)} hours` },
        { metric: 'Total Engaged', value: stakeholderEngagement.reduce((sum, s) => sum + s.engagedContacts, 0).toString() }
      ],
      recommendations: [
        `Create specialized content for ${lowEngaged.stakeholderType}s`,
        `Maintain momentum with ${topEngaged.stakeholderType}s through consistent value delivery`,
        'Implement role-based personalization across all templates'
      ]
    });

    // Performance Trends
    const trends = await engagementAnalytics.getEngagementTrends(timeRange, 'week');
    const recentTrend = trends.slice(-4);
    const trendDirection = recentTrend.length > 1 && 
      recentTrend[recentTrend.length - 1].engagementRate > recentTrend[0].engagementRate ? 'up' : 'down';

    insights.push({
      category: 'Performance Trends',
      insight: `Engagement rates are trending ${trendDirection} over the past 4 weeks, with current rate at ${recentTrend[recentTrend.length - 1]?.engagementRate.toFixed(1)}%.`,
      dataPoints: recentTrend.map(t => ({
        metric: `Week of ${t.period}`,
        value: `${t.engagementRate.toFixed(1)}%`,
        trend: trendDirection
      })),
      recommendations: [
        trendDirection === 'down' ? 'Investigate causes of declining engagement' : 'Maintain current strategies driving improvement',
        'Set up automated alerts for significant trend changes',
        'Implement weekly performance reviews'
      ]
    });

    return insights;
  }

  async getPredictiveRecommendations(
    accountId?: string,
    timeRange?: { start: Date; end: Date }
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Predictive churn analysis
    const churnRisk = await this.predictChurnRisk(accountId, timeRange);
    if (churnRisk.risk > 0.7) {
      recommendations.push({
        id: `predictive-churn-${accountId || 'global'}`,
        type: 'audience',
        priority: 'critical',
        impact: {
          metric: 'Churn Risk',
          currentValue: churnRisk.risk * 100,
          projectedValue: 30,
          improvementPercentage: -70,
          confidenceLevel: churnRisk.confidence
        },
        title: 'High Churn Risk Detected',
        description: `${accountId ? 'This account' : 'Multiple accounts'} showing ${(churnRisk.risk * 100).toFixed(0)}% churn risk based on engagement patterns.`,
        actionItems: [
          'Initiate immediate re-engagement campaign',
          'Schedule executive-level check-in call',
          'Offer exclusive training or support resources',
          'Review and address any outstanding issues',
          'Provide success story case studies'
        ],
        implementation: {
          difficulty: 'easy',
          estimatedTime: 'Immediate',
          requiredResources: ['Account manager', 'Executive sponsor']
        },
        relatedData: churnRisk
      });
    }

    // Next best action prediction
    const nextBestAction = await this.predictNextBestAction(accountId, timeRange);
    if (nextBestAction) {
      recommendations.push({
        id: `predictive-nba-${accountId || 'global'}`,
        type: nextBestAction.actionType as any,
        priority: 'high',
        impact: {
          metric: nextBestAction.expectedOutcome,
          currentValue: nextBestAction.currentValue,
          projectedValue: nextBestAction.projectedValue,
          improvementPercentage: ((nextBestAction.projectedValue - nextBestAction.currentValue) / nextBestAction.currentValue) * 100,
          confidenceLevel: nextBestAction.confidence
        },
        title: `Recommended Next Best Action: ${nextBestAction.action}`,
        description: nextBestAction.rationale,
        actionItems: nextBestAction.steps,
        implementation: {
          difficulty: 'easy',
          estimatedTime: nextBestAction.timeframe,
          requiredResources: nextBestAction.resources
        }
      });
    }

    return recommendations;
  }

  private async predictChurnRisk(
    accountId?: string,
    timeRange?: { start: Date; end: Date }
  ): Promise<{ risk: number; confidence: number; factors: string[] }> {
    // Simplified churn prediction based on engagement metrics
    let query = supabase
      .from('automation_logs')
      .select('metadata, created_at');

    if (accountId) {
      query = query.eq('metadata->>accountId', accountId);
    }

    const { data: logs, error } = await query;

    if (error || !logs) {
      console.error('Error fetching churn data:', error);
      return { risk: 0, confidence: 0, factors: [] };
    }

    // Calculate metrics
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEngagements = logs.filter(log => new Date(log.created_at) > thirtyDaysAgo).length;
    const totalEngagements = logs.length;
    const lastEngagement = logs.length > 0 
      ? new Date(Math.max(...logs.map(log => new Date(log.created_at).getTime())))
      : null;
    const uniqueContactIds = new Set(logs.map(log => log.metadata?.contactId).filter(Boolean));
    const uniqueContacts = uniqueContactIds.size;
    const respondedCount = logs.filter(log => log.metadata?.responded === true).length;
    const responseRate = totalEngagements > 0 ? (respondedCount / totalEngagements) * 100 : 0;

    const metrics = {
      recentEngagements,
      totalEngagements,
      lastEngagement,
      uniqueContacts,
      responseRate
    };

    // Calculate risk factors
    const factors: string[] = [];
    let riskScore = 0;

    // No recent engagement
    if (metrics.recentEngagements === 0) {
      riskScore += 0.3;
      factors.push('No engagement in past 30 days');
    }

    // Declining engagement
    if (metrics.totalEngagements > 0 && metrics.recentEngagements < metrics.totalEngagements * 0.1) {
      riskScore += 0.2;
      factors.push('Significant decline in engagement');
    }

    // Low response rate
    if (metrics.responseRate < 5) {
      riskScore += 0.2;
      factors.push('Very low response rate');
    }

    // Few engaged contacts
    if (metrics.uniqueContacts < 3) {
      riskScore += 0.3;
      factors.push('Limited stakeholder engagement');
    }

    const confidence = metrics.totalEngagements > 50 ? 85 : 65;

    return { risk: Math.min(riskScore, 1), confidence, factors };
  }

  private async predictNextBestAction(
    accountId?: string,
    timeRange?: { start: Date; end: Date }
  ): Promise<any> {
    // Analyze recent patterns to suggest next action
    let query = supabase
      .from('automation_logs')
      .select('metadata, created_at');

    if (accountId) {
      query = query.eq('metadata->>accountId', accountId);
    }

    const { data: logs, error } = await query;

    if (error || !logs || logs.length === 0) {
      return {
        action: 'Initial Outreach Campaign',
        actionType: 'template',
        expectedOutcome: 'Initial Engagement Rate',
        currentValue: 0,
        projectedValue: 25,
        confidence: 70,
        rationale: 'No recent contact history. Starting with proven introduction template.',
        steps: [
          'Deploy "New Product Introduction" template',
          'Target key decision makers',
          'Follow up within 3 days'
        ],
        timeframe: '1-2 days',
        resources: ['Email template', 'Contact list']
      };
    }

    // Find most recent activity
    const sortedLogs = logs.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    const mostRecent = sortedLogs[0];
    const now = new Date();
    const lastContactDate = new Date(mostRecent.created_at);
    const daysSinceContact = Math.floor((now.getTime() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate average response time
    const responseLogs = logs.filter(log => log.metadata?.responseTimeHours != null);
    const avgResponseTime = responseLogs.length > 0
      ? responseLogs.reduce((sum, log) => sum + Number(log.metadata.responseTimeHours), 0) / responseLogs.length
      : 0;

    const recentActivity = [{
      lastTemplate: mostRecent.metadata?.templateId,
      lastChannel: mostRecent.metadata?.channel,
      daysSinceContact,
      avgResponseTime
    }];

    if (recentActivity.length === 0) {
      return {
        action: 'Initial Outreach Campaign',
        actionType: 'template',
        expectedOutcome: 'Initial Engagement Rate',
        currentValue: 0,
        projectedValue: 25,
        confidence: 70,
        rationale: 'No recent contact history. Starting with proven introduction template.',
        steps: [
          'Deploy "New Product Introduction" template',
          'Target key decision makers',
          'Follow up within 3 days'
        ],
        timeframe: '1-2 days',
        resources: ['Email template', 'Contact list']
      };
    }

    const [recent] = recentActivity;

    if (recent.daysSinceContact > 14) {
      return {
        action: 'Re-engagement Sequence',
        actionType: 'sequence',
        expectedOutcome: 'Re-engagement Rate',
        currentValue: 5,
        projectedValue: 20,
        confidence: 80,
        rationale: `${recent.daysSinceContact} days since last contact. Time for strategic re-engagement.`,
        steps: [
          'Send value-add content (case study or whitepaper)',
          'Follow with personalized check-in',
          'Offer exclusive demo or training'
        ],
        timeframe: '1 week',
        resources: ['Content library', 'Personalization data']
      };
    }

    return null;
  }

  private formatOptimalTimes(times: any[]): string {
    const formatted = times.map(t => {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const hours = t.hourOfDay;
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour = hours > 12 ? hours - 12 : hours || 12;
      return `${days[t.dayOfWeek]} ${hour}${period}`;
    });

    return formatted.join(', ');
  }

  async exportRecommendations(
    recommendations: Recommendation[],
    format: 'json' | 'csv' | 'pdf' = 'json'
  ): Promise<string> {
    if (format === 'json') {
      return JSON.stringify(recommendations, null, 2);
    }

    if (format === 'csv') {
      const headers = ['ID', 'Type', 'Priority', 'Title', 'Impact Metric', 'Current Value', 'Projected Value', 'Improvement %', 'Implementation Difficulty'];
      const rows = recommendations.map(r => [
        r.id,
        r.type,
        r.priority,
        r.title,
        r.impact.metric,
        r.impact.currentValue,
        r.impact.projectedValue,
        r.impact.improvementPercentage.toFixed(1),
        r.implementation.difficulty
      ]);

      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    // PDF format would require additional libraries
    throw new Error('PDF format not implemented');
  }
}

export const optimizationRecommendations = OptimizationRecommendations.getInstance();