var socket;
$(document).ready(function () {
    socket = io.connect();
    var peer_opponent;

    socket.emit('find peer', {id: peer_id});
    socket.on('peer opponent', function (data) {
        peer_opponent = data.peer_opponent;
        if (data.isGetRoom) {
            $.post('/api/videocall/room-random', {
                peer_id_sender: peer_id,
                peer_id_receive: peer_opponent
            }, function (data, status) {
                socket.emit('get room', {id: peer_opponent});
                console.log(data.result.sessionId);
                if (data.status) {
                    var apiKey = data.result.apiKey;
                    var sessionId = data.result.sessionId;
                    var token = data.result.token;
                    initializeSession(apiKey, sessionId, token);
                } else {
                    console.log(data.message);
                }

            });
        }
    })

    socket.on('get room data', function () {
        $.post('/api/videocall/room-random', {
            peer_id_sender: peer_id,
            peer_id_receive: peer_opponent
        }, function (data, status) {
            console.log(data.result.sessionId);
            if (data.status) {
                var apiKey = data.result.apiKey;
                var sessionId = data.result.sessionId;
                var token = data.result.token;
                initializeSession(apiKey, sessionId, token);
            } else {
                console.log(data.message);
            }
        });
        });
});


function initializeSession(apiKey, sessionId, token) {
    var session = OT.initSession(apiKey, sessionId);
    // Subscribe to a newly created stream

    // Connect to the session
    session.connect(token, function (error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (!error) {
            var publisher = OT.initPublisher('publisher', {
                fitMode: "contain",
                width: '20%',
                height: '30%'
            });

            session.publish(publisher);
        } else {
            console.log('There was an error connecting to the session: ', error.code, error.message);
        }
    });

    session.on('streamCreated', function (event) {
        var subscriber = session.subscribe(event.stream, 'subscriber', {
            fitMode: "contain",
            width: '100%',
            height: '100%'
        });
    });


}

function setupAjax() {
    $.ajaxSetup({
        headers: {
            "token": localStorage.getItem("token")
        }
    });
}