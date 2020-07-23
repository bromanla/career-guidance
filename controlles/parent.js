const {testsMongo} = require('../mongo/schemas');

const router = require('express').Router();

// Role parent
router.use((req, res, next) => req.user.role === 1 ? next() : res.status(403).send('Forbidden'))

// Get test children
router.get('/tests/:id', async (req, res) => {
    const {id} = req.params;

    const [child = false] = req.user.children.filter(el => el.id === id)

    if (!child)
        return res.status(403).send('Forbidden');

    const tests = await testsMongo.find({passedBy: child.id}).lean();
    res.json(tests);
})

module.exports = {path: '/p/', router};
