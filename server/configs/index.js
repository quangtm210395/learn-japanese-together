const express = require('express');
const bodyParser = require('body-parser');

module.exports = {
    port : 6969,
    httpsPort: 8080,
    mongoUrl : 'mongodb://127.0.0.1/learn-jp',
    settingExpress : (app) => {
        app.use(bodyParser.urlencoded({ extended : false}));

        app.use(bodyParser.json());
    },
    secret: 'learn-jp'
}