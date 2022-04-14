const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CommentLike', {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    comment_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Comment',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'CommentLike',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "comment_like_pkey",
        unique: true,
        fields: [
          { name: "user_id" },
          { name: "comment_id" },
        ]
      },
    ]
  });
};
