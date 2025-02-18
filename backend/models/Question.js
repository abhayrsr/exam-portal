module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
      question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Exams', // References the Exam model
          key: 'exam_id',
        },
      },
      question_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      question_type: {
        type: DataTypes.ENUM('MCQ', 'True/False', 'Fill in the Blank'),
        allowNull: false,
      },
      options: {
        type: DataTypes.JSON // For MCQ options
      },
      correct_answer: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
    });
  
    return Question;
  };