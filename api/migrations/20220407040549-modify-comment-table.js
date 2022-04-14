'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.removeColumn(
      'Comment',
      'comment_id'
    );
    await queryInterface.addColumn(
      'Comment',
      'children',
      {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: true,
        defaultValue: []
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
