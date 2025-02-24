const express = require("express");
const {getExamDetails, updateExam, getAllExamDetails, getAllResults, addUser, getAllStudents} = require("../controllers/adminController");
const {getExamDetails, updateExam, getAllExamDetails, getAllResults, getResultsByCrsId} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/students", authMiddleware(['Admin']), getAllStudents);
router.get("/results", authMiddleware(["Admin"]), getAllResults);
router.get("/:crsId", authMiddleware(['Admin']),getResultsByCrsId);
router.get("/", authMiddleware(['Admin']),getAllExamDetails);
router.get("/:exam_id", authMiddleware(['Admin']),getExamDetails);
router.put("/:exam_id", authMiddleware(['Admin']),updateExam);
router.post("/user/add", authMiddleware(['Admin']),addUser);


module.exports = router;    