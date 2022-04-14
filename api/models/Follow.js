const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Follow', {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    follow_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'Follow',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "follow_pkey",
        unique: true,
        fields: [
          { name: "user_id" },
          { name: "follow_user_id" },
        ]
      },
    ]
  });
};
