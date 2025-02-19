'use strict';

// const { resolve } = await import('node:path');
// const { readFile } = await import('node:fs/promises');

// import { readFile } from 'node:fs/promises';
// import { resolve} from 'node:path';

// const readQuestions = async () => {
//   try {
//     const filePath = resolve("../data/questions.json");
//     console.log('x')
//     const content = await (readFile(filePath, { encoding: 'utf8' }));
    
//     return content;
//   } catch (e) {
//     console.error(e.message);
//   }
// };

//dummy data
const questions = [
  {
    "question_id": 1,
    "exam_id": 1,
    "question_text": "What is the capital of France?",
    "question_type": "MCQ",
    "options": ["London", "Berlin", "Paris", "Madrid"],
    "correct_answer": "Paris",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "question_id": 2,
    "exam_id": 1,
    "question_text": "The Earth revolves around the Sun.",
    "question_type": "True/False",
    "options": null,
    "correct_answer": "True",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "question_id": 3,
    "exam_id": 1,
    "question_text": "The largest planet in our solar system is _______.",
    "question_type": "Fill in the Blank",
    "options": null,
    "correct_answer": "Jupiter",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "question_id": 4,
    "exam_id": 2,
    "question_text": "Which programming language is known for its use in web development?",
    "question_type": "MCQ",
    "options": ["JavaScript", "COBOL", "FORTRAN", "Assembly"],
    "correct_answer": "JavaScript",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  
]


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert(
        'Questions',
        questions.map((item) => ({
          ...item,
          options: item.options ? JSON.stringify(item.options) : null,
        })),
        {}
      );
    } catch (error) {
      console.error('Error seeding Questions:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete('Questions', null, {});
    } catch (error) {
      console.error('Error deleting Questions:', error);
    }
  },
};
