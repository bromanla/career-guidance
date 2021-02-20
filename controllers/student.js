const
    { testsMongo } = require('../mongo'),
    { getTests, getStat } = require('./methods'),
    { isMongoId } = require('validator'),
    router = require('express').Router();

// Role student
router.use((req, res, next) => req.user.role === 0 ? next() : res.status(403).send('Forbidden'))

// Get all test
router.get('/tests', async (req, res) => {
    res.json(await getTests(req.user.userID, req.query.page));
})

// Sum of all test results (for visualization)
router.get('/statistics', async (req, res) => {
    res.json(await getStat(req.user.userID));
})

// Add tests
router.post('/tests', async (req, res) => {
    const passedBy = req.user.userID;
    let {title, ...test} = req.body;
    title = String (title)

    if (!/^[(a-z)(0-9)(а-яё)\s$]+$/i.test(title) || !req.body.title)
        return res.status(400).send('Validation error')

    const alreadyHave = await testsMongo.findOne({title, passedBy}).countDocuments();

    if (alreadyHave) {
        return res.status(400).send('Test already exists')
    }

    test = {...test, passedBy, title};

    testsMongo(test).save()
        .then(() => res.status(201).send('OK'))
        .catch(() => res.status(400).send('Validation error'))
})

// Update test
router.put('/tests/:id', async (req, res) => {
    const
        passedBy = req.user.userID,
        { id } = req.params,
        test = req.body;

    // Validation Id test
    if (!isMongoId(id + ''))
        return res.status(401).send('Incorrect testId');

    testsMongo.findOneAndUpdate({_id: id, passedBy}, test, {runValidators: true})
        .then((exists) => {
            if (!exists)
                return res.status(400).send('Test does not exist')

            res.status(201).send('OK')
        })
        .catch(() => res.status(400).send('Error'))
})

module.exports = {path: '/s/', router};
