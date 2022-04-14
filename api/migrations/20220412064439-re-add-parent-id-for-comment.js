'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Comment',
      'parent_id',
      {
        type: Sequelize.UUID,
        allowNull: true,
        unique: false,
        defaultValue: null,
        references: {
          model: 'Comment',
          key: 'id'
        }
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'Comment',
      'parent_id',
    );
  }
};
