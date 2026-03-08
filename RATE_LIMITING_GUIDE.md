# WhatsApp API Rate Limiting Implementation

## Overview
This implementation adds intelligent rate limiting to prevent hitting Meta's WhatsApp Business API rate limits when sending bulk messages.

## What Changed

### 1. **Rate Limiting Configuration** (`config/rateLimitConfig.js`)
A centralized configuration file with:
- Configurable message batch sizes
- Adjustable delays between batches and messages
- Retry logic settings
- Pre-configured presets for different scenarios

### 2. **Updated Controller** (`controller/sendmsg.js`)
Added smart rate limiting features:
- **Batch Processing**: Sends messages in controlled batches
- **Automatic Delays**: Adds small delays between messages and larger breaks between batches
- **Retry Logic**: Automatically retries when rate limits are hit (HTTP 429 errors)
- **Progress Tracking**: Console logs show real-time progress
- **Summary Reports**: Detailed success/failure statistics

## Meta WhatsApp Rate Limits (2024)

### Cloud API Limits
- **Standard Tier**: Up to 80 messages per second
- **Actual limits vary** based on:
  - Business verification status
  - Message quality rating (High/Medium/Low)
  - Account history and reputation

### Rate Limit Error Codes
- `HTTP 429`: Too Many Requests
- `Error Code 130429`: WhatsApp specific rate limit

## Configuration Guide

### Default Settings (Balanced Approach)
```javascript
MESSAGES_PER_BATCH: 20          // Send 20 messages per batch
DELAY_BETWEEN_BATCHES: 3000     // Wait 3 seconds between batches
DELAY_BETWEEN_MESSAGES: 100     // Wait 100ms between each message
MAX_RETRIES: 3                  // Retry up to 3 times on rate limit
RETRY_DELAY: 5000               // Wait 5 seconds before retry
```

### How to Adjust Settings

Edit `/config/rateLimitConfig.js`:

#### Conservative (Testing/High Quality Requirements)
```javascript
MESSAGES_PER_BATCH: 10,
DELAY_BETWEEN_BATCHES: 5000,
DELAY_BETWEEN_MESSAGES: 200,
```

#### Aggressive (Verified Business/High Quality Rating)
```javascript
MESSAGES_PER_BATCH: 40,
DELAY_BETWEEN_BATCHES: 2000,
DELAY_BETWEEN_MESSAGES: 50,
```

#### Bulk Sending (Use with Caution)
```javascript
MESSAGES_PER_BATCH: 50,
DELAY_BETWEEN_BATCHES: 1000,
DELAY_BETWEEN_MESSAGES: 30,
```

## Features

### 1. Batch Processing
Messages are sent in controlled groups with breaks in between:
```
Batch 1: [20 messages] → 3s break
Batch 2: [20 messages] → 3s break
Batch 3: [20 messages] → 3s break
...
```

### 2. Automatic Retry on Rate Limits
When a rate limit error is detected:
1. Waits 5 seconds (configurable)
2. Automatically retries the message
3. Repeats up to 3 times (configurable)
4. Logs retry attempts for monitoring

### 3. Progress Monitoring
Real-time console output:
```
[1/500] Processed: 919909011082 - Success
[2/500] Processed: 918140288000 - Success
...
[20/500] Completed batch of 20 messages. Taking a 3000ms break...
...
=== Summary ===
Total: 500 | Success: 495 | Failed: 5
```

### 4. Detailed Response
API returns comprehensive results:
```json
{
  "message": "Completed with rate limiting",
  "summary": {
    "total": 500,
    "success": 495,
    "failed": 5
  },
  "results": [
    { "success": true, "number": "919909011082", "response": {...} },
    { "success": false, "number": "918140288000", "error": "..." }
  ]
}
```

## Updated Endpoints

### 1. `/sendTempMsg` (Template Messages to Array)
Sends templated messages with rate limiting to a hardcoded array of numbers.

**Example Response:**
```json
{
  "message": "Completed with rate limiting",
  "summary": {
    "total": 500,
    "success": 498,
    "failed": 2
  },
  "results": [...]
}
```

### 2. `/sendMultiContact` (Messages to Database Contacts)
Sends templated messages with rate limiting to all contacts in the database.

**Example Response:**
```json
{
  "message": "Successfully sent with rate limiting",
  "summary": {
    "total": 150,
    "success": 150,
    "failed": 0
  },
  "results": [...]
}
```

## Best Practices

### 1. Start Conservative
Begin with lower batch sizes and longer delays, then gradually increase as you monitor results.

### 2. Monitor Quality Rating
Check your message quality rating in Meta Business Manager regularly. Poor ratings lead to stricter limits.

### 3. Handle Failures Gracefully
- Save failed numbers for retry
- Don't immediately retry large batches
- Investigate patterns in failures

### 4. Timing Considerations
- **Peak Hours**: Use more conservative settings during busy times
- **Off-Peak**: Can use more aggressive settings at night
- **Business Hours**: Consider recipient time zones

### 5. Testing
Test with small batches first:
```javascript
MESSAGES_PER_BATCH: 5,
DELAY_BETWEEN_BATCHES: 10000,  // 10 seconds
```

## Troubleshooting

### Still Getting Rate Limit Errors?

1. **Increase delays**:
   ```javascript
   DELAY_BETWEEN_BATCHES: 5000,  // Increase from 3000 to 5000
   ```

2. **Decrease batch size**:
   ```javascript
   MESSAGES_PER_BATCH: 10,  // Decrease from 20 to 10
   ```

3. **Check your quality rating** in Meta Business Manager

4. **Verify your tier limits** with Meta support

### Slow Sending Speed?

If messages are sending too slowly:

1. **Decrease delays** (if not hitting rate limits):
   ```javascript
   DELAY_BETWEEN_BATCHES: 2000,
   DELAY_BETWEEN_MESSAGES: 50,
   ```

2. **Increase batch size**:
   ```javascript
   MESSAGES_PER_BATCH: 30,
   ```

### Monitoring Tips

Watch console logs for patterns:
- Multiple rate limit warnings → Slow down
- All success → Can potentially speed up
- Specific number patterns failing → Investigate those numbers

## Calculation Examples

### Example 1: Conservative Settings
```
- 500 messages total
- 10 messages per batch
- 5 seconds between batches
- 200ms between messages

Time calculation:
- Batches: 500 / 10 = 50 batches
- Message delays: 500 × 0.2s = 100s
- Batch delays: 49 × 5s = 245s
- Total time: ~345 seconds (~5.75 minutes)
```

### Example 2: Balanced Settings (Default)
```
- 500 messages total
- 20 messages per batch
- 3 seconds between batches
- 100ms between messages

Time calculation:
- Batches: 500 / 20 = 25 batches
- Message delays: 500 × 0.1s = 50s
- Batch delays: 24 × 3s = 72s
- Total time: ~122 seconds (~2 minutes)
```

### Example 3: Aggressive Settings
```
- 500 messages total
- 40 messages per batch
- 2 seconds between batches
- 50ms between messages

Time calculation:
- Batches: 500 / 40 = 12.5 batches (13 batches)
- Message delays: 500 × 0.05s = 25s
- Batch delays: 12 × 2s = 24s
- Total time: ~49 seconds
```

## References

- [WhatsApp Cloud API Rate Limits](https://developers.facebook.com/docs/whatsapp/cloud-api/support/rate-limits)
- [WhatsApp Messaging Limits](https://developers.facebook.com/docs/whatsapp/messaging-limits)
- [WhatsApp Business Account Quality Rating](https://developers.facebook.com/docs/whatsapp/messaging-limits/quality-rating-and-messaging-limits)

## Support

If you continue to experience rate limiting issues:
1. Review your Meta Business Manager dashboard
2. Contact Meta Business Support
3. Check for any policy violations
4. Verify your business verification status
