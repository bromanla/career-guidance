const express = require('express');
const router = express.Router();

const mongoose = require('./mongo/connection');
const { usersMongo, tokensMongo } = require('./mongo/schemas');

const validator = require('validator');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const bcrypt = require('bcryptjs');

// Authorization users
router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    // Check data type
    if (typeof username !== 'string' || typeof password !== 'string')
        return res.status(401).send('Incorrect data')

    // Validation username and password
    if (!validator.isAlphanumeric(username, ['en-US']) && !validator.isAlphanumeric(username, ['en-US']))
        return res.status(401).send('Incorrect data');

    // Search for a username in the database
    let user = await usersMongo.findOne({username});

    if (!user)
        return res.status(401).send('Incorrect username');

    const isComparison = await bcrypt.compare(password, user.password);

    if (!isComparison)
        return res.status(401).send('Incorrect password');

    const agent = req.headers['user-agent'];

    // Response
    res.send(await issueToken(user.id, agent))
})

// Get a new tokens
router.post('/refresh', checkToken, async (req, res) => {
    // Delete old token
    const { token } = req.user;
    await tokensMongo.deleteOne({token});

    const agent = req.headers['user-agent'];

    // Response
    res.send(await issueToken(req.user.userID, agent))
})

// Logout all devices
router.post('/logout', checkToken, async(req, res) => {
    // Delete all devices
    const { userID } = req.user;
    await tokensMongo.deleteMany({userID});

    // Response
    res.status(200).send('Ok');
})

// Logout one device
router.post('/logoutOne', checkToken, async(req, res) => {
    // Delete one token
    const { token } = req.user;
    await tokensMongo.deleteOne({token});

    // Response
    res.status(200).send('Ok');
})

/* Functions's */

// Middleware for check token
async function checkToken(req, res, next) {
    const {token} = req.body;

    // Check data type
    if (typeof token !== 'string')
        return res.status(401).send('Incorrect token');

    // Validation uuid
    if (!validator.isUUID(token, [4]))
        return res.status(401).send('Incorrect token');

    // Search for a token in the database
    let user = await tokensMongo.findOne({token});

    if (!user)
        return res.status(401).send('Invalid token');

    // Expired token
    if (user.expires.getTime() <= Date.now()) {
        await tokensMongo.deleteOne({token});
        return res.status(401).send('Token expired');
    }

    req.user = user;
    next();
}

// Generate new tokens
async function issueToken(userID, agent) {
    // Count of authorized devices
    const count = await tokensMongo.countDocuments({userID});

    if (count >= 10)
        await tokensMongo.deleteMany({userID});

    const token = uuid();

    new tokensMongo ({userID, token, agent}).save();

    return {
        jwt: jwt.sign({userID}, process.env.secret, {expiresIn: '1h'}),
        token: token
    }
}

module.exports = router;
