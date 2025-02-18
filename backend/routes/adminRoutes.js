const express = require("express");
const router = express.Router();

router.get("/:exam_id", getExamDetails);
router.put("/:exam_id", updateExam);