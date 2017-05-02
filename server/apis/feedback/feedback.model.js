
var mongoose = require('mongoose');

var feedback = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true
    }
});

module.exports = mongoose.model('Feedback', feedback);
