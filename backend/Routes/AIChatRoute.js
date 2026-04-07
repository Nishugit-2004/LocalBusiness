import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AI_KEY_NOT_SET');

const SYSTEM_PROMPT = `
You are the Virtual Shop AI Assistant for "VirtualShop", a platform connecting local shops with customers.
Your goal is to assist both Customers and Sellers based on their role.

Role-Based Guidance:
- If the user is a CUSTOMER:
  * Help them find shops near their location.
  * Recommend products (daily needs, hardware, fashion, electronics, etc.).
  * Advise on tracking orders in the "Orders" section.
  * Answer queries about payment (Stripe/Razorpay) and delivery.

- If the user is a SELLER (Admin):
  * Guide them on managing their shop in the "Seller Dashboard".
  * Explain how to add/edit products and menu items.
  * Help them understand how to view and manage customer orders.
  * Provide tips for business growth on VirtualShop.

General Rules:
- Keep responses concise, friendly, and professional.
- If an API key is not set, provide helpful static information about the platform.
- Use emojis to make the conversation engaging.
- Encourage users to sign up or log in if they haven't to access personalized features.
`;

router.post('/', async (req, res) => {
  const { message, role, history } = req.body;
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey || apiKey === 'AI_KEY_NOT_SET' || apiKey.length < 10) {
    // Fallback if no API key is provided or it's invalid
    return res.json({ 
      reply: "Hi! I'm your VirtualShop assistant. My dynamic AI features are currently waiting for a valid API key to be set in the Vercel dashboard. I can still help you browse shops and manage your cart in the meantime! 🛍️" 
    });
  }

  try {
    // Sanitize the key of any accidental quotes or whitespace
    const cleanKey = apiKey.replace(/['"]+/g, '').trim();
    
    if (!genAI) {
        genAI = new GoogleGenerativeAI(cleanKey);
    }

    // Try multiple model strings for maximum compatibility with Vercel and Google Cloud regions
    const modelNames = ["gemini-1.5-flash", "gemini-pro-1.5", "gemini-pro"];
    let lastError = null;
    for (const name of modelNames) {
        try {
            const tempModel = genAI.getGenerativeModel({ 
                model: name,
                generationConfig: { maxOutputTokens: 250 }
            });
            const testResult = await tempModel.generateContent("hi");
            if (testResult) {
                finalModel = tempModel;
                break;
            }
        } catch (e) {
            console.warn(`Model ${name} failed:`, e.message);
            lastError = e;
            continue;
        }
    }

    if (!finalModel) {
        throw new Error(`All models failed. Last error: ${lastError?.message || 'Unknown'}`);
    }
    
    const fullPrompt = `${SYSTEM_PROMPT}\nUser Role: ${role || 'Guest'}\nUser Message: ${message}`;
    const result = await finalModel.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    res.json({ reply: text });
  } catch (error) {
    console.error('🚨 Gemini API Failure:', error.message);
    res.status(500).json({ reply: `AI Error: ${error.message}` });
  }
});

export default router;
