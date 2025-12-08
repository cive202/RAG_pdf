# Backend vs Frontend Architecture

## 🔄 How They Work Together

**Short Answer:** Backend and frontend files are **completely separate**. They communicate **only through HTTP API calls** (like a website talking to a server).

---

## 📁 File Structure

```
API_EMBARK/
├── backend/          # Python FastAPI (Separate)
│   └── main.py       # Runs on Render: https://rag-pdf-ai31.onrender.com
│
└── frontend/         # Next.js React (Separate)
    └── lib/api/backend.ts  # Makes HTTP calls to backend
```

---

## 🔌 How They Communicate

### 1. **No Direct File Dependencies**
- ❌ Frontend does NOT import backend Python files
- ❌ Backend does NOT import frontend React files
- ✅ They are **completely independent**

### 2. **Communication via HTTP API**

**Frontend → Backend:**
```typescript
// frontend/lib/api/backend.ts
const response = await fetch('https://rag-pdf-ai31.onrender.com/api/v1/advice', {
  method: 'POST',
  body: JSON.stringify({ category: 'buy', message: '...' })
})
```

**Backend → Frontend:**
```python
# backend/main.py
@app.post("/api/v1/advice")
async def get_advice(request: AdviceRequest):
    # Process request
    return {"response_en": "...", "tips": [...]}  # Returns JSON
```

### 3. **Data Flow**

```
User Types in Chat
    ↓
Frontend (React) - app/chat/page.tsx
    ↓
Calls: getAdvice() from lib/api/backend.ts
    ↓
HTTP POST Request → https://rag-pdf-ai31.onrender.com/api/v1/advice
    ↓
Backend (FastAPI) - main.py receives request
    ↓
Processes with Gemini AI
    ↓
Returns JSON Response
    ↓
Frontend receives JSON
    ↓
Converts to text with formatAdviceAsText()
    ↓
Displays in chat UI
```

---

## 📊 What Each Side Does

### Backend (Python/FastAPI)
- ✅ Runs on Render server
- ✅ Handles business logic
- ✅ Calls Gemini AI API
- ✅ Processes financial calculations
- ✅ Returns JSON data
- ✅ **Does NOT know about frontend UI**

### Frontend (Next.js/React)
- ✅ Runs in user's browser
- ✅ Handles UI/UX
- ✅ Makes HTTP requests to backend
- ✅ Displays data to user
- ✅ **Does NOT know about backend implementation**

---

## 🔑 Key Points

1. **They're Separate Services**
   - Backend: Deployed on Render (Python)
   - Frontend: Runs in browser (JavaScript/TypeScript)

2. **Communication is HTTP Only**
   - Frontend sends HTTP requests
   - Backend responds with JSON
   - Like any website talking to an API

3. **No Shared Code**
   - Backend Python files ≠ Frontend TypeScript files
   - They only share the **API contract** (request/response format)

4. **Environment Variables**
   - Backend needs: `GEMINI_API_KEY` (on Render)
   - Frontend needs: `NEXT_PUBLIC_API_URL` (optional, has fallback)

---

## 📝 Example: Chat Feature

**When user types in chat:**

1. **Frontend** (`app/chat/page.tsx`):
   ```typescript
   const adviceData = await getAdvice({
     category: "buy",
     message: "I want a bike",
     monthly_income_npr: 60000,
     // ...
   })
   ```

2. **API Client** (`lib/api/backend.ts`):
   ```typescript
   fetch('https://rag-pdf-ai31.onrender.com/api/v1/advice', {
     method: 'POST',
     body: JSON.stringify(request)
   })
   ```

3. **Backend** (`main.py`):
   ```python
   @app.post("/api/v1/advice")
   async def get_advice(request: AdviceRequest):
       # Uses Gemini AI
       # Returns JSON
   ```

4. **Frontend receives JSON** and displays it

---

## 🎯 Summary

- **Backend files** = Server-side logic (Python)
- **Frontend files** = Client-side UI (TypeScript/React)
- **Connection** = HTTP API calls (like REST API)
- **No direct dependencies** = They're completely separate

Think of it like:
- **Backend** = Kitchen (cooks the food)
- **Frontend** = Restaurant (takes orders, serves food)
- **API** = The waiter (carries orders and food between them)


