<?php
session_start();

$conn = new mysqli("localhost", "u333142350_kongufinance", "W&n7tE&#Gm[H?k64", "u333142350_kongufinace");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $login_name = $_POST['employee_login'];
    $password   = $_POST['employee_password'];
echo $login_name;
echo $password;
    $stmt = $conn->prepare("SELECT employee_password FROM employees WHERE employee_login = ?");
    $stmt->bind_param("s", $login_name);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows == 0) {
        echo "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>
        </head>
        <body>
            <script>
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Login name incorrect'
                }).then(() => {
                    window.location.href = 'employeeLogin.html';
                });
            </script>
        </body>
        </html>";
        exit;
    } else {
        $stmt->bind_result($hashed_password);
        $stmt->fetch();

        if (password_verify($password, $hashed_password)) {
            $_SESSION['employee_login'] = $login_name;
            echo "
            <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>
        </head>
        <body>
            <script>
                    Swal.fire({
                        icon: 'success',
                        title: 'Successfully logged in',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        window.location.href = 'employeeCreation.html';
                    });
            </script>
        </body>
        </html>";
            exit;
        } else {
            echo "
            <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>
        </head>
        <body>
            <script>
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: 'Password incorrect'
                    }).then(() => {
                        window.location.href = 'employeeLogin.html';
                    });
            </script>
        </body>
        </html>";
            exit;
        }
    }
    $stmt->close();
}
$conn->close();
