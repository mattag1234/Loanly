# ✅ Loanly Deployment Checklist

Use this checklist to ensure everything is set up correctly for your Vercel deployment.

---

## 📋 Pre-Deployment Checklist

### API Keys
- [ ] Have Google AI Studio API key ready
  - Get from: https://aistudio.google.com/app/apikey
- [ ] Have Letta AI API key ready
  - Get from: https://app.letta.com/settings/api-keys
- [ ] Have Letta Agent ID ready (optional)
  - Create agent at: https://app.letta.com/agents

### Repository
- [ ] Code is pushed to Git (GitHub/GitLab/Bitbucket)
- [ ] Repository is accessible from Vercel

### Local Setup (Optional - for testing before deploy)
- [ ] Created `.env.local` file with all API keys
- [ ] Ran `npm install`
- [ ] Tested with `vercel dev`

---

## 🚀 Deployment Steps

### Step 1: Install Dependencies
```bash
cd /Users/matt/Desktop/Loanly
npm install
```
- [ ] No errors during installation
- [ ] `@vercel/node` is installed

### Step 2: Commit and Push
```bash
git add .
git commit -m "Migrate to Vercel with AI integration"
git push origin main
```
- [ ] All files committed
- [ ] Pushed to remote repository

### Step 3: Deploy to Vercel

#### Via Dashboard:
- [ ] Logged into https://vercel.com
- [ ] Clicked "New Project"
- [ ] Imported Git repository
- [ ] Set environment variables:
  - [ ] `GOOGLE_API_KEY`
  - [ ] `LETTA_API_KEY`
  - [ ] `LETTA_AGENT_ID`
- [ ] Clicked "Deploy"
- [ ] Deployment successful

#### Or Via CLI:
```bash
npm i -g vercel
vercel login
vercel
```
- [ ] Vercel CLI installed
- [ ] Logged in
- [ ] Deployed successfully
- [ ] Environment variables added

---

## 🧪 Post-Deployment Testing

### Test Health Endpoint
```bash
curl https://your-app.vercel.app/api/health
```
- [ ] Returns `{"status":"ok"}`

### Test Frontend
- [ ] App loads at Vercel URL
- [ ] Can navigate to Dashboard
- [ ] Can navigate to Apply page
- [ ] Can navigate to Mr. LoanLy (chat)
- [ ] Can navigate to Insights
- [ ] Can navigate to Profile

### Test AI Features
- [ ] Mr. LoanLy chat responds to messages
- [ ] Can toggle "Use Letta AI" switch
- [ ] Chat works with Letta OFF (Google AI only)
- [ ] Chat works with Letta ON (Google AI + Letta)
- [ ] Loan application form submits successfully
- [ ] Credibility gauge displays

### Check Console
- [ ] No errors in browser console
- [ ] No network errors
- [ ] API calls succeed

---

## 🔧 Configuration Verification

### Vercel Dashboard
- [ ] Project is visible in dashboard
- [ ] Build logs show success
- [ ] Function logs are accessible
- [ ] All 3 environment variables are set:
  - [ ] `GOOGLE_API_KEY`
  - [ ] `LETTA_API_KEY`
  - [ ] `LETTA_AGENT_ID`

### API Endpoints
Test each endpoint manually:

**Health Check**:
```bash
curl https://your-app.vercel.app/api/health
```
- [ ] Returns 200 OK

**Loan Advice** (without Letta):
```bash
curl -X POST https://your-app.vercel.app/api/loan-advice \
  -H "Content-Type: application/json" \
  -d '{
    "income": 5000,
    "debt": 1400,
    "creditHistoryYears": 5,
    "recentInquiries": 2,
    "useLetta": false
  }'
```
- [ ] Returns AI analysis
- [ ] `usedLetta: false`

**Loan Advice** (with Letta):
```bash
curl -X POST https://your-app.vercel.app/api/loan-advice \
  -H "Content-Type: application/json" \
  -d '{
    "income": 5000,
    "debt": 1400,
    "creditHistoryYears": 5,
    "recentInquiries": 2,
    "useLetta": true
  }'
```
- [ ] Returns Letta-enhanced response
- [ ] `usedLetta: true`

**Chat**:
```bash
curl -X POST https://your-app.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How can I improve my credit?",
    "context": {"income": 5000, "debt": 1400},
    "useLetta": false
  }'
```
- [ ] Returns AI response

---

## 🐛 Troubleshooting

If any checks fail, refer to:
- **`VERCEL_DEPLOYMENT_GUIDE.md`** - Detailed deployment guide
- **`ENV_SETUP.md`** - Environment variable setup
- **`MIGRATION_SUMMARY.md`** - What changed and why

Common issues:
- ❌ **404 on API routes** → Redeploy or check `vercel.json`
- ❌ **"API key not configured"** → Add env vars in Vercel dashboard
- ❌ **CORS errors** → Already handled, but check browser console
- ❌ **Build fails** → Check Vercel build logs for errors

---

## ✨ Optional Enhancements

After successful deployment, consider:
- [ ] Add custom domain in Vercel settings
- [ ] Enable Vercel Analytics
- [ ] Set up error monitoring (Sentry)
- [ ] Configure edge functions for better performance
- [ ] Add authentication (Clerk, Auth0, etc.)
- [ ] Set up a database for user data
- [ ] Configure caching for API responses

---

## 📊 Monitoring

### Daily/Weekly
- [ ] Check Vercel function logs
- [ ] Monitor API usage in Google AI Studio
- [ ] Check Letta agent usage
- [ ] Review any error alerts

### Monthly
- [ ] Review API costs (if applicable)
- [ ] Check for security updates
- [ ] Update dependencies: `npm update`
- [ ] Rotate API keys if needed

---

## 🎉 Success!

When all checkboxes are ticked:
- ✅ Your Loanly app is live on Vercel
- ✅ AI integrations (Google AI + Letta) are working
- ✅ All features are functional
- ✅ No errors in production

**Your app is ready to use! 🚀**

---

## 📞 Support Resources

- **Vercel Support**: https://vercel.com/support
- **Google AI Studio**: https://aistudio.google.com
- **Letta AI**: https://app.letta.com
- **Project Documentation**: See `README.md` for all guides

---

**Last Updated**: October 26, 2025

