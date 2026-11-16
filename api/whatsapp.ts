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
          replyText = await processUserCommand(messageData.text.body.trim());
        } else if (messageData.type === 'interactive') {
          const buttonId = messageData.interactive?.button_reply?.id || messageData.interactive?.list_reply?.id || '';
          replyText = await processUserCommand(buttonId);
        } else if (messageData.type === 'image') {
          replyText = `📸 *Document / Photo Received!*
━━━━━━━━━━━━━━━━━━━━
Protect & prepare your ID photo right now:

🛡️ *1. Safe-KYC Tamper-Proof Watermark*
Prevent fraud on your Aadhaar, PAN & Voter ID cards!
👉 Stamp watermark in 1 click (runs locally on your device):
https://www.jsnsworks.site/tools/aadhaar-masker

🗜️ *2. Government & Exam Size Reducer*
Reduce signatures & photos to exact 20KB / 50KB:
👉 https://www.jsnsworks.site/tools/image-converter

📄 *3. Convert to PDF Document*
👉 https://www.jsnsworks.site/tools/pdf-merger

💡 *Quick Tip:* You can also reply directly with:
\`WATERMARK ONLY FOR HOTEL CHECK-IN\` or \`WATERMARK ONLY FOR AIRTEL SIM\``;
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

  // 1. Sleek Modern AI Menu
  if (upper === 'HELP' || upper === 'MENU' || upper === 'HI' || upper === 'HELLO' || upper === 'START') {
    return `✨ *JSANS QuickTools AI* ✨
_Your Smart Utilities & AI Assistant on WhatsApp_
━━━━━━━━━━━━━━━━━━━━

💬 *You can ask me ANYTHING naturally:*
• *"Calculate EMI for 20 lakh home loan for 15 yrs at 8.5%"*
• *"Mera age calculate karo - 15 August 1998"*
• *"Create UPI QR for rahul@okhdfcbank 500"*
• *"Calculate 18% GST on 2,500"*
• *"Write a sick leave letter for 2 days"*
• *"Tell me a joke / explain quantum physics"*

🛠️ *Quick Shortcuts:*
💳 *Loan EMI:* \`EMI 500000 8.5 5\`
🎂 *Exact Age:* \`AGE 15-08-1998\`
🧾 *GST Tax:* \`GST 1250 18\`
💸 *UPI QR:* \`UPI payee@bank 500\`
🛡️ *Safe KYC:* Send any photo to watermark

🌐 *Explore 16+ Web Tools (Free & Private):*
👉 https://www.jsnsworks.site/tools

_Just reply in your own words — I understand English, Hindi, Telugu, and more!_`;
  }

  // 2. Exact Loan EMI Shortcut
  if (upper.startsWith('EMI') && text.split(/\s+/).length >= 4) {
    const parts = text.split(/\s+/).slice(1);
    const p = parseFloat(parts[0].replace(/,/g, ''));
    const rAnnual = parseFloat(parts[1].replace(/%/g, ''));
    const years = parseFloat(parts[2]);

    if (!isNaN(p) && !isNaN(rAnnual) && !isNaN(years) && p > 0 && rAnnual >= 0 && years > 0) {
      const emiRes = calculateLoanEmi(p, rAnnual, years);
      const fmt = (val: number) => '₹' + Math.round(val).toLocaleString('en-IN');

      return `📊 *Loan EMI Calculation Results*
━━━━━━━━━━━━━━━━━━━━
• *Principal Amount:* ${fmt(p)}
• *Interest Rate:* ${rAnnual}% p.a.
• *Tenure:* ${years} Years (${Math.round(years * 12)} Months)

💰 *Monthly EMI:* *${fmt(emiRes.monthlyEmi)}*
📈 *Total Interest:* ${fmt(emiRes.totalInterest)} (${emiRes.interestPercent}%)
💳 *Total Payment:* ${fmt(emiRes.totalPayment)}

🌐 _Visual sliders & FD/RD tools: https://www.jsnsworks.site/tools/finance-calculator_`;
    }
  }

  // 3. Exact UPI Payment QR Code Generator
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

  // 4. Exact Age Calculator Shortcut
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

  // 5. Exact GST Calculator Shortcut
  if (upper.startsWith('GST') && text.split(/\s+/).length >= 3) {
    const parts = text.split(/\s+/).slice(1);
    const amount = parseFloat(parts[0].replace(/,/g, ''));
    const rate = parseFloat(parts[1].replace(/%/g, ''));

    if (!isNaN(amount) && !isNaN(rate) && amount > 0 && rate >= 0) {
      const gstRes = calculateGst(amount, rate);
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
  }

  // 6. Safe-KYC Watermark Instruction / Echo
  if (upper.startsWith('WATERMARK')) {
    const purpose = text.replace(/^WATERMARK\s*/i, '').trim() || 'FOR VERIFICATION ONLY';
    return `🛡️ *Safe-KYC Watermarker*
━━━━━━━━━━━━━━━━━━━━
Your watermark purpose is set to:
👉 "*${purpose.toUpperCase()}*"

Protect your ID cards against unauthorized loans or SIM fraud right now:
👉 Stamp on device (100% Private, zero upload):
https://www.jsnsworks.site/tools/aadhaar-masker`;
  }

  // 7. QR Code Generator
  if (upper.startsWith('QR ') && text.length > 3) {
    const qrData = text.replace(/^QR\s*/i, '').trim();
    const encoded = encodeURIComponent(qrData);
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encoded}&format=png`;

    return `📲 *QR Code Generated!*
━━━━━━━━━━━━━━━━━━━━
• *Content:* ${qrData.slice(0, 80)}${qrData.length > 80 ? '...' : ''}
• *Download PNG:* ${qrImageUrl}

🌐 _Custom colors & SVG: https://www.jsnsworks.site/tools/barcode-generator_`;
  }

  // 8. Natural Language & AI Queries powered by Google Gemini AI
  console.log('[Routing to Gemini AI]:', text);
  return await askGeminiAi(text);
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
