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
    defaultProvider: 'custom',
    adsense: {
      client: 'ca-pub-3940256099942544', // Google Official Test Client
      testMode: true,
      slots: {
        topBanner: 'test-slot-1',
        homeSidebar: 'test-slot-2',
        midContent: 'test-slot-3',
        bottomBanner: 'test-slot-4',
        viewerSidebar: 'test-slot-5',
        toolHeaderBanner: 'test-slot-6',
        sidebarLeft: 'test-slot-7',
        sidebarRight: 'test-slot-8'
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
      enabled: true,
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
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px;">
          <a href="https://uplcm.com/4/12216784" target="_blank" rel="noopener noreferrer sponsored" style="display:inline-block; background:linear-gradient(135deg, #4f46e5, #7c3aed); color:#ffffff; font-family:sans-serif; font-size:11px; font-weight:700; padding:6px 12px; border-radius:6px; text-decoration:none; text-align:center; box-shadow:0 2px 8px rgba(79,70,229,0.4);">
            Featured Partner &rarr;
          </a>
          <script type="text/javascript">
            atOptions = {
              'key' : 'f6ac1328ab2561c5740963f903492c2d',
              'format' : 'iframe',
              'height' : 300,
              'width' : 160,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://bauval.org/22/f6ac1328ab2561c5740963f903492c2d"></script>
          <a href="https://uplcm.com/4/12216785" target="_blank" rel="noopener noreferrer sponsored" style="font-family:sans-serif; font-size:10px; color:#a5b4fc; text-decoration:none; text-align:center;">
            Recommended Offers
          </a>
        </div>
      `
    }
  },

  analytics: {
    googleAnalyticsId: 'G-86VMEHML27'
  }
};
