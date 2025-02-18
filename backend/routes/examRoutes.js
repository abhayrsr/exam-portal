const express = require("express");
const {getAvailableExams, getExamQuestions}  = require("../controllers/examController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get('/', authMiddleware(['Student','Admin']), getAvailableExams);
router.get('/:exam_id', authMiddleware(['Student','Admin']), getExamQuestions);

module.exports = router;