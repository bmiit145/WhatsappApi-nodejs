const express = require('express');
const router = express.Router();

const ContactController = require("../controller/contactController");

router.get("/save" , ContactController.saveContact);

module.exports = router;