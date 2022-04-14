'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'Like',
      'user_id',
      {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
      }
    )
    await queryInterface.changeColumn(
      'Like',
      'post_id',
      {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Post',
          key: 'id'
        }
      }
    )
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
