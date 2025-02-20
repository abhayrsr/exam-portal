const express = require("express");
const {getExamDetails, updateExam} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();


router.get("/", authMiddleware(['Admin']),getExamDetails);
router.put("/:exam_id", authMiddleware(['Admin']),updateExam);

module.exports = router;