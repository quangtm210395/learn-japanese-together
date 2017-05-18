var socket;
$(document).ready(function () {
    socket = io.connect();
    $.ajaxSetup({headers: {"token": localStorage.getItem("token")}});

    $.post('/api/videocall/room?peer_id=' + peer_id, function (data, status) {
        if (data.status) {
            var apiKey = data.result.apiKey;
            var sessionId = data.result.sessionId;
            var token = data.result.token;
            initializeSession(apiKey, sessionId, token);
        } else {
            console.log(data.message);
        }

    });

    socket.emit('create call', {
        peer_id_receive: peer_id,
        peer_id_sender: JSON.parse(localStorage.getItem('user'))._id
    });

    socket.on('reply access call', function (data) {
        if (data.accepted) console.log("Chấp nhận cuộc gọi"); else console.log("Từ chối cuộc gọi");
    })
});

function initializeSession(apiKey, sessionId, token) {
    var session = OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream

    // Connect to the session
    session.connect(token, function (error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (!error) {
            var publisher = OT.initPublisher('publisher', {
                insertMode: 'append',
            });

            session.publish(publisher);
        } else {
            console.log('There was an error connecting to the session: ', error.code, error.message);
        }
    });

    session.on('streamCreated', function (event) {
        session.subscribe(event.stream, 'subscriber', {
            insertMode: 'append',
            width: '100%',
            height: '100%'
        });
    });
}