/**
 * Created by phanmduong on 4/27/17.
 */

const userController = require('./apis/user/user.controller');
const Message = require('./apis/message/message.model');
const Conversation = require('./apis/conversation/conversation.model');
const User = require('./apis/user/user.model');

module.exports = (io) => {

    io.on('connection', function (socket) {
        updateStatusUsers(socket);
        socket.on('login', function (data) {
            socket.username = data.username;
            updateStatusUsers(io);
        });

        socket.on('disconnect', function() {
            updateStatusUsers(io);
        });

        socket.on('logout', function () {
            socket.username = undefined;
            updateStatusUsers(io);
        })

        socket.on('chat', function(data){
            createMessage(data);
        })
    });

    function updateStatusUsers(browser) {
        listUser(function (users) {
            browser.emit('update status users', {users: users});
        });
    }

    function setOnline(user, callback) {
        io.sockets.clients(function (error, clients) {
            clients.forEach(function (client) {
                if (io.sockets.sockets[client].username === user.username) {
                    user.isOnline = true;
                }
            });
            callback();
        });
    }

    function listUser(callback) {
        userController.getAll(function (users) {
            users.forEach(function (user, index) {
                setOnline(user, function () {
                    if (index === users.length -1) callback(users);
                })
            });
        });
    };

    function createMessage(data) {
      var newMessage = new Message({
          content: data.message,
          sender: data.senderId,
          receiver: data.receiverId
      });
      
      newMessage.save(function(err, message){
          if (err) console.log(err);
          if (message.sender < message.receiver) {
            conversationId = message.sender + "@" + message.receiver;
          } else {
            conversationId = message.receiver + "@" + message.sender;
          };
          Conversation.findOneAndUpdate({id: conversationId}, {$push: {messages: message}}, function(err, conversation){
              if (err) console.log(err);
              User.findOne({_id: data.senderId}, function(err, user){
                  if (err) console.log(err);
                  console.log({
                      senderId: data.senderId,
                      receiverId: data.receiverId,
                      messageData: {
                          imgUrl: user.imgUrl,
                          message: data.message
                      }
                  });
                  io.emit('chat', {
                      senderId: data.senderId,
                      receiverId: data.receiverId,
                      messageData: {
                          imgUrl: user.imgUrl,
                          message: data.message
                      }
                  });
              });
          });
      });
    }
};
