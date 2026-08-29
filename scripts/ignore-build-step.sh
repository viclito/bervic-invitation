#!/bin/bash

# Vercel Ignored Build Step Script
# Exit code 1 = PROCEED with build (changes detected in web or shared packages)
# Exit code 0 = CANCEL/SKIP build (changes only in apps/mobile, docs, etc.)

echo "Checking for changes in apps/web and packages..."

# Check if there are changes between previous commit and current commit in web or shared packages
if git diff --quiet HEAD^ HEAD ./apps/web ./packages; then
  echo "🛑 No changes detected in apps/web or packages. Skipping Vercel build."
  exit 0
else
  echo "✅ Changes detected in apps/web or packages. Proceeding with build."
  exit 1
fi
