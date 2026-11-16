import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <nav class="breadcrumb">
        <a routerLink="/">Home</a>
        <span class="sep">/</span>
        <span class="current">Privacy Policy</span>
      </nav>

      <div class="content-card">
        <h1>Privacy Policy</h1>
        <p class="last-updated">Last Updated: October 2026</p>

        <section class="section">
          <h2>1. Introduction</h2>
          <p>
            At <strong>JSANS DevStudio</strong> ("we", "our", or "us"), accessible from <strong>https://www.jsnsworks.site</strong>, your privacy is our foundational principle. This Privacy Policy outlines how our tools operate and confirms our strict zero-data retention commitment.
          </p>
        </section>

        <section class="section">
          <h2>2. 100% In-Browser & Local Processing</h2>
          <p>
            All utilities provided by JSANS DevStudio—including financial calculators (EMI, FD, RD, PPF), document processors (PDF merger, README to PDF), media tools (image compressor, format converter, favicon generator, color picker), converters (unit converter, Base64/JWT tool), and text utilities—operate strictly client-side within your browser sandbox.
          </p>
          <p>
            <strong>Your files, documents, financial numbers, images, and source code are never uploaded, transmitted, or stored on external servers or databases.</strong> Computational processing executes directly in volatile browser memory and is discarded upon closing or reloading the session.
          </p>
        </section>

        <section class="section">
          <h2>3. Zero Personal Data Collection</h2>
          <p>
            We do not require account creation, logins, passwords, or credit card details to use any utility on JSANS DevStudio. We do not build user profiles, sell personal information, or track individual users across the web.
          </p>
        </section>

        <section class="section">
          <h2>4. Browser Local Storage</h2>
          <p>
            Some utilities may offer optional convenience features (such as retaining display currency or recent unit choices) using your browser's local storage (<code>localStorage</code>). This information never leaves your device and can be cleared at any time through your browser settings.
          </p>
        </section>

        <section class="section">
          <h2>5. Standard Web Server Logs</h2>
          <p>
            Like all web hosting platforms, our static web server records standard non-identifiable technical logs (such as HTTP status codes, browser type, and timestamps) solely to maintain website uptime, detect DDoS attacks, and diagnose infrastructure health.
          </p>
        </section>

        <section class="section">
          <h2>6. Contact & Support</h2>
          <p>
            If you have questions or require further information regarding our privacy practices, please contact us directly via our <a routerLink="/contact">Contact Page</a>.
          </p>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 860px; margin: 0 auto; padding: 24px 20px 60px; }
    .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #64748b; margin-bottom: 24px; }
    .breadcrumb a { color: #4f46e5; text-decoration: none; font-weight: 500; }
    .breadcrumb a:hover { text-decoration: underline; }
    .sep { color: #cbd5e1; }
    .current { color: #0f172a; font-weight: 600; }

    .content-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 40px 36px;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
    }
    h1 { font-size: 32px; font-weight: 800; color: #0f172a; margin: 0 0 6px; letter-spacing: -0.025em; }
    .last-updated { font-size: 13.5px; color: #64748b; margin-bottom: 32px; }
    .section { margin-bottom: 32px; }
    h2 { font-size: 19px; font-weight: 700; color: #0f172a; margin: 0 0 10px; }
    p { font-size: 14.5px; color: #475569; line-height: 1.7; margin: 0 0 12px; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 13px; color: #4338ca; }
    a { color: #4f46e5; text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; }
  `]
})
export class PrivacyPolicyComponent {}
