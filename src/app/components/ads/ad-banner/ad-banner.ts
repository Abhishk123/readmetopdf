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

  @ViewChild('customIframe') set customIframe(ref: ElementRef<HTMLIFrameElement> | undefined) {
    if (ref) {
      this.customIframeRef = ref;
      setTimeout(() => this.renderCustomAd(), 50);
    }
  }
  private customIframeRef?: ElementRef<HTMLIFrameElement>;

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
      return { width: 160, height: 300 };
    }
    if (this.format === 'rectangle') {
      return { width: 300, height: 250 };
    }
    return { width: 728, height: 90 };
  }

  private getSnippetForFormat(): string {
    const custom = this.customConfig;
    if (this.format === 'vertical') {
      return custom?.skyscraperSnippet || `
        <script type="text/javascript">
          atOptions = {
            'key' : 'f6ac1328ab2561c5740963f903492c2d',
            'format' : 'iframe',
            'height' : 300,
            'width' : 160,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://bauval.org/22/f6ac1328ab2561c5740963f903492c2d"></script>
      `;
    }
    if (this.format === 'rectangle') {
      return custom?.rectangleSnippet || `
        <script type="text/javascript">
          atOptions = {
            'key' : '4d8d0573b25bbd2f4bede8ef0c711b69',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://bauval.org/22/4d8d0573b25bbd2f4bede8ef0c711b69"></script>
      `;
    }
    return custom?.horizontalSnippet || custom?.htmlSnippet || `
      <script type="text/javascript">
        atOptions = {
          'key' : 'd6a506bca45e9e2d16f0297c4f0ff849',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      </script>
      <script type="text/javascript" src="https://bauval.org/22/d6a506bca45e9e2d16f0297c4f0ff849"></script>
    `;
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
