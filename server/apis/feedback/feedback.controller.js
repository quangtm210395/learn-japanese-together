var Feedback = require('./feedback.model');
var User = require('../user/user.model');
var jwt = require('jsonwebtoken');
var config = require('../../configs/index.js');

module.exports = {
    createFeedback: function(req, res) {
        var newFeedback = new Feedback(req.body);
        newFeedback.save(function(err, feedback){
            if (err) {
                res.json({status: false, message: err});
            } else {
                res.json({status: true, message: "Feedback thành công"});
            }
        });
    },

    getAllFeedback: function(req, res) {
        Feedback.find({}, {'_id': 0, '__v': 0})
            .exec(function(err, feedbacks){
              if (err) {
                  res.json({status: false, message: err});
              } else {
                  res.json({status: true, message: "Thành công", result: feedbacks});
              }
            })
    }
};
