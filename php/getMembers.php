<?php
require_once "db.php";

header('Content-Type: application/json'); // make sure output is JSON only

if (!isset($_GET['groupid'])) {
    http_response_code(400);
    echo json_encode(["error" => "Group ID missing"]);
    exit;
}

$groupid = intval($_GET['groupid']);

$sql = "SELECT members.id, user_name, nominee_name, phone,phone2, leader,ifnull(sum(memberspayment.paid_amount),0) as total_paid,paid_date 
        FROM members left join memberspayment on members.id = memberspayment.member_id
        WHERE teamid = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "SQL prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("i", $groupid);
$stmt->execute();
$result = $stmt->get_result();

$members = [];
while ($row = $result->fetch_assoc()) {
    $members[] = $row;
}

echo json_encode($members);
