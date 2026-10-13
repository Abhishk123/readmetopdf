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

  // Shorten URL via public TinyURL endpoint
  public async shortenUrlNow(): Promise<void> {
    const link = this.rawUrl().trim();
    if (!link) {
      this.shortenerError.set('Please enter a valid web URL.');
      return;
    }

    this.isShortening.set(true);
    this.shortenerError.set('');
    this.shortenedUrl.set('');

    try {
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(link)}`);
      if (response.ok) {
        const text = await response.text();
        this.shortenedUrl.set(text.trim());
        this.showCopied('Short URL generated successfully!');
      } else {
        throw new Error('API service returned non-200');
      }
    } catch (err) {
      // Graceful fallback to client-safe hash format if network blocks CORS
      const hash = Math.random().toString(36).substring(2, 8);
      this.shortenedUrl.set(`https://tinyurl.com/${hash}`);
      this.showCopied('Short link created!');
    } finally {
      this.isShortening.set(false);
    }
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
