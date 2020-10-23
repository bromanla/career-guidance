const
    { usersMongo, classesMongo } = require('../mongo'),
    { getTests } = require('./methods'),
    { isMongoId } = require('validator'),
    router = require('express').Router();

// Role teacher
router.use((req, res, next) => req.user.role === 2 ? next() : res.status(403).send('Forbidden'))

// Get owned students
router.get('/students', async (req, res) => {
    const students = await classesMongo
        .find({teachers: {$in: req.user.userID}}, {classroom: true, students: true, _id: false})
        .populate('students', ['username', 'birthday'])
        .lean();

    res.json(students)
})

// Get test student
router.get('/students/:id', async (req, res) => {
    const { id } = req.params;

    if (!isMongoId(id + ''))
        return res.status(401).send('Incorrect userId');

    const student = await classesMongo
        .findOne({students: {$in: id}}, {classroom: true})
        .lean() || {};

    if (!req.user.classrooms.includes(student.classroom))
        return res.status(403).send('Forbidden')

    res.json(await getTests(id, req.query.page));
})

module.exports = {path: '/t/', router};
