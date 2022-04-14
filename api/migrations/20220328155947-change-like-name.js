'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;

    await queryInterface.renameTable('Like', 'PostLike')

  },

  async down(queryInterface, Sequelize) {

  }
};
