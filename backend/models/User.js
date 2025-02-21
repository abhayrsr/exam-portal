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
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    userrank: {
      type: DataTypes.STRING(50),
    },
    course_enrolled: {
      type: DataTypes.STRING(100),
    },
    role: {
      type: DataTypes.ENUM("Admin", "Student"),
      allowNull: false,
      defaultValue: "Student",
    },
    password: {
      type: DataTypes.STRING(255),
    }
  },
  {
    timestamps: false // Disable createdAt and updatedAt
  });

  User.associate = (models) => {
    User.hasMany(models.Exam, { foreignKey: "uploaded_by" });
  };

  User.associate = (models) => {
    User.hasMany(models.Result, { foreignKey: "user_id", onDelete: "CASCADE" });
  };

  return User;
};
