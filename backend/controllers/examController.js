const { Exam, Question, User } = require("../models");
const { Op } = require("sequelize");

const getAvailableExams = async (req, res) => {
  try {
    const { user_id } = req.user;

    // Fetch user's course_enrolled
    const user = await User.findOne({
      where: { user_id },
      attributes: ["course_enrolled"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const { course_enrolled } = user;
    console.log("Course enrolled:", course_enrolled);

    if (!course_enrolled || course_enrolled.length === 0) {
      return res.status(400).json({ error: "User course not provided." });
    }

    // Ensure course_enrolled works with both array and single value
    const courseFilter = Array.isArray(course_enrolled)
      ? { [Op.in]: course_enrolled }
      : course_enrolled;

    // Fetch exams matching the user's courses
    const exams = await Exam.findAll({
      where: { course_id: courseFilter },
      attributes: ["exam_id", "exam_name", "upload_date"],
    });

    if (exams.length === 0) {
      return res
        .status(404)
        .json({ message: "No exams found for your course." });
    }

    res.status(200).json({ exams });
  } catch (e) {
    console.error("Error fetching exams:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getExamQuestions = async (req, res) => {
  try {
    const data = req.params;

    const exam_id = Number(data.exam_id);

    if (!exam_id) {
      return res.status(400).json({ error: "Exam ID is required" });
    }

    const questions = await Question.findAll({
      where: { exam_id },
      attributes: ["question_id", "question_text", "question_type", "options"],
      include: [
        {
          model: Exam,
          attributes: ["course_id", "exam_name", "duration"],
        },
      ],
    });

    const cleanQuestions = questions.map((q) => {
        const question = q.get({ plain: true });
        return {
          ...question,
          course_id: question.Exam.course_id,
          exam_name: question.Exam.exam_name,
          duration: question.Exam.duration,
        };
      });
  

    if (questions.length === 0) {
      return res.status(404).json({ message: "No question found" });
    }

    const shuffleQuestions = async (questions) => {
      const copyQuestions = [...questions];

      for (let i = copyQuestions.length - 1; i > 0; i--) {
        const index = Math.floor(Math.random() * (i + 1));
        [copyQuestions[i], copyQuestions[index]] = [
          copyQuestions[index],
          copyQuestions[i],
        ];
      }
      return copyQuestions;
    };

    const shuffledQuestions = await shuffleQuestions(cleanQuestions);

    res.status(200).json({ exam_id,
        course_id: cleanQuestions[0].course_id,
        exam_name: cleanQuestions[0].exam_name,
        duration: cleanQuestions[0].duration,
        questions: shuffledQuestions, });
  } catch (e) {
    console.error("Error fetching exam questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const uploadExam =  async (req, res) => {
    const { exam_name, course_id, questions, duration } = req.body;
  
    // Validate the request body
    if (!exam_name || !course_id || !questions || !duration || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Invalid request body. Exam name, course ID, Duration and questions are required.' });
    }
  
    try {
      // Create the exam in the Exams table
      const exam = await Exam.create({
        exam_name,
        course_id,
        duration,
        uploaded_by: req.user.user_id, // Set the admin's user_id as the uploader
      });
  
      // Create questions in the Questions table
      const createdQuestions = await Question.bulkCreate(
        questions.map((question) => ({
          exam_id: exam.exam_id, // Link the question to the exam
          question_text: question.question_text,
          question_type: question.question_type,
          options: question.options || null, // Options are only required for MCQ
          correct_answer: question.correct_answer,
        }))
      );
  
      // Return the created exam and questions
      res.status(201).json({
        message: 'Exam uploaded successfully.',
        exam,
        questions: createdQuestions,
      });
    } catch (err) {
      console.error('Error uploading exam:', err);
      res.status(500).json({ error: 'An error occurred while uploading the exam.' });
    }
  }

module.exports = { getAvailableExams, getExamQuestions, uploadExam };
