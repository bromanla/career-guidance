'use strict';
console.clear();

require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Modules
const authModule = require('./modules/auth');
const testsModule = require('./modules/tests');
const agentModule = require('./modules/agent');

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100
});

/* Middleware */
app.use(limiter);
app.use(cors());
app.use(express.json({
    limit: '100kb'
}));

// Error handler for parse json
app.use((err, req, res, next) => {
    if (err)
        return res.status(err.status).send(err.message);

    next();
});

// Routes
app.use('/auth', authModule);
app.use('/tests', testsModule);
app.use('/agent', agentModule);

app.listen(process.env.port, (err) => {
    if (err)
        return console.error('Error start');

    console.log('REST')
});
