/**
 * Shared UPI Payment & QR Generator Helper
 * Compatible with NPCI UPI Deep-Link Specifications
 */

export interface UpiPaymentConfig {
  vpa: string;         // e.g. payee@okhdfcbank
  payeeName: string;   // e.g. JSANS DevStudio or Rahul Sharma
  amount?: number;     // Optional pre-filled amount in INR
  transactionNote?: string; // Optional note e.g. "Tuition Fees"
  currency?: string;   // Defaults to "INR"
}

/**
 * Builds standard NPCI-compliant UPI payment intent string:
 * upi://pay?pa={vpa}&pn={payeeName}&am={amount}&cu=INR&tn={transactionNote}
 */
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

/**
 * Parses user quick commands like:
 * "UPI rahul@okhdfcbank 500" or "UPI store@upi 1250 Groceries"
 */
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
