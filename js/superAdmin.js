$(function () {

    $("#togglePassword").on("click", function () {
        let passwordField = $("#password");
        let type = passwordField.attr("type") === "password" ? "text" : "password";
        passwordField.attr("type", type);

        $(this).toggleClass("fa-eye fa-eye-slash");
    });


    $("#loginForm").submit(function (e) {
        e.preventDefault();

console.log($(this).serialize());

        $.ajax({
            url: "php/superAdminLogin.php",
            type: "POST",
            data: $(this).serialize(),
            dataType: "json",
            success: function (res) {
                console.log(res);
                
                if (res.status === "error") {
                    Swal.fire({
                        icon: "error",
                        title: "Login Failed",
                        text: res.msg
                    });
                } else if (res.status === "success") {
                    Swal.fire({
                        icon: "success",
                        title: res.msg,
                        confirmButtonText: "OK"
                    }).then(() => {
                        window.location.href = "dashboard.php";
                    });
                }
            }
        });
    });

});