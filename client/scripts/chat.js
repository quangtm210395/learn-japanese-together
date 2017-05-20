$(document).ready(function () {
    socket.on('chat', function (data) {
        var currentUser = JSON.parse(localStorage.getItem('user'));
        console.log(currentUser._id +" " + data.receiverId);
        console.log(currentUser._id == data.receiverId);
        if (currentUser._id == data.receiverId) {
            if ($("#chat" + data.senderId).length != 0)
                $("#chat" + data.senderId).append(templates.chatFriend(data.messageData));
            else {
                $.ajax({
                        url: "/api/conversation/get/" + data.senderId,
                        method: "get"
                    })
                    .done(function (dataConvers) {
                        console.log(dataConvers);
                        if (dataConvers.status) {
                            var result = dataConvers.result;
                            result.messages.forEach(function (item) {
                                if (item.sender == data.senderId) {
                                    item._chatCss = "chat-friend";
                                    item._reverseCss = "";
                                    item._isFriend = true;
                                } else {
                                    item._chatCss = "chat-myself";
                                    item._reverseCss = "row-reverse";
                                    item._isFriend = false;
                                }
                            });
                            if ($("#" + result._id).length == 0)
                                $('#chatTabs').append(templates.chatTabs(result));
                        }
                    });
            }
        }
    });

    socket.on('join call', function (data) {
        if ($('#incommingCallModal').hasClass('in')){
            socket.emit('access call', {
                peer_id: data._id,
                accepted: false
            });
        } else {
            $('#incommingCall').html(templates.incommingCall(data));
            $('#incommingCallModal').modal('show');
        }
    })

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
    }
}
