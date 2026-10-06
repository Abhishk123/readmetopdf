/**
 * Strict Environment & Secrets Interface
 * All values are strongly typed and readonly to prevent unintended mutations.
 */
export interface EnvironmentConfig {
  readonly production: boolean;
  readonly siteUrl: string;
  readonly siteName: string;
  readonly contactEmail: string;

  // Confidential Ad Network Credentials
  readonly ads: {
    readonly enabled: boolean;
    readonly defaultProvider: 'adsense' | 'carbon' | 'sponsor' | 'custom';
    readonly adsense: {
      readonly client: string; // e.g. ca-pub-3070668874339661
      readonly testMode: boolean;
      readonly slots: {
        readonly topBanner: string;
        readonly homeSidebar: string;
        readonly midContent: string;
        readonly bottomBanner: string;
        readonly viewerSidebar: string;
        readonly toolHeaderBanner: string;
      };
    };
    readonly carbon?: {
      readonly enabled: boolean;
      readonly serveCode: string;
      readonly placementCode: string;
    };
    readonly sponsor?: {
      readonly enabled: boolean;
      readonly imageUrl: string;
      readonly targetUrl: string;
      readonly altText: string;
      readonly tagline: string;
    };
    readonly custom?: {
      readonly enabled: boolean;
      readonly htmlSnippet: string;
    };
  };

  // Optional Analytics & Tracking
  readonly analytics?: {
    readonly googleAnalyticsId?: string;
  };
}
