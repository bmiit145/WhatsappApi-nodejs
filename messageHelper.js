var axios = require('axios');

function sendMessage(data) {
  var config = {
    method: 'post',
    url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
    headers: {
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    data: data
  };

  return axios(config)
}

function getTextMessageInput(recipient, text) {
    return JSON.stringify({
      "messaging_product": "whatsapp",
      "preview_url": false,
      "recipient_type": "individual",
      "to": recipient,
      "type": "text",
      "text": {
          "body": text
      }
    });
  }
  
  
function getTemplatedMessageInput(recipient) {
    return JSON.stringify({
      "messaging_product": "whatsapp",
      "to": recipient,
      "type": "template",
      "template": {
        "name": "project_information_event",
        "language": {
          "code": "gu"
        }
      }
    });
  }

/**
 * Get template message with image header (for Grand Opening event)
 * @param {string} recipient - Recipient phone number
 * @param {string} mediaId - WhatsApp media ID for the image
 * @returns {string} - JSON stringified template message
 */
function getImageTemplateInput(recipient, mediaId) {
    return JSON.stringify({
      "messaging_product": "whatsapp",
      "to": recipient,
      "type": "template",
      "template": {
        "name": "project_information_event",
        "language": {
          "code": "gu"
        },
        "components": [
          {
            "type": "header",
            "parameters": [
              {
                "type": "image",
                "image": {
                  "id": mediaId
                }
              }
            ]
          }
        ]
      }
    });
  }

/**
 * Get template message with image from URL
 * @param {string} recipient - Recipient phone number
 * @param {string} imageUrl - URL of the image
 * @returns {string} - JSON stringified template message
 */
function getImageTemplateInputUrl(recipient, imageUrl) {
    return JSON.stringify({
      "messaging_product": "whatsapp",
      "to": recipient,
      "type": "template",
      "template": {
        "name": "project_information_event",
        "language": {
          "code": "gu"
        },
        "components": [
          {
            "type": "header",
            "parameters": [
              {
                "type": "image",
                "image": {
                  "link": imageUrl
                }
              }
            ]
          }
        ]
      }
    });
  }
  
module.exports = {
    sendMessage: sendMessage,
    getTextMessageInput: getTextMessageInput,
    getTemplatedMessageInput: getTemplatedMessageInput,
    getImageTemplateInput: getImageTemplateInput,
    getImageTemplateInputUrl: getImageTemplateInputUrl
};