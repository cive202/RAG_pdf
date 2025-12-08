# Fix Render Port Binding Error

## The Problem
```
Port scan timeout reached, no open ports detected. 
Bind your service to at least one port.
```

## The Solution

### Step 1: Update Render Service Settings

1. Go to **Render Dashboard**: https://dashboard.render.com/
2. Click on your service: `rag-pdf-ai31.onrender.com`
3. Go to **Settings** tab

### Step 2: Configure These Settings

**Root Directory:**
```
backend
```

**Build Command:**
```
pip install -r requirements.txt
```

**Start Command:**
```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

**OR (Alternative - more explicit):**
```
python -m uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Step 3: Verify Environment Variables

Go to **Environment** tab and ensure:
- ✅ `GEMINI_API_KEY` is set
- ✅ `JWT_SECRET_KEY` is set (optional but recommended)

**Important:** Render automatically sets `$PORT` - don't hardcode a port number!

### Step 4: Save and Deploy

1. Click **Save Changes**
2. Go to **Manual Deploy** tab
3. Click **Deploy latest commit**
4. Wait 2-3 minutes

### Step 5: Check Logs

After deployment, check the **Logs** tab. You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:XXXX (Press CTRL+C to quit)
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

If you see errors, check:
- Root Directory is set to `backend`
- Start command uses `$PORT` (not a hardcoded number)
- `main.py` exists in the `backend` folder
- `requirements.txt` exists in the `backend` folder

---

## Common Issues

### Issue 1: Root Directory Not Set
**Symptom:** Can't find `main.py` or `requirements.txt`
**Fix:** Set Root Directory to `backend` in Settings

### Issue 2: Wrong Start Command
**Symptom:** Service starts but port not detected
**Fix:** Use `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Issue 3: Port Hardcoded
**Symptom:** Port conflict or binding error
**Fix:** Always use `$PORT` environment variable, never hardcode like `--port 8000`

### Issue 4: Python Path Issue
**Symptom:** `uvicorn: command not found`
**Fix:** Use `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`

---

## Quick Checklist

- [ ] Root Directory = `backend`
- [ ] Build Command = `pip install -r requirements.txt`
- [ ] Start Command = `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Environment variables set (GEMINI_API_KEY, JWT_SECRET_KEY)
- [ ] Service restarted after changes
- [ ] Logs show "Uvicorn running on..."

---

**After fixing, your service should bind to the port correctly!** ✅

