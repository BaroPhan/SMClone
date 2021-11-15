const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')


//REGISTER
router.post('/register', async (req, res) => {
    try {
        //gen new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //create user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })
    
        await newUser.save()
        res.status(200).json(newUser)
    } catch (error) {
        res.status(500).json(error)
    }
})

//LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        !user && res.status(404).json("user not found")

        const password = await bcrypt.compare(req.body.password, user.password)
        !password && res.status(400).json("password not correct")
        
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router