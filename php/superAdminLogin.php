<?php
session_start();
$host = "srv1002.hstgr.io";
$user = "u333142350_kongufinance";
$pass = "W&n7tE&#Gm[H?k64";
$db   = "u333142350_kongufinace";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("DB Connection failed: " . $conn->connect_error);
}


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    $stmt = $conn->prepare("SELECT * FROM admin WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($res->num_rows == 0) {
        echo json_encode(["status" => "error", "msg" => "Invalid Username"]);
    } else {
        $row = $res->fetch_assoc();
        if (!password_verify($password, $row['password'])) {
            echo json_encode(["status" => "error", "msg" => "Incorrect Password"]);
        } else {
            $_SESSION['admin'] = $row['username'];
            echo json_encode(["status" => "success", "msg" => "Login Successful"]);
        }
    }
    exit;
}
