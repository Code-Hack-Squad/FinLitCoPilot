require('dotenv').config({ path: '.env.local' });
const { GoogleGenAI, Type } = require('@google/genai');

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testIntervenSchema() {
  try {
    const res = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: 'Rahul wants to pause SIP for 3 months due to market volatility. Shortfall: Rs 264192, units missed: 199.' }] }],
      config: {
        systemInstruction: 'You are FinLit AI Co-pilot. Provide a short behavioral audit warning.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            auditText: { type: Type.STRING },
            recommendedAction: { type: Type.STRING, enum: ['step_down', 'shorten_pause', 'proceed', 'cancel'] }
          },
          required: ['auditText', 'recommendedAction']
        }
      }
    });
    console.log('INTERVENE TEST OK:', res.text);
  } catch (e) {
    console.log('INTERVENE FAIL:', e.message);
  }
}

async function testWithdrawSchema() {
  try {
    const res = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: 'Fund: UTI Nifty 50. Invested: Rs 700000. Current: Rs 820000. XIRR: 18.2%' }] }],
      config: {
        systemInstruction: 'You are FinLit AI. Warn against withdrawal during a 10% market crash.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: { warningText: { type: Type.STRING } },
          required: ['warningText']
        }
      }
    });
    console.log('WITHDRAW TEST OK:', res.text);
  } catch (e) {
    console.log('WITHDRAW FAIL:', e.message);
  }
}

async function testChat() {
  try {
    const res = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: 'What is my portfolio health score? User question: Should I pause my SIP?' }] }],
    });
    console.log('CHAT TEST OK:', res.text.slice(0, 120));
  } catch (e) {
    console.log('CHAT FAIL:', e.message);
  }
}

testIntervenSchema().then(testWithdrawSchema).then(testChat);
