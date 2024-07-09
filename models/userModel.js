const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImg: {
        data: Buffer,
        contentType: String
    },
    role: {
        type: Number,
        default: 0
    },
    code: {
        type: Number,
        default: 0
    },
}, { versionKey: false, timestamps: true })

module.exports = mongoose.model('User', userSchema);