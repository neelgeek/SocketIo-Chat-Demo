const mongoose = require('mongoose');

const userCount = mongoose.Schema({
    name: String,
    users: Number
});

module.exports = mongoose.model('users', userCount);