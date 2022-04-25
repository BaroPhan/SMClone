const router = require('express').Router()

const { sequelize } = require('../models');
var initModels = require("../models/init-models");
var models = initModels(sequelize);

const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('./verifyToken')

//NEW MESSAGE
router.post("/", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const newMessage = await models.Messages.create(req.body)
        const result = await models.Messages.findOne({
            where: { id: newMessage.id },
            include: [
                {
                    association: "sender",
                    attributes: ['username', 'profile_picture'],
                },
            ],
        })
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET MESSAGES FROM CONVO
router.get("/:id", async (req, res) => {
    try {
        const messages = await models.Messages.findAll({
            where: { conversation_id: req.params.id }
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;