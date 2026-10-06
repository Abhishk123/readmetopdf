import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';

@Component({
  selector: 'app-percentage-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdBannerComponent],
  templateUrl: './percentage-calculator.component.html',
  styleUrl: './percentage-calculator.component.css'
})
export class PercentageCalculatorComponent {
  // Mode 1: What is X% of Y?
  public calc1Percent = signal<number>(15);
  public calc1Total = signal<number>(200);

  public res1 = computed(() => {
    const p = Number(this.calc1Percent()) || 0;
    const t = Number(this.calc1Total()) || 0;
    return parseFloat(((p / 100) * t).toFixed(2));
  });

  // Mode 2: Percentage Increase / Decrease from X to Y
  public calc2From = signal<number>(50);
  public calc2To = signal<number>(75);

  public res2 = computed(() => {
    const from = Number(this.calc2From()) || 0;
    const to = Number(this.calc2To()) || 0;
    if (from === 0) return { percent: 0, isIncrease: true };

    const diff = to - from;
    const percent = Math.abs((diff / from) * 100);
    return {
      percent: parseFloat(percent.toFixed(2)),
      isIncrease: diff >= 0
    };
  });

  // Mode 3: Discount & Sales Tax
  public discountOriginalPrice = signal<number>(120);
  public discountPercent = signal<number>(20);
  public salesTaxPercent = signal<number>(8);

  public res3 = computed(() => {
    const orig = Number(this.discountOriginalPrice()) || 0;
    const disc = Number(this.discountPercent()) || 0;
    const tax = Number(this.salesTaxPercent()) || 0;

    const discountAmount = (disc / 100) * orig;
    const discountedPrice = Math.max(0, orig - discountAmount);
    const taxAmount = (tax / 100) * discountedPrice;
    const finalPrice = discountedPrice + taxAmount;

    return {
      savings: parseFloat(discountAmount.toFixed(2)),
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      finalPrice: parseFloat(finalPrice.toFixed(2))
    };
  });
}
