const mongoose = require('mongoose');

const classesSchema = new mongoose.Schema({
    classroom: {
        type: Number,
        required: true,
        unique: true
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        }
    ],
    teachers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        }
    ]
}, {
    versionKey: false
})

module.exports.classesMongo = mongoose.model('classes', classesSchema);