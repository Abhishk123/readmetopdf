import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * PROJECT BLUEPRINT: All-in-One WhatsApp Utility Bot ("QuickTools")
 * Webhook Endpoint: https://www.jsnsworks.site/api/whatsapp
 * Powered by Meta WhatsApp Cloud API (Free for first 1,000 conversations/mo)
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

        if (messageData.type === 'text' && messageData.text?.body) {
          const text = messageData.text.body.trim();
          replyText = processUserCommand(text);
        } else if (messageData.type === 'image') {
          replyText = `📸 *Photo Received!*\n\nHow would you like to process this image?\n\n1️⃣ Reply *COMPRESS 50KB* to reduce under 50KB (for job portals/admit cards)\n2️⃣ Reply *COMPRESS 100KB*\n3️⃣ Reply *CONVERT PDF* to save as PDF document\n4️⃣ Reply *CONVERT PNG* or *CONVERT JPG*\n\n_All tools also available free at https://www.jsnsworks.site/tools/image-compressor_`;
        } else if (messageData.type === 'document') {
          replyText = `📄 *Document Received!*\n\nTo merge or convert documents, visit our local-first web utility with zero file size limits:\n👉 https://www.jsnsworks.site/tools/pdf-merger\n\nOr reply *HELP* to see available bot tools.`;
        } else {
          replyText = `👋 Hello! Welcome to *QuickTools* on WhatsApp by JSNS Works.\n\nReply *MENU* to see all instant commands for EMI, QR codes, Age calculation, and document tools!`;
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
 * Command processor for everyday consumer/student/developer queries
 */
function processUserCommand(rawText: string): string {
  const text = rawText.trim();
  const upper = text.toUpperCase();

  // 1. Menu / Help
  if (upper === 'HELP' || upper === 'MENU' || upper === 'HI' || upper === 'HELLO' || upper === 'START') {
    return `⚡ *QuickTools by JSNS Works* ⚡\nYour everyday utility bot right inside WhatsApp.\n\n` +
      `🔢 *Financial & Math:*\n` +
      `• *EMI [Amount] [Rate%] [Years]*\n` +
      `  _Example:_ \`EMI 500000 8.5 5\`\n` +
      `• *GST [Amount] [Rate%]*\n` +
      `  _Example:_ \`GST 1000 18\`\n` +
      `• *PERCENT [Part] OF [Total]*\n` +
      `  _Example:_ \`PERCENT 450 OF 600\`\n\n` +
      `📅 *Student & Job Exams:*\n` +
      `• *AGE [DD-MM-YYYY]*\n` +
      `  _Example:_ \`AGE 15-08-1998\` (Exact age & govt exam eligibility)\n\n` +
      `🔗 *Codes & Links:*\n` +
      `• *QR [Text or URL]*\n` +
      `  _Example:_ \`QR https://jsnsworks.site\`\n\n` +
      `🖼️ *Image & Files:*\n` +
      `• Send any photo to compress for exam forms (20KB, 50KB, 100KB).\n\n` +
      `🌐 *Web Suite (16+ Free Tools):*\n` +
      `https://www.jsnsworks.site/tools`;
  }

  // 2. Loan EMI Calculator: EMI [Amount] [Rate] [Years]
  if (upper.startsWith('EMI')) {
    const parts = text.split(/\s+/).slice(1);
    if (parts.length >= 3) {
      const p = parseFloat(parts[0].replace(/,/g, ''));
      const rAnnual = parseFloat(parts[1].replace(/%/g, ''));
      const years = parseFloat(parts[2]);

      if (!isNaN(p) && !isNaN(rAnnual) && !isNaN(years) && p > 0 && rAnnual >= 0 && years > 0) {
        const nMonths = years * 12;
        let emi = 0;
        let totalPayment = 0;
        let totalInterest = 0;

        if (rAnnual === 0) {
          emi = p / nMonths;
          totalPayment = p;
          totalInterest = 0;
        } else {
          const rMonthly = rAnnual / (12 * 100);
          emi = (p * rMonthly * Math.pow(1 + rMonthly, nMonths)) / (Math.pow(1 + rMonthly, nMonths) - 1);
          totalPayment = emi * nMonths;
          totalInterest = totalPayment - p;
        }

        const fmt = (val: number) => '₹' + Math.round(val).toLocaleString('en-IN');

        return `📊 *Loan EMI Calculation Results*\n\n` +
          `• *Principal Amount:* ${fmt(p)}\n` +
          `• *Interest Rate:* ${rAnnual}% p.a.\n` +
          `• *Tenure:* ${years} Years (${nMonths} Months)\n\n` +
          `💰 *Monthly EMI:* *${fmt(emi)}*\n` +
          `📈 *Total Interest Payable:* ${fmt(totalInterest)}\n` +
          `💳 *Total Payment (P + I):* ${fmt(totalPayment)}\n\n` +
          `_Need amortization schedule & FD/PPF calculators? Visit https://www.jsnsworks.site/tools/finance-calculator_`;
      }
    }
    return `⚠️ *Invalid EMI Format!*\nPlease use: \`EMI [Principal] [Rate%] [Years]\`\nExample: \`EMI 500000 8.5 5\``;
  }

  // 3. Age Calculator: AGE DD-MM-YYYY
  if (upper.startsWith('AGE')) {
    const rawDate = text.replace(/^AGE\s*/i, '').trim();
    const dateParts = rawDate.split(/[-/.]/);
    if (dateParts.length === 3) {
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const year = parseInt(dateParts[2], 10);

      const dob = new Date(year, month, day);
      const today = new Date();

      if (!isNaN(dob.getTime()) && dob <= today) {
        let years = today.getFullYear() - dob.getFullYear();
        let months = today.getMonth() - dob.getMonth();
        let days = today.getDate() - dob.getDate();

        if (days < 0) {
          months -= 1;
          const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
          days += prevMonth.getDate();
        }
        if (months < 0) {
          years -= 1;
          months += 12;
        }

        const totalDays = Math.floor((today.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);

        return `🎂 *Age & Date Calculation*\n\n` +
          `• *Date of Birth:* ${day.toString().padStart(2, '0')}-${(month + 1).toString().padStart(2, '0')}-${year}\n` +
          `• *Exact Age:* *${years} Years, ${months} Months, ${days} Days*\n` +
          `• *Total Days Lived:* ${totalDays.toLocaleString('en-IN')} days\n` +
          `• *Total Weeks:* ${totalWeeks.toLocaleString('en-IN')} weeks\n\n` +
          `_Use our detailed online age calculator: https://www.jsnsworks.site/tools/age-calculator_`;
      }
    }
    return `⚠️ *Invalid Date Format!*\nPlease use: \`AGE DD-MM-YYYY\`\nExample: \`AGE 15-08-1998\``;
  }

  // 4. QR Code Generator: QR [Content or URL]
  if (upper.startsWith('QR')) {
    const qrData = text.replace(/^QR\s*/i, '').trim();
    if (qrData.length > 0) {
      const encoded = encodeURIComponent(qrData);
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encoded}&format=png`;

      return `📲 *QR Code Generated!*\n\n` +
        `• *Content:* ${qrData.slice(0, 80)}${qrData.length > 80 ? '...' : ''}\n` +
        `• *Download Image:* ${qrImageUrl}\n\n` +
        `_For custom colors, logos & barcode standards (EAN, UPC, Code 128), visit:_\n` +
        `👉 https://www.jsnsworks.site/tools/barcode-generator`;
    }
    return `⚠️ *Please provide text or link:*\nExample: \`QR https://jsnsworks.site\``;
  }

  // 5. GST Calculator: GST [Amount] [Rate%]
  if (upper.startsWith('GST')) {
    const parts = text.split(/\s+/).slice(1);
    if (parts.length >= 2) {
      const amount = parseFloat(parts[0].replace(/,/g, ''));
      const rate = parseFloat(parts[1].replace(/%/g, ''));

      if (!isNaN(amount) && !isNaN(rate) && amount > 0 && rate >= 0) {
        const gstAmount = (amount * rate) / 100;
        const total = amount + gstAmount;
        const cgst = gstAmount / 2;
        const sgst = gstAmount / 2;

        const fmt = (v: number) => '₹' + v.toFixed(2);

        return `🧾 *GST Tax Breakdown*\n\n` +
          `• *Net Amount:* ${fmt(amount)}\n` +
          `• *GST Rate:* ${rate}%\n` +
          `• *CGST (${rate / 2}%):* ${fmt(cgst)}\n` +
          `• *SGST (${rate / 2}%):* ${fmt(sgst)}\n` +
          `• *Total GST Tax:* ${fmt(gstAmount)}\n\n` +
          `💵 *Total Invoice Amount:* *${fmt(total)}*`;
      }
    }
    return `⚠️ *Invalid GST Format!*\nPlease use: \`GST [Amount] [Rate%]\`\nExample: \`GST 1000 18\``;
  }

  // 6. Percentage Calculator
  if (upper.startsWith('PERCENT') || upper.includes('% OF')) {
    const match = text.match(/(\d+(?:\.\d+)?)\s*(?:%|PERCENT)?\s*(?:OF|\/)\s*(\d+(?:\.\d+)?)/i);
    if (match) {
      const part = parseFloat(match[1]);
      const whole = parseFloat(match[2]);
      if (!isNaN(part) && !isNaN(whole) && whole !== 0) {
        const pct = (part / whole) * 100;
        return `🔢 *Percentage Result*\n\n` +
          `• ${part} out of ${whole} = *${pct.toFixed(2)}%*\n\n` +
          `_Online percentage & discount tools: https://www.jsnsworks.site/tools/percentage-calculator_`;
      }
    }
  }

  // Default response with menu hint
  return `👋 Got: "${text}"\n\nI can calculate EMIs, check exact Age, generate QR codes, and compress photos.\n\nReply *MENU* to see all available commands!`;
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
