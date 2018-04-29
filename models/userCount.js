const mongoose = require('mongoose');

const userCount = mongoose.Schema({
    name: string,
    users: number
});

module.exports = mongoose.model('users', userCount);