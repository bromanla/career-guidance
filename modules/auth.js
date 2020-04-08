const { usersMongo, tokensMongo } = require('./mongo/schemas');

const express = require('express');
const router = express.Router();
const validator = require('validator');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const bcrypt = require('bcryptjs');

// Authorization users
router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    // Search for a username in the database
    let user = await usersMongo.findOne({username}, {tests: false});

    if (!user)
        return res.status(401).send('Incorrect username');

    const isComparison = await bcrypt.compare(password, user.password);

    if (!isComparison)
        return res.status(401).send('Incorrect password');

    const agent = req.headers['user-agent'];

    res.send(await issueToken(user, agent));
})

// Get a new tokens
router.post('/refresh', checkToken, async (req, res) => {
    const { token } = req.user;
    await tokensMongo.deleteOne({token});

    const user  = await usersMongo.findById(req.user.userID, {tests: false});
    const agent = req.headers['user-agent'];

    res.send(await issueToken(user, agent));
})

// Logout all devices
router.post('/logout', checkToken, async(req, res) => {
    const { userID } = req.user;
    await tokensMongo.deleteMany({userID});

    res.status(200).send('Ok');
})

// Logout one device
router.post('/logoutOne', checkToken, async(req, res) => {
    const { token } = req.user;
    await tokensMongo.deleteOne({token});

    res.status(200).send('Ok');
})

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
async function issueToken(user, agent) {
    // Count of authorized devices
    const userID = user.id;

    const count = await tokensMongo.countDocuments({userID});

    if (count >= 10)
        await tokensMongo.deleteMany({userID});

    const token = uuid();

    new tokensMongo ({userID, token, agent}).save();

    const payload = {
        userID,
        role: user.role,
        classroom: user.classroom,
        children: user.children.length ? user.children : undefined,
        classrooms: user.classrooms.length ? user.classrooms : undefined
    }

    return {
        jwt: jwt.sign(payload, process.env.secret, {expiresIn: '1h'}),
        token: token
    }
}

module.exports = router;
