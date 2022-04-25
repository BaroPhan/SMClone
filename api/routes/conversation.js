const router = require('express').Router()

const { sequelize } = require('../models');
var initModels = require("../models/init-models");
var models = initModels(sequelize);

const { Op } = require("sequelize");

const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('./verifyToken')

//NEW CONVO
router.post("/", async (req, res) => {
    try {
        const conversation = await models.Conversation.findAll({ where: { members: { [Op.contains]: [req.body.sender_id, req.body.receiver_id] } } })
        if (conversation.length === 0) {
            const newConversation = await models.Conversation.create({ members: [req.body.sender_id, req.body.receiver_id] })
            const result = await models.Conversation.findOne({
                where: { id: newConversation.id },
            })
            res.status(200).json(result)
        }
        else { res.status(200).json(conversation) }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
});

//GET USER'S CONVO
router.get("/:id", async (req, res) => {
    try {
        const conversation = await models.Conversation.findAll({
            where: { members: { [Op.overlap]: [req.params.id] } },
            include: [
                {
                    association: "Messages",
                    include: [
                        {
                            association: "sender",
                            attributes: ['username', 'profile_picture'],
                        },
                    ],
                },
            ],
        })
        res.status(200).json(conversation);
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

//GET CONVO INCLUES 2 USERS
router.get("/find/:first_user_id/:second_user_id", async (req, res) => {
    try {
        const conversation = await models.Conversation.findAll({ where: { members: { [Op.contains]: [req.params.first_user_id, req.params.second_user_id] } } })
        res.status(200).json(conversation)
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

module.exports = router;