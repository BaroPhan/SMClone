const router = require('express').Router()
// const Post = require('../models/Post')
// const User = require('../models/User1')

const { sequelize } = require('../models');
var initModels = require("../models/init-models");
var models = initModels(sequelize);

const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('./verifyToken')


//create post
router.post('/', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const newPost = await models.Post.create(req.body)
        res.status(200).json(newPost)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})
//update post
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        await models.Post.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        const updatedPost = await models.Post.findOne({
            where: { id: req.params.id },
            include: [
                {
                    association: "user",
                    attributes: ['username', 'profile_picture']
                },
                {
                    association: "PostLikes",
                    attributes: ['user_id']
                },
                {
                    association: "Comments",
                    include: [
                        {
                            association: "user",
                            attributes: ['username', 'profile_picture'],
                        },
                        {
                            association: "CommentLikes",
                            attributes: ['user_id'],
                        },
                    ],
                },
            ],
        })
        res.status(200).json(updatedPost)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }

})
//delete post
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const post = await models.Post.findOne({ where: { id: req.params.id } })
        await post.destroy()
        res.status(200).json("Post has been deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})

//like a post
router.put('/:id/like', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const is_liked = await models.PostLike.findOne({
            where:
            {
                user_id: req.body.user_id,
                post_id: req.params.id
            }
        })
        if (is_liked) {
            await is_liked.destroy({ truncate: true })
            res.status(200).json("You have unliked the post")
        } else {
            const new_like = await models.PostLike.create({
                user_id: req.body.user_id,
                post_id: req.params.id
            })
            res.status(200).json("You have liked the post")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})
//get a post
router.get('/:id', async (req, res) => {
    try {
        const post = await models.Post.findOne({ where: { id: req.params.id } })
        post ? res.status(200).json(post) : res.status(404).json("No post found")
    } catch (error) {
        res.status(500).json(error)
    }
})
//get timeline posts 
router.get('/timeline/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const friends = await models.Follow.findAll({
            where: { user_id: req.params.id },
            attributes: ['follow_user_id']
        })
        feed = [req.params.id]
        friends.map(friend => {
            feed.push(friend.follow_user_id)
        })
        const timeline = await models.Post.findAll({
            where: { user_id: feed },
            include: [
                {
                    association: "user",
                    attributes: ['username', 'profile_picture']
                },
                {
                    association: "PostLikes",
                    attributes: ['user_id']
                },
                {
                    association: "Comments",
                    include: [
                        {
                            association: "user",
                            attributes: ['username', 'profile_picture'],
                        },
                        {
                            association: "CommentLikes",
                            attributes: ['user_id'],
                        },
                    ],
                },
            ],
        })
        res.status(200).json(timeline)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})
//get all user's posts
router.get('/profile/:username', async (req, res) => {
    try {
        const currentUser = await models.User.findOne({
            where: { username: req.params.username },
            include: [
                {
                    association: "Posts",
                    include: [
                        {
                            association: "Comments",
                            include: [
                                {
                                    association: "user",
                                    attributes: ['username', 'profile_picture'],
                                },
                            ],
                        },
                    ],
                },
            ],
        })
        res.status(200).json(currentUser.Posts)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})


module.exports = router