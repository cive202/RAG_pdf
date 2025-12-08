# JavaScript Guide: How to Interact with Python Backend API

Complete guide for calling the Paisa Ko Sahayogi API from JavaScript/TypeScript.

## 📋 Table of Contents

1. [Base Configuration](#base-configuration)
2. [Health Check](#health-check)
3. [Get Financial Advice](#get-financial-advice)
4. [Get Monthly Feedback](#get-monthly-feedback)
5. [Error Handling](#error-handling)
6. [Complete Examples](#complete-examples)

---

## 🔧 Base Configuration

### Set API Base URL

```javascript
const API_BASE_URL = "https://rag-pdf-ai31.onrender.com";
// Or for local development:
// const API_BASE_URL = "http://localhost:8000";
```

### Helper Function for API Calls

```javascript
async function apiCall(endpoint, method = 'GET', data = null) {
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      detail: `HTTP ${response.status}: ${response.statusText}` 
    }));
    throw new Error(error.detail || error.message || 'API request failed');
  }

  return await response.json();
}
```

---

## ✅ Health Check

### Check if API is Running

```javascript
async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    const data = await response.json();
    console.log('API Status:', data);
    // Returns: { "message": "Paisa Ko Sahayogi API...", "version": "1.0.0" }
    return true;
  } catch (error) {
    console.error('API is not accessible:', error);
    return false;
  }
}

// Usage
checkApiHealth();
```

---

## 💰 Get Financial Advice

### Basic Example

```javascript
async function getFinancialAdvice() {
  const requestData = {
    category: "buy",
    message: "I want to buy a Yamaha MT-15 bike",
    monthly_income_npr: 60000,
    monthly_expenses_npr: {
      food: 10000,
      rent: 15000,
      transport: 4000,
      utilities: 3000
    },
    current_savings_npr: 50000,
    location: "kathmandu",
    mode: "simple"  // or "indepth"
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/advice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const advice = await response.json();
    console.log('Advice:', advice);
    return advice;
  } catch (error) {
    console.error('Error getting advice:', error);
    throw error;
  }
}
```

### Available Categories

```javascript
const categories = {
  buy: "Buy something (bike, phone, gold, laptop, etc.)",
  loan: "Loan/EMI management",
  tax: "Tax saving advice",
  "big-goal": "Big life goals (house, foreign study, wedding)",
  festival: "Festival/emergency budgeting",
  "reduce-expense": "Reduce monthly expenses",
  invest: "Investment advice",
  "side-income": "Side income ideas"
};
```

### Complete Request Object

```javascript
const adviceRequest = {
  // Required fields
  category: "buy",  // One of: buy, loan, tax, big-goal, festival, reduce-expense, invest, side-income
  message: "I want to buy a bike",
  monthly_income_npr: 60000,  // Number (NPR)
  monthly_expenses_npr: {     // Object with expense categories
    food: 10000,
    rent: 15000,
    transport: 5000,
    utilities: 3000
  },
  
  // Optional fields
  current_savings_npr: 50000,  // Default: 0
  location: "kathmandu",        // Default: "kathmandu"
  mode: "simple",               // "simple" or "indepth", Default: "simple"
  is_premium: true,             // Default: false
  user_id: "user123",           // Optional user identifier
  extra_profile: {              // Optional additional user data
    risk_tolerance: "medium",
    insurance_cost: 5000
  }
};
```

### Response Structure

```javascript
const adviceResponse = {
  response_np: "English answer (Nepali field, but contains English)",
  response_en: "English answer explaining the buying plan, timeline, and advice",
  months_needed: 24,                    // Integer
  target_amount_npr: 300000,            // Integer
  realistic_monthly_savings_npr: 18700, // Integer
  progress_percent: 8,                  // Integer (0-100)
  tips: [                               // Array of strings
    "Tip 1 specific to Nepal",
    "Tip 2",
    "Tip 3"
  ],
  alternatives: [                       // Array of alternative options
    {
      name: "Alternative item name",
      price_npr: 250000,                // Integer
      months_needed: 20                 // Integer
    }
  ],
  visualization: {                      // Only in "simple" mode
    chart_type: "bar",
    description: "Progress: 8% towards goal",
    data: {
      progress: 8,
      target: 300000,
      current: 50000,
      monthly_savings: 18700
    }
  },
  simulation: [                         // Only for "invest" category with premium
    {
      month: 1,
      total_value: 510000,
      fd_value: 125000,
      shares_value: 175000,
      mutual_funds_value: 125000,
      gold_value: 75000,
      company_investment_value: 10000,  // Optional
      startup_value: 5000               // Optional
    }
    // ... 12 months of projections
  ],
  is_premium: true
};
```

### Example: Buy Something

```javascript
async function getBuyAdvice() {
  const response = await fetch(`${API_BASE_URL}/api/v1/advice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      category: "buy",
      message: "I want to buy a Yamaha MT-15 bike",
      monthly_income_npr: 60000,
      monthly_expenses_npr: {
        food: 10000,
        rent: 15000,
        transport: 4000
      },
      current_savings_npr: 50000,
      location: "kathmandu",
      mode: "simple"
    })
  });

  const advice = await response.json();
  console.log(`You need ${advice.months_needed} months to save NPR ${advice.target_amount_npr.toLocaleString()}`);
  console.log(`Monthly savings: NPR ${advice.realistic_monthly_savings_npr.toLocaleString()}`);
  console.log(`Progress: ${advice.progress_percent}%`);
  console.log('Tips:', advice.tips);
  
  return advice;
}
```

### Example: Investment Advice

```javascript
async function getInvestmentAdvice() {
  const response = await fetch(`${API_BASE_URL}/api/v1/advice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      category: "invest",
      message: "I want to invest my savings of 500000 NPR",
      monthly_income_npr: 100000,
      monthly_expenses_npr: {
        food: 20000,
        rent: 30000,
        transport: 8000
      },
      current_savings_npr: 500000,
      location: "kathmandu",
      mode: "indepth",
      is_premium: true,
      extra_profile: {
        risk_tolerance: "medium",
        insurance_cost: 5000
      }
    })
  });

  const advice = await response.json();
  
  // Check if simulation data is available
  if (advice.simulation) {
    console.log('12-Month Investment Simulation:');
    advice.simulation.forEach(month => {
      console.log(`Month ${month.month}: Total Value = NPR ${month.total_value.toLocaleString()}`);
    });
  }
  
  return advice;
}
```

---

## 📊 Get Monthly Feedback

### Basic Example

```javascript
async function getMonthlyFeedback() {
  const requestData = {
    user_id: "user123",
    month: "2025-12",  // Format: "YYYY-MM"
    expenses: {
      food: 14200,
      rent: 18000,
      transport: 5000,
      shopping: 10000,
      entertainment: 8000
    }
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const feedback = await response.json();
    console.log('Feedback:', feedback);
    return feedback;
  } catch (error) {
    console.error('Error getting feedback:', error);
    throw error;
  }
}
```

### Response Structure

```javascript
const feedbackResponse = {
  month: "2025-12",
  total_expenses: 118000,
  rights: [                    // What you did right
    {
      title: "Cooked at home",
      amount: 4800,
      description: "Saved by cooking instead of eating out",
      solution: "Continue meal planning"  // May be blurred for free users
    }
  ],
  wrongs: [                   // What you did wrong
    {
      title: "Daraz binge shopping",
      amount: 19400,
      description: "Impulsive online purchases",
      solution: "Use 24-hour cart rule"  // May be blurred for free users
    }
  ],
  suggestions: [              // General suggestions
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3"
  ],
  is_premium: true
};
```

### Example: Display Feedback

```javascript
async function displayFeedback(userId, month, expenses) {
  const feedback = await getMonthlyFeedback();
  
  console.log(`\n📊 Monthly Feedback for ${feedback.month}`);
  console.log(`Total Expenses: NPR ${feedback.total_expenses.toLocaleString()}\n`);
  
  console.log('✅ What You Did Right:');
  feedback.rights.forEach(item => {
    console.log(`- ${item.title}: NPR ${item.amount.toLocaleString()}`);
    console.log(`  ${item.description}`);
    if (item.solution) {
      console.log(`  💡 ${item.solution}`);
    }
  });
  
  console.log('\n❌ What You Did Wrong:');
  feedback.wrongs.forEach(item => {
    console.log(`- ${item.title}: NPR ${item.amount.toLocaleString()} wasted`);
    console.log(`  ${item.description}`);
    if (item.solution) {
      console.log(`  💡 ${item.solution}`);
    }
  });
  
  console.log('\n💡 Suggestions:');
  feedback.suggestions.forEach(s => console.log(`- ${s}`));
  
  return feedback;
}
```

---

## ⚠️ Error Handling

### Complete Error Handling Example

```javascript
async function getAdviceWithErrorHandling(requestData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/advice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    // Check for HTTP errors
    if (!response.ok) {
      // Try to get error details from response
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use status text
      }
      
      throw new Error(errorMessage);
    }

    // Parse successful response
    const data = await response.json();
    return data;

  } catch (error) {
    // Handle different types of errors
    if (error instanceof TypeError) {
      // Network error (API not reachable)
      console.error('Network error: Cannot reach API. Check your internet connection.');
      throw new Error('Network error: API is not accessible');
    } else if (error instanceof SyntaxError) {
      // Invalid JSON response
      console.error('Invalid response from API');
      throw new Error('Invalid response format from API');
    } else {
      // Other errors (including API errors)
      console.error('API Error:', error.message);
      throw error;
    }
  }
}
```

### Common Error Responses

```javascript
// 400 Bad Request - Invalid category
{
  "detail": "Invalid category"
}

// 422 Unprocessable Entity - Validation error
{
  "detail": [
    {
      "field": "monthly_expenses_npr",
      "message": "monthly_expenses_npr cannot be empty",
      "type": "value_error"
    }
  ]
}

// 500 Internal Server Error - API key issue
{
  "detail": "GEMINI_API_KEY environment variable is not set or is invalid"
}
```

---

## 🎯 Complete Examples

### Example 1: React Component

```javascript
import { useState } from 'react';

function FinancialAdviceForm() {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://rag-pdf-ai31.onrender.com/api/v1/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: "buy",
          message: "I want to buy a bike",
          monthly_income_npr: 60000,
          monthly_expenses_npr: {
            food: 10000,
            rent: 15000,
            transport: 5000
          },
          current_savings_npr: 50000,
          location: "kathmandu",
          mode: "simple"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Request failed');
      }

      const data = await response.json();
      setAdvice(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get Advice'}
        </button>
      </form>

      {error && <div className="error">Error: {error}</div>}
      
      {advice && (
        <div>
          <h3>Advice</h3>
          <p>{advice.response_en}</p>
          <p>Months needed: {advice.months_needed}</p>
          <p>Target: NPR {advice.target_amount_npr.toLocaleString()}</p>
          <ul>
            {advice.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Example 2: Async/Await with Try-Catch

```javascript
async function getFinancialAdvice(category, message, income, expenses, savings) {
  const API_BASE_URL = "https://rag-pdf-ai31.onrender.com";
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/advice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: category,
        message: message,
        monthly_income_npr: income,
        monthly_expenses_npr: expenses,
        current_savings_npr: savings,
        location: "kathmandu",
        mode: "simple"
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    const advice = await response.json();
    return advice;
    
  } catch (error) {
    console.error('Failed to get advice:', error);
    throw error;
  }
}

// Usage
getFinancialAdvice(
  "buy",
  "I want to buy a phone",
  50000,
  { food: 10000, rent: 12000 },
  25000
).then(advice => {
  console.log('Advice received:', advice);
}).catch(error => {
  console.error('Error:', error.message);
});
```

### Example 3: Using Fetch with Promises

```javascript
const API_BASE_URL = "https://rag-pdf-ai31.onrender.com";

fetch(`${API_BASE_URL}/api/v1/advice`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    category: "invest",
    message: "I want to invest my savings",
    monthly_income_npr: 100000,
    monthly_expenses_npr: {
      food: 20000,
      rent: 30000
    },
    current_savings_npr: 500000,
    location: "kathmandu",
    mode: "indepth"
  })
})
.then(response => {
  if (!response.ok) {
    return response.json().then(err => Promise.reject(err));
  }
  return response.json();
})
.then(data => {
  console.log('Success:', data);
  // Use the advice data
  displayAdvice(data);
})
.catch(error => {
  console.error('Error:', error.detail || error.message);
  // Handle error
});
```

### Example 4: Convert Response to Text

```javascript
function formatAdviceAsText(advice) {
  let text = `${advice.response_en}\n\n`;
  
  text += `📊 Summary:\n`;
  text += `- Months Needed: ${advice.months_needed}\n`;
  text += `- Target Amount: NPR ${advice.target_amount_npr.toLocaleString()}\n`;
  text += `- Monthly Savings: NPR ${advice.realistic_monthly_savings_npr.toLocaleString()}\n`;
  text += `- Progress: ${advice.progress_percent}%\n\n`;
  
  if (advice.tips && advice.tips.length > 0) {
    text += `💡 Tips:\n`;
    advice.tips.forEach((tip, index) => {
      text += `${index + 1}. ${tip}\n`;
    });
    text += `\n`;
  }
  
  if (advice.alternatives && advice.alternatives.length > 0) {
    text += `🔄 Alternatives:\n`;
    advice.alternatives.forEach(alt => {
      text += `- ${alt.name}: NPR ${alt.price_npr.toLocaleString()} (${alt.months_needed} months)\n`;
    });
  }
  
  return text;
}

// Usage
const advice = await getFinancialAdvice(...);
const textResponse = formatAdviceAsText(advice);
console.log(textResponse);
```

---

## 📝 Quick Reference

### All Endpoints

```javascript
// Health Check
GET  / → { message, version }

// Financial Advice
POST /api/v1/advice → AdviceResponse

// Monthly Feedback
POST /api/v1/feedback → FeedbackResponse
```

### Required Headers

```javascript
{
  'Content-Type': 'application/json'
}
```

### Base URL

```javascript
const API_BASE_URL = "https://rag-pdf-ai31.onrender.com";
// Local: "http://localhost:8000"
```

---

## 🔗 Additional Resources

- **Interactive API Docs:** https://rag-pdf-ai31.onrender.com/docs
- **ReDoc:** https://rag-pdf-ai31.onrender.com/redoc
- **OpenAPI Schema:** https://rag-pdf-ai31.onrender.com/openapi.json

---

## 💡 Tips

1. **Always handle errors** - Network issues, API errors, etc.
2. **Validate input** - Ensure required fields are present
3. **Use async/await** - Cleaner than promises for sequential calls
4. **Check response.ok** - Don't assume success
5. **Parse JSON safely** - Use try-catch when parsing responses

---

**Happy coding! 🚀**

