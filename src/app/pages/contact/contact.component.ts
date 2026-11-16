import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <nav class="breadcrumb">
        <a routerLink="/">Home</a>
        <span class="sep">/</span>
        <span class="current">Contact Us</span>
      </nav>

      <div class="content-card">
        <h1>Contact & Support</h1>
        <p class="subtitle">
          Have a suggestion for a new tool, found a bug, or want to partner? Fill out the form below to reach us directly.
        </p>

        @if (isSubmitted()) {
          <div class="email-ready-box">
            <div class="ready-badge">Message Ready to Dispatch</div>
            <h3>Choose How to Send Your Inquiry</h3>
            <p class="ready-desc">
              Your inquiry has been formatted and addressed to <strong>{{ contactEmail }}</strong>. Choose your email client:
            </p>

            <div class="send-options-grid">
              <!-- Option A: Open directly in Web Gmail -->
              <a [href]="gmailComposeUrl()" target="_blank" rel="noopener noreferrer" class="btn-email-option gmail">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>Open in Web Gmail</span>
              </a>

              <!-- Option B: Open Default Desktop / Mobile Mail App -->
              <a [href]="mailtoUrl()" class="btn-email-option desktop">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <span>Default Mail Client</span>
              </a>
            </div>

            <!-- Copy Details Helper -->
            <div class="copy-helpers">
              <button type="button" class="btn-copy-chip" (click)="copyEmail()">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>{{ copiedEmail() ? 'Address Copied' : 'Copy ' + contactEmail }}</span>
              </button>
              <button type="button" class="btn-copy-chip" (click)="copyFullMessage()">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                <span>{{ copiedBody() ? 'Body Copied' : 'Copy Message Body' }}</span>
              </button>
            </div>

            <div class="ready-footer">
              <button type="button" class="btn-secondary" (click)="resetForm()">Compose another message</button>
            </div>
          </div>
        } @else {
          <form class="contact-form" (ngSubmit)="submitForm()">
            <div class="form-row">
              <div class="form-group">
                <label>Your Name *</label>
                <input type="text" [(ngModel)]="name" name="name" required placeholder="Jane Doe" class="input-text">
              </div>
              <div class="form-group">
                <label>Email Address *</label>
                <input type="email" [(ngModel)]="email" name="email" required placeholder="jane@example.com" class="input-text">
              </div>
            </div>

            <div class="form-group">
              <label>Topic</label>
              <select [(ngModel)]="topic" name="topic" class="input-select">
                <option value="General Feedback">General Feedback</option>
                <option value="Tool Request">Request a New Tool</option>
                <option value="Bug Report">Report a Bug / Issue</option>
                <option value="Partnership">Advertising / Partnership</option>
              </select>
            </div>

            <div class="form-group">
              <label>Message *</label>
              <textarea [(ngModel)]="message" name="message" required rows="5" placeholder="Share your suggestions, issue details, or tool request..." class="input-textarea"></textarea>
            </div>

            <button type="submit" class="btn-submit" [disabled]="!name || !email || !message">
              <span>Send Message</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </form>
        }

        <div class="direct-contact-box">
          <h3>Direct Email</h3>
          <p>
            You can also write directly to our official support inbox anytime:
            <a [href]="'mailto:' + contactEmail">{{ contactEmail }}</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 760px; margin: 0 auto; padding: 24px 20px 60px; }
    .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #64748b; margin-bottom: 24px; }
    .breadcrumb a { color: #4f46e5; text-decoration: none; font-weight: 500; }
    .breadcrumb a:hover { text-decoration: underline; }
    .sep { color: #cbd5e1; }
    .current { color: #0f172a; font-weight: 600; }

    .content-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 36px 32px;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
    }
    h1 { font-size: 30px; font-weight: 800; color: #0f172a; margin: 0 0 8px; letter-spacing: -0.02em; }
    .subtitle { font-size: 15px; color: #64748b; margin-bottom: 28px; line-height: 1.5; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { margin-bottom: 20px; }
    label { display: block; font-size: 13.5px; font-weight: 600; color: #334155; margin-bottom: 6px; }

    .input-text, .input-select, .input-textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 14px;
      font-size: 14.5px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      color: #0f172a;
      border-radius: 8px;
      outline: none;
      font-family: inherit;
      transition: all 0.15s ease;
    }
    .input-text:focus, .input-select:focus, .input-textarea:focus {
      border-color: #4f46e5;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
    }
    .input-select option {
      background: #ffffff;
      color: #0f172a;
    }

    .btn-submit {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #4f46e5;
      color: #ffffff;
      border: none;
      font-size: 14px;
      font-weight: 600;
      padding: 12px 28px;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
      transition: all 0.15s ease;
    }
    .btn-submit:hover:not(:disabled) {
      background: #4338ca;
      transform: translateY(-1px);
    }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Ready to Send Box */
    .email-ready-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 14px;
      padding: 28px;
      text-align: center;
      margin-bottom: 24px;
    }
    .ready-badge {
      display: inline-block;
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #86efac;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 999px;
      margin-bottom: 12px;
    }
    .email-ready-box h3 { margin: 0 0 8px; font-size: 20px; color: #0f172a; font-weight: 700; }
    .ready-desc { font-size: 14px; color: #475569; margin: 0 0 20px; }

    .send-options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 20px;
    }
    .btn-email-option {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 12px 20px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      transition: all 0.15s ease;
    }
    .btn-email-option.gmail {
      background: #ea4335;
      color: #ffffff;
    }
    .btn-email-option.gmail:hover { background: #d93025; }
    .btn-email-option.desktop {
      background: #2563eb;
      color: #ffffff;
    }
    .btn-email-option.desktop:hover { background: #1d4ed8; }

    .copy-helpers {
      display: flex;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }
    .btn-copy-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #475569;
      font-size: 12px;
      font-weight: 600;
      padding: 7px 14px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-copy-chip:hover {
      background: #f1f5f9;
      color: #0f172a;
    }

    .ready-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 16px;
    }
    .btn-secondary {
      background: transparent;
      border: none;
      color: #64748b;
      font-size: 13px;
      cursor: pointer;
      font-weight: 600;
    }
    .btn-secondary:hover { color: #0f172a; }

    .direct-contact-box {
      margin-top: 32px;
      border-top: 1px solid #f1f5f9;
      padding-top: 24px;
      background: #f8fafc;
      border-radius: 12px;
      padding: 16px 20px;
    }
    .direct-contact-box h3 { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 6px; }
    .direct-contact-box p { font-size: 13.5px; color: #64748b; margin: 0; }
    .direct-contact-box a { color: #4f46e5; text-decoration: none; font-weight: 600; }
    .direct-contact-box a:hover { text-decoration: underline; }

    @media (max-width: 600px) {
      .form-row { grid-template-columns: 1fr; }
      .send-options-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ContactComponent {
  public name = '';
  public email = '';
  public topic = 'General Feedback';
  public message = '';
  public contactEmail = 'jsansdevstudio@gmail.com';

  public isSubmitted = signal<boolean>(false);
  public copiedEmail = signal<boolean>(false);
  public copiedBody = signal<boolean>(false);

  public submitForm(): void {
    if (!this.name || !this.email || !this.message) return;
    this.isSubmitted.set(true);
  }

  public resetForm(): void {
    this.isSubmitted.set(false);
    this.name = '';
    this.email = '';
    this.message = '';
    this.topic = 'General Feedback';
    this.copiedEmail.set(false);
    this.copiedBody.set(false);
  }

  public mailtoUrl(): string {
    const subject = encodeURIComponent(`[${this.topic}] Inquiry from ${this.name}`);
    const body = encodeURIComponent(
      `Hi JSANS DevStudio Support,\n\n${this.message}\n\n---\nFrom: ${this.name}\nReply-To: ${this.email}`
    );
    return `mailto:${this.contactEmail}?subject=${subject}&body=${body}`;
  }

  public gmailComposeUrl(): string {
    const subject = encodeURIComponent(`[${this.topic}] Inquiry from ${this.name}`);
    const body = encodeURIComponent(
      `Hi JSANS DevStudio Support,\n\n${this.message}\n\n---\nFrom: ${this.name}\nReply-To: ${this.email}`
    );
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${this.contactEmail}&su=${subject}&body=${body}`;
  }

  public copyEmail(): void {
    navigator.clipboard.writeText(this.contactEmail);
    this.copiedEmail.set(true);
    setTimeout(() => this.copiedEmail.set(false), 2500);
  }

  public copyFullMessage(): void {
    const full = `Topic: ${this.topic}\nFrom: ${this.name} (${this.email})\n\n${this.message}`;
    navigator.clipboard.writeText(full);
    this.copiedBody.set(true);
    setTimeout(() => this.copiedBody.set(false), 2500);
  }
}
