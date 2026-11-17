import {
  calculateLoanEmi,
  calculateExactAge,
  calculateGst,
  parseUpiCommand,
  buildUpiUri
} from './calculators';
import { askGeminiAi } from './gemini';

export const config = {
  runtime: 'edge',
};

declare const process: {
  env: Record<string, string | undefined>;
};

/**
 * PROJECT BLUEPRINT: All-in-One WhatsApp Utility Bot ("QuickTools")
 * Webhook Endpoint: https://www.jsnsworks.site/api/whatsapp
 * Powered by Meta WhatsApp Cloud API (Free for first 1,000 conversations/mo)
 * Shared Calculation Engine: api/calculators.ts
 */

interface WhatsAppWebhookBody {
  object?: string;
  entry?: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: { name: string };
          wa_id: string;
        }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: { body: string };
          image?: { id: string; mime_type: string; sha256: string };
          document?: { id: string; filename: string; mime_type: string };
          interactive?: {
            type: string;
            button_reply?: { id: string; title: string };
            list_reply?: { id: string; title: string; description?: string };
          };
        }>;
      };
      field: string;
    }>;
  }>;
}

export default async function handler(req: Request): Promise<Response> {
  const verifyToken = process.env['META_VERIFY_TOKEN'] || 'quicktools_verify_token_2026';

  // 1. Meta Webhook Verification Handshake (GET)
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('[WhatsApp Webhook] Handshake verified successfully.');
      return new Response(challenge || '', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // Direct browser check / health status
    if (!mode && !token) {
      return Response.json({
        status: 'online',
        service: 'JSANS QuickTools WhatsApp Bot Webhook',
        version: '1.0.0',
        message: 'Endpoint is active and ready for Meta Webhook verification.'
      });
    }

    console.warn('[WhatsApp Webhook] Verification token mismatch.');
    return Response.json({ error: 'Verification failed' }, { status: 403 });
  }

  // 2. Incoming Messages & Events (POST)
  if (req.method === 'POST') {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return Response.json({ status: 'invalid_json' }, { status: 400 });
    }

    console.log('[WhatsApp Inbound Webhook Payload]:', JSON.stringify(body));

    if (body?.object && body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const messageData = body.entry[0].changes[0].value.messages[0];
      const from = messageData.from; // Sender WhatsApp phone number
      const phoneNumberId = body.entry[0].changes[0].value.metadata?.phone_number_id || process.env['WHATSAPP_PHONE_NUMBER_ID'];

      console.log('[WhatsApp Processing User Message]:', { from, phoneNumberId, type: messageData.type, body: messageData.text?.body });

      try {
        let replyText = '';

        // Handle text message or interactive button clicks
        if (messageData.type === 'text' && messageData.text?.body) {
          const rawInput = messageData.text.body.trim();
          const upperInput = rawInput.toUpperCase();

          // If greeting, send clean numbered menu with interactive buttons
          if (['HI', 'HELLO', 'START', 'MENU', 'HELP', 'TOOLS'].includes(upperInput)) {
            if (phoneNumberId) {
              await sendWhatsAppButtons(
                phoneNumberId,
                from,
                '👋 Welcome to QuickTools!',
                `Reply with a *number (1 - 6)* or tap an option below:

1️⃣ *Loan EMI Calculator*
2️⃣ *Exact Age & Birthday*
3️⃣ *UPI Payment QR Code*
4️⃣ *GST Tax Calculator*
5️⃣ *Safe-KYC Document Watermark*
6️⃣ *Photo Size Reducer (20KB / 50KB)*

💬 _Or ask me any question in plain words!_`,
                [
                  { id: '1', title: '📊 Loan EMI' },
                  { id: '2', title: '🎂 Exact Age' },
                  { id: '5', title: '🛡️ Safe KYC' }
                ]
              );
              return Response.json({ status: 'ok' });
            }
          }

          replyText = await processUserCommand(rawInput);
        } else if (messageData.type === 'interactive') {
          const buttonId = messageData.interactive?.button_reply?.id || messageData.interactive?.list_reply?.id || '';
          replyText = await processUserCommand(buttonId);
        } else if (messageData.type === 'image') {
          // Send interactive action buttons directly on the user's WhatsApp screen!
          if (phoneNumberId) {
            await sendWhatsAppButtons(
              phoneNumberId,
              from,
              '📸 Photo Received!',
              'What would you like to do with this image? Choose an action below:',
              [
                { id: '5', title: '🛡️ Safe-KYC Mask' },
                { id: '6', title: '🗜️ Compress to 20KB' },
                { id: 'ACTION_CONVERT_PDF', title: '📄 Convert to PDF' }
              ]
            );
            return Response.json({ status: 'ok' });
          }
        } else if (messageData.type === 'document') {
          replyText = `📄 *Document Received!*
━━━━━━━━━━━━━━━━━━━━
Merge, extract, or sign PDF documents securely in browser memory:
👉 https://www.jsnsworks.site/tools/pdf-merger

_Or type *MENU* to see all AI & utility tools!_`;
        } else {
          replyText = `👋 Hello! Welcome to *QuickTools AI* by JSANS DevStudio.
Reply *MENU* to see all instant commands, or just ask me any question naturally!`;
        }

        if (replyText && phoneNumberId) {
          console.log('[WhatsApp Dispatching Outbound Reply]:', { to: from, replySnippet: replyText.slice(0, 60) });
          await sendWhatsAppMessage(phoneNumberId, from, replyText);
        } else {
          console.warn('[WhatsApp Missing Reply or PhoneID]:', { hasReply: !!replyText, phoneNumberId });
        }
      } catch (err) {
        console.error('[WhatsApp Webhook] Error processing message:', err);
      }

      return Response.json({ status: 'ok' });
    }

    console.log('[WhatsApp Non-Message Event (status/delivery)]: Ignored');
    return Response.json({ status: 'ignored' });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

/**
 * Command processor - Uses calculation engine & Google Gemini AI
 */
async function processUserCommand(rawText: string): Promise<string> {
  const text = rawText.trim();
  const upper = text.toUpperCase();

  // 0. Main Menu
  if (['HELP', 'MENU', 'HI', 'HELLO', 'START', 'TOOLS'].includes(upper)) {
    return `👋 *Welcome to QuickTools!*
Reply with a *number (1 - 6)*:

1️⃣ *Loan EMI Calculator*
2️⃣ *Exact Age & Birthday*
3️⃣ *UPI Payment QR Code*
4️⃣ *GST Tax Calculator*
5️⃣ *Safe-KYC Document Watermark*
6️⃣ *Photo Size Reducer (20KB / 50KB)*

💬 _Or ask me any question in plain words!_`;
  }

  // --- TOOL 1: LOAN EMI CALCULATOR ---
  if (upper === '1' || upper === 'LOAN' || upper === 'EMI') {
    return `📊 *Loan EMI Calculator*
━━━━━━━━━━━━━━━━━━━━
Reply with a preset letter or type your own values:

• Reply *1A* ➔ Home Loan: ₹25L, 8.5%, 15 Yrs
• Reply *1B* ➔ Car Loan: ₹8L, 9.0%, 5 Yrs
• Reply *1C* ➔ Personal Loan: ₹3L, 12.0%, 3 Yrs

✏️ *Or enter custom values:*
\`EMI [Amount] [Rate%] [Years]\`
_Example:_ \`EMI 1000000 8.5 7\``;
  }

  // Presets for 1A, 1B, 1C
  if (upper === '1A') {
    const res = calculateLoanEmi(2500000, 8.5, 15);
    return formatEmiResult(2500000, 8.5, 15, res, 'Home Loan Preset');
  }
  if (upper === '1B') {
    const res = calculateLoanEmi(800000, 9.0, 5);
    return formatEmiResult(800000, 9.0, 5, res, 'Car Loan Preset');
  }
  if (upper === '1C') {
    const res = calculateLoanEmi(300000, 12.0, 3);
    return formatEmiResult(300000, 12.0, 3, res, 'Personal Loan Preset');
  }

  // Custom EMI format: EMI 500000 8.5 5
  if (upper.startsWith('EMI') && text.split(/\s+/).length >= 4) {
    const parts = text.split(/\s+/).slice(1);
    const p = parseFloat(parts[0].replace(/,/g, ''));
    const rAnnual = parseFloat(parts[1].replace(/%/g, ''));
    const years = parseFloat(parts[2]);

    if (!isNaN(p) && !isNaN(rAnnual) && !isNaN(years) && p > 0 && rAnnual >= 0 && years > 0) {
      const emiRes = calculateLoanEmi(p, rAnnual, years);
      return formatEmiResult(p, rAnnual, years, emiRes, 'Custom Loan Calculation');
    }
  }

  // --- TOOL 2: AGE CALCULATOR ---
  if (upper === '2' || upper === 'AGE') {
    return `🎂 *Exact Age Calculator*
━━━━━━━━━━━━━━━━━━━━
Enter your birth date in this format:
👉 \`AGE DD-MM-YYYY\`

_Example:_ \`AGE 15-08-1998\`
_Or say naturally:_ *"I was born on 15 August 1998"*`;
  }

  // Custom Age format: AGE 15-08-1998
  if (upper.startsWith('AGE') && text.split(/\s+/).length === 2) {
    const rawDate = text.replace(/^AGE\s*/i, '').trim();
    const ageRes = calculateExactAge(rawDate);
    if (ageRes) {
      return `🎂 *Age & Date Milestone*
━━━━━━━━━━━━━━━━━━━━
• *Exact Age:* *${ageRes.formattedString}*
• *Total Days Lived:* ${ageRes.totalDays.toLocaleString('en-IN')} days
• *Total Weeks:* ${ageRes.totalWeeks.toLocaleString('en-IN')} weeks
• *Next Birthday:* In *${ageRes.daysUntilNextBirthday} days* 🎈

🌐 _Full breakdown: https://www.jsnsworks.site/tools/age-calculator_`;
    }
  }

  // --- TOOL 3: UPI QR GENERATOR ---
  if (upper === '3' || upper === 'UPI' || upper === 'QR') {
    return `💸 *Instant UPI Payment QR Code*
━━━━━━━━━━━━━━━━━━━━
Generate a scannable QR code for GPay / PhonePe / Paytm:

✏️ *Reply in this format:*
\`UPI [yourVPA] [Amount]\`

_Example:_ \`UPI rahul@okhdfcbank 500\``;
  }

  if (upper.startsWith('UPI')) {
    const upiConfig = parseUpiCommand(text);
    if (upiConfig) {
      const upiUri = buildUpiUri(upiConfig);
      const encoded = encodeURIComponent(upiUri);
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=${encoded}&format=png`;

      const amtText = upiConfig.amount ? `₹${upiConfig.amount.toLocaleString('en-IN')}` : 'Any Amount';
      return `💸 *Instant UPI Payment QR Generated!*
━━━━━━━━━━━━━━━━━━━━
• *Payee VPA:* \`${upiConfig.vpa}\`
• *Amount:* *${amtText}*
${upiConfig.transactionNote ? `• *Note:* ${upiConfig.transactionNote}\n` : ''}
📲 *Download & Scan with GPay / PhonePe / Paytm:*
${qrImageUrl}

_Scan from any Indian UPI app to pay directly._`;
    }
  }

  // --- TOOL 4: GST TAX CALCULATOR ---
  if (upper === '4' || upper === 'GST') {
    return `🧾 *GST Tax Calculator*
━━━━━━━━━━━━━━━━━━━━
Reply with a preset rate or custom amount:

• Reply *4A* ➔ 18% GST on ₹1,000
• Reply *4B* ➔ 18% GST on ₹5,000
• Reply *4C* ➔ 12% GST on ₹2,500

✏️ *Or custom amount:*
\`GST [Amount] [Rate%]\`
_Example:_ \`GST 1500 18\``;
  }

  if (upper === '4A') return formatGstResult(1000, 18, calculateGst(1000, 18));
  if (upper === '4B') return formatGstResult(5000, 18, calculateGst(5000, 18));
  if (upper === '4C') return formatGstResult(2500, 12, calculateGst(2500, 12));

  if (upper.startsWith('GST') && text.split(/\s+/).length >= 3) {
    const parts = text.split(/\s+/).slice(1);
    const amount = parseFloat(parts[0].replace(/,/g, ''));
    const rate = parseFloat(parts[1].replace(/%/g, ''));

    if (!isNaN(amount) && !isNaN(rate) && amount > 0 && rate >= 0) {
      return formatGstResult(amount, rate, calculateGst(amount, rate));
    }
  }

  // --- TOOL 5: SAFE-KYC WATERMARKER ---
  if (upper === '5' || upper === 'WATERMARK' || upper === 'ACTION_WATERMARK') {
    return `🛡️ *Safe-KYC Document Watermarker*
━━━━━━━━━━━━━━━━━━━━
Prevent identity fraud on your Aadhaar, PAN & Voter ID cards!

1️⃣ *Open 1-Click Browser Studio:*
👉 https://www.jsnsworks.site/tools/watermark
_Pick quick presets (Hotel Check-In, SIM activation, Bank KYC) and download protected image in 1 click (100% Private, zero upload)._

2️⃣ *Or Watermark on WhatsApp:*
Send any ID photo here with caption:
\`WATERMARK ONLY FOR HOTEL CHECK-IN\` or
\`WATERMARK ONLY FOR AIRTEL SIM\``;
  }

  // --- TOOL 6: PHOTO SIZE REDUCER (20KB / 50KB) ---
  if (upper === '6' || upper === 'COMPRESS' || upper === 'ACTION_COMPRESS_20KB') {
    return `🗜️ *Photo Size Reducer (20KB / 50KB)*
━━━━━━━━━━━━━━━━━━━━
Compress photos & signatures for SSC, UPSC, and State Govt applications:
👉 https://www.jsnsworks.site/tools/image-converter

_Simply select 'Compress to Target Size: 20 KB' and download your verified photo instantly!_`;
  }

  if (upper === 'ACTION_CONVERT_PDF' || upper.includes('CONVERT PDF')) {
    return `📄 *Convert Photo to PDF Document*
━━━━━━━━━━━━━━━━━━━━
Convert single or multiple images to a clean, crisp PDF:
👉 https://www.jsnsworks.site/tools/pdf-merger

_Fast, high-resolution, and completely free in your browser!_`;
  }

  // 8. Natural Language & AI Queries powered by Google Gemini AI
  console.log('[Routing to Gemini AI]:', text);
  return await askGeminiAi(text);
}

function formatEmiResult(p: number, rAnnual: number, years: number, emiRes: any, title: string): string {
  const fmt = (val: number) => '₹' + Math.round(val).toLocaleString('en-IN');
  return `📊 *${title}*
━━━━━━━━━━━━━━━━━━━━
• *Principal Amount:* ${fmt(p)}
• *Interest Rate:* ${rAnnual}% p.a.
• *Tenure:* ${years} Years (${Math.round(years * 12)} Months)

💰 *Monthly EMI:* *${fmt(emiRes.monthlyEmi)}*
📈 *Total Interest:* ${fmt(emiRes.totalInterest)} (${emiRes.interestPercent}%)
💳 *Total Payment:* ${fmt(emiRes.totalPayment)}

🌐 _Visual sliders & tools: https://www.jsnsworks.site/tools/finance-calculator_`;
}

function formatGstResult(amount: number, rate: number, gstRes: any): string {
  const fmt = (v: number) => '₹' + v.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  return `🧾 *GST Tax Breakdown*
━━━━━━━━━━━━━━━━━━━━
• *Net Amount:* ${fmt(gstRes.netAmount)}
• *GST Rate:* ${rate}%
• *CGST (${rate / 2}%):* ${fmt(gstRes.cgst)}
• *SGST (${rate / 2}%):* ${fmt(gstRes.sgst)}
• *Total GST Tax:* ${fmt(gstRes.gstAmount)}

💵 *Total Invoice Amount:* *${fmt(gstRes.totalAmount)}*`;
}

/**
 * Dispatch outbound reply using Meta Graph API
 */
async function sendWhatsAppMessage(phoneNumberId: string, to: string, text: string): Promise<void> {
  const token = process.env['WHATSAPP_ACCESS_TOKEN'];
  if (!token) {
    console.error('[WhatsApp Config Error]: WHATSAPP_ACCESS_TOKEN is missing or undefined in environment variables.');
    return;
  }

  const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: to,
    type: 'text',
    text: { preview_url: true, body: text }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const resText = await response.text();
    if (!response.ok) {
      console.error('[WhatsApp Graph API Error Response]:', { status: response.status, error: resText });
    } else {
      console.log('[WhatsApp Graph API Success Response]:', { status: response.status, body: resText });
    }
  } catch (e) {
    console.error('[WhatsApp Network/Fetch Exception]:', e);
  }
}

interface WhatsAppButton {
  id: string;
  title: string;
}

/**
 * Send interactive quick-reply buttons (up to 3 clickable buttons on user's screen)
 */
async function sendWhatsAppButtons(
  phoneNumberId: string,
  to: string,
  headerText: string,
  bodyText: string,
  buttons: WhatsAppButton[]
): Promise<void> {
  const token = process.env['WHATSAPP_ACCESS_TOKEN'];
  if (!token) return;

  const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: to,
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: headerText
      },
      body: {
        text: bodyText
      },
      action: {
        buttons: buttons.slice(0, 3).map(btn => ({
          type: 'reply',
          reply: {
            id: btn.id,
            title: btn.title.slice(0, 20)
          }
        }))
      }
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const resText = await response.text();
    console.log('[WhatsApp Interactive Buttons Result]:', { status: response.status, body: resText });
  } catch (e) {
    console.error('[WhatsApp Interactive Buttons Exception]:', e);
  }
}
