<?php
$host = "srv1002.hstgr.io";
$user = "u333142350_kongufinance";
$pass = "W&n7tE&#Gm[H?k64";
$db   = "u333142350_kongufinace";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) die("DB Connection failed: " . $conn->connect_error);

header('Content-Type: application/json');

// ===== GET EMPLOYEES =====
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $result = $conn->query("SELECT * FROM employees");
    $employees = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) $employees[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $employees]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $action = $_POST['action'] ?? 'create';

    // ===== DELETE =====
    if ($action === 'delete') {
        $id = intval($_POST['id'] ?? 0);
        if ($id <= 0) exit(json_encode(["status" => "error", "message" => "Invalid ID"]));
        $stmt = $conn->prepare("DELETE FROM employees WHERE id=?");
        $stmt->bind_param("i", $id);
        $stmt->execute() ? exit(json_encode(["status" => "success", "message" => "Employee Deleted Successfully"])) : exit(json_encode(["status" => "error", "message" => $stmt->error]));
        $stmt->close();
    }

    // ===== UPDATE =====
    if ($action === 'update') {
        $id = $_POST['employee_id'] ?? '';
        $employee_name = $_POST['employee_name'] ?? '';
        $employee_login = $_POST['employee_login'] ?? '';

        $phone = $_POST['phone'] ?? '';
        $alt_phone = $_POST['alt_phone'] ?? '';
        $aadhar = $_POST['aadhar'] ?? '';
        $voter_id = $_POST['voter_id'] ?? '';
        $address = $_POST['address'] ?? '';
        $location_url = $_POST['location_url'] ?? '';
        
        if (empty($id) || empty($employee_name) || empty($employee_login) || empty($phone) || empty($alt_phone) || empty($aadhar) || empty($voter_id) || empty($address) || empty($location_url))  exit(json_encode(["status" => "error", "message" => "Required fields missing"]));

        $employee_password = $_POST['employee_password'] ?? '';


        if (!empty($employee_password)) {
            $password_hashed = password_hash($employee_password, PASSWORD_BCRYPT);
            $stmt = $conn->prepare("UPDATE employees SET employee_name=?, phone=?, alt_phone=?, aadhar=?, voter_id=?, address=?, location_url=?, employee_login=?, employee_password=? WHERE id=?");
            $stmt->bind_param("sssssssssi", $employee_name, $phone, $alt_phone, $aadhar, $voter_id, $address, $location_url, $employee_login, $password_hashed, $id);
        } else {
            $stmt = $conn->prepare("UPDATE employees SET employee_name=?, phone=?, alt_phone=?, aadhar=?, voter_id=?, address=?, location_url=?, employee_login=? WHERE id=?");
            $stmt->bind_param("ssssssssi", $employee_name, $phone, $alt_phone, $aadhar, $voter_id, $address, $location_url, $employee_login, $id);
        }

        $stmt->execute() ? exit(json_encode(["status" => "success", "message" => "Employee Updated Successfully"])) : exit(json_encode(["status" => "error", "message" => $stmt->error]));
        $stmt->close();
    }

    // ===== CREATE =====
    if ($action === 'create') {
        $employee_name = $_POST['employee_name'] ?? '';
        $employee_login = $_POST['employee_login'] ?? '';
        $employee_password = $_POST['employee_password'] ?? '';
        $phone = $_POST['phone'] ?? '';
        $alt_phone = $_POST['alt_phone'] ?? '';
        $aadhar = $_POST['aadhar'] ?? '';
        $voter_id = $_POST['voter_id'] ?? '';
        $address = $_POST['address'] ?? '';
        $location_url = $_POST['location_url'] ?? '';
        $password_hashed = password_hash($employee_password, PASSWORD_BCRYPT);

        if (empty($employee_name) || empty($employee_login) || empty($employee_password) || empty($phone) || empty($alt_phone) || empty($aadhar) || empty($voter_id) || empty($address) || empty($location_url)) exit(json_encode(["status" => "error", "message" => "Required fields missing"]));

     
      

        $stmt = $conn->prepare("INSERT INTO employees (employee_name, phone, alt_phone, aadhar, voter_id, address, location_url, employee_login, employee_password) VALUES (?,?,?,?,?,?,?,?,?)");
        $stmt->bind_param("sssssssss", $employee_name, $phone, $alt_phone, $aadhar, $voter_id, $address, $location_url, $employee_login, $password_hashed);
        $stmt->execute() ? exit(json_encode(["status" => "success", "message" => "Employee Created Successfully"])) : exit(json_encode(["status" => "error", "message" => $stmt->error]));
        $stmt->close();
    }
}


$conn->close();
