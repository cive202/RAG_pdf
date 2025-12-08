# Supabase Authentication Setup Guide

## Problem: Login/Signup Not Working

If you're getting "Invalid credentials" errors when trying to log in after signup, it's likely due to one of these issues:

### Issue 1: Email Confirmation Required (Most Common)

By default, Supabase requires users to confirm their email before they can log in. After signup, users receive a confirmation email and must click the link before logging in.

**Solution Options:**

#### Option A: Disable Email Confirmation (For Development)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **Settings**
4. Under **Email Auth**, find **"Enable email confirmations"**
5. **Disable** it for development
6. Save changes

Now users can log in immediately after signup without email confirmation.

#### Option B: Keep Email Confirmation (For Production)

1. After signup, check the user's email inbox
2. Click the confirmation link in the email
3. Then try logging in

### Issue 2: Missing Environment Variables

If Supabase environment variables are not set, the app falls back to mock authentication which won't work for real users.

**Solution:**

1. Create a `.env.local` file in the `frontend` folder:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

2. Get these values from:
   - Supabase Dashboard → Project Settings → API
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role key (keep secret!)

3. Restart your Next.js dev server after adding environment variables

### Issue 3: Supabase Project Not Set Up

If you don't have a Supabase project yet:

1. Go to https://supabase.com
2. Create a free account
3. Create a new project
4. Wait for the project to finish setting up
5. Get your API keys from Project Settings → API
6. Add them to `.env.local` as shown above

### Testing the Fix

1. **Clear browser storage** (or use incognito mode)
2. Try signing up with a new email
3. If email confirmation is disabled, you should be able to log in immediately
4. If email confirmation is enabled, check your email and click the confirmation link first

### Common Error Messages

- **"Invalid login credentials"** → Email not confirmed OR wrong password
- **"Email not confirmed"** → Check your email and click confirmation link
- **"User already registered"** → Account exists, try logging in instead
- **"Failed to create account"** → Check Supabase environment variables

### Need Help?

Check the browser console (F12) for detailed error messages that will help identify the specific issue.


