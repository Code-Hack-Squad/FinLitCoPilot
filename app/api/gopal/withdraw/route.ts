import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fund } = body;

    const systemPrompt = `You are FinLit AI. The user is trying to withdraw funds during a 10% market crash. Warn them that withdrawing locks in losses. Use their portfolio data to show how much potential future gain they are sacrificing. Provide a short, data-driven warning.`;

    const userMessage = `Fund: ${fund?.name}
Invested Amount: ₹${fund?.investedAmount}
Current Valuation: ₹${fund?.currentValuation}
Asset Class: ${fund?.assetClass}
XIRR: ${fund?.xirr}%`;

    if (aiClient) {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              warningText: { 
                type: Type.STRING,
                description: 'The dynamic, data-driven warning message from Gopal AI.'
              }
            },
            required: ['warningText']
          }
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text);
        return NextResponse.json(result);
      }
    }

    // Offline Fallback
    const fallback = `The market is currently down by 10%. Withdrawing your funds from ${fund?.name || 'this portfolio'} now will permanently lock in your losses. Historically, markets recover within a few months.`;
    return NextResponse.json({ warningText: fallback });

  } catch (error: any) {
    console.error('Error in withdraw API route:', error);
    return NextResponse.json({
      warningText: 'The market is currently down by 10%. Withdrawing your funds now will permanently lock in your losses. Historically, markets recover within a few months.'
    });
  }
}
