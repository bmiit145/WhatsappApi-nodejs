const express = require('express');
const router = express.Router();

const ContactController = require("../controller/contactController");

router.get("/save" , ContactController.saveOneContact);
router.get("/saveExcel" , ContactController.SaveExcelContact);

module.exports = router;