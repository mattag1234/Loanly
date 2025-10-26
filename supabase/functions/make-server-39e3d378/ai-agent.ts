// AI Agent integration with Google AI Studio and Letta

// Type declaration for Deno (edge function runtime)
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

interface LoanFormData {
  income: number;
  debt: number;
  creditHistoryYears: number;
  recentInquiries: number;
  employmentStatus?: string;
  savingsRatio?: number;
}

export async function callGoogleAI(formData: LoanFormData): Promise<string> {
  const googleApiKey = Deno.env.get("GOOGLE_API_KEY");
  
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
      console.log(`Google AI API error: ${response.status} - ${error}`);
      throw new Error(`Google AI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error("No response generated from Google AI");
    }

    return generatedText;
  } catch (error) {
    console.log(`Error calling Google AI: ${error}`);
    throw error;
  }
}

export async function callLettaAgent(agentId: string, message: string): Promise<string> {
  const lettaApiKey = Deno.env.get("LETTA_API_KEY");
  
  if (!lettaApiKey) {
    throw new Error("Letta API key not configured");
  }

  try {
    // Use official Letta API format from docs
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
      console.log(`Letta API error: ${response.status} - ${error}`);
      throw new Error(`Letta API error: ${response.status}`);
    }

    // Official Letta response format
    interface LettaMessage {
      id: string;
      date: string;
      message_type: string;
      content?: string;
      reasoning?: string;
    }

    interface LettaResponse {
      messages: LettaMessage[];
      usage: {
        completion_tokens: number;
        prompt_tokens: number;
        total_tokens: number;
        step_count: number;
      };
    }

    const data: LettaResponse = await response.json();
    
    console.log("Letta response:", JSON.stringify(data));

    // Extract assistant messages (filter out reasoning messages)
    const assistantMessages = data.messages
      .filter((msg) => msg.message_type === "assistant_message")
      .map((msg) => msg.content)
      .filter((content) => content !== undefined);
    
    if (assistantMessages.length === 0) {
      throw new Error("No assistant response from Letta agent");
    }

    // Combine all assistant messages
    return assistantMessages.join("\n\n");
  } catch (error) {
    console.log(`Error calling Letta: ${error}`);
    throw error;
  }
}

export async function processWithAI(formData: LoanFormData, useLetta: boolean = false): Promise<string> {
  try {
    // Step 1: Get analysis from Google AI Studio
    console.log("Calling Google AI Studio...");
    const googleAnalysis = await callGoogleAI(formData);
    console.log("Google AI analysis received");

    // Step 2: If Letta is enabled, enhance with Letta agent
    if (useLetta) {
      console.log("Calling Letta agent...");
      const lettaAgentId = Deno.env.get("LETTA_AGENT_ID") || "default-agent";
      const lettaResponse = await callLettaAgent(lettaAgentId, googleAnalysis);
      console.log("Letta response received");
      return lettaResponse;
    }

    return googleAnalysis;
  } catch (error) {
    console.log(`Error in AI processing: ${error}`);
    throw error;
  }
}
