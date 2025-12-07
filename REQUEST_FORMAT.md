# API Request Format Guide

## Common Error: Missing `monthly_expenses_npr`

If you get this error:
```json
{
  "detail": [{
    "field": "body.monthly_expenses_npr",
    "message": "Field required",
    "type": "missing"
  }]
}
```

**The problem:** You're missing the `monthly_expenses_npr` field in your request.

## ✅ CORRECT Request Format

```json
{
  "category": "buy",
  "message": "I want to buy a bike",
  "monthly_income_npr": 60000,
  "monthly_expenses_npr": {
    "food": 15000,
    "rent": 10000,
    "transport": 5000
  },
  "current_savings_npr": 50000,
  "location": "kathmandu"
}
```

## ❌ WRONG Examples

### Missing monthly_expenses_npr
```json
{
  "category": "buy",
  "message": "I want to buy a bike",
  "monthly_income_npr": 60000
  // monthly_expenses_npr is MISSING!
}
```

### Empty monthly_expenses_npr
```json
{
  "category": "buy",
  "message": "I want to buy a bike",
  "monthly_income_npr": 60000,
  "monthly_expenses_npr": {}  // ❌ Empty object not allowed
}
```

### Wrong type (not an object)
```json
{
  "category": "buy",
  "message": "I want to buy a bike",
  "monthly_income_npr": 60000,
  "monthly_expenses_npr": 25000  // ❌ Must be an object, not a number
}
```

## Required Fields

1. **category** (string) - One of: "buy", "loan", "tax", "big-goal", "festival", "reduce-expense", "invest", "side-income"
2. **message** (string) - Your question or request
3. **monthly_income_npr** (number) - Your monthly income
4. **monthly_expenses_npr** (object) - **REQUIRED!** Dictionary with expense categories

## Optional Fields

- `current_savings_npr` (default: 0.0)
- `location` (default: "kathmandu")
- `mode` (default: "simple") - "simple" or "indepth"
- `persona` - "laxmi-didi" or "ram-bhai"
- `user_name` - For personalized greetings
- `is_premium` (default: false)
- `user_id` - For tracking

## Example cURL Request

```bash
curl -X POST "http://localhost:8000/api/v1/advice" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "buy",
    "message": "I want to buy a bike",
    "monthly_income_npr": 60000,
    "monthly_expenses_npr": {
      "food": 15000,
      "rent": 10000,
      "transport": 5000
    },
    "current_savings_npr": 50000,
    "location": "kathmandu"
  }'
```

## Example JavaScript/Fetch

```javascript
const response = await fetch('http://localhost:8000/api/v1/advice', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    category: 'buy',
    message: 'I want to buy a bike',
    monthly_income_npr: 60000,
    monthly_expenses_npr: {  // ⚠️ THIS IS REQUIRED!
      food: 15000,
      rent: 10000,
      transport: 5000
    },
    current_savings_npr: 50000,
    location: 'kathmandu'
  })
});
```

## Example Python/Requests

```python
import requests

response = requests.post('http://localhost:8000/api/v1/advice', json={
    'category': 'buy',
    'message': 'I want to buy a bike',
    'monthly_income_npr': 60000,
    'monthly_expenses_npr': {  # ⚠️ THIS IS REQUIRED!
        'food': 15000,
        'rent': 10000,
        'transport': 5000
    },
    'current_savings_npr': 50000,
    'location': 'kathmandu'
})
```

