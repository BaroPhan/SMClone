const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PostLike', {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    post_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Post',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'PostLike',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "like_pkey",
        unique: true,
        fields: [
          { name: "user_id" },
          { name: "post_id" },
        ]
      },
    ]
  });
};
