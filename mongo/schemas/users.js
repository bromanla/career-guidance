const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true,
        default: 0
    },
    classroom: {
        type: Number
    },
    classrooms: {
        type: Array
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'users'
    }]
}, {
    versionKey: false
});

module.exports.usersMongo = mongoose.model('users', usersSchema);
