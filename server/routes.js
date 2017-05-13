module.exports = (app) => {
    app.use('/api/dictionary', require('./apis/dictionary'));
    app.use('/api/user', require('./apis/user/index.js'));
    app.use('/api/feedback', require('./apis/feedback/index.js'));
    app.use('/api/conversation', require('./apis/conversation/index.js'));
    app.use('/api/message', require('./apis/message/index.js'));
}
