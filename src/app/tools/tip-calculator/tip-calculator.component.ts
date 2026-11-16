import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';

@Component({
  selector: 'app-tip-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdBannerComponent],
  templateUrl: './tip-calculator.component.html',
  styleUrl: './tip-calculator.component.css'
})
export class TipCalculatorComponent {
  public billAmount = signal<number>(1200);
  public tipPercent = signal<number>(10);
  public peopleCount = signal<number>(3);

  public readonly presets = [5, 10, 12, 15, 20];

  public results = computed(() => {
    const bill = Number(this.billAmount()) || 0;
    const tipPct = Number(this.tipPercent()) || 0;
    const people = Math.max(1, Number(this.peopleCount()) || 1);

    const totalTip = (tipPct / 100) * bill;
    const totalBill = bill + totalTip;

    const tipPerPerson = totalTip / people;
    const totalPerPerson = totalBill / people;

    return {
      totalTip: parseFloat(totalTip.toFixed(2)),
      totalBill: parseFloat(totalBill.toFixed(2)),
      tipPerPerson: parseFloat(tipPerPerson.toFixed(2)),
      totalPerPerson: parseFloat(totalPerPerson.toFixed(2))
    };
  });

  public setTipPreset(val: number): void {
    this.tipPercent.set(val);
  }

  public incrementPeople(): void {
    this.peopleCount.update(c => c + 1);
  }

  public decrementPeople(): void {
    this.peopleCount.update(c => Math.max(1, c - 1));
  }
}
