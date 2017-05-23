$(document).ready(function () {
    socket.on('chat', function (data) {
        var currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser._id == data.receiverId) {
            if ($("#chat" + data.sender._id).length != 0) {
                $("#chat" + data.sender._id).append(templates.chatFriend(data.messageData));
                scrollToBottom(data.sender._id);
            } else {
                regisChat(data.sender._id, data.sender.name);
            }
        }
    });

    socket.on('join call', function (data) {
        videoCallSoundElement.play();
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
        var message = {
            message: msg
        };
        socket.emit('chat', {
            sender: user,
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