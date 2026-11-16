import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';
import {
  calculateLoanEmi,
  calculateFixedDeposit,
  calculateRecurringDeposit,
  calculatePpf,
  calculateInterestComparison,
  EmiResult,
  FdResult,
  RdResult,
  PpfResult,
  InterestComparisonResult
} from '../../../shared/calculators';

export type FinanceTab = 'emi' | 'fd' | 'rd' | 'ppf' | 'interest';

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  locale: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  // Primary Priority Default Currency
  { code: 'INR', symbol: '₹', name: 'INR - Indian Rupee (₹)', locale: 'en-IN', flag: '🇮🇳' },
  { code: 'USD', symbol: '$', name: 'USD - US Dollar ($)', locale: 'en-US', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'EUR - Euro (€)', locale: 'de-DE', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'GBP - British Pound (£)', locale: 'en-GB', flag: '🇬🇧' },
  { code: 'AED', symbol: 'AED', name: 'AED - UAE Dirham', locale: 'en-AE', flag: '🇦🇪' },
  { code: 'SAR', symbol: 'SAR', name: 'SAR - Saudi Riyal', locale: 'ar-SA', flag: '🇸🇦' },
  { code: 'SGD', symbol: 'S$', name: 'SGD - Singapore Dollar (S$)', locale: 'en-SG', flag: '🇸🇬' },
  { code: 'CAD', symbol: 'CA$', name: 'CAD - Canadian Dollar ($)', locale: 'en-CA', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', name: 'AUD - Australian Dollar ($)', locale: 'en-AU', flag: '🇦🇺' },
  { code: 'JPY', symbol: '¥', name: 'JPY - Japanese Yen (¥)', locale: 'ja-JP', flag: '🇯🇵' },
  { code: 'CNY', symbol: '¥', name: 'CNY - Chinese Yuan (¥)', locale: 'zh-CN', flag: '🇨🇳' },
  { code: 'RUB', symbol: '₽', name: 'RUB - Russian Ruble (₽)', locale: 'ru-RU', flag: '🇷🇺' }
];

@Component({
  selector: 'app-finance-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdBannerComponent],
  templateUrl: './finance-calculator.component.html',
  styleUrl: './finance-calculator.component.css'
})
export class FinanceCalculatorComponent {
  public activeTab = signal<FinanceTab>('emi');

  // Currency State
  public currencies = SUPPORTED_CURRENCIES;
  public selectedCurrency = signal<CurrencyOption>(this.getInitialCurrency());
  public currencySymbol = computed(() => this.selectedCurrency().symbol);

  // --- 1. LOAN & EMI STATE (Groww-Style) ---
  public loanAmount = signal<number>(2500000);
  public loanInterestRate = signal<number>(8.5);
  public loanTenureYears = signal<number>(20);
  public emiTenureUnit = signal<'years' | 'months'>('years');

  // Quick preset chips for Indian & global loan sizes
  public loanPresets = computed(() => {
    const code = this.selectedCurrency().code;
    if (code === 'INR') {
      return [
        { label: '₹5L', value: 500000 },
        { label: '₹15L', value: 1500000 },
        { label: '₹25L', value: 2500000 },
        { label: '₹50L', value: 5000000 },
        { label: '₹1 Cr', value: 10000000 }
      ];
    }
    return [
      { label: '50K', value: 50000 },
      { label: '100K', value: 100000 },
      { label: '250K', value: 250000 },
      { label: '500K', value: 500000 },
      { label: '1M', value: 1000000 }
    ];
  });

  public readonly tenurePresets = [
    { label: '5 Yr', value: 5 },
    { label: '10 Yr', value: 10 },
    { label: '15 Yr', value: 15 },
    { label: '20 Yr', value: 20 },
    { label: '25 Yr', value: 25 },
    { label: '30 Yr', value: 30 }
  ];

  // Uses shared calculation engine calculateLoanEmi
  public emiResults = computed<EmiResult>(() => {
    return calculateLoanEmi(this.loanAmount(), this.loanInterestRate(), this.loanTenureYears());
  });

  // SVG Donut Chart offset (Circumference of r=40 is 251.327)
  public emiDonutDashOffset = computed(() => {
    const p = this.emiResults().principalPercent;
    const c = 251.327;
    return c - (p / 100) * c;
  });

  // --- 2. FD (FIXED DEPOSIT) STATE ---
  public fdDeposit = signal<number>(100000);
  public fdRate = signal<number>(7.0);
  public fdYears = signal<number>(3);

  public fdResults = computed<FdResult>(() => {
    return calculateFixedDeposit(this.fdDeposit(), this.fdRate(), this.fdYears());
  });

  // --- 3. RD (RECURRING DEPOSIT) STATE ---
  public rdMonthly = signal<number>(5000);
  public rdRate = signal<number>(6.5);
  public rdMonths = signal<number>(36);

  public rdResults = computed<RdResult>(() => {
    return calculateRecurringDeposit(this.rdMonthly(), this.rdRate(), this.rdMonths());
  });

  // --- 4. PPF (PUBLIC PROVIDENT FUND) STATE ---
  public ppfYearly = signal<number>(100000);
  public ppfYears = signal<number>(15);
  public readonly ppfRate = 7.1;

  public ppfResults = computed<PpfResult>(() => {
    return calculatePpf(this.ppfYearly(), this.ppfYears(), this.ppfRate);
  });

  // --- 5. SIMPLE VS COMPOUND INTEREST STATE ---
  public interestPrincipal = signal<number>(50000);
  public interestRate = signal<number>(8.0);
  public interestTimeYears = signal<number>(5);

  public interestResults = computed<InterestComparisonResult>(() => {
    return calculateInterestComparison(this.interestPrincipal(), this.interestRate(), this.interestTimeYears());
  });

  private getInitialCurrency(): CurrencyOption {
    try {
      const saved = localStorage.getItem('jsns_finance_currency');
      if (saved) {
        const found = SUPPORTED_CURRENCIES.find(c => c.code === saved);
        if (found) return found;
      }
    } catch {}
    const inr = SUPPORTED_CURRENCIES.find(c => c.code === 'INR');
    return inr || SUPPORTED_CURRENCIES[0];
  }

  public selectCurrency(curr: CurrencyOption): void {
    this.selectedCurrency.set(curr);
    try {
      localStorage.setItem('jsns_finance_currency', curr.code);
    } catch {}
  }

  public onCurrencyCodeChange(code: string): void {
    const match = SUPPORTED_CURRENCIES.find(c => c.code === code);
    if (match) {
      this.selectCurrency(match);
    }
  }

  public setTab(tab: FinanceTab): void {
    this.activeTab.set(tab);
  }

  public formatCurrency(val: number): string {
    const curr = this.selectedCurrency();
    try {
      return new Intl.NumberFormat(curr.locale, { maximumFractionDigits: 0 }).format(val || 0);
    } catch {
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val || 0);
    }
  }

  public formatCompact(val: number): string {
    const curr = this.selectedCurrency();
    const sym = curr.symbol;
    const code = curr.code;

    if (code === 'INR') {
      if (val >= 10000000) return `${sym}${(val / 10000000).toFixed(0)} Cr`;
      if (val >= 100000) return `${sym}${(val / 100000).toFixed(0)}L`;
      if (val >= 1000) return `${sym}${(val / 1000).toFixed(0)}K`;
    }
    if (val >= 1000000) return `${sym}${(val / 1000000).toFixed(0)}M`;
    if (val >= 1000) return `${sym}${(val / 1000).toFixed(0)}K`;
    return `${sym}${val}`;
  }

  public getAmountInWords(amount: number): string {
    if (!amount || amount <= 0) return '';
    const curr = this.selectedCurrency();
    const code = curr.code;

    if (code === 'INR') {
      if (amount >= 10000000) {
        const cr = (amount / 10000000).toFixed(2).replace(/\.00$/, '');
        return `${cr} Crore`;
      }
      if (amount >= 100000) {
        const lakh = (amount / 100000).toFixed(2).replace(/\.00$/, '');
        return `${lakh} Lakh`;
      }
      if (amount >= 1000) {
        const k = (amount / 1000).toFixed(1).replace(/\.0$/, '');
        return `${k} Thousand`;
      }
    } else {
      if (amount >= 1000000000) {
        const b = (amount / 1000000000).toFixed(2).replace(/\.00$/, '');
        return `${b} Billion`;
      }
      if (amount >= 1000000) {
        const m = (amount / 1000000).toFixed(2).replace(/\.00$/, '');
        return `${m} Million`;
      }
      if (amount >= 1000) {
        const k = (amount / 1000).toFixed(1).replace(/\.0$/, '');
        return `${k} Thousand`;
      }
    }
    return '';
  }

  public setLoanAmount(val: number): void {
    this.loanAmount.set(Math.max(1000, val));
  }

  public setLoanTenure(years: number): void {
    this.loanTenureYears.set(years);
  }
}
