/**
 * Google AdSense Configuration
 * 
 * Configured with official Publisher ID: ca-pub-3070668874339661
 */
export interface AdsConfiguration {
  enabled: boolean;
  testMode: boolean;
  client: string;
  testClient: string;
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
  // Live Google AdSense Serving Enabled
  enabled: true,

  // Set to false for live commercial ads
  testMode: false,

  // Official Publisher ID
  client: 'ca-pub-1326483461218935',

  testClient: 'ca-pub-3940256099942544',

  // Ad Unit Slot IDs
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
