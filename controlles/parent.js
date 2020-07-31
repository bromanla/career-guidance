const {getTests, getStat} = require('./methods');
const router = require('express').Router();

// Middleware
const chechChild = async (req, res, next) => {
    const {id} = req.params;

    const [child = false] = req.user.children.filter(el => el.id === id)

    if (!child)
        return res.status(403).send('Forbidden');

    await next();
}

// Role parent
router.use((req, res, next) => req.user.role === 1 ? next() : res.status(403).send('Forbidden'))

// Get test children
router.get('/tests/:id', chechChild, async (req, res) => {
    const {id} = req.params;

    res.json(await getTests(id, req.query.page));
})

// Sum of all test results (for visualization)
router.get('/statistics/:id', chechChild, async (req, res) => {
    const {id} = req.params;

    res.json(await getStat(id));
})

module.exports = {path: '/p/', router};
