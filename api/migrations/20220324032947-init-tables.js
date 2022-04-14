'use strict';

const { DataTypes } = require("sequelize/types");

module.exports = {
  async up(queryInterface, Sequelize, DataTypes) {
    await queryInterface.createTable('User', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        min: 3,
        max: 20
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        min: 6
      },
      profile_picture: {
        type: Sequelize.STRING,
        defaultValue: ""
      },
      followers: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue: []
      },
      followings: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue: []
      },
      is_admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      desc: {
        type: Sequelize.STRING,
        max: 50
      },
      from: {
        type: Sequelize.STRING,
        max: 50
      },
      relationship: {
        type: Sequelize.ENUM('Single', 'In a relationship', 'Complicated')
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

    await queryInterface.createTable('Post', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      img: {
        type: Sequelize.STRING,
      },
      likes: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue: []
      },
      desc: {
        type: Sequelize.STRING,
        max: 500
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

    await queryInterface.createTable('Comment', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
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
      comment_id: {
        type: Sequelize.UUID,
        defaultValue: null,
      },
      img: {
        type: Sequelize.STRING,
      },
      likes: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue: []
      },
      desc: {
        type: Sequelize.STRING,
        max: 500
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

    
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropAllTables()
  }
};