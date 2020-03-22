const {usersMongo} = require('../mongo/schemas');

const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    return req.user.role === 3 ? next() : res.status(403).send('Forbidden')
})

// Get all test

module.exports = router;

