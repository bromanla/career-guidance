const jwtMiddleware = require('express-jwt');

module.exports = jwtMiddleware({
    secret: process.env.secret,
    algorithms: ['HS256']
}).unless({
    path: [RegExp('^/auth/')]
})
