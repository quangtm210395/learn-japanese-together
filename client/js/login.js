var socket;
socket = io.connect();

setupAjax();

$.get('/api/user/login/check-login', function (data, status) {
    console.log(data);
    if (!data.status || !data.result.login) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setupAjax()
    }
    setStatusLoginHtml();
});

$("#register").click(function () {
    registerAccount();
});

$("#login").click(function () {
    login($('#username_login').val(), $('#password_login').val());
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

function setStatusLoginHtml() {
    var dataStorage = {
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user'))
    };

    if (dataStorage.user) {
        socket.emit("login", {
            username: dataStorage.user.username,
            id: dataStorage.user._id
        });
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
        $("#chatTabs").children().remove();
        $.ajaxSetup({headers: {"token": null}});
        setStatusLoginHtml();
    });
}

function pressEnterRegister(event) {
    if (event.keyCode == 13) registerAccount();
}

function pressEnterLogin(event) {
    if (event.keyCode == 13) login($('#username_login').val(), $('#password_login').val());
}

function registerAccount() {
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
                        console.log(data.message);
                        toastr.error('Đăng kí thất bại');
                    }
                } else {
                    $('#myModal').modal('hide');
                    toastr.success('Đăng kí thành công');
                    login($('#username_register').val(), $('#password_register').val())

                }
            })
    }
}

function login(username, password) {
    $.post('/api/user/login',
        {
            username: username,
            password: password,
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
                $('#loginModal').modal('hide');
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setStatusLoginHtml();
                toastr.success('Đăng nhập thành công');
                $.ajaxSetup({headers: {"token": localStorage.getItem("token")}});
            }
        })
}

function setupAjax() {
    $.ajaxSetup({
        headers: {
            "token": localStorage.getItem("token")
        }
    });
}

