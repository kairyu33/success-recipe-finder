# 📜 History Feature - Quick Start

Get started with the history management feature in 5 minutes.

## 🚀 TL;DR

The app now automatically saves all your analyses to browser storage. Click the history button (clock icon) in the header to view past analyses.

## 🎯 Key Features

1. **Auto-Save**: Every analysis is automatically saved
2. **Search**: Find past analyses by content
3. **Stats**: Track your usage and costs
4. **Export**: Download your history as JSON
5. **Mobile-Friendly**: Works great on all devices

## 🖱️ How to Use

### View History

1. Click the **History button** (⏰) in the top-right corner
2. Browse your past analyses
3. Click any item to view full details

### Search History

1. Open the history panel
2. Type in the search box
3. Results update instantly

### View Details

1. Click any history item
2. See full results in a modal
3. Copy any result with one click
4. Export individual analysis

### Delete History

**Single Item**:
- Click the trash icon on any item
- Confirm deletion

**All History**:
- Open history panel
- Scroll to bottom
- Click "全て削除" button
- Confirm action

### Export History

1. Open history panel
2. Click "履歴をエクスポート"
3. File downloads automatically
4. Keep as backup

### Import History

_Coming soon in next update_

## 📊 Statistics

View your usage stats:

1. Open history panel
2. Click the 📊 icon in the header
3. See:
   - Total analyses performed
   - Total cost spent
   - Average cost per analysis
   - Token usage

## 💡 Pro Tips

### Storage Management

- History auto-deletes after 30 days
- Maximum 100 items kept
- Warning shows when nearly full
- Export before clearing

### Performance

- Search is instant
- History loads fast
- No lag on mobile
- Smooth animations

### Privacy

- All data stays in your browser
- Nothing sent to servers
- Delete anytime
- Export for backup

## 🎨 UI Overview

```
┌─────────────────────────────────┐
│  📰 Note Hashtag AI Generator  │
│                          ⏰ (23) │  <- History button
└─────────────────────────────────┘

Click ⏰ opens:

┌─────────────────────┐
│ 📜 履歴 (23)   [×]  │
├─────────────────────┤
│ 🔍 Search...        │
│ [Sort ▼] [📊]      │
├─────────────────────┤
│ ┌─────────────────┐ │
│ │ 2 hours ago     │ │
│ │ "記事を書く時..." │ │
│ │ 💰¥1.80 📊 20#│ │
│ │ [👁] [🗑]      │ │  <- Click to view
│ └─────────────────┘ │
│                     │
│ [Export] [Clear]    │
└─────────────────────┘
```

## 🔧 Technical Details

### Data Storage

- Stored in: `localStorage`
- Key: `note-hashtag-history`
- Format: JSON
- Size limit: ~5MB
- Auto-cleanup: 30 days

### What's Saved

Each analysis saves:
- Article preview (first 100 chars)
- All generated titles
- All hashtags
- Insights and benefits
- Eye-catch suggestions
- Cost and tokens used
- Timestamp

### What's NOT Saved

- Full article text (too large)
- API keys
- Sensitive data
- Image files

## ⚠️ Limitations

- **Storage**: Limited to ~5MB browser storage
- **Devices**: Each device has separate history
- **Private Mode**: History clears when closing browser
- **Full Text**: Only preview saved, not full article

## 🆘 Troubleshooting

### History Not Appearing

1. Check if localStorage enabled
2. Try incognito mode
3. Clear browser cache
4. Check browser console

### Storage Full Warning

1. Open history panel
2. Delete old entries
3. Or export and clear all
4. Restart browser

### Can't Export

1. Check browser allows downloads
2. Try different browser
3. Check disk space
4. Contact support

## 🎓 Examples

### Daily Usage Workflow

```
Morning:
1. Write article
2. Analyze with app
3. History auto-saves ✅

Afternoon:
1. Need to reference morning analysis
2. Open history panel
3. Search for keywords
4. Copy hashtags
5. Done! 🎉
```

### End of Month Review

```
1. Open history panel
2. Click stats icon
3. Review monthly costs
4. Export for records
5. Clear old entries
```

## 📱 Mobile Usage

**Optimized for mobile**:
- Swipe-friendly
- Large tap targets
- Responsive design
- Fast loading

**Tip**: Add to home screen for app-like experience!

## 🔐 Privacy First

Your data is:
- ✅ Stored locally only
- ✅ Never sent to servers
- ✅ Fully under your control
- ✅ Deletable anytime
- ✅ Exportable anytime

## 🚀 Next Steps

1. **Try it**: Analyze an article
2. **Check history**: Click history button
3. **Explore**: View details, search, stats
4. **Export**: Keep a backup
5. **Share feedback**: What would you improve?

## 📚 Learn More

For detailed documentation:
- Read: `HISTORY-FEATURE-GUIDE.md`
- Check: Component source code
- See: Type definitions

## 🎉 Enjoy!

The history feature makes the app even more powerful. Never lose your work again!

---

**Questions?** Check the full documentation or open an issue on GitHub.
