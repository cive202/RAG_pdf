# Deploy Backend to Render - Step by Step Guide

## 🚀 Quick Deployment Steps

### Step 1: Commit Your Changes (If Not Already Committed)

```bash
# From project root
git add .
git commit -m "Update backend with latest changes"
git push origin main
```

### Step 2: Go to Render Dashboard

1. Open: https://dashboard.render.com/
2. Sign in to your account
3. Find your service: `rag-pdf-ai31.onrender.com`
4. Click on it

### Step 3: Update Deployment

**Option A: Auto-Deploy (If Connected to GitHub)**
- Render will automatically detect new commits
- Go to "Events" tab to see deployment status
- Wait 2-3 minutes for deployment

**Option B: Manual Deploy**
1. Go to "Manual Deploy" tab
2. Click "Deploy latest commit"
3. Wait 2-3 minutes

### Step 4: Verify Environment Variables

1. Go to "Environment" tab
2. Ensure these are set:
   - ✅ `GEMINI_API_KEY` - Your Gemini API key
   - ✅ `JWT_SECRET_KEY` - Your secret key (optional but recommended)

### Step 5: Restart Service (If Needed)

After deployment:
1. Go to "Events" tab
2. Click "Restart" button
3. Wait 2-3 minutes

### Step 6: Test Deployment

```bash
# Test health check
curl https://rag-pdf-ai31.onrender.com/

# Test advice endpoint
curl -X POST "https://rag-pdf-ai31.onrender.com/api/v1/advice" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "buy",
    "message": "test",
    "monthly_income_npr": 50000,
    "monthly_expenses_npr": {"food": 10000},
    "current_savings_npr": 0,
    "location": "kathmandu",
    "mode": "simple"
  }'
```

---

## 📋 Render Service Configuration

### Build Settings

- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Root Directory:** `backend` (if deploying from monorepo)

### Environment Variables Required

```env
GEMINI_API_KEY=your-gemini-api-key
JWT_SECRET_KEY=your-secret-key (optional)
ALLOWED_ORIGINS=* (optional, defaults to *)
```

---

## 🔍 Verify Deployment

### Check Logs

1. Go to "Logs" tab in Render
2. Look for:
   - ✅ "Application startup complete"
   - ✅ "Uvicorn running on..."
   - ✅ No errors about GEMINI_API_KEY

### Test Endpoints

1. **Health Check:**
   ```
   GET https://rag-pdf-ai31.onrender.com/
   ```

2. **Interactive Docs:**
   ```
   https://rag-pdf-ai31.onrender.com/docs
   ```

3. **Test Advice:**
   Use the Swagger UI at `/docs` to test the API

---

## 🎯 Deployment Checklist

- [ ] Code committed to git
- [ ] Code pushed to GitHub (if using auto-deploy)
- [ ] Environment variables set in Render
- [ ] Service deployed/updated
- [ ] Service restarted (if needed)
- [ ] Health check passes
- [ ] API endpoints working
- [ ] Frontend can connect to API

---

## 🐛 Troubleshooting

### Deployment Fails

1. Check "Logs" tab for errors
2. Verify `requirements.txt` is correct
3. Check build command is correct
4. Ensure Python version is compatible

### API Not Working After Deploy

1. Check environment variables are set
2. Restart the service
3. Check logs for errors
4. Verify GEMINI_API_KEY is valid

### Service Not Starting

1. Check logs for startup errors
2. Verify all dependencies in requirements.txt
3. Check if port is correctly set to $PORT
4. Ensure main.py is in the correct location

---

## ✅ Success Indicators

- ✅ Service shows "Live" status
- ✅ Health check returns 200 OK
- ✅ `/docs` page loads
- ✅ API endpoints respond correctly
- ✅ No errors in logs

---

**Your API is ready to deploy! 🚀**

