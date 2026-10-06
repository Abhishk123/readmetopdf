import { Component, Input, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    }
  }
}
