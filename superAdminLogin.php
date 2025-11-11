<?php
session_start();
if (isset($_SESSION['admin'])) {
    header("Location: dashboard.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Admin Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="css/superAdmin.css">
</head>

<body>
    <div class="login-box">
        <h3 class="text-center mb-4">Admin Login</h3>
        <form id="loginForm" method="POST" action="">
            <div class="mb-3">
                <label class="form-label">Username</label>
                <input type="text" name="username" class="form-control" required>
            </div>
            <div class="mb-3 position-relative">
                <label class="form-label">Password</label>
                <input type="password" name="password" id="password" class="form-control" required>
                <i class="fa-solid fa-eye eye-icon" id="togglePassword"></i>
            </div>
            <button type="submit" class="btn btn-primary w-100">Login</button>
        </form>
    </div>

    <script src="js/superAdmin.js"></script>
</body>

</html>