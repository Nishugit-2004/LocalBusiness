import express from 'express';
const router = express.Router();

const SYSTEM_PROMPT = `You are the VirtualShop AI Assistant, a helpful guide for a local multi-shop e-commerce platform. 
Help users find products, track orders, or manage their own shops. Keep answers brief (under 100 words).`;

router.post('/', async (req, res) => {
  const { message, role } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.length < 10) {
    return res.status(500).json({ reply: "Authorization issue: Gemini API Key not set! 🔑" });
  }

  try {
    // Sanitize the key
    const cleanKey = apiKey.replace(/['"]+/g, '').trim();
    
    const modelNames = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"];
    let lastError = null;
    let replyText = null;

    for (const modelName of modelNames) {
        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${cleanKey}`;
            const payload = {
                contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\nUser Role: ${role || 'Guest'}\nUser Message: ${message}` }] }],
                generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
                replyText = data.candidates[0].content.parts[0].text;
                break; // Found a working model!
            } else {
                lastError = data.error?.message || `Status ${response.status}`;
            }
        } catch (e) {
            lastError = e.message;
            continue;
        }
    }

    if (!replyText) {
      throw new Error(`All models failed. Last error: ${lastError}`);
    }

    res.json({ reply: replyText });

  } catch (error) {
    console.error('🚨 Gemini API Failure:', error.message);
    res.status(500).json({ 
      reply: `AI Direct-Link Error: ${error.message}. Please check your Key region! 🛠️` 
    });
  }
});

export default router;
