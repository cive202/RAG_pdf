# API Endpoints Guide

## Two Different Endpoints

### 1. `/api/v1/advice` - Financial Advice
**Purpose:** Get financial advice for different categories

**Valid Categories:**
- `"buy"` - Buy something (bike, phone, etc.)
- `"loan"` - Loan/EMI management
- `"tax"` - Tax saving advice
- `"big-goal"` - Big life goals
- `"festival"` - Festival/emergency budgeting
- `"reduce-expense"` - Expense reduction
- `"invest"` - Investment advice
- `"side-income"` - Side income ideas

**Request Format:**
```json
{
  "category": "buy",
  "message": "I want to buy a bike",
  "monthly_income_npr": 85000,
  "monthly_expenses_npr": {
    "food": 14200,
    "rent": 18000
  },
  "current_savings_npr": 920000,
  "location": "biratnagar"
}
```

**Note:** `"feedback"` is NOT a valid category for this endpoint!

---

### 2. `/api/v1/feedback` - Monthly Expense Feedback (Premium Only)
**Purpose:** Get monthly feedback on past expenses (Rights/Wrongs)

**Request Format:**
```json
{
  "user_id": "sita_devi_koirala",
  "month": "2025-12",
  "expenses": {
    "food": 14200,
    "rent": 18000,
    "daraz_shopping": 26800,
    "emi": 14000,
    "gold_purchase": 45000
  }
}
```

**Response:**
```json
{
  "month": "2025-12",
  "total_expenses": 118000,
  "rights": [
    {
      "title": "What you did right",
      "amount": 4800,
      "description": "Explanation",
      "solution": "How to continue"
    }
  ],
  "wrongs": [
    {
      "title": "What you did wrong",
      "amount": 19400,
      "description": "Explanation",
      "solution": "How to fix"
    }
  ],
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "is_premium": true
}
```

---

## Your Request Issue

You tried to use:
```json
{
  "category": "feedback",  // ❌ WRONG - "feedback" is not a category
  ...
}
```

**Solution:** Use the `/api/v1/feedback` endpoint instead:

```json
{
  "user_id": "sita_devi_koirala",
  "month": "2025-12",
  "expenses": {
    "food": 14200,
    "rent": 18000,
    "daraz_shopping": 26800,
    "emi": 14000,
    "gold_purchase": 45000
  }
}
```

---

## Quick Reference

| Feature | Endpoint | Category Parameter |
|---------|----------|-------------------|
| Get advice | `/api/v1/advice` | buy, loan, tax, big-goal, festival, reduce-expense, invest, side-income |
| Monthly feedback | `/api/v1/feedback` | N/A (separate endpoint) |

