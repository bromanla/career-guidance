const
    { tokensMongo } = require('../mongo'),
    router = require('express').Router();

// Get authorized devices
router.get('/', async (req, res) => {
    const { userID } = req.user;
    const agent = await tokensMongo.find({userID}, {agent: true});

    res.json(agent);
})

module.exports = {path: '/agent', router};