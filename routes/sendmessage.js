const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.json());

const sendMsgController = require("../controller/sendmsg");

router.get("/send" ,  sendMsgController.sendMsg);
router.get("/sendtmp" , sendMsgController.sendTempMsg );
router.get("/senddb" , sendMsgController.sendMultiContact );     // from database

module.exports = router;