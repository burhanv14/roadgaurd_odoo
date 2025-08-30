import axios from 'axios';

// Free translation API (LibreTranslate)
const TRANSLATION_API_URL = 'https://libretranslate.de/translate';

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 5, // Max 5 requests per window
  windowMs: 1000, // 1 second window
  requests: [] as number[],
};

// Fallback translations for common phrases (in case API fails)
const FALLBACK_TRANSLATIONS: Record<string, string> = {
  // App title
  'RoadGuard': 'RoadGuard',
  
  // Login page
  'Sign in to your account': 'अपने खाते में साइन इन करें',
  'Or': 'या',
  'create a new account': 'नया खाता बनाएं',
  'Email address': 'ईमेल पता',
  'Password': 'पासवर्ड',
  'Remember me': 'मुझे याद रखें',
  'Forgot your password?': 'पासवर्ड भूल गए?',
  'Sign in': 'साइन इन करें',
  'Signing in...': 'साइन इन हो रहा है...',
  
  // Signup page
  'Create your account': 'अपना खाता बनाएं',
  'sign in to your existing account': 'अपने मौजूदा खाते में साइन इन करें',
  'Full Name': 'पूरा नाम',
  'Email Address': 'ईमेल पता',
  'Confirm Password': 'पासवर्ड की पुष्टि करें',
  'Creating account...': 'खाता बन रहा है...',
  'Sign up': 'साइन अप करें',
  
  // Dashboard
  'Dashboard': 'डैशबोर्ड',
  'Welcome': 'स्वागत है',
  'Logout': 'लॉगआउट',
  'Total Projects': 'कुल प्रोजेक्ट',
  'Completed Tasks': 'पूर्ण कार्य',
  'Pending Tasks': 'लंबित कार्य',
  'Recent Activity': 'हाल की गतिविधि',
  'Your latest actions and updates.': 'आपके नवीनतम कार्य और अपडेट।',
  'New project created: "E-commerce Website"': 'नया प्रोजेक्ट बनाया गया: "ई-कॉमर्स वेबसाइट"',
  'Task completed: "Design homepage mockup"': 'कार्य पूर्ण: "होमपेज मॉकअप डिज़ाइन"',
  'Team member added: "Sarah Johnson"': 'टीम सदस्य जोड़ा गया: "सारा जॉनसन"',
  '2 hours ago': '2 घंटे पहले',
  '4 hours ago': '4 घंटे पहले',
  '1 day ago': '1 दिन पहले',
  
  // Home page
  'Welcome to RoadGuard': 'RoadGuard में आपका स्वागत है',
  'Your trusted partner for road safety and assistance': 'सड़क सुरक्षा और सहायता के लिए आपका विश्वसनीय साथी',
  '24/7 Emergency Support': '24/7 आपातकालीन सहायता',
  'Real-time Vehicle Tracking': 'रीयल-टाइम वाहन ट्रैकिंग',
  'Roadside Assistance': 'सड़क किनारे सहायता',
  'Get Started Today': 'आज ही शुरू करें',
  'Learn More': 'और जानें',
  'Round the clock assistance when you need it most': 'जब आपको सबसे ज्यादा जरूरत हो तब 24 घंटे सहायता',
  'Know exactly where your vehicle is at all times': 'हर समय अपने वाहन की सटीक जानकारी रखें',
  'Professional help when you\'re stranded': 'जब आप फंसे हों तो पेशेवर मदद',
  
  // Header
  '24x7 Support': '24x7 सहायता',
  'Get Help': 'मदद लें',
  'Get Help Now': 'अभी मदद लें',
  
  // Footer
  'Reach Us': 'हमसे संपर्क करें',
  'Company': 'कंपनी',
  'About Us': 'हमारे बारे में',
  'Careers': 'करियर',
  'Contact Us': 'संपर्क करें',
  'News': 'समाचार',
  'Services': 'सेवाएं',
  'Flat Tyre': 'फ्लैट टायर',
  'Battery Jumpstart': 'बैटरी जंपस्टार्ट',
  'Key Unlock Assistance': 'कुंजी अनलॉक सहायता',
  'Fuel Delivery': 'ईंधन डिलीवरी',
  'Towing': 'टोइंग',
  'Quick Links': 'त्वरित लिंक',
  'My Subscriptions': 'मेरी सदस्यताएं',
  'Nearby Fuel Stations': 'पास के पेट्रोल पंप',
  'Fitment Centers': 'फिटमेंट सेंटर',
  'Year Recap': 'वर्ष समीक्षा',
  'Services Pvt. Ltd.': 'सेवाएं प्राइवेट लिमिटेड',
  'All Rights Reserved.': 'सर्वाधिकार सुरक्षित।',
  'Privacy Policy': 'गोपनीयता नीति',
  'Terms & Conditions': 'नियम और शर्तें',
  '123 Main Street, MG Road': '123 मेन स्ट्रीट, एमजी रोड',
  'Bengaluru, Karnataka - 560001': 'बेंगलुरु, कर्नाटक - 560001',
  'India': 'भारत',
  
  // 404 page
  'Oops! The page you\'re looking for doesn\'t exist.': 'उफ्फ! आप जिस पेज की तलाश कर रहे हैं वह मौजूद नहीं है।',
  
  // Common
  'Translating...': 'अनुवाद हो रहा है...',
};

export interface TranslationRequest {
  q: string;
  source: string;
  target: string;
  format?: string;
}

export interface TranslationResponse {
  translatedText: string;
}

export class TranslationService {
  private static instance: TranslationService;
  private cache: Map<string, string> = new Map();
  private pendingRequests: Map<string, Promise<string>> = new Map();
  private isInitialized = false;

  private constructor() {
    this.loadCachedTranslations();
  }

  public static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  /**
   * Check rate limit
   */
  private checkRateLimit(): boolean {
    const now = Date.now();
    RATE_LIMIT.requests = RATE_LIMIT.requests.filter(
      time => now - time < RATE_LIMIT.windowMs
    );
    
    if (RATE_LIMIT.requests.length >= RATE_LIMIT.maxRequests) {
      return false;
    }
    
    RATE_LIMIT.requests.push(now);
    return true;
  }

  /**
   * Wait for rate limit
   */
  private async waitForRateLimit(): Promise<void> {
    while (!this.checkRateLimit()) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Generate cache key for translation
   */
  private getCacheKey(text: string, targetLang: string): string {
    return `${text.toLowerCase().trim()}_${targetLang}`;
  }

  /**
   * Check if translation exists in cache
   */
  private getFromCache(text: string, targetLang: string): string | null {
    const cacheKey = this.getCacheKey(text, targetLang);
    return this.cache.get(cacheKey) || null;
  }

  /**
   * Store translation in cache
   */
  private setCache(text: string, targetLang: string, translation: string): void {
    const cacheKey = this.getCacheKey(text, targetLang);
    this.cache.set(cacheKey, translation);
    
    // Persist to localStorage for persistence across sessions
    try {
      const cachedTranslations = JSON.parse(localStorage.getItem('translations') || '{}');
      cachedTranslations[cacheKey] = translation;
      localStorage.setItem('translations', JSON.stringify(cachedTranslations));
    } catch (error) {
      console.warn('Failed to persist translation to localStorage:', error);
    }
  }

  /**
   * Load cached translations from localStorage
   */
  public loadCachedTranslations(): void {
    if (this.isInitialized) return;
    
    try {
      const cachedTranslations = JSON.parse(localStorage.getItem('translations') || '{}');
      Object.entries(cachedTranslations).forEach(([key, value]) => {
        this.cache.set(key, value as string);
      });
      this.isInitialized = true;
      console.log(`📚 Loaded ${Object.keys(cachedTranslations).length} cached translations`);
    } catch (error) {
      console.warn('Failed to load cached translations:', error);
    }
  }

  /**
   * Get fallback translation if available
   */
  private getFallbackTranslation(text: string, targetLang: string): string | null {
    if (targetLang === 'hi' && FALLBACK_TRANSLATIONS[text]) {
      console.log(`📚 Using fallback translation: "${text}" → "${FALLBACK_TRANSLATIONS[text]}"`);
      return FALLBACK_TRANSLATIONS[text];
    }
    return null;
  }

  /**
   * Translate text using LibreTranslate API
   */
  private async translateWithAPI(text: string, targetLang: string): Promise<string> {
    try {
      // Wait for rate limit before making request
      await this.waitForRateLimit();
      
      console.log(`🌐 Translating: "${text}" to ${targetLang}`);
      
      const response = await axios.post<TranslationResponse>(
        TRANSLATION_API_URL,
        {
          q: text,
          source: 'auto',
          target: targetLang,
          format: 'text'
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // Reduced timeout to 10 seconds
        }
      );

      console.log(`✅ Translation successful: "${text}" → "${response.data.translatedText}"`);
      return response.data.translatedText;
    } catch (error) {
      console.error('❌ Translation API error:', error);
      
      // More detailed error logging
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          code: error.code
        });
        
        // Handle specific error cases
        if (error.response?.status === 429) {
          throw new Error('Translation rate limit exceeded. Please try again later.');
        } else if (error.response?.status === 503) {
          throw new Error('Translation service temporarily unavailable.');
        } else if (error.code === 'ECONNABORTED') {
          throw new Error('Translation request timed out.');
        } else if (error.code === 'NETWORK_ERROR') {
          throw new Error('Network error. Please check your internet connection.');
        }
      }
      
      throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Translate text with caching and deduplication
   */
  public async translate(text: string, targetLang: string): Promise<string> {
    if (!text || !text.trim()) {
      return text;
    }

    const cacheKey = this.getCacheKey(text, targetLang);
    
    // Check cache first
    const cachedTranslation = this.getFromCache(text, targetLang);
    if (cachedTranslation) {
      console.log(`📋 Using cached translation: "${text}" → "${cachedTranslation}"`);
      return cachedTranslation;
    }

    // Check fallback translations
    const fallbackTranslation = this.getFallbackTranslation(text, targetLang);
    if (fallbackTranslation) {
      this.setCache(text, targetLang, fallbackTranslation);
      return fallbackTranslation;
    }

    // Check if there's already a pending request for this translation
    if (this.pendingRequests.has(cacheKey)) {
      console.log(`⏳ Waiting for pending translation: "${text}"`);
      return this.pendingRequests.get(cacheKey)!;
    }

    // Create new translation request with delay to prevent blocking
    const translationPromise = new Promise<string>((resolve, reject) => {
      // Use setTimeout to prevent blocking the UI
      setTimeout(async () => {
        try {
          const translation = await this.translateWithAPI(text, targetLang);
          this.setCache(text, targetLang, translation);
          resolve(translation);
        } catch (error) {
          reject(error);
        } finally {
          this.pendingRequests.delete(cacheKey);
        }
      }, 0);
    });

    this.pendingRequests.set(cacheKey, translationPromise);
    return translationPromise;
  }

  /**
   * Batch translate multiple texts with rate limiting
   */
  public async translateBatch(texts: string[], targetLang: string): Promise<string[]> {
    console.log(`🔄 Starting batch translation of ${texts.length} texts to ${targetLang}`);
    
    try {
      // Process texts in smaller batches to prevent overwhelming the API
      const batchSize = 3;
      const results: string[] = [];
      
      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        
        const batchResults = await Promise.allSettled(
          batch.map((text, index) => 
            this.translate(text, targetLang)
              .catch(error => {
                console.error(`❌ Failed to translate text ${i + index + 1}: "${text}"`, error);
                return text; // Return original text on error
              })
          )
        );

        const batchTranslatedTexts = batchResults.map((result, index) => {
          if (result.status === 'fulfilled') {
            return result.value;
          } else {
            console.warn(`⚠️ Translation failed for text ${i + index + 1}, using original`);
            return batch[index];
          }
        });

        results.push(...batchTranslatedTexts);
        
        // Add delay between batches to respect rate limits
        if (i + batchSize < texts.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      console.log(`✅ Batch translation completed: ${results.length} texts`);
      return results;
    } catch (error) {
      console.error('❌ Batch translation failed:', error);
      // Return original texts on complete failure
      return texts;
    }
  }

  /**
   * Clear translation cache
   */
  public clearCache(): void {
    this.cache.clear();
    this.pendingRequests.clear();
    localStorage.removeItem('translations');
    console.log('🗑️ Translation cache cleared');
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): { size: number; pendingRequests: number } {
    return {
      size: this.cache.size,
      pendingRequests: this.pendingRequests.size
    };
  }
}

export const translationService = TranslationService.getInstance();
