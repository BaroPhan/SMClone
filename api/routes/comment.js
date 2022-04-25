const router = require('express').Router()

const { sequelize } = require('../models');
var initModels = require("../models/init-models");
var models = initModels(sequelize);

const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('./verifyToken')

//create comment
router.post('/', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const newComment = await models.Comment.create(req.body)
        const result = await models.Comment.findOne({
            where: { id: newComment.id },
            include: [
                {
                    association: "user",
                    attributes: ['username', 'profile_picture'],
                },
            ]
        })
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})
//update comment
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedComment = await models.Comment.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json("You have updated your comment")
    } catch (error) {
        res.status(500).json(error)
    }

})
//delete comment
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const comment = await models.Comment.findOne({ where: { id: req.params.id } })
        await comment.destroy()
        res.status(200).json("Comment has been deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})
//get all post's comments
router.get('/post/:id', async (req, res) => {
    try {
        const currentPost = await models.Post.findOne({
            where: { id: req.params.id },
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
        })
        currentPost.Comments.map(item => {
            console.log(item.user.username)
        })
        res.status(200).json(currentPost.Comments)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})
//get all comments
router.get('/', async (req, res) => {
    try {
        const comment = await models.Comment.findAll({
            include: [
                {
                    association: "user",
                    attributes: ['username', 'profile_picture'],
                },
                {
                    association: "CommentLikes",
                    attributes: ['user_id'],
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
                    ]
                },
            ],
        })
        res.status(200).json(comment)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})
//get comment
router.get('/comment/:id', async (req, res) => {
    try {
        const comment = await models.Comment.findOne({
            where: { id: req.params.id },
            include: [
                {
                    association: "user",
                    attributes: ['username', 'profile_picture'],
                },
                {
                    association: "CommentLikes",
                    attributes: ['user_id'],
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
                    ]
                },
            ],
        })
        res.status(200).json(comment)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})
//get replies
router.post('/replies/', async (req, res) => {
    try {
        const comments = await Promise.all(req.body.map(item => {
            return models.Comment.findOne({
                where: { id: item.id },
                include: [
                    {
                        association: "user",
                        attributes: ['username', 'profile_picture'],
                    },
                    {
                        association: "CommentLikes",
                        attributes: ['user_id'],
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
                        ]
                    },
                ],
            })
        }))
        res.status(200).json(comments)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})

//like a comment
router.put('/:id/like', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const is_liked = await models.CommentLike.findOne({
            where:
            {
                user_id: req.body.user_id,
                comment_id: req.params.id
            }
        })
        if (is_liked) {
            await is_liked.destroy({ truncate: true })
            res.status(200).json("You have unliked the comment")
        } else {
            const new_like = await models.CommentLike.create({
                user_id: req.body.user_id,
                comment_id: req.params.id
            })
            res.status(200).json("You have liked the comment")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router