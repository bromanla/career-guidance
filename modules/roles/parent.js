const {usersMongo} = require('../mongo/schemas');

const express = require('express');
const router = express.Router();

// Role parent
router.use((req, res, next) => {
    return req.user.role === 1 ? next() : res.status(403).send('Forbidden')
})

// Get test children
router.get('/tests/:username', async (req, res) => {
    let {username} = req.params;

    if (!req.user.children.includes(username))
        return res.status(403).send('Forbidden');

    const child = await usersMongo.findOne({username}, {tests: true})
    res.json(child ? child.tests : []);
})

module.exports = router;
