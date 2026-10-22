import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';

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

  // Chinese & Russian Currencies
  { code: 'CNY', symbol: '¥', name: 'CNY - Chinese Yuan (¥)', locale: 'zh-CN', flag: '🇨🇳' },
  { code: 'RUB', symbol: '₽', name: 'RUB - Russian Ruble (₽)', locale: 'ru-RU', flag: '🇷🇺' },

  // East & Southeast Asian Currencies
  { code: 'JPY', symbol: '¥', name: 'JPY - Japanese Yen (¥)', locale: 'ja-JP', flag: '🇯🇵' },
  { code: 'KRW', symbol: '₩', name: 'KRW - South Korean Won (₩)', locale: 'ko-KR', flag: '🇰🇷' },
  { code: 'SGD', symbol: 'S$', name: 'SGD - Singapore Dollar (S$)', locale: 'en-SG', flag: '🇸🇬' },
  { code: 'HKD', symbol: 'HK$', name: 'HKD - Hong Kong Dollar (HK$)', locale: 'zh-HK', flag: '🇭🇰' },
  { code: 'TWD', symbol: 'NT$', name: 'TWD - New Taiwan Dollar (NT$)', locale: 'zh-TW', flag: '🇹🇼' },
  { code: 'THB', symbol: '฿', name: 'THB - Thai Baht (฿)', locale: 'th-TH', flag: '🇹🇭' },
  { code: 'MYR', symbol: 'RM', name: 'MYR - Malaysian Ringgit (RM)', locale: 'ms-MY', flag: '🇲🇾' },
  { code: 'IDR', symbol: 'Rp', name: 'IDR - Indonesian Rupiah (Rp)', locale: 'id-ID', flag: '🇮🇩' },
  { code: 'VND', symbol: '₫', name: 'VND - Vietnamese Dong (₫)', locale: 'vi-VN', flag: '🇻🇳' },
  { code: 'PHP', symbol: '₱', name: 'PHP - Philippine Peso (₱)', locale: 'en-PH', flag: '🇵🇭' },

  // South Asian & Middle Eastern Currencies
  { code: 'PKR', symbol: '₨', name: 'PKR - Pakistani Rupee (₨)', locale: 'ur-PK', flag: '🇵🇰' },
  { code: 'BDT', symbol: '৳', name: 'BDT - Bangladeshi Taka (৳)', locale: 'bn-BD', flag: '🇧🇩' },
  { code: 'AED', symbol: 'AED', name: 'AED - UAE Dirham', locale: 'en-AE', flag: '🇦🇪' },
  { code: 'SAR', symbol: 'SAR', name: 'SAR - Saudi Riyal', locale: 'ar-SA', flag: '🇸🇦' },
  { code: 'TRY', symbol: '₺', name: 'TRY - Turkish Lira (₺)', locale: 'tr-TR', flag: '🇹🇷' },

  // Other Major Global Currencies
  { code: 'CAD', symbol: 'CA$', name: 'CAD - Canadian Dollar ($)', locale: 'en-CA', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', name: 'AUD - Australian Dollar ($)', locale: 'en-AU', flag: '🇦🇺' },
  { code: 'CHF', symbol: 'CHF', name: 'CHF - Swiss Franc', locale: 'de-CH', flag: '🇨🇭' },
  { code: 'NZD', symbol: 'NZ$', name: 'NZD - New Zealand Dollar ($)', locale: 'en-NZ', flag: '🇳🇿' },
  { code: 'ZAR', symbol: 'R', name: 'ZAR - South African Rand (R)', locale: 'en-ZA', flag: '🇿🇦' },
  { code: 'BRL', symbol: 'R$', name: 'BRL - Brazilian Real (R$)', locale: 'pt-BR', flag: '🇧🇷' }
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

  // --- CURRENCY SUPPORT ---
  public readonly currencies = SUPPORTED_CURRENCIES;
  public readonly popularCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'CNY', 'RUB', 'JPY', 'KRW', 'CAD', 'AUD', 'SGD'];
  public selectedCurrency = signal<CurrencyOption>(this.getInitialCurrency());
  public currencySymbol = computed(() => this.selectedCurrency().symbol);

  // --- 1. EMI STATE ---
  public loanAmount = signal<number>(500000);
  public loanInterestRate = signal<number>(8.5);
  public loanTenureYears = signal<number>(5);

  public loanPresets = computed(() => {
    const code = this.selectedCurrency().code;
    const sym = this.selectedCurrency().symbol;

    if (code === 'INR' || code === 'PKR' || code === 'BDT') {
      return [
        { label: `${sym} 5L`, value: 500000 },
        { label: `${sym} 10L`, value: 1000000 },
        { label: `${sym} 25L`, value: 2500000 },
        { label: `${sym} 50L`, value: 5000000 },
        { label: `${sym} 1 Cr`, value: 10000000 }
      ];
    }
    if (code === 'CNY') {
      return [
        { label: '¥ 10万', value: 100000 },
        { label: '¥ 20万', value: 200000 },
        { label: '¥ 50万', value: 500000 },
        { label: '¥ 100万', value: 1000000 },
        { label: '¥ 200万', value: 2000000 }
      ];
    }
    if (code === 'RUB') {
      return [
        { label: '500 тыс. ₽', value: 500000 },
        { label: '1 млн ₽', value: 1000000 },
        { label: '2.5 млн ₽', value: 2500000 },
        { label: '5 млн ₽', value: 5000000 },
        { label: '10 млн ₽', value: 10000000 }
      ];
    }
    if (code === 'JPY') {
      return [
        { label: '¥ 300万', value: 3000000 },
        { label: '¥ 500万', value: 5000000 },
        { label: '¥ 1000万', value: 10000000 },
        { label: '¥ 2000万', value: 20000000 },
        { label: '¥ 3000万', value: 30000000 }
      ];
    }
    if (code === 'KRW') {
      return [
        { label: '₩ 3천만', value: 30000000 },
        { label: '₩ 5천만', value: 50000000 },
        { label: '₩ 1억', value: 100000000 },
        { label: '₩ 2억', value: 200000000 },
        { label: '₩ 3억', value: 300000000 }
      ];
    }

    return [
      { label: `${sym} 50K`, value: 50000 },
      { label: `${sym} 100K`, value: 100000 },
      { label: `${sym} 250K`, value: 250000 },
      { label: `${sym} 500K`, value: 500000 },
      { label: `${sym} 1M`, value: 1000000 }
    ];
  });

  public readonly tenurePresets = [
    { label: '5 Yrs', value: 5 },
    { label: '10 Yrs', value: 10 },
    { label: '15 Yrs', value: 15 },
    { label: '20 Yrs', value: 20 },
    { label: '30 Yrs', value: 30 }
  ];

  public emiResults = computed(() => {
    const P = this.loanAmount();
    const annualRate = this.loanInterestRate();
    const N = this.loanTenureYears() * 12; // total months

    if (P <= 0 || annualRate <= 0 || N <= 0) {
      return { monthlyEmi: 0, totalInterest: 0, totalPayment: 0, principalPercent: 100, interestPercent: 0 };
    }

    const r = annualRate / (12 * 100); // monthly interest rate
    const emi = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    const principalPercent = Math.round((P / totalPayment) * 100);
    const interestPercent = 100 - principalPercent;

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      principalPercent,
      interestPercent
    };
  });

  // --- 2. FD (FIXED DEPOSIT) STATE ---
  public fdDeposit = signal<number>(100000);
  public fdRate = signal<number>(7.0);
  public fdYears = signal<number>(3);
  public fdCompoundFreq = signal<number>(4);

  public fdResults = computed(() => {
    const P = this.fdDeposit();
    const r = this.fdRate() / 100;
    const t = this.fdYears();
    const n = this.fdCompoundFreq();

    if (P <= 0 || r <= 0 || t <= 0) {
      return { maturityValue: P, totalInterest: 0 };
    }

    const maturity = P * Math.pow(1 + r / n, n * t);
    const totalInterest = maturity - P;

    return {
      maturityValue: Math.round(maturity),
      totalInterest: Math.round(totalInterest)
    };
  });

  // --- 3. RD (RECURRING DEPOSIT) STATE ---
  public rdMonthly = signal<number>(5000);
  public rdRate = signal<number>(6.5);
  public rdMonths = signal<number>(36);

  public rdResults = computed(() => {
    const P = this.rdMonthly();
    const r = this.rdRate() / 400;
    const n = this.rdMonths();
    const totalInvested = P * n;

    if (P <= 0 || r <= 0 || n <= 0) {
      return { totalInvested, maturityValue: totalInvested, totalInterest: 0 };
    }

    let maturity = 0;
    for (let i = 1; i <= n; i++) {
      maturity += P * Math.pow(1 + r, (n - i + 1) / 3);
    }
    const totalInterest = maturity - totalInvested;

    return {
      totalInvested: Math.round(totalInvested),
      maturityValue: Math.round(maturity),
      totalInterest: Math.round(totalInterest)
    };
  });

  // --- 4. PPF (PUBLIC PROVIDENT FUND) STATE ---
  public ppfYearly = signal<number>(100000);
  public ppfYears = signal<number>(15);
  public readonly ppfRate = 7.1;

  public ppfResults = computed(() => {
    const P = this.ppfYearly();
    const r = this.ppfRate / 100;
    const years = this.ppfYears();
    const totalInvested = P * years;

    let balance = 0;
    for (let i = 0; i < years; i++) {
      balance = (balance + P) * (1 + r);
    }
    const totalInterest = balance - totalInvested;

    return {
      totalInvested: Math.round(totalInvested),
      maturityValue: Math.round(balance),
      totalInterest: Math.round(totalInterest)
    };
  });

  // --- 5. SIMPLE VS COMPOUND INTEREST STATE ---
  public interestPrincipal = signal<number>(50000);
  public interestRate = signal<number>(8.0);
  public interestTimeYears = signal<number>(5);

  public interestResults = computed(() => {
    const P = this.interestPrincipal();
    const r = this.interestRate() / 100;
    const t = this.interestTimeYears();

    const simpleInterest = P * r * t;
    const simpleTotal = P + simpleInterest;

    const compoundTotal = P * Math.pow(1 + r, t);
    const compoundInterest = compoundTotal - P;

    return {
      simpleInterest: Math.round(simpleInterest),
      simpleTotal: Math.round(simpleTotal),
      compoundInterest: Math.round(compoundInterest),
      compoundTotal: Math.round(compoundTotal),
      compoundDifference: Math.round(compoundInterest - simpleInterest)
    };
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

  public getFlag(code: string): string {
    const found = SUPPORTED_CURRENCIES.find(c => c.code === code);
    return found ? found.flag : '🌐';
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

    if (code === 'INR' || code === 'PKR' || code === 'BDT') {
      if (val >= 10000000) return `${sym} ${(val / 10000000).toFixed(0)} Cr`;
      if (val >= 100000) return `${sym} ${(val / 100000).toFixed(0)}L`;
      if (val >= 1000) return `${sym} ${(val / 1000).toFixed(0)}K`;
    } else if (code === 'CNY' || code === 'JPY') {
      if (val >= 100000000) return `${sym} ${(val / 100000000).toFixed(0)} 亿`;
      if (val >= 10000) return `${sym} ${(val / 10000).toFixed(0)} 万`;
    } else if (code === 'KRW') {
      if (val >= 100000000) return `₩ ${(val / 100000000).toFixed(0)} 억`;
      if (val >= 10000) return `₩ ${(val / 10000).toFixed(0)} 만`;
    } else if (code === 'RUB') {
      if (val >= 1000000) return `${(val / 1000000).toFixed(0)} млн ₽`;
      if (val >= 1000) return `${(val / 1000).toFixed(0)} тыс. ₽`;
    } else {
      if (val >= 1000000) return `${sym} ${(val / 1000000).toFixed(0)}M`;
      if (val >= 1000) return `${sym} ${(val / 1000).toFixed(0)}K`;
    }
    return `${sym} ${val}`;
  }

  public getAmountInWords(amount: number): string {
    if (!amount || amount <= 0) return '';
    const curr = this.selectedCurrency();
    const code = curr.code;

    if (code === 'INR' || code === 'PKR' || code === 'BDT') {
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
    } else if (code === 'CNY') {
      if (amount >= 100000000) {
        const yi = (amount / 100000000).toFixed(2).replace(/\.00$/, '');
        return `${yi} 亿元`;
      }
      if (amount >= 10000) {
        const wan = (amount / 10000).toFixed(2).replace(/\.00$/, '');
        return `${wan} 万元`;
      }
    } else if (code === 'RUB') {
      if (amount >= 1000000) {
        const m = (amount / 1000000).toFixed(2).replace(/\.00$/, '');
        return `${m} млн ₽`;
      }
      if (amount >= 1000) {
        const k = (amount / 1000).toFixed(1).replace(/\.0$/, '');
        return `${k} тыс. ₽`;
      }
    } else if (code === 'JPY') {
      if (amount >= 10000) {
        const wan = (amount / 10000).toFixed(1).replace(/\.0$/, '');
        return `${wan} 万円`;
      }
    } else if (code === 'KRW') {
      if (amount >= 100000000) {
        const eok = (amount / 100000000).toFixed(1).replace(/\.0$/, '');
        return `${eok} 억원`;
      }
      if (amount >= 10000) {
        const man = (amount / 10000).toFixed(1).replace(/\.0$/, '');
        return `${man} 만원`;
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

  public adjustLoanAmount(delta: number): void {
    const current = this.loanAmount();
    const next = Math.max(1000, current + delta);
    this.loanAmount.set(next);
  }

  public setLoanTenure(years: number): void {
    this.loanTenureYears.set(years);
  }
}
