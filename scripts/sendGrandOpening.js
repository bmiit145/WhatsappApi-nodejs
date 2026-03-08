#!/usr/bin/env node

/**
 * Grand Opening Template - Image Upload & Send Script
 * 
 * Usage:
 * node scripts/sendGrandOpening.js <image-path> [output-media-id.json]
 * 
 * Examples:
 * node scripts/sendGrandOpening.js ./public/images/grand-opening.jpg
 * node scripts/sendGrandOpening.js /path/to/image.jpg ./media-id.json
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

/**
 * Main function to upload and send
 */
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.error(`
Usage: node scripts/sendGrandOpening.js <image-path> [media-id-output]

Examples:
  node scripts/sendGrandOpening.js ./public/images/grand-opening.jpg
  node scripts/sendGrandOpening.js /path/to/image.jpg ./media-id.json

Arguments:
  <image-path>      - Path to the grand opening image file (required)
  [media-id-output] - Path to save the media ID for future use (optional)
        `);
        process.exit(1);
    }

    const imagePath = args[0];
    const mediaIdOutputPath = args[1];

    // Validate image exists
    if (!fs.existsSync(imagePath)) {
        console.error(`❌ Error: Image file not found: ${imagePath}`);
        process.exit(1);
    }

    const absolutePath = path.resolve(imagePath);
    console.log(`📸 Image Path: ${absolutePath}`);
    console.log(`📊 File Size: ${(fs.statSync(absolutePath).size / 1024 / 1024).toFixed(2)} MB`);

    try {
        // Step 1: Prompt for action
        console.log(`\n🚀 Starting Grand Opening Campaign...\n`);
        console.log('Choose action:');
        console.log('1. Upload image and send templates (all-in-one)');
        console.log('2. Just upload image (get media ID)');
        
        // For automated use, default to option 1
        const action = process.env.SKIP_PROMPT ? '1' : '1';
        
        if (action === '2') {
            await uploadImageOnly(absolutePath, mediaIdOutputPath);
        } else {
            await uploadAndSend(absolutePath);
        }
        
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

/**
 * Upload image and send templates in one call
 */
async function uploadAndSend(imagePath) {
    try {
        console.log(`\n📤 Uploading image and sending templates...`);
        
        const response = await axios.post(
            `${API_BASE_URL}/uploadAndSendTemplateWithImage`,
            { filePath: imagePath },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 600000 // 10 minutes timeout for large contact lists
            }
        );

        const data = response.data;
        
        console.log(`\n✅ Success!\n`);
        console.log(`📱 Media ID: ${data.mediaId}`);
        console.log(`\n📊 Campaign Summary:`);
        console.log(`   Total Contacts: ${data.summary.total}`);
        console.log(`   ✅ Sent: ${data.summary.success}`);
        console.log(`   ❌ Failed: ${data.summary.failed}`);
        console.log(`   Success Rate: ${((data.summary.success / data.summary.total) * 100).toFixed(2)}%`);
        
        // Show failed numbers if any
        if (data.summary.failed > 0 && data.results) {
            const failedResults = data.results.filter(r => !r.success).slice(0, 10);
            console.log(`\n📋 Failed Contacts (showing first 10):`);
            failedResults.forEach((result, index) => {
                console.log(`   ${index + 1}. ${result.number} - ${result.error}`);
            });
            if (data.summary.failed > 10) {
                console.log(`   ... and ${data.summary.failed - 10} more`);
            }
        }
        
        // Save media ID for future use
        const mediaIdData = {
            mediaId: data.mediaId,
            timestamp: new Date().toISOString(),
            imagePath: imagePath,
            contactsSent: data.summary.total,
            successCount: data.summary.success
        };
        
        const mediaIdFile = './media-id.json';
        fs.writeFileSync(mediaIdFile, JSON.stringify(mediaIdData, null, 2));
        console.log(`\n💾 Media ID saved to: ${mediaIdFile}`);
        
    } catch (err) {
        if (err.response?.data?.error) {
            console.error(`❌ API Error: ${err.response.data.error}`);
            console.error(`Details: ${JSON.stringify(err.response.data, null, 2)}`);
        } else if (err.message?.includes('ECONNREFUSED')) {
            console.error(`❌ Connection Error: Cannot reach server at ${API_BASE_URL}`);
            console.error(`Make sure your Express server is running.`);
        } else {
            throw err;
        }
    }
}

/**
 * Just upload image and get media ID
 */
async function uploadImageOnly(imagePath, outputPath) {
    try {
        console.log(`\n📤 Uploading image only (not sending templates)...`);
        
        const response = await axios.post(
            `${API_BASE_URL}/uploadImage`,
            { filePath: imagePath },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const data = response.data;
        
        console.log(`\n✅ Image uploaded successfully!\n`);
        console.log(`📱 Media ID: ${data.mediaId}`);
        console.log(`📁 File: ${data.filePath}`);
        
        // Save media ID
        const mediaIdData = {
            mediaId: data.mediaId,
            timestamp: new Date().toISOString(),
            imagePath: imagePath,
            note: 'Use this Media ID with /sendTemplateWithMediaId endpoint'
        };
        
        const outputFile = outputPath || './media-id.json';
        fs.writeFileSync(outputFile, JSON.stringify(mediaIdData, null, 2));
        console.log(`\n💾 Media ID saved to: ${outputFile}`);
        
        console.log(`\nNext Steps:`);
        console.log(`1. Copy the Media ID: ${data.mediaId}`);
        console.log(`2. Use endpoint: POST /sendTemplateWithMediaId`);
        console.log(`3. Send body: { "mediaId": "${data.mediaId}" }`);
        
    } catch (err) {
        if (err.response?.data?.error) {
            console.error(`❌ API Error: ${err.response.data.error}`);
        } else {
            throw err;
        }
    }
}

// Run main
main().catch(err => {
    console.error('❌ Fatal Error:', err);
    process.exit(1);
});
