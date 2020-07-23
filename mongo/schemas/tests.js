const mongoose = require('mongoose');

const testsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    passedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    mm: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    mn: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    mt: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    ms: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    ma: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
}, {
    versionKey: false
})

module.exports.testsMongo = mongoose.model('tests', testsSchema);