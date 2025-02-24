const { Exam, Question, Result, User } = require("../models");

const getAllExamDetails = async (req, res) => {
  try {

    const data = await Exam.findAll({
      attributes: ["exam_id", "exam_name", "course_id"]
    });

    if (!data.length) {
      return res.status(404).json({ message: "No exam details found" });
    }

    res.status(200).json({ data });
  } catch (e) {
    console.error("Error while fetching the exam details:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getExamDetails = async (req, res) => {
  try {
    const { exam_id } = req.params;

    if (!exam_id) {
      return res.status(400).json({ error: "Exam ID not provided" });
    }

    const data = await Exam.findAll({
      where: { exam_id },
      attributes: ["exam_id", "exam_name", "course_id", "duration"],
      include: [
        {
          model: Question,
          attributes: [
            "question_id",
            "question_text",
            "question_type",
            "correct_answer",
            "options",
          ],
        },
      ],
    });

    if (!data.length) {
      return res.status(404).json({ message: "No exam details found" });
    }

    // Transform the response to change Questions to questions and parse options
    const transformedData = data.map(exam => {
      const examJson = exam.toJSON();
      return {
        ...examJson,
        questions: examJson.Questions.map(question => ({
          ...question,
          options: JSON.parse(question.options)
        })),
      };
    });

    res.status(200).json({ data: transformedData });
  } catch (e) {
    console.error("Error while fetching the exam details:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateExam = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const { title, questions, duration} = req.body;

    // Validate Exam
    const exam = await Exam.findByPk(exam_id);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    // Update Exam Info
    await exam.update({ exam_name: title, duration });

    if (questions && Array.isArray(questions)) {
      const existingQuestions = await Question.findAll({
        where: { exam_id },
      });

      // Map existing questions for easy lookup by ID
      const existingQuestionsMap = new Map(
        existingQuestions.map((q) => [q.question_id, q])
      );

      const updatedQuestionIds = [];

      for (const q of questions) {
        if (q.id && existingQuestionsMap.has(q.id)) {
          const existingQuestion = existingQuestionsMap.get(q.id);

          // Check if question content has changed
          const isContentChanged =
            existingQuestion.question_text !== q.question_text ||
            existingQuestion.question_type !== q.question_type ||
            existingQuestion.correct_answer !== q.correct_answer ||
            existingQuestion.options !==
              JSON.stringify(q.options);

          if (isContentChanged) {
            // Delete the old version and create a new one
            await Question.destroy({ where: { question_id: q.id } });
            const newQuestion = await Question.create({
              exam_id,
              question_text: q.question_text,
              question_type: q.question_type,
              options: JSON.stringify(q.options) || null,
              correct_answer: q.correct_answer,
            });
            updatedQuestionIds.push(newQuestion.question_id);
          } else {
            // No change, just keep the existing question
            updatedQuestionIds.push(q.id);
          }
        } else {
          // Create a new question if no valid id is provided
          const newQuestion = await Question.create({
            exam_id,
            question_text: q.question_text,
            question_type: q.question_type,
            options: JSON.stringify(q.options) || null,
            correct_answer: q.correct_answer,
          });
          updatedQuestionIds.push(newQuestion.question_id);
        }
      }

      // Identify and delete questions that were not updated
      const questionsToDelete = existingQuestions
        .filter((q) => !updatedQuestionIds.includes(q.question_id))
        .map((q) => q.question_id);

      if (questionsToDelete.length > 0) {
        await Question.destroy({
          where: { question_id: questionsToDelete },
        });
      }
    }

    res.status(200).json({ message: "Exam updated successfully" });
  } catch (error) {
    console.error("Error updating exam:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllResults = async (req, res) => {
  try{
    const results = await Result.findAll({
      include:[
        {model: User, attributes: ['username', 'army_number','userrank', 'role', 'course_enrolled', 'coy']
        },
        {
          model: Exam, attributes: ['exam_name']
        }
      ]
    })

    if(results.length === 0){
      return res.status(404).json({message: 'No results found'});
    }

    res.status(200).json(results);
  } catch(e){
    console.error('Error fetching user results:', e);
    res.status(500).json({error: 'Internal Server Error'});
  }
}

const getAllStudents = async (req, res) => {
  try{
    const students = await User.findAll({
      where: {role: 'Student'},
      attributes: ['username', 'army_number','userrank', 'role', 'course_enrolled', 'coy', 'remarks']
    })

    if(students.length === 0){
      return res.status(404).json({message: 'No students found'});
    }

    res.status(200).json(students);
  } catch(e){
    console.error('Error fetching students:', e);
    res.status(500).json({error: 'Internal Server Error'});
  }
}

const addUser = async (req, res) => {
  try{
    const {username, password, army_number, userrank, role, course_enrolled, coy} = req.body;

    if(!username || !password || !army_number || !userrank || !role || !course_enrolled || !coy){
      return res.status(400).json({error: 'All fields are required'});
    }

    // check if same army number already exists for any user
    const existing = await User.findOne({where: {army_number}});
    if(existing){
      return res.status(400).json({error: 'User already exists with this army number'});
    }

    const user = await User.create({username, password, army_number, userrank, role, course_enrolled, coy});

    res.status(201).json({message: 'User added successfully', user});
  } catch(e){
    console.error('Error adding user:', e);
    res.status(500).json({error: 'Internal Server Error'});
  }
}

module.exports = { getAllExamDetails, getExamDetails, updateExam, getAllResults, addUser, getAllStudents };
const getResultsByCrsId = async(req, res) => {
  const crsId = req.params.crsId;
  try{
    const results = await Result.findAll({
      where: { course_id: crsId },
      include:[
        {model: User, attributes: ['username', 'army_number','userrank', 'role', 'course_enrolled']
        },
        {
          model: Exam, attributes: ['exam_name']
        }
      ]
    })

    if(results.length === 0){
      return res.status(404).json({message: 'No results found'});
    }

    res.status(200).json(results);
  } catch(e){
    console.error('Error fetching user results:', e);
    res.status(500).json({error: 'Internal Server Error'});
  }
}


module.exports = { getAllExamDetails, getExamDetails, updateExam, getAllResults, getResultsByCrsId };
