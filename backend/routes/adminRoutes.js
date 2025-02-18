const express = require("express");
const {getExamDetails, updateExam} = require("../controllers/adminController");
const router = express.Router();


router.get("/:exam_id", getExamDetails);
router.put("/:exam_id", updateExam);

module.exports = router;