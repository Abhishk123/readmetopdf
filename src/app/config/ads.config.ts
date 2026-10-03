/**
 * Google AdSense Configuration
 * 
 * Instructions:
 * - testMode: Set to 'true' to safely test Google ads with 'data-adtest="on"'
 * - client: Your real Google AdSense Publisher ID (e.g., 'ca-pub-1234567890123456')
 * - slots: Numeric slot IDs generated in your AdSense dashboard
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
  // Turn ON ads
  enabled: true,

  // Set to 'true' to request official Google test ads (data-adtest="on")
  // Set to 'false' in production when your site is approved for live commercial ads
  testMode: true,

  // Replace with your real AdSense Publisher ID when you have it
  client: 'ca-pub-XXXXXXXXXXXXXXXX',

  // Google's official universal test publisher ID
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
