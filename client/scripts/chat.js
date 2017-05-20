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

});

function sendMessage(e, id) {
    if (e.keyCode == 13) {
        var msg = $('#send' + id).val();
        var message = {
            message: msg
        };
        let user = JSON.parse(localStorage.getItem('user'));
        socket.emit('chat', {
            senderId: user._id,
            receiverId: id,
            message: msg
        });
        $("#chat" + id).append(templates.chatMySelf(message));
        $('#send' + id).val("");
        scrollToBottom(id);
    }
}