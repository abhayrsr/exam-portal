module.exports = (sequelize, DataTypes) => {
    const Result = sequelize.define('Result', {
      result_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // References the User model
          key: 'user_id',
        },
      },
      exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Exams', // References the Exam model
          key: 'exam_id',
        },
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      percentage: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        get(){
          return (this.score/100) * 100;
        }
      },
      grade: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        get(){
          const percentage = (this.score/100) * 100;
          if(percentage >= 90) return 'A+';
          if(percentage >= 80) return 'A';
          if(percentage >= 70) return 'B';
          if(percentage >= 60) return 'C';
          return 'F';
        }
      },
    });
  
    return Result;
  };