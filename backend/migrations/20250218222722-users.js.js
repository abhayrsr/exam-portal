"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.addColumn("Users", "role", {
    //   type: Sequelize.ENUM("Admin", "Student"),
    //   allowNull: false,
    //   defaultValue: "Student",
    //   validate: {
    //     isIn: [["Admin", "Student"]], 
    //   },
    // });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
