const mongoose = require('mongoose');

const userCount = mongoose.Schema({
    name: String,
    users: number
});

module.exports = mongoose.model('users', userCount);