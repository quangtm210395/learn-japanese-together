module.exports = (app) => {
    app.use('/api/dictionary', require('./apis/dictionary'));
    app.use('/api/user', require('./apis/user/index.js'));
}