const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "User_username_key"
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "User_email_key"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    profile_picture: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    desc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    from: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    relationship: {
      type: DataTypes.ENUM("Single","In a relationship","Complicated"),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'User',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "User_email_key",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "User_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "User_username_key",
        unique: true,
        fields: [
          { name: "username" },
        ]
      },
    ]
  });
};
