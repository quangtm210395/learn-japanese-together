var express = require('express');

var router = express.Router();
var FeedbackController = require('./feedback.controller');
var Auth = require('../auth/auth.service');

router.post('/create', Auth.authentication(), FeedbackController.createFeedback);
router.get('/getAll', FeedbackController.getAllFeedback);

module.exports = router;
