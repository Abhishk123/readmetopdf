import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface FeatureCard {
  title: string;
  badge: string;
  icon: string;
  description: string;
  command: string;
  example: string;
  outputPreview: string;
  tags: string[];
}

@Component({
  selector: 'app-quicktools',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quicktools.component.html',
  styleUrl: './quicktools.component.css'
})
export class QuicktoolsComponent {
  readonly botPhoneNumber = '+1 (555) 804-5735';
  readonly botWaLink = 'https://wa.me/15558045735?text=Hi';
  readonly botQrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=https%3A%2F%2Fwa.me%2F15558045735%3Ftext%3DHi';

  readonly features: FeatureCard[] = [
    {
      title: 'Admit Card & Exam Photo Resizer',
      badge: 'Most Popular',
      icon: 'camera',
      description: 'Compress passport photos and signature scans strictly under 20KB, 50KB, or 100KB for government exam application forms (SSC, UPSC, IBPS, Railways, State PSC).',
      command: 'Send Photo -> Tap 20KB / 50KB',
      example: 'Upload photo from phone camera or gallery',
      outputPreview: 'Compressed JPEG (e.g. 18.4 KB, 3.5cm x 4.5cm compliant)',
      tags: ['Govt Exams', 'Admit Cards', 'Under 20KB', 'No Quality Loss']
    },
    {
      title: 'Instant Loan EMI & Finance Engine',
      badge: 'Calculators',
      icon: 'calculator',
      description: 'Calculate monthly loan installments, total interest charges, and comprehensive payment breakdowns without opening financial apps.',
      command: 'EMI [Amount] [Rate%] [TenureYears]',
      example: 'EMI 500000 8.5 5',
      outputPreview: 'Monthly EMI: ₹10,258 | Total Interest: ₹1,15,492 | Total Payable: ₹6,15,492',
      tags: ['Home Loans', 'Car Loans', 'Personal Loans', 'Instant Breakdown']
    },
    {
      title: 'Exact Age & Cutoff Date Calculator',
      badge: 'Eligibility',
      icon: 'calendar',
      description: 'Determine exact chronological age in years, months, and days as of any cutoff date for exam age limit eligibility.',
      command: 'AGE [DD-MM-YYYY] [Optional CutoffDate]',
      example: 'AGE 15-08-1998 01-08-2026',
      outputPreview: 'Age on 01-08-2026: 27 Years, 11 Months, 17 Days (Total 10,213 days)',
      tags: ['Govt Job Cutoffs', 'Birthday Countdown', 'Precise Days']
    },
    {
      title: 'Dynamic Instant UPI Payment QR',
      badge: 'Fintech',
      icon: 'qr',
      description: 'Generate on-the-fly scannable UPI payment QR codes. Anyone can scan using Google Pay, PhonePe, or Paytm to pay you instantly.',
      command: 'UPI [vpa_id] [amount] [note]',
      example: 'UPI rahul@okhdfcbank 450 Dinner',
      outputPreview: 'Generates instant QR image encoded with upi://pay?pa=...&am=450',
      tags: ['Bill Splitting', 'Shopkeeper Billing', 'GPay / PhonePe / Paytm']
    },
    {
      title: 'Safe-KYC Document Watermarker',
      badge: 'Privacy Shield',
      icon: 'shield',
      description: 'Prevent identity theft and fraud when uploading Aadhaar, PAN card, or Voter ID to third parties. Automatically stamps a secure verification watermark.',
      command: 'Send ID Photo -> Auto Watermark',
      example: 'Send Aadhaar card front photo',
      outputPreview: 'Protected copy stamped: "FOR KYC VERIFICATION ONLY - [DATE]"',
      tags: ['Aadhaar Protection', 'PAN Security', 'Anti-Fraud Watermark']
    },
    {
      title: 'Daily Math & Conversions',
      badge: 'Everyday Tools',
      icon: 'zap',
      description: 'Quick answers to daily conversions and arithmetic queries directly inside chat.',
      command: 'CURR [Amount] [From] [To] or CALC [Expression]',
      example: 'CURR 100 USD INR   or   CALC 18% of 12450',
      outputPreview: '100 USD ≈ ₹8,650 INR | 18% of ₹12,450 = ₹2,241',
      tags: ['Currency', 'GST Math', 'Discounts', 'Instant Answer']
    }
  ];

  copiedCommand: string | null = null;

  copySyntax(cmd: string): void {
    navigator.clipboard.writeText(cmd).then(() => {
      this.copiedCommand = cmd;
      setTimeout(() => {
        if (this.copiedCommand === cmd) {
          this.copiedCommand = null;
        }
      }, 2000);
    });
  }
}
