# AI Integration Guide for LoanLy

This guide explains the Google AI Studio → Letta integration workflow implemented in your LoanLy application.

## 🏗️ Architecture Overview

```
Frontend (Figma Make) → Backend (Supabase Edge Functions) → Google AI Studio → Letta Agent → Response
```

### Flow:
1. **User Input**: User submits financial data via chat or loan application form
2. **Backend Processing**: Supabase Edge Function receives the request
3. **Google AI Analysis**: Backend calls Google AI Studio (Gemini 2.0 Flash) to analyze financial profile
4. **Letta Enhancement** (Optional): Google's output is forwarded to Letta agent for personalized conversational response
5. **Frontend Display**: AI-generated advice is displayed to the user

## 🔑 API Keys Required

You need to configure three API keys in your Supabase environment:

### 1. Google AI Studio API Key
- **Where to get it**: https://aistudio.google.com/app/apikey
- **Environment variable**: `GOOGLE_API_KEY`
- **Status**: ✅ Already configured

### 2. Letta API Key
- **Where to get it**: https://app.letta.com/settings/api-keys
- **Environment variable**: `LETTA_API_KEY`
- **Status**: ✅ Already configured

### 3. Letta Agent ID (Optional)
- **Where to get it**: Create an agent at https://app.letta.com/agents
- **Environment variable**: `LETTA_AGENT_ID`
- **Status**: ✅ Already configured
- **Default**: Uses "default-agent" if not set

## 📁 File Structure

### Backend (Supabase Edge Functions)
```
/supabase/functions/server/
├── index.tsx          # Main server with API routes
├── ai-agent.tsx       # AI integration logic (Google AI + Letta)
└── kv_store.tsx       # Protected - Key-value storage utilities
```

### Frontend
```
/components/
├── CrediBotPage.tsx   # Mr. LoanLy chat interface
└── ApplyPage.tsx      # Loan application form

/utils/
└── ai-api.ts          # API utility functions for AI calls
```

## 🚀 How to Use

### Using Mr. LoanLy Chat

1. Navigate to the **Mr. LoanLy** tab in the navbar
2. Toggle **"Use Letta AI"** switch to enable/disable Letta enhancement
3. Type your financial questions in the chat input
4. Mr. LoanLy will respond with AI-powered insights

**Note**: 
- When Letta is OFF: Uses only Google AI Studio (faster, direct analysis)
- When Letta is ON: Uses Google AI Studio → Letta (personalized, conversational)

### Integration in Loan Application

The AI can be integrated into the loan application flow to provide:
- Real-time analysis of application data
- Personalized recommendations
- Credibility Index explanations

## 🔧 API Endpoints

### POST `/make-server-39e3d378/loan-advice`
Analyzes loan application data and provides AI-powered advice.

**Request Body:**
```json
{
  "income": 5000,
  "debt": 1400,
  "creditHistoryYears": 5,
  "recentInquiries": 2,
  "employmentStatus": "fulltime",
  "savingsRatio": 15,
  "useLetta": false
}
```

**Response:**
```json
{
  "success": true,
  "output": "Based on your financial profile...",
  "usedLetta": false
}
```

### POST `/make-server-39e3d378/chat`
Sends a chat message to the AI assistant.

**Request Body:**
```json
{
  "message": "How can I improve my credit score?",
  "context": {
    "income": 5000,
    "debt": 1400,
    "creditHistoryYears": 5,
    "recentInquiries": 2
  },
  "useLetta": true
}
```

**Response:**
```json
{
  "success": true,
  "response": "Here are personalized recommendations...",
  "usedLetta": true
}
```

## 💡 Using the Utility Functions

Import the AI utilities in your components:

```typescript
import { getAILoanAdvice, sendChatMessage } from "../utils/ai-api";

// Get loan advice
const advice = await getAILoanAdvice({
  income: 5000,
  debt: 1400,
  creditHistoryYears: 5,
  recentInquiries: 2,
  employmentStatus: "fulltime"
}, true); // true = use Letta

console.log(advice.output);

// Send chat message
const response = await sendChatMessage(
  "What's my credibility score?",
  { income: 5000, debt: 1400 },
  false // false = Google AI only
);

console.log(response);
```

## 🎯 Example Use Cases

### 1. Real-time Loan Application Analysis
```typescript
// In ApplyPage.tsx
const handleSubmit = async (formData) => {
  const advice = await getAILoanAdvice({
    income: formData.income,
    debt: formData.totalDebt,
    creditHistoryYears: formData.creditHistory,
    recentInquiries: formData.inquiries
  }, true);
  
  // Display AI insights to user
  setAiInsights(advice.output);
};
```

### 2. Interactive Financial Assistant
```typescript
// In CrediBotPage.tsx
const handleUserQuestion = async (question: string) => {
  const response = await sendChatMessage(
    question,
    userFinancialContext,
    useLetta
  );
  
  // Add to chat messages
  addBotMessage(response);
};
```

## 🔒 Security Notes

- ✅ All API keys are stored securely in Supabase environment variables
- ✅ Backend API calls prevent exposing credentials to the frontend
- ✅ CORS is properly configured for secure cross-origin requests
- ⚠️ This is a prototype - do NOT use for real PII/financial data in production

## 🐛 Troubleshooting

### Error: "Google AI Studio API key not configured"
- Check that `GOOGLE_API_KEY` is set in Supabase environment variables
- Verify the key is valid at https://aistudio.google.com

### Error: "Letta API key not configured"
- Ensure `LETTA_API_KEY` is set in Supabase environment variables
- Verify your Letta account is active at https://app.letta.com

### Error: "Failed to get AI response"
- Check browser console for detailed error messages
- Verify Supabase Edge Functions are deployed and running
- Test the `/health` endpoint: `GET /make-server-39e3d378/health`

## 📚 External Documentation

- **Google AI Studio**: https://ai.google.dev/docs
- **Letta API**: https://docs.letta.com
- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions

## ✨ Next Steps

Consider adding:
- User financial profile storage in KV store
- Chat history persistence
- AI-powered loan recommendation engine
- Credit score prediction models
- Automated financial health reports

---

**Built with**: Google AI Studio (Gemini 2.0 Flash) + Letta + Supabase Edge Functions
