# How to Restart Render Service to Fix GEMINI_API_KEY Error

## Quick Fix Steps

### Step 1: Go to Render Dashboard
1. Open https://dashboard.render.com/
2. Sign in to your account
3. Find your service (the one with URL `rag-pdf-ai31.onrender.com`)

### Step 2: Restart the Service

**Option A: Manual Restart (Recommended)**
1. Click on your service name
2. Go to the **"Events"** tab (in the left sidebar)
3. Click the **"Restart"** button at the top
4. Wait 2-3 minutes for the service to restart

**Option B: Manual Deploy**
1. Click on your service name
2. Go to the **"Manual Deploy"** tab
3. Click **"Deploy latest commit"**
4. Wait 2-3 minutes for deployment to complete

### Step 3: Verify Environment Variable

While you're there, double-check the environment variable:
1. Go to **"Environment"** tab
2. Find `GEMINI_API_KEY`
3. Make sure:
   - ✅ The key exists
   - ✅ The value starts with `AIzaSy...`
   - ✅ No extra spaces before/after
   - ✅ The entire key is there (usually 39 characters)

### Step 4: Check Logs

After restarting, check the logs:
1. Go to **"Logs"** tab
2. Look for:
   - ✅ "Application startup complete" or similar
   - ✅ No errors about GEMINI_API_KEY
   - ✅ Service is running

### Step 5: Test the API

After restart, test if it works:
```bash
curl https://rag-pdf-ai31.onrender.com/
```

Should return:
```json
{"message":"Paisa Ko Sahayogi API - Nepal's Smartest Finance Advisor","version":"1.0.0"}
```

Then test the advice endpoint (should work now):
```bash
curl -X POST "https://rag-pdf-ai31.onrender.com/api/v1/advice" \
  -H "Content-Type: application/json" \
  -d '{"category":"buy","message":"test","monthly_income_npr":50000,"monthly_expenses_npr":{"food":10000},"current_savings_npr":0,"location":"kathmandu","mode":"simple"}'
```

## Why This Happens

Render services need to be restarted after:
- Adding new environment variables
- Changing environment variable values
- The service was deployed before the variable was added

The environment variable is set, but the running service hasn't picked it up yet.

## Still Not Working?

If after restarting you still get the error:

1. **Re-add the variable:**
   - Delete `GEMINI_API_KEY` from Environment
   - Save
   - Add it again with the correct value
   - Save
   - Restart again

2. **Verify the key is valid:**
   - Go to https://makersuite.google.com/app/apikey
   - Check if your key is still active
   - Generate a new one if needed

3. **Check Render logs:**
   - Look for specific error messages
   - Check if the service started successfully

## Expected Result

After restarting, your chat at `http://localhost:3000/chat` should work without the GEMINI_API_KEY error!


