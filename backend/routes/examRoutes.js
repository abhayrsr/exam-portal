const express = require("express");
const {getAvailableExams}  = require("../controllers/examController");
const router = express.Router();

router.get('/', getAvailableExams);

module.exports = router;