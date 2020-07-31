const { usersMongo } = require('../mongo/schemas');

const router = require('express').Router();

router.use((req, res, next) => {
    return req.user.role === 3 ? next() : res.status(403).send('Forbidden')
})

module.exports = router;
