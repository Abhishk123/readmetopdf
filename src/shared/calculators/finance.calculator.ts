/**
 * Shared Finance & Investment Calculation Engine
 * Used by both Web Tools (Angular) and WhatsApp Cloud API Bot (/api/whatsapp)
 */

export interface EmiResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  principalPercent: number;
  interestPercent: number;
}

export interface FdResult {
  maturityValue: number;
  totalInterest: number;
  totalInvested: number;
}

export interface RdResult {
  maturityValue: number;
  totalInvested: number;
  totalInterest: number;
}

export interface PpfResult {
  maturityValue: number;
  totalInvested: number;
  totalInterest: number;
}

export interface InterestComparisonResult {
  simpleTotal: number;
  simpleInterest: number;
  compoundTotal: number;
  compoundInterest: number;
  compoundDifference: number;
}

export interface GstResult {
  netAmount: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  cgst: number;
  sgst: number;
}

/**
 * Standard Reducing Balance Loan EMI Calculator
 * Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 */
export function calculateLoanEmi(principal: number, annualRate: number, tenureYears: number): EmiResult {
  const p = Math.max(0, principal || 0);
  const years = Math.max(0.1, tenureYears || 1);
  const nMonths = Math.round(years * 12);

  if (p === 0) {
    return { monthlyEmi: 0, totalInterest: 0, totalPayment: 0, principalPercent: 100, interestPercent: 0 };
  }

  if (annualRate <= 0) {
    const monthly = Math.round(p / nMonths);
    return {
      monthlyEmi: monthly,
      totalInterest: 0,
      totalPayment: p,
      principalPercent: 100,
      interestPercent: 0
    };
  }

  const rMonthly = annualRate / (12 * 100);
  const emi = (p * rMonthly * Math.pow(1 + rMonthly, nMonths)) / (Math.pow(1 + rMonthly, nMonths) - 1);
  const totalPayment = emi * nMonths;
  const totalInterest = Math.max(0, totalPayment - p);

  const principalPercent = Math.round((p / totalPayment) * 100);
  const interestPercent = 100 - principalPercent;

  return {
    monthlyEmi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    principalPercent,
    interestPercent
  };
}

/**
 * Bank Fixed Deposit (FD) Calculator (Quarterly Compounding)
 * Formula: A = P * (1 + r / 400)^(4 * t)
 */
export function calculateFixedDeposit(deposit: number, annualRate: number, years: number): FdResult {
  const p = Math.max(0, deposit || 0);
  const r = Math.max(0, annualRate || 0);
  const t = Math.max(0.1, years || 1);

  const n = 4; // Quarterly compounding standard
  const maturityValue = p * Math.pow(1 + (r / (n * 100)), n * t);
  const totalInterest = Math.max(0, maturityValue - p);

  return {
    maturityValue: Math.round(maturityValue),
    totalInterest: Math.round(totalInterest),
    totalInvested: p
  };
}

/**
 * Recurring Deposit (RD) Calculator (Commercial Quarterly Compounding)
 */
export function calculateRecurringDeposit(monthlyDeposit: number, annualRate: number, months: number): RdResult {
  const p = Math.max(0, monthlyDeposit || 0);
  const r = Math.max(0, annualRate || 0);
  const n = Math.max(1, months || 1);

  const totalInvested = p * n;
  let maturityValue = 0;

  for (let i = 1; i <= n; i++) {
    const remainingMonths = n - i + 1;
    const quarters = remainingMonths / 3;
    maturityValue += p * Math.pow(1 + (r / 400), quarters);
  }

  const totalInterest = Math.max(0, maturityValue - totalInvested);

  return {
    maturityValue: Math.round(maturityValue),
    totalInvested,
    totalInterest: Math.round(totalInterest)
  };
}

/**
 * Public Provident Fund (PPF) Calculator (Annual Compounding, 15-Yr Tenure)
 */
export function calculatePpf(yearlyDeposit: number, years: number = 15, annualRate: number = 7.1): PpfResult {
  const p = Math.min(150000, Math.max(500, yearlyDeposit || 0));
  const t = Math.max(15, years || 15);
  const r = annualRate / 100;

  let balance = 0;
  let totalInvested = 0;

  for (let year = 1; year <= t; year++) {
    totalInvested += p;
    balance = (balance + p) * (1 + r);
  }

  const totalInterest = Math.max(0, balance - totalInvested);

  return {
    maturityValue: Math.round(balance),
    totalInvested,
    totalInterest: Math.round(totalInterest)
  };
}

/**
 * Simple vs Compound Interest Comparison
 */
export function calculateInterestComparison(principal: number, annualRate: number, years: number): InterestComparisonResult {
  const p = Math.max(0, principal || 0);
  const r = Math.max(0, annualRate || 0);
  const t = Math.max(0.1, years || 1);

  // Simple: A = P * (1 + r*t)
  const simpleInterest = (p * r * t) / 100;
  const simpleTotal = p + simpleInterest;

  // Compound: Annual compounding A = P * (1 + r/100)^t
  const compoundTotal = p * Math.pow(1 + (r / 100), t);
  const compoundInterest = Math.max(0, compoundTotal - p);
  const compoundDifference = Math.max(0, compoundTotal - simpleTotal);

  return {
    simpleTotal: Math.round(simpleTotal),
    simpleInterest: Math.round(simpleInterest),
    compoundTotal: Math.round(compoundTotal),
    compoundInterest: Math.round(compoundInterest),
    compoundDifference: Math.round(compoundDifference)
  };
}

/**
 * Goods & Services Tax (GST) Calculator
 */
export function calculateGst(amount: number, gstRate: number, isInclusive: boolean = false): GstResult {
  const val = Math.max(0, amount || 0);
  const rate = Math.max(0, gstRate || 0);

  let netAmount = val;
  let gstAmount = 0;
  let totalAmount = val;

  if (isInclusive) {
    netAmount = (val * 100) / (100 + rate);
    gstAmount = val - netAmount;
    totalAmount = val;
  } else {
    gstAmount = (val * rate) / 100;
    totalAmount = val + gstAmount;
    netAmount = val;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  return {
    netAmount: Math.round(netAmount * 100) / 100,
    gstRate: rate,
    gstAmount: Math.round(gstAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100
  };
}
