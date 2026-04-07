import express from 'express';
const router = express.Router();

const SYSTEM_PROMPT = `You are the VirtualShop AI Assistant, a helpful guide for a local multi-shop e-commerce platform. 
Help users find products, track orders, or manage their own shops. Keep answers brief (under 100 words).`;

router.post('/', async (req, res) => {
  const { message, role } = req.body;
  const apiKey = (process.env.GEMINI_API_KEY || '').replace(/['"]+/g, '').trim();

  if (!apiKey || apiKey.length < 10) {
    return res.status(500).json({ reply: "Authorization issue: Gemini API Key not set! 🔑" });
  }

  try {
    // STEP 1: Discovery. Specifically get only models allowed for this key.
    const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    const listResp = await fetch(listUrl);
    const listData = await listResp.json();

    if (!listResp.ok) throw new Error(listData.error?.message || "Discovery Error");

    const models = listData.models || [];
    // Prefer gemini-1.5-flash, then gemini-pro, then anything available
    const chosen = models.find(m => m.name.includes('gemini-1.5-flash')) || 
                   models.find(m => m.name.includes('gemini-pro')) || 
                   models[0];

    if (!chosen) throw new Error("No available models found for this key.");

    // STEP 2: Use the exact name Google provided
    const apiUrl = `https://generativelanguage.googleapis.com/v1/${chosen.name}:generateContent?key=${apiKey}`;
    
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
    if (!response.ok) throw new Error(data.error?.message || `API Response Error: ${response.status}`);

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) throw new Error("AI returned empty content");

    res.json({ reply });

  } catch (error) {
    console.error('🚨 AI Error:', error.message);
    res.status(500).json({ reply: `AI Discovery Error: ${error.message} 🛠️` });
  }
});

export default router;
