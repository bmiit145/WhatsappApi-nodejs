const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.json());

const sendMsgController = require("../controller/sendmsg");

router.get("/send" ,  sendMsgController.sendMsg);
router.get("/sendtemp" , sendMsgController.sendTempMsg );

module.exports = router;