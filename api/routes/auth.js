const router = require('express').Router()
// const User = require('../models/User1')
const bcrypt = require('bcrypt')

const { sequelize } = require('../models');
var initModels = require("../models/init-models");
var models = initModels(sequelize);

const jwt = require('jsonwebtoken')


//REGISTER
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body
    try {
        //gen new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = await models.User.create({ username, email, password: hashedPassword })
        return res.status(200).json(newUser)
    } catch (err) {
        return res.status(500).json(err)
    }
})

//LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await models.User.findOne({
            where: { email: req.body.email },
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
        !user && res.status(404).json("user not found")

        const decryptedPWRD = await bcrypt.compare(req.body.password, user.password)
        !decryptedPWRD && res.status(400).json("password not correct")

        const accessToken = jwt.sign({
            id: user.id,
            isAdmin: user.is_admin
        }, process.env.JWT_SEC_KEY, { expiresIn: "1d" })

        const { password, ...others } = user.dataValues
        res.status(200).json({ ...others, accessToken })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})


module.exports = router