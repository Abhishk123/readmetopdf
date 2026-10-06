import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';

export type FinanceTab = 'emi' | 'fd' | 'rd' | 'ppf' | 'interest';

@Component({
  selector: 'app-finance-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdBannerComponent],
  templateUrl: './finance-calculator.component.html',
  styleUrl: './finance-calculator.component.css'
})
export class FinanceCalculatorComponent {
  public activeTab = signal<FinanceTab>('emi');

  // --- 1. EMI STATE ---
  public loanAmount = signal<number>(500000);
  public loanInterestRate = signal<number>(8.5);
  public loanTenureYears = signal<number>(5);

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
  public fdCompoundFreq = signal<number>(4); // Quarterly compounding (4 times a year)

  public fdResults = computed(() => {
    const P = this.fdDeposit();
    const r = this.fdRate() / 100;
    const t = this.fdYears();
    const n = this.fdCompoundFreq();

    if (P <= 0 || r <= 0 || t <= 0) {
      return { maturityValue: P, totalInterest: 0 };
    }

    // A = P * (1 + r/n)^(n*t)
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
    const r = this.rdRate() / 400; // quarterly rate
    const n = this.rdMonths();
    const totalInvested = P * n;

    if (P <= 0 || r <= 0 || n <= 0) {
      return { totalInvested, maturityValue: totalInvested, totalInterest: 0 };
    }

    // Standard banking formula for quarterly compounded RD
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
  public readonly ppfRate = 7.1; // Government official benchmark

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

    // Simple: SI = P * r * t
    const simpleInterest = P * r * t;
    const simpleTotal = P + simpleInterest;

    // Compound (Annually): CI = P * (1 + r)^t - P
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

  public setTab(tab: FinanceTab): void {
    this.activeTab.set(tab);
  }

  public formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(val);
  }
}
