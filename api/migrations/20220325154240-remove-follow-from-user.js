'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('User', 'followers');
    await queryInterface.removeColumn('User', 'followings');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('User',
      'followers',
      {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue: []
      }
    );
    await queryInterface.addColumn('User',
      'followings',
      {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue: []
      }
    );
  }
};
