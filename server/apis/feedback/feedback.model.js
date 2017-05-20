
var mongoose = require('mongoose');

var feedback = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Feedback', feedback);
