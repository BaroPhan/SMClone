var DataTypes = require("sequelize").DataTypes;
var _Comment = require("./Comment");
var _CommentLike = require("./CommentLike");
var _Follow = require("./Follow");
var _Post = require("./Post");
var _PostLike = require("./PostLike");
var _SequelizeMeta = require("./SequelizeMeta");
var _User = require("./User");

function initModels(sequelize) {
  var Comment = _Comment(sequelize, DataTypes);
  var CommentLike = _CommentLike(sequelize, DataTypes);
  var Follow = _Follow(sequelize, DataTypes);
  var Post = _Post(sequelize, DataTypes);
  var PostLike = _PostLike(sequelize, DataTypes);
  var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);

  Comment.belongsToMany(User, { as: 'user_id_Users', through: CommentLike, foreignKey: "comment_id", otherKey: "user_id" });
  Post.belongsToMany(User, { as: 'user_id_User_PostLikes', through: PostLike, foreignKey: "post_id", otherKey: "user_id" });
  User.belongsToMany(Comment, { as: 'comment_id_Comments', through: CommentLike, foreignKey: "user_id", otherKey: "comment_id" });
  User.belongsToMany(Post, { as: 'post_id_Posts', through: PostLike, foreignKey: "user_id", otherKey: "post_id" });
  User.belongsToMany(User, { as: 'user_id_User_Follows', through: Follow, foreignKey: "follow_user_id", otherKey: "user_id" });
  User.belongsToMany(User, { as: 'follow_user_id_Users', through: Follow, foreignKey: "user_id", otherKey: "follow_user_id" });
  Comment.belongsTo(Comment, { as: "parent", foreignKey: "parent_id"});
  Comment.hasMany(Comment, { as: "Comments", foreignKey: "parent_id"});
  CommentLike.belongsTo(Comment, { as: "comment", foreignKey: "comment_id"});
  Comment.hasMany(CommentLike, { as: "CommentLikes", foreignKey: "comment_id"});
  Comment.belongsTo(Post, { as: "post", foreignKey: "post_id"});
  Post.hasMany(Comment, { as: "Comments", foreignKey: "post_id"});
  PostLike.belongsTo(Post, { as: "post", foreignKey: "post_id"});
  Post.hasMany(PostLike, { as: "PostLikes", foreignKey: "post_id"});
  Comment.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(Comment, { as: "Comments", foreignKey: "user_id"});
  CommentLike.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(CommentLike, { as: "CommentLikes", foreignKey: "user_id"});
  Follow.belongsTo(User, { as: "follow_user", foreignKey: "follow_user_id"});
  User.hasMany(Follow, { as: "Follows", foreignKey: "follow_user_id"});
  Follow.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(Follow, { as: "user_Follows", foreignKey: "user_id"});
  Post.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(Post, { as: "Posts", foreignKey: "user_id"});
  PostLike.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(PostLike, { as: "PostLikes", foreignKey: "user_id"});

  return {
    Comment,
    CommentLike,
    Follow,
    Post,
    PostLike,
    SequelizeMeta,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
