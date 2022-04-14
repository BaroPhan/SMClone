'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Comment", "Comment_post_id_fkey")
    await queryInterface.changeColumn("Comment", "post_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Post',
        key: 'id'
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
