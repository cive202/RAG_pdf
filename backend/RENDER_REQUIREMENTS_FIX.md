# Fix "Could not open requirements file" Error

## The Problem
```
ERROR: Could not open requirements file: [Errno 2] No such file or directory: 'requirements.txt'
```

## The Cause
Render is looking for `requirements.txt` in the **root** of your repository, but it's actually in the `backend/` folder.

## The Solution: Set Root Directory

### Step-by-Step Fix

1. **Go to Render Dashboard**
   - Open: https://dashboard.render.com/
   - Click on your service: `rag-pdf-ai31.onrender.com`

2. **Go to Settings Tab**
   - Click "Settings" in the left sidebar

3. **Set Root Directory**
   - Scroll down to find "Root Directory" field
   - Enter: `backend`
   - **Important:** Just type `backend` (no quotes, no slashes, no path)

4. **Verify Build Command**
   - Build Command should be: `pip install -r requirements.txt`
   - This will now look for `requirements.txt` in the `backend/` folder

5. **Verify Start Command**
   - Start Command should be: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - This will now look for `main.py` in the `backend/` folder

6. **Save and Deploy**
   - Click "Save Changes" at the bottom
   - Go to "Manual Deploy" tab
   - Click "Deploy latest commit"
   - Wait 2-3 minutes

## Visual Guide

**Before (Wrong):**
```
Repository Root
├── backend/
│   ├── main.py
│   └── requirements.txt
└── frontend/
```
Render looks in: `Repository Root/requirements.txt` ❌ (doesn't exist)

**After (Correct):**
```
Root Directory = "backend"
```
Render looks in: `backend/requirements.txt` ✅ (exists!)

## Verification

After setting Root Directory, check the build logs. You should see:
```
Collecting fastapi==0.115.5
Collecting uvicorn==0.32.1
...
Successfully installed ...
```

Instead of:
```
ERROR: Could not open requirements file
```

## Complete Settings Checklist

- [ ] **Root Directory:** `backend` (most important!)
- [ ] **Build Command:** `pip install -r requirements.txt`
- [ ] **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] **Environment Variables:** GEMINI_API_KEY, JWT_SECRET_KEY set
- [ ] **Saved changes** and **deployed**

---

**After setting Root Directory to `backend`, the error will be fixed!** ✅

