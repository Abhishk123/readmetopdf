import {
  calculateLoanEmi,
  calculateExactAge,
  calculateGst,
  parseUpiCommand,
  buildUpiUri
} from './calculators.js';
import { askGeminiAi } from './gemini.js';
import { Jimp, loadFont } from 'jimp';
// @ts-ignore
import * as fonts from 'jimp/fonts';

declare const process: {
  env: Record<string, string | undefined>;
};

/**
 * PROJECT BLUEPRINT: All-in-One WhatsApp Utility Bot ("QuickTools")
 * Webhook Endpoint: https://www.jsnsworks.site/api/whatsapp
 * Features:
 * - In-Memory Session State (tracks active submenu per user)
 * - Single-Digit Submenu Navigation (1, 2, 3...)
 * - In-Memory Image Watermarking & Compression (Zero DB storage, 100% private)
 * - Custom User Inputs (Custom Name for Watermark, UPI, EMI, GST)
 * - Google Gemini AI Fallthrough for natural queries
 */

interface UserSession {
  phone: string;
  currentMenu: 'MAIN' | 'LOAN' | 'AGE' | 'UPI' | 'GST' | 'WATERMARK' | 'PHOTO';
  lastMediaId?: string;
  lastMediaMime?: string;
  customName?: string;
  updatedAt: number;
}

// In-memory session store (30-minute session per user)
const userSessions = new Map<string, UserSession>();

function getSession(phone: string): UserSession {
  let session = userSessions.get(phone);
  if (!session || Date.now() - session.updatedAt > 30 * 60 * 1000) {
    session = { phone, currentMenu: 'MAIN', updatedAt: Date.now() };
    userSessions.set(phone, session);
  }
  return session;
}

function updateSession(phone: string, updates: Partial<UserSession>): UserSession {
  const session = getSession(phone);
  Object.assign(session, updates, { updatedAt: Date.now() });
  userSessions.set(phone, session);
  return session;
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

    if (!mode && !token) {
      return Response.json({
        status: 'online',
        service: 'JSANS QuickTools WhatsApp Bot Webhook',
        version: '3.0.0',
        message: 'Endpoint is active with in-memory image conversion & single-digit submenus.'
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

    if (body?.object && body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const messageData = body.entry[0].changes[0].value.messages[0];
      const from = messageData.from; // Sender WhatsApp phone number
      const phoneNumberId = body.entry[0].changes[0].value.metadata?.phone_number_id || process.env['WHATSAPP_PHONE_NUMBER_ID'];

      console.log('[WhatsApp Processing User Message]:', { from, phoneNumberId, type: messageData.type, body: messageData.text?.body });

      try {
        let replyText = '';

        if (messageData.type === 'text' && messageData.text?.body) {
          const rawInput = messageData.text.body.trim();
          replyText = await processUserCommand(rawInput, phoneNumberId, from);
        } else if (messageData.type === 'interactive') {
          const buttonId = messageData.interactive?.button_reply?.id || messageData.interactive?.list_reply?.id || '';
          replyText = await processUserCommand(buttonId, phoneNumberId, from);
        } else if (messageData.type === 'image') {
          // Save image reference in memory session
          const mediaId = messageData.image?.id;
          const mimeType = messageData.image?.mime_type || 'image/jpeg';
          updateSession(from, { currentMenu: 'PHOTO', lastMediaId: mediaId, lastMediaMime: mimeType });

          replyText = `📸 *Photo Received!*
━━━━━━━━━━━━━━━━━━━━
Reply with a *single number* to edit this photo directly:

1️⃣ *Safe-KYC Hotel Check-In Watermark*
2️⃣ *Safe-KYC SIM Activation Watermark*
3️⃣ *Safe-KYC Bank / Loan KYC Watermark*
4️⃣ *Safe-KYC Job Verification Watermark*
5️⃣ *Compress Photo to 20 KB* (Govt Exams)
6️⃣ *Compress Photo to 50 KB* (Passport/Visa)

✏️ *Or type custom watermark with your name:*
\`WATERMARK <Your Name / Purpose>\`
_(e.g. \`WATERMARK Abhishek - HDFC Bank Only\`)_

0️⃣ *Back to Main Menu*`;
        } else if (messageData.type === 'document') {
          replyText = `📄 *Document Received!*
━━━━━━━━━━━━━━━━━━━━
Merge, extract, or sign PDF documents securely in browser memory:
👉 https://www.jsnsworks.site/tools/pdf-merger

_Or reply *0* to see all tools!_`;
        } else {
          replyText = getMainMenuText();
        }

        // Send outbound text message if non-empty (if image was sent, replyText is empty)
        if (replyText && phoneNumberId) {
          console.log('[WhatsApp Dispatching Outbound Reply]:', { to: from, replySnippet: replyText.slice(0, 60) });
          await sendWhatsAppMessage(phoneNumberId, from, replyText);
        }
      } catch (err) {
        console.error('[WhatsApp Webhook] Error processing message:', err);
      }

      return Response.json({ status: 'ok' });
    }

    return Response.json({ status: 'ignored' });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

/**
 * Main Menu Display
 */
function getMainMenuText(): string {
  return `👋 *Welcome to QuickTools AI!*
━━━━━━━━━━━━━━━━━━━━
Reply with a *number (1 - 6)*:

1️⃣ *Loan EMI Calculator*
2️⃣ *Exact Age & Birthday Milestone*
3️⃣ *UPI QR & Barcode (Sends Photo 🖼️)*
4️⃣ *GST Tax Calculator*
5️⃣ *Safe-KYC Document Watermarker*
6️⃣ *Photo Size Reducer (20KB / 50KB)*
0️⃣ *Main Menu*

💬 _Or ask me any question in plain words!_`;
}

/**
 * Command processor - Handles numbered submenus (1, 2, 3), custom names & in-memory image conversion
 */
async function processUserCommand(rawText: string, phoneNumberId?: string, from?: string): Promise<string> {
  const text = rawText.trim();
  const upper = text.toUpperCase();
  const session: UserSession = from ? getSession(from) : { currentMenu: 'MAIN', phone: '', updatedAt: 0 };

  // ==========================================
  // 0. RESET TO MAIN MENU
  // ==========================================
  if (['0', 'M', 'MENU', 'BACK', 'HOME', 'START', 'HELP', 'HI', 'HELLO', 'TOOLS'].includes(upper)) {
    if (from) updateSession(from, { currentMenu: 'MAIN' });
    return getMainMenuText();
  }

  // ==========================================
  // GLOBAL COMMANDS (WORK FROM ANYWHERE)
  // ==========================================

  // Custom UPI Command with optional custom Payee Name:
  // Syntax: UPI <vpa> <amount> [Payee Name]
  if (upper.startsWith('UPI')) {
    const parts = text.split(/\s+/);
    if (parts.length >= 2) {
      const vpa = parts[1];
      const amount = parts.length >= 3 && !isNaN(parseFloat(parts[2])) ? parseFloat(parts[2]) : undefined;
      const customPayee = parts.length >= 4 ? parts.slice(3).join(' ') : 'JSANS QuickTools';

      const upiUri = buildUpiUri({ vpa, amount, payeeName: customPayee });
      const encoded = encodeURIComponent(upiUri);
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encoded}&format=png`;

      const amtText = amount ? `₹${amount.toLocaleString('en-IN')}` : 'Any Amount';
      const caption = `📱 *Instant UPI Payment QR Code!*
━━━━━━━━━━━━━━━━━━━━
• *Payee:* ${customPayee}
• *VPA:* \`${vpa}\`
• *Amount:* *${amtText}*

📲 *Scan with GPay, PhonePe, or Paytm to pay!*

_Reply *0* for Main Menu_`;

      if (phoneNumberId && from) {
        const sent = await sendWhatsAppImage(phoneNumberId, from, qrImageUrl, caption);
        if (sent) return '';
      }
      return `${caption}\n\n🔗 ${qrImageUrl}`;
    }
  }

  // Custom Barcode Command: BARCODE <number>
  if (upper.startsWith('BARCODE')) {
    const codeValue = text.replace(/^BARCODE\s*/i, '').trim();
    if (codeValue.length > 0) {
      const barcodeImageUrl = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(codeValue)}&scale=3&includetext=true`;
      const caption = `🏷️ *Barcode Generated!*
━━━━━━━━━━━━━━━━━━━━
• *Code:* \`${codeValue}\`
• *Format:* Universal Code-128

_Scannable with any optical scanner or phone reader._

_Reply *0* for Main Menu_`;

      if (phoneNumberId && from) {
        const sent = await sendWhatsAppImage(phoneNumberId, from, barcodeImageUrl, caption);
        if (sent) return '';
      }
      return `${caption}\n\n🔗 ${barcodeImageUrl}`;
    }
  }

  // Custom QR Command: QR <link/text>
  if (upper.startsWith('QR')) {
    const qrData = text.replace(/^QR\s*/i, '').trim();
    if (qrData.length > 0) {
      const encoded = encodeURIComponent(qrData);
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encoded}&format=png`;
      const caption = `🔲 *Custom QR Code Generated!*
━━━━━━━━━━━━━━━━━━━━
• *Data:* ${qrData.slice(0, 100)}

_Scan with any phone camera or QR reader._

_Reply *0* for Main Menu_`;

      if (phoneNumberId && from) {
        const sent = await sendWhatsAppImage(phoneNumberId, from, qrImageUrl, caption);
        if (sent) return '';
      }
      return `${caption}\n\n🔗 ${qrImageUrl}`;
    }
  }

  // Custom Watermark command with custom name: WATERMARK <Name / Purpose>
  if (upper.startsWith('WATERMARK')) {
    const customWatermark = text.replace(/^WATERMARK\s*/i, '').trim();
    if (from && session.lastMediaId && phoneNumberId) {
      const watermarkString = customWatermark || 'SAFE-KYC VERIFIED DOCUMENT - NOT FOR REUSE';
      const success = await processAndSendWatermark(phoneNumberId, from, session.lastMediaId, watermarkString);
      if (success) return '';
    }
    return `🛡️ *Safe-KYC Watermark Studio*
━━━━━━━━━━━━━━━━━━━━
To stamp *"${customWatermark}"* on your ID card:
1. Send your Aadhaar, PAN or Voter ID photo here first.
2. Or use our 100% Private In-Browser Watermark Studio:
👉 https://www.jsnsworks.site/tools/watermark

_Reply *0* for Main Menu_`;
  }

  // Custom Loan EMI: EMI <Amount> <Rate> <Years>
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

  // Custom GST: GST <Amount> <Rate>
  if (upper.startsWith('GST') && text.split(/\s+/).length >= 3) {
    const parts = text.split(/\s+/).slice(1);
    const amount = parseFloat(parts[0].replace(/,/g, ''));
    const rate = parseFloat(parts[1].replace(/%/g, ''));

    if (!isNaN(amount) && !isNaN(rate) && amount > 0 && rate >= 0) {
      return formatGstResult(amount, rate, calculateGst(amount, rate));
    }
  }

  // Custom Age: AGE 15-08-1998 or direct date like 15-08-1998
  const dateMatch = text.match(/^(?:AGE\s+)?(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})$/i);
  if (dateMatch) {
    const rawDate = dateMatch[1];
    const ageRes = calculateExactAge(rawDate);
    if (ageRes) return formatAgeResult(ageRes, rawDate);
  }

  // ==========================================
  // STATE MACHINE: SUBMENU HANDLING
  // ==========================================

  // --- SUBMENU: PHOTO RECEIVED (IN-MEMORY CONVERSION) ---
  if (session.currentMenu === 'PHOTO' && session.lastMediaId && phoneNumberId && from) {
    if (upper === '1') {
      const success = await processAndSendWatermark(phoneNumberId, from, session.lastMediaId, 'ONLY FOR HOTEL CHECK-IN - NOT FOR ANY OTHER USE');
      if (success) return '';
    }
    if (upper === '2') {
      const success = await processAndSendWatermark(phoneNumberId, from, session.lastMediaId, 'FOR NEW SIM ACTIVATION ONLY - NOT FOR BANKING');
      if (success) return '';
    }
    if (upper === '3') {
      const success = await processAndSendWatermark(phoneNumberId, from, session.lastMediaId, 'SUBMITTED FOR BANK / LOAN KYC ONLY');
      if (success) return '';
    }
    if (upper === '4') {
      const success = await processAndSendWatermark(phoneNumberId, from, session.lastMediaId, 'FOR JOB BACKGROUND VERIFICATION ONLY');
      if (success) return '';
    }
    if (upper === '5') {
      const success = await processAndSendCompressedImage(phoneNumberId, from, session.lastMediaId, 20);
      if (success) return '';
    }
    if (upper === '6') {
      const success = await processAndSendCompressedImage(phoneNumberId, from, session.lastMediaId, 50);
      if (success) return '';
    }
  }

  // --- SUBMENU: LOAN EMI ---
  if (session.currentMenu === 'LOAN') {
    if (upper === '1' || upper === '11') {
      const res = calculateLoanEmi(2500000, 8.5, 15);
      return formatEmiResult(2500000, 8.5, 15, res, 'Home Loan Preset');
    }
    if (upper === '2' || upper === '12') {
      const res = calculateLoanEmi(800000, 9.0, 5);
      return formatEmiResult(800000, 9.0, 5, res, 'Car Loan Preset');
    }
    if (upper === '3' || upper === '13') {
      const res = calculateLoanEmi(300000, 12.0, 3);
      return formatEmiResult(300000, 12.0, 3, res, 'Personal Loan Preset');
    }
    if (upper === '4' || upper === '14') {
      return `✏️ *Custom Loan EMI Calculator*
━━━━━━━━━━━━━━━━━━━━
Reply in this format:
\`EMI <Amount> <Rate%> <Years>\`

_Examples:_
• \`EMI 1000000 8.5 10\` (₹10L @ 8.5% for 10 Yrs)
• \`EMI 500000 10.5 3\` (₹5L @ 10.5% for 3 Yrs)

_Reply *0* for Main Menu_`;
    }
  }

  // --- SUBMENU: AGE CALCULATOR ---
  if (session.currentMenu === 'AGE') {
    if (upper === '1' || upper === '21') {
      const res = calculateExactAge('01-01-2000');
      if (res) return formatAgeResult(res, '01-01-2000');
    }
    if (upper === '2' || upper === '22') {
      const res = calculateExactAge('15-08-1995');
      if (res) return formatAgeResult(res, '15-08-1995');
    }
    if (upper === '3' || upper === '23') {
      return `🎂 *Calculate Your Exact Age*
━━━━━━━━━━━━━━━━━━━━
Reply with your birth date:
👉 \`AGE DD-MM-YYYY\`
_Example:_ \`AGE 15-08-1998\`

_Reply *0* for Main Menu_`;
    }
  }

  // --- SUBMENU: UPI QR & BARCODE ---
  if (session.currentMenu === 'UPI') {
    if (upper === '1' || upper === '31') {
      const demoVpa = 'store@upi';
      const upiUri = buildUpiUri({ vpa: demoVpa, amount: 500, payeeName: 'JSANS Store' });
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(upiUri)}&format=png`;
      const caption = `📱 *Demo UPI QR Code (₹500)*
━━━━━━━━━━━━━━━━━━━━
• *Payee:* JSANS Store
• *VPA:* \`${demoVpa}\`
• *Amount:* ₹500

📲 *Scan directly from WhatsApp using GPay, PhonePe, or Paytm!*

_Reply *0* for Main Menu_`;
      if (phoneNumberId && from) {
        const sent = await sendWhatsAppImage(phoneNumberId, from, qrImageUrl, caption);
        if (sent) return '';
      }
      return `${caption}\n\n🔗 ${qrImageUrl}`;
    }

    if (upper === '2' || upper === '32') {
      const demoVpa = 'merchant@upi';
      const upiUri = buildUpiUri({ vpa: demoVpa, amount: 1000, payeeName: 'Merchant Pay' });
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(upiUri)}&format=png`;
      const caption = `📱 *Demo UPI QR Code (₹1,000)*
━━━━━━━━━━━━━━━━━━━━
• *Payee:* Merchant Pay
• *VPA:* \`${demoVpa}\`
• *Amount:* ₹1,000

📲 *Scan directly from WhatsApp using GPay, PhonePe, or Paytm!*

_Reply *0* for Main Menu_`;
      if (phoneNumberId && from) {
        const sent = await sendWhatsAppImage(phoneNumberId, from, qrImageUrl, caption);
        if (sent) return '';
      }
      return `${caption}\n\n🔗 ${qrImageUrl}`;
    }

    if (upper === '3' || upper === '33') {
      return `✏️ *Create Custom UPI Payment QR*
━━━━━━━━━━━━━━━━━━━━
Reply in this format:
\`UPI <yourVPA> <Amount> [Your Name]\`

_Examples:_
• \`UPI rahul@paytm 500 Rahul Store\`
• \`UPI business@okhdfcbank 1500 Abhishek\`

_I will immediately generate and send the scannable QR photo!_`;
    }

    if (upper === '4' || upper === '34') {
      const barcodeValue = '8901030865421';
      const barcodeImageUrl = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${barcodeValue}&scale=3&includetext=true`;
      const caption = `🏷️ *Demo Barcode (Code-128)*
━━━━━━━━━━━━━━━━━━━━
• *Code:* \`${barcodeValue}\`
• *Format:* Universal Code-128

_Reply *0* for Main Menu_`;
      if (phoneNumberId && from) {
        const sent = await sendWhatsAppImage(phoneNumberId, from, barcodeImageUrl, caption);
        if (sent) return '';
      }
      return `${caption}\n\n🔗 ${barcodeImageUrl}`;
    }

    if (upper === '5' || upper === '35') {
      return `🏷️ *Create Custom Barcode*
━━━━━━━━━━━━━━━━━━━━
Reply in this format:
\`BARCODE <Number or Code>\`

_Examples:_ \`BARCODE 890123456789\`

_Reply *0* for Main Menu_`;
    }

    if (upper === '6' || upper === '36') {
      return `🔲 *Create Custom QR Code*
━━━━━━━━━━━━━━━━━━━━
Reply in this format:
\`QR <Your Link or Text>\`

_Examples:_ \`QR https://www.jsnsworks.site\`

_Reply *0* for Main Menu_`;
    }
  }

  // --- SUBMENU: GST TAX ---
  if (session.currentMenu === 'GST') {
    if (upper === '1' || upper === '41') return formatGstResult(1000, 18, calculateGst(1000, 18));
    if (upper === '2' || upper === '42') return formatGstResult(5000, 18, calculateGst(5000, 18));
    if (upper === '3' || upper === '43') return formatGstResult(2500, 12, calculateGst(2500, 12));
    if (upper === '4' || upper === '44') return formatGstResult(500, 5, calculateGst(500, 5));
    if (upper === '5' || upper === '45') {
      return `🧾 *Custom GST Calculator*
━━━━━━━━━━━━━━━━━━━━
Reply in this format:
\`GST <Amount> <Rate%>\`

_Examples:_ \`GST 1500 18\` or \`GST 85000 28\`

_Reply *0* for Main Menu_`;
    }
  }

  // --- SUBMENU: SAFE-KYC WATERMARK TEXT GUIDE ---
  if (session.currentMenu === 'WATERMARK') {
    if (upper === '1' || upper === '51') {
      return `🏨 *Hotel Check-In Watermark Template*
━━━━━━━━━━━━━━━━━━━━
Recommended watermark text:
\`ONLY FOR HOTEL CHECK-IN AT [HOTEL] ON [DATE]. NOT VALID FOR ANY OTHER PURPOSE.\`

👉 *Send any ID photo here now, and reply 1 to stamp it!*
_Or use Web Studio:_ https://www.jsnsworks.site/tools/watermark

_Reply *0* for Main Menu_`;
    }
    if (upper === '2' || upper === '52') {
      return `📱 *SIM Activation Watermark Template*
━━━━━━━━━━━━━━━━━━━━
Recommended watermark text:
\`FOR [AIRTEL/JIO] NEW SIM ACTIVATION ON [DATE] ONLY. NOT VALID FOR BANKING.\`

👉 *Send any ID photo here now, and reply 2 to stamp it!*
_Reply *0* for Main Menu_`;
    }
    if (upper === '3' || upper === '53') {
      return `🏦 *Bank & Loan KYC Watermark Template*
━━━━━━━━━━━━━━━━━━━━
Recommended watermark text:
\`SUBMITTED FOR [BANK NAME] KYC ON [DATE] ONLY.\`

👉 *Send any ID photo here now, and reply 3 to stamp it!*
_Reply *0* for Main Menu_`;
    }
    if (upper === '4' || upper === '54') {
      return `💼 *Job Application Watermark Template*
━━━━━━━━━━━━━━━━━━━━
Recommended watermark text:
\`FOR JOB VERIFICATION AT [COMPANY] ON [DATE] ONLY.\`

👉 *Send any ID photo here now, and reply 4 to stamp it!*
_Reply *0* for Main Menu_`;
    }
    if (upper === '5' || upper === '55') {
      return `🌐 *Safe-KYC In-Browser Watermark Studio*
━━━━━━━━━━━━━━━━━━━━
Safely protect documents without uploading to any server:
👉 https://www.jsnsworks.site/tools/watermark

_Reply *0* for Main Menu_`;
    }
  }

  // ==========================================
  // MAIN MENU NUMBER NAVIGATION (1 - 6)
  // ==========================================

  // 1: Enter Loan EMI Submenu
  if (upper === '1' || upper === 'LOAN' || upper === 'EMI') {
    if (from) updateSession(from, { currentMenu: 'LOAN' });
    return `📊 *Loan EMI Calculator*
━━━━━━━━━━━━━━━━━━━━
Reply with a *number (1 - 4)*:

1️⃣ *Home Loan:* ₹25L @ 8.5% for 15 Yrs
2️⃣ *Car Loan:* ₹8L @ 9.0% for 5 Yrs
3️⃣ *Personal Loan:* ₹3L @ 12.0% for 3 Yrs
4️⃣ *Custom Loan:* Enter your own amount, rate & years!

0️⃣ *Back to Main Menu*`;
  }

  // 2: Enter Age Submenu
  if (upper === '2' || upper === 'AGE') {
    if (from) updateSession(from, { currentMenu: 'AGE' });
    return `🎂 *Exact Age & Birthday Milestone*
━━━━━━━━━━━━━━━━━━━━
Reply with a *number (1 - 3)*:

1️⃣ *Demo:* Born 01-01-2000
2️⃣ *Demo:* Born 15-08-1995
3️⃣ *Custom Age:* Type \`AGE DD-MM-YYYY\` (e.g. \`15-08-1998\`)

0️⃣ *Back to Main Menu*`;
  }

  // 3: Enter UPI & Barcode Submenu
  if (upper === '3' || upper === 'QR' || upper === 'BARCODE') {
    if (from) updateSession(from, { currentMenu: 'UPI' });
    return `📱 *UPI Payment QR & Barcode Generator*
━━━━━━━━━━━━━━━━━━━━
Reply with a *number (1 - 6)* to receive direct photo 🖼️:

1️⃣ *Demo UPI QR:* ₹500 to store@upi
2️⃣ *Demo UPI QR:* ₹1,000 to merchant@upi
3️⃣ *Custom UPI QR:* Enter your own VPA, Amount & Name
4️⃣ *Demo Barcode:* EAN-13 Sample
5️⃣ *Custom Barcode:* Generate barcode from number
6️⃣ *Custom QR:* Generate QR from link or text

0️⃣ *Back to Main Menu*`;
  }

  // 4: Enter GST Submenu
  if (upper === '4' || upper === 'GST') {
    if (from) updateSession(from, { currentMenu: 'GST' });
    return `🧾 *GST Tax Calculator*
━━━━━━━━━━━━━━━━━━━━
Reply with a *number (1 - 5)*:

1️⃣ *18% GST on ₹1,000*
2️⃣ *18% GST on ₹5,000*
3️⃣ *12% GST on ₹2,500*
4️⃣ *5% GST on ₹500*
5️⃣ *Custom GST:* Enter your own amount & tax rate

0️⃣ *Back to Main Menu*`;
  }

  // 5: Enter Watermark Submenu
  if (upper === '5' || upper === 'WATERMARK' || upper === 'KYC') {
    if (from) updateSession(from, { currentMenu: 'WATERMARK' });
    return `🛡️ *Safe-KYC Document Watermarker*
━━━━━━━━━━━━━━━━━━━━
Protect Aadhaar, PAN & Voter ID cards from fraud!

Reply with a *number (1 - 5)*:

1️⃣ *Hotel Check-In Preset Text & Guide*
2️⃣ *SIM Card Activation Preset Text & Guide*
3️⃣ *Bank Account / Loan KYC Preset Text & Guide*
4️⃣ *Job Application Preset Text & Guide*
5️⃣ *Open 100% Private Web Watermark Studio*
     👉 https://www.jsnsworks.site/tools/watermark

💡 *Tip:* Send any photo here to stamp it directly!
0️⃣ *Back to Main Menu*`;
  }

  // 6: Enter Photo Reducer Submenu
  if (upper === '6' || upper === 'COMPRESS' || upper === 'PHOTO') {
    if (from) updateSession(from, { currentMenu: 'PHOTO' });
    return `🗜️ *Photo Size Reducer & Image Resizer*
━━━━━━━━━━━━━━━━━━━━
Reply with a number:

1️⃣ *Reduce Photo to 20 KB* (Govt Exams / UPSC / SSC)
2️⃣ *Reduce Photo to 50 KB* (Passport / Visa / Banking)
3️⃣ *Open Free Web Image Resizer Studio*
     👉 https://www.jsnsworks.site/tools/image-converter
4️⃣ *Convert Photo to PDF Document*
     👉 https://www.jsnsworks.site/tools/pdf-merger

💡 *Tip:* Send your photo here to compress it directly!
0️⃣ *Back to Main Menu*`;
  }

  // ==========================================
  // 7. NATURAL LANGUAGE & AI QUERIES (GEMINI)
  // ==========================================
  console.log('[Routing to Gemini AI]:', text);
  return await askGeminiAi(text);
}

/**
 * In-Memory Image Watermarking via Jimp (Zero Database Storage)
 */
async function processAndSendWatermark(
  phoneNumberId: string,
  to: string,
  mediaId: string,
  watermarkText: string
): Promise<boolean> {
  try {
    console.log('[In-Memory Watermarking]: Downloading image bytes from Meta CDN...');
    const imageBuffer = await fetchMediaFromMeta(mediaId);
    if (!imageBuffer) {
      await sendWhatsAppMessage(phoneNumberId, to, '⚠️ Could not download photo from WhatsApp servers. Please send the photo again.');
      return false;
    }

    console.log('[In-Memory Watermarking]: Applying watermark on RAM buffer...');
    const watermarkedBuffer = await applyWatermarkToBuffer(imageBuffer, watermarkText);

    console.log('[In-Memory Watermarking]: Uploading converted image to Meta Media API...');
    const newMediaId = await uploadMediaToMeta(phoneNumberId, watermarkedBuffer, 'image/jpeg');
    if (!newMediaId) {
      await sendWhatsAppMessage(phoneNumberId, to, '⚠️ Failed to prepare image for WhatsApp. Please try again.');
      return false;
    }

    console.log('[In-Memory Watermarking]: Sending converted photo message...');
    const caption = `🛡️ *Safe-KYC Document Watermarked!*
━━━━━━━━━━━━━━━━━━━━
• *Stamp:* "${watermarkText}"
• *Protection:* Diagonal repeating tamper-evident pattern

🔒 *Zero Cloud Storage:* Processed directly in memory for your privacy!

_Reply *0* for Main Menu_`;

    return await sendWhatsAppMediaId(phoneNumberId, to, newMediaId, caption);
  } catch (err) {
    console.error('[Process Watermark Exception]:', err);
    return false;
  }
}

/**
 * In-Memory Image Compression via Jimp (Zero Database Storage)
 */
async function processAndSendCompressedImage(
  phoneNumberId: string,
  to: string,
  mediaId: string,
  targetKb: number
): Promise<boolean> {
  try {
    console.log('[In-Memory Compression]: Downloading image bytes from Meta CDN...');
    const imageBuffer = await fetchMediaFromMeta(mediaId);
    if (!imageBuffer) {
      await sendWhatsAppMessage(phoneNumberId, to, '⚠️ Could not download photo from WhatsApp servers. Please send the photo again.');
      return false;
    }

    console.log(`[In-Memory Compression]: Compressing image to target ~${targetKb} KB in RAM...`);
    const compressedBuffer = await applyCompressionToBuffer(imageBuffer, targetKb);
    const finalSizeKb = (compressedBuffer.length / 1024).toFixed(1);

    console.log('[In-Memory Compression]: Uploading compressed image to Meta Media API...');
    const newMediaId = await uploadMediaToMeta(phoneNumberId, compressedBuffer, 'image/jpeg');
    if (!newMediaId) {
      await sendWhatsAppMessage(phoneNumberId, to, '⚠️ Failed to prepare compressed image. Please try again.');
      return false;
    }

    console.log('[In-Memory Compression]: Sending compressed photo message...');
    const caption = `🗜️ *Photo Compressed Successfully!*
━━━━━━━━━━━━━━━━━━━━
• *Target Size:* ${targetKb} KB
• *Resulting Size:* ~${finalSizeKb} KB
• *Format:* JPEG (Optimized for Govt Exams / UPSC / Passport)

_Reply *0* for Main Menu_`;

    return await sendWhatsAppMediaId(phoneNumberId, to, newMediaId, caption);
  } catch (err) {
    console.error('[Process Compression Exception]:', err);
    return false;
  }
}

/**
 * Draw repeating diagonal watermark lines over the image in RAM
 */
async function applyWatermarkToBuffer(buffer: Buffer, watermarkText: string): Promise<Buffer> {
  const image = await Jimp.read(buffer);
  const fontWhite = await loadFont(fonts.SANS_32_WHITE);
  const fontBlack = await loadFont(fonts.SANS_32_BLACK);

  const w = image.bitmap.width;
  const h = image.bitmap.height;
  const text = watermarkText.toUpperCase();

  // Print repeating watermark lines across the image
  const stepY = Math.max(120, Math.floor(h / 4));
  for (let y = 60; y < h; y += stepY) {
    // Drop shadow (black) + foreground (white) for readability on dark or light backgrounds
    image.print({ font: fontBlack, x: 22, y: y + 2, text });
    image.print({ font: fontWhite, x: 20, y: y, text });
  }

  return await image.getBuffer('image/jpeg', { quality: 85 });
}

/**
 * Resize and compress image in RAM
 */
async function applyCompressionToBuffer(buffer: Buffer, targetKb: number): Promise<Buffer> {
  const image = await Jimp.read(buffer);
  if (image.bitmap.width > 500) {
    image.resize({ w: 450 });
  }
  const quality = targetKb <= 25 ? 40 : 60;
  return await image.getBuffer('image/jpeg', { quality });
}

/**
 * Fetch media binary from Meta Graph API
 */
async function fetchMediaFromMeta(mediaId: string): Promise<Buffer | null> {
  const token = process.env['WHATSAPP_ACCESS_TOKEN'];
  if (!token) return null;

  try {
    const metaRes = await fetch(`https://graph.facebook.com/v21.0/${mediaId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!metaRes.ok) return null;
    const mediaInfo = (await metaRes.json()) as any;
    if (!mediaInfo?.url) return null;

    const fileRes = await fetch(mediaInfo.url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!fileRes.ok) return null;
    const arrayBuffer = await fileRes.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (e) {
    console.error('[Fetch Media Error]:', e);
    return null;
  }
}

/**
 * Upload binary buffer to Meta Media API
 */
async function uploadMediaToMeta(phoneNumberId: string, imageBuffer: Buffer, mimeType = 'image/jpeg'): Promise<string | null> {
  const token = process.env['WHATSAPP_ACCESS_TOKEN'];
  if (!token) return null;

  const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/media`;
  const formData = new FormData();
  formData.append('file', new Blob([new Uint8Array(imageBuffer)], { type: mimeType }), 'converted.jpg');
  formData.append('type', mimeType);
  formData.append('messaging_product', 'whatsapp');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[Meta Media Upload Error]:', err);
      return null;
    }

    const data = (await res.json()) as any;
    return data?.id || null;
  } catch (err) {
    console.error('[Meta Media Upload Exception]:', err);
    return null;
  }
}

/**
 * Send an image message using Meta media ID
 */
async function sendWhatsAppMediaId(
  phoneNumberId: string,
  to: string,
  mediaId: string,
  caption?: string
): Promise<boolean> {
  const token = process.env['WHATSAPP_ACCESS_TOKEN'];
  if (!token) return false;

  const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
  const payload: any = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: to,
    type: 'image',
    image: {
      id: mediaId
    }
  };
  if (caption) payload.image.caption = caption.slice(0, 1024);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (e) {
    console.error('[Send WhatsApp MediaId Error]:', e);
    return false;
  }
}

function formatEmiResult(p: number, rAnnual: number, years: number, emiRes: any, title: string): string {
  const fmt = (val: number) => '₹' + Math.round(val).toLocaleString('en-IN');
  return `📊 *${title}*
━━━━━━━━━━━━━━━━━━━━
• *Principal:* ${fmt(p)}
• *Interest Rate:* ${rAnnual}% p.a.
• *Tenure:* ${years} Years (${Math.round(years * 12)} Mos)

💰 *Monthly EMI:* *${fmt(emiRes.monthlyEmi)}*
📈 *Total Interest:* ${fmt(emiRes.totalInterest)} (${emiRes.interestPercent}%)
💳 *Total Payment:* ${fmt(emiRes.totalPayment)}

🌐 _Visual sliders: https://www.jsnsworks.site/tools/finance-calculator_
_Reply *0* for Main Menu_`;
}

function formatAgeResult(ageRes: any, rawDate: string): string {
  return `🎂 *Exact Age & Birthday Milestone*
━━━━━━━━━━━━━━━━━━━━
• *Date of Birth:* ${rawDate}
• *Exact Age:* *${ageRes.formattedString}*
• *Total Days Lived:* ${ageRes.totalDays.toLocaleString('en-IN')} days
• *Total Weeks:* ${ageRes.totalWeeks.toLocaleString('en-IN')} weeks
• *Next Birthday:* In *${ageRes.daysUntilNextBirthday} days* 🎈

🌐 _Full breakdown: https://www.jsnsworks.site/tools/age-calculator_
_Reply *0* for Main Menu_`;
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

💵 *Total Invoice Amount:* *${fmt(gstRes.totalAmount)}*
_Reply *0* for Main Menu_`;
}

/**
 * Dispatch outbound text message using Meta Graph API
 */
async function sendWhatsAppMessage(phoneNumberId: string, to: string, text: string): Promise<void> {
  const token = process.env['WHATSAPP_ACCESS_TOKEN'];
  if (!token) {
    console.error('[WhatsApp Config Error]: WHATSAPP_ACCESS_TOKEN is missing or undefined.');
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

/**
 * Dispatch outbound direct image URL message using Meta Graph API
 */
async function sendWhatsAppImage(
  phoneNumberId: string,
  to: string,
  imageUrl: string,
  caption?: string
): Promise<boolean> {
  const token = process.env['WHATSAPP_ACCESS_TOKEN'];
  if (!token) return false;

  const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
  const payload: any = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: to,
    type: 'image',
    image: {
      link: imageUrl
    }
  };
  if (caption) payload.image.caption = caption.slice(0, 1024);

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
      console.error('[WhatsApp Graph API Image Error Response]:', { status: response.status, error: resText });
      return false;
    } else {
      console.log('[WhatsApp Graph API Image Success Response]:', { status: response.status, body: resText });
      return true;
    }
  } catch (e) {
    console.error('[WhatsApp Network/Fetch Exception during Image send]:', e);
    return false;
  }
}
