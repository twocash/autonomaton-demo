#!/bin/bash
# deploy.sh — Build and deploy Autonomaton to the-grove.ai/autonomaton
#
# Usage: ./deploy.sh [commit message]
#
# What it does:
#   1. Builds the Vite project
#   2. Copies dist/ to ../the-grove-foundation/autonomaton/
#   3. Commits and pushes grove-foundation (triggers Cloud Build)
#
# Prerequisites:
#   - grove-autonomaton-example and the-grove-foundation repos side-by-side
#   - Git configured with push access to the-grove-foundation

set -e  # Exit on any error

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
GROVE_FOUNDATION="../the-grove-foundation"
AUTONOMATON_DIR="$GROVE_FOUNDATION/autonomaton"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}[1/4]${NC} Building Autonomaton..."
cd "$SCRIPT_DIR"
npm run build

echo -e "${YELLOW}[2/4]${NC} Copying to grove-foundation..."
rm -rf "$AUTONOMATON_DIR"
mkdir -p "$AUTONOMATON_DIR"
cp -r dist/* "$AUTONOMATON_DIR/"

echo -e "${YELLOW}[3/4]${NC} Committing changes..."
cd "$GROVE_FOUNDATION"

# Check if there are changes to commit
if git diff --quiet autonomaton/ 2>/dev/null && git diff --cached --quiet autonomaton/ 2>/dev/null; then
    echo "No changes detected in autonomaton/"
    exit 0
fi

git add autonomaton/

# Use provided message or generate default
COMMIT_MSG="${1:-"chore: Update Autonomaton demo"}"
git commit -m "$COMMIT_MSG

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

echo -e "${YELLOW}[4/4]${NC} Pushing to trigger Cloud Build..."
git push origin main

echo -e "${GREEN}✓ Done!${NC} Cloud Build will deploy in ~3-5 minutes."
echo -e "  View at: https://the-grove.ai/autonomaton"
