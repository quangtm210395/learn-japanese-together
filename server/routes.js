
module.exports = (app) => {
    app.use('/api/dictionary', require('./api/dictionary'));
}