const express = require('express');
const config = require('./configs');
const mongoose = require('mongoose');
const fs = require('fs');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const socketio = require('./socketio')(io);
const https = require('https');
const ejs = require('ejs');
var OpenTok = require('opentok');
var opentok = new OpenTok(config.apiKey, config.apiSecret);

var privateKey  = fs.readFileSync('server/fakekeys/server.key', 'utf8');
var certificate = fs.readFileSync('server/fakekeys/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

const httpsServer = https.Server(credentials, app);

config.settingExpress(app);

app.use('/',express.static('./client'));
console.log(__dirname);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('ejs', ejs.renderFile);

const routes = require('./routes')(app);

mongoose.connect(config.mongoUrl, {server: {reconnectTries: Number.MAX_VALUE}});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Mongodb connected at localhost/learn-jp')
});

const port = config.port;
const httpsPort = config.httpsPort;

var sessionId;

// opentok.createSession(function(err, session) {
//     if (err) return console.log(err);
//     sessionId = session.sessionId;
// });
//
// app.get('/api/videocall', function (req, res) {
//     var token = opentok.generateToken(sessionId);
//     console.log(token);
//     res.json({
//         apiKey: config.apiKey,
//         sessionId: sessionId,
//         token : token
//     });
// });
//
// app.get('/videocall1',function (req, res) {
//     res.render('videocall.ejs');
// });

server.listen(port, () => {
    console.log(`Server is running at localhost:${port}`);
});

httpsServer.listen(httpsPort, () => {
    console.log(`Https server is running at localhost:${httpsPort}`);
});



