var apiKey = '45828062';
var sessionId = '2_MX40NTgyODA2Mn5-MTQ5NDY4MzUyMjgxMn52OUFRSEYwdDB6YTg3eXJZdU16MlJQaUl-UH4';
var token = 'T1==cGFydG5lcl9pZD00NTgyODA2MiZzaWc9NDE5MjM3OWEyODFkNDI2ZDY3OTBjY2I2OWQ5NDc1NGNkNDkwNDZmMzpzZXNzaW9uX2lkPTJfTVg0ME5UZ3lPREEyTW41LU1UUTVORFk0TXpVeU1qZ3hNbjUyT1VGUlNFWXdkREI2WVRnM2VYSlpkVTE2TWxKUWFVbC1VSDQmY3JlYXRlX3RpbWU9MTQ5NDY4NDc4NSZub25jZT0wLjc3OTU3MTk0NzgwMDUxMzYmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ5NDc3MTE4NQ==';

$(document).ready(function() {
    // (optional) add server code here
    $.get('/videocall', function (data, status) {
        apiKey = data.apiKey;
        sessionId = data.sessionId;
        token = data.token;
        console.log(data);
        initializeSession();
    });
});

function initializeSession() {
    var session = OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream

    // Connect to the session
    session.connect(token, function(error) {
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

    session.on('streamCreated', function(event) {
        session.subscribe(event.stream, 'subscriber', {
            insertMode: 'append',
            width: '100%',
            height: '100%'
        });
    });
}