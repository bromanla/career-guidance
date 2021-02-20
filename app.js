'use strict';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    console.log('Debug mode')
}

const app = require('express')();
const handlers = require('./handlers');
const routes = require('./controllers');

/* Middleware */
handlers.forEach((h) => app.use(h));

/* Routes */
routes.forEach(({path, router}) => app.use(path, router));

app.use((_, res) => res.status(404).send('Nothing'));

app.listen(process.env.port, (err) => {
    if (err) {
        console.log('Error start');
        process.exit(1)
    }

    console.log('Server is run');
});

if (process.argv.includes('--preview'))
    require('./controllers/preview');
