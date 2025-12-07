# Paisa Ko Sahayogi API 🇳🇵

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

### Premium Features (₹199/month - "Mero Paisa Guru")
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

Create `.env` file:

```env
# Gemini API
GEMINI_API_KEY=your-gemini-api-key

# JWT Secret Key
JWT_SECRET_KEY=your-secret-jwt-key
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

**Request Format (Free User):**

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

**Request Format (Premium User):**

```json
{
  "category": "invest",
  "message": "I want to invest my savings",
  "monthly_income_npr": 100000,
  "monthly_expenses_npr": {
    "food": 20000,
    "rent": 30000
  },
  "current_savings_npr": 500000,
  "location": "kathmandu",
  "mode": "indepth",
  "persona": "laxmi-didi",
  "user_name": "Sita",
  "is_premium": true,
  "user_id": "user123",
  "extra_profile": {
    "risk_tolerance": "medium",
    "insurance_cost": 5000
  }
}
```

**Premium Parameters:**
- `mode`: `"simple"` (100 words + charts) or `"indepth"` (300 words)
- `persona`: `"laxmi-didi"` or `"ram-bhai"` (personalized AI)
- `user_name`: User's name for personalized greetings
- `is_premium`: `true`/`false`
- `user_id`: User ID for tracking and history

**Categories:**
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
  "visualization": {
    "chart_type": "bar",
    "description": "Progress: 8% towards goal",
    "data": {
      "progress": 8,
      "target": 300000,
      "current": 25000
    }
  },
  "simulation": [
    {
      "month": 1,
      "total_value": 510000,
      "fd_value": 125000,
      "shares_value": 175000,
      "mutual_funds_value": 125000,
      "gold_value": 75000
    }
  ],
  "is_premium": false
}
```

### Endpoint: `POST /api/v1/feedback` (Premium Only)

**Request:**

```json
{
  "user_id": "user123",
  "month": "2025-11",
  "expenses": {
    "food": 25000,
    "rent": 30000,
    "transport": 8000,
    "entertainment": 12000
  }
}
```

**Response:**

```json
{
  "month": "2025-11",
  "total_expenses": 75000,
  "rights": [
    {
      "title": "Cooked at home",
      "amount": 4800,
      "description": "Saved by cooking instead of eating out",
      "solution": "Continue meal planning"
    }
  ],
  "wrongs": [
    {
      "title": "Daraz binge shopping",
      "amount": 19400,
      "description": "Impulsive online purchases",
      "solution": "Use 24-hour cart rule"
    }
  ],
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "is_premium": true
}
```

## Key Features

### Free Tier
- ✅ **15% Nepal Buffer** - Automatic inflation/festival/emergency buffer
- ✅ **5 Queries/Day** - Limited usage
- ✅ **Basic Advice** - Simple mode responses
- ✅ **3 Tips Only** - Limited tips with paywall blur
- ✅ **1 Goal** - Single active goal

### Premium Tier (₹199/month)
- ✅ **Unlimited Queries** - No daily limits
- ✅ **Personalized AI** - "Laxmi Didi" or "Ram Bhai" persona
- ✅ **Response Modes** - Simple (100 words + charts) or In-depth (300 words)
- ✅ **Monthly Feedback** - 5 Rights/Wrongs with solutions
- ✅ **Investment Simulation** - 12-month projections
- ✅ **Full History** - All past expenses and goals
- ✅ **Family Mode** - Multiple family members
- ✅ **All Tips & Solutions** - No paywall blurring

## Current Nepal Market Data (December 2025)

- **NEPSE Index**: ~2631
- **Gold (24k)**: ~NPR 1,540,000 per tola
- **FD Rates**: 5-7% per annum
- **Mutual Funds**: ~9% annual return
- **Company Investment**: ~10% annual return
- **Startup Investment**: ~15% annual return (high risk)

## Example cURL Request

```bash
curl -X POST "http://localhost:8000/api/v1/advice" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "buy",
    "message": "I want to buy Yamaha MT-15",
    "monthly_income_npr": 60000,
    "monthly_expenses_npr": {
      "food": 10000,
      "rent": 15000,
      "transport": 4000,
      "utilities": 3000
    },
    "current_savings_npr": 50000,
    "location": "kathmandu"
  }'
```

## Tech Stack

- **FastAPI** - Modern Python web framework
- **Google Gemini 2.5 Flash** - AI-powered financial advice
- **JWT** - Authentication
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **Recharts** - React charting library (frontend)

## React Components

See included components:
- `PremiumDashboard.jsx` - Premium dashboard with charts
- `BlurredPaywall.jsx` - Paywall blur component
- `FeedbackCard.jsx` - Monthly feedback display

## License

MIT
