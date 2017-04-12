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
                    res.json({status: false, message: 'Username is exist'});
                } else {
                    newUser.save(function (err, user) {
                        if (err) {
                            res.json({status: false, message: err});
                        } else {
                            res.json({status: true, message: "Register successful"});
                        }
                    })
                }
            }, function (err) {
                res.json({status: false, message: err});
            });
    },

    getUser: function (req, res) {
        User.findOne({username: req.params.username}, '-_id -__v -salt -password')
            .populate({path: 'created_post', select: '-__v -created'})
            .exec(function (err, user) {
                if (err) res.json({status: false, message: err});
                if (user) {
                    res.json({status: true, data: user});
                } else {
                    res.json({status: false, message: 'Username doesn\'t exist'});
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
                        }, config.secret, { expiresIn: '60m' });
                        res.json({status: true, message: "Login successful", token: token});
                    }
                }

            })
    }
};