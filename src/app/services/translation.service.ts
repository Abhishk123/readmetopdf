import { Injectable, signal, computed, inject } from '@angular/core';
import { AnalyticsService } from './analytics.service';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  popular?: boolean;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  // Primary / Popular Languages
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', popular: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', popular: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', popular: true },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', popular: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', popular: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', popular: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', popular: true },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', popular: true },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', popular: true },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', popular: true },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', popular: true },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', popular: true },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', popular: true },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', popular: true },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', popular: true },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },

  // Indian Languages (High Local Utility Traffic)
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', popular: true },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', popular: true },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', popular: true },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },

  // European & Global Languages
  { code: 'th', name: 'Thai', nativeName: 'ภาษาไทย', flag: '🇹🇭' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'iw', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' }
];

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private analytics = inject(AnalyticsService);

  public readonly languages = SUPPORTED_LANGUAGES;
  public readonly currentLangCode = signal<string>('en');

  public readonly currentLanguage = computed<Language>(() => {
    const code = this.currentLangCode();
    return this.languages.find(l => l.code === code) || this.languages[0];
  });

  constructor() {
    this.initLanguageFromCookieOrStorage();
  }

  private initLanguageFromCookieOrStorage(): void {
    if (typeof window === 'undefined') return;

    // Check googtrans cookie: /en/es or /auto/es
    const match = document.cookie.match(/googtrans=\/[^/]+\/([a-zA-Z-]+)/);
    if (match && match[1]) {
      const code = match[1];
      if (this.languages.some(l => l.code === code)) {
        this.currentLangCode.set(code);
        return;
      }
    }

    // Fallback to localStorage
    const saved = localStorage.getItem('user_preferred_lang');
    if (saved && this.languages.some(l => l.code === saved)) {
      this.currentLangCode.set(saved);
    }
  }

  public setLanguage(langCode: string): void {
    if (typeof window === 'undefined') return;

    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

    // Clear old cookies thoroughly
    this.clearCookies(hostname);

    if (langCode === 'en') {
      localStorage.removeItem('user_preferred_lang');
      this.currentLangCode.set('en');
      this.analytics.trackEvent('language_change', { language: 'en' });

      // Reset Google Translate combo or reload
      const combo = document.querySelector('select.goog-te-combo') as HTMLSelectElement | null;
      if (combo) {
        combo.value = '';
        combo.dispatchEvent(new Event('change'));
      }
      setTimeout(() => window.location.reload(), 150);
      return;
    }

    // Set new Google Translate cookie: /en/{targetLang}
    const cookieVal = `/en/${langCode}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    if (!isLocalhost) {
      document.cookie = `googtrans=${cookieVal}; path=/; domain=${hostname};`;
      const domainParts = hostname.split('.');
      if (domainParts.length > 1) {
        const rootDomain = '.' + domainParts.slice(-2).join('.');
        document.cookie = `googtrans=${cookieVal}; path=/; domain=${rootDomain};`;
      }
    }

    localStorage.setItem('user_preferred_lang', langCode);
    this.currentLangCode.set(langCode);
    this.analytics.trackEvent('language_change', { language: langCode });

    // Trigger instant change via DOM combo if available
    const combo = document.querySelector('select.goog-te-combo') as HTMLSelectElement | null;
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event('change'));
    } else {
      setTimeout(() => window.location.reload(), 150);
    }
  }

  private clearCookies(hostname: string): void {
    const expires = 'expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `googtrans=; ${expires}`;
    document.cookie = `googtrans=; ${expires} domain=${hostname};`;
    const domainParts = hostname.split('.');
    if (domainParts.length > 1) {
      const rootDomain = '.' + domainParts.slice(-2).join('.');
      document.cookie = `googtrans=; ${expires} domain=${rootDomain};`;
    }
  }
}
