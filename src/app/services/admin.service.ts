import { Injectable, signal, computed } from '@angular/core';

export interface AdFormatsConfig {
  leaderboard: boolean; // 728x90
  rectangle: boolean;   // 300x250
  inPagePush: boolean;  // Monetag IPP
}

export interface SiteSettings {
  adsEnabled: boolean;
  adProvider: 'custom' | 'adsense' | 'monetag' | 'disabled';
  adFormats: AdFormatsConfig;
  showWhatsAppBot: boolean;
  showUpcomingProjects: boolean;
  hiddenTools: string[];
  dbConnected?: boolean;
}

const AUTH_STORAGE_KEY = 'jsans_admin_auth_token';
const SETTINGS_STORAGE_KEY = 'jsans_admin_site_settings';

const DEFAULT_SETTINGS: SiteSettings = {
  adsEnabled: false,
  adProvider: 'disabled',
  adFormats: {
    leaderboard: false,
    rectangle: false,
    inPagePush: false
  },
  showWhatsAppBot: true,
  showUpcomingProjects: true,
  hiddenTools: [],
  dbConnected: false
};

const DEFAULT_ADMIN_USER = 'admin';
const DEFAULT_ADMIN_PASS = 'jsansadmin2026';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private settingsSignal = signal<SiteSettings>(this.getInitialSettings());
  private isAuthenticatedSignal = signal<boolean>(this.checkInitialAuth());
  private authTokenSignal = signal<string>(this.getStoredToken());
  public readonly isLoading = signal<boolean>(false);
  public readonly statusMessage = signal<string>('');

  public readonly settings = this.settingsSignal.asReadonly();
  public readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  public readonly adsGloballyEnabled = computed(() => this.settingsSignal().adsEnabled);
  public readonly adProvider = computed(() => this.settingsSignal().adProvider);
  public readonly adFormats = computed(() => this.settingsSignal().adFormats);
  public readonly monetagEnabled = computed(() => {
    const s = this.settingsSignal();
    return s.adsEnabled && (s.adProvider === 'monetag' || s.adFormats.inPagePush);
  });
  public readonly showWhatsApp = computed(() => this.settingsSignal().showWhatsAppBot);
  public readonly showProjects = computed(() => this.settingsSignal().showUpcomingProjects);

  constructor() {
    this.fetchGlobalSettings();
  }

  public async fetchGlobalSettings(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      this.isLoading.set(true);
      const res = await fetch('/api/settings', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.settings) {
          const merged = { ...this.getInitialSettings(), ...data.settings };
          this.settingsSignal.set(merged);
          if (window.localStorage) {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
          }
        }
      }
    } catch (err) {
      // Local development or offline: keep using localStorage settings
    } finally {
      this.isLoading.set(false);
    }
  }

  public login(user: string, pass: string): boolean {
    if (user.trim() === DEFAULT_ADMIN_USER && pass === DEFAULT_ADMIN_PASS) {
      this.isAuthenticatedSignal.set(true);
      this.authTokenSignal.set(pass);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(AUTH_STORAGE_KEY, pass);
      }
      return true;
    }
    return false;
  }

  public logout(): void {
    this.isAuthenticatedSignal.set(false);
    this.authTokenSignal.set('');
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  public async saveGlobalSettings(newSettings: Partial<SiteSettings>): Promise<boolean> {
    const updated = { ...this.settingsSignal(), ...newSettings };
    this.settingsSignal.set(updated);

    // 1. Immediately persist to localStorage so settings never reset on browser reload
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('[AdminService] Error saving settings to localStorage', e);
      }
    }

    const token = this.authTokenSignal() || DEFAULT_ADMIN_PASS;

    try {
      this.isLoading.set(true);
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });

      if (res.ok) {
        this.statusMessage.set('Settings updated and synced!');
        setTimeout(() => this.statusMessage.set(''), 4000);
        return true;
      } else {
        // Localhost without Vercel API backend: still successful locally via localStorage
        this.statusMessage.set('Settings saved locally (active for your browser)!');
        setTimeout(() => this.statusMessage.set(''), 4000);
        return true;
      }
    } catch (e) {
      this.statusMessage.set('Settings saved locally (active for your browser)!');
      setTimeout(() => this.statusMessage.set(''), 4000);
      return true;
    } finally {
      this.isLoading.set(false);
    }
  }

  public async setAdsEnabled(enabled: boolean): Promise<void> {
    await this.saveGlobalSettings({ adsEnabled: enabled });
  }

  public async setAdProvider(provider: 'custom' | 'adsense' | 'monetag' | 'disabled'): Promise<void> {
    await this.saveGlobalSettings({ adProvider: provider });
  }

  public async setAdFormat(format: keyof AdFormatsConfig, enabled: boolean): Promise<void> {
    const current = this.settingsSignal().adFormats;
    const updatedFormats = { ...current, [format]: enabled };
    await this.saveGlobalSettings({ adFormats: updatedFormats });
  }

  public async setWhatsAppBotEnabled(enabled: boolean): Promise<void> {
    await this.saveGlobalSettings({ showWhatsAppBot: enabled });
  }

  public async setToolVisibility(toolId: string, visible: boolean): Promise<void> {
    let hidden = [...this.settingsSignal().hiddenTools];
    if (visible) {
      hidden = hidden.filter(id => id !== toolId);
    } else {
      if (!hidden.includes(toolId)) {
        hidden.push(toolId);
      }
    }
    await this.saveGlobalSettings({ hiddenTools: hidden });
  }

  public isToolVisible(toolId: string): boolean {
    return !this.settingsSignal().hiddenTools.includes(toolId);
  }

  private getInitialSettings(): SiteSettings {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return { ...DEFAULT_SETTINGS, ...parsed };
        }
      } catch (e) {
        console.warn('[AdminService] Error reading settings from localStorage', e);
      }
    }
    return DEFAULT_SETTINGS;
  }

  private checkInitialAuth(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!localStorage.getItem(AUTH_STORAGE_KEY);
    }
    return false;
  }

  private getStoredToken(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(AUTH_STORAGE_KEY) || '';
    }
    return '';
  }
}
