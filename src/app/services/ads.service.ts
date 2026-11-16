import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { ADS_CONFIG, AdsConfiguration, AdProviderType } from '../config/ads.config';
import { AdminService } from './admin.service';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdsService {
  private adminService = inject(AdminService);
  private readonly configState = signal<AdsConfiguration>(ADS_CONFIG);
  
  // Combines static config with live Admin global settings
  public readonly config = computed(() => {
    const base = this.configState();
    const globallyEnabled = this.adminService.adsGloballyEnabled();
    const selectedProvider = this.adminService.adProvider();

    const isEnabled = globallyEnabled && selectedProvider !== 'disabled';
    const provider: AdProviderType = selectedProvider === 'adsense' ? 'adsense' : 'custom';

    return {
      ...base,
      enabled: isEnabled,
      defaultProvider: provider
    };
  });
  
  public readonly effectiveClient = computed(() => {
    const cfg = this.config();
    if (cfg.testMode) {
      return 'ca-pub-3940256099942544'; // Google Official Test Publisher
    }
    return cfg.client;
  });

  private scriptLoaded = false;
  private monetagLoaded = false;

  constructor() {
    effect(() => {
      const monetag = this.adminService.monetagEnabled();
      const adsense = this.config().enabled && this.config().defaultProvider === 'adsense';

      if (typeof window !== 'undefined') {
        if (monetag) {
          this.initMonetag();
        } else {
          this.removeMonetag();
        }

        if (adsense) {
          this.initGoogleAdSense();
        }
      }
    });
  }

  public removeMonetag(): void {
    if (typeof window === 'undefined') return;
    const existing = document.querySelector('script[src*="nap5k.com"]');
    if (existing) {
      existing.remove();
      this.monetagLoaded = false;
    }
  }

  public initMonetag(): void {
    if (this.monetagLoaded || !this.adminService.monetagEnabled() || typeof window === 'undefined') {
      return;
    }

    try {
      const existing = document.querySelector('script[src*="nap5k.com"]');
      if (existing) {
        this.monetagLoaded = true;
        return;
      }

      const script = document.createElement('script');
      script.dataset['zone'] = '12216484';
      script.src = 'https://nap5k.com/tag.min.js';
      script.onload = () => {
        this.monetagLoaded = true;
      };
      document.head.appendChild(script);
    } catch (e) {
      console.warn('Monetag script injection skipped:', e);
    }
  }

  public initGoogleAdSense(): void {
    if (this.scriptLoaded || !this.config().enabled || !this.effectiveClient()) {
      return;
    }

    try {
      const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
      if (existingScript) {
        this.scriptLoaded = true;
        return;
      }

      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.effectiveClient()}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        this.scriptLoaded = true;
      };
      document.head.appendChild(script);
    } catch (e) {
      console.warn('AdSense script injection skipped:', e);
    }
  }

  public pushAd(): void {
    if (!this.config().enabled || typeof window === 'undefined') {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // Safe catch
    }
  }

  public getProvider(override?: AdProviderType): AdProviderType {
    return this.config().defaultProvider || override || 'custom';
  }
}
