import { EnvironmentConfig } from './environment.model';

/**
 * Development Environment Configuration
 * Safe for local testing without triggering real ad impressions.
 */
export const environment: EnvironmentConfig = {
  production: false,
  siteUrl: 'http://localhost:4200',
  siteName: 'jsnsworks (Local)',
  contactEmail: 'support@jsnsworks.site',

  ads: {
    enabled: true,
    defaultProvider: 'adsense',
    adsense: {
      client: 'ca-pub-3940256099942544', // Google Official Test Client
      testMode: true,
      slots: {
        topBanner: 'test-slot-1',
        homeSidebar: 'test-slot-2',
        midContent: 'test-slot-3',
        bottomBanner: 'test-slot-4',
        viewerSidebar: 'test-slot-5',
        toolHeaderBanner: 'test-slot-6'
      }
    },
    carbon: {
      enabled: false,
      serveCode: '',
      placementCode: ''
    },
    sponsor: {
      enabled: false,
      imageUrl: '',
      targetUrl: '',
      altText: 'Sponsored Partner',
      tagline: 'Recommended Developer Tool'
    },
    custom: {
      enabled: false,
      htmlSnippet: ''
    }
  },

  analytics: {
    googleAnalyticsId: ''
  }
};
