/**
 * Advertising Configuration
 * 
 * Instructions:
 * 1. Set 'enabled: true' when your ad network is active.
 * 2. Set 'client' to your publisher ID.
 * 3. Set slot IDs for each ad placement.
 */
export interface AdsConfiguration {
  enabled: boolean;
  client: string;
  slots: {
    topBanner: string;
    homeSidebar: string;
    midBanner: string;
    bottomBanner: string;
    viewerSidebar: string;
    viewerBottomBanner: string;
  };
  policy: {
    showAdLabel: boolean;
    adLabelText: string;
  };
}

export const ADS_CONFIG: AdsConfiguration = {
  // Set to true when publishing live with active ad network
  enabled: false,

  // Publisher ID
  client: 'ca-pub-XXXXXXXXXXXXXXXX',

  // Numeric Ad Unit Slot IDs
  slots: {
    topBanner: '1000000001',
    homeSidebar: '2000000002',
    midBanner: '3000000003',
    bottomBanner: '4000000004',
    viewerSidebar: '5000000005',
    viewerBottomBanner: '6000000006'
  },

  policy: {
    showAdLabel: true,
    adLabelText: 'ADVERTISEMENT'
  }
};
