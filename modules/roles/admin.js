const { usersMongo } = require('../mongo/schemas');

const express = require('express');
const router = express.Router();
const validator = require('validator');

router.use((req, res, next) => {
    if (req.user.role === 4)
        return next()

    res.status(403).send('Forbidden');
})

// Get all test
router.get('/', async (req, res) => {

})

// Add or update tets
router.patch('/:nameTest', async (req, res) => {

})

module.exports = router;
