'use strict';
const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize, DataTypes) {
    await queryInterface.createTable('Conversation', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      members: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: false,
        unique: true
      }
    });
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      conversation_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Conversation',
          key: 'id'
        }
      },
      sender_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      message: {
        type: Sequelize.STRING
      }
    });
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
