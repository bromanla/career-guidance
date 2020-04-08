const {usersMongo} = require('../mongo/schemas');
const {testsValid, validate} = require('../validation');

const express = require('express');
const router = express.Router();
const {matchedData} = require('express-validator');

// Role student
router.use((req, res, next) => {
    return req.user.role === 0 ? next() : res.status(403).send('Forbidden')
})

// Get all test
router.get('/tests', async (req, res) => {
    const id = req.user.userID;
    const {tests} = await usersMongo.findById(id, {tests: true, _id: false});

    res.json(tests || []);
})

// Add or update test
router.patch('/tests/:nameTest', testsValid, validate, async (req, res) => {
    const id = req.user.userID;
    const data = matchedData(req, {includeOptionals: false});
    const {nameTest} = req.params;

    await usersMongo.updateOne({'_id': id}, {$set: {[`tests.${nameTest}`]: data}});

    res.status(201).send('ok');
})

module.exports = router;
