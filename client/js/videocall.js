var socket;
$(document).ready(function () {
    socket = io.connect();
    setupAjax();
    var dataTempplate;
    var sourceSubcriber= $("#template-subcriber").html();
    var subcriberTemplate = Handlebars.compile(sourceSubcriber);
    $.get('/api/user/'+peer_id, function (data) {
        if (data.status){
            dataTempplate = data.data;
            var subcriberHtml = subcriberTemplate(dataTempplate);
            $('#subscriber').html(subcriberHtml);
        }
    })
    $.get('/api/user/login/check-login', function (data, status) {
        console.log(data);
        if (!data.status || !data.result.login) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setupAjax();
        }

        $.post('/api/videocall/room?peer_id=' + peer_id, function (data, status) {
            dataTempplate.isConnect = true;
            var subcriberHtml = subcriberTemplate(dataTempplate);
            $('#subscriber').html(subcriberHtml);
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