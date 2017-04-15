const express = require('express');
var controller = require('./dictionary.controller');

var router = express.Router();

router.post('/search', controller.search);

module.exports = router;