'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Post', 'likes');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Post',
      'likes',
      {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue: []
      }
    );
  }
};
