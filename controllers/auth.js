const { usersMongo, tokensMongo, classesMongo } = require('../mongo');

const
    router = require('express').Router(),
    validator = require('validator'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    { v4: uuid } = require('uuid');

// Authorization users
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Search for a username in the database
    const user = await usersMongo.findOne({username}).lean();

    if (!user)
        return res.status(401).send('Incorrect username');

    const isComparison = await bcrypt.compare(password, user.password);

    if (!isComparison)
        return res.status(401).send('Incorrect password');

    const agent = req.headers['user-agent'] || 'Undefined';

    res.send(await issueToken(user, agent));
})

// Get a new tokens
router.post('/refresh', checkToken, async (req, res) => {
    const { token } = req.user;
    await tokensMongo.deleteOne({token});

    const user  = await usersMongo.findById(req.user.userID).lean();
    const agent = req.headers['user-agent'] || 'Undefined';

    res.send(await issueToken(user, agent));
})

// Logout all devices
router.post('/logout', checkToken, async(req, res) => {
    const {userID} = req.user;
    await tokensMongo.deleteMany({userID});

    res.status(200).send('Ok');
})

// Logout one device
router.post('/logoutOne', checkToken, async(req, res) => {
    const {token} = req.user;
    await tokensMongo.deleteOne({token});

    res.status(200).send('Ok');
})

// Middleware for check token
async function checkToken(req, res, next) {
    const { token } = req.body;

    // Check data type
    if (typeof token !== 'string')
        return res.status(401).send('Incorrect token');

    // Validation uuid
    if (!validator.isUUID(token, [4]))
        return res.status(401).send('Incorrect token');

    // Search for a token in the database
    const user = await tokensMongo.findOne({token});

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
    const userID = user._id;

    const count = await tokensMongo.countDocuments({userID});

    if (count >= 10)
        await tokensMongo.deleteMany({userID});

    const token = uuid();

    await new tokensMongo({userID, token, agent}).save();

    // Create JWT
    const payload = {userID, role: user.role}

    switch (user.role) {
        // Student
        case 0: {
            const classroom = await classesMongo.findOne({students: {$in: user._id}}, {classroom: true}).lean() || {};

            payload.classroom = classroom.classroom ? classroom.classroom : null;
            break;
        }
        // Teacher
        case 2: {
            const classrooms = await classesMongo.find({teachers: {$in: user._id}}, {classroom: true}).lean();
            payload.classrooms = classrooms.map(el => el.classroom);
            break;
        }
    }

    return {
        jwt: jwt.sign(payload, process.env.secret, {expiresIn: '3h', algorithm: 'HS256'}),
        token: token
    }
}

module.exports = {path: '/auth', router};
