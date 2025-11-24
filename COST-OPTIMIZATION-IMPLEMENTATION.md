# Cost Optimization Implementation Guide

> **Step-by-step guide to implementing cost optimization features**

## Quick Start

### 1. Update Environment Variables

Copy the new variables to your `.env.local`:

```bash
# Copy from .env.example
cp .env.example .env.local

# Or add these manually to .env.local:
ENABLE_CACHING=true
ENABLE_REQUEST_DEDUPLICATION=true
API_RATE_LIMIT_MAX_REQUESTS=10
API_RATE_LIMIT_WINDOW_MS=60000
```

### 2. Choose Implementation Level

**Option A: Quick Integration (Recommended)**
- Add cost estimation display to frontend
- Enable caching and rate limiting
- Time: 15 minutes

**Option B: Full Integration**
- Replace API route with optimized version
- Add usage analytics dashboard
- Time: 1-2 hours

---

## Option A: Quick Integration

### Step 1: Update Frontend (15 minutes)

Add cost estimation to your main page component:

```typescript
// In app/page.tsx
import { CostEstimateDisplay, CostInfoTooltip } from "@/app/components/CostEstimateDisplay";

// Add before the analyze button:
<CostEstimateDisplay
  articleText={articleText}
  className="mb-4"
/>

// Add info tooltip next to title:
<h1>
  記事分析 AI
  <CostInfoTooltip />
</h1>
```

### Step 2: Add Client-Side Rate Limiting

```typescript
// In app/page.tsx
import { ClientRateLimiter } from "@/app/utils/rate-limiter";

// At component level:
const rateLimiter = new ClientRateLimiter(2000); // 2 second cooldown

// In handleAnalyze:
const handleAnalyze = async () => {
  if (!rateLimiter.canMakeRequest()) {
    const remaining = rateLimiter.getRemainingCooldown();
    setError(`Please wait ${Math.ceil(remaining / 1000)} seconds before analyzing again`);
    return;
  }
  // ... rest of your code
};
```

### Step 3: Enable Environment Variables

```bash
# In .env.local
ENABLE_CACHING=true
ENABLE_REQUEST_DEDUPLICATION=true
API_RATE_LIMIT_MAX_REQUESTS=10
```

### Step 4: Restart Development Server

```bash
npm run dev
```

**Done!** You now have:
- ✅ Cost estimation display
- ✅ Client-side rate limiting (2 second cooldown)
- ✅ Request deduplication (30 second window)

---

## Option B: Full Integration

### Step 1: Backup Current Route

```bash
# Backup your current route
cp app/api/analyze-article-full/route.ts app/api/analyze-article-full/route.backup.ts
```

### Step 2: Replace with Optimized Route

```bash
# Replace with optimized version
cp app/api/analyze-article-full/route-optimized.ts app/api/analyze-article-full/route.ts
```

Or manually copy the contents of `route-optimized.ts` into `route.ts`.

### Step 3: Update Frontend

Add the cost estimate display and enhanced error handling:

```typescript
// In app/page.tsx
import { CostEstimateDisplay } from "@/app/components/CostEstimateDisplay";
import { ClientRateLimiter } from "@/app/utils/rate-limiter";

export default function Home() {
  const rateLimiter = new ClientRateLimiter(2000);

  // ... existing state ...

  const handleAnalyze = async () => {
    // Rate limit check
    if (!rateLimiter.canMakeRequest()) {
      setError("Please wait before analyzing again");
      return;
    }

    if (!articleText.trim()) {
      setError("記事のテキストを入力してください");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysisData(null);

    try {
      const response = await fetch("/api/analyze-article-full", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articleText }),
      });

      const data = await response.json();

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = data.retryAfter || 60;
        setError(`Too many requests. Please wait ${retryAfter} seconds.`);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "分析に失敗しました");
      }

      // Show metadata if available
      if (data._metadata) {
        console.log("Request metadata:", {
          cached: data._metadata.cached,
          cost: data._metadata.actualCost?.toFixed(4),
          tokens: data._metadata.tokensUsed,
        });
      }

      setAnalysisData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* ... existing JSX ... */}

      {/* Add cost estimate before button */}
      <CostEstimateDisplay
        articleText={articleText}
        className="mb-4"
      />

      {/* ... existing button ... */}
    </main>
  );
}
```

### Step 4: Configure Environment

```bash
# In .env.local - Full configuration
ANTHROPIC_API_KEY=your_key_here

# Cost Control
MAX_TOKENS_PER_REQUEST=2000
MAX_ARTICLE_LENGTH=10000

# Rate Limiting
API_RATE_LIMIT_MAX_REQUESTS=10
API_RATE_LIMIT_WINDOW_MS=60000

# Caching
ENABLE_CACHING=true
CACHE_TTL_MS=1800000
CACHE_MAX_SIZE=1000

# Request Deduplication
ENABLE_REQUEST_DEDUPLICATION=true
DEDUPLICATION_WINDOW_MS=30000

# Analytics
ENABLE_USAGE_ANALYTICS=true
LOG_DETAILED_USAGE=true  # Set false in production
```

### Step 5: Test the Implementation

```bash
# Start dev server
npm run dev

# Test in browser:
# 1. Enter article text
# 2. Check cost estimate display
# 3. Click analyze
# 4. Try clicking again immediately (should be rate limited)
# 5. Enter same article again (should use cached result)
```

### Step 6: Monitor Usage

View usage statistics:

```bash
# In browser console:
fetch('/api/usage-stats?period=today')
  .then(r => r.json())
  .then(console.log);

# Get markdown report:
fetch('/api/usage-stats?period=week&format=markdown')
  .then(r => r.text())
  .then(console.log);
```

---

## Verification Checklist

After implementation, verify each feature:

### Cost Estimation
- [ ] Cost estimate displays before clicking analyze
- [ ] Cost updates as you type
- [ ] Cost is accurate (check console logs)

### Rate Limiting
- [ ] Can't click analyze button rapidly
- [ ] Error message shows when rate limited
- [ ] Rate limit resets after time window

### Caching
- [ ] Same article returns cached result
- [ ] Response includes `_metadata.cached: true`
- [ ] Cache expires after 30 minutes

### Request Deduplication
- [ ] Identical requests within 30s return cached result
- [ ] Different articles not affected

### Usage Analytics
- [ ] API calls are logged (check console)
- [ ] `/api/usage-stats` returns data
- [ ] Token counts are accurate

---

## Testing Guide

### Test 1: Cost Estimation

```typescript
// In browser console:
import { estimateAnalysisCost } from '@/app/utils/cost-estimator';

const text = "Your article text...";
const estimate = estimateAnalysisCost(text);
console.log("Estimated cost:", estimate.total);
```

Expected: Cost between $0.025-$0.050 for typical articles

### Test 2: Rate Limiting

1. Click "Analyze" button
2. Immediately click again
3. Should see error: "Please wait before analyzing again"
4. Wait 2 seconds
5. Click again - should work

### Test 3: Caching

1. Enter article text
2. Click "Analyze"
3. Note the response time
4. Enter SAME article again
5. Click "Analyze"
6. Should be instant (cached)
7. Check response: `_metadata.cached: true`

### Test 4: Deduplication

1. Enter article text
2. Click "Analyze"
3. Within 30 seconds, analyze same text again
4. Should return instantly from deduplication cache
5. Console should show: "[Deduplication] Returning cached result"

### Test 5: Usage Analytics

```typescript
// In browser console or Node.js:
const response = await fetch('/api/usage-stats?period=today');
const stats = await response.json();

console.log("Today's usage:", {
  requests: stats.totalRequests,
  cost: stats.totalCost,
  cacheHitRate: stats.cache.hitRate,
});
```

---

## Troubleshooting

### Issue: Cost estimate not showing

**Solution:**
```typescript
// Check if component is imported
import { CostEstimateDisplay } from "@/app/components/CostEstimateDisplay";

// Check if articleText prop is passed correctly
<CostEstimateDisplay articleText={articleText} />
```

### Issue: Rate limiting not working

**Solution:**
```bash
# Check environment variables
echo $API_RATE_LIMIT_MAX_REQUESTS

# If using client-side rate limiter:
const rateLimiter = new ClientRateLimiter(2000); // Create at component level, not in function
```

### Issue: Caching not working

**Solution:**
```bash
# Check if enabled
ENABLE_CACHING=true

# Check console for cache hits
# Should see: "[Cache] Returning cached response"

# Verify cache stats
fetch('/api/usage-stats').then(r => r.json()).then(d => console.log(d.cache));
```

### Issue: Deduplication not preventing duplicates

**Solution:**
```bash
# Check if enabled
ENABLE_REQUEST_DEDUPLICATION=true

# Ensure time window is reasonable
DEDUPLICATION_WINDOW_MS=30000  # 30 seconds

# Check if request parameters are exactly the same
```

### Issue: Usage stats returning empty

**Solution:**
```bash
# Check if analytics enabled
ENABLE_USAGE_ANALYTICS=true

# Make sure you've made at least one API call
# Check if logs are working
LOG_DETAILED_USAGE=true
```

---

## Performance Impact

Expected performance characteristics:

| Feature | Latency Impact | Memory Impact | Notes |
|---------|---------------|---------------|-------|
| Cost Estimation | ~1ms | Negligible | Client-side calculation |
| Rate Limiting | ~1-2ms | ~10KB per client | In-memory tracking |
| Caching | -95% on hits | ~1MB per 1000 entries | Huge performance win |
| Deduplication | ~2-3ms | ~5KB per client | Prevents duplicate work |
| Usage Analytics | ~1ms | ~500KB per 10K requests | Async logging |

**Overall**: Minimal overhead, massive cost savings

---

## Monitoring Recommendations

### Daily Monitoring

```bash
# Check today's costs
curl http://localhost:3000/api/usage-stats?period=today | jq

# Key metrics to watch:
# - totalCost: Should be < your daily budget
# - cache.hitRate: Higher is better (target: >30%)
# - averageCostPerRequest: Should be ~$0.025-$0.040
```

### Weekly Review

```bash
# Generate weekly report
curl http://localhost:3000/api/usage-stats?period=week&format=markdown > weekly-report.md

# Review:
# - Total costs
# - Cache effectiveness
# - Endpoint usage patterns
```

### Alerts Setup

Consider setting up alerts for:
- Daily cost > $10
- Cache hit rate < 20%
- Rate limit triggered > 100 times/hour
- Failed requests > 5%

---

## Production Deployment

### Before Deploying

1. **Test thoroughly in development**
   - All features working
   - No console errors
   - Rate limits appropriate

2. **Configure production settings**
   ```bash
   # .env.production
   ENABLE_CACHING=true
   ENABLE_REQUEST_DEDUPLICATION=true
   LOG_DETAILED_USAGE=false  # Important: Don't log PII
   API_RATE_LIMIT_MAX_REQUESTS=20  # Adjust for production load
   ```

3. **Set up monitoring**
   - Usage analytics endpoint
   - Cost alerts
   - Error tracking

### After Deploying

1. **Monitor first 24 hours closely**
   - Check costs every few hours
   - Verify cache hit rate
   - Check for errors

2. **Adjust settings as needed**
   - Increase rate limits if too restrictive
   - Adjust cache TTL based on usage patterns
   - Fine-tune deduplication window

3. **Document actual costs**
   - Compare to estimates
   - Calculate savings from optimizations
   - Share results with team

---

## Cost Savings Calculator

Use this to estimate your savings:

```typescript
// Before optimizations
const requestsPerDay = 100;
const costPerRequest = 0.040; // $0.04
const dailyCostBefore = requestsPerDay * costPerRequest;
// = $4.00/day = $120/month

// After optimizations (assuming 30% cache hit rate)
const cacheHitRate = 0.30;
const cachedRequests = requestsPerDay * cacheHitRate;
const uncachedRequests = requestsPerDay * (1 - cacheHitRate);
const dailyCostAfter = uncachedRequests * costPerRequest;
// = $2.80/day = $84/month

// Savings
const dailySavings = dailyCostBefore - dailyCostAfter;
const monthlySavings = dailySavings * 30;
// = $1.20/day = $36/month (30% savings)

console.log("Monthly savings:", monthlySavings);
```

---

## Next Steps

After successful implementation:

1. **Monitor for 1 week**
   - Track actual costs
   - Measure cache effectiveness
   - Identify optimization opportunities

2. **Consider Redis for production**
   - Persistent caching across server restarts
   - Distributed caching for multiple servers
   - Better cache management

3. **Implement advanced features**
   - User-based rate limits
   - Cost budgets per user
   - A/B testing different prompt strategies

4. **Share learnings**
   - Document what worked
   - Calculate ROI of optimizations
   - Help others optimize their AI costs

---

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review console logs for errors
3. Test each feature individually
4. Verify environment variables are set correctly

For questions about specific features, refer to:
- `COST-OPTIMIZATION-GUIDE.md` - Detailed feature documentation
- `app/utils/*.ts` - Utility function implementations
- API route comments for integration details

---

## Summary

You've now implemented:

✅ **Cost Estimation** - Users see costs before submitting
✅ **Rate Limiting** - Prevent abuse and cost spikes
✅ **Request Deduplication** - Avoid processing identical requests
✅ **Caching** - Reuse results for 30 minutes
✅ **Usage Analytics** - Track and monitor API usage

**Expected Results:**
- 30-50% cost reduction from caching
- 10-30% reduction from deduplication
- Predictable costs from rate limiting
- Better user experience with instant cached responses

**Typical Cost:**
- Before: $0.040/request
- After: $0.028/request (with 30% cache hit rate)
- Savings: $36/month per 100 requests/day
