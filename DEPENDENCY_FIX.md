# Dependency Conflict Fix

## Problem

There's a dependency conflict between:
- `google-genai 1.0.0` requires `websockets>=13.0,<15.0`
- `supabase`'s `realtime` dependency requires `websockets<13,>=11`

## Solution Options

### Option 1: Remove uvicorn[standard] extra (Recommended)

If you don't need WebSocket support in uvicorn for your API, remove the `[standard]` extra:

```txt
uvicorn==0.32.1  # Instead of uvicorn[standard]
```

This is already done in the updated requirements.txt.

### Option 2: Update Supabase (Try first)

Try updating supabase to the latest version which might support websockets 13:

```bash
pip install --upgrade supabase
```

Then update requirements.txt with the new version.

### Option 3: Use compatible versions

If the conflict persists, you can try:

1. Install packages in a specific order
2. Use `pip install --no-deps` for one package and install dependencies manually
3. Consider if you actually need Supabase realtime functionality (it's only used for live subscriptions)

### Option 4: Make Supabase Optional

Since Supabase is only needed for premium features, you can make it completely optional by installing it separately if needed.

## Testing the Fix

After updating requirements.txt, test locally:

```bash
pip install -r requirements.txt
```

If it works locally, it should work on your deployment platform.

## Current Status

The requirements.txt has been updated to remove the `[standard]` extra from uvicorn, which should resolve the conflict. Try deploying again!
