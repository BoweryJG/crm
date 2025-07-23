import { supabase } from '../supabase/supabase';

export interface PsychologicalProfile {
  personalityType: 'analytical' | 'driver' | 'expressive' | 'amiable';
  decisionMakingStyle: 'fast' | 'deliberate' | 'consensus' | 'delegated';
  communicationStyle: 'direct' | 'indirect' | 'formal' | 'casual';
  riskTolerance: 'high' | 'medium' | 'low';
  pricesensitivity: 'high' | 'medium' | 'low';
  trustFactors: string[];
  motivationalTriggers: string[];
  concernsAndObjections: string[];
}

export interface ConversationDynamics {
  talkTimeRatio: {
    rep: number;
    prospect: number;
  };
  interruptionPattern: {
    repInterruptions: number;
    prospectInterruptions: number;
  };
  questioningTechnique: {
    openQuestions: number;
    closedQuestions: number;
    leadingQuestions: number;
  };
  silenceMoments: Array<{
    duration: number;
    context: string;
    effectiveness: 'positive' | 'negative' | 'neutral';
  }>;
  emotionalFlow: Array<{
    timestamp: string;
    emotion: string;
    intensity: number;
    speaker: 'rep' | 'prospect';
  }>;
}

export interface PowerAnalysis {
  overallPowerDynamic: 'rep_dominant' | 'prospect_dominant' | 'balanced';
  controlMoments: Array<{
    timestamp: string;
    controlShift: 'to_rep' | 'to_prospect';
    trigger: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  influenceTechniques: {
    reciprocity: number;
    commitment: number;
    socialProof: number;
    authority: number;
    liking: number;
    scarcity: number;
  };
  persuasionEffectiveness: number; // 0-100
}

export interface SalesInsights {
  callStage: 'introduction' | 'discovery' | 'presentation' | 'objection_handling' | 'closing';
  buyingSignals: Array<{
    signal: string;
    strength: 'strong' | 'medium' | 'weak';
    timestamp: string;
  }>;
  objections: Array<{
    type: 'price' | 'time' | 'authority' | 'need' | 'trust';
    content: string;
    handled: boolean;
    effectiveness: number; // 0-100
  }>;
  nextBestActions: string[];
  winProbability: number; // 0-100
  recommendedFollowUp: {
    timing: string;
    approach: string;
    keyPoints: string[];
  };
}

export interface ComprehensiveLinguisticsAnalysis {
  id: string;
  callId: string;
  transcript: string;
  overallSentiment: 'positive' | 'neutral' | 'negative';
  confidenceScore: number;
  psychologicalProfile: PsychologicalProfile;
  conversationDynamics: ConversationDynamics;
  powerAnalysis: PowerAnalysis;
  salesInsights: SalesInsights;
  keyMoments: Array<{
    timestamp: string;
    moment: string;
    significance: 'critical' | 'important' | 'notable';
    recommendation: string;
  }>;
  coachingOpportunities: Array<{
    area: string;
    currentLevel: number; // 0-100
    improvement: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  createdAt: string;
  updatedAt: string;
}

class AdvancedLinguisticsService {
  // Analyze call transcript for comprehensive insights
  async analyzeCallTranscript(
    callId: string, 
    transcript: string, 
    audioUrl?: string
  ): Promise<ComprehensiveLinguisticsAnalysis> {
    try {
      // Step 1: Basic processing
      const segments = this.segmentTranscript(transcript);
      const speakers = this.identifySpeakers(segments);
      
      // Step 2: Psychological profiling
      const psychologicalProfile = this.analyzePsychologicalProfile(segments, speakers);
      
      // Step 3: Conversation dynamics
      const conversationDynamics = this.analyzeConversationDynamics(segments, speakers);
      
      // Step 4: Power analysis
      const powerAnalysis = this.analyzePowerDynamics(segments, speakers);
      
      // Step 5: Sales insights
      const salesInsights = this.generateSalesInsights(segments, speakers, psychologicalProfile);
      
      // Step 6: Key moments identification
      const keyMoments = this.identifyKeyMoments(segments, powerAnalysis, salesInsights);
      
      // Step 7: Coaching opportunities
      const coachingOpportunities = this.identifyCoachingOpportunities(
        conversationDynamics, 
        powerAnalysis, 
        salesInsights
      );
      
      // Step 8: Overall sentiment and confidence
      const overallSentiment = this.calculateOverallSentiment(segments);
      const confidenceScore = this.calculateConfidenceScore(segments);
      
      const analysis: ComprehensiveLinguisticsAnalysis = {
        id: `analysis_${Date.now()}`,
        callId,
        transcript,
        overallSentiment,
        confidenceScore,
        psychologicalProfile,
        conversationDynamics,
        powerAnalysis,
        salesInsights,
        keyMoments,
        coachingOpportunities,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Store in database
      await this.storeAnalysis(analysis);
      
      return analysis;
    } catch (error) {
      console.error('Error in analyzeCallTranscript:', error);
      throw error;
    }
  }

  // Segment transcript by speaker and time
  private segmentTranscript(transcript: string) {
    // Enhanced transcript parsing with timestamp and speaker detection
    const segments = [];
    const lines = transcript.split('\n');
    
    for (const line of lines) {
      // Pattern: [00:01:23] Speaker: Text
      const match = line.match(/\[(\d{2}:\d{2}:\d{2})\]\s*([^:]+):\s*(.+)/);
      
      if (match) {
        const [, timestamp, speaker, text] = match;
        segments.push({
          timestamp,
          speaker: speaker.trim().toLowerCase(),
          text: text.trim(),
          duration: this.estimateDuration(text),
          words: text.split(' ').length,
          sentiment: this.analyzeSentiment(text),
          emotions: this.detectEmotions(text),
          keyPhrases: this.extractKeyPhrases(text)
        });
      }
    }
    
    return segments;
  }

  // Identify and classify speakers
  private identifySpeakers(segments: any[]) {
    const speakerMap = new Map();
    
    for (const segment of segments) {
      if (!speakerMap.has(segment.speaker)) {
        // Determine if speaker is likely rep or prospect
        const isRep = this.identifyRepresentative(segment.speaker, segments);
        speakerMap.set(segment.speaker, {
          name: segment.speaker,
          role: isRep ? 'rep' : 'prospect',
          totalTalkTime: 0,
          wordCount: 0,
          segments: []
        });
      }
      
      const speaker = speakerMap.get(segment.speaker);
      speaker.totalTalkTime += segment.duration;
      speaker.wordCount += segment.words;
      speaker.segments.push(segment);
    }
    
    return Array.from(speakerMap.values());
  }

  // Analyze psychological profile of prospect
  private analyzePsychologicalProfile(segments: any[], speakers: any[]): PsychologicalProfile {
    const prospect = speakers.find(s => s.role === 'prospect');
    if (!prospect) {
      return this.getDefaultPsychologicalProfile();
    }
    
    const prospectText = prospect.segments.map((s: any) => s.text).join(' ');
    
    return {
      personalityType: this.determinePersonalityType(prospectText),
      decisionMakingStyle: this.analyzeDecisionMakingStyle(prospectText),
      communicationStyle: this.analyzeCommunicationStyle(prospectText),
      riskTolerance: this.analyzeRiskTolerance(prospectText),
      pricesensitivity: this.analyzePriceSensitivity(prospectText),
      trustFactors: this.identifyTrustFactors(prospectText),
      motivationalTriggers: this.identifyMotivationalTriggers(prospectText),
      concernsAndObjections: this.identifyConcerns(prospectText)
    };
  }

  // Analyze conversation dynamics
  private analyzeConversationDynamics(segments: any[], speakers: any[]): ConversationDynamics {
    const rep = speakers.find(s => s.role === 'rep');
    const prospect = speakers.find(s => s.role === 'prospect');
    
    if (!rep || !prospect) {
      return this.getDefaultConversationDynamics();
    }
    
    const totalTalkTime = rep.totalTalkTime + prospect.totalTalkTime;
    
    return {
      talkTimeRatio: {
        rep: Math.round((rep.totalTalkTime / totalTalkTime) * 100),
        prospect: Math.round((prospect.totalTalkTime / totalTalkTime) * 100)
      },
      interruptionPattern: this.analyzeInterruptions(segments),
      questioningTechnique: this.analyzeQuestioningTechnique(rep.segments),
      silenceMoments: this.analyzeSilenceMoments(segments),
      emotionalFlow: this.analyzeEmotionalFlow(segments)
    };
  }

  // Analyze power dynamics
  private analyzePowerDynamics(segments: any[], speakers: any[]): PowerAnalysis {
    const powerShifts = this.identifyPowerShifts(segments);
    const influenceTechniques = this.analyzeInfluenceTechniques(segments);
    
    return {
      overallPowerDynamic: this.determineOverallPowerDynamic(powerShifts),
      controlMoments: powerShifts,
      influenceTechniques,
      persuasionEffectiveness: this.calculatePersuasionEffectiveness(influenceTechniques, powerShifts)
    };
  }

  // Generate sales insights
  private generateSalesInsights(
    segments: any[], 
    speakers: any[], 
    psychProfile: PsychologicalProfile
  ): SalesInsights {
    return {
      callStage: this.identifyCallStage(segments),
      buyingSignals: this.identifyBuyingSignals(segments),
      objections: this.analyzeObjections(segments),
      nextBestActions: this.generateNextBestActions(segments, psychProfile),
      winProbability: this.calculateWinProbability(segments, psychProfile),
      recommendedFollowUp: this.generateFollowUpRecommendations(segments, psychProfile)
    };
  }

  // Helper methods for psychological analysis
  private determinePersonalityType(text: string): PsychologicalProfile['personalityType'] {
    const analyticalWords = ['data', 'research', 'analysis', 'study', 'statistics', 'evidence'];
    const driverWords = ['results', 'action', 'now', 'immediately', 'decision', 'bottom line'];
    const expressiveWords = ['exciting', 'amazing', 'fantastic', 'love', 'feel', 'experience'];
    const amiableWords = ['team', 'together', 'support', 'help', 'comfortable', 'relationship'];
    
    const scores = {
      analytical: this.countWordMatches(text, analyticalWords),
      driver: this.countWordMatches(text, driverWords),
      expressive: this.countWordMatches(text, expressiveWords),
      amiable: this.countWordMatches(text, amiableWords)
    };
    
    return Object.keys(scores).reduce((a, b) => 
      scores[a as keyof typeof scores] > scores[b as keyof typeof scores] ? a : b
    ) as PsychologicalProfile['personalityType'];
  }

  private analyzeDecisionMakingStyle(text: string): PsychologicalProfile['decisionMakingStyle'] {
    if (text.includes('need to think') || text.includes('discuss with')) return 'deliberate';
    if (text.includes('team decision') || text.includes('get approval')) return 'consensus';
    if (text.includes('not my call') || text.includes('boss decides')) return 'delegated';
    return 'fast';
  }

  private countWordMatches(text: string, words: string[]): number {
    const lowerText = text.toLowerCase();
    return words.reduce((count, word) => {
      return count + (lowerText.split(word).length - 1);
    }, 0);
  }

  // Store analysis in database
  private async storeAnalysis(analysis: ComprehensiveLinguisticsAnalysis): Promise<void> {
    try {
      const { error } = await supabase
        .from('advanced_linguistics_analysis')
        .insert([{
          id: analysis.id,
          call_id: analysis.callId,
          transcript: analysis.transcript,
          overall_sentiment: analysis.overallSentiment,
          confidence_score: analysis.confidenceScore,
          psychological_profile: analysis.psychologicalProfile,
          conversation_dynamics: analysis.conversationDynamics,
          power_analysis: analysis.powerAnalysis,
          sales_insights: analysis.salesInsights,
          key_moments: analysis.keyMoments,
          coaching_opportunities: analysis.coachingOpportunities,
          created_at: analysis.createdAt,
          updated_at: analysis.updatedAt
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error storing analysis:', error);
      throw error;
    }
  }

  // Mock implementations for complex analysis methods
  private estimateDuration(text: string): number {
    // Approximate duration based on reading speed (150 WPM)
    const words = text.split(' ').length;
    return Math.round((words / 150) * 60); // seconds
  }

  private analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['great', 'excellent', 'love', 'perfect', 'amazing', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'disappointed', 'concerned'];
    
    const positiveCount = this.countWordMatches(text, positiveWords);
    const negativeCount = this.countWordMatches(text, negativeWords);
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private detectEmotions(text: string): string[] {
    const emotions: string[] = [];
    
    if (text.includes('excited') || text.includes('!')) emotions.push('excitement');
    if (text.includes('worried') || text.includes('concerned')) emotions.push('concern');
    if (text.includes('confused') || text.includes('?')) emotions.push('confusion');
    if (text.includes('confident') || text.includes('sure')) emotions.push('confidence');
    
    return emotions;
  }

  private extractKeyPhrases(text: string): string[] {
    // Simple keyword extraction - in production would use NLP
    const keywords = text.toLowerCase()
      .split(' ')
      .filter(word => word.length > 4)
      .filter(word => !['the', 'and', 'but', 'that', 'this', 'with', 'from'].includes(word));
    
    return keywords.slice(0, 5);
  }

  private identifyRepresentative(speakerName: string, segments: any[]): boolean {
    // Heuristics to identify the sales rep
    const repIndicators = ['agent', 'rep', 'sales', 'advisor', 'consultant'];
    const prospectIndicators = ['client', 'customer', 'prospect', 'patient'];
    
    const name = speakerName.toLowerCase();
    
    if (repIndicators.some(indicator => name.includes(indicator))) return true;
    if (prospectIndicators.some(indicator => name.includes(indicator))) return false;
    
    // Default logic: first speaker is usually the rep
    const firstSpeaker = segments[0]?.speaker;
    return speakerName === firstSpeaker;
  }

  // Default fallback methods
  private getDefaultPsychologicalProfile(): PsychologicalProfile {
    return {
      personalityType: 'analytical',
      decisionMakingStyle: 'deliberate',
      communicationStyle: 'formal',
      riskTolerance: 'medium',
      pricesensitivity: 'medium',
      trustFactors: ['credentials', 'reviews', 'referrals'],
      motivationalTriggers: ['quality', 'value', 'convenience'],
      concernsAndObjections: ['price', 'time', 'effectiveness']
    };
  }

  private getDefaultConversationDynamics(): ConversationDynamics {
    return {
      talkTimeRatio: { rep: 60, prospect: 40 },
      interruptionPattern: { repInterruptions: 2, prospectInterruptions: 1 },
      questioningTechnique: { openQuestions: 5, closedQuestions: 3, leadingQuestions: 2 },
      silenceMoments: [],
      emotionalFlow: []
    };
  }

  // Additional analysis methods (simplified for demo)
  private analyzeInterruptions(segments: any[]) {
    return { repInterruptions: 3, prospectInterruptions: 1 };
  }

  private analyzeQuestioningTechnique(repSegments: any[]) {
    return { openQuestions: 8, closedQuestions: 4, leadingQuestions: 2 };
  }

  private analyzeSilenceMoments(segments: any[]) {
    return [
      { duration: 3, context: 'After price mention', effectiveness: 'positive' as const },
      { duration: 5, context: 'Before objection', effectiveness: 'negative' as const }
    ];
  }

  private analyzeEmotionalFlow(segments: any[]) {
    return segments.slice(0, 5).map((segment, index) => ({
      timestamp: segment.timestamp,
      emotion: ['neutral', 'positive', 'excited', 'concerned', 'confident'][index % 5],
      intensity: Math.floor(Math.random() * 10) + 1,
      speaker: segment.speaker.includes('rep') ? 'rep' as const : 'prospect' as const
    }));
  }

  private identifyPowerShifts(segments: any[]) {
    return [
      {
        timestamp: '00:05:30',
        controlShift: 'to_rep' as const,
        trigger: 'Strong value proposition',
        impact: 'high' as const
      },
      {
        timestamp: '00:12:15',
        controlShift: 'to_prospect' as const,
        trigger: 'Price objection',
        impact: 'medium' as const
      }
    ];
  }

  private analyzeInfluenceTechniques(segments: any[]) {
    return {
      reciprocity: 7,
      commitment: 8,
      socialProof: 6,
      authority: 9,
      liking: 7,
      scarcity: 5
    };
  }

  private determineOverallPowerDynamic(powerShifts: any[]): PowerAnalysis['overallPowerDynamic'] {
    return 'balanced';
  }

  private calculatePersuasionEffectiveness(influenceTechniques: any, powerShifts: any[]): number {
    const values = Object.values(influenceTechniques) as number[];
    const avgInfluence = values.reduce((a: number, b: number) => a + b, 0) / 6;
    return Math.round(avgInfluence * 10);
  }

  private identifyCallStage(segments: any[]): SalesInsights['callStage'] {
    // Simple stage identification based on keywords
    const allText = segments.map(s => s.text).join(' ').toLowerCase();
    
    if (allText.includes('let me tell you about') || allText.includes('our solution')) return 'presentation';
    if ((allText.includes('price') || allText.includes('cost')) && allText.includes('concerned')) return 'objection_handling';
    if (allText.includes('ready to move forward') || allText.includes('when can we start')) return 'closing';
    if (allText.includes('tell me about') || allText.includes('what are your')) return 'discovery';
    
    return 'introduction';
  }

  private identifyBuyingSignals(segments: any[]) {
    return [
      { signal: 'Asked about implementation timeline', strength: 'strong' as const, timestamp: '00:08:45' },
      { signal: 'Mentioned budget approval process', strength: 'medium' as const, timestamp: '00:15:20' }
    ];
  }

  private analyzeObjections(segments: any[]) {
    return [
      {
        type: 'price' as const,
        content: 'This seems expensive compared to other options',
        handled: true,
        effectiveness: 75
      }
    ];
  }

  private generateNextBestActions(segments: any[], psychProfile: PsychologicalProfile): string[] {
    return [
      'Send detailed ROI analysis within 24 hours',
      'Schedule demo with decision maker',
      'Provide 3 customer references in similar industry',
      'Follow up with implementation timeline'
    ];
  }

  private calculateWinProbability(segments: any[], psychProfile: PsychologicalProfile): number {
    // Simplified calculation based on various factors
    let probability = 50; // Base probability
    
    // Adjust based on buying signals, objections, sentiment, etc.
    if (this.identifyBuyingSignals(segments).length > 0) probability += 20;
    if (this.analyzeObjections(segments).some(obj => !obj.handled)) probability -= 15;
    if (psychProfile.decisionMakingStyle === 'fast') probability += 10;
    
    return Math.max(0, Math.min(100, probability));
  }

  private generateFollowUpRecommendations(segments: any[], psychProfile: PsychologicalProfile) {
    return {
      timing: psychProfile.decisionMakingStyle === 'fast' ? 'Within 24 hours' : 'Within 3-5 days',
      approach: psychProfile.personalityType === 'analytical' ? 'Data-driven follow-up' : 'Relationship-focused',
      keyPoints: [
        'Address price concerns with ROI data',
        'Provide implementation timeline',
        'Share relevant case studies'
      ]
    };
  }

  private identifyKeyMoments(segments: any[], powerAnalysis: PowerAnalysis, salesInsights: SalesInsights) {
    return [
      {
        timestamp: '00:05:30',
        moment: 'Strong value proposition delivery',
        significance: 'critical' as const,
        recommendation: 'Use similar approach in future calls'
      },
      {
        timestamp: '00:12:15',
        moment: 'Price objection raised',
        significance: 'important' as const,
        recommendation: 'Prepare stronger ROI justification'
      }
    ];
  }

  private identifyCoachingOpportunities(
    dynamics: ConversationDynamics,
    powerAnalysis: PowerAnalysis,
    salesInsights: SalesInsights
  ) {
    return [
      {
        area: 'Question Technique',
        currentLevel: 70,
        improvement: 'Increase ratio of open-ended questions',
        priority: 'medium' as const
      },
      {
        area: 'Objection Handling',
        currentLevel: 85,
        improvement: 'Excellent objection handling demonstrated',
        priority: 'low' as const
      },
      {
        area: 'Talk Time Balance',
        currentLevel: dynamics.talkTimeRatio.rep > 70 ? 60 : 80,
        improvement: dynamics.talkTimeRatio.rep > 70 ? 'Listen more, talk less' : 'Good balance maintained',
        priority: dynamics.talkTimeRatio.rep > 70 ? 'high' as const : 'low' as const
      }
    ];
  }

  private calculateOverallSentiment(segments: any[]): 'positive' | 'neutral' | 'negative' {
    const sentiments = segments.map(s => s.sentiment);
    const positive = sentiments.filter(s => s === 'positive').length;
    const negative = sentiments.filter(s => s === 'negative').length;
    
    if (positive > negative) return 'positive';
    if (negative > positive) return 'negative';
    return 'neutral';
  }

  private calculateConfidenceScore(segments: any[]): number {
    // Base confidence on transcript completeness and analysis depth
    return Math.min(100, segments.length * 2 + Math.random() * 20);
  }

  // Additional analysis methods
  private analyzeCommunicationStyle(text: string): PsychologicalProfile['communicationStyle'] {
    if (text.includes('please') && text.includes('thank you')) return 'formal';
    if (text.includes('yeah') || text.includes('gonna')) return 'casual';
    if (text.match(/\b(I think|maybe|perhaps)\b/)) return 'indirect';
    return 'direct';
  }

  private analyzeRiskTolerance(text: string): PsychologicalProfile['riskTolerance'] {
    const riskAverseWords = ['safe', 'secure', 'proven', 'guarantee', 'risk'];
    const riskTakingWords = ['new', 'innovative', 'cutting-edge', 'opportunity'];
    
    const averse = this.countWordMatches(text, riskAverseWords);
    const taking = this.countWordMatches(text, riskTakingWords);
    
    if (averse > taking) return 'low';
    if (taking > averse) return 'high';
    return 'medium';
  }

  private analyzePriceSensitivity(text: string): PsychologicalProfile['pricesensitivity'] {
    const priceWords = ['expensive', 'cost', 'budget', 'cheap', 'affordable', 'price'];
    const valueWords = ['value', 'worth', 'investment', 'quality', 'return'];
    
    const priceCount = this.countWordMatches(text, priceWords);
    const valueCount = this.countWordMatches(text, valueWords);
    
    if (priceCount > valueCount * 2) return 'high';
    if (valueCount > priceCount) return 'low';
    return 'medium';
  }

  private identifyTrustFactors(text: string): string[] {
    const factors = [];
    if (text.includes('review') || text.includes('testimonial')) factors.push('Social Proof');
    if (text.includes('credential') || text.includes('certification')) factors.push('Authority');
    if (text.includes('guarantee') || text.includes('warranty')) factors.push('Risk Reduction');
    if (text.includes('reference') || text.includes('referral')) factors.push('Referrals');
    return factors.length > 0 ? factors : ['Credibility', 'Experience', 'Results'];
  }

  private identifyMotivationalTriggers(text: string): string[] {
    const triggers = [];
    if (text.includes('time') || text.includes('efficient')) triggers.push('Time Savings');
    if (text.includes('money') || text.includes('save')) triggers.push('Cost Savings');
    if (text.includes('better') || text.includes('improve')) triggers.push('Improvement');
    if (text.includes('easy') || text.includes('simple')) triggers.push('Convenience');
    return triggers.length > 0 ? triggers : ['Quality', 'Results', 'Peace of Mind'];
  }

  private identifyConcerns(text: string): string[] {
    const concerns = [];
    if (text.includes('expensive') || text.includes('cost')) concerns.push('Price concerns');
    if (text.includes('time') || text.includes('busy')) concerns.push('Time constraints');
    if (text.includes('sure') || text.includes('certain')) concerns.push('Uncertainty');
    if (text.includes('work') || text.includes('effective')) concerns.push('Effectiveness doubts');
    return concerns.length > 0 ? concerns : ['Implementation complexity', 'Change management'];
  }

  // Public method to get analysis by call ID
  async getAnalysisByCallId(callId: string): Promise<ComprehensiveLinguisticsAnalysis | null> {
    try {
      const { data, error } = await supabase
        .from('advanced_linguistics_analysis')
        .select('*')
        .eq('call_id', callId)
        .single();

      if (error) {
        console.error('Error fetching analysis:', error);
        return null;
      }

      return {
        id: data.id,
        callId: data.call_id,
        transcript: data.transcript,
        overallSentiment: data.overall_sentiment,
        confidenceScore: data.confidence_score,
        psychologicalProfile: data.psychological_profile,
        conversationDynamics: data.conversation_dynamics,
        powerAnalysis: data.power_analysis,
        salesInsights: data.sales_insights,
        keyMoments: data.key_moments,
        coachingOpportunities: data.coaching_opportunities,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error in getAnalysisByCallId:', error);
      return null;
    }
  }
}

const advancedLinguisticsService = new AdvancedLinguisticsService();
export default advancedLinguisticsService;