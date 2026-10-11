import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AdsService } from '../../../services/ads.service';
import { AdProviderType } from '../../../config/ads.config';
import { AdFormat } from '../../../models/conversion.model';

@Component({
  selector: 'app-ad-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ad-banner.html',
  styleUrl: './ad-banner.css'
})
export class AdBannerComponent implements OnInit, AfterViewInit {
  protected adsService = inject(AdsService);
  private sanitizer = inject(DomSanitizer);

  @ViewChild('customIframe') customIframeRef?: ElementRef<HTMLIFrameElement>;

  @Input() slot: string = '';
  @Input() format: AdFormat = 'horizontal';
  @Input() label: string = 'ADVERTISEMENT';
  @Input() customClass: string = '';
  @Input() provider?: AdProviderType;

  get activeProvider(): AdProviderType {
    return this.adsService.getProvider(this.provider);
  }

  get resolvedSlotId(): string {
    const slots = this.adsService.config().slots;
    if (this.slot && slots[this.slot]) {
      return slots[this.slot];
    }
    return this.slot || slots['topBanner'] || '';
  }

  get sponsorConfig() {
    return this.adsService.config().sponsor;
  }

  get carbonConfig() {
    return this.adsService.config().carbon;
  }

  get customConfig() {
    return this.adsService.config().custom;
  }

  get bannerDimensions(): { width: number; height: number } {
    if (this.format === 'vertical') {
      return { width: 160, height: 600 };
    }
    if (this.format === 'rectangle') {
      return { width: 300, height: 250 };
    }
    return { width: 728, height: 90 };
  }

  private getSnippetForFormat(): string {
    const custom = this.customConfig;
    if (!custom) return '';

    if (this.format === 'vertical' && custom.skyscraperSnippet) {
      return custom.skyscraperSnippet;
    }
    if (this.format === 'rectangle' && custom.rectangleSnippet) {
      return custom.rectangleSnippet;
    }
    if (this.format === 'horizontal' && custom.horizontalSnippet) {
      return custom.horizontalSnippet;
    }
    return custom.htmlSnippet || custom.horizontalSnippet || '';
  }

  ngOnInit(): void {
    if (!this.slot && this.format === 'horizontal') {
      this.slot = 'topBanner';
    }
  }

  ngAfterViewInit(): void {
    if (this.adsService.config().enabled && this.activeProvider === 'adsense') {
      setTimeout(() => {
        this.adsService.pushAd();
      }, 80);
    } else if (this.adsService.config().enabled && this.activeProvider === 'custom') {
      this.renderCustomAd();
    }
  }

  private renderCustomAd(): void {
    const snippet = this.getSnippetForFormat();
    if (!snippet || !this.customIframeRef) return;

    const iframe = this.customIframeRef.nativeElement;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                margin: 0;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: transparent;
                overflow: hidden;
              }
            </style>
          </head>
          <body>
            ${snippet}
          </body>
        </html>
      `);
      doc.close();
    }
  }
}
