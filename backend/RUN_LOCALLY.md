# How to Run Backend Locally

Complete guide to run the Paisa Ko Sahayogi Python backend on your local machine.

## 📋 Prerequisites

- Python 3.8 or higher installed
- pip (Python package manager)
- Git (optional, if cloning from repo)

## 🚀 Quick Start (5 Steps)

### Step 1: Navigate to Backend Folder

```bash
cd backend
```

### Step 2: Create Virtual Environment (Recommended)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Set Environment Variables

Create a `.env` file in the `backend` folder:

```env
GEMINI_API_KEY=your-gemini-api-key-here
JWT_SECRET_KEY=your-secret-key-here
```

**Get Gemini API Key:**
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key

**Generate JWT Secret Key:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 5: Run the Server

```bash
uvicorn main:app --reload
```

The server will start at: **http://localhost:8000**

---

## 📝 Detailed Instructions

### 1. Check Python Version

```bash
python --version
# Should be Python 3.8 or higher
```

If you need to install Python:
- Download from: https://www.python.org/downloads/
- Make sure to check "Add Python to PATH" during installation

### 2. Navigate to Backend Directory

```bash
# From project root
cd backend
```

### 3. Create Virtual Environment

**Why?** Keeps dependencies isolated from other projects.

**Windows:**
```bash
python -m venv venv
```

**Mac/Linux:**
```bash
python3 -m venv venv
```

### 4. Activate Virtual Environment

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
venv\Scripts\activate.bat
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### 5. Install Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- FastAPI
- Uvicorn
- Google Gemini SDK
- Pydantic
- Python-dotenv
- And other required packages

### 6. Create .env File

Create a file named `.env` in the `backend` folder:

```env
# Required
GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Required for production (optional for local dev)
JWT_SECRET_KEY=your-generated-secret-key-here

# Optional - CORS origins (defaults to * if not set)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

**Important:** 
- Replace `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` with your actual Gemini API key
- Never commit `.env` file to git (it's already in .gitignore)

### 7. Run the Server

**Development Mode (with auto-reload):**
```bash
uvicorn main:app --reload
```

**Production Mode:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

**With Custom Port:**
```bash
uvicorn main:app --reload --port 8080
```

### 8. Verify It's Running

Open your browser and go to:
- **API Root:** http://localhost:8000
- **Interactive Docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

You should see:
```json
{
  "message": "Paisa Ko Sahayogi API - Nepal's Smartest Finance Advisor",
  "version": "1.0.0"
}
```

---

## 🧪 Test the API

### Test Health Check

```bash
curl http://localhost:8000/
```

Or in PowerShell:
```powershell
Invoke-RestMethod -Uri http://localhost:8000/
```

### Test Advice Endpoint

```bash
curl -X POST "http://localhost:8000/api/v1/advice" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "buy",
    "message": "I want to buy a bike",
    "monthly_income_npr": 50000,
    "monthly_expenses_npr": {
      "food": 10000,
      "rent": 12000
    },
    "current_savings_npr": 25000,
    "location": "kathmandu",
    "mode": "simple"
  }'
```

Or use the interactive docs at http://localhost:8000/docs

---

## 🔧 Troubleshooting

### Issue: "Python not found"

**Solution:**
- Make sure Python is installed
- Check if Python is in your PATH
- Try `python3` instead of `python` (Mac/Linux)

### Issue: "pip not found"

**Solution:**
```bash
python -m ensurepip --upgrade
```

### Issue: "Module not found" errors

**Solution:**
- Make sure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

### Issue: "GEMINI_API_KEY not set"

**Solution:**
- Check `.env` file exists in `backend` folder
- Verify the key is correct (starts with `AIzaSy...`)
- Make sure no extra spaces in `.env` file
- Restart the server after adding/changing `.env`

### Issue: Port 8000 already in use

**Solution:**
```bash
# Use a different port
uvicorn main:app --reload --port 8080
```

Or find and kill the process using port 8000:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill
```

### Issue: "uvicorn: command not found"

**Solution:**
```bash
pip install uvicorn
```

Or use:
```bash
python -m uvicorn main:app --reload
```

---

## 📁 Project Structure

```
backend/
├── main.py              # FastAPI application
├── requirements.txt    # Python dependencies
├── .env                # Environment variables (create this)
├── venv/               # Virtual environment (created)
└── ...                 # Other files
```

---

## 🎯 Common Commands

```bash
# Activate virtual environment (Windows)
venv\Scripts\activate

# Activate virtual environment (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server (development)
uvicorn main:app --reload

# Run server (production)
uvicorn main:app --host 0.0.0.0 --port 8000

# Deactivate virtual environment
deactivate

# Check installed packages
pip list

# Update a package
pip install --upgrade package-name
```

---

## 🔗 Connect Frontend to Local Backend

Update your frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Then restart your frontend dev server.

---

## ✅ Success Checklist

- [ ] Python 3.8+ installed
- [ ] Virtual environment created and activated
- [ ] Dependencies installed
- [ ] `.env` file created with GEMINI_API_KEY
- [ ] Server running on http://localhost:8000
- [ ] Can access http://localhost:8000/docs
- [ ] Health check returns success
- [ ] Can make API requests

---

## 🚀 Next Steps

Once your backend is running locally:

1. **Test the API** using http://localhost:8000/docs
2. **Connect your frontend** by setting `NEXT_PUBLIC_API_URL=http://localhost:8000`
3. **Develop and test** your features locally
4. **Deploy** to Render when ready

---

## 💡 Tips

- **Use `--reload` flag** for development (auto-restarts on code changes)
- **Keep `.env` file secure** - never commit it to git
- **Use virtual environment** to avoid dependency conflicts
- **Check logs** in terminal for debugging
- **Use interactive docs** at `/docs` for easy testing

---

**Happy coding! 🎉**

