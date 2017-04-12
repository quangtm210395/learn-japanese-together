/**
 * Created by phanmduong on 15/03/2017.
 */
var express = require('express');

var router = express.Router();
var UserController = require('./user.controller');

router.post('/register', UserController.addUser);
router.post('/login', UserController.login);
router.get('/:username', UserController.getUser);

module.exports = router;