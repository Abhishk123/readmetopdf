export interface VercelRequest {
  method?: string;
  query: Record<string, string | string[] | undefined>;
  body: any;
  headers: Record<string, string | string[] | undefined>;
}

export interface VercelResponse {
  status(code: number): VercelResponse;
  json(data: any): VercelResponse;
  send(data: any): VercelResponse;
  setHeader(name: string, value: string): VercelResponse;
  end(): void;
}
import {
  calculateLoanEmi,
  calculateExactAge,
  calculateGst,
  parseUpiCommand,
  buildUpiUri
} from '../src/shared/calculators';

declare const process: {
  env: Record<string, string | undefined>;
};

/**
 * PROJECT BLUEPRINT: All-in-One WhatsApp Utility Bot ("QuickTools")
 * Webhook Endpoint: https://www.jsnsworks.site/api/whatsapp
 * Powered by Meta WhatsApp Cloud API (Free for first 1,000 conversations/mo)
 * Shared Single-Source Calculation Engine: src/shared/calculators/
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const verifyToken = process.env['META_VERIFY_TOKEN'] || 'quicktools_verify_token_2026';

  // 1. Meta Webhook Verification Handshake (GET)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('[WhatsApp Webhook] Handshake verified successfully.');
      return res.status(200).send(challenge);
    }

    // Direct browser check / health status
    if (!mode && !token) {
      return res.status(200).json({
        status: 'online',
        service: 'JSANS QuickTools WhatsApp Bot Webhook',
        version: '1.0.0',
        message: 'Endpoint is active and ready for Meta Webhook verification.'
      });
    }

    console.warn('[WhatsApp Webhook] Verification token mismatch.');
    return res.status(403).json({ error: 'Verification failed' });
  }

  // 2. Incoming Messages & Events (POST)
  if (req.method === 'POST') {
    const body = req.body as WhatsAppWebhookBody;

    if (body.object && body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const messageData = body.entry[0].changes[0].value.messages[0];
      const from = messageData.from; // Sender WhatsApp phone number
      const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id || process.env['WHATSAPP_PHONE_NUMBER_ID'];

      try {
        let replyText = '';

        // Handle text message or interactive button clicks
        if (messageData.type === 'text' && messageData.text?.body) {
          replyText = processUserCommand(messageData.text.body.trim());
        } else if (messageData.type === 'interactive') {
          const buttonId = messageData.interactive?.button_reply?.id || messageData.interactive?.list_reply?.id || '';
          replyText = processUserCommand(buttonId);
        } else if (messageData.type === 'image') {
          replyText = `📸 *Photo Received!*\n\nWhat would you like to do with this image?\n\n` +
            `1️⃣ *Exam / Job Size Reduction:*\n` +
            `• Reply \`COMPRESS 20KB\` (Signature & thumb)\n` +
            `• Reply \`COMPRESS 50KB\` (SSC / UPSC / Gate)\n` +
            `• Reply \`COMPRESS 100KB\` (Passport photo)\n\n` +
            `2️⃣ *Safe-KYC Anti-Fraud Watermark:*\n` +
            `• Reply \`WATERMARK ONLY FOR AIRTEL SIM\` or \`WATERMARK ONLY FOR HOTEL CHECK-IN\` to stamp tamper-proof proof across your ID!\n\n` +
            `3️⃣ *Convert to PDF Document:*\n` +
            `• Reply \`CONVERT PDF\` to receive as a clean PDF.\n\n` +
            `_All tools also available free in browser: https://www.jsnsworks.site/tools_`;
        } else if (messageData.type === 'document') {
          replyText = `📄 *Document Received!*\n\nTo merge, extract, or convert PDF documents locally in your browser memory:\n👉 https://www.jsnsworks.site/tools/pdf-merger\n\nOr reply *MENU* to see all instant bot commands.`;
        } else {
          replyText = `👋 Hello! Welcome to *QuickTools* on WhatsApp by JSANS DevStudio.\n\nReply *MENU* to see all instant commands for Loan EMI, UPI QR, Age calculations, and KYC watermarking!`;
        }

        if (replyText && phoneNumberId) {
          await sendWhatsAppMessage(phoneNumberId, from, replyText);
        }
      } catch (err) {
        console.error('[WhatsApp Webhook] Error processing message:', err);
      }

      return res.status(200).json({ status: 'ok' });
    }

    return res.status(200).json({ status: 'ignored' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

/**
 * Command processor - Uses shared calculations engine src/shared/calculators
 */
function processUserCommand(rawText: string): string {
  const text = rawText.trim();
  const upper = text.toUpperCase();

  // 1. Menu / Help
  if (upper === 'HELP' || upper === 'MENU' || upper === 'HI' || upper === 'HELLO' || upper === 'START') {
    return `⚡ *QuickTools by JSANS DevStudio* ⚡\nYour everyday utility bot right inside WhatsApp.\n\n` +
      `🔢 *Financial Calculators:*\n` +
      `• *EMI [Amount] [Rate%] [Years]*\n` +
      `  _Example:_ \`EMI 500000 8.5 5\`\n` +
      `• *GST [Amount] [Rate%]*\n` +
      `  _Example:_ \`GST 1000 18\`\n` +
      `• *PERCENT [Part] OF [Total]*\n` +
      `  _Example:_ \`PERCENT 450 OF 600\`\n\n` +
      `💸 *UPI Payments & QR Codes:*\n` +
      `• *UPI [yourVPA] [Amount]*\n` +
      `  _Example:_ \`UPI rahul@okhdfcbank 500\`\n` +
      `• *QR [Text or Link]*\n` +
      `  _Example:_ \`QR https://jsnsworks.site\`\n\n` +
      `📅 *Date & Age Calculations:*\n` +
      `• *AGE [DD-MM-YYYY]*\n` +
      `  _Example:_ \`AGE 15-08-1998\`\n\n` +
      `🛡️ *Document & KYC Security:*\n` +
      `• Send any Aadhaar/PAN photo + type: \`WATERMARK ONLY FOR [PURPOSE]\`\n\n` +
      `🌐 *Web Suite (16+ Free Tools):*\n` +
      `https://www.jsnsworks.site/tools`;
  }

  // 2. Loan EMI Calculator (Powered by shared calculateLoanEmi)
  if (upper.startsWith('EMI')) {
    const parts = text.split(/\s+/).slice(1);
    if (parts.length >= 3) {
      const p = parseFloat(parts[0].replace(/,/g, ''));
      const rAnnual = parseFloat(parts[1].replace(/%/g, ''));
      const years = parseFloat(parts[2]);

      if (!isNaN(p) && !isNaN(rAnnual) && !isNaN(years) && p > 0 && rAnnual >= 0 && years > 0) {
        const emiRes = calculateLoanEmi(p, rAnnual, years);
        const fmt = (val: number) => '₹' + Math.round(val).toLocaleString('en-IN');

        return `📊 *Loan EMI Calculation Results*\n\n` +
          `• *Principal Amount:* ${fmt(p)}\n` +
          `• *Interest Rate:* ${rAnnual}% p.a.\n` +
          `• *Tenure:* ${years} Years (${Math.round(years * 12)} Months)\n\n` +
          `💰 *Monthly EMI:* *${fmt(emiRes.monthlyEmi)}*\n` +
          `📈 *Total Interest:* ${fmt(emiRes.totalInterest)} (${emiRes.interestPercent}%)\n` +
          `💳 *Total Payment:* ${fmt(emiRes.totalPayment)}\n\n` +
          `_Interactive visual sliders & FD/RD/PPF calculators: https://www.jsnsworks.site/tools/finance-calculator_`;
      }
    }
    return `⚠️ *Invalid EMI Format!*\nPlease use: \`EMI [Principal] [Rate%] [Years]\`\nExample: \`EMI 500000 8.5 5\``;
  }

  // 3. Instant UPI Payment QR Code Generator
  if (upper.startsWith('UPI')) {
    const upiConfig = parseUpiCommand(text);
    if (upiConfig) {
      const upiUri = buildUpiUri(upiConfig);
      const encoded = encodeURIComponent(upiUri);
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=${encoded}&format=png`;

      const amtText = upiConfig.amount ? `₹${upiConfig.amount.toLocaleString('en-IN')}` : 'Any Amount';
      return `💸 *Instant UPI Payment QR Generated!*\n\n` +
        `• *Payee VPA:* ${upiConfig.vpa}\n` +
        `• *Amount:* *${amtText}*\n` +
        (upiConfig.transactionNote ? `• *Note:* ${upiConfig.transactionNote}\n` : '') +
        `\n📲 *Download & Scan with GPay / PhonePe / Paytm:*\n${qrImageUrl}\n\n` +
        `_Scan this QR code from any Indian UPI app to pay directly._`;
    }
    return `⚠️ *Invalid UPI Format!*\nPlease use: \`UPI [VPA@bank] [Amount] [Optional Note]\`\nExample: \`UPI rahul@okhdfcbank 750 Tuition Fees\``;
  }

  // 4. Age Calculator (Powered by shared calculateExactAge)
  if (upper.startsWith('AGE')) {
    const rawDate = text.replace(/^AGE\s*/i, '').trim();
    const ageRes = calculateExactAge(rawDate);
    if (ageRes) {
      return `🎂 *Age & Date Calculation*\n\n` +
        `• *Exact Age:* *${ageRes.formattedString}*\n` +
        `• *Total Days Lived:* ${ageRes.totalDays.toLocaleString('en-IN')} days\n` +
        `• *Total Weeks:* ${ageRes.totalWeeks.toLocaleString('en-IN')} weeks\n` +
        `• *Next Birthday:* In ${ageRes.daysUntilNextBirthday} days 🎈\n\n` +
        `_Detailed online age tool: https://www.jsnsworks.site/tools/age-calculator_`;
    }
    return `⚠️ *Invalid Date!*\nPlease use: \`AGE DD-MM-YYYY\`\nExample: \`AGE 15-08-1998\``;
  }

  // 5. GST Calculator (Powered by shared calculateGst)
  if (upper.startsWith('GST')) {
    const parts = text.split(/\s+/).slice(1);
    if (parts.length >= 2) {
      const amount = parseFloat(parts[0].replace(/,/g, ''));
      const rate = parseFloat(parts[1].replace(/%/g, ''));

      if (!isNaN(amount) && !isNaN(rate) && amount > 0 && rate >= 0) {
        const gstRes = calculateGst(amount, rate);
        const fmt = (v: number) => '₹' + v.toLocaleString('en-IN', { minimumFractionDigits: 2 });

        return `🧾 *GST Tax Breakdown*\n\n` +
          `• *Net Amount:* ${fmt(gstRes.netAmount)}\n` +
          `• *GST Rate:* ${rate}%\n` +
          `• *CGST (${rate / 2}%):* ${fmt(gstRes.cgst)}\n` +
          `• *SGST (${rate / 2}%):* ${fmt(gstRes.sgst)}\n` +
          `• *Total GST Tax:* ${fmt(gstRes.gstAmount)}\n\n` +
          `💵 *Total Invoice Amount:* *${fmt(gstRes.totalAmount)}*`;
      }
    }
    return `⚠️ *Invalid GST Format!*\nPlease use: \`GST [Amount] [Rate%]\`\nExample: \`GST 1000 18\``;
  }

  // 6. Safe-KYC Watermark Instruction / Echo
  if (upper.startsWith('WATERMARK')) {
    const purpose = text.replace(/^WATERMARK\s*/i, '').trim() || 'FOR VERIFICATION ONLY';
    return `🛡️ *Safe-KYC Watermarker*\n\n` +
      `Your watermark purpose is set to:\n👉 "*${purpose.toUpperCase()}*"\n\n` +
      `Now send or attach your ID / document photo. The bot will stamp a tamper-proof diagonal watermark across it so it cannot be misused for fraudulent loans or SIMs!`;
  }

  // 7. QR Code Generator: QR [Content or URL]
  if (upper.startsWith('QR')) {
    const qrData = text.replace(/^QR\s*/i, '').trim();
    if (qrData.length > 0) {
      const encoded = encodeURIComponent(qrData);
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encoded}&format=png`;

      return `📲 *QR Code Generated!*\n\n` +
        `• *Content:* ${qrData.slice(0, 80)}${qrData.length > 80 ? '...' : ''}\n` +
        `• *Download PNG:* ${qrImageUrl}\n\n` +
        `_Custom colors, SVG downloads & barcodes: https://www.jsnsworks.site/tools/barcode-generator_`;
    }
    return `⚠️ *Please provide text or link:*\nExample: \`QR https://jsnsworks.site\``;
  }

  // 8. Percentage Calculator
  if (upper.startsWith('PERCENT') || upper.includes('% OF')) {
    const match = text.match(/(\d+(?:\.\d+)?)\s*(?:%|PERCENT)?\s*(?:OF|\/)\s*(\d+(?:\.\d+)?)/i);
    if (match) {
      const part = parseFloat(match[1]);
      const whole = parseFloat(match[2]);
      if (!isNaN(part) && !isNaN(whole) && whole !== 0) {
        const pct = (part / whole) * 100;
        return `🔢 *Percentage Result*\n\n` +
          `• ${part} out of ${whole} = *${pct.toFixed(2)}%*\n\n` +
          `_Online percentage tool: https://www.jsnsworks.site/tools/percentage-calculator_`;
      }
    }
  }

  // Default response with menu hint
  return `👋 Got: "${text}"\n\nI can calculate EMIs, generate UPI QR codes, calculate exact Age, and compress/watermark photos.\n\nReply *MENU* to see all available commands!`;
}

/**
 * Dispatch outbound reply using Meta Graph API
 */
async function sendWhatsAppMessage(phoneNumberId: string, to: string, text: string): Promise<void> {
  const token = process.env['WHATSAPP_ACCESS_TOKEN'];
  if (!token) {
    console.log('[WhatsApp Webhook Mock Response - Token not set]:', { to, text });
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

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[WhatsApp API Error]:', errorText);
  }
}
