import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <nav class="breadcrumb">
        <a routerLink="/">Home</a>
        <span class="sep">/</span>
        <span class="current">About</span>
      </nav>

      <div class="content-card">
        <div class="header-badge">Origin & Philosophy</div>
        <h1>Why we built JSANS DevStudio</h1>
        <p class="lead">
          Everyday online tools shouldn't require sending your personal documents, tax receipts, or secret keys to unknown remote servers. JSANS DevStudio was built to run standard utilities entirely inside your browser.
        </p>

        <section class="page-section">
          <h2>The Problem with Modern Online Utilities</h2>
          <p>
            When searching the web for a quick PDF merger, an image compressor, or a financial calculator, most results share the same drawbacks: intrusive file upload limits, mandatory newsletter signups, paywalls after 2 uses, and worst of all—your files are transmitted across the internet to third-party cloud buckets.
          </p>
          <p>
            Whether calculating personal loan interest, inspecting tokens, or resizing photos for official job applications, uploading files to remote servers is an unnecessary privacy risk.
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
              <p>Tools run on client-side WebAssembly, Canvas, and browser DOM APIs. Your PDFs, images, and data never leave your device.</p>
            </div>

            <div class="principle-card">
              <div class="principle-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <h3>Zero Friction</h3>
              <p>No account creation, passwords, subscriptions, or waitlists. Open the URL and get your task completed in seconds.</p>
            </div>

            <div class="principle-card">
              <div class="principle-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <h3>Transparent & Accessible</h3>
              <p>Core browser utilities are built for instant access, transparent local execution, and dependable everyday productivity.</p>
            </div>
          </div>
        </section>

        <section class="page-section">
          <h2>Technical Foundation</h2>
          <p>
            JSANS DevStudio is engineered and maintained by the <strong>JSANS DevStudio Engineering Team</strong>, focusing on high-performance JavaScript frameworks, local-first web applications, and test automation architectures.
          </p>
          <p>
            Built as a single-page progressive web application powered by Angular, TypeScript, and modern browser standards (HTML5 Canvas 2D context, FileReader, Web Workers, and <code>pdf-lib</code>), JSANS DevStudio shifts compute directly to your local CPU/GPU, delivering instant execution while completely eliminating backend server uploads.
          </p>
        </section>

        <section class="page-section">
          <h2>Editorial & Accuracy Standards</h2>
          <p>
            All mathematical models, amortization schedules, and conversion constants across our financial and engineering tools are benchmarked against official public standards (including the Reserve Bank of India, US Federal Reserve guidelines, and W3C web standards). Calculators are verified for precision.
          </p>
        </section>

        <div class="contact-cta">
          <div>
            <h3>Have feedback or a tool idea?</h3>
            <p>We actively build new utilities based on community requests.</p>
          </div>
          <a routerLink="/contact" class="btn-primary">Contact the Team</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 820px;
      margin: 0 auto;
      padding: 24px 20px 60px;
    }
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #64748b;
      margin-bottom: 24px;
    }
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
    .header-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #4f46e5;
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      padding: 4px 12px;
      border-radius: 999px;
      margin-bottom: 14px;
    }
    h1 { font-size: 30px; font-weight: 800; color: #0f172a; margin: 0 0 12px; letter-spacing: -0.025em; }
    .lead { font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 32px; }
    .page-section { margin-bottom: 36px; }
    h2 { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px; }
    p { font-size: 14.5px; color: #475569; line-height: 1.7; margin: 0 0 14px; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 13px; color: #4338ca; }

    .principles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-top: 18px;
    }
    .principle-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 22px 20px;
    }
    .principle-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4f46e5;
      margin-bottom: 14px;
    }
    .principle-card h3 { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 8px; }
    .principle-card p { font-size: 13.5px; margin: 0; line-height: 1.6; color: #64748b; }

    .contact-cta {
      border-top: 1px solid #f1f5f9;
      padding-top: 28px;
      margin-top: 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .contact-cta h3 { margin: 0 0 4px; font-size: 17px; font-weight: 700; color: #0f172a; }
    .contact-cta p { margin: 0; font-size: 13.5px; color: #64748b; }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      background: #4f46e5;
      color: #ffffff;
      padding: 11px 22px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 13.5px;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
      transition: all 0.15s ease;
    }
    .btn-primary:hover {
      background: #4338ca;
      transform: translateY(-1px);
    }
  `]
})
export class AboutComponent {}
