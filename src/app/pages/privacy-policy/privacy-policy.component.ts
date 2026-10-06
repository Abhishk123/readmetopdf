import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterLink, AdBannerComponent],
  template: `
    <div class="page-container">
      <nav class="breadcrumb">
        <a routerLink="/">Home</a>
        <span class="sep">/</span>
        <span class="current">Privacy Policy</span>
      </nav>

      <app-ad-banner slot="topBanner"></app-ad-banner>

      <div class="content-card">
        <h1>Privacy Policy</h1>
        <p class="last-updated">Last Updated: October 2026</p>

        <section class="section">
          <h2>1. Introduction</h2>
          <p>
            At <strong>jsnsworks</strong> ("we", "our", or "us"), accessible from <strong>https://www.jsnsworks.site</strong>, the privacy of our visitors is of paramount importance. This Privacy Policy document outlines the types of information collected and how it is utilized.
          </p>
        </section>

        <section class="section">
          <h2>2. 100% In-Browser & Local Processing</h2>
          <p>
            Our core utilities—including the <strong>README to PDF Converter</strong>, <strong>Image & File Size Reducer</strong>, <strong>Word Counter</strong>, <strong>GPA Calculator</strong>, and <strong>JSON Formatter</strong>—operate strictly client-side within your browser sandbox.
          </p>
          <p>
            <strong>Your files, documents, essays, photos, and source code are never uploaded, transmitted, or stored on external servers or databases.</strong> Processing occurs in volatile browser memory and is discarded upon closing or reloading the page.
          </p>
        </section>

        <section class="section">
          <h2>3. Cookies and Advertising Partners</h2>
          <p>
            To keep our tools free and accessible, we partner with third-party advertising networks, including <strong>Google AdSense</strong>.
          </p>
          <ul>
            <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.</li>
            <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visits to our site and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
            <li>Alternatively, you can opt out of third-party vendor cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">AboutAds.info</a>.</li>
          </ul>
        </section>

        <section class="section">
          <h2>4. Log Files and Web Analytics</h2>
          <p>
            Like standard web servers, anonymous log files may automatically record non-personally identifiable information such as internet protocol (IP) addresses, browser types, Internet Service Providers (ISP), date/time stamps, and referring/exit pages to administer the website and maintain uptime.
          </p>
        </section>

        <section class="section">
          <h2>5. GDPR and CCPA Privacy Rights</h2>
          <p>
            Under European (GDPR) and California (CCPA) data privacy laws, users have rights regarding their data. Because we do not require account registration or store personal profiles, we do not sell or retain personal consumer information.
          </p>
        </section>

        <section class="section">
          <h2>6. Contact Us</h2>
          <p>
            If you have questions or require further information regarding our Privacy Policy, please reach out via our <a routerLink="/contact">Contact Page</a>.
          </p>
        </section>
      </div>

      <app-ad-banner slot="bottomBanner"></app-ad-banner>
    </div>
  `,
  styles: [`
    .page-container { max-width: 860px; margin: 0 auto; padding: 24px 16px 48px; }
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
    h1 { font-size: 32px; font-weight: 800; color: #0f172a; margin: 0 0 6px; }
    .last-updated { font-size: 13px; color: #94a3b8; margin-bottom: 28px; }
    .section { margin-bottom: 28px; }
    h2 { font-size: 19px; font-weight: 700; color: #1e293b; margin: 0 0 10px; }
    p { font-size: 14px; color: #475569; line-height: 1.7; margin: 0 0 10px; }
    ul { margin: 10px 0 10px 20px; font-size: 14px; color: #475569; line-height: 1.7; }
    li { margin-bottom: 8px; }
    a { color: #2563eb; text-decoration: none; font-weight: 500; }
    a:hover { text-decoration: underline; }
  `]
})
export class PrivacyPolicyComponent {}
