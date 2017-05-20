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
    },

    getConversationBy20: function(req, res) {
      userId = req.user._id;
      friendId = req.params.friendId;
      remainingMessages = req.params.remain;

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

                      // get fromIndex
                      if (remainingMessages == -1) {
                          fromIndex = 0;
                      } else {
                          fromIndex = conversation.messages.length - remainingMessages;
                      }

                      // get fromIndex
                      if (fromIndex + 20 -1 <= conversation.messages.length) {
                          toIndex = fromIndex + 20 - 1;
                      } else {
                          toIndex = conversation.messages.length - 1;
                      }

                      console.log(fromIndex + " " + toIndex + " " + (conversation.messages.length - 1));
                      // get nextUrl
                      if (toIndex < conversation.messages.length - 1) {
                          remainingMessages = conversation.messages.length - 1 - toIndex;
                          conversation.nextUrl = "/get20/friendId/" + remainingMessages;
                          conversation.messages = conversation.messages.slice(fromIndex, toIndex + 1);
                      } else {
                          remainingMessages = 0;
                          conversation.nextUrl = "";
                          conversation.messages = conversation.messages.slice(fromIndex, toIndex + 1);
                      }
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
