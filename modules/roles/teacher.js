const {usersMongo} = require('../mongo/schemas');
const {testsValid, validate} = require('../validation');

const express = require('express');
const router = express.Router();
const {matchedData} = require('express-validator');

// Role teacher
router.use((req, res, next) => {
    return req.user.role === 2 ? next() : res.status(403).send('Forbidden')
})

// Get owned students
router.get('/students', async (req, res) => {
    const {classrooms} = req.user;
    const students = await usersMongo.find({classroom: {$in: classrooms}}, {_id: false, username: true, classroom: true});

    res.json(students || [])
})

// Get test student
router.get('/tests/:username', async (req, res) => {
    const {username} = req.params;
    const {classrooms} = req.user;

    const student = await usersMongo.findOne({username}, {classroom: true, tests: true, _id: false});

    if (!student || !classrooms.includes(student.classroom))
        return res.status(403).send('Forbidden')

    res.json(student.tests || []);
})

// Add or update test
router.patch('/tests/:username/:nameTest', testsValid, validate, async (req, res) => {
    const {username, nameTest} = req.params;
    const {classrooms} = req.user;

    const data = matchedData(req, {includeOptionals: false});
    const student = await usersMongo.findOne({username}, {classroom: true});

    if (!student || !classrooms.includes(student.classroom))
        return res.status(403).send('Forbidden')

    await usersMongo.updateOne({'_id': student.id}, {$set: {[`tests.${nameTest}`]: data}});

    res.status(201).send('ok');
})

// Delete test
router.delete('/tests/:username/:nameTest', async (req, res) => {
    const {username, nameTest} = req.params;
    const {classrooms} = req.user;

    const student = await usersMongo.findOne({username}, {classroom: true});

    if (!student || !classrooms.includes(student.classroom))
        return res.status(403).send('Forbidden')

    await usersMongo.updateOne({'_id': student.id}, {$unset: {[`tests.${nameTest}`]: true}});

    res.status(201).send('ok');
})

module.exports = router;
