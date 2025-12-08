# Paisa Ko Sahayogi - Frontend

Next.js frontend application for Paisa Ko Sahayogi.

## Setup

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Configure Environment Variables

Create `.env.local` file in the `frontend` folder:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=https://rag-pdf-ai31.onrender.com
# For local development: http://localhost:8000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 3. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

## Backend API Integration

The frontend is integrated with the FastAPI backend. The integration is handled through:

### API Client (`lib/api/backend.ts`)

This file provides:
- `getAdvice()` - Get financial advice from backend
- `getFeedback()` - Get monthly expense feedback
- `formatAdviceAsText()` - Convert JSON response to readable text
- `formatFeedbackAsText()` - Convert feedback JSON to readable text

### Usage Example

```typescript
import { getAdvice, formatAdviceAsText } from "@/lib/api/backend"

// Get advice
const adviceData = await getAdvice({
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

// Convert to text format
const textResponse = formatAdviceAsText(adviceData)
```

## API Endpoints

### Backend Endpoints (FastAPI)
- **Advice:** `POST /api/v1/advice`
- **Feedback:** `POST /api/v1/feedback`

### Frontend API Routes (Next.js)
- **AI Chat:** `POST /api/ai-chat` - Now connected to backend API
- **Financial Data:** `GET/POST /api/financial`
- **Expenses:** `GET/POST /api/expenses`
- **Profile:** `GET/PUT /api/profile`

## Features

- ✅ Backend API integration for financial advice
- ✅ JSON to text conversion utilities
- ✅ Supabase integration for user management
- ✅ AI Chat component connected to backend
- ✅ Financial dashboard
- ✅ Expense tracking

## Documentation

- **Backend API Docs:** See `../backend/YOUR_API_LINKS.md`
- **Backend README:** See `../backend/README.md`
- **Interactive API Docs:** https://rag-pdf-ai31.onrender.com/docs

