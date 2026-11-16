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
          <h2>Technical Foundation & Creator</h2>
          <p>
            JSNS Works was founded and architected by <strong>Abhishek Urs C J</strong>, a Senior Software Engineer with over 4 years of experience specializing in high-performance JavaScript frameworks, embedded systems, and test automation architectures.
          </p>
          <p>
            Built as a single-page progressive web application powered by Angular 21, TypeScript, and modern browser standards (HTML5 Canvas 2D context, FileReader, Web Workers, and <code>pdf-lib</code>), JSNS Works shifts compute directly to your local CPU/GPU, delivering instant utility execution while completely eliminating backend cloud tracking.
          </p>
        </section>

        <section class="page-section">
          <h2>Editorial & Accuracy Standards</h2>
          <p>
            All mathematical models, amortization schedules, and conversion constants across our financial and engineering tools are benchmarked against official public standards (including the Reserve Bank of India, US Federal Reserve guidelines, IEEE floating-point standards, and W3C web standards). Calculators are routinely audited and verified for precision.
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
      color: #94a3b8;
      margin-bottom: 20px;
    }
    .breadcrumb a { color: #818cf8; text-decoration: none; }
    .sep { color: rgba(148, 163, 184, 0.4); }
    .current { color: #ffffff; font-weight: 600; }
    .content-card {
      background: rgba(15, 23, 42, 0.82);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(99, 102, 241, 0.22);
      border-radius: 16px;
      padding: 36px 32px;
      box-shadow: 0 4px 28px rgba(0, 0, 0, 0.35);
    }
    .header-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #818cf8;
      background: rgba(99, 102, 241, 0.2);
      border: 1px solid rgba(165, 180, 252, 0.3);
      padding: 4px 12px;
      border-radius: 999px;
      margin-bottom: 12px;
    }
    h1 { font-size: 28px; font-weight: 800; color: #ffffff; margin: 0 0 12px; letter-spacing: -0.02em; }
    .lead { font-size: 16px; color: #cbd5e1; line-height: 1.6; margin-bottom: 28px; }
    .page-section { margin-bottom: 32px; }
    h2 { font-size: 18px; font-weight: 700; color: #ffffff; margin: 0 0 10px; }
    p { font-size: 14px; color: #94a3b8; line-height: 1.7; margin: 0 0 12px; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background: rgba(30, 41, 59, 0.8); padding: 2px 6px; border-radius: 4px; font-size: 12px; color: #c7d2fe; }
    .principles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    .principle-card {
      background: rgba(11, 17, 32, 0.75);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 12px;
      padding: 20px 18px;
    }
    .principle-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(99, 102, 241, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #818cf8;
      margin-bottom: 12px;
    }
    .principle-card h3 { font-size: 15px; font-weight: 700; color: #ffffff; margin: 0 0 6px; }
    .principle-card p { font-size: 13px; margin: 0; line-height: 1.6; color: #94a3b8; }
    .contact-cta {
      border-top: 1px solid rgba(99, 102, 241, 0.2);
      padding-top: 24px;
      margin-top: 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .contact-cta h3 { margin: 0 0 4px; font-size: 16px; font-weight: 700; color: #ffffff; }
    .contact-cta p { margin: 0; font-size: 13px; color: #94a3b8; }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #ffffff;
      padding: 10px 20px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 13px;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(124, 58, 237, 0.5);
    }
  `]
})
export class AboutComponent {}
