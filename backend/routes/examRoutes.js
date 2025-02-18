const express = require("express");
const {getAvailableExams, getExamQuestions, uploadExam}  = require("../controllers/examController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get('/', authMiddleware(['Student','Admin']), getAvailableExams);
router.get('/:exam_id', authMiddleware(['Student','Admin']), getExamQuestions);
// POST /upload-exam (Admin only)
router.post('/upload-exam', authMiddleware(['Admin']), uploadExam);

module.exports = router;