const express = require("express");
const {submitExam, getResults} = require("../controllers/resultController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express();

router.post('/submit_exam', authMiddleware(['Student']), submitExam);
router.get('/:userId', authMiddleware(['Student']), getResults);

module.exports = router;