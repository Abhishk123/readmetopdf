import { Injectable, signal } from '@angular/core';
import { ADS_CONFIG, AdsConfiguration } from '../config/ads.config';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdsService {
  private readonly configState = signal<AdsConfiguration>(ADS_CONFIG);
  public readonly config = this.configState.asReadonly();
  private scriptLoaded = false;

  constructor() {
    if (this.config().enabled && typeof window !== 'undefined') {
      this.initGoogleAdSense();
    }
  }

  public initGoogleAdSense(): void {
    if (this.scriptLoaded || !this.config().enabled || !this.config().client) {
      return;
    }

    try {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.config().client}`;
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
      console.warn('Ad push deferred or blocked by browser/extension:', err);
    }
  }
}
