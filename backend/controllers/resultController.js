const { Question, Result, Exam } = require("../models");

const calculateGrade = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 75) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
  };

const submitExam = async (req, res) => {
  try {
    const { user_id, exam_id, answers } = req.body;

    if (!user_id || !exam_id || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // 1. Fetch Exam Questions
    const questions = await Question.findAll({
      where: { exam_id },
      attributes: ["question_id", "correct_answer"],
      raw: true,
    });

    console.log(questions)

    if (!questions.length) {
      return res
        .status(404)
        .json({ error: "No questions found for this exam" });
    }

    let score = 0;
    questions.forEach((question) => {
      const userAnswer = answers.find((a) => a.question_id === question.question_id);
      if (userAnswer && userAnswer.answer === question.correct_answer) {
        score++;
      }
    });

    const totalQuestions = questions.length;
    const percentage = ((score / totalQuestions) * 100).toFixed(2);
    const grade = calculateGrade(percentage);

    await Result.create({
      user_id,
      exam_id,
      score,
      total_questions: totalQuestions,
      percentage,
      grade,
      submitted_at: new Date(),
    });

    return res.status(201).json({
        message: 'Exam submitted successfully',
        score,
      });

  } catch (e) {
    console.error("Error submitting exam:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getResults = async (req, res) => {
    const data = req.params;
    console.log("userid",data)
    const userId = Number(data.userId)
    try {
      const results = await Result.findAll({
        where: { user_id: userId },
        include: [
          { model: Exam, attributes: ['exam_id', 'exam_name'] },
        ],
      });
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'No results found for this user' });
      }
  
      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching user results:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports = { submitExam, getResults };
