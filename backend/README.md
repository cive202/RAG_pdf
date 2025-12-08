# Paisa Ko Sahayogi API - Backend 🇳🇵

Nepal's smartest personal finance advisor backend built with FastAPI (December 2025).

## Features

### Core Features (Free)
- **8 Financial Categories**:
  1. 💳 Buy Something (bike, phone, gold, laptop, etc.)
  2. 🏦 Loan / EMI Management
  3. 📉 Save Tax (SSF, CIT, 1% SST, education/green deductions)
  4. 🏡 Big Life Goals (house, foreign study/work, wedding)
  5. 🎊 Festival & Emergency Budget (Dashain-Tihar, medical)
  6. 💰 Reduce Monthly Expenses
  7. 📈 Grow My Money (FD, shares, gold, mutual funds, crypto)
  8. 💡 Side Income / Extra Cash Ideas

### Premium Features
- ✅ **Personalized AI Persona**: Choose "Laxmi Didi" or "Ram Bhai" with personalized greetings
- ✅ **Response Modes**: Simple (100 words + charts) or In-depth (300 words)
- ✅ **Monthly Feedback**: Analyze past expenses with Rights/Wrongs + Solutions
- ✅ **Investment Simulation**: 12-month projections with periodic forecasts
- ✅ **Unlimited Queries**: No daily limits
- ✅ **Full History**: Track all past expenses and goals
- ✅ **Family Mode**: Manage multiple family members' finances

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Create `.env` file in the `backend` folder:

```env
# Gemini API
GEMINI_API_KEY=your-gemini-api-key

# JWT Secret Key
JWT_SECRET_KEY=your-secret-jwt-key

# CORS Origins (optional, defaults to *)
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### 3. Run the Server

```bash
# Development mode
uvicorn main:app --reload

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

Server will start at: `http://localhost:8000`

## API Usage

### Endpoint: `POST /api/v1/advice`

**Request Format:**

```json
{
  "category": "buy",
  "message": "I want to buy a new bike",
  "monthly_income_npr": 50000,
  "monthly_expenses_npr": {
    "food": 8000,
    "rent": 12000,
    "transport": 3000
  },
  "current_savings_npr": 25000,
  "location": "kathmandu",
  "mode": "simple"
}
```

**Available Categories:**
- `"buy"` - Buy Something
- `"loan"` - Loan / EMI Management
- `"tax"` - Save Tax
- `"big-goal"` - Big Life Goals
- `"festival"` - Festival & Emergency Budget
- `"reduce-expense"` - Reduce Monthly Expenses
- `"invest"` - Grow My Money
- `"side-income"` - Side Income Ideas

**Response Format:**

```json
{
  "response_np": "English answer",
  "response_en": "English answer",
  "months_needed": 24,
  "target_amount_npr": 300000,
  "realistic_monthly_savings_npr": 18700,
  "progress_percent": 8,
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "alternatives": [
    {
      "name": "Alternative option",
      "price_npr": 250000,
      "months_needed": 20
    }
  ],
  "is_premium": false
}
```

### Endpoint: `POST /api/v1/feedback`

**Request:**

```json
{
  "user_id": "user123",
  "month": "2025-11",
  "expenses": {
    "food": 25000,
    "rent": 30000,
    "transport": 8000
  }
}
```

## API Base URL

**Production:** `https://rag-pdf-ai31.onrender.com`

**Local:** `http://localhost:8000`

## Interactive Documentation

- **Swagger UI:** https://rag-pdf-ai31.onrender.com/docs
- **ReDoc:** https://rag-pdf-ai31.onrender.com/redoc

## Additional Documentation

- `YOUR_API_LINKS.md` - API endpoints and examples
- `ENDPOINTS_GUIDE.md` - Detailed endpoint documentation
- `ENV_VARIABLES_GUIDE.md` - Environment variables guide
- `REQUEST_FORMAT.md` - Request format examples

## Tech Stack

- **FastAPI** - Modern Python web framework
- **Google Gemini 2.5 Flash** - AI-powered financial advice
- **JWT** - Authentication
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## License

MIT


