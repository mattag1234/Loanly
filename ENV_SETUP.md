# Environment Variables Setup

This file contains all the environment variables needed for Loanly to work with Vercel.

## Required Environment Variables

You need to set these in your Vercel project settings:

### 1. GOOGLE_API_KEY
**Description:** Your Google AI Studio API key for Gemini 2.0 Flash  
**Where to get it:** https://aistudio.google.com/app/apikey  
**Example:** `AIzaSyD...` (your actual key will be longer)

### 2. LETTA_API_KEY
**Description:** Your Letta AI API key for enhanced conversational responses  
**Where to get it:** https://app.letta.com/settings/api-keys  
**Example:** `letta_...` (your actual key format)

### 3. LETTA_AGENT_ID (Optional)
**Description:** Your specific Letta agent ID  
**Where to get it:** https://app.letta.com/agents (create an agent first)  
**Default:** If not set, will use "default-agent"  
**Example:** `agent_123abc...`

## How to Set Environment Variables in Vercel

### Option 1: Via Vercel Dashboard
1. Go to your project on https://vercel.com
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - Variable Name: `GOOGLE_API_KEY`
   - Value: Your Google AI Studio API key
   - Click **Save**
4. Repeat for `LETTA_API_KEY` and `LETTA_AGENT_ID`

### Option 2: Via Vercel CLI
```bash
vercel env add GOOGLE_API_KEY
# Paste your key when prompted

vercel env add LETTA_API_KEY
# Paste your key when prompted

vercel env add LETTA_AGENT_ID
# Paste your agent ID when prompted
```

## Local Development

For local development, create a `.env.local` file in the project root:

```bash
# .env.local (DO NOT COMMIT THIS FILE)
GOOGLE_API_KEY=your_google_ai_studio_api_key_here
LETTA_API_KEY=your_letta_api_key_here
LETTA_AGENT_ID=your_letta_agent_id_here
```

The `.env.local` file is already in `.gitignore` and will not be committed to version control.

## Verifying Your Setup

After setting up the environment variables:

1. Deploy or redeploy your project
2. Test the health endpoint: `https://your-app.vercel.app/api/health`
3. You should see: `{"status":"ok","timestamp":"...","service":"Loanly API"}`

If you see errors about missing API keys, double-check that all variables are set correctly in Vercel.

