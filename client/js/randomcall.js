var socket;
var dataTempplate = {};
var sourceSubcriber;
var subcriberTemplate;

$(document).ready(function () {
    socket = io.connect();
    var peer_opponent;
    dataTempplate.isSearch = true;
    sourceSubcriber = $("#template-subcriber").html();
    subcriberTemplate = Handlebars.compile(sourceSubcriber);
    var subcriberHtml = subcriberTemplate(dataTempplate);
    $('#subscriber').html(subcriberHtml);

    socket.emit('find peer', {id: peer_id});
    socket.on('peer opponent', function (data) {
        dataTempplate.isSearch = false;
        dataTempplate.isConnect = true;
        var subcriberHtml = subcriberTemplate(dataTempplate);
        $('#subscriber').html(subcriberHtml);
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
    var uPublisher = JSON.parse(localStorage.getItem('user'));
    // Subscribe to a newly created stream

    // Connect to the session
    session.connect(token, function (error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (!error) {
            var publisher = OT.initPublisher('publisher', {
                name: uPublisher.name,
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
        if (dataTempplate.isDisconnect){
            session.disconnect();
        }
        $('.container-bg').hide();
        var subscriber = session.subscribe(event.stream, 'subscriber', {
            insertMode: 'append',
            fitMode: "contain",
            width: '100%',
            height: '100%'
        });
    });

    session.on('connectionDestroyed', function (event) {
        console.log("disconnect");
        $('.container-bg').show();
        dataTempplate.isDisconnect = true;
        socket.disconnect();
        var subcriberHtml = subcriberTemplate(dataTempplate);
        $('#subscriber').html(subcriberHtml);
    })
}

function closeWindow() {
    console.log("close");
    window.close();
}