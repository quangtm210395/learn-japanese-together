/**
 * Created by phanmduong on 4/27/17.
 */

const userController = require('./apis/user/user.controller');

module.exports = (io) => {

    io.on('connection', function (socket) {
        updateStatusUsers(socket);
        socket.on('login', function (data) {
            socket.username = data.username;
            updateStatusUsers(socket.broadcast);
        });

        socket.on('disconnect', function() {
            updateStatusUsers(io);
        });
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
};