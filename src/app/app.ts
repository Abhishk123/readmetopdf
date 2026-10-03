import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);
  protected readonly title = signal('README to PDF Converter by jsnsworks');

  showPrivacyModal = false;
  showTermsModal = false;
  showContactModal = false;

  navigateToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    if (this.router.url.includes('/viewer')) {
      this.router.navigate(['/'], { fragment: sectionId });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        this.router.navigate(['/'], { fragment: sectionId });
      }
    }
  }

  openPrivacyModal(event: Event): void {
    event.preventDefault();
    this.showPrivacyModal = true;
  }

  closePrivacyModal(): void {
    this.showPrivacyModal = false;
  }

  openTermsModal(event: Event): void {
    event.preventDefault();
    this.showTermsModal = true;
  }

  closeTermsModal(): void {
    this.showTermsModal = false;
  }

  openContactModal(event: Event): void {
    event.preventDefault();
    this.showContactModal = true;
  }

  closeContactModal(): void {
    this.showContactModal = false;
  }
}
