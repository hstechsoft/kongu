<?php
include "db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $member_id    = intval($_POST["member_id"]);
    $is_paid      = isset($_POST["is_paid"]) ? 1 : 0;
    $paid_date    = $_POST["paid_date"];
    $paid_amount  = $is_paid ? floatval($_POST["paid_amount"]) : 0;
    $payment_mode = $is_paid ? $_POST["payment_mode"] : null;

    
    $res = $conn->query("SELECT amount, dc_amount, pending_amount FROM members WHERE id = $member_id");
    if (!$res || $res->num_rows === 0) {
        echo json_encode(["success" => false, "error" => "Member not found"]);
        exit;
    }
    $member = $res->fetch_assoc();

    $current_pending = floatval($member["pending_amount"]);
    $total_due       = floatval($member["amount"]) + floatval($member["dc_amount"]);

    
    $new_pending = $current_pending - $paid_amount;
    if ($new_pending < 0) $new_pending = 0;

    
    $stmt = $conn->prepare("
        INSERT INTO memberspayment (member_id, paid_date, is_paid, paid_amount, payment_mode, pending_amount) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("isidsd", $member_id, $paid_date, $is_paid, $paid_amount, $payment_mode, $new_pending);

    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "error" => $stmt->error]);
        exit;
    }

    
    $update = $conn->prepare("UPDATE members SET pending_amount = ? WHERE id = ?");
    $update->bind_param("di", $new_pending, $member_id);
    $update->execute();

    echo json_encode(["success" => true, "new_pending" => $new_pending]);
    exit;
}

echo json_encode(["success" => false, "error" => "Invalid request"]);
