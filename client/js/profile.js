
    setupAjax();
    setUserInfo();

    function setupAjax() {
        $.ajaxSetup({
            headers: {
                "token": localStorage.getItem("token")
            }
        });
    }

    function setUserInfo() {
        var user = JSON.parse(localStorage.getItem("user"));
        console.log(user);
        $("#profile-username").val(user.username);
        $("#profile-fullname").val(user.name);
        $("#profile-email").val(user.email);
        $("#profile-dob").val(user.dob);
        // $('#profile-dob').datepicker('setDate', new Date());
        $("#profile-gender").val(user.gender);
        $("#profile-avatar-url").val(user.imgUrl);
    }

    $("#update").click(function () {
        if ($('#profile-form').valid()) {
            updateUser();
        }
    });

    function updateUser() {
        $.post('/api/user/update',
            {
                password: $('#profile-password').val(),
                name: $('#profile-fullname').val(),
                email: $('#profile-email').val(),
                gender: $('#profile-gender').val(),
                dob: $('#profile-dob').val(),
                imgUrl: $('#profile-avatar-url').val()
            },
            function (data, status) {
                if (!data.status) {
                    if (data.message.length) {
                        toastr.error(data.message);
                    }
                    else {
                        console.log(data.message);
                        toastr.error('Cập nhật thất bại');
                    }
                } else {
                    toastr.success('Đăng kí thành công');
                }
            })
    };

    // $('#profile-form').validate({
    //     rules: {
    //         profile-email: {
    //             required: true,
    //             email: true
    //         },
    //         profile-fullname: {
    //             required: true
    //         },
    //         profile-dob: {
    //             required: true,
    //             date: true
    //         },
    //         profile-gender: {
    //             required: true
    //         }
    //     },
    //     messages: {
    //         profile-email: "Vui lòng nhập email",
    //         profile-fullname: "Vui lòng nhập họ và tên",
    //         profile-dob: "Vui lòng nhập ngày sinh",
    //         profile-gender: "Vui lòng chọn giới tính"
    //     }
    // });
