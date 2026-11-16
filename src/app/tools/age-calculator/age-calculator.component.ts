import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';
import { calculateExactAge } from '../../../shared/calculators';

@Component({
  selector: 'app-age-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdBannerComponent],
  templateUrl: './age-calculator.component.html',
  styleUrl: './age-calculator.component.css'
})
export class AgeCalculatorComponent {
  public birthDate = signal<string>('2000-01-01');
  public targetDate = signal<string>(new Date().toISOString().split('T')[0]);

  public ageResult = computed(() => {
    const bStr = this.birthDate();
    const tStr = this.targetDate();

    if (!bStr || !tStr) return null;

    const birth = new Date(bStr);
    const target = new Date(tStr);

    if (birth > target) {
      return null;
    }

    const res = calculateExactAge(birth, target);
    if (!res) return null;

    const totalHours = res.totalDays * 24;
    const totalMinutes = totalHours * 60;

    return {
      years: res.years,
      months: res.months,
      days: res.days,
      totalMonths: res.totalMonths,
      totalWeeks: res.totalWeeks,
      totalDays: res.totalDays,
      totalHours,
      totalMinutes,
      daysToNextBday: res.daysUntilNextBirthday
    };
  });
}
