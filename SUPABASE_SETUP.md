# Supabase Setup Guide for Paisa Ko Sahayogi

## Quick Setup (5 minutes)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login
3. Click "New Project"
4. Fill in:
   - **Name**: `paisa-ko-sahayogi`
   - **Database Password**: (save this!)
   - **Region**: Choose closest to Nepal
5. Wait 2 minutes for project to initialize

### 2. Get API Keys

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 3. Create Database Tables

Run this SQL in **SQL Editor**:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  name TEXT,
  is_premium BOOLEAN DEFAULT false,
  premium_start_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Query logs (for daily limits)
CREATE TABLE IF NOT EXISTS query_logs (
  user_id UUID REFERENCES users(id),
  date DATE,
  category TEXT,
  count INTEGER DEFAULT 1,
  PRIMARY KEY (user_id, date)
);

-- Expenses (for feedback)
CREATE TABLE IF NOT EXISTS expenses (
  user_id UUID REFERENCES users(id),
  month TEXT,
  expenses JSONB,
  total NUMERIC,
  created_at TIMESTAMP DEFAULT now(),
  PRIMARY KEY (user_id, month)
);

-- Goals
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  category TEXT,
  target_amount NUMERIC,
  current_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE query_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Create policies (allow users to read their own data)
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can read own query logs" ON query_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own expenses" ON expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own goals" ON goals FOR SELECT USING (auth.uid() = user_id);
```

### 4. Set Environment Variables

Add to your `.env` file:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this
```

### 5. Test Connection

```python
from supabase import create_client

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
result = supabase.table("users").select("*").limit(1).execute()
print(result)
```

## Features Enabled

✅ **User Management**: Track premium status  
✅ **Daily Limits**: Free users get 5 queries/day  
✅ **Expense Tracking**: Monthly feedback analysis  
✅ **Goal Tracking**: Multiple financial goals  
✅ **Query Logging**: Usage analytics  

## Premium Subscription Flow

1. User signs up → `users` table
2. Payment processed → Set `is_premium = true`
3. API checks `is_premium` → Unlocks features
4. Free users see blurred paywall

## Troubleshooting

- **Connection Error**: Check SUPABASE_URL and SUPABASE_KEY
- **RLS Error**: Disable RLS for testing (not recommended for production)
- **Table Not Found**: Run SQL script again

## Free Tier Limits

- 500MB database
- 2GB bandwidth/month
- 50,000 monthly active users
- Perfect for hackathon! 🚀

