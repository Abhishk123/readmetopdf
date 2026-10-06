import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { TOOLS_CONFIG } from './config/tools.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);
  public readonly toolsList = signal(TOOLS_CONFIG);
  public mobileMenuOpen = signal<boolean>(false);
  public toolsDropdownOpen = signal<boolean>(false);

  constructor() {
    // Close mobile menu and dropdown on page navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.mobileMenuOpen.set(false);
      this.toolsDropdownOpen.set(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  public toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  public closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  public toggleToolsDropdown(event: Event): void {
    event.stopPropagation();
    this.toolsDropdownOpen.update(v => !v);
  }

  public closeToolsDropdown(): void {
    this.toolsDropdownOpen.set(false);
  }
}
