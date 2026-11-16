/**
 * Shared Age & Calendar Calculation Engine
 * Used by both Web Tools (Angular) and WhatsApp Cloud API Bot (/api/whatsapp)
 */

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

/**
 * Calculates exact age in years, months, and days with calendar precision
 */
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

  // Next Birthday Calculation
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

/**
 * Parses multiple input date formats: DD-MM-YYYY, YYYY-MM-DD, DD/MM/YYYY
 */
export function parseDateString(input: string): Date | null {
  const clean = input.trim();
  const parts = clean.split(/[-/.]/);

  if (parts.length === 3) {
    let day: number, month: number, year: number;

    if (parts[0].length === 4) {
      // YYYY-MM-DD
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
    } else {
      // DD-MM-YYYY
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
