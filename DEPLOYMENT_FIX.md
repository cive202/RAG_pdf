# 🔧 Dependency Conflict Fix Guide

## The Problem

You're getting a dependency conflict error:
```
ERROR: ResolutionImpossible: 
google-genai 1.0.0 depends on websockets>=13.0,<15.0
realtime (from supabase) depends on websockets<13,>=11
```

These requirements are incompatible.

## ✅ Solution 1: Use Basic Requirements (Recommended for Quick Deploy)

If you don't need premium features (user tracking, daily limits, expense history), use the basic requirements:

**In your deployment platform, change the build command to:**
```bash
pip install -r requirements-basic.txt
```

This removes Supabase and eliminates the conflict entirely.

**Note:** Your API will still work! Premium features just won't be available.

---

## ✅ Solution 2: Update Package Versions

I've updated `requirements.txt` to use newer versions. Try deploying again - the conflict might be resolved with:
- `supabase==2.10.0` (newer version)
- Removed `[standard]` from uvicorn

---

## ✅ Solution 3: Install Dependencies Separately

If conflicts persist, install in this order:

```bash
# Install core dependencies first
pip install fastapi==0.115.5 uvicorn==0.32.1 pydantic==2.10.3

# Install google-genai (needs websockets 13+)
pip install google-genai==1.0.0

# Install other dependencies
pip install python-dotenv==1.0.1 python-jose[cryptography]==3.3.0 passlib[bcrypt]==1.7.4 python-multipart==0.0.9

# Try supabase last (might fail, but API works without it)
pip install supabase==2.10.0 || echo "Supabase optional - continuing"
```

---

## ✅ Solution 4: Use Without Supabase (Easiest)

Your code already handles missing Supabase gracefully! Just:

1. **Don't set** `SUPABASE_URL` and `SUPABASE_KEY` environment variables
2. Use `requirements-basic.txt` instead
3. Deploy - everything will work, just without premium features

The API will work perfectly for:
- ✅ All 8 financial advice categories
- ✅ Free tier advice
- ✅ All core features

You just won't have:
- ❌ User tracking
- ❌ Daily query limits
- ❌ Expense history
- ❌ Premium features

---

## 🚀 Quick Fix for Render/Railway

### Option A: Basic Deployment (No Supabase)

**Build Command:**
```bash
pip install -r requirements-basic.txt
```

**Environment Variables (minimal):**
```
GEMINI_API_KEY=your-key
JWT_SECRET_KEY=your-secret
```

### Option B: Full Deployment (With Supabase)

**Build Command:**
```bash
pip install -r requirements.txt
```

If it fails, fall back to Option A.

---

## 📋 Current Files Created

1. **requirements.txt** - Updated with newer versions (try this first)
2. **requirements-basic.txt** - Without Supabase (guaranteed to work)
3. **ENV_VARIABLES_GUIDE.md** - Complete guide to environment variables

---

## 🎯 Recommended Action

**For quickest deployment:** Use `requirements-basic.txt` and deploy without Supabase. You can add premium features later!

**Your API will work immediately** - just without user tracking and premium features.
