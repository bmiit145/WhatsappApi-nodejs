const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

/**
 * Upload media (image/video/document) to WhatsApp and get media ID
 * @param {string} filePath - Path to the media file
 * @param {string} mediaType - Type of media ('image', 'video', 'document', 'audio')
 * @returns {Promise<string>} - Media ID
 */
async function uploadMedia(filePath, mediaType = 'image') {
    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const fileStream = fs.createReadStream(filePath);
        const form = new FormData();
        
        form.append('file', fileStream);
        form.append('type', getMimeType(mediaType, filePath));
        form.append('messaging_product', 'whatsapp');

        const config = {
            method: 'post',
            url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/media`,
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                ...form.getHeaders()
            },
            data: form,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        };

        console.log(`Uploading media: ${path.basename(filePath)} (${mediaType})...`);
        const response = await axios(config);
        
        const mediaId = response.data.id;
        console.log(`✅ Media uploaded successfully! Media ID: ${mediaId}`);
        
        return mediaId;
    } catch (err) {
        console.error('Error uploading media:', err.response?.data || err.message);
        throw err;
    }
}

/**
 * Get MIME type based on media type and file extension
 */
function getMimeType(mediaType, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    const mimeTypes = {
        image: {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
        },
        video: {
            '.mp4': 'video/mp4',
            '.mov': 'video/quicktime',
            '.avi': 'video/x-msvideo',
            '.webm': 'video/webm'
        },
        document: {
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.xls': 'application/vnd.ms-excel',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.ppt': 'application/vnd.ms-powerpoint',
            '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            '.txt': 'text/plain'
        },
        audio: {
            '.mp3': 'audio/mpeg',
            '.wav': 'audio/wav',
            '.m4a': 'audio/mp4',
            '.aac': 'audio/aac',
            '.ogg': 'audio/ogg'
        }
    };

    return mimeTypes[mediaType]?.[ext] || 'application/octet-stream';
}

/**
 * Upload media from URL
 * @param {string} mediaUrl - URL of the media file
 * @param {string} mediaType - Type of media
 * @returns {Promise<string>} - Media ID
 */
async function uploadMediaFromUrl(mediaUrl, mediaType = 'image') {
    try {
        const form = new FormData();
        const response = await axios.get(mediaUrl, { responseType: 'stream' });
        
        form.append('file', response.data);
        form.append('type', mediaType);
        form.append('messaging_product', 'whatsapp');

        const config = {
            method: 'post',
            url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/media`,
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                ...form.getHeaders()
            },
            data: form,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        };

        console.log(`Uploading media from URL: ${mediaUrl}...`);
        const uploadResponse = await axios(config);
        
        const mediaId = uploadResponse.data.id;
        console.log(`✅ Media uploaded successfully! Media ID: ${mediaId}`);
        
        return mediaId;
    } catch (err) {
        console.error('Error uploading media from URL:', err.response?.data || err.message);
        throw err;
    }
}

/**
 * Get media ID (retrieve existing media)
 * @param {string} mediaId - Media ID
 * @returns {Promise<object>} - Media information
 */
async function getMedia(mediaId) {
    try {
        const config = {
            method: 'get',
            url: `https://graph.facebook.com/${process.env.VERSION}/${mediaId}`,
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
            }
        };

        const response = await axios(config);
        return response.data;
    } catch (err) {
        console.error('Error retrieving media:', err.response?.data || err.message);
        throw err;
    }
}

module.exports = {
    uploadMedia,
    uploadMediaFromUrl,
    getMedia
};
