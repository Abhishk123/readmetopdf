import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterLink, AdBannerComponent],
  template: `
    <div class="page-container">
      <nav class="breadcrumb">
        <a routerLink="/">Home</a>
        <span class="sep">/</span>
        <span class="current">Terms of Service</span>
      </nav>

      <app-ad-banner slot="topBanner"></app-ad-banner>

      <div class="content-card">
        <h1>Terms of Service</h1>
        <p class="last-updated">Last Updated: October 2026</p>

        <section class="section">
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing and utilizing <strong>jsnsworks</strong> (https://www.jsnsworks.site), you agree to comply with and be bound by these Terms of Service. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
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
            The tools and documentation on JSNS Works are provided "as is" without warranties of any kind, either expressed or implied. While we strive for absolute accuracy in calculations and file conversions, we do not guarantee that functions will be completely uninterrupted or error-free.
          </p>
        </section>

        <section class="section">
          <h2>4. Limitation of Liability</h2>
          <p>
            In no event shall JSNS Works or its contributors be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our tools.
          </p>
        </section>

        <section class="section">
          <h2>5. Modifications</h2>
          <p>
            We reserve the right to revise or update these Terms of Service at any time without prior notice. Continued use of the website constitutes agreement to the updated terms.
          </p>
        </section>
      </div>

      <app-ad-banner slot="bottomBanner"></app-ad-banner>
    </div>
  `,
  styles: [`
    .page-container { max-width: 860px; margin: 0 auto; padding: 24px 16px 48px; }
    .breadcrumb { display: flex; gap: 8px; font-size: 13px; color: #94a3b8; margin-bottom: 20px; }
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
    h1 { font-size: 32px; font-weight: 800; color: #ffffff; margin: 0 0 6px; }
    .last-updated { font-size: 13px; color: #94a3b8; margin-bottom: 28px; }
    .section { margin-bottom: 28px; }
    h2 { font-size: 19px; font-weight: 700; color: #ffffff; margin: 0 0 10px; }
    p { font-size: 14px; color: #cbd5e1; line-height: 1.7; margin: 0; }
  `]
})
export class TermsComponent {}
