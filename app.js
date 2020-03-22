'use strict';

require('dotenv').config();
require('./modules/mongo/connection');

const express = require('express');
const app = express();
const jwtMiddleware = require('express-jwt');
const rateLimit = require('express-rate-limit');

/* Middleware */
app.use(jwtMiddleware({
    secret: process.env.secret
}).unless({
    path: [/^\/auth\//, '/agent']
}));

app.use(rateLimit({
    windowMs: 60 * 1000,
    max: 100
}));

app.use(express.json({
    limit: '100kb'
}));

// Error handler for parse json
app.use((err, req, res, next) => err ? res.status(err.status).send(err.message) : next());

// Routes
app.use('/auth', require('./modules/auth'));
app.use('/agent', require('./modules/agent'));

app.use('/s/', require('./modules/roles/student'));
app.use('/p/', require('./modules/roles/parent'));
app.use('/t/', require('./modules/roles/student'));
app.use('/a/', require('./modules/roles/admin'));

app.use((req, res) => res.status(404).send('Nothing'))

app.listen(process.env.port, (err) => {
    if (err)
        return console.error('Error start');

    console.log('Server is run');
});
