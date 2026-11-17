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
 * Powered by Meta WhatsApp Cloud API
 * Features:
 * - Numbered Main Menu (1 - 6, 0)
 * - Numbered Submenus (11-14, 21-23, 31-36, 41-45, 51-55, 61-64, 0)
 * - Direct Native Image Delivery (UPI QR, Barcodes, Custom QR)
 * - Google Gemini AI Fallthrough for natural queries
 */

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
        version: '2.0.0',
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

        if (messageData.type === 'text' && messageData.text?.body) {
          const rawInput = messageData.text.body.trim();
          replyText = await processUserCommand(rawInput, phoneNumberId, from);
        } else if (messageData.type === 'interactive') {
          const buttonId = messageData.interactive?.button_reply?.id || messageData.interactive?.list_reply?.id || '';
          replyText = await processUserCommand(buttonId, phoneNumberId, from);
        } else if (messageData.type === 'image') {
          replyText = `📸 *Photo Received!*
━━━━━━━━━━━━━━━━━━━━
Reply with a *number* to choose an action:

5️⃣1️⃣ *Safe-KYC Hotel Check-In Watermark*
5️⃣2️⃣ *Safe-KYC SIM Activation Watermark*
5️⃣5️⃣ *Open In-Browser Watermark Studio*
     👉 https://www.jsnsworks.site/tools/watermark

6️⃣1️⃣ *Compress Photo to 20 KB* (Govt Exams)
6️⃣2️⃣ *Compress Photo to 50 KB* (Passport/Visa)
6️⃣3️⃣ *Open Free Web Photo Resizer*
     👉 https://www.jsnsworks.site/tools/image-converter

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

        // If replyText is non-empty, send text message (if an image was already sent, replyText will be empty)
        if (replyText && phoneNumberId) {
          console.log('[WhatsApp Dispatching Outbound Reply]:', { to: from, replySnippet: replyText.slice(0, 60) });
          await sendWhatsAppMessage(phoneNumberId, from, replyText);
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
 * Main Menu Display
 */
function getMainMenuText(): string {
  return `👋 *Welcome to QuickTools AI!*
━━━━━━━━━━━━━━━━━━━━
Reply with any *number (1 - 6)*:

1️⃣ *Loan & EMI Calculator*
2️⃣ *Exact Age & Birthday Milestone*
3️⃣ *UPI QR & Barcode (Sends Photo 🖼️)*
4️⃣ *GST Tax Calculator*
5️⃣ *Safe-KYC Document Watermarker*
6️⃣ *Photo Size Reducer (20KB / 50KB)*
0️⃣ *Main Menu*

💬 _Or ask me any question in plain words!_`;
}

/**
 * Command processor - Handles numbered menus, submenus, direct images & Gemini AI
 */
async function processUserCommand(rawText: string, phoneNumberId?: string, from?: string): Promise<string> {
  const text = rawText.trim();
  const upper = text.toUpperCase();

  // ==========================================
  // 0. MAIN MENU & GREETINGS
  // ==========================================
  if (['0', 'M', 'MENU', 'BACK', 'HOME', 'START', 'HELP', 'HI', 'HELLO', 'TOOLS'].includes(upper)) {
    return getMainMenuText();
  }

  // ==========================================
  // TOOL 1: LOAN & EMI CALCULATOR
  // ==========================================
  if (upper === '1' || upper === 'LOAN' || upper === 'EMI') {
    return `📊 *Loan EMI Calculator*
━━━━━━━━━━━━━━━━━━━━
Reply with a number:

1️⃣1️⃣ *Home Loan:* ₹25L @ 8.5% for 15 Yrs
1️⃣2️⃣ *Car Loan:* ₹8L @ 9.0% for 5 Yrs
1️⃣3️⃣ *Personal Loan:* ₹3L @ 12.0% for 3 Yrs
1️⃣4️⃣ *Custom Loan:* Type \`EMI <Amount> <Rate> <Years>\`
     _(e.g. \`EMI 500000 8.5 5\`)_

0️⃣ *Back to Main Menu*`;
  }

  // Presets: 11, 12, 13 (and legacy 1A, 1B, 1C)
  if (upper === '11' || upper === '1A') {
    const res = calculateLoanEmi(2500000, 8.5, 15);
    return formatEmiResult(2500000, 8.5, 15, res, 'Home Loan Preset');
  }
  if (upper === '12' || upper === '1B') {
    const res = calculateLoanEmi(800000, 9.0, 5);
    return formatEmiResult(800000, 9.0, 5, res, 'Car Loan Preset');
  }
  if (upper === '13' || upper === '1C') {
    const res = calculateLoanEmi(300000, 12.0, 3);
    return formatEmiResult(300000, 12.0, 3, res, 'Personal Loan Preset');
  }
  if (upper === '14') {
    return `✏️ *Custom Loan EMI Calculator*
━━━━━━━━━━━━━━━━━━━━
Reply in this format:
\`EMI <Amount> <Rate%> <Years>\`

_Examples:_
• \`EMI 1000000 8.5 10\` (₹10 Lakhs, 8.5%, 10 Yrs)
• \`EMI 500000 10.5 3\` (₹5 Lakhs, 10.5%, 3 Yrs)

_Reply *0* for Main Menu_`;
  }

  // Custom EMI syntax: EMI 500000 8.5 5
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

  // ==========================================
  // TOOL 2: AGE & BIRTHDAY CALCULATOR
  // ==========================================
  if (upper === '2' || upper === 'AGE') {
    return `🎂 *Exact Age & Birthday Milestone*
━━━━━━━━━━━━━━━━━━━━
Reply with a number:

2️⃣1️⃣ *Demo:* Born 01-01-2000
2️⃣2️⃣ *Demo:* Born 15-08-1995
2️⃣3️⃣ *Calculate your Age:* Type \`AGE DD-MM-YYYY\`
     _(e.g. \`AGE 25-12-1998\`)_

0️⃣ *Back to Main Menu*`;
  }

  if (upper === '21') {
    const ageRes = calculateExactAge('01-01-2000');
    if (ageRes) return formatAgeResult(ageRes, '01-01-2000');
  }
  if (upper === '22') {
    const ageRes = calculateExactAge('15-08-1995');
    if (ageRes) return formatAgeResult(ageRes, '15-08-1995');
  }
  if (upper === '23') {
    return `🎂 *Calculate Your Exact Age*
━━━━━━━━━━━━━━━━━━━━
Reply with your birth date:
👉 \`AGE DD-MM-YYYY\`
_Example:_ \`AGE 15-08-1998\`

_Reply *0* for Main Menu_`;
  }

  // Custom Age format: AGE 15-08-1998 or direct date like 15-08-1998
  const dateMatch = text.match(/^(?:AGE\s+)?(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})$/i);
  if (dateMatch) {
    const rawDate = dateMatch[1];
    const ageRes = calculateExactAge(rawDate);
    if (ageRes) {
      return formatAgeResult(ageRes, rawDate);
    }
  }

  // ==========================================
  // TOOL 3: UPI QR & BARCODE (DIRECT IMAGE SENDER)
  // ==========================================
  if (upper === '3' || upper === 'QR' || upper === 'BARCODE') {
    return `📱 *UPI Payment QR & Barcode Generator*
━━━━━━━━━━━━━━━━━━━━
Reply with a number to receive a *direct photo message 🖼️*:

3️⃣1️⃣ *Demo UPI QR:* ₹500 to store@upi (Sends Image)
3️⃣2️⃣ *Demo UPI QR:* ₹1,000 to merchant@upi (Sends Image)
3️⃣3️⃣ *Custom UPI QR:* Type \`UPI <VPA> <Amount>\`
     _(e.g. \`UPI rahul@upi 500\`)_
3️⃣4️⃣ *Demo Barcode:* EAN-13 Sample (Sends Image)
3️⃣5️⃣ *Custom Barcode:* Type \`BARCODE <Number>\`
     _(e.g. \`BARCODE 890123456789\`)_
3️⃣6️⃣ *Custom Text/Link QR:* Type \`QR <Text or Link>\`

0️⃣ *Back to Main Menu*`;
  }

  // 31: Demo UPI QR (₹500) -> Direct Image Delivery
  if (upper === '31') {
    const demoVpa = 'store@upi';
    const demoAmt = 500;
    const upiUri = buildUpiUri({ vpa: demoVpa, amount: demoAmt, payeeName: 'JSANS Store' });
    const encoded = encodeURIComponent(upiUri);
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encoded}&format=png`;
    const caption = `📱 *Demo UPI QR Code (₹500)*
━━━━━━━━━━━━━━━━━━━━
• *Payee VPA:* \`${demoVpa}\`
• *Amount:* ₹500
• *Note:* Demo Payment

📲 *Scan directly from WhatsApp using GPay, PhonePe, or Paytm!*

_Reply *0* for Main Menu or *3* for UPI options._`;

    if (phoneNumberId && from) {
      const sent = await sendWhatsAppImage(phoneNumberId, from, qrImageUrl, caption);
      if (sent) return '';
    }
    return `${caption}\n\n🔗 ${qrImageUrl}`;
  }

  // 32: Demo UPI QR (₹1,000) -> Direct Image Delivery
  if (upper === '32') {
    const demoVpa = 'merchant@upi';
    const demoAmt = 1000;
    const upiUri = buildUpiUri({ vpa: demoVpa, amount: demoAmt, payeeName: 'JSANS Merchant' });
    const encoded = encodeURIComponent(upiUri);
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encoded}&format=png`;
    const caption = `📱 *Demo UPI QR Code (₹1,000)*
━━━━━━━━━━━━━━━━━━━━
• *Payee VPA:* \`${demoVpa}\`
• *Amount:* ₹1,000
• *Note:* Merchant Demo Payment

📲 *Scan directly from WhatsApp using GPay, PhonePe, or Paytm!*

_Reply *0* for Main Menu or *3* for UPI options._`;

    if (phoneNumberId && from) {
      const sent = await sendWhatsAppImage(phoneNumberId, from, qrImageUrl, caption);
      if (sent) return '';
    }
    return `${caption}\n\n🔗 ${qrImageUrl}`;
  }

  if (upper === '33') {
    return `✏️ *Create Custom UPI Payment QR*
━━━━━━━━━━━━━━━━━━━━
Reply in this format:
\`UPI <yourVPA> <Amount>\`

_Examples:_
• \`UPI 9876543210@paytm 500\`
• \`UPI business@okhdfcbank 1500\`
• \`UPI rahul@upi\` (any amount)

_I will immediately generate and send the scannable QR photo!_`;
  }

  // 34: Demo Barcode -> Direct Image Delivery
  if (upper === '34') {
    const barcodeValue = '8901030865421';
    const barcodeImageUrl = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${barcodeValue}&scale=3&includetext=true`;
    const caption = `🏷️ *Demo Barcode (Code-128)*
━━━━━━━━━━━━━━━━━━━━
• *Code:* \`${barcodeValue}\`
• *Format:* Universal Code-128

_Scannable with any optical scanner or scanner app._

_Reply *0* for Main Menu or *3* for options._`;

    if (phoneNumberId && from) {
      const sent = await sendWhatsAppImage(phoneNumberId, from, barcodeImageUrl, caption);
      if (sent) return '';
    }
    return `${caption}\n\n🔗 ${barcodeImageUrl}`;
  }

  if (upper === '35') {
    return `🏷️ *Create Custom Barcode*
━━━━━━━━━━━━━━━━━━━━
Reply in this format:
\`BARCODE <Number or Code>\`

_Examples:_
• \`BARCODE 890123456789\`
• \`BARCODE SKU-99420\`

_I will immediately send the generated barcode image!_`;
  }

  if (upper === '36') {
    return `🔲 *Create Custom Text/URL QR*
━━━━━━━━━━━━━━━━━━━━
Reply in this format:
\`QR <Your Link or Text>\`

_Examples:_
• \`QR https://www.jsnsworks.site\`
• \`QR Welcome to our store!\`

_I will immediately send the generated QR photo!_`;
  }

  // Custom UPI command: UPI store@upi 500
  if (upper.startsWith('UPI')) {
    const upiConfig = parseUpiCommand(text);
    if (upiConfig) {
      const upiUri = buildUpiUri(upiConfig);
      const encoded = encodeURIComponent(upiUri);
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encoded}&format=png`;

      const amtText = upiConfig.amount ? `₹${upiConfig.amount.toLocaleString('en-IN')}` : 'Any Amount';
      const caption = `📱 *Instant UPI Payment QR Code!*
━━━━━━━━━━━━━━━━━━━━
• *Payee VPA:* \`${upiConfig.vpa}\`
• *Amount:* *${amtText}*
${upiConfig.transactionNote ? `• *Note:* ${upiConfig.transactionNote}\n` : ''}
📲 *Scan with GPay, PhonePe, or Paytm to pay!*

_Reply *0* for Main Menu_`;

      if (phoneNumberId && from) {
        const sent = await sendWhatsAppImage(phoneNumberId, from, qrImageUrl, caption);
        if (sent) return '';
      }
      return `${caption}\n\n🔗 ${qrImageUrl}`;
    }
  }

  // Custom Barcode command: BARCODE 123456
  if (upper.startsWith('BARCODE')) {
    const codeValue = text.replace(/^BARCODE\s*/i, '').trim();
    if (codeValue.length > 0) {
      const barcodeImageUrl = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(codeValue)}&scale=3&includetext=true`;
      const caption = `🏷️ *Barcode Generated!*
━━━━━━━━━━━━━━━━━━━━
• *Code:* \`${codeValue}\`
• *Format:* Universal Code-128

_Scannable with any optical scanner or scanner app._

_Reply *0* for Main Menu_`;

      if (phoneNumberId && from) {
        const sent = await sendWhatsAppImage(phoneNumberId, from, barcodeImageUrl, caption);
        if (sent) return '';
      }
      return `${caption}\n\n🔗 ${barcodeImageUrl}`;
    }
  }

  // Custom QR command: QR https://...
  if (upper.startsWith('QR')) {
    const qrData = text.replace(/^QR\s*/i, '').trim();
    if (qrData.length > 0) {
      const encoded = encodeURIComponent(qrData);
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encoded}&format=png`;
      const caption = `🔲 *Custom QR Code Generated!*
━━━━━━━━━━━━━━━━━━━━
• *Data:* ${qrData.slice(0, 100)}

_Scan with any phone camera or QR reader app._

_Reply *0* for Main Menu_`;

      if (phoneNumberId && from) {
        const sent = await sendWhatsAppImage(phoneNumberId, from, qrImageUrl, caption);
        if (sent) return '';
      }
      return `${caption}\n\n🔗 ${qrImageUrl}`;
    }
  }

  // ==========================================
  // TOOL 4: GST TAX CALCULATOR
  // ==========================================
  if (upper === '4' || upper === 'GST') {
    return `🧾 *GST Tax Calculator*
━━━━━━━━━━━━━━━━━━━━
Reply with a number:

4️⃣1️⃣ *18% GST on ₹1,000*
4️⃣2️⃣ *18% GST on ₹5,000*
4️⃣3️⃣ *12% GST on ₹2,500*
4️⃣4️⃣ *5% GST on ₹500*
4️⃣5️⃣ *Custom GST:* Type \`GST <Amount> <Rate>\`
     _(e.g. \`GST 4500 18\`)_

0️⃣ *Back to Main Menu*`;
  }

  if (upper === '41' || upper === '4A') return formatGstResult(1000, 18, calculateGst(1000, 18));
  if (upper === '42' || upper === '4B') return formatGstResult(5000, 18, calculateGst(5000, 18));
  if (upper === '43' || upper === '4C') return formatGstResult(2500, 12, calculateGst(2500, 12));
  if (upper === '44' || upper === '4D') return formatGstResult(500, 5, calculateGst(500, 5));
  if (upper === '45') {
    return `🧾 *Custom GST Calculator*
━━━━━━━━━━━━━━━━━━━━
Reply in this format:
\`GST <Amount> <Rate%>\`

_Examples:_
• \`GST 1500 18\` (18% GST on ₹1,500)
• \`GST 85000 28\` (28% GST on ₹85,000)

_Reply *0* for Main Menu_`;
  }

  if (upper.startsWith('GST') && text.split(/\s+/).length >= 3) {
    const parts = text.split(/\s+/).slice(1);
    const amount = parseFloat(parts[0].replace(/,/g, ''));
    const rate = parseFloat(parts[1].replace(/%/g, ''));

    if (!isNaN(amount) && !isNaN(rate) && amount > 0 && rate >= 0) {
      return formatGstResult(amount, rate, calculateGst(amount, rate));
    }
  }

  // ==========================================
  // TOOL 5: SAFE-KYC DOCUMENT WATERMARKER
  // ==========================================
  if (upper === '5' || upper === 'WATERMARK' || upper === 'KYC') {
    return `🛡️ *Safe-KYC Document Watermarker*
━━━━━━━━━━━━━━━━━━━━
Prevent identity theft & misuse of Aadhaar, PAN & Voter ID cards!

Reply with a number:

5️⃣1️⃣ *Hotel Check-In Preset Text & Guide*
5️⃣2️⃣ *SIM Card Activation Preset Text & Guide*
5️⃣3️⃣ *Bank Account / Loan KYC Preset Text & Guide*
5️⃣4️⃣ *Job Application Preset Text & Guide*
5️⃣5️⃣ *Open 100% Private Web Watermark Studio*
     👉 https://www.jsnsworks.site/tools/watermark

0️⃣ *Back to Main Menu*`;
  }

  if (upper === '51') {
    return `🏨 *Hotel Check-In Watermark Template*
━━━━━━━━━━━━━━━━━━━━
Copy & stamp this text across your Aadhaar/ID:

\`ONLY FOR HOTEL CHECK-IN AT [HOTEL NAME] ON [DATE]. NOT VALID FOR ANY OTHER PURPOSE.\`

🔒 *Safety Rules:*
• Never leave a clean unwatermarked copy with front-desk staff.
• Mask the first 8 digits of Aadhaar (only show last 4).

👉 *Stamp it immediately in your browser (100% private):*
https://www.jsnsworks.site/tools/watermark

_Reply *0* for Main Menu_`;
  }

  if (upper === '52') {
    return `📱 *SIM Activation Watermark Template*
━━━━━━━━━━━━━━━━━━━━
Copy & stamp this text across your Aadhaar/ID:

\`FOR [AIRTEL/JIO/VI] NEW SIM ACTIVATION ON [DATE] ONLY. NOT VALID FOR BANKING OR LOANS.\`

🔒 *Safety Rules:*
• Prevents telecom agents from issuing duplicate SIMs in your name.

👉 *Stamp it immediately in your browser:*
https://www.jsnsworks.site/tools/watermark

_Reply *0* for Main Menu_`;
  }

  if (upper === '53') {
    return `🏦 *Bank & Loan KYC Watermark Template*
━━━━━━━━━━━━━━━━━━━━
Copy & stamp this text across your ID:

\`SUBMITTED FOR [BANK NAME] SAVINGS ACCOUNT / LOAN APPLICATION NO. [XXX] ON [DATE] ONLY.\`

🔒 *Safety Rules:*
• Prevents loan fraud and mule account creation.

👉 *Stamp it immediately in your browser:*
https://www.jsnsworks.site/tools/watermark

_Reply *0* for Main Menu_`;
  }

  if (upper === '54') {
    return `💼 *Job Application Watermark Template*
━━━━━━━━━━━━━━━━━━━━
Copy & stamp this text across your ID:

\`SUBMITTED FOR BACKGROUND VERIFICATION AT [COMPANY NAME] ON [DATE] ONLY.\`

👉 *Stamp it immediately in your browser:*
https://www.jsnsworks.site/tools/watermark

_Reply *0* for Main Menu_`;
  }

  if (upper === '55') {
    return `🌐 *Safe-KYC In-Browser Watermark Studio*
━━━━━━━━━━━━━━━━━━━━
Safely protect documents without uploading to any server:
👉 https://www.jsnsworks.site/tools/watermark

✨ *Features:*
• 100% Client-Side HTML5 Canvas (Zero Cloud Upload)
• 1-Click Presets (Hotel, SIM, Bank, Job)
• Repeating fraud-prevention diagonal grid pattern
• Auto current date-stamping & instant PNG download!

_Reply *0* for Main Menu_`;
  }

  // ==========================================
  // TOOL 6: PHOTO SIZE REDUCER & RESIZER
  // ==========================================
  if (upper === '6' || upper === 'COMPRESS' || upper === 'PHOTO') {
    return `🗜️ *Photo Size Reducer & Image Resizer*
━━━━━━━━━━━━━━━━━━━━
Reply with a number:

6️⃣1️⃣ *Reduce Photo to 20 KB* (Govt Exams / UPSC / SSC)
6️⃣2️⃣ *Reduce Photo to 50 KB* (Passport / Visa / Banking)
6️⃣3️⃣ *Open Free Web Image Converter Studio*
     👉 https://www.jsnsworks.site/tools/image-converter
6️⃣4️⃣ *Convert Photo to PDF Document*
     👉 https://www.jsnsworks.site/tools/pdf-merger

0️⃣ *Back to Main Menu*`;
  }

  if (upper === '61') {
    return `📉 *Reduce Photo to 20 KB (UPSC / SSC / Govt Exams)*
━━━━━━━━━━━━━━━━━━━━
Most govt application portals reject photos larger than 20 KB:

👉 *1-Click 20 KB Resizer Tool:*
https://www.jsnsworks.site/tools/image-converter

1. Upload your photo or signature.
2. Select target size: *20 KB*.
3. Click *Download* — crisp quality, perfect dimensions!

_Reply *0* for Main Menu_`;
  }

  if (upper === '62') {
    return `📉 *Reduce Photo to 50 KB (Passport / Visa / Bank)*
━━━━━━━━━━━━━━━━━━━━
Standard passport & visa applications require under 50 KB:

👉 *1-Click 50 KB Resizer Tool:*
https://www.jsnsworks.site/tools/image-converter

1. Upload photo.
2. Choose target size: *50 KB*.
3. Download instantly with exact dimensions!

_Reply *0* for Main Menu_`;
  }

  if (upper === '63') {
    return `🖼️ *Free Web Image Resizer & Converter*
━━━━━━━━━━━━━━━━━━━━
Resize, crop, and convert JPG, PNG, WEBP:
👉 https://www.jsnsworks.site/tools/image-converter

_Reply *0* for Main Menu_`;
  }

  if (upper === '64' || upper.includes('CONVERT PDF')) {
    return `📄 *Convert Photo to PDF Document*
━━━━━━━━━━━━━━━━━━━━
Convert single or multiple images into a clean PDF document:
👉 https://www.jsnsworks.site/tools/pdf-merger

_Reply *0* for Main Menu_`;
  }

  // ==========================================
  // 7. NATURAL LANGUAGE & AI QUERIES (GEMINI)
  // ==========================================
  console.log('[Routing to Gemini AI]:', text);
  return await askGeminiAi(text);
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

/**
 * Dispatch outbound direct image message using Meta Graph API
 */
async function sendWhatsAppImage(
  phoneNumberId: string,
  to: string,
  imageUrl: string,
  caption?: string
): Promise<boolean> {
  const token = process.env['WHATSAPP_ACCESS_TOKEN'];
  if (!token) {
    console.error('[WhatsApp Config Error]: WHATSAPP_ACCESS_TOKEN is missing or undefined in environment variables.');
    return false;
  }

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

  if (caption) {
    payload.image.caption = caption.slice(0, 1024);
  }

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
