# LoanLy 🏦

AI-powered loan application platform built with React, Vercel, Google AI Studio, and Letta AI.

**Original Figma Design**: https://www.figma.com/design/pqIYd0kLi8n0UK7gXKVgqb/LoanLy

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the root directory:
```bash
GOOGLE_API_KEY=your_google_ai_studio_api_key
LETTA_API_KEY=your_letta_api_key
LETTA_AGENT_ID=your_letta_agent_id
```

See `ENV_SETUP.md` for detailed instructions on getting your API keys.

### 3. Run Locally
```bash
# Option 1: With Vercel Dev (includes API routes)
vercel dev

# Option 2: Frontend only
npm run dev
```

### 4. Deploy to Vercel
See the complete guide in `VERCEL_DEPLOYMENT_GUIDE.md`

---

## 📁 Project Structure

```
Loanly/
├── api/                    # Vercel serverless functions
│   ├── chat.ts            # AI chat endpoint
│   ├── loan-advice.ts     # Loan advice endpoint
│   └── health.ts          # Health check
├── src/
│   ├── components/        # React components
│   ├── utils/            # Utility functions
│   └── contexts/         # React contexts
├── public/               # Static assets
└── build/               # Production build output
```

---

## 🤖 AI Integration

Loanly uses a dual-AI approach:
- **Google AI Studio (Gemini 2.0 Flash)**: Primary financial analysis
- **Letta AI**: Enhanced conversational responses (optional)

See `AI_INTEGRATION_GUIDE.md` for more details.

---

## 📚 Documentation

- **[Vercel Deployment Guide](VERCEL_DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[Environment Setup](ENV_SETUP.md)** - How to configure API keys
- **[AI Integration Guide](src/AI_INTEGRATION_GUIDE.md)** - AI architecture and usage

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, Shadcn/ui
- **Build Tool**: Vite
- **Deployment**: Vercel
- **AI**: Google AI Studio, Letta AI
- **Forms**: React Hook Form, Zod

---

## 📝 License

Private project - All rights reserved.
  