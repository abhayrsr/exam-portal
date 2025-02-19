const express = require("express");
const {submitExam} = require("../controllers/resultController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express();

router.post('/submit_exam', authMiddleware(['Student']), submitExam);

module.exports = router;