'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Ensure exam_id has correct foreign key
    await queryInterface.addConstraint('Results', {
      fields: ['exam_id'],
      type: 'foreign key',
      name: 'fk_exam_id',
      references: {
        table: 'Exams',
        field: 'exam_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Ensure user_id has correct foreign key
    await queryInterface.addConstraint('Results', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_user_id',
      references: {
        table: 'Users',
        field: 'user_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
