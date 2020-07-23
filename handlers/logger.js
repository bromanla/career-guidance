const fs = require('fs');

module.exports = async (req, res, next) => {
    const log = `${Date()} ${req.headers['user-agent']} ${req.method + req.url}\n`

    fs.appendFile('request.log', log, () => 0);
    next()
}