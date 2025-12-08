# How to Set Environment Variables in Render

## Quick Fix for GEMINI_API_KEY Error

Your backend is deployed on Render but missing the `GEMINI_API_KEY` environment variable.

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (starts with `AIzaSy...`)

## Step 2: Set Environment Variable in Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click on your service (the one with URL `rag-pdf-ai31.onrender.com`)
3. Go to **"Environment"** tab (in the left sidebar)
4. Click **"Add Environment Variable"**
5. Add:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Paste your Gemini API key
6. Click **"Save Changes"**

## Step 3: Restart Your Service

After adding the environment variable:
1. Go to **"Manual Deploy"** tab
2. Click **"Deploy latest commit"** OR
3. The service will auto-restart (may take 1-2 minutes)

## Step 4: Verify It Works

Test your API:
```bash
curl https://rag-pdf-ai31.onrender.com/
```

Or test the chat page at: `http://localhost:3000/chat`

## Optional: Set JWT_SECRET_KEY

For better security, also set:
- **Key:** `JWT_SECRET_KEY`
- **Value:** Generate a random key:
  ```bash
  python -c "import secrets; print(secrets.token_urlsafe(32))"
  ```

## Complete Environment Variables List

Set these in Render:
```
GEMINI_API_KEY=your-gemini-api-key-here
JWT_SECRET_KEY=your-generated-secret-key-here (optional but recommended)
```

## Troubleshooting

- **Still getting error?** Wait 2-3 minutes for the service to restart
- **Service not restarting?** Manually trigger a deploy
- **Key invalid?** Make sure you copied the entire key without spaces


