module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    army_number: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    rank: {
      type: DataTypes.STRING(50),
    },
    course_enrolled: {
      type: DataTypes.STRING(100),
    },
    role: {
      type: DataTypes.ENUM("Admin", "Student"),
      allowNull: false,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Exam, { foreignKey: "uploaded_by" });
  };

  User.associate = (models) => {
    User.hasMany(models.Result, { foreignKey: "user_id" });
  };

  return User;
};
