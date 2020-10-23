'use strict';
require('dotenv').config();

const app = require('express')();
const handlers = require('./handlers');
const routes = require('./controllers');

/* Middleware */
handlers.forEach((h) => app.use(h));

/* Routes */
routes.forEach(({path, router}) => app.use(path, router));

app.use((_, res) => res.status(404).send('Nothing'));

app.listen(process.env.port, (err) => {
    if (err)
        return console.error('Error start');

    console.info('REST server is run');
});

if (process.argv.includes('--preview'))
    require('./controllers/preview');
