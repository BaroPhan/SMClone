'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Messages',
      'createdAt',
      {
        allowNull: false,
        type: Sequelize.DATE,
      }
    );
    await queryInterface.addColumn(
      'Messages',
      'updatedAt',
      {
        allowNull: false,
        type: Sequelize.DATE
      }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
