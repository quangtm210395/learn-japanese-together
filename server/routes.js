module.exports = (app) => {
    app.use('/api/dictionary', require('./apis/dictionary'));
    app.use('/api/user', require('./apis/user/index.js'));
    app.use('/api/feedback', require('./apis/feedback/index.js'));
}
