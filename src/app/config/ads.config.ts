import { environment } from '../../environments/environment';

export type AdProviderType = 'adsense' | 'carbon' | 'sponsor' | 'custom';

export interface AdsConfiguration {
  enabled: boolean;
  defaultProvider: AdProviderType;
  client: string;
  testMode: boolean;
  slots: Record<string, string>;
  carbon?: {
    enabled: boolean;
    serveCode: string;
    placementCode: string;
  };
  sponsor?: {
    enabled: boolean;
    imageUrl: string;
    targetUrl: string;
    altText: string;
    tagline: string;
  };
  custom?: {
    enabled: boolean;
    htmlSnippet?: string;
    horizontalSnippet?: string;
    rectangleSnippet?: string;
    skyscraperSnippet?: string;
  };
  policy: {
    showAdLabel: boolean;
    adLabelText: string;
  };
}

/**
 * Global Ads Configuration linked strictly to environment secrets with fallback to registered network IDs
 */
export const ADS_CONFIG: AdsConfiguration = {
  enabled: environment.ads.enabled,
  defaultProvider: environment.ads.defaultProvider,
  client: environment.ads.adsense.client || 'ca-pub-1326483461218935',
  testMode: environment.ads.adsense.testMode,
  slots: environment.ads.adsense.slots as Record<string, string>,
  carbon: environment.ads.carbon,
  sponsor: environment.ads.sponsor,
  custom: {
    enabled: true,
    horizontalSnippet: environment.ads.custom?.horizontalSnippet || `
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
    rectangleSnippet: environment.ads.custom?.rectangleSnippet || `
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
    `
  },
  policy: {
    showAdLabel: true,
    adLabelText: 'ADVERTISEMENT'
  }
};
