import { EnvironmentConfig } from './environment.model';

export const environment: EnvironmentConfig = {
  production: true,
  siteUrl: 'https://www.jsnsworks.site',
  siteName: 'JSANS DevStudio',
  contactEmail: 'jsansdevstudio@gmail.com',

  ads: {
    enabled: false,
    defaultProvider: 'custom',
    adsense: {
      client: '',
      testMode: false,
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
      altText: '',
      tagline: '',
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
