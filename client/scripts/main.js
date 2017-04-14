$("#register").click(function () {
    if ($('#password').val() !== $('#verify_password').val()) {
        toastr.error('Mật khẩu không trùng khớp');
    } else {
        $.post('/api/user/register',
            {
                username: $('#username').val(),
                password: $('#password').val(),
                name: $('#full_name').val(),
                age: $('#age').val(),
                email: $('#email').val(),
                gender: $('#gender').val()
            },
            function (data, status) {
            console.log(data);
                if (!data.status) {
                    if (data.message.length < 20) {
                        toastr.error(data.message);
                    }
                    else {
                        toastr.error('Đăng kí thất bại');
                    }
                } else {
                    toastr.success('Đăng kí thành công');
                }
            })
    }
});
$("#login").click(function () {
    $.post('/api/user/login',
        {
            username: $('#username').val(),
            password: $('#password').val(),
        },
        function (data, status) {
            if (!data.status) {
                if (data.message.length < 20) {
                    toastr.error(data.message);
                }
                else {
                    toastr.error('Đăng nhập thất bại');
                }
            } else {
                toastr.success('Đăng nhập thành công');
            }
        })
});

