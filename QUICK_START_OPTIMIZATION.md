# Quick Start: API Cost Optimization

## TL;DR - 3 Steps to Deploy

```bash
# 1. Set environment variables
echo "ENABLE_API_RESPONSE_CACHE=true" >> .env.local
echo "API_CACHE_TTL=86400" >> .env.local
echo "DAILY_BUDGET=10.0" >> .env.local

# 2. Deploy optimized routes (choose one endpoint to test first)
cd app/api/generate-hashtags
mv route.ts route.original.ts
mv route.optimized-v2.ts route.ts

# 3. Start and monitor
npm run dev
# Open: http://localhost:3000/api/cost-dashboard?action=summary
```

**Expected Results:**
- 15-25% savings from dynamic token allocation
- 80-95% savings on cached responses
- 54-62% overall cost reduction

---

## What Was Implemented

### New Files Created

1. **`app/utils/dynamicTokens.ts`** - Smart token allocation
2. **`app/lib/responseCache.ts`** - Response caching with SHA-256
3. **`app/utils/costMonitor.ts`** - Cost tracking and analytics
4. **`app/api/cost-dashboard/route.ts`** - Monitoring dashboard API

### Optimized API Routes (v2)

1. **`app/api/analyze-article-full/route.optimized-v2.ts`**
2. **`app/api/analyze-article/route.optimized-v2.ts`**
3. **`app/api/generate-hashtags/route.optimized-v2.ts`**

---

## Quick Test

```bash
# Test optimized hashtag generation
curl -X POST http://localhost:3000/api/generate-hashtags \
  -H "Content-Type: application/json" \
  -d '{
    "articleText": "AI技術を活用したnote記事の最適化について解説します。Claude AIを使って、効果的なハッシュタグを自動生成する方法を紹介します。"
  }'

# Check if it worked
curl http://localhost:3000/api/cost-dashboard?action=summary | jq

# Make the SAME request again (should be cached)
curl -X POST http://localhost:3000/api/generate-hashtags \
  -H "Content-Type: application/json" \
  -d '{
    "articleText": "AI技術を活用したnote記事の最適化について解説します。Claude AIを使って、効果的なハッシュタグを自動生成する方法を紹介します。"
  }'

# Verify cache hit
curl http://localhost:3000/api/cost-dashboard?action=cache-stats | jq
```

**Expected Output:**
- First request: `"cacheStatus": "miss"`, ~$0.010 cost
- Second request: `"cacheStatus": "hit"`, ~$0.001 cost (95% savings!)

---

## Environment Variables

```bash
# Required
ENABLE_API_RESPONSE_CACHE=true

# Optional (with defaults)
API_CACHE_TTL=86400              # 24 hours
API_CACHE_MAX_SIZE=5000          # 5000 cached responses
DAILY_BUDGET=10.0                # Daily cost alert threshold
```

---

## Monitoring Commands

### Check Today's Costs
```bash
curl http://localhost:3000/api/cost-dashboard?action=summary
```

### View Full Report
```bash
curl http://localhost:3000/api/cost-dashboard?action=report
```

### Get Cache Statistics
```bash
curl http://localhost:3000/api/cost-dashboard?action=cache-stats
```

### Get Optimization Tips
```bash
curl http://localhost:3000/api/cost-dashboard?action=optimize-recommendations
```

### Export Logs
```bash
curl http://localhost:3000/api/cost-dashboard?action=export > cost-logs.json
```

---

## Rollback Instructions

If you need to revert to original routes:

```bash
cd app/api/generate-hashtags
mv route.ts route.optimized-v2.ts
mv route.original.ts route.ts
```

---

## Key Metrics to Watch

| Metric | Target | Action If Below Target |
|--------|--------|----------------------|
| Cache Hit Rate | > 30% | Increase cache TTL |
| Avg Cost/Request | < $0.020 | Review token allocations |
| Daily Cost | < Budget | Adjust endpoint usage |

---

## Cost Comparison

### Before Optimization
```
/api/analyze-article-full: $0.022/request (fixed 4000 tokens)
/api/analyze-article:      $0.015/request (fixed 1000 tokens)
/api/generate-hashtags:    $0.010/request (fixed 500 tokens)
```

### After Optimization (40% cache hit rate)
```
/api/analyze-article-full: $0.013/request (dynamic + cache)
/api/analyze-article:      $0.009/request (dynamic + cache)
/api/generate-hashtags:    $0.006/request (dynamic + cache)
```

**Savings: 40-49% reduction**

---

## Troubleshooting

### Cache Not Working
```bash
# Check if enabled
echo $ENABLE_API_RESPONSE_CACHE  # Should output: true

# Verify cache stats show hits
curl http://localhost:3000/api/cost-dashboard?action=cache-stats
```

### Costs Still High
```bash
# Get optimization recommendations
curl http://localhost:3000/api/cost-dashboard?action=optimize-recommendations

# Check token allocations in logs
tail -f logs/api.log | grep "DynamicTokens"
```

### Budget Exceeded
```bash
# Check summary for alert
curl http://localhost:3000/api/cost-dashboard?action=summary | jq .budgetAlert

# Increase budget or optimize further
export DAILY_BUDGET=20.0
```

---

## Next Steps

1. **Monitor for 24 hours** with one optimized endpoint
2. **Review cache hit rate** - aim for > 30%
3. **Deploy to remaining endpoints** if successful
4. **Set up daily monitoring** with cron job:
   ```bash
   # Add to crontab
   0 9 * * * curl http://localhost:3000/api/cost-dashboard?action=report | mail -s "Daily API Cost Report" admin@example.com
   ```

---

## Full Documentation

See `API_COST_OPTIMIZATION_IMPLEMENTATION.md` for:
- Detailed architecture explanations
- Advanced configuration options
- Future enhancement roadmap
- Complete API reference

---

**Questions?** Check the main documentation or review the inline code comments in the optimization files.
