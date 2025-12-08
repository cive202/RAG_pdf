# ⚠️ URGENT: Restart Render Service to Fix GEMINI_API_KEY Error

## The Problem
Your backend API is returning: "GEMINI_API_KEY environment variable is not set or is invalid"

This happens because:
- ✅ The environment variable IS set in Render
- ❌ But the running service hasn't restarted to pick it up

## The Solution: Restart Your Render Service

### Step-by-Step Instructions:

1. **Open Render Dashboard**
   - Go to: https://dashboard.render.com/
   - Sign in if needed

2. **Find Your Service**
   - Look for the service with URL: `rag-pdf-ai31.onrender.com`
   - Click on it

3. **Restart the Service**
   
   **Method 1 (Easiest):**
   - Click on **"Events"** tab (left sidebar)
   - Click the **"Restart"** button at the top
   - Wait 2-3 minutes

   **Method 2 (Alternative):**
   - Click on **"Manual Deploy"** tab
   - Click **"Deploy latest commit"**
   - Wait 2-3 minutes

4. **Verify It Worked**
   - Go to **"Logs"** tab
   - Look for: "Application startup complete" or "Uvicorn running on..."
   - Should NOT see any errors about GEMINI_API_KEY

5. **Test the API**
   After restart, test in your browser console:
   ```javascript
   fetch('https://rag-pdf-ai31.onrender.com/api/v1/advice', {
     method: 'POST',
     headers: {'Content-Type': 'application/json'},
     body: JSON.stringify({
       category: 'buy',
       message: 'test',
       monthly_income_npr: 50000,
       monthly_expenses_npr: {food: 10000},
       current_savings_npr: 0,
       location: 'kathmandu',
       mode: 'simple'
     })
   }).then(r => r.json()).then(console.log)
   ```

## Why This Happens

When you add or change environment variables in Render:
- The variable is saved ✅
- But the running service doesn't automatically reload it ❌
- You MUST manually restart the service to pick up new/changed env vars

## Still Not Working After Restart?

1. **Double-check the environment variable:**
   - Go to **"Environment"** tab
   - Find `GEMINI_API_KEY`
   - Make sure:
     - ✅ Value starts with `AIzaSy...`
     - ✅ No spaces before/after
     - ✅ Full key is there (usually 39 characters)

2. **Re-add the variable:**
   - Delete `GEMINI_API_KEY`
   - Save
   - Add it again with correct value
   - Save
   - Restart again

3. **Check if key is valid:**
   - Go to https://makersuite.google.com/app/apikey
   - Verify your key is still active
   - Generate a new one if needed

## Expected Result

After restarting:
- ✅ API should work
- ✅ Chat at http://localhost:3000/chat should work
- ✅ No more GEMINI_API_KEY errors

---

**This is the ONLY way to fix this error. The frontend code is correct - the issue is the backend service needs to restart.**


