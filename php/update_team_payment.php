<?php
 include 'db_head.php';

 $emp_id = test_input($_GET['emp_id']);
$amount = test_input($_GET['amount']);
$dated = test_input($_GET['dated']);
$pay_mode = test_input($_GET['pay_mode']);
$ref_no = test_input($_GET['ref_no']);
$paid_by = test_input($_GET['paid_by']);
$team_pay = test_input($_GET['team_pay']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';"; // First query to set the time zone
$sql .= "UPDATE  team_payment SET emp_id =  $emp_id,amount =  $amount,dated =  $dated,pay_mode =  $pay_mode,ref_no =  $ref_no,paid_by =  $paid_by WHERE team_pay =  $team_pay";

if ($conn->multi_query($sql) === TRUE) {
    echo "ok";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}


$conn->close();


 ?>


