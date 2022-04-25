const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Conversation', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    members: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: false,
      unique: "Conversation_members_key"
    }
  }, {
    sequelize,
    tableName: 'Conversation',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Conversation_members_key",
        unique: true,
        fields: [
          { name: "members" },
        ]
      },
      {
        name: "Conversation_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
