#!/bin/bash
set -e

echo "Installing dependencies from requirements.txt..."
pip install -r requirements.txt

echo "Attempting to install supabase (optional, for premium features)..."
# Install supabase core dependencies manually to work around websockets conflict
# The realtime dependency requires websockets<13, but google-genai needs websockets>=13
# We install supabase's dependencies manually, but skip realtime since it's not used in the code
echo "Installing supabase dependencies (excluding realtime)..."
pip install httpx==0.25.2 postgrest==0.15.1 storage3==0.7.7 gotrue==2.12.4 supafunc==0.3.3 || true

# Install supabase package itself without dependencies
echo "Installing supabase package..."
pip install supabase==2.10.0 --no-deps || {
    echo "Warning: Could not install supabase package."
    echo "API will work without premium features (user tracking, daily limits)."
    echo "Core features (all 8 advice categories) will still work perfectly."
}

echo "Build complete!"

