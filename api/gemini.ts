/**
 * Google Gemini AI Integration for QuickTools WhatsApp Bot
 * Uses gemini-3.1-flash-lite for real-time natural conversational intelligence
 */

declare const process: {
  env: Record<string, string | undefined>;
};

const SYSTEM_INSTRUCTION = `You are QuickTools AI, an intelligent, helpful, and concise WhatsApp assistant by JSANS DevStudio.

CRITICAL FORMATTING & STYLE RULES:
- BE DIRECT, ACCURATE, AND CRISP. Keep responses concise and easy to read on mobile screens.
- LIST FORMATTING: For lists, always use clean bullet points (•) or numbers (1., 2.). NEVER output markdown asterisks like "* *" or "- *".
- BOLDING: Use WhatsApp bolding (*text*) cleanly for emphasis.
- NEVER append forced or irrelevant links to jsnsworks.site (e.g. NEVER say "Need recipes? Visit jsnsworks.site"). ONLY share a link when the user specifically asks for a calculator, PDF merger, document watermarker, or file conversion tool.
- If the user asks for a recipe, explanation, translation, or general query: provide the best, most practical answer directly.
- If the user asks to write an email, bio, or text: give the ready-to-copy draft immediately.
- Support English, Hindi, Hinglish, Telugu, Tamil naturally with friendly emojis.`;

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
