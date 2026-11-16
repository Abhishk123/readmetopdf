/**
 * Serverless / Edge Shared Calculations for QuickTools Bot
 */

export interface EmiResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  principalPercent: number;
  interestPercent: number;
}

export interface GstResult {
  netAmount: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  cgst: number;
  sgst: number;
}

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

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  daysUntilNextBirthday: number;
  formattedString: string;
}

export function parseDateString(input: string): Date | null {
  const clean = input.trim();
  const parts = clean.split(/[-/.]/);

  if (parts.length === 3) {
    let day: number, month: number, year: number;

    if (parts[0].length === 4) {
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
    } else {
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      year = parseInt(parts[2], 10);
    }

    const d = new Date(year, month, day);
    if (!isNaN(d.getTime()) && d.getDate() === day && d.getMonth() === month) {
      return d;
    }
  }

  const timestamp = Date.parse(clean);
  return isNaN(timestamp) ? null : new Date(timestamp);
}

export function calculateExactAge(birthDate: Date | string, asOfDate: Date = new Date()): AgeResult | null {
  const dob = typeof birthDate === 'string' ? parseDateString(birthDate) : birthDate;
  if (!dob || isNaN(dob.getTime())) {
    return null;
  }

  const today = asOfDate;
  if (dob > today) {
    return null;
  }

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonthDays;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffMs = today.getTime() - dob.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = (years * 12) + months;

  const nextBday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBday < today) {
    nextBday.setFullYear(today.getFullYear() + 1);
  }
  const daysUntilNextBirthday = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalMonths,
    daysUntilNextBirthday,
    formattedString: `${years} Years, ${months} Months, ${days} Days`
  };
}

export interface UpiPaymentConfig {
  vpa: string;
  payeeName: string;
  amount?: number;
  transactionNote?: string;
  currency?: string;
}

export function buildUpiUri(config: UpiPaymentConfig): string {
  const params = new URLSearchParams();
  params.append('pa', config.vpa.trim());
  params.append('pn', config.payeeName.trim());

  if (config.amount && config.amount > 0) {
    params.append('am', config.amount.toFixed(2));
  }
  params.append('cu', config.currency || 'INR');

  if (config.transactionNote) {
    params.append('tn', config.transactionNote.trim());
  }

  return `upi://pay?${params.toString()}`;
}

export function parseUpiCommand(text: string): UpiPaymentConfig | null {
  const parts = text.trim().split(/\s+/);
  if (parts.length < 2) return null;

  const vpa = parts[1];
  if (!vpa.includes('@')) return null;

  let amount: number | undefined;
  let note: string | undefined;

  if (parts.length >= 3) {
    const parsedAmount = parseFloat(parts[2]);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      amount = parsedAmount;
      if (parts.length >= 4) {
        note = parts.slice(3).join(' ');
      }
    } else {
      note = parts.slice(2).join(' ');
    }
  }

  return {
    vpa,
    payeeName: vpa.split('@')[0],
    amount,
    transactionNote: note
  };
}
