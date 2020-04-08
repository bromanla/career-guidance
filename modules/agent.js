const express = require('express');
const router = express.Router();

const {tokensMongo} = require('./mongo/schemas');

// Get authorized devices
router.get('/', async (req, res) => {
    const {userID} = req.user;
    const agent = await tokensMongo.find({userID}, {agent: true});

    res.json(agent);
})

module.exports = router;
