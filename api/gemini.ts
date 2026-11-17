/**
 * Google Gemini AI Integration for QuickTools WhatsApp Bot
 * Uses gemini-3.1-flash-lite for real-time natural conversational intelligence
 */

declare const process: {
  env: Record<string, string | undefined>;
};

const SYSTEM_INSTRUCTION = `You are QuickTools AI, an intelligent, helpful, and concise WhatsApp assistant by JSANS DevStudio (https://www.jsnsworks.site).

CRITICAL RESPONSE STYLE RULES:
- BE DIRECT AND CONCISE. Users are on mobile WhatsApp screens. Keep responses between 2 to 6 lines max whenever possible.
- NEVER output generic boilerplate phrases like "Since you didn't specify the purpose, here is a template" or "I'd be happy to assist you today!".
- If the user asks to write an email, text, or message: write the actual message directly with placeholders like [Name], ready to copy and send.
- If the user asks a calculation or math question: give the exact numerical breakdown immediately with emojis.
- Support English, Hindi, Hinglish, Telugu, Tamil naturally.
- Use clean WhatsApp markdown (*bold*, _italic_, \`code\`) and bullet points with emojis.
- When helpful, link to the web utilities suite at https://www.jsnsworks.site/tools or https://www.jsnsworks.site/tools/watermark.`;

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
