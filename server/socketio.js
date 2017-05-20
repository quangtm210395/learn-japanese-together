/**
 * Created by phanmduong on 4/27/17.
 */

const userController = require('./apis/user/user.controller');
const Message = require('./apis/message/message.model');
const Conversation = require('./apis/conversation/conversation.model');
const User = require('./apis/user/user.model');
var room = require('./apis/videocall/videocall.model').room;

module.exports = (io) => {

    io.on('connection', function (socket) {
        updateStatusUsers(socket);
        socket.on('login', function (data) {
            socket.id = data.id;
            socket.username = data.username;
            updateStatusUsers(io);
        });

        socket.on('disconnect', function () {
            socket.username = undefined;
            socket.id = undefined;
            disconnectVideoCall(socket);
            updateStatusUsers(io);
        });

        socket.on('logout', function () {
            socket.username = undefined;
            socket.id = undefined;
            updateStatusUsers(io);
        })

        socket.on('chat', function (data) {
            createMessage(data);
        })

        socket.on('create call', function (data) {
            socket.isCall = true;
            socket.id = data.peer_id_sender;
            socket.peer_id1 = data.peer_id_receive;
            socket.peer_id2 = data.peer_id_sender;
            // kiêm tra đã có ai join cuộc gọi chưa. nếu chưa thì sẽ emit đến thằng đối phương để yêu cầu chập nhận cuộc gọi
            if (!checkJoinedCall(socket)) {
                io.sockets.clients(function (error, clients) {
                    clients.forEach(function (client) {
                        if (io.sockets.sockets[client].id === data.peer_id_receive) {
                            userController.getUserCallback(data.peer_id_sender, function (user) {
                                io.sockets.sockets[client].emit('join call', user);
                            });
                        }
                    });
                });
            }
        })

        socket.on('access call', function (data) {
            io.sockets.clients(function (error, clients) {
                clients.forEach(function (client) {
                    if (io.sockets.sockets[client].id === data.peer_id) {
                        io.sockets.sockets[client].emit('reply access call', {
                            accepted: data.accepted
                        })
                    }
                });
            });
        })
    });

    function checkJoinedCall(socket) {
        if (socket.isCall) {
            var peer_id1 = socket.peer_id1;
            var peer_id2 = socket.peer_id2;
            var roomName = (peer_id1 < peer_id2) ? peer_id1 + "@" + peer_id2 : peer_id2 + "@" + peer_id1;
            if (!room[roomName]) return false;

            // kiểm tra đã có id của thằng được gọi có trong room chưa peer_id1 tương đương với thằng được gọi
            if (room[roomName].peer_id1 === peer_id1) {
                return true;
            } else {
                if (room[roomName].peer_id2 === peer_id1) {
                    return true;
                }
            }
        }
        return false;
    }

    function disconnectVideoCall(socket) {
        if (socket.isCall) {
            var peer_id1 = socket.peer_id1;
            var peer_id2 = socket.peer_id2;
            var roomName = (peer_id1 < peer_id2) ? peer_id1 + "@" + peer_id2 : peer_id2 + "@" + peer_id1;
            if (room[roomName].peer_id1 === socket.id) {
                room[roomName].peer_id1 = null;
            } else {
                if (room[roomName].peer_id2 === socket.id) {
                    room[roomName].peer_id2 = null;
                }
            }
        }
    }

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
                    if (index === users.length - 1) callback(users);
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
