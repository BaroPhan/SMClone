const router = require('express').Router()
const bcrypt = require('bcrypt')
// const User = require('../models/User1')
// const mongoose = require('mongoose')

const { sequelize } = require('../models');
var initModels = require("../models/init-models");
var models = initModels(sequelize);

const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('./verifyToken')

//update user
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        try {
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt)
        } catch (error) {
            return res.status(500).json(error)
        }
    }
    try {
        const updatedUser = await models.User.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        const result = await models.User.findOne({ where: { id: req.params.id } })
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }

})
//delete user
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        await models.User.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json("Account deleted")
    } catch (error) {
        return res.status(500).json(error)
    }
})
//GET USER
router.get('/', async (req, res) => {
    const { userId, username } = req.query
    try {
        const user = userId
            ? await models.User.findOne({
                where: { id: userId },
                include: 'Posts',
            })
            : await models.User.findOne({
                where: { username },
                include: 'Posts',
            })
        const { password, updatedAt, ...other } = user.dataValues
        res.status(200).json(other)
    } catch (err) {
        console.log("get user error: " + err);
        return res.status(500).json(err)
    }
})
//GET USERS
router.get('/all', async (req, res) => {
    try {
        const users = await models.User.findAll({
            include: [
                {
                    association: "follow_user_id_Users",
                    attributes: ['username', 'profile_picture'],
                },
                {
                    association: "user_id_User_Follows",
                    attributes: ['username', 'profile_picture'],
                },
            ],
        })
        res.status(200).json(users)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})
//GET FRIENDS/FOLLOWERS
router.get('/friends/:userId', async (req, res) => {
    try {
        const followers_id = await models.Follow.findAll({
            where: { follow_user_id: req.params.userId },
            attributes: ['user_id']
        })
        const friends = await Promise.all(followers_id.map(id => {
            return models.User.findOne({
                where: { id: id.user_id },
                attributes: ['id', 'username', 'profile_picture']
            })
        }))
        if (req.body.user_id) {
            followed = false
            followers_id.map(id => {
                if (id.user_id === req.body.user_id)
                    followed = true
            })
            res.status(200).json(followed)
        }
        res.status(200).json(friends)
    } catch (err) {
        console.log("get friends error: " + err);
        return res.status(500).json(err)
    }
})
//FOLLOW USER
router.post('/:id/follow', verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.id !== req.params.id) {
        try {
            const is_followed = await models.Follow.findOne({
                where:
                {
                    user_id: req.body.id,
                    follow_user_id: req.params.id
                }
            })
            if (is_followed) {
                await is_followed.destroy({ truncate: true })
                console.log("Unfollowed")
            } else {
                const new_follow = await models.Follow.create({
                    user_id: req.body.id,
                    follow_user_id: req.params.id
                })
                console.log("Followed")
            }
            const user = await models.User.findOne({
                where: { id: req.params.id },
                include: [
                    {
                        association: "follow_user_id_Users",
                        attributes: ['username', 'profile_picture'],
                    },
                    {
                        association: "user_id_User_Follows",
                        attributes: ['username', 'profile_picture'],
                    },
                ],
            })
            res.status(200).json(user)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }

    } else {
        res.status(403).json("You cant follow yourself")
    }
})

module.exports = router