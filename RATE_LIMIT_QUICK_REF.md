# Rate Limiting Quick Reference

## Current Configuration
- **Batch Size**: 20 messages
- **Between Batches**: 3 seconds
- **Between Messages**: 100ms
- **Max Retries**: 3
- **Retry Delay**: 5 seconds

## Quick Adjustments

### Too Many Rate Limit Errors? Slow it down:
Edit `config/rateLimitConfig.js`:
```javascript
MESSAGES_PER_BATCH: 10,           // Reduce from 20
DELAY_BETWEEN_BATCHES: 5000,      // Increase from 3000
```

### Sending Too Slowly? Speed it up:
```javascript
MESSAGES_PER_BATCH: 30,           // Increase from 20
DELAY_BETWEEN_BATCHES: 2000,      // Reduce from 3000
```

## Console Output Meanings

✅ **Success Message**: `[1/500] Processed: 919909011082 - Success`
❌ **Failed Message**: `[2/500] Processed: 918140288000 - Failed`
📊 **Batch Complete**: `Completed batch of 20 messages. Taking a 3000ms break...`
⚠️ **Rate Limit Hit**: `Rate limit hit for 919909011082. Retrying in 5000ms...`

## Presets

Copy these into `config/rateLimitConfig.js`:

### Testing (Very Slow)
```javascript
MESSAGES_PER_BATCH: 5,
DELAY_BETWEEN_BATCHES: 10000,
DELAY_BETWEEN_MESSAGES: 500,
```

### Conservative (Recommended for Starting)
```javascript
MESSAGES_PER_BATCH: 10,
DELAY_BETWEEN_BATCHES: 5000,
DELAY_BETWEEN_MESSAGES: 200,
```

### Balanced (Current Default)
```javascript
MESSAGES_PER_BATCH: 20,
DELAY_BETWEEN_BATCHES: 3000,
DELAY_BETWEEN_MESSAGES: 100,
```

### Aggressive (High-Quality Accounts Only)
```javascript
MESSAGES_PER_BATCH: 40,
DELAY_BETWEEN_BATCHES: 2000,
DELAY_BETWEEN_MESSAGES: 50,
```

## Time Estimates

| Messages | Preset       | Approx Time  |
|----------|--------------|--------------|
| 100      | Conservative | ~3-4 minutes |
| 100      | Balanced     | ~1-1.5 min   |
| 100      | Aggressive   | ~30-40 sec   |
| 500      | Conservative | ~15-20 min   |
| 500      | Balanced     | ~4-5 minutes |
| 500      | Aggressive   | ~2-3 minutes |

## Meta Rate Limit Info

- **Standard Cloud API**: 80 messages/second max
- **Your actual limit**: Depends on quality rating
- **Error Code**: HTTP 429 or WhatsApp 130429
- **Quality Rating**: Check Meta Business Manager

## Tips

1. **Start slow** - Use Conservative preset first
2. **Monitor console** - Watch for rate limit warnings
3. **Check quality** - Low quality = strict limits
4. **Test small** - Try 10-20 messages first
5. **Peak time** - Use slower settings during business hours
