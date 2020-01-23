const express = require('express');
const router = express.Router();

const mongoose = require('./mongo/connection');
const { usersMongo } = require('./mongo/schemas');

const jwtMiddleware = require('express-jwt');
const validator = require('validator');

router.use(jwtMiddleware({secret: process.env.secret}));

// Error handler for jwt
router.use((err, req, res, next) => {
    if (err)
        return res.status(err.status).send(err.message);

    next();
});

// Get all test
router.get('/', async (req, res) => {
    const id = req.user.userID;

    // Find tests
    const {tests} = await usersMongo.findById(id, {tests: true});

    res.json(tests);
})

// Get the necessary test
router.get('/:nameTest', async (req, res) => {
    const id = req.user.userID;
    const { nameTest} = req.params;

    // Validation nameTest
    if (!validator.isAlphanumeric(nameTest, ['en-US']))
        return res.status(401).send('Validator error');

    // Get the test
    const user = await usersMongo.findOne({'_id': id, [`tests.${nameTest}`]: {$exists: 1}}, {[`tests.${nameTest}`]: true});

    // Response
    res.json(user ? user.tests : {})
})

// Add or update tets
router.patch('/:nameTest', async (req, res) => {
    const id = req.user.userID;
    const { nameTest} = req.params;
    const { score } = req.body;

    if (typeof score !== 'number')
        return res.status(401).send('Score is not number');

    await usersMongo.updateOne({'_id': id}, {$set: {[`tests.${nameTest}`]: score}})

    res.status(201).send('Ok');
})

router.delete('/:nameTest', async (req, res) => {
    const id = req.user.userID;
    const { nameTest} = req.params;

    // Validation nameTest
    if (!validator.isAlphanumeric(nameTest, ['en-US']))
        return res.status(401).send('Validator error');

    const { nModified } = await usersMongo.updateOne({'_id': id}, {$unset: {[`tests.${nameTest}`]: 1}});

    if (nModified === 0)
        return res.status(410).send('Test not found');
    else
        return res.status(200).send('Ok')
})

module.exports = router;
