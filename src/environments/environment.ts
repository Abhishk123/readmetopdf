import { EnvironmentConfig } from './environment.model';

export const environment: EnvironmentConfig = {
  production: false,
  siteUrl: 'http://localhost:4200',
  siteName: 'JSANS DevStudio',
  contactEmail: 'jsansdevstudio@gmail.com',

  ads: {
    enabled: false,
    defaultProvider: 'custom',
    adsense: {
      client: '',
      testMode: true,
      slots: {
        topBanner: '',
        homeSidebar: '',
        midContent: '',
        bottomBanner: '',
        viewerSidebar: '',
        toolHeaderBanner: '',
        sidebarLeft: '',
        sidebarRight: '',
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
