const express = require("express");
const {submitExam} = require("../controllers/resultController");
const router = express();

router.post('/submit_exam', submitExam);

module.exports = router;