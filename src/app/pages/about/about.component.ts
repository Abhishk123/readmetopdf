import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, AdBannerComponent],
  template: `
    <div class="page-container">
      <nav class="breadcrumb">
        <a routerLink="/">Home</a>
        <span class="sep">/</span>
        <span class="current">About</span>
      </nav>

      <app-ad-banner slot="topBanner"></app-ad-banner>

      <div class="content-card">
        <div class="header-badge">Origin & Philosophy</div>
        <h1>Why we built JSNS Works</h1>
        <p class="lead">
          Everyday online tools shouldn't require sending your personal documents, tax receipts, or secret API keys to unknown remote servers. JSNS Works was built to run standard utilities entirely inside your browser.
        </p>

        <section class="page-section">
          <h2>The Problem with Modern Online Utilities</h2>
          <p>
            When you search the web for a quick PDF merger, an image compressor, or a JWT inspector, most top results share the same drawbacks: intrusive file upload limits, mandatory newsletter signups, paywalls after 2 uses, and worst of all—your files are transmitted across the internet to third-party cloud buckets.
          </p>
          <p>
            Whether calculating personal loan interest, inspecting tokens, or resizing photos for official applications, uploading files to remote servers is an unnecessary privacy risk.
          </p>
        </section>

        <section class="page-section">
          <h2>Our Architectural Principles</h2>
          <div class="principles-grid">
            <div class="principle-card">
              <div class="principle-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3>Local-First Computation</h3>
              <p>Every tool runs on client-side WebAssembly, Canvas, and DOM APIs. Your PDFs, images, and strings never leave your machine.</p>
            </div>

            <div class="principle-card">
              <div class="principle-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <h3>Zero Account Friction</h3>
              <p>No account creation, passwords, subscriptions, or waitlists. Open the URL and get your task completed in seconds.</p>
            </div>

            <div class="principle-card">
              <div class="principle-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <h3>Transparent & Free</h3>
              <p>Funded through non-intrusive, privacy-compliant standard web advertising so the tools remain completely free for everyone.</p>
            </div>
          </div>
        </section>

        <section class="page-section">
          <h2>Technical Foundation</h2>
          <p>
            JSNS Works is built as a single-page progressive web application powered by Angular 21, TypeScript, and modern browser standards (HTML5 Canvas 2D context, FileReader, Web Workers, and <code>pdf-lib</code>). By shifting compute to your local CPU/GPU, we deliver instant feedback while eliminating backend server overhead.
          </p>
        </section>

        <div class="contact-cta">
          <div>
            <h3>Have feedback or a tool idea?</h3>
            <p>We actively build new utilities based on community requests.</p>
          </div>
          <a routerLink="/contact" class="btn-primary">Contact the Developer</a>
        </div>
      </div>

      <app-ad-banner slot="bottomBanner"></app-ad-banner>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 820px;
      margin: 0 auto;
      padding: 24px 16px 48px;
    }
    .breadcrumb {
      display: flex;
      gap: 8px;
      font-size: 13px;
      color: #64748b;
      margin-bottom: 20px;
    }
    .breadcrumb a { color: #2563eb; text-decoration: none; }
    .sep { color: #cbd5e1; }
    .current { color: #0f172a; font-weight: 500; }
    .content-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 36px 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    .header-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0284c7;
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      padding: 3px 10px;
      border-radius: 6px;
      margin-bottom: 12px;
    }
    h1 { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0 0 12px; letter-spacing: -0.02em; }
    .lead { font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 28px; }
    .page-section { margin-bottom: 32px; }
    h2 { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 10px; }
    p { font-size: 14px; color: #475569; line-height: 1.7; margin: 0 0 12px; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 12px; color: #0f172a; }
    .principles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    .principle-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 20px 18px;
    }
    .principle-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0284c7;
      margin-bottom: 12px;
    }
    .principle-card h3 { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 6px; }
    .principle-card p { font-size: 13px; margin: 0; line-height: 1.6; }
    .contact-cta {
      border-top: 1px solid #e2e8f0;
      padding-top: 24px;
      margin-top: 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .contact-cta h3 { margin: 0 0 4px; font-size: 16px; font-weight: 700; color: #0f172a; }
    .contact-cta p { margin: 0; font-size: 13px; color: #64748b; }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      background: #0f172a;
      color: #ffffff;
      padding: 10px 20px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 13px;
      transition: background 0.15s ease;
    }
    .btn-primary:hover { background: #1e293b; }
  `]
})
export class AboutComponent {}
