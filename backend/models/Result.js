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
        type: DataTypes.FLOAT, 
        allowNull: false,
      },
      grade: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    Result.associate = (models) => {
      Result.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      Result.belongsTo(models.Exam, { foreignKey: 'exam_id', onDelete: 'CASCADE' });
    };
  
    return Result;
  };