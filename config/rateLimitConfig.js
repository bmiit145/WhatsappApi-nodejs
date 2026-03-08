/**
 * WhatsApp Business API Rate Limit Configuration
 * 
 * Meta WhatsApp Business API Rate Limits (as of 2024):
 * - Cloud API Standard: Up to 80 messages per second
 * - The actual limit depends on your business verification status and message quality rating
 * 
 * Message Quality Rating Impact:
 * - High Quality: Higher throughput
 * - Medium Quality: Standard throughput
 * - Low Quality: Reduced throughput
 * 
 * Best Practices:
 * 1. Start conservative (20-30 messages per batch) and gradually increase
 * 2. Monitor your quality rating in Meta Business Manager
 * 3. Adjust based on your specific use case and rate limit tier
 * 4. Implement proper error handling for rate limit responses (HTTP 429)
 * 
 * References:
 * - https://developers.facebook.com/docs/whatsapp/cloud-api/support/rate-limits
 * - https://developers.facebook.com/docs/whatsapp/messaging-limits
 */

module.exports = {
    // Number of messages to send before taking a break
    MESSAGES_PER_BATCH: 20,
    
    // Delay between batches in milliseconds (recommended: 2000-5000ms)
    DELAY_BETWEEN_BATCHES: 3000,
    
    // Delay between individual messages in milliseconds (recommended: 50-200ms)
    DELAY_BETWEEN_MESSAGES: 100,
    
    // Maximum number of retry attempts when rate limit is hit
    MAX_RETRIES: 3,
    
    // Delay before retrying after a rate limit error in milliseconds
    RETRY_DELAY: 5000,
    
    /**
     * Presets for different scenarios
     * Uncomment and use a preset by copying values above
     */
    PRESETS: {
        // Very conservative - for testing or high-quality requirements
        CONSERVATIVE: {
            MESSAGES_PER_BATCH: 10,
            DELAY_BETWEEN_BATCHES: 5000,
            DELAY_BETWEEN_MESSAGES: 200,
        },
        
        // Balanced - good for most use cases
        BALANCED: {
            MESSAGES_PER_BATCH: 20,
            DELAY_BETWEEN_BATCHES: 3000,
            DELAY_BETWEEN_MESSAGES: 100,
        },
        
        // Aggressive - for verified businesses with high quality rating
        AGGRESSIVE: {
            MESSAGES_PER_BATCH: 40,
            DELAY_BETWEEN_BATCHES: 2000,
            DELAY_BETWEEN_MESSAGES: 50,
        },
        
        // Bulk sending - careful, monitor for rate limit errors
        BULK: {
            MESSAGES_PER_BATCH: 50,
            DELAY_BETWEEN_BATCHES: 1000,
            DELAY_BETWEEN_MESSAGES: 30,
        }
    }
};
