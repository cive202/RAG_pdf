# Environment Variables Guide

## Required Environment Variables

### 1. GEMINI_API_KEY ⚠️ **REQUIRED**

**What it is:** Your Google Gemini API key for AI-powered financial advice.

**How to get it:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

**Example:**
```env
GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Note:** The API will not start without this key.

---

### 2. JWT_SECRET_KEY ⚠️ **REQUIRED for Production**

**What it is:** Secret key used for JWT token encryption/decryption.

**How to generate:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Or use any strong random string (minimum 32 characters).

**Example:**
```env
JWT_SECRET_KEY=your-very-long-random-secret-key-here-min-32-chars
```

**Warning:** 
- Never commit this to git!
- Use a strong, random key in production
- The default key is insecure and only for development

---

## Optional Environment Variables

### 3. SUPABASE_URL (Optional - for premium features)

**What it is:** Your Supabase project URL.

**How to get it:**
1. Go to [supabase.com](https://supabase.com)
2. Create/select your project
3. Go to Settings → API
4. Copy the "Project URL"

**Example:**
```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
```

**When needed:** Only if you want to use premium features (user tracking, daily limits, expense history).

---

### 4. SUPABASE_KEY (Optional - for premium features)

**What it is:** Your Supabase anonymous/public API key.

**How to get it:**
1. Same as above (Settings → API)
2. Copy the "anon/public" key (starts with `eyJ...`)

**Example:**
```env
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxx
```

**When needed:** Must be set together with SUPABASE_URL for premium features.

---

### 5. ALLOWED_ORIGINS (Optional - for CORS restriction)

**What it is:** Comma-separated list of allowed frontend domains.

**Default:** `*` (allows all origins)

**Example:**
```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**When needed:** For production security - restrict CORS to your frontend domain only.

---

## Complete .env File Example

### Minimal Setup (Free tier only):
```env
GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
JWT_SECRET_KEY=your-generated-secret-key-here
```

### Full Setup (With premium features):
```env
# Required
GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
JWT_SECRET_KEY=your-generated-secret-key-here

# Optional - Premium features
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxx

# Optional - Security
ALLOWED_ORIGINS=https://yourdomain.com
```

---

## Setting Environment Variables

### Local Development (.env file):
Create a `.env` file in your project root:
```env
GEMINI_API_KEY=your-key-here
JWT_SECRET_KEY=your-secret-here
```

### Deployment Platforms:

**Railway:**
1. Go to your project → Variables
2. Add each variable as "Key = Value"

**Render:**
1. Go to your service → Environment
2. Add each variable

**Heroku:**
```bash
heroku config:set GEMINI_API_KEY=your-key-here
heroku config:set JWT_SECRET_KEY=your-secret-here
```

**Docker:**
```dockerfile
ENV GEMINI_API_KEY=your-key-here
ENV JWT_SECRET_KEY=your-secret-here
```

Or use `docker run -e GEMINI_API_KEY=your-key-here ...`

---

## Security Best Practices

1. ✅ **Never commit `.env` file to git** (already in .gitignore)
2. ✅ **Use strong random keys** (32+ characters)
3. ✅ **Rotate keys periodically** in production
4. ✅ **Use different keys** for development and production
5. ✅ **Restrict CORS origins** in production

---

## Quick Verification

After setting variables, verify they're loaded:

```python
import os
from dotenv import load_dotenv

load_dotenv()

print("GEMINI_API_KEY:", "✅ Set" if os.getenv("GEMINI_API_KEY") else "❌ Missing")
print("JWT_SECRET_KEY:", "✅ Set" if os.getenv("JWT_SECRET_KEY") else "❌ Missing")
print("SUPABASE_URL:", "✅ Set" if os.getenv("SUPABASE_URL") else "⚠️ Optional")
```

