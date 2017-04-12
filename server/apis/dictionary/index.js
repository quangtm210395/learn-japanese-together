const express = require('express');
var controller = require('./dictionary.controller');

var router = express.Router();

router.get('/search/:word', controller.search);

module.exports = router;