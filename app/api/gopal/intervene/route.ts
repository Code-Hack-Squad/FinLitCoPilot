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
  let body: any = {};
  
  try {
    body = await request.json();
    const { userName, reason, pauseMonths, fund, impact } = body;
    
    // Validate required fields
    if (!userName || !reason || !pauseMonths || !fund || !impact) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const systemPrompt = `You are FinLit AI Co-pilot. Prevent the user from making emotional decisions. If reason is Market volatility, explain Rupee Cost Averaging. If Cash crunch, suggest step-down. 
CRITICAL: You MUST strictly utilize the exact 'compoundedShortfall' and 'unitsMissed' values provided in the Impact of Pausing section. Do not invent or calculate your own numbers.`;

    const userMessage = `User: ${userName}
Reason for pausing SIP: ${reason}
Requested Pause Duration: ${pauseMonths} months
Fund Details:
- Name: ${fund?.name}
- Current SIP: ₹${fund?.mandate?.sipAmount}
- Step Down Allowed: ${fund?.mandate?.stepDownAllowed}
Impact of Pausing:
- compoundedShortfall: ₹${impact?.shortfall || impact?.compoundedShortfall}
- unitsMissed: ${impact?.unitsMissed}`;

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
              auditText: { 
                type: Type.STRING,
                description: 'The behavioral friction audit text addressing the user directly.'
              },
              recommendedAction: { 
                type: Type.STRING, 
                enum: ['step_down', 'shorten_pause', 'proceed', 'cancel'],
                description: 'The recommended system action for the UI.'
              }
            },
            required: ['auditText', 'recommendedAction']
          }
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text);
        return NextResponse.json(result);
      }
    }

    // High-fidelity algorithmic offline fallback (when no API key is set)
    let fallbackAction = 'cancel';
    let fallbackText = `Hi ${userName}, pausing your SIP for ${pauseMonths} months will result in a compounding shortfall of ₹${impact?.shortfall || impact?.compoundedShortfall} and you will miss accumulating ~${impact?.unitsMissed} units. `;
    
    if (reason.toLowerCase().includes('volatility') || reason.toLowerCase().includes('market')) {
      fallbackText += `Market dips are the best time to accumulate units due to Rupee Cost Averaging. It's recommended to continue your SIP to lower your average cost per unit.`;
    } else if (reason.toLowerCase().includes('cash') || reason.toLowerCase().includes('crunch')) {
      if (fund?.mandate?.stepDownAllowed) {
        fallbackText += `Since you are facing a cash crunch, consider stepping down your SIP amount instead of stopping completely. This keeps your compounding engine running.`;
        fallbackAction = 'step_down';
      } else {
        fallbackText += `Consider shortening your pause duration to resume your investments as soon as possible.`;
        fallbackAction = 'shorten_pause';
      }
    } else {
      fallbackText += `We recommend you reconsider this pause to maintain your financial momentum.`;
    }

    return NextResponse.json({ auditText: fallbackText, recommendedAction: fallbackAction });

  } catch (error: any) {
    console.error('Error in Gopal Intervene API route:', error);
    
    // Fallback if Gemini request fails or parsing fails
    return NextResponse.json({
      auditText: `We noticed an interruption in your request. Please remember that stopping your SIP leads to a projected shortfall of ₹${body?.impact?.shortfall || body?.impact?.compoundedShortfall || 'significant compounding gains'}. Consider stepping down instead of a full pause.`,
      recommendedAction: 'step_down'
    });
  }
}
