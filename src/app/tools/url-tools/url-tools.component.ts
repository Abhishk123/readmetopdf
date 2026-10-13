import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';

type UrlTab = 'utm' | 'shorten' | 'clean';

@Component({
  selector: 'app-url-tools',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdBannerComponent],
  templateUrl: './url-tools.component.html',
  styleUrl: './url-tools.component.css'
})
export class UrlToolsComponent {
  public activeTab = signal<UrlTab>('utm');

  // UTM Campaign Builder Inputs
  public baseUrl = signal<string>('https://www.jsnsworks.site');
  public utmSource = signal<string>('google');
  public utmMedium = signal<string>('cpc');
  public utmCampaign = signal<string>('summer_promo');
  public utmTerm = signal<string>('developer tools');
  public utmContent = signal<string>('hero_banner');

  // Shortener Inputs
  public rawUrl = signal<string>('https://www.jsnsworks.site/tools/barcode-generator');
  public shortenedUrl = signal<string>('');
  public isShortening = signal<boolean>(false);
  public shortenerError = signal<string>('');

  // Link Cleaner Inputs
  public dirtyUrl = signal<string>('https://example.com/product?id=928&utm_source=newsletter&fbclid=IwAR234908sdf&gclid=CjwKCAjw');
  public cleanedUrl = signal<string>('');
  public strippedTags = signal<string[]>([]);

  // Status
  public copiedMessage = signal<string>('');

  // Computed UTM Link
  public generatedUtmUrl = computed(() => {
    const raw = this.baseUrl().trim();
    if (!raw) return '';

    let urlObj: URL;
    try {
      urlObj = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    } catch {
      return '';
    }

    if (this.utmSource().trim()) urlObj.searchParams.set('utm_source', this.utmSource().trim());
    if (this.utmMedium().trim()) urlObj.searchParams.set('utm_medium', this.utmMedium().trim());
    if (this.utmCampaign().trim()) urlObj.searchParams.set('utm_campaign', this.utmCampaign().trim());
    if (this.utmTerm().trim()) urlObj.searchParams.set('utm_term', this.utmTerm().trim());
    if (this.utmContent().trim()) urlObj.searchParams.set('utm_content', this.utmContent().trim());

    return urlObj.toString();
  });

  public setTab(tab: UrlTab): void {
    this.activeTab.set(tab);
    if (tab === 'clean') {
      this.cleanUrlNow();
    }
  }

  // Shortened link state
  public brandedShortUrl = signal<string>('');

  // Shorten URL: Generates 5-character short link via PostgreSQL API (with clean local fallback)
  public async shortenUrlNow(): Promise<void> {
    const raw = this.rawUrl().trim();
    if (!raw) {
      this.shortenerError.set('Please enter a valid web URL.');
      return;
    }

    const validUrl = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;

    this.isShortening.set(true);
    this.shortenerError.set('');
    this.shortenedUrl.set('');
    this.brandedShortUrl.set('');

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.jsnsworks.site';

    // 1. Try PostgreSQL Database Serverless API
    try {
      const dbResp = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: validUrl })
      });
      if (dbResp.ok) {
        const dbData = await dbResp.json();
        if (dbData?.code) {
          const tinyBrandedLink = `${origin}/s?to=${dbData.code}`;
          this.brandedShortUrl.set(tinyBrandedLink);
          this.shortenedUrl.set(tinyBrandedLink);
          this.isShortening.set(false);
          this.showCopied('Short branded link created!');
          return;
        }
      }
    } catch {
      // Offline or local dev fallback
    }

    // 2. Client-side fallback token
    try {
      let compactPayload = validUrl;
      if (compactPayload.startsWith('https://')) {
        compactPayload = '1' + compactPayload.slice(8);
      } else if (compactPayload.startsWith('http://')) {
        compactPayload = '0' + compactPayload.slice(7);
      }
      const utf8Bytes = new TextEncoder().encode(compactPayload);
      let binaryStr = '';
      utf8Bytes.forEach(b => binaryStr += String.fromCharCode(b));
      const shortToken = btoa(binaryStr).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const fallbackLink = `${origin}/s?to=${shortToken}`;
      this.brandedShortUrl.set(fallbackLink);
      this.shortenedUrl.set(fallbackLink);
    } catch {
      const fallbackLink = `${origin}/s?to=${encodeURIComponent(validUrl)}`;
      this.brandedShortUrl.set(fallbackLink);
      this.shortenedUrl.set(fallbackLink);
    }

    this.isShortening.set(false);
    this.showCopied('Short branded link created!');
  }

  // Clean Tracking URL
  public cleanUrlNow(): void {
    const input = this.dirtyUrl().trim();
    if (!input) {
      this.cleanedUrl.set('');
      this.strippedTags.set([]);
      return;
    }

    try {
      const parsed = new URL(input.startsWith('http') ? input : `https://${input}`);
      const trackingParams = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
        'fbclid', 'gclid', 'dclid', 'gbraid', 'wbraid', 'msclkid',
        'ref', 'mc_cid', 'mc_eid', '_ga', '_gl', 'si', 'feature'
      ];

      const removed: string[] = [];
      trackingParams.forEach(param => {
        if (parsed.searchParams.has(param)) {
          removed.push(param);
          parsed.searchParams.delete(param);
        }
      });

      this.cleanedUrl.set(parsed.toString());
      this.strippedTags.set(removed);
    } catch {
      this.cleanedUrl.set(input);
      this.strippedTags.set([]);
    }
  }

  public copyToClipboard(text: string, label: string): void {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.showCopied(`${label} copied to clipboard!`);
    }).catch(() => {
      this.showCopied(`Copied!`);
    });
  }

  private showCopied(msg: string): void {
    this.copiedMessage.set(msg);
    setTimeout(() => {
      this.copiedMessage.set('');
    }, 3000);
  }
}
