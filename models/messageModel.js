const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
    name: String,
    message: String
});


module.exports = mongoose.model('messages', ChatSchema);