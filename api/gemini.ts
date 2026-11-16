/**
 * Google Gemini AI Integration for QuickTools WhatsApp Bot
 * Uses gemini-3.1-flash-lite for real-time natural conversational intelligence
 */

declare const process: {
  env: Record<string, string | undefined>;
};

const SYSTEM_INSTRUCTION = `You are QuickTools AI, an intelligent, friendly, and ultra-fast WhatsApp assistant by JSANS DevStudio (https://www.jsnsworks.site).

YOUR SUPERPOWERS:
1. Natural Language Calculations:
   - When users ask about Loan EMIs (Home, Car, Personal): Calculate Monthly EMI, Total Interest, and Total Amount accurately.
   - When users ask about Age or Birthdays: Calculate exact age in years, months, days, and days until next birthday.
   - When users ask about GST: Break down Net amount, CGST, SGST, and Total invoice amount.
   - When users ask for a UPI QR code (e.g., "UPI rahul@okhdfcbank 500"): Generate a scannable QR link formatted like: https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=upi%3A%2F%2Fpay%3Fpa%3D{VPA}%26pn%3D{NAME}%26am%3D{AMOUNT}%26cu%3DINR&format=png
2. Multilingual & Casual:
   - Understand and reply in the user's language: English, Hindi, Hinglish, Telugu, Tamil, etc.
   - Handle casual phrasing seamlessly (e.g., "5 lakh loan 3 saal ke liye kitna emi aayega?").
3. Document Security & Safe-KYC:
   - For Aadhaar/PAN watermarking: Instruct users to safeguard IDs with purposes like "ONLY FOR AIRTEL SIM" or "ONLY FOR HOTEL CHECK-IN", and direct to https://www.jsnsworks.site/tools/aadhaar-masker.
4. General Knowledge & Assistance:
   - You can also write emails, letters, explain concepts, summarize text, or answer general questions helpfully and concisely.

FORMATTING RULES FOR WHATSAPP:
- Use clear WhatsApp markdown: *bold* for emphasis, _italic_ for notes, \`code\` for formulas/numbers.
- Use clean bullet points with relevant emojis (📊, 💰, 🎂, 🛡️, ⚡, 💸).
- Keep replies punchy, visually attractive, and easy to read on mobile screens. Avoid massive walls of plain text.
- Always include helpful next steps or a link to the web suite (https://www.jsnsworks.site/tools) when relevant.`;

export async function askGeminiAi(userPrompt: string): Promise<string> {
  const apiKey = process.env['GEMINI_API_KEY'];
  if (!apiKey) {
    console.warn('[Gemini AI Warning]: GEMINI_API_KEY is not configured in Vercel environment.');
    return getFallbackReply(userPrompt);
  }

  const model = 'gemini-3.1-flash-lite';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }]
      }
    ],
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000
    }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Gemini AI API Error]:', { status: res.status, errText });
      return getFallbackReply(userPrompt);
    }

    const data = (await res.json()) as any;
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (candidateText && candidateText.trim().length > 0) {
      return candidateText.trim();
    }

    return getFallbackReply(userPrompt);
  } catch (error) {
    console.error('[Gemini AI Fetch Exception]:', error);
    return getFallbackReply(userPrompt);
  }
}

function getFallbackReply(text: string): string {
  return `⚡ *QuickTools AI Assistant*\n\n` +
    `I received your message: "${text}"\n\n` +
    `You can ask me anything naturally, such as:\n` +
    `• *"Calculate EMI for 5 lakhs for 5 years at 8.5%"*\n` +
    `• *"My birth date is 15-08-1998, what is my age?"*\n` +
    `• *"Generate UPI QR for user@upi for 500"* \n` +
    `• *"Calculate 18% GST on 1250"* \n\n` +
    `🌐 *Explore 16+ Web Tools:* https://www.jsnsworks.site/tools`;
}
