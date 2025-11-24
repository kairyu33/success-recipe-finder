# 🧪 History Feature - Testing Guide

How to test the comprehensive history management feature.

## 🏃 Quick Test

### 1. Start the App

```bash
npm run dev
```

Visit: `http://localhost:3000`

### 2. Create First Analysis

1. Enter some article text
2. Click "分析開始" (Analyze)
3. Wait for results
4. ✅ Analysis automatically saved to history

### 3. Open History

1. Look for clock icon (⏰) in top-right corner
2. See badge with number "1"
3. Click the history button
4. ✅ History panel slides in from right

### 4. View History Item

1. Click on the history card
2. ✅ Full-screen modal opens
3. See all analysis details
4. Try copying a result
5. Click "閉じる" to close

## 🔍 Detailed Testing

### Test Auto-Save

1. Analyze 3 different articles
2. Check history count badge (should be 3)
3. Open history panel
4. ✅ Verify all 3 analyses appear

### Test Search

1. Open history panel
2. Type keyword in search box
3. ✅ Results filter instantly
4. Clear search
5. ✅ All items return

### Test Sort

1. Open history panel
2. Click sort dropdown
3. Try each option:
   - 新しい順 (Newest)
   - 古い順 (Oldest)
   - コスト高い順 (Cost high to low)
   - コスト低い順 (Cost low to high)
4. ✅ Verify order changes

### Test Delete

1. Open history panel
2. Hover over an item
3. Click trash icon (🗑)
4. Confirm deletion
5. ✅ Item disappears
6. ✅ Count badge updates

### Test Clear All

1. Open history panel
2. Scroll to bottom
3. Click "全て削除" (Clear All)
4. Confirm action
5. ✅ All items deleted
6. ✅ Empty state shows

### Test Export

1. Create some analyses
2. Open history panel
3. Click "履歴をエクスポート"
4. ✅ File downloads as JSON
5. Open file
6. ✅ Verify valid JSON format

### Test Statistics

1. Create multiple analyses
2. Open history panel
3. Click 📊 icon
4. ✅ Stats panel expands
5. Verify:
   - Total analyses count
   - Total cost (USD & JPY)
   - Average cost
   - Average tokens
   - Progress bar

### Test Modal Details

1. Open history panel
2. Click any item
3. In modal, verify:
   - ✅ Article preview
   - ✅ All titles listed
   - ✅ All hashtags displayed
   - ✅ Insights shown
   - ✅ Metadata correct
   - ✅ Copy buttons work
   - ✅ Export button works

### Test Load in Editor

1. Open history item in modal
2. Click "エディターで開く"
3. ✅ Modal closes
4. ✅ Article preview loaded in editor
5. ✅ Alert shows about preview-only

### Test Mobile View

1. Open DevTools
2. Toggle device toolbar (mobile view)
3. Test all features:
   - ✅ History button visible
   - ✅ Panel full-width on mobile
   - ✅ Cards stack properly
   - ✅ Modal responsive
   - ✅ Touch targets adequate

### Test Dark Mode

1. Enable system dark mode
2. Refresh page
3. ✅ All colors adapt
4. ✅ Text readable
5. ✅ Contrast sufficient

## 🐛 Edge Cases

### Test Empty State

1. Clear all history
2. Open history panel
3. ✅ "履歴はまだありません" message shows
4. ✅ Helpful guidance displayed

### Test Storage Warning

**Manual Test** (requires localStorage manipulation):

```javascript
// In browser console
const fakeHistory = Array(90).fill({
  id: Date.now().toString(),
  timestamp: Date.now(),
  articlePreview: 'Test article...',
  results: {},
  metadata: {}
});

localStorage.setItem('note-hashtag-history', JSON.stringify({
  version: '1.0',
  items: fakeHistory,
  settings: { maxItems: 100, autoDeleteAfterDays: 30 }
}));

// Refresh page
// ✅ Warning should appear
```

### Test Search with No Results

1. Open history panel
2. Type gibberish: "xyz123abc"
3. ✅ "検索結果がありません" shows
4. ✅ Suggestion to try different keywords

### Test Single Item

1. Clear all history
2. Create one analysis
3. Open history panel
4. ✅ Single item displays correctly
5. ✅ No layout issues

### Test 100+ Items

**Manual Test** (localStorage):

```javascript
// Create 105 items
const items = Array(105).fill(null).map((_, i) => ({
  id: `test-${i}`,
  timestamp: Date.now() - (i * 1000),
  articlePreview: `Article ${i}...`,
  results: { hashtags: [`#tag${i}`] },
  metadata: { cost: 0.01 }
}));

localStorage.setItem('note-hashtag-history', JSON.stringify({
  version: '1.0',
  items,
  settings: { maxItems: 100, autoDeleteAfterDays: 30 }
}));

// Refresh
// ✅ Only 100 items should show
```

### Test Cross-Tab Sync

1. Open app in two browser tabs
2. In Tab 1: Create an analysis
3. In Tab 2: Open history panel
4. ✅ New item should appear
5. In Tab 2: Delete an item
6. In Tab 1: Refresh history
7. ✅ Item should be gone

### Test LocalStorage Disabled

1. Disable localStorage in browser
2. Try to analyze article
3. ✅ App should still work
4. ✅ History features gracefully degrade

## 📊 Performance Testing

### Large Dataset Performance

1. Create 50+ analyses
2. Measure:
   - ✅ Panel open time < 200ms
   - ✅ Search response < 100ms
   - ✅ Scroll smooth (60fps)
   - ✅ No memory leaks

### Network Independence

1. Enable offline mode
2. ✅ History still accessible
3. ✅ Search works
4. ✅ Export works
5. ✅ Delete works

## ✅ Acceptance Criteria

All these should pass:

### Functionality
- [x] Auto-save after analysis
- [x] View all history items
- [x] Search by content
- [x] Sort by multiple criteria
- [x] Delete single item
- [x] Clear all history
- [x] Export to JSON
- [x] View item details
- [x] Copy results
- [x] Load in editor
- [x] View statistics

### UI/UX
- [x] History button visible
- [x] Badge shows count
- [x] Panel smooth animation
- [x] Modal displays correctly
- [x] Search instant
- [x] Sort updates immediately
- [x] Loading states shown
- [x] Error states handled

### Responsive
- [x] Desktop layout
- [x] Tablet layout
- [x] Mobile layout
- [x] Touch-friendly
- [x] Keyboard accessible

### Themes
- [x] Light mode
- [x] Dark mode
- [x] System preference

### Edge Cases
- [x] Empty state
- [x] Single item
- [x] Many items (100+)
- [x] No search results
- [x] Storage warnings
- [x] Quota exceeded

## 🎯 Test Scenarios

### Scenario 1: Daily User

```
Day 1:
1. Write article
2. Analyze with app
3. History auto-saves ✅
4. Copy hashtags ✅
5. Close app

Day 2:
1. Open app
2. Check history ✅
3. Find yesterday's analysis ✅
4. Copy results again ✅
```

### Scenario 2: Power User

```
Week 1:
1. Analyze 20 articles
2. Check stats weekly ✅
3. Monitor costs ✅
4. Export for records ✅

Week 2:
1. Search old analyses ✅
2. Compare results ✅
3. Delete old entries ✅
4. Free up space ✅
```

### Scenario 3: Mobile User

```
On phone:
1. Open app ✅
2. Analyze article ✅
3. Check history ✅
4. Touch-friendly UI ✅
5. Search works ✅
6. Copy easy ✅
```

## 🔧 Developer Testing

### TypeScript Checks

```bash
npm run type-check
```

✅ No errors in history feature code

### Lint Checks

```bash
npm run lint
```

✅ All code follows style guide

### Build Test

```bash
npm run build
```

✅ Production build succeeds

## 📝 Bug Report Template

If you find a bug:

```markdown
**Bug Description:**
[Clear description of the issue]

**Steps to Reproduce:**
1. [First step]
2. [Second step]
3. [Third step]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Environment:**
- Browser: [Chrome 90, Firefox 88, etc.]
- OS: [Windows 11, macOS, etc.]
- Device: [Desktop, Mobile, etc.]

**Screenshots:**
[If applicable]

**Console Errors:**
[Any errors in browser console]
```

## 🎉 Success Checklist

Before marking testing complete:

- [ ] All auto-save tests pass
- [ ] Search works correctly
- [ ] Sort options functional
- [ ] Delete operations work
- [ ] Export downloads properly
- [ ] Statistics accurate
- [ ] Modal displays correctly
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] Edge cases handled
- [ ] Performance acceptable
- [ ] No console errors
- [ ] TypeScript passes
- [ ] Build succeeds

## 📚 Resources

- **Feature Guide**: `HISTORY-FEATURE-GUIDE.md`
- **Quick Start**: `HISTORY-QUICKSTART.md`
- **Implementation**: `HISTORY-IMPLEMENTATION-SUMMARY.md`
- **Component Docs**: See JSDoc in source files

---

**Happy Testing!** 🧪✨

Found a bug? Open an issue with details above.
Everything working? Give us a star! ⭐
