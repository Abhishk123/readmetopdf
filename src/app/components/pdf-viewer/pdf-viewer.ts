import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfStateService } from '../../services/pdf-state.service';
import { PdfConverterService } from '../../services/pdf-converter.service';
import { AdBannerComponent } from '../ads/ad-banner/ad-banner';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, AdBannerComponent],
  templateUrl: './pdf-viewer.html',
  styleUrl: './pdf-viewer.css'
})
export class PdfViewerComponent implements OnInit, OnDestroy {
  protected state = inject(PdfStateService);
  protected converter = inject(PdfConverterService);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  safePdfUrl: SafeResourceUrl | null = null;
  activeView: 'pdf' | 'document' = 'pdf';

  ngOnInit(): void {
    const result = this.state.convertedResult();
    if (result?.objectUrl) {
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(result.objectUrl);
    } else {
      // If no file converted yet, redirect to home after brief check
      // or show empty fallback state
    }
  }

  ngOnDestroy(): void {
    // Keep memory clean
  }

  downloadPdf(): void {
    this.converter.downloadCurrentPdf();
  }

  resetAll(): void {
    const confirmReset = confirm('Are you sure you want to reset and convert a new file?');
    if (confirmReset) {
      this.state.reset();
      this.router.navigate(['/']);
    }
  }

  closePdf(): void {
    this.router.navigate(['/']);
  }

  toggleView(view: 'pdf' | 'document'): void {
    this.activeView = view;
  }
}
