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
    htmlSnippet: string;
  };
  policy: {
    showAdLabel: boolean;
    adLabelText: string;
  };
}

/**
 * Global Ads Configuration linked strictly to environment secrets
 */
export const ADS_CONFIG: AdsConfiguration = {
  enabled: environment.ads.enabled,
  defaultProvider: environment.ads.defaultProvider,
  client: environment.ads.adsense.client,
  testMode: environment.ads.adsense.testMode,
  slots: environment.ads.adsense.slots as Record<string, string>,
  carbon: environment.ads.carbon,
  sponsor: environment.ads.sponsor,
  custom: environment.ads.custom,
  policy: {
    showAdLabel: true,
    adLabelText: 'ADVERTISEMENT'
  }
};
