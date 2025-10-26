import type { VercelRequest, VercelResponse } from '@vercel/node';

interface LoanFormData {
  income: number;
  debt: number;
  creditHistoryYears: number;
  recentInquiries: number;
  employmentStatus?: string;
  savingsRatio?: number;
}

async function callGoogleAI(formData: LoanFormData, retries = 3): Promise<string> {
  const googleApiKey = process.env.GOOGLE_API_KEY;
  
  if (!googleApiKey) {
    throw new Error("Google AI Studio API key not configured");
  }

  const prompt = `
User financial profile:
- Monthly Income: $${formData.income}
- Total Debt: $${formData.debt}
- Credit History: ${formData.creditHistoryYears} years
- Recent Credit Inquiries: ${formData.recentInquiries}
${formData.employmentStatus ? `- Employment Status: ${formData.employmentStatus}` : ''}
${formData.savingsRatio ? `- Savings Ratio: ${formData.savingsRatio}%` : ''}

Analyze this financial profile and explain:
1. Why their Credibility Index might be low or high
2. Key factors affecting their creditworthiness
3. Specific recommendations for improvement

Provide a clear, empathetic explanation in 2-3 paragraphs.
`;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${googleApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        
        // If 503 (overloaded) and we have retries left, wait and retry
        if (response.status === 503 && attempt < retries - 1) {
          const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
          console.log(`Google AI overloaded (503), retrying in ${waitTime}ms... (attempt ${attempt + 1}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        
        console.error(`Google AI API error: ${response.status} - ${error}`);
        throw new Error(`Google AI API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        throw new Error("No response generated from Google AI");
      }

      return generatedText;
    } catch (error: any) {
      // If it's a network error or 503 and we have retries left, try again
      if (attempt < retries - 1 && (error.message.includes('503') || error.message.includes('fetch'))) {
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`Google AI error, retrying in ${waitTime}ms... (attempt ${attempt + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      console.error(`Error calling Google AI:`, error);
      throw error;
    }
  }
  
  throw new Error("Google AI failed after all retries");
}

async function callLettaAgent(agentId: string, message: string): Promise<string> {
  const lettaApiKey = process.env.LETTA_API_KEY;
  
  if (!lettaApiKey) {
    throw new Error("Letta API key not configured");
  }

  try {
    const response = await fetch(`https://api.letta.com/v1/agents/${agentId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lettaApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: message
          }
        ]
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Letta API error: ${response.status} - ${error}`);
      throw new Error(`Letta API error: ${response.status}`);
    }

    const data: any = await response.json();
    
    console.log("Letta API response:", JSON.stringify(data));

    // Letta API returns messages array with assistant_message type
    let responseText = '';
    
    if (data.messages && Array.isArray(data.messages)) {
      // Find assistant message (either by role or message_type)
      const assistantMessage = data.messages.find((msg: any) => 
        msg.role === "assistant" || msg.message_type === "assistant_message"
      );
      responseText = assistantMessage?.content || assistantMessage?.text || '';
    } else if (data.content) {
      // Direct content field
      responseText = data.content;
    } else if (data.text) {
      // Direct text field
      responseText = data.text;
    } else if (typeof data === 'string') {
      // Direct string response
      responseText = data;
    }
    
    if (!responseText) {
      console.error("Could not extract response from Letta API. Full response:", data);
      throw new Error("No response from Letta agent");
    }

    console.log("Letta response extracted successfully:", responseText);
    return responseText;
  } catch (error) {
    console.error(`Error calling Letta:`, error);
    throw error;
  }
}

async function processWithAI(userMessage: string, formData: LoanFormData, useLetta: boolean = false): Promise<string> {
  try {
    // If Letta is enabled, send user message directly to Letta (it maintains conversation state)
    if (useLetta) {
      console.log("Calling Letta agent...");
      try {
        const lettaAgentId = process.env.LETTA_AGENT_ID;
        
        if (!lettaAgentId) {
          console.warn("LETTA_AGENT_ID not set, falling back to Google AI");
          // Fall through to Google AI
        } else {
          const lettaResponse = await callLettaAgent(lettaAgentId, userMessage);
          console.log("Letta response received successfully");
          return lettaResponse;
        }
      } catch (lettaError: any) {
        console.error("Letta API failed, falling back to Google AI only:", lettaError.message);
        // Fall through to Google AI
      }
    }

    // Use Google AI (either as fallback or when Letta is off)
    console.log("Calling Google AI Studio...");
    const googleAnalysis = await callGoogleAI(formData);
    console.log("Google AI analysis received");
    return googleAnalysis;
  } catch (error) {
    console.error(`Error in AI processing:`, error);
    throw error;
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const { message, context } = body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const useLetta = body.useLetta === true;
    
    // Create a simplified form data from context or use defaults
    const formData = {
      income: context?.income || 5000,
      debt: context?.debt || 1400,
      creditHistoryYears: context?.creditHistoryYears || 5,
      recentInquiries: context?.recentInquiries || 2,
    };

    console.log(`Processing chat message with AI (Letta: ${useLetta})`);
    
    // Process the user message with AI context
    const aiResponse = await processWithAI(message, formData, useLetta);

    return res.status(200).json({ 
      success: true,
      response: aiResponse,
      usedLetta: useLetta
    });
  } catch (error: any) {
    console.error(`Error in chat endpoint:`, error);
    return res.status(500).json({ 
      error: error.message || "Failed to process chat message",
      details: error.toString()
    });
  }
}

