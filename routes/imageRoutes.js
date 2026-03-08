/**
 * Image Upload & Template Routes
 * 
 * Add these routes to your Express app if needed
 */

const express = require('express');
const router = express.Router();
const {
    uploadAndSendTemplateWithImage,
    uploadImage,
    sendTemplateWithMediaId
} = require('../controller/sendmsg');

/**
 * @route   POST /uploadAndSendTemplateWithImage
 * @desc    Upload image and send grand opening template to all contacts
 * @access  Public
 * @body    { filePath: "string" }
 * @returns { mediaId, summary, results }
 */
router.post('/uploadAndSendTemplateWithImage', uploadAndSendTemplateWithImage);

/**
 * @route   POST /uploadImage
 * @desc    Upload image to WhatsApp and get media ID
 * @access  Public
 * @body    { filePath: "string" }
 * @returns { mediaId, filePath }
 */
router.post('/uploadImage', uploadImage);

/**
 * @route   POST /sendTemplateWithMediaId
 * @desc    Send grand opening template with existing media ID
 * @access  Public
 * @body    { mediaId: "string" }
 * @returns { summary, results }
 */
router.post('/sendTemplateWithMediaId', sendTemplateWithMediaId);

module.exports = router;

/**
 * USAGE IN APP.JS:
 * 
 * const imageRoutes = require('./routes/imageRoutes');
 * app.use('/api', imageRoutes);
 * 
 * OR if you want them on root:
 * 
 * app.use('/', imageRoutes);
 */
