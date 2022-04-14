'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CommentLike', {
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      comment_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Comment',
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

    await queryInterface.addConstraint('CommentLike', {
      type: 'primary key',
      name: 'comment_like_pkey',
      fields: ['user_id', 'comment_id']
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CommentLike');
  }
};
