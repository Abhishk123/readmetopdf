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
      horizontalSnippet: `
        <script type="text/javascript">
          atOptions = {
            'key' : 'd6a506bca45e9e2d16f0297c4f0ff849',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://bauval.org/22/d6a506bca45e9e2d16f0297c4f0ff849"></script>
      `,
      rectangleSnippet: `
        <script type="text/javascript">
          atOptions = {
            'key' : '4d8d0573b25bbd2f4bede8ef0c711b69',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://bauval.org/22/4d8d0573b25bbd2f4bede8ef0c711b69"></script>
      `,
      skyscraperSnippet: `
        <script type="text/javascript">
          atOptions = {
            'key' : 'f6ac1328ab2561c5740963f903492c2d',
            'format' : 'iframe',
            'height' : 600,
            'width' : 160,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://bauval.org/22/f6ac1328ab2561c5740963f903492c2d"></script>
      `,
    },
  },

  analytics: {
    googleAnalyticsId: '',
  },
};
