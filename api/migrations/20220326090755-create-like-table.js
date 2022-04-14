'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Like', {
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      post_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Post',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('Like', {
      type: 'primary key',
      name: 'like_pkey',
      fields: ['user_id', 'post_id']
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Like');
  }
};
