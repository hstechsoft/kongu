<?php
$host = "srv1002.hstgr.io";
$user = "u333142350_kongufinance";
$pass = "W&n7tE&#Gm[H?k64";
$db   = "u333142350_kongufinace";
 $username = trim($_GET['username']);
    $password = trim($_GET['password']);
echo "<div><ul class='list-group'><li class='list-group-item'>hi</li><li class='list-group-item'>hi</li></ul></div>";
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "INSERT INTO demo (id, emp_name, phone) VALUES (NULL, '', '')";


?>