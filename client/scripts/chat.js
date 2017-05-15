$(document).ready(function () {
    socket.on('chat', function (data) {
        $("chat" + data.sendId).append(templates.chatFriend(data.messageData));
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
            sendId: user._id,
            receiverId: id,
            message: msg
        });
        $("#chat" + id).append(templates.chatMySelf(message));
        $('#send' + id).val("");
    }
}