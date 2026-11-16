export const config = {
  runtime: 'edge',
};

declare const process: {
  env: Record<string, string | undefined>;
};

export default async function handler(req: Request): Promise<Response> {
  const token = process.env['WHATSAPP_ACCESS_TOKEN'];
  const wabaId = '1028424153663089'; // Your Messaging Account ID

  if (!token) {
    return Response.json({
      error: 'WHATSAPP_ACCESS_TOKEN environment variable is missing in Vercel.'
    }, { status: 400 });
  }

  try {
    const url = `https://graph.facebook.com/v21.0/${wabaId}/subscribed_apps`;
    const metaResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await metaResponse.json();
    return Response.json({
      message: 'Subscribed WABA to Webhooks',
      metaResponse: result
    }, { status: metaResponse.ok ? 200 : 400 });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
