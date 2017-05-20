/**
 * Created by phanmduong on 15/03/2017.
 */

var User = require('./user.model');
var jwt = require('jsonwebtoken');
var config = require('../../configs/index');

module.exports = {

    addUser: function (req, res) {
        var newUser = new User(req.body);
        User.findOne({username: req.body.username}, {_id: 0, __v: 0})
            .then(function (user) {
                if (user) {
                    res.json({status: false, message: "Tài khoản đã tồn tại"});
                } else {
                    newUser.save(function (err, user) {
                        if (err) {
                            res.json({status: false, message: err});
                        } else {
                            res.json({status: true, message: "Đăng kí thành công"});
                        }
                    })
                }
            }, function (err) {
                res.json({status: false, message: err});
            });
    },

    getUser: function (req, res) {
        User.findOne({username: req.params.username}, '-__v -salt -password')
            .exec(function (err, user) {
                if (err) res.json({status: false, message: err});
                if (user) {
                    res.json({status: true, data: user});
                } else {
                    res.json({status: false, message: "Tài khoản chưa tồn tại"});
                }
            });

    },

    login: function (req, res) {
        User.findOne({username: req.body.username})
            .exec(function (err, user) {
                if (err) {
                    res.json({status: false, message: user});
                }
                if (!user) res.json({status: false, message: "This account is not register"});
                else {
                    if (!user.authenticate(req.body.password)) {
                        res.json({status: false, message: "Password incorrect"});
                    }
                    else {
                        var token = jwt.sign({
                            data: user
                        }, config.secret, { expiresIn: '' });
                        user.password = undefined;
                        user.salt = undefined;
                        user._v = undefined;
                        res.json({status: true, message: "Login successful.", token: token, user: user});
                    }
                }

            })
    },

    getAll: function (callback) {
        User.find().select("_id username name").lean()
            .exec(function (err, user) {
                return callback(user);
            });
    },

    getUserCallback: function (id, callback) {
        User.findOne({_id: id}, '-__v -salt -password')
            .exec(function (err, user) {
                return callback(user);
            });

    }

};