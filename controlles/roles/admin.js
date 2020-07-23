const { usersMongo } = require('../mongo/schemas');

const express = require('express');
const router = express.Router();
const validator = require('validator');

router.use((req, res, next) => {
    return req.user.role === 3 ? next() : res.status(403).send('Forbidden')
})

module.exports = router;
