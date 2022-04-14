'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Follow', ['user_id', 'follow_user_id'], {
      type: 'primary key',
      name: 'follow_pkey'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Follow', 'id');
    await queryInterface.removeConstraint('Follow', 'PRIMARY');
  }
};
