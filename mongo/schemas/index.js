const tests = require('./tests');
const tokens = require('./tokens');
const users = require('./users');

module.exports = {
    ...tests,
    ...tokens,
    ...users
}