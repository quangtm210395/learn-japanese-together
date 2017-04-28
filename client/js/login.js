$(document).ready(function () {
    var socket = io.connect();

    $("#register").click(function () {
        if ($('#password_register').val() !== $('#verify_password').val()) {
            toastr.error('Mật khẩu không trùng khớp');
        } else {
            $.post('/api/user/register',
                {
                    username: $('#username_register').val(),
                    password: $('#password_register').val(),
                    name: $('#full_name').val(),
                    email: $('#email').val(),
                    gender: $('#gender').val(),
                    dob: $('#dob').val()
                },
                function (data, status) {
                    if (!data.status) {
                        if (data.message.length) {
                            toastr.error(data.message);
                        }
                        else {
                            console.log(data.messagesss);
                            toastr.error('Đăng kí thất bại');
                        }
                    } else {
                        $('#myModal').modal('hide');
                        toastr.success('Đăng kí thành công');
                    }
                })
        }
    });
    $("#login").click(function () {
        $.post('/api/user/login',
            {
                username: $('#username_login').val(),
                password: $('#password_login').val(),
            },
            function (data, status) {
                if (!data.status) {
                    if (data.message.length) {
                        toastr.error(data.message);
                    }
                    else {
                        toastr.error('Đăng nhập thất bại');
                    }
                } else {
                    $('#myModal').modal('hide');
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setStatusLoginHtml();
                    toastr.success('Đăng nhập thành công');
                }
            })
    });

    var sourceUsersStatus = $("#users-status-template").html();
    var usersStatusTemplate = Handlebars.compile(sourceUsersStatus);
    socket.on("update status users", function (data) {
        var userLogin = JSON.parse(localStorage.getItem('user'));
        if (userLogin) {
            data.users.forEach(function (user, index) {
                if (user.username === userLogin.username) {
                    data.users.splice(index, 1);
                    console.log(data.users);
                }
            });
        }

        var listUser = usersStatusTemplate(data);
        $('.users-status').html(listUser);
    });

    var sourceStatusLogin = $("#status-login-template").html();
    var statusLoginTemplate = Handlebars.compile(sourceStatusLogin);
    setStatusLoginHtml();

    function setStatusLoginHtml() {
        var dataStorage = {
            token: localStorage.getItem('token'),
            user: JSON.parse(localStorage.getItem('user'))
        };

        if (dataStorage.user) {
            socket.emit("login", {username: dataStorage.user.username});
        }

        var loginStatus = statusLoginTemplate(dataStorage);
        $('#status-login').html(loginStatus);


        $('#click-register').click(function () {
            $('#tab-signIn').removeClass('active');
            $('#signIn').removeClass('active');
            $('#tab-signUp').addClass('active');
            $('#signUp').addClass('active');
        });

        $('#click-login').click(function () {
            $('#tab-signIn').addClass('active');
            $('#signIn').addClass('active');
            $('#tab-signUp').removeClass('active');
            $('#signUp').removeClass('active');
        });

        $('#click-logout').click(function () {
            console.log("click");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            socket.emit('logout');
            setStatusLoginHtml();
        });
    }
});

