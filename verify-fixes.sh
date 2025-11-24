#!/bin/bash
echo "=========================================="
echo "UI Fixes Verification Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

check_file() {
  local file=$1
  local pattern=$2
  local description=$3
  
  if grep -q "$pattern" "$file" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} $description"
    return 0
  else
    echo -e "${RED}✗${NC} $description"
    return 1
  fi
}

check_file_exists() {
  local file=$1
  local description=$2
  
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $description"
    return 0
  else
    echo -e "${RED}✗${NC} $description"
    return 1
  fi
}

echo "Checking character limit fixes..."
check_file "lib/validation.ts" "'30000'" "Character limit in validation.ts set to 30000"
check_file "app/error.tsx" "30,000文字" "Error message shows 30,000 characters"
echo ""

echo "Checking UI component fixes..."
check_file "app/components/features/ArticleInput/ArticleInput.tsx" "h-2.5" "Progress bar height fixed to h-2.5"
check_file "app/components/features/AnalysisResults/HashtagsTab.tsx" "px-4 py-2" "Hashtag button size reduced"
echo ""

echo "Checking error handling improvements..."
check_file_exists "app/components/ui/ErrorBoundary/ErrorBoundary.tsx" "Error boundary component created"
check_file "app/components/features/AnalysisResults/AnalysisResults.tsx" "ErrorBoundary" "Error boundary imported in AnalysisResults"
check_file "app/components/features/AnalysisResults/AnalysisResults.tsx" "handleTabChange" "Debounced tab switching implemented"
echo ""

echo "Checking animation configuration..."
check_file "app/globals.css" "animate-progress-bar" "Progress bar animation keyframes exist"
echo ""

echo "=========================================="
echo "Verification Complete"
echo "=========================================="
echo ""
echo "To run the application and test the fixes:"
echo "  npm run dev"
echo ""
echo "Test these scenarios:"
echo "  1. Enter text with 30,000+ characters"
echo "  2. Click tabs rapidly while analyzing"
echo "  3. Check progress bar during analysis"
echo "  4. Test 'Copy All' button in hashtag tab"
echo ""
