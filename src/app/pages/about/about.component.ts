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
        <span class="current">About Us</span>
      </nav>

      <app-ad-banner slot="topBanner"></app-ad-banner>

      <div class="content-card">
        <h1>About JSNS Works</h1>
        <p class="lead">
          Empowering students, developers, and creators worldwide with fast, free, and privacy-focused online utilities.
        </p>

        <section class="page-section">
          <h2>Our Mission</h2>
          <p>
            At <strong>jsnsworks</strong>, we believe every individual should have access to reliable digital productivity tools without intrusive logins, paywalls, or privacy compromises. Whether you are formatting complex documentation, reducing image sizes for academic submissions, or calculating college GPA scores, our mission is to make routine digital tasks instantaneous and effortless.
          </p>
        </section>

        <section class="page-section">
          <h2>Our Core Principles</h2>
          <div class="principles-grid">
            <div class="principle-card">
              <h3>🔒 Absolute Privacy</h3>
              <p>All data transformation, file parsing, and calculations execute entirely in your web browser. Your private documents and photos are never sent to external servers.</p>
            </div>
            <div class="principle-card">
              <h3>⚡ Zero Friction</h3>
              <p>No account creation, passwords, or credit cards required. Open the page and complete your work in seconds.</p>
            </div>
            <div class="principle-card">
              <h3>🌍 Open & Accessible</h3>
              <p>Designed to be lightweight, mobile-responsive, and accessible across devices, browsers, and network speeds.</p>
            </div>
          </div>
        </section>

        <section class="page-section">
          <h2>Technology Stack</h2>
          <p>
            JSNS Works is built using modern web standards including Angular, TypeScript, HTML5 Canvas, WebAssembly, and modern browser APIs. By shifting computational work to the client side, we guarantee ultra-low latency while eliminating server storage risks.
          </p>
        </section>

        <div class="contact-cta">
          <p>Have questions, ideas for new tools, or feedback?</p>
          <a routerLink="/contact" class="btn-primary">Get in Touch</a>
        </div>
      </div>

      <app-ad-banner slot="bottomBanner"></app-ad-banner>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 860px;
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
      border-radius: 16px;
      padding: 36px 32px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    }
    h1 { font-size: 32px; font-weight: 800; color: #0f172a; margin: 0 0 12px; }
    .lead { font-size: 17px; color: #475569; line-height: 1.6; margin-bottom: 28px; }
    .page-section { margin-bottom: 32px; }
    h2 { font-size: 20px; font-weight: 700; color: #1e293b; margin: 0 0 12px; }
    p { font-size: 14px; color: #475569; line-height: 1.7; margin: 0 0 12px; }
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
      padding: 18px;
    }
    .principle-card h3 { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 6px; }
    .principle-card p { font-size: 13px; margin: 0; }
    .contact-cta {
      border-top: 1px solid #e2e8f0;
      padding-top: 24px;
      margin-top: 24px;
      text-align: center;
    }
    .btn-primary {
      display: inline-block;
      background: #2563eb;
      color: #ffffff;
      padding: 10px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
    }
  `]
})
export class AboutComponent {}
