const express = require('express');
const config = require('./configs');
const mongoose = require('mongoose');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const socketio = require('./socketio')(io);

config.settingExpress(app);

app.use('/',express.static('client'));
const routes = require('./routes')(app);

mongoose.connect(config.mongoUrl, {server: {reconnectTries: Number.MAX_VALUE}});


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Mongodb connected at localhost/learn-jp')
});

const port = config.port;

server.listen(port, () => {
    console.log(`Server is running at localhost:${port}`);
});