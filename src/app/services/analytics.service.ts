import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';

declare const gtag: Function | undefined;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private router = inject(Router);

  constructor() {
    this.initRouteTracking();
  }

  private initRouteTracking(): void {
    if (!environment.analytics?.googleAnalyticsId) return;

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.trackPageView(event.urlAfterRedirects);
    });
  }

  public trackPageView(url: string, title?: string): void {
    if (typeof gtag === 'function' && environment.analytics?.googleAnalyticsId) {
      gtag('event', 'page_view', {
        page_path: url,
        page_title: title || (typeof document !== 'undefined' ? document.title : ''),
        page_location: typeof window !== 'undefined' ? window.location.href : ''
      });
    }
  }

  public trackEvent(eventName: string, params: Record<string, any> = {}): void {
    if (typeof gtag === 'function' && environment.analytics?.googleAnalyticsId) {
      gtag('event', eventName, params);
    }
  }
}
