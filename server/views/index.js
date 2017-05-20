/**
 * Created by phanmduong on 5/17/17.
 */
var express = require('express');

var router = express.Router();
var ViewController = require('./view.controller');

router.get('/videocall', ViewController.videocall);

module.exports = router;