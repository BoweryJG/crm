// Enhanced Translation Service with Google Translate API Integration
import axios, { AxiosResponse } from 'axios';
import { supabase } from '../supabase/supabase';

// Types and Interfaces
interface TranslationRequest {
  text: string;
  sourceLanguage?: string; // 'auto' for detection
  targetLanguage: string;
  context?: string;
  domain?: 'general' | 'medical' | 'business' | 'technical';
  preserveTechnicalTerms?: boolean;
  culturalAdaptation?: boolean;
}

interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
  confidence: number;
  alternatives?: string[];
  qualityScore: number;
  warnings?: string[];
  metadata: {
    provider: string;
    model?: string;
    processingTime: number;
    characterCount: number;
    estimatedCost?: number;
  };
}

interface TranslationCache {
  id: string;
  source_text: string;
  source_language: string;
  target_language: string;
  translated_text: string;
  confidence: number;
  quality_score: number;
  provider: string;
  domain: string;
  created_at: string;
  last_accessed: string;
  access_count: number;
  user_id: string;
  context_hash?: string;
}

interface LanguageDetection {
  language: string;
  confidence: number;
  alternatives: Array<{
    language: string;
    confidence: number;
  }>;
}

interface TranslationMemory {
  id: string;
  source_segment: string;
  target_segment: string;
  source_language: string;
  target_language: string;
  domain: string;
  quality_rating: number;
  last_modified: string;
  created_by: string;
  approved: boolean;
  metadata: Record<string, any>;
}

interface TranslationStats {
  totalTranslations: number;
  todayTranslations: number;
  charactersTranslated: number;
  cacheHitRate: number;
  averageQuality: number;
  languagePairs: Array<{
    from: string;
    to: string;
    count: number;
  }>;
  topLanguages: Array<{
    language: string;
    count: number;
  }>;
}

interface GoogleTranslateResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
}

interface DeepLResponse {
  translations: Array<{
    text: string;
    detected_source_language?: string;
  }>;
}

class TranslationService {
  private cache = new Map<string, TranslationResponse>();
  private memoryCache = new Map<string, TranslationMemory[]>();
  private backendUrl: string;
  private googleApiKey?: string;
  private deepLApiKey?: string;
  private isOnline = navigator.onLine;
  private maxCacheSize = 10000;
  private cacheExpiryHours = 24;

  // Supported languages
  private supportedLanguages = {
    'auto': 'Auto-detect',
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese (Simplified)',
    'zh-TW': 'Chinese (Traditional)',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'th': 'Thai',
    'vi': 'Vietnamese',
    'nl': 'Dutch',
    'sv': 'Swedish',
    'da': 'Danish',
    'no': 'Norwegian',
    'fi': 'Finnish',
    'pl': 'Polish',
    'cs': 'Czech',
    'hu': 'Hungarian',
    'ro': 'Romanian',
    'bg': 'Bulgarian',
    'hr': 'Croatian',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'et': 'Estonian',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'mt': 'Maltese',
    'el': 'Greek',
    'tr': 'Turkish',
    'he': 'Hebrew',
    'fa': 'Persian',
    'ur': 'Urdu',
    'bn': 'Bengali',
    'ta': 'Tamil',
    'te': 'Telugu',
    'ml': 'Malayalam',
    'kn': 'Kannada',
    'gu': 'Gujarati',
    'pa': 'Punjabi',
    'mr': 'Marathi',
    'ne': 'Nepali',
    'si': 'Sinhala',
    'my': 'Myanmar',
    'km': 'Khmer',
    'lo': 'Lao',
    'ka': 'Georgian',
    'am': 'Amharic',
    'sw': 'Swahili',
    'zu': 'Zulu',
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'az': 'Azerbaijani',
    'eu': 'Basque',
    'be': 'Belarusian',
    'bs': 'Bosnian',
    'ca': 'Catalan',
    'ceb': 'Cebuano',
    'co': 'Corsican',
    'cy': 'Welsh',
    'eo': 'Esperanto',
    'tl': 'Filipino',
    'fy': 'Frisian',
    'gl': 'Galician',
    'is': 'Icelandic',
    'ga': 'Irish',
    'jw': 'Javanese',
    'kk': 'Kazakh',
    'ky': 'Kyrgyz',
    'lb': 'Luxembourgish',
    'mk': 'Macedonian',
    'mg': 'Malagasy',
    'ms': 'Malay',
    'mi': 'Maori',
    'mn': 'Mongolian',
    'hmn': 'Hmong',
    'ny': 'Chichewa',
    'ps': 'Pashto',
    'sm': 'Samoan',
    'gd': 'Scottish Gaelic',
    'sr': 'Serbian',
    'st': 'Sesotho',
    'sn': 'Shona',
    'sd': 'Sindhi',
    'so': 'Somali',
    'su': 'Sundanese',
    'tg': 'Tajik',
    'tt': 'Tatar',
    'tk': 'Turkmen',
    'uk': 'Ukrainian',
    'uz': 'Uzbek',
    'xh': 'Xhosa',
    'yi': 'Yiddish',
    'yo': 'Yoruba'
  };

  constructor() {
    this.backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://osbackend-zl1h.onrender.com';
    this.googleApiKey = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY;
    this.deepLApiKey = process.env.REACT_APP_DEEPL_API_KEY;
    this.initializeService();
    this.setupEventListeners();
  }

  private async initializeService(): Promise<void> {
    try {
      await this.loadCacheFromDatabase();
      await this.loadTranslationMemory();
      console.log('Translation service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize translation service:', error);
    }
  }

  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('Translation service: Back online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('Translation service: Offline mode activated');
    });

    // Clean cache periodically
    setInterval(() => {
      this.cleanExpiredCache();
    }, 60000 * 60); // Every hour
  }

  // Main translation method
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    const startTime = Date.now();
    
    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(request);
      const cached = await this.getFromCache(cacheKey);
      if (cached && this.isCacheValid(cached)) {
        await this.updateCacheAccess(cacheKey);
        return {
          ...cached,
          metadata: {
            ...cached.metadata,
            processingTime: Date.now() - startTime
          }
        };
      }

      // Check translation memory
      const memoryMatch = await this.searchTranslationMemory(request);
      if (memoryMatch && memoryMatch.quality_rating >= 0.9) {
        const response: TranslationResponse = {
          translatedText: memoryMatch.target_segment,
          confidence: memoryMatch.quality_rating,
          qualityScore: memoryMatch.quality_rating,
          metadata: {
            provider: 'translation-memory',
            processingTime: Date.now() - startTime,
            characterCount: request.text.length
          }
        };
        
        await this.saveToCache(cacheKey, response, request);
        return response;
      }

      // If offline, return error or fallback
      if (!this.isOnline) {
        throw new Error('Translation service is offline and no cached result available');
      }

      // Try backend translation service first
      try {
        const backendResponse = await this.translateViaBackend(request);
        await this.saveToCache(cacheKey, backendResponse, request);
        await this.saveToTranslationMemory(request, backendResponse);
        return backendResponse;
      } catch (backendError) {
        console.warn('Backend translation failed, trying direct APIs:', backendError);
      }

      // Try DeepL API (higher quality)
      if (this.deepLApiKey) {
        try {
          const deepLResponse = await this.translateViaDeepL(request);
          await this.saveToCache(cacheKey, deepLResponse, request);
          await this.saveToTranslationMemory(request, deepLResponse);
          return deepLResponse;
        } catch (deepLError) {
          console.warn('DeepL translation failed:', deepLError);
        }
      }

      // Try Google Translate API
      if (this.googleApiKey) {
        try {
          const googleResponse = await this.translateViaGoogle(request);
          await this.saveToCache(cacheKey, googleResponse, request);
          await this.saveToTranslationMemory(request, googleResponse);
          return googleResponse;
        } catch (googleError) {
          console.warn('Google Translate failed:', googleError);
        }
      }

      throw new Error('All translation services failed');

    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  // Language detection
  async detectLanguage(text: string): Promise<LanguageDetection> {
    try {
      // Try backend first
      if (this.isOnline) {
        try {
          const response = await axios.post(
            `${this.backendUrl}/api/translate/detect`,
            { text },
            {
              headers: { 'Content-Type': 'application/json' },
              timeout: 10000
            }
          );
          
          return response.data;
        } catch (backendError) {
          console.warn('Backend language detection failed:', backendError);
        }
      }

      // Fallback to Google Translate detection
      if (this.googleApiKey) {
        const response = await axios.post(
          'https://translation.googleapis.com/language/translate/v2/detect',
          {
            q: text,
            key: this.googleApiKey
          }
        );

        const detection = response.data.data.detections[0][0];
        return {
          language: detection.language,
          confidence: detection.confidence,
          alternatives: response.data.data.detections[0].slice(1).map((d: any) => ({
            language: d.language,
            confidence: d.confidence
          }))
        };
      }

      throw new Error('No language detection service available');
    } catch (error) {
      console.error('Language detection error:', error);
      throw error;
    }
  }

  // Backend translation
  private async translateViaBackend(request: TranslationRequest): Promise<TranslationResponse> {
    const { data: { user } } = await supabase.auth.getUser();
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const response = await axios.post(
      `${this.backendUrl}/api/translate`,
      {
        ...request,
        userId: user?.id
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 30000
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Backend translation failed');
    }

    return {
      translatedText: response.data.translatedText,
      detectedLanguage: response.data.detectedLanguage,
      confidence: response.data.confidence || 0.9,
      alternatives: response.data.alternatives || [],
      qualityScore: response.data.qualityScore || 0.8,
      warnings: response.data.warnings || [],
      metadata: {
        provider: 'backend-ai',
        model: response.data.model,
        processingTime: response.data.processingTime || 0,
        characterCount: request.text.length,
        estimatedCost: response.data.estimatedCost
      }
    };
  }

  // DeepL translation
  private async translateViaDeepL(request: TranslationRequest): Promise<TranslationResponse> {
    const startTime = Date.now();
    
    const response = await axios.post(
      'https://api-free.deepl.com/v2/translate',
      {
        text: [request.text],
        target_lang: request.targetLanguage.toUpperCase(),
        source_lang: request.sourceLanguage === 'auto' ? undefined : request.sourceLanguage?.toUpperCase(),
        preserve_formatting: request.preserveTechnicalTerms,
        formality: request.domain === 'business' ? 'more' : 'default'
      },
      {
        headers: {
          'Authorization': `DeepL-Auth-Key ${this.deepLApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );

    const result: DeepLResponse = response.data;
    const translation = result.translations[0];

    return {
      translatedText: translation.text,
      detectedLanguage: translation.detected_source_language?.toLowerCase(),
      confidence: 0.95, // DeepL typically has high confidence
      qualityScore: 0.92,
      metadata: {
        provider: 'deepl',
        processingTime: Date.now() - startTime,
        characterCount: request.text.length
      }
    };
  }

  // Google Translate
  private async translateViaGoogle(request: TranslationRequest): Promise<TranslationResponse> {
    const startTime = Date.now();
    
    const response = await axios.post(
      'https://translation.googleapis.com/language/translate/v2',
      {
        q: request.text,
        target: request.targetLanguage,
        source: request.sourceLanguage === 'auto' ? undefined : request.sourceLanguage,
        format: 'text',
        key: this.googleApiKey
      }
    );

    const result: GoogleTranslateResponse = response.data;
    const translation = result.data.translations[0];

    return {
      translatedText: translation.translatedText,
      detectedLanguage: translation.detectedSourceLanguage,
      confidence: 0.85,
      qualityScore: 0.8,
      metadata: {
        provider: 'google-translate',
        processingTime: Date.now() - startTime,
        characterCount: request.text.length
      }
    };
  }

  // Cache management
  private generateCacheKey(request: TranslationRequest): string {
    const keyData = {
      text: request.text,
      source: request.sourceLanguage || 'auto',
      target: request.targetLanguage,
      domain: request.domain || 'general',
      preserveTechnical: request.preserveTechnicalTerms || false,
      cultural: request.culturalAdaptation || false
    };
    
    return btoa(JSON.stringify(keyData)).replace(/[^a-zA-Z0-9]/g, '');
  }

  private async getFromCache(key: string): Promise<TranslationResponse | null> {
    // Check memory cache first
    const memoryCached = this.cache.get(key);
    if (memoryCached) {
      return memoryCached;
    }

    // Check database cache
    try {
      const { data } = await supabase
        .from('translation_cache')
        .select('*')
        .eq('id', key)
        .single();

      if (data && this.isCacheValid(data)) {
        const response: TranslationResponse = {
          translatedText: data.translated_text,
          detectedLanguage: data.source_language !== 'auto' ? data.source_language : undefined,
          confidence: data.confidence,
          qualityScore: data.quality_score,
          metadata: {
            provider: data.provider,
            processingTime: 0,
            characterCount: data.source_text.length
          }
        };
        
        // Cache in memory for faster access
        this.cache.set(key, response);
        return response;
      }
    } catch (error) {
      console.warn('Cache lookup failed:', error);
    }

    return null;
  }

  private async saveToCache(key: string, response: TranslationResponse, request: TranslationRequest): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Save to memory cache
      this.cache.set(key, response);

      // Save to database cache
      const cacheEntry: Omit<TranslationCache, 'id' | 'created_at' | 'last_accessed' | 'access_count'> = {
        source_text: request.text,
        source_language: request.sourceLanguage || 'auto',
        target_language: request.targetLanguage,
        translated_text: response.translatedText,
        confidence: response.confidence,
        quality_score: response.qualityScore,
        provider: response.metadata.provider,
        domain: request.domain || 'general',
        user_id: user.id,
        context_hash: request.context ? btoa(request.context) : undefined
      };

      await supabase
        .from('translation_cache')
        .upsert({
          id: key,
          ...cacheEntry,
          created_at: new Date().toISOString(),
          last_accessed: new Date().toISOString(),
          access_count: 1
        });

      // Clean cache if it's getting too large
      if (this.cache.size > this.maxCacheSize) {
        this.cleanMemoryCache();
      }
    } catch (error) {
      console.warn('Failed to save to cache:', error);
    }
  }

  private async updateCacheAccess(key: string): Promise<void> {
    try {
      await supabase
        .from('translation_cache')
        .update({
          last_accessed: new Date().toISOString(),
          access_count: supabase.rpc('increment_access_count', { cache_id: key })
        })
        .eq('id', key);
    } catch (error) {
      console.warn('Failed to update cache access:', error);
    }
  }

  private isCacheValid(cacheEntry: any): boolean {
    if (!cacheEntry.created_at) return false;
    
    const created = new Date(cacheEntry.created_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
    
    return hoursDiff < this.cacheExpiryHours;
  }

  private cleanMemoryCache(): void {
    // Remove oldest entries when cache is full
    const entries = Array.from(this.cache.entries());
    const toRemove = Math.floor(this.maxCacheSize * 0.2); // Remove 20%
    
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  private async cleanExpiredCache(): Promise<void> {
    try {
      const expiredDate = new Date();
      expiredDate.setHours(expiredDate.getHours() - this.cacheExpiryHours);
      
      await supabase
        .from('translation_cache')
        .delete()
        .lt('created_at', expiredDate.toISOString());
    } catch (error) {
      console.warn('Failed to clean expired cache:', error);
    }
  }

  // Translation Memory
  private async loadTranslationMemory(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('translation_memory')
        .select('*')
        .eq('created_by', user.id)
        .eq('approved', true)
        .order('last_modified', { ascending: false })
        .limit(1000);

      if (data) {
        // Group by language pairs
        data.forEach(entry => {
          const key = `${entry.source_language}-${entry.target_language}`;
          if (!this.memoryCache.has(key)) {
            this.memoryCache.set(key, []);
          }
          this.memoryCache.get(key)!.push(entry);
        });
      }
    } catch (error) {
      console.warn('Failed to load translation memory:', error);
    }
  }

  private async searchTranslationMemory(request: TranslationRequest): Promise<TranslationMemory | null> {
    const key = `${request.sourceLanguage || 'auto'}-${request.targetLanguage}`;
    const memories = this.memoryCache.get(key) || [];
    
    // Simple fuzzy matching - in production, you'd want more sophisticated matching
    for (const memory of memories) {
      const similarity = this.calculateSimilarity(request.text, memory.source_segment);
      if (similarity > 0.95) { // 95% similarity threshold
        return memory;
      }
    }
    
    return null;
  }

  private async saveToTranslationMemory(request: TranslationRequest, response: TranslationResponse): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const memoryEntry: Omit<TranslationMemory, 'id' | 'last_modified'> = {
        source_segment: request.text,
        target_segment: response.translatedText,
        source_language: request.sourceLanguage || response.detectedLanguage || 'auto',
        target_language: request.targetLanguage,
        domain: request.domain || 'general',
        quality_rating: response.qualityScore,
        created_by: user.id,
        approved: response.qualityScore >= 0.8, // Auto-approve high quality translations
        metadata: {
          provider: response.metadata.provider,
          confidence: response.confidence,
          context: request.context
        }
      };

      await supabase
        .from('translation_memory')
        .insert({
          ...memoryEntry,
          last_modified: new Date().toISOString()
        });
    } catch (error) {
      console.warn('Failed to save to translation memory:', error);
    }
  }

  private calculateSimilarity(text1: string, text2: string): number {
    // Simple Levenshtein distance-based similarity
    const len1 = text1.length;
    const len2 = text2.length;
    
    if (len1 === 0) return len2 === 0 ? 1 : 0;
    if (len2 === 0) return 0;
    
    const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(null));
    
    for (let i = 0; i <= len1; i++) matrix[0][i] = i;
    for (let j = 0; j <= len2; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= len2; j++) {
      for (let i = 1; i <= len1; i++) {
        const indicator = text1[i - 1] === text2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    const distance = matrix[len2][len1];
    return 1 - distance / Math.max(len1, len2);
  }

  // Database cache loading
  private async loadCacheFromDatabase(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const recentDate = new Date();
      recentDate.setHours(recentDate.getHours() - this.cacheExpiryHours);

      const { data } = await supabase
        .from('translation_cache')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', recentDate.toISOString())
        .order('last_accessed', { ascending: false })
        .limit(1000);

      if (data) {
        data.forEach(entry => {
          const response: TranslationResponse = {
            translatedText: entry.translated_text,
            detectedLanguage: entry.source_language !== 'auto' ? entry.source_language : undefined,
            confidence: entry.confidence,
            qualityScore: entry.quality_score,
            metadata: {
              provider: entry.provider,
              processingTime: 0,
              characterCount: entry.source_text.length
            }
          };
          this.cache.set(entry.id, response);
        });
      }
    } catch (error) {
      console.warn('Failed to load cache from database:', error);
    }
  }

  // Public API methods
  async getTranslationStats(userId?: string): Promise<TranslationStats> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;

      if (!targetUserId) {
        throw new Error('User not authenticated');
      }

      // Get cache stats
      const { data: cacheData } = await supabase
        .from('translation_cache')
        .select('*')
        .eq('user_id', targetUserId);

      // Get translation memory stats  
      const { data: memoryData } = await supabase
        .from('translation_memory')
        .select('*')
        .eq('created_by', targetUserId);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayTranslations = cacheData?.filter(entry => 
        new Date(entry.created_at) >= today
      ).length || 0;

      const totalTranslations = cacheData?.length || 0;
      const charactersTranslated = cacheData?.reduce((sum, entry) => 
        sum + entry.source_text.length, 0) || 0;

      // Calculate cache hit rate (simplified)
      const totalAccesses = cacheData?.reduce((sum, entry) => sum + entry.access_count, 0) || 0;
      const cacheHitRate = totalAccesses > 0 ? (totalAccesses - totalTranslations) / totalAccesses : 0;

      const averageQuality = cacheData?.reduce((sum, entry) => 
        sum + entry.quality_score, 0) / (cacheData?.length || 1) || 0;

      // Language pair analysis
      const languagePairMap = new Map<string, number>();
      const languageCountMap = new Map<string, number>();

      cacheData?.forEach(entry => {
        const pair = `${entry.source_language}-${entry.target_language}`;
        languagePairMap.set(pair, (languagePairMap.get(pair) || 0) + 1);
        
        languageCountMap.set(entry.source_language, (languageCountMap.get(entry.source_language) || 0) + 1);
        languageCountMap.set(entry.target_language, (languageCountMap.get(entry.target_language) || 0) + 1);
      });

      const languagePairs = Array.from(languagePairMap.entries()).map(([pair, count]) => {
        const [from, to] = pair.split('-');
        return { from, to, count };
      }).sort((a, b) => b.count - a.count).slice(0, 10);

      const topLanguages = Array.from(languageCountMap.entries()).map(([language, count]) => ({
        language,
        count
      })).sort((a, b) => b.count - a.count).slice(0, 10);

      return {
        totalTranslations,
        todayTranslations,
        charactersTranslated,
        cacheHitRate: Math.round(cacheHitRate * 100) / 100,
        averageQuality: Math.round(averageQuality * 100) / 100,
        languagePairs,
        topLanguages
      };
    } catch (error) {
      console.error('Error getting translation stats:', error);
      return {
        totalTranslations: 0,
        todayTranslations: 0,
        charactersTranslated: 0,
        cacheHitRate: 0,
        averageQuality: 0,
        languagePairs: [],
        topLanguages: []
      };
    }
  }

  getSupportedLanguages(): Record<string, string> {
    return { ...this.supportedLanguages };
  }

  async clearCache(userId?: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;

      if (!targetUserId) return;

      await supabase
        .from('translation_cache')
        .delete()
        .eq('user_id', targetUserId);

      this.cache.clear();
      console.log('Translation cache cleared');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  async exportTranslationMemory(userId?: string): Promise<TranslationMemory[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;

      if (!targetUserId) return [];

      const { data } = await supabase
        .from('translation_memory')
        .select('*')
        .eq('created_by', targetUserId)
        .order('last_modified', { ascending: false });

      return data || [];
    } catch (error) {
      console.error('Error exporting translation memory:', error);
      return [];
    }
  }

  async importTranslationMemory(memories: Omit<TranslationMemory, 'id' | 'created_by' | 'last_modified'>[]): Promise<{ success: boolean; imported: number; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, imported: 0, error: 'User not authenticated' };
      }

      const memoriesToImport = memories.map(memory => ({
        ...memory,
        created_by: user.id,
        last_modified: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('translation_memory')
        .insert(memoriesToImport)
        .select();

      if (error) {
        throw error;
      }

      // Refresh memory cache
      await this.loadTranslationMemory();

      return {
        success: true,
        imported: data?.length || 0
      };
    } catch (error) {
      console.error('Error importing translation memory:', error);
      return {
        success: false,
        imported: 0,
        error: error instanceof Error ? error.message : 'Import failed'
      };
    }
  }

  // Batch translation
  async translateBatch(requests: TranslationRequest[]): Promise<TranslationResponse[]> {
    const results: TranslationResponse[] = [];
    
    // Process in chunks to avoid overwhelming the API
    const chunkSize = 10;
    for (let i = 0; i < requests.length; i += chunkSize) {
      const chunk = requests.slice(i, i + chunkSize);
      const chunkPromises = chunk.map(request => this.translate(request));
      
      try {
        const chunkResults = await Promise.all(chunkPromises);
        results.push(...chunkResults);
      } catch (error) {
        console.error(`Batch translation chunk ${i / chunkSize + 1} failed:`, error);
        // Add error responses for failed chunk
        chunk.forEach(() => {
          results.push({
            translatedText: '',
            confidence: 0,
            qualityScore: 0,
            metadata: {
              provider: 'error',
              processingTime: 0,
              characterCount: 0
            }
          });
        });
      }
    }

    return results;
  }

  // Cleanup method
  destroy(): void {
    window.removeEventListener('online', this.setupEventListeners);
    window.removeEventListener('offline', this.setupEventListeners);
    this.cache.clear();
    this.memoryCache.clear();
    console.log('Translation service destroyed');
  }
}

export const translationService = new TranslationService();
export type { TranslationRequest, TranslationResponse, LanguageDetection, TranslationStats };