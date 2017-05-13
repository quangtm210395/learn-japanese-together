var mongoose = require('mongoose');

var conversation = mongoose.Schema({
    id: String,
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
    friend: Object
});

module.exports = mongoose.model('Conversation', conversation);
