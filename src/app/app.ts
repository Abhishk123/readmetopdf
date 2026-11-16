import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { TOOLS_CONFIG } from './config/tools.config';
import { AnalyticsService } from './services/analytics.service';
import { LanguageSelectorComponent } from './components/language-selector/language-selector';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LanguageSelectorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);
  private analytics = inject(AnalyticsService);
  public readonly toolsList = signal(TOOLS_CONFIG);
  public mobileMenuOpen = signal<boolean>(false);
  public productsDropdownOpen = signal<boolean>(false);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.mobileMenuOpen.set(false);
      this.productsDropdownOpen.set(false);
    });
  }

  public toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  public closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  public toggleProductsDropdown(event: Event): void {
    event.stopPropagation();
    this.productsDropdownOpen.update(v => !v);
  }

  public closeProductsDropdown(): void {
    this.productsDropdownOpen.set(false);
  }
}
