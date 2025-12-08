# 🔗 Your API Links

## ✅ Your Deployed API is Live!

**Base URL:** https://rag-pdf-ai31.onrender.com

---

## 📚 Interactive API Documentation

**Best way to test your API:**

1. **Swagger UI (Recommended):** https://rag-pdf-ai31.onrender.com/docs
   - Interactive interface to test all endpoints
   - Try API calls directly in the browser
   - See request/response examples

2. **ReDoc:** https://rag-pdf-ai31.onrender.com/redoc
   - Clean, readable documentation format

---

## 🎯 Quick API Endpoints

### 1. Health Check ✅
**GET** https://rag-pdf-ai31.onrender.com/

**Test:**
```bash
curl https://rag-pdf-ai31.onrender.com/
```

**Response:**
```json
{
  "message": "Paisa Ko Sahayogi API - Nepal's Smartest Finance Advisor",
  "version": "1.0.0"
}
```

---

### 2. Get Financial Advice
**POST** https://rag-pdf-ai31.onrender.com/api/v1/advice

**Example Request:**
```bash
curl -X POST "https://rag-pdf-ai31.onrender.com/api/v1/advice" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "buy",
    "message": "I want to buy a Yamaha MT-15 bike",
    "monthly_income_npr": 60000,
    "monthly_expenses_npr": {
      "food": 10000,
      "rent": 15000,
      "transport": 4000,
      "utilities": 3000
    },
    "current_savings_npr": 50000,
    "location": "kathmandu",
    "mode": "simple"
  }'
```

**Available Categories:**
- `"buy"` - Buy something (bike, phone, gold, laptop, etc.)
- `"loan"` - Loan/EMI management
- `"tax"` - Tax saving advice
- `"big-goal"` - Big life goals (house, foreign study, wedding)
- `"festival"` - Festival/emergency budgeting
- `"reduce-expense"` - Expense reduction
- `"invest"` - Investment advice
- `"side-income"` - Side income ideas

---

### 3. Monthly Expense Feedback
**POST** https://rag-pdf-ai31.onrender.com/api/v1/feedback

**Example Request:**
```bash
curl -X POST "https://rag-pdf-ai31.onrender.com/api/v1/feedback" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "month": "2025-12",
    "expenses": {
      "food": 14200,
      "rent": 18000,
      "transport": 5000,
      "shopping": 10000
    }
  }'
```

---

## 🌐 Frontend Integration

Use this base URL in your frontend:

```javascript
const API_BASE_URL = "https://rag-pdf-ai31.onrender.com";

// Example fetch
fetch(`${API_BASE_URL}/api/v1/advice`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    category: "buy",
    message: "I want to buy a bike",
    monthly_income_npr: 50000,
    monthly_expenses_npr: {
      food: 10000,
      rent: 12000
    },
    current_savings_npr: 25000,
    location: "kathmandu"
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

---

## ✅ API Status

Your API is **live and working!** 

Verified: https://rag-pdf-ai31.onrender.com/ returns the expected response.

---

## 📖 Full Documentation

For complete API documentation, visit:
- **Interactive Docs:** https://rag-pdf-ai31.onrender.com/docs
- **API Schema:** https://rag-pdf-ai31.onrender.com/openapi.json


