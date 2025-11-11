<?php
require_once "db.php";

// fetch groups with leader name and location
$sql = "SELECT g.id, g.group_number, g.group_location_url AS location,
               m.user_name AS leader_name
        FROM group_finance_collections g
        LEFT JOIN members m 
            ON g.id = m.teamid 
           AND m.leader = 1";

$result = $conn->query($sql);
$groups = [];

while ($row = $result->fetch_assoc()) {
    $groups[] = $row;
}

header('Content-Type: application/json');
echo json_encode($groups);
