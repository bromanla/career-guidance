const {testsMongo} = require('../mongo/schemas');

const router = require('express').Router();
const {isAlphanumeric, isAlphanumericLocales} = require('validator');

// Role student
router.use((req, res, next) => req.user.role === 0 ? next() : res.status(403).send('Forbidden'))

// Get all test
router.get('/tests', async (req, res) => {
    const id = req.user.userID;
    const tests = await testsMongo.find({passedBy: id}, {passedBy: false}).lean();

    res.json(tests);
})

// Add tests
router.post('/tests', async (req, res) => {
    const passedBy = req.user.userID;
    let {title, ...test} = req.body;
    title = String (title)

    if (!/^[(a-z)(0-9)(а-яё)\s]+$/i.test(title))
        return res.status(400).send('Validation error')

    const alreadyHave = await testsMongo.findOne({title, passedBy}).countDocuments();

    if (alreadyHave) {
        return res.status(304).send()
    }

    test = {...test, passedBy, title};

    testsMongo(test).save()
        .then(() => res.status(201).send('OK'))
        .catch(() => res.status(400).send('Validation error'))
})

// Update test
router.put('/tests/:id', async (req, res) => {
    const passedBy = req.user.userID;
    const {id} = req.params;
    let test = req.body;

    testsMongo.findOneAndUpdate({_id: id, passedBy}, test, {runValidators: true})
        .then((exists) => {
            if (!exists)
                return res.status(400).send('Test does not exist')

            res.status(201).send('OK')
        })
        .catch(() => res.status(400).send('Error'))
})

module.exports = {path: '/s/', router};
