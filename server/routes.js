module.exports = (app) => {
    app.use('/api/dictionary', require('./api/dictionary'));
    app.use('/api/user', require('./apis/user/index.js'));
}