const router = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')

//create post
router.post('/', async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        res.status(500).json(error)
    }
})
//update post
router.put('/:id', async (req, res) => {
    try {
        const currentPost = await Post.findById(req.params.id)
        if (currentPost.userId === req.body.userId) {
            try {
                await currentPost.updateOne({ $set: req.body })

                res.status(200).json("You have updated your post")
            } catch (error) {
                res.status(500).json(error)
            }
        } else res.status(403).json("You can only edit your post")
    } catch (error) {
        res.status(500).json(error)
    }

})
//delete post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            try {
                await post.delete()
                res.status(200).json("Post has been deleted")
            } catch (error) {
                res.status(500).json(error)
            }

        } else res.status(403).json("You can only delete your post")
    } catch (error) {
        res.status(500).json(error)
    }
})

//like a post
router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json("You have liked the post")
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).json("You have unliked the post")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})
//get a post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        post ? res.status(200).json(post) : res.status(404).json("No post found")
    } catch (error) {
        res.status(500).json(error)
    }
})
//get timeline posts 
router.get('/timeline/:userId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        const userPosts = await Post.find({ userId: currentUser._id })
        const friendPosts = await Promise.all(
            currentUser.followings.map(friendId => {
                return Post.find({ userId: friendId })
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts))
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})
//get all user's posts
router.get('/profile/:username', async (req, res) => {
    try {
        const currentUser = await User.findOne({username: req.params.username})
        const userPosts = await Post.find({ userId: currentUser._id })
        res.status(200).json(userPosts)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})


module.exports = router