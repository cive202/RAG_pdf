# Troubleshooting GEMINI_API_KEY Error (When Already Set)

If `GEMINI_API_KEY` is already set in Render but you're still getting the error, try these steps:

## Step 1: Verify the Variable is Set Correctly

1. Go to Render Dashboard → Your Service → **Environment** tab
2. Check that `GEMINI_API_KEY` exists and has a value
3. Make sure:
   - ✅ No extra spaces before/after the key
   - ✅ The key starts with `AIzaSy...`
   - ✅ The entire key is copied (usually 39 characters)
   - ✅ No quotes around the value

## Step 2: Restart the Service

**Important:** After setting/changing environment variables, you MUST restart:

1. Go to **"Manual Deploy"** tab
2. Click **"Deploy latest commit"**
3. Wait 2-3 minutes for the service to restart

OR

1. Go to **"Events"** tab
2. Click **"Restart"** button
3. Wait for restart to complete

## Step 3: Check Render Logs

1. Go to **"Logs"** tab in Render
2. Look for error messages about `GEMINI_API_KEY`
3. Check if the service started successfully
4. Look for any Python errors during startup

## Step 4: Verify the Key is Valid

Test your Gemini API key directly:

```bash
curl -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY"
```

Replace `YOUR_API_KEY` with your actual key. If this fails, your key might be invalid.

## Step 5: Check for Common Issues

### Issue: Key has extra spaces
- **Fix:** Remove any spaces before/after the key value in Render

### Issue: Key is empty
- **Fix:** Make sure the value field is not empty in Render

### Issue: Service didn't restart
- **Fix:** Manually trigger a deploy or restart

### Issue: Key is invalid/expired
- **Fix:** Generate a new key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Issue: Variable name typo
- **Fix:** Make sure it's exactly `GEMINI_API_KEY` (case-sensitive, no spaces)

## Step 6: Test the API Directly

After restarting, test if the API is working:

```bash
curl https://rag-pdf-ai31.onrender.com/
```

Should return:
```json
{
  "message": "Paisa Ko Sahayogi API - Nepal's Smartest Finance Advisor",
  "version": "1.0.0"
}
```

If you get an error, check the Render logs for details.

## Step 7: Re-add the Variable (If Still Not Working)

Sometimes re-adding helps:

1. Go to **Environment** tab
2. **Delete** the `GEMINI_API_KEY` variable
3. **Save changes**
4. **Add it again** with the correct value
5. **Save changes**
6. **Restart the service**

## Still Not Working?

1. Check Render logs for specific error messages
2. Verify the key works by testing it directly (Step 4)
3. Make sure you're looking at the correct service in Render
4. Try creating a new API key and updating it


