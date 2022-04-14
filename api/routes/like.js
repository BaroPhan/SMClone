const router = require('express').Router()

const { sequelize } = require('../models');
var initModels = require("../models/init-models");
var models = initModels(sequelize);

const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('./verifyToken')

//like a post
router.post('/post/:id', verifyTokenAndAuthorization, async (req, res) => {
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
            console.log("You have unliked the post")
        } else {
            const new_like = await models.PostLike.create({
                user_id: req.body.user_id,
                post_id: req.params.id
            })
            console.log("You have liked the post")
        }
        const post_likes = await models.PostLike.findAll({ 
            where: { post_id: req.params.id },
            attributes: ['user_id']
        })
        res.status(200).json(post_likes)
    } catch (error) {
        res.status(500).json(error)
    }
})
//like a comment
router.post('/comment/:id', verifyTokenAndAuthorization, async (req, res) => {
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
            console.log("You have unliked the comment")
        } else {
            const new_like = await models.CommentLike.create({
                user_id: req.body.user_id,
                comment_id: req.params.id
            })
            console.log("You have liked the comment")
        }
        const comment_likes = await models.CommentLike.findAll({ 
            where: { comment_id: req.params.id },
            attributes: ['user_id']
        })
        res.status(200).json(comment_likes)
    } catch (error) {
        res.status(500).json(error)
    }
})
//get a post like count
router.get('/:id', async (req, res) => {
    try {
        const count = await models.PostLike.findAndCountAll({ where: { post_id: req.params.id } })
        count ? res.status(200).json(count) : res.status(404).json("No post found")
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

module.exports = router