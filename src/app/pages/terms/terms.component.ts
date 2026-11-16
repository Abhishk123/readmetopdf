import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <nav class="breadcrumb">
        <a routerLink="/">Home</a>
        <span class="sep">/</span>
        <span class="current">Terms of Service</span>
      </nav>

      <div class="content-card">
        <h1>Terms of Service</h1>
        <p class="last-updated">Last Updated: October 2026</p>

        <section class="section">
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing and utilizing <strong>JSANS DevStudio</strong> (https://www.jsnsworks.site), you agree to comply with and be bound by these Terms of Service. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section class="section">
          <h2>2. License & Acceptable Use</h2>
          <p>
            Our online web tools are provided free of charge for personal, educational, and commercial purposes. You agree not to attempt to reverse engineer, disrupt website uptime, inject malicious code, or overwhelm our services with automated scripts or bot scraping.
          </p>
        </section>

        <section class="section">
          <h2>3. Disclaimer of Warranties</h2>
          <p>
            The tools and documentation on JSANS DevStudio are provided "as is" without warranties of any kind, either expressed or implied. While we strive for accuracy in calculations and file conversions, we do not guarantee that functions will be completely uninterrupted or error-free.
          </p>
        </section>

        <section class="section">
          <h2>4. Limitation of Liability</h2>
          <p>
            In no event shall JSANS DevStudio or its contributors be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our tools.
          </p>
        </section>

        <section class="section">
          <h2>5. Modifications</h2>
          <p>
            We reserve the right to revise or update these Terms of Service at any time without prior notice. Continued use of the website constitutes agreement to the updated terms.
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
    p { font-size: 14.5px; color: #475569; line-height: 1.7; margin: 0; }
  `]
})
export class TermsComponent {}
