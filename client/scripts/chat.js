$(document).ready(function () {
    socket.on('chat', function (data) {
        var currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser._id == data.receiverId) {
            if ($("#chat" + data.senderId).length != 0) {
                $("#chat" + data.senderId).append(templates.chatFriend(data.messageData));
                scrollToBottom(data.senderId);
            } else {
                regisChat(data.senderId);
            }
        }
    });

    socket.on('join call', function (data) {
        if ($('#incommingCallModal').hasClass('in')) {
            socket.emit('access call', {
                peer_id: data._id,
                accepted: false
            });
        } else {
            $('#incommingCall').html(templates.incommingCall(data));
            $('#incommingCallModal').modal('show');
        }
    });

    socket.on('typing', function (data) {
        if (data.isTyping == true) {
            if ($("#chatTab" + data.senderId).length != 0) {
                $("#textTyping" + data.senderId).addClass("isTyping");
            }
        } else {
            if ($("#chatTab" + data.senderId).length != 0) {
                $("#textTyping" + data.senderId).removeClass("isTyping");
            }
        }
    });

});

function sendMessage(e, id) {
    var msg = $('#send' + id).val().trim();
    var user = JSON.parse(localStorage.getItem('user'));
    if (msg != "") {
        socket.emit('typing', {
            senderId: user._id,
            receiverId: id,
            isTyping: true
        });
    } else {
        socket.emit('typing', {
            senderId: user._id,
            receiverId: id,
            isTyping: false
        });
    }
    if (e.keyCode === 13 && msg != "") {
        console.log("aw"+msg);
        var message = {
            message: msg
        };
        socket.emit('chat', {
            senderId: user._id,
            receiverId: id,
            message: msg
        });
        $("#chat" + id).append(templates.chatMySelf(message));
        $('#send' + id).val("");
        socket.emit('typing', {
            senderId: user._id,
            receiverId: id,
            isTyping: false
        });
        scrollToBottom(id);
    }
    if (e.keyCode === 27) {
        $(".titlebar").removeClass("greenChatTitle");
        $('#chatTab' + id).remove();
    }
}
