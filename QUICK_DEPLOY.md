# Quick Deployment Guide

## ✅ Your API is Ready for Deployment!

### CORS Configuration
✅ **CORS is properly configured** - No CORS errors will occur
- Default: Allows all origins (`*`)
- Optional: Set `ALLOWED_ORIGINS` environment variable to restrict to specific domains

### 🔧 Dependency Conflict Fix

**If you're getting a websockets dependency conflict error on Render:**

The issue is that `google-genai` requires `websockets>=13.0`, but `supabase`'s `realtime` dependency requires `websockets<13`. 

**Solution Options:**

#### Option 1: Deploy Without Supabase (Easiest - Recommended)
Your API works perfectly without Supabase! Just use the default `requirements.txt`:
- ✅ All 8 financial advice categories work
- ✅ Free tier advice works
- ✅ All core features work
- ❌ Premium features (user tracking, daily limits) won't work

**Build Command (in Render):**
```bash
pip install -r requirements.txt
```

#### Option 2: Use Build Script (If You Need Supabase)
If you need premium features, use the `build.sh` script:

**In Render Dashboard:**
1. Go to your service settings
2. Under "Build Command", change from:
   ```bash
   pip install -r requirements.txt
   ```
   to:
   ```bash
   chmod +x build.sh && ./build.sh
   ```

This will install Supabase with a workaround for the websockets conflict.

### Before Deploying

1. **Set Environment Variables** (in your deployment platform):
   ```env
   GEMINI_API_KEY=your-actual-gemini-api-key
   JWT_SECRET_KEY=generate-a-strong-random-key-here
   SUPABASE_URL=https://xxxxx.supabase.co  # Optional, for premium features
   SUPABASE_KEY=your-supabase-key          # Optional, for premium features
   ```

2. **Generate JWT Secret Key:**
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

### Deploy Now

Your API will work immediately after deployment. CORS is already configured correctly!

**Test it:**
```bash
curl https://your-api-url.com/
```

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for detailed deployment options.

