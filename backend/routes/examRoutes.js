const express = require("express");
const {getAvailableExams, getExamQuestions}  = require("../controllers/examController");
const router = express.Router();

router.get('/', getAvailableExams);
router.get('/:exam_id', getExamQuestions);

module.exports = router;