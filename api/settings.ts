import type { VercelRequest, VercelResponse } from '@vercel/node';

declare const process: {
  env: Record<string, string | undefined>;
};

/**
 * JSANS DevStudio - Global Settings & Feature Flags API
 * Controls site-wide settings (Ads, Bot, Tool visibility) for ALL users.
 * 
 * Supports Upstash Redis / Vercel KV / DB via .env without code modifications.
 */

export interface AdFormatsConfig {
  leaderboard: boolean; // 728x90
  rectangle: boolean;   // 300x250
  inPagePush: boolean;  // Monetag IPP
}

export interface SiteSettings {
  adsEnabled: boolean;
  adProvider: 'custom' | 'adsense' | 'monetag' | 'disabled';
  adFormats: AdFormatsConfig;
  showWhatsAppBot: boolean;
  showUpcomingProjects: boolean;
  hiddenTools: string[];
  lastUpdated: number;
}

// Global in-memory cache across serverless warm invocations
let cachedSettings: SiteSettings = {
  adsEnabled: process.env['ADS_ENABLED'] !== 'false',
  adProvider: (process.env['AD_PROVIDER'] as any) || 'custom',
  adFormats: {
    leaderboard: true,
    rectangle: true,
    inPagePush: true
  },
  showWhatsAppBot: process.env['SHOW_WHATSAPP_BOT'] !== 'false',
  showUpcomingProjects: process.env['SHOW_UPCOMING_PROJECTS'] !== 'false',
  hiddenTools: [],
  lastUpdated: Date.now()
};

async function getSettingsFromStorage(): Promise<SiteSettings> {
  const kvUrl = process.env['UPSTASH_REDIS_REST_URL'] || process.env['KV_REST_API_URL'];
  const kvToken = process.env['UPSTASH_REDIS_REST_TOKEN'] || process.env['KV_REST_API_TOKEN'];

  if (kvUrl && kvToken) {
    try {
      const res = await fetch(`${kvUrl}/get/jsans_site_settings`, {
        headers: { Authorization: `Bearer ${kvToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.result) {
          const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
          cachedSettings = { ...cachedSettings, ...parsed };
        }
      }
    } catch (e) {
      console.warn('[Settings API] KV fetch failed, using cached/env settings', e);
    }
  }

  return cachedSettings;
}

async function saveSettingsToStorage(settings: SiteSettings): Promise<void> {
  cachedSettings = { ...settings, lastUpdated: Date.now() };

  const kvUrl = process.env['UPSTASH_REDIS_REST_URL'] || process.env['KV_REST_API_URL'];
  const kvToken = process.env['UPSTASH_REDIS_REST_TOKEN'] || process.env['KV_REST_API_TOKEN'];

  if (kvUrl && kvToken) {
    try {
      await fetch(`${kvUrl}/set/jsans_site_settings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kvToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(JSON.stringify(cachedSettings))
      });
    } catch (e) {
      console.warn('[Settings API] KV save failed, saved in-memory', e);
    }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET /api/settings - Fetch global settings for all users
  if (req.method === 'GET') {
    const settings = await getSettingsFromStorage();
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    return res.status(200).json({
      success: true,
      settings: {
        adsEnabled: settings.adsEnabled,
        adProvider: settings.adProvider,
        adFormats: settings.adFormats,
        showWhatsAppBot: settings.showWhatsAppBot,
        showUpcomingProjects: settings.showUpcomingProjects,
        hiddenTools: settings.hiddenTools,
        siteName: process.env['SITE_NAME'] || 'JSANS DevStudio',
        contactEmail: process.env['CONTACT_EMAIL'] || 'jsansdevstudio@gmail.com',
        dbConnected: !!(process.env['UPSTASH_REDIS_REST_URL'] || process.env['DATABASE_URL'])
      }
    });
  }

  // 2. POST /api/settings - Update global settings (Admin only)
  if (req.method === 'POST') {
    const authHeader = req.headers['authorization'];
    const adminPass = process.env['ADMIN_PASSWORD'] || 'jsansadmin2026';
    const adminKey = process.env['ADMIN_SECRET_KEY'] || 'jsans_devstudio_super_secret_jwt_key_2026';

    const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : '';

    if (!token || (token !== adminPass && token !== adminKey)) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid admin credentials.' });
    }

    const body = req.body || {};
    const current = await getSettingsFromStorage();

    const updated: SiteSettings = {
      adsEnabled: typeof body.adsEnabled === 'boolean' ? body.adsEnabled : current.adsEnabled,
      adProvider: body.adProvider || current.adProvider,
      adFormats: body.adFormats ? { ...current.adFormats, ...body.adFormats } : current.adFormats,
      showWhatsAppBot: typeof body.showWhatsAppBot === 'boolean' ? body.showWhatsAppBot : current.showWhatsAppBot,
      showUpcomingProjects: typeof body.showUpcomingProjects === 'boolean' ? body.showUpcomingProjects : current.showUpcomingProjects,
      hiddenTools: Array.isArray(body.hiddenTools) ? body.hiddenTools : current.hiddenTools,
      lastUpdated: Date.now()
    };

    await saveSettingsToStorage(updated);

    return res.status(200).json({
      success: true,
      message: 'Global settings updated successfully for all users.',
      settings: updated
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
