# Paisa Ko Sahayogi - Full Stack Application 🇳🇵

Nepal's smartest personal finance advisor - Full stack application with FastAPI backend and Next.js frontend.

## Project Structure

```
API_EMBARK/
├── backend/          # FastAPI Python Backend
│   ├── main.py       # FastAPI application
│   ├── requirements.txt
│   └── ...           # API documentation and config files
│
└── frontend/         # Next.js Frontend
    ├── app/          # Next.js app router
    ├── components/   # React components
    ├── lib/          # Utilities (includes backend API client)
    └── ...           # Next.js configuration files
```

## Quick Start

### Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Create .env file with:
# GEMINI_API_KEY=your-key
# JWT_SECRET_KEY=your-secret

# Run the server
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install

# Create .env.local file with:
# NEXT_PUBLIC_API_URL=https://rag-pdf-ai31.onrender.com
# NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key

npm run dev
```

Frontend runs at: `http://localhost:3000`

## API Base URL

**Production:** `https://rag-pdf-ai31.onrender.com`

**Local Development:** `http://localhost:8000`

## Documentation

- **Backend API Docs:** See `backend/README.md` for detailed API documentation
- **Frontend Docs:** See `frontend/README.md` for frontend setup and integration
- **API Links:** See `backend/YOUR_API_LINKS.md` for API endpoints and examples
- **Interactive Docs:** https://rag-pdf-ai31.onrender.com/docs

## Integration Status

✅ **Frontend-Backend Integration Complete**
- AI Chat component connected to backend API
- Backend API client utilities created (`frontend/lib/api/backend.ts`)
- JSON to text conversion helpers available
- Environment variables configured

## Features

- 💳 8 Financial Categories (Buy, Loan, Tax, Big Goals, Festival Budget, Reduce Expense, Invest, Side Income)
- 🤖 AI-Powered Financial Advice using Google Gemini
- 📊 Monthly Expense Feedback
- 💰 Investment Simulations
- 🎯 Personalized Financial Planning

## Tech Stack

**Backend:**
- FastAPI
- Google Gemini 2.5 Flash
- Python 3.x

**Frontend:**
- Next.js
- React

## License

MIT
