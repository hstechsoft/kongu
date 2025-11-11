<?php
$host = "localhost";
$user = "u333142350_kongufinance";
$pass = "W&n7tE&#Gm[H?k64";
$db   = "u333142350_kongufinace";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}



// // =================== GET ALL GROUPS ===================
// if ($_SERVER["REQUEST_METHOD"] == "GET") {
//     $result = $conn->query("
//         SELECT g.*, e.employee_name 
//         FROM group_finance_collections g 
//         LEFT JOIN employees e ON g.employee_id = e.id
//     ");
//     $groups = [];
//     while ($row = $result->fetch_assoc()) {
//         $groups[] = $row;
//     }
//     echo json_encode($groups);
//     exit;
// }

// =================== POST ACTIONS ===================
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $action = $_POST['action'] ?? 'create';

    // DELETE GROUP
    if ($action === 'delete') {
        $id = intval($_POST['id'] ?? 0);
        if ($id <= 0) {
            echo json_encode(["status" => "error", "message" => "Invalid group ID"]);
            exit;
        }
        $stmt = $conn->prepare("DELETE FROM group_finance_collections WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Group deleted successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => $stmt->error]);
        }
        $stmt->close();
        exit;
    }

    // CREATE OR UPDATE GROUP
    $group_id           = $_POST['group_id'] ?? '';
    $group_number       = $_POST['group_number'] ?? '';
    $employee_id        = $_POST['employee'] ?? '';
    $collection_day     = $_POST['collection_day'] ?? '';
    $assemble_location  = $_POST['assemble_location'] ?? '';
    $group_phone        = $_POST['group_phone'] ?? '';
    $time_period        = $_POST['time_period'] ?? '';
    $group_location_url = $_POST['group_location_url'] ?? '';
    $dc_amount          = $_POST['dc_amount'] ?? 0;
    $dc_charge          = $_POST['dc_charge'] ?? 0;
    $dc_calculation     = ($dc_amount > 0) ? $dc_charge / $dc_amount : 0;

    // Validate required fields
    if (empty($group_number) || empty($employee_id)) {
        echo json_encode(["status" => "error", "message" => "Required fields missing"]);
        exit;
    }

    if ($action === 'update' && !empty($group_id)) {
        // UPDATE
        $stmt = $conn->prepare("
            UPDATE group_finance_collections SET
                group_number = ?, employee_id = ?, collection_day = ?, assemble_location = ?, 
                group_phone = ?, time_period = ?, group_location_url = ?, dc_amount = ?, dc_charge = ?, dc_charge_calculation = ?
            WHERE id = ?
        ");
        $stmt->bind_param(
            "sisssssdddi",
            $group_number,
            $employee_id,
            $collection_day,
            $assemble_location,
            $group_phone,
            $time_period,
            $group_location_url,
            $dc_amount,
            $dc_charge,
            $dc_calculation,
            $group_id
        );
        $msg = "Group updated successfully";
    } else {
        // CREATE
        $stmt = $conn->prepare("
            INSERT INTO group_finance_collections
            (group_number, employee_id, collection_day, assemble_location, group_phone, time_period, group_location_url, dc_amount, dc_charge, dc_charge_calculation)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->bind_param(
            "sisssssddd",
            $group_number,
            $employee_id,
            $collection_day,
            $assemble_location,
            $group_phone,
            $time_period,
            $group_location_url,
            $dc_amount,
            $dc_charge,
            $dc_calculation
        );
        $msg = "Group created successfully";
    }

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => $msg]);
    } else {
        echo json_encode(["status" => "error", "message" => $stmt->error]);
    }
    $stmt->close();
    exit;
}

$conn->close();
