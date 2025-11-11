<?php
header("Content-Type: application/json");
include "db.php"; // adjust path if needed

// Force mysqli to throw errors
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    if (!isset($_GET['id'])) {
        echo json_encode(["error" => "Missing member id"]);
        exit;
    }

    $id = intval($_GET['id']);

    $sql = "SELECT 
                m.id, 
                m.user_name, 
                m.phone, 
                m.nominee_name, 
                m.amount, 
                m.dc_amount AS dc_charge,
                m.pending_amount
            FROM members m
            WHERE m.id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode($row);
    } else {
        echo json_encode(["error" => "Member not found"]);
    }
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
