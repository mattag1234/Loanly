# 🚀 Loanly - Vercel Deployment Guide

Complete guide to deploying your Loanly app to Vercel with Google AI Studio and Letta AI integration.

---

## 📋 Prerequisites

Before deploying, make sure you have:

1. ✅ **Vercel Account** - Sign up at https://vercel.com
2. ✅ **Google AI Studio API Key** - Get it at https://aistudio.google.com/app/apikey
3. ✅ **Letta AI API Key** - Get it at https://app.letta.com/settings/api-keys
4. ✅ **Letta Agent ID** (Optional) - Create one at https://app.letta.com/agents
5. ✅ **Git Repository** - Your code should be in GitHub, GitLab, or Bitbucket

---

## 🏗️ Architecture Changes

### Before (Figma Make + Supabase)
```
Frontend → Supabase Edge Functions → Google AI + Letta
```

### After (Vercel)
```
Frontend → Vercel Serverless Functions → Google AI + Letta
```

### What Changed?
- ✅ Moved backend from **Supabase Edge Functions** to **Vercel Serverless Functions**
- ✅ Updated API endpoints from `/functions/v1/make-server-39e3d378/*` to `/api/*`
- ✅ Removed dependency on Supabase authentication (no longer needed)
- ✅ Environment variables now managed in Vercel dashboard

---

## 📦 Step 1: Install Dependencies

First, install the new dependencies:

```bash
npm install
```

This will install the `@vercel/node` package needed for the serverless functions.

---

## 🔑 Step 2: Set Up Environment Variables in Vercel

### Option A: Via Vercel Dashboard (Recommended for First-Time Setup)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Migrated to Vercel serverless functions"
   git push origin main
   ```

2. **Import your project to Vercel**
   - Go to https://vercel.com/new
   - Select "Import Git Repository"
   - Choose your Loanly repository
   - Click "Import"

3. **Configure Environment Variables**
   - During import, Vercel will ask about environment variables
   - Click "Add Environment Variable" and add these three:

   | Name | Value | Description |
   |------|-------|-------------|
   | `GOOGLE_API_KEY` | Your Google AI Studio key | Get from https://aistudio.google.com/app/apikey |
   | `LETTA_API_KEY` | Your Letta AI key | Get from https://app.letta.com/settings/api-keys |
   | `LETTA_AGENT_ID` | Your Letta agent ID | Get from https://app.letta.com/agents (optional) |

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (~2-3 minutes)
   - Your app will be live at `https://your-app-name.vercel.app`

### Option B: Via Vercel CLI

If you prefer using the command line:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy and set up environment variables interactively
vercel

# During deployment, you'll be prompted to set environment variables
# Or set them manually:
vercel env add GOOGLE_API_KEY
vercel env add LETTA_API_KEY
vercel env add LETTA_AGENT_ID
```

---

## 🧪 Step 3: Test Your Deployment

### Health Check
Test that your API is working:

```bash
curl https://your-app-name.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-26T...",
  "service": "Loanly API"
}
```

### Test Loan Advice Endpoint
```bash
curl -X POST https://your-app-name.vercel.app/api/loan-advice \
  -H "Content-Type: application/json" \
  -d '{
    "income": 5000,
    "debt": 1400,
    "creditHistoryYears": 5,
    "recentInquiries": 2,
    "useLetta": false
  }'
```

### Test Chat Endpoint
```bash
curl -X POST https://your-app-name.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How can I improve my credit score?",
    "context": {
      "income": 5000,
      "debt": 1400
    },
    "useLetta": true
  }'
```

---

## 🔧 Step 4: Local Development Setup

For local development with the new Vercel setup:

1. **Create a `.env.local` file** (already in `.gitignore`):
   ```bash
   # .env.local
   GOOGLE_API_KEY=your_google_ai_studio_api_key_here
   LETTA_API_KEY=your_letta_api_key_here
   LETTA_AGENT_ID=your_letta_agent_id_here
   ```

2. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

3. **Run locally with Vercel Dev**:
   ```bash
   vercel dev
   ```
   
   This will:
   - Start your frontend on `http://localhost:3000`
   - Run serverless functions locally
   - Use your `.env.local` environment variables

4. **Alternative: Use regular Vite dev server**:
   ```bash
   npm run dev
   ```
   
   Note: With `npm run dev`, you won't have the API routes available locally. You'll need to use `vercel dev` to test the full stack.

---

## 📂 New File Structure

Here's what was added/changed:

```
Loanly/
├── api/                          # 🆕 Vercel serverless functions
│   ├── chat.ts                   # Chat endpoint
│   ├── loan-advice.ts            # Loan advice endpoint
│   └── health.ts                 # Health check endpoint
├── src/
│   └── utils/
│       └── ai-api.ts             # ✏️ Updated to use /api/* endpoints
├── vercel.json                   # 🆕 Vercel configuration
├── ENV_SETUP.md                  # 🆕 Environment variable docs
├── VERCEL_DEPLOYMENT_GUIDE.md    # 🆕 This file
├── .gitignore                    # ✏️ Updated to ignore .env files
└── package.json                  # ✏️ Added @vercel/node
```

---

## 🎯 Key Differences: Supabase vs Vercel

| Feature | Supabase Edge Functions | Vercel Serverless Functions |
|---------|------------------------|----------------------------|
| **Runtime** | Deno | Node.js |
| **API Routes** | `/functions/v1/...` | `/api/...` |
| **Environment Variables** | Supabase Dashboard | Vercel Dashboard |
| **Authentication** | Supabase Auth headers | Not needed |
| **Deployment** | `supabase deploy` | `vercel` or Git push |
| **Framework** | Hono | Native Node.js handlers |

---

## 🔐 Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use environment variables** - Never hardcode API keys
3. **Rotate keys regularly** - Especially if exposed
4. **Monitor API usage** - Check Google AI Studio and Letta dashboards
5. **Set up Vercel authentication** (optional) - Add auth to your app if needed

---

## 🐛 Troubleshooting

### Issue: "Google AI Studio API key not configured"
**Solution:** Make sure `GOOGLE_API_KEY` is set in Vercel dashboard
1. Go to your project on Vercel
2. Settings → Environment Variables
3. Add `GOOGLE_API_KEY` with your key
4. Redeploy: `vercel --prod`

### Issue: "Letta API key not configured"
**Solution:** Make sure `LETTA_API_KEY` is set in Vercel dashboard
1. Go to your project on Vercel
2. Settings → Environment Variables
3. Add `LETTA_API_KEY` with your key
4. Redeploy: `vercel --prod`

### Issue: API endpoints returning 404
**Solution:** Make sure `vercel.json` exists and is correct
- Check that the `vercel.json` file is in the root directory
- Verify the `rewrites` configuration
- Redeploy

### Issue: CORS errors in browser console
**Solution:** CORS is already configured in the API functions
- Check browser console for specific error
- Verify the API is being called with the correct URL
- Make sure the API functions are deployed

### Issue: Local development - API routes not working
**Solution:** Use `vercel dev` instead of `npm run dev`
```bash
vercel dev
```

---

## 🚀 Continuous Deployment

Vercel automatically deploys when you push to your repository:

1. **Push to Git**:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Vercel Auto-Deploys**:
   - Automatically builds and deploys
   - No manual deployment needed
   - View build logs in Vercel dashboard

3. **Preview Deployments**:
   - Every branch and PR gets a preview URL
   - Test features before merging

---

## 📊 Monitoring & Analytics

### Vercel Dashboard
- View deployment history
- Monitor function logs
- Check performance metrics
- Track API usage

### Google AI Studio
- Monitor API usage: https://aistudio.google.com
- Check quotas and limits
- View API costs (if applicable)

### Letta Dashboard
- Monitor agent usage: https://app.letta.com
- View conversation history
- Check agent performance

---

## 🎉 Success Checklist

Once deployed, verify everything works:

- [ ] App loads at your Vercel URL
- [ ] Health endpoint returns `{"status":"ok"}`
- [ ] Can navigate to all pages (Dashboard, Apply, Mr. LoanLy, etc.)
- [ ] Mr. LoanLy chat responds with AI messages
- [ ] Can toggle "Use Letta AI" switch
- [ ] Loan application form submits successfully
- [ ] Credibility gauge displays correctly
- [ ] No console errors in browser

---

## 💡 Next Steps

Now that you're deployed on Vercel, consider:

1. **Custom Domain** - Add your own domain in Vercel settings
2. **Analytics** - Enable Vercel Analytics for insights
3. **Edge Functions** - Optimize performance with edge deployment
4. **Authentication** - Add user accounts (Clerk, Auth0, etc.)
5. **Database** - Add persistent storage (Vercel Postgres, Supabase, etc.)
6. **Monitoring** - Set up error tracking (Sentry, LogRocket, etc.)

---

## 📚 Additional Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Google AI Studio Docs**: https://ai.google.dev/docs
- **Letta API Docs**: https://docs.letta.com
- **Vercel CLI Reference**: https://vercel.com/docs/cli

---

## 🆘 Need Help?

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review Vercel function logs in the dashboard
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

---

**Happy Deploying! 🎉**

Your Loanly app is now powered by Vercel, Google AI Studio, and Letta AI!

