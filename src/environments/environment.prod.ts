import { EnvironmentConfig } from './environment.model';

/**
 * Production Environment Configuration (Confidential Values)
 * Configured strictly for Google AdSense compliance.
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
        toolHeaderBanner: '6000000006',
        sidebarLeft: '7000000007',
        sidebarRight: '8000000008',
      },
    },
    carbon: {
      enabled: false,
      serveCode: '',
      placementCode: '',
    },
    sponsor: {
      enabled: false,
      imageUrl: '',
      targetUrl: '',
      altText: 'Sponsored Partner',
      tagline: 'Recommended Developer Tool',
    },
    custom: {
      enabled: false,
      horizontalSnippet: '',
      rectangleSnippet: '',
      skyscraperSnippet: '',
    },
  },

  analytics: {
    googleAnalyticsId: 'G-86VMEHML27',
  },
};
