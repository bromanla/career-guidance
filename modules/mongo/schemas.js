const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    tests: {
        type: Object,
        default: {}
    }
}, {
    minimize: false
});

const tokensSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    agent: {
        type: String,
        required: true
    },
    expires: {
        type: Date,
        required: true,
        default: () => Date.now() + 1000 * 60 * 60 * 24 * 90
    }
});

module.exports.usersMongo = mongoose.model('users', usersSchema);
module.exports.tokensMongo = mongoose.model('tokens', tokensSchema)