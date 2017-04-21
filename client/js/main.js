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
                localStorage.setItem('token',data.token);
                toastr.success('Đăng nhập thành công');
            }
        })
});

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

