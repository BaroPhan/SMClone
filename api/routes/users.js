const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')
const mongoose = require('mongoose')

//update user
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (error) {
                return res.status(500).json(error)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            });
            res.status(200).json("Account updated")
        } catch (error) {
            return res.status(500).json(error)
        }

    } else return res.status(403).json("You can only update your account")
})
//delete user
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account deleted")
        } catch (error) {
            return res.status(500).json(error)
        }

    } else return res.status(403).json("You can only delete your account")
})
//get user
router.get('/', async (req, res) => {
    const userId = req.query.userId
    const username = req.query.username
    try {
        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ username: username });
        const { password, updatedAt, ...other } = user._doc
        res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
})
//get friends
router.get('/friends/:userId', async (req, res) => {
    const userId = req.params.userId
    try {
        const user = await User.findById(userId)
        const friends = await Promise.all(user.followers.map(friendID => {
            return User.findById(friendID)
        }))
        let friendList = []
        friends.map(friend => {
            const { _id, username, profilePicture } = friend
            friendList.push({ _id, username, profilePicture })
        })
        return res.status(200).json(friendList)
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
})
//follow user
router.put('/:id/follow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        const currentUser = await User.findById(req.body.userId)
        const followUser = await User.findById(req.params.id)
        if (!followUser.followers.includes(req.body.userId)) {
            await followUser.updateOne({ $push: { followers: req.body.userId } })
            await currentUser.updateOne({ $push: { followings: req.params.id } })
            res.status(200).json("User has been followed")
        } else res.status(403).json("You already followed this user")

    } else {
        res.status(403).json("You cant follow yourself")
    }

})
//unfollow user
router.put('/:id/unfollow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        const currentUser = await User.findById(req.body.userId)
        const followUser = await User.findById(req.params.id)
        if (followUser.followers.includes(req.body.userId)) {
            await followUser.updateOne({ $pull: { followers: req.body.userId } })
            await currentUser.updateOne({ $pull: { followings: req.params.id } })
            res.status(200).json("User has been unfollowed")
        } else res.status(403).json("You arent following this user")

    } else {
        res.status(403).json("You cant unfollow yourself")
    }

})

module.exports = router