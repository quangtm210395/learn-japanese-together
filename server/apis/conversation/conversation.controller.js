var Conversation = require('./conversation.model');
var User = require('../user/user.model');
var jwt = require('jsonwebtoken');
var config = require('../../configs/index.js');

module.exports = {

    getConversation: function(req, res) {
      userId = req.user._id;
      friendId = req.params.friendId;

      User.findOne({_id: friendId})
        .exec(function(err, friend){
            if (err) res.json({status: false, message: err.message});

            if (userId < friendId) {
              conversationId = userId + "@" + friendId;
            } else {
              conversationId = friendId + "@" + userId;
            };
            Conversation.findOne({id: conversationId}, {'__v' : 0})
              .populate({path: 'messages', select: '-__v -_id'})
              .exec(function(err, conversation){
                  if (err) res.json({status: false, message: err.message});

                  if (conversation) {
                      conversation.friend = friend;
                      res.json({status: true, message: "Get conversation successfully", result: conversation});
                  } else {
                      var newConversation = new Conversation({
                        id : conversationId,
                        messages : []
                      });
                      newConversation.save(function (err, conversation) {
                          if (err) res.json({status: false, message: err.message});
                          conversation.friend = friend;
                          res.json({status: true, message: "Create conversation successful", result: conversation});
                      })
                  }
              });


        });
    }
};
