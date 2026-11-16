import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../services/admin.service';

export interface StudioProject {
  id: string;
  title: string;
  category: string;
  badge: string;
  badgeClass: string;
  description: string;
  features: string[];
  route?: string;
  externalLink?: string;
  actionText: string;
  isExternal?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public adminService = inject(AdminService);

  // Digital Products & Projects of JSANS DevStudio
  public readonly projects: StudioProject[] = [
    {
      id: 'web-tools',
      title: 'Online Utilities Suite',
      category: 'Web Platform',
      badge: 'Live & Free',
      badgeClass: 'badge-live',
      description: 'A comprehensive suite of 16+ fast, private web utilities for document handling, image compression, financial math, developer tokens, and daily calculations.',
      features: [
        'PDF Merger & In-Browser Combiner',
        'Image Size Reducer & Format Converter',
        'Multi-Currency Loan EMI, FD & PPF Calculators',
        'Hardware Crypto Password & Secret Key Maker',
        'Barcode & 2D QR Code Generator with SVG/PNG Export'
      ],
      route: '/tools',
      actionText: 'Open Utilities Suite (16+ Tools)'
    },
    {
      id: 'whatsapp-bot',
      title: 'QuickTools on WhatsApp',
      category: 'Automation Bot',
      badge: 'Active Webhook',
      badgeClass: 'badge-live',
      description: 'An everyday multi-utility bot on WhatsApp. Resize exam photos, calculate loan EMIs, compute exact age, and generate QR codes directly in your WhatsApp chat.',
      features: [
        'Compress photos under 20KB, 50KB, 100KB for exam forms',
        'Instant command math: EMI [Amount] [Rate] [Years]',
        'Instant Age calculation for competitive exam eligibility',
        'Runs on Meta WhatsApp Cloud API with zero app installation'
      ],
      actionText: 'Explore WhatsApp Bot'
    },
    {
      id: 'mobile-app',
      title: 'JSANS Mobile Utilities',
      category: 'Mobile Application',
      badge: 'In Development',
      badgeClass: 'badge-upcoming',
      description: 'A native, cross-platform smartphone application bringing offline document scanning, local file compression, and battery-friendly financial calculators to Android & iOS.',
      features: [
        'Native camera document scanner with edge detection',
        'Offline-first architecture without cloud latency',
        'Battery-optimized calculation engines',
        'Ad-free premium experience'
      ],
      actionText: 'Coming Soon to Play Store & App Store'
    },
    {
      id: 'dev-saas',
      title: 'Developer Hub & Micro-SaaS',
      category: 'Developer Platform',
      badge: 'Planned',
      badgeClass: 'badge-upcoming',
      description: 'Niche micro-SaaS web portals focusing on cryptographic key management, developer API testing, and programmatic file transformation APIs.',
      features: [
        'RESTful file processing and URL management endpoints',
        'WebAssembly high-throughput compute engines',
        'Zero-trust security and data privacy guarantees'
      ],
      actionText: 'Platform Architecture in Progress'
    }
  ];

  public scrollToSection(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
