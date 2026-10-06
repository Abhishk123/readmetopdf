import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdBannerComponent],
  template: `
    <div class="page-container">
      <nav class="breadcrumb">
        <a routerLink="/">Home</a>
        <span class="sep">/</span>
        <span class="current">Contact Us</span>
      </nav>

      <app-ad-banner slot="topBanner"></app-ad-banner>

      <div class="content-card">
        <h1>Contact & Support</h1>
        <p class="subtitle">
          Have a suggestion for a new tool, found a bug, or want to partner? We would love to hear from you.
        </p>

        @if (isSubmitted()) {
          <div class="alert-success">
            <h3>✓ Thank You for Reaching Out!</h3>
            <p>Your message has been received. Our team will review your feedback and get back to you shortly.</p>
            <button type="button" class="btn-secondary" (click)="resetForm()">Send Another Message</button>
          </div>
        } @else {
          <form class="contact-form" (ngSubmit)="submitForm()">
            <div class="form-row">
              <div class="form-group">
                <label>Your Name *</label>
                <input type="text" [(ngModel)]="name" name="name" required placeholder="John Doe" class="input-text">
              </div>
              <div class="form-group">
                <label>Email Address *</label>
                <input type="email" [(ngModel)]="email" name="email" required placeholder="john@example.com" class="input-text">
              </div>
            </div>

            <div class="form-group">
              <label>Topic / Related Tool</label>
              <select [(ngModel)]="topic" name="topic" class="input-select">
                <option value="general">General Feedback</option>
                <option value="tool-request">Request a New Tool</option>
                <option value="bug-report">Report a Bug / Issue</option>
                <option value="business">Advertising / Partnership</option>
              </select>
            </div>

            <div class="form-group">
              <label>Message *</label>
              <textarea [(ngModel)]="message" name="message" required rows="5" placeholder="Tell us how we can help..." class="input-textarea"></textarea>
            </div>

            <button type="submit" class="btn-submit" [disabled]="!name || !email || !message">
              Send Message
            </button>
          </form>
        }

        <div class="direct-contact-box">
          <h3>Direct Inquiries</h3>
          <p>
            For urgent security inquiries or advertising partnerships, email us directly at:
            <a [href]="'mailto:' + contactEmail">{{ contactEmail }}</a>
          </p>
        </div>
      </div>

      <app-ad-banner slot="bottomBanner"></app-ad-banner>
    </div>
  `,
  styles: [`
    .page-container { max-width: 760px; margin: 0 auto; padding: 24px 16px 48px; }
    .breadcrumb { display: flex; gap: 8px; font-size: 13px; color: #64748b; margin-bottom: 20px; }
    .breadcrumb a { color: #2563eb; text-decoration: none; }
    .sep { color: #cbd5e1; }
    .current { color: #0f172a; font-weight: 500; }
    .content-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 36px 32px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    }
    h1 { font-size: 30px; font-weight: 800; color: #0f172a; margin: 0 0 8px; }
    .subtitle { font-size: 15px; color: #64748b; margin-bottom: 28px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { margin-bottom: 20px; }
    label { display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; }
    .input-text, .input-select, .input-textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 14px;
      font-size: 14px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      outline: none;
      font-family: inherit;
      transition: border-color 0.2s ease;
    }
    .input-text:focus, .input-select:focus, .input-textarea:focus { border-color: #2563eb; }
    .btn-submit {
      background: #2563eb;
      color: #ffffff;
      border: none;
      font-size: 14px;
      font-weight: 600;
      padding: 12px 28px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .btn-submit:hover:not(:disabled) { background: #1d4ed8; }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .alert-success {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      color: #065f46;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin-bottom: 24px;
    }
    .alert-success h3 { margin: 0 0 8px; font-size: 18px; }
    .btn-secondary {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #334155;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      margin-top: 12px;
    }
    .direct-contact-box {
      margin-top: 36px;
      border-top: 1px solid #f1f5f9;
      padding-top: 24px;
    }
    .direct-contact-box h3 { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0 0 6px; }
    .direct-contact-box p { font-size: 13px; color: #64748b; margin: 0; }
    .direct-contact-box a { color: #2563eb; text-decoration: none; font-weight: 600; }
    @media (max-width: 600px) {
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class ContactComponent {
  public name = '';
  public email = '';
  public topic = 'general';
  public message = '';
  public isSubmitted = signal<boolean>(false);
  public contactEmail = environment.contactEmail;

  public submitForm(): void {
    if (!this.name || !this.email || !this.message) return;
    this.isSubmitted.set(true);
  }

  public resetForm(): void {
    this.name = '';
    this.email = '';
    this.topic = 'general';
    this.message = '';
    this.isSubmitted.set(false);
  }
}
