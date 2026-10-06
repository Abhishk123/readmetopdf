import { EnvironmentConfig } from './environment.model';

/**
 * Production Environment Configuration (Confidential Values)
 * Contains the official publisher IDs and live credentials.
 */
export const environment: EnvironmentConfig = {
  production: true,
  siteUrl: 'https://www.jsnsworks.site',
  siteName: 'jsnsworks',
  contactEmail: 'support@jsnsworks.site',

  ads: {
    enabled: true,
    defaultProvider: 'adsense',
    adsense: {
      client: 'ca-pub-1326483461218935',
      testMode: false,
      slots: {
        topBanner: '1000000001',
        homeSidebar: '2000000002',
        midContent: '3000000003',
        bottomBanner: '4000000004',
        viewerSidebar: '5000000005',
        toolHeaderBanner: '6000000006'
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
