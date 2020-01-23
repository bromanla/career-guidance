const express = require('express');
const router = express.Router();

const mongoose = require('./mongo/connection');
const { tokensMongo } = require('./mongo/schemas');

const jwtMiddleware = require('express-jwt');

router.use(jwtMiddleware({secret: process.env.secret}));

// Error handler for jwt
router.use((err, req, res, next) => {
    if (err)
        return res.status(err.status).send(err.message);

    next();
});

// Get authorized devices
router.get('/', async (req, res) => {
    const userID = req.user.userID;

    // Find agent
    const agent = await tokensMongo.find({userID}, {agent: true});

    res.json(agent);
})

module.exports = router;
