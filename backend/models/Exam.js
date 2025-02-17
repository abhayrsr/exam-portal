module.exports = (sequelize, DataTypes) => {
    const Exam = sequelize.define('Exam', {
      exam_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      exam_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      course_id: {
        type: DataTypes.INTEGER,
      },
      uploaded_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // References the User model
          key: 'user_id',
        },
      },
      upload_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });

    Exam.associate = (models) => {
        Exam.hasMany(models.Question, { foreignKey: 'exam_id' });
    };

    Exam.associate = (models) => {
        Exam.hasMany(models.Result, { foreignKey: 'exam_id' });
    };
  
    return Exam;
  };