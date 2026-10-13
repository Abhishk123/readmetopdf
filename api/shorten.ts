import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'edge',
};

function generateShortCode(length = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default async function handler(req: Request) {
  const connectionString =
    process.env['POSTGRES_URL'] ||
    process.env['DATABASE_URL'] ||
    process.env['NEON_DATABASE_URL'];

  if (!connectionString) {
    return new Response(
      JSON.stringify({ error: 'Database connection string not configured.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const sql = neon(connectionString);

  // Auto-create table if it does not exist
  await sql`
    CREATE TABLE IF NOT EXISTS short_urls (
      code VARCHAR(12) PRIMARY KEY,
      url TEXT NOT NULL,
      clicks INT DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const urlObj = new URL(req.url);

  // POST: Create a new short link
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const rawUrl = body?.url?.trim();

      if (!rawUrl || (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://'))) {
        return new Response(
          JSON.stringify({ error: 'Valid URL starting with http:// or https:// is required.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Check if URL was already shortened
      const existing = await sql`
        SELECT code FROM short_urls WHERE url = ${rawUrl} LIMIT 1;
      `;
      if (existing.length > 0) {
        return new Response(
          JSON.stringify({ code: existing[0]['code'] }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Create new unique code (5 characters)
      let code = generateShortCode(5);
      await sql`
        INSERT INTO short_urls (code, url) VALUES (${code}, ${rawUrl});
      `;

      return new Response(
        JSON.stringify({ code }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: err?.message || 'Server error creating short link.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // GET: Resolve a short code (e.g. /api/shorten?code=k9x2p)
  if (req.method === 'GET') {
    const code = urlObj.searchParams.get('code')?.trim();
    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Code parameter is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      const rows = await sql`
        SELECT url FROM short_urls WHERE code = ${code} LIMIT 1;
      `;

      if (rows.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Short link not found.' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Increment click counter asynchronously
      sql`UPDATE short_urls SET clicks = clicks + 1 WHERE code = ${code};`.catch(() => {});

      return new Response(
        JSON.stringify({ url: rows[0]['url'] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: err?.message || 'Database lookup error.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
}
