const mongoose = require('mongoose');

const tokensSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
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
}, {
    versionKey: false
})

module.exports.tokensMongo = mongoose.model('tokens', tokensSchema);