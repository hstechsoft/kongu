<?php
 include 'db_head.php';

 $emp_id = test_input($_GET['emp_id']);
$amount = test_input($_GET['amount']);
$dated = test_input($_GET['dated']);
$pay_mode = test_input($_GET['pay_mode']);
$ref_no = test_input($_GET['ref_no']);
$paid_by = test_input($_GET['paid_by']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';"; // First query to set the time zone
$sql .= "INSERT INTO team_payment ( emp_id,amount,dated,pay_mode,ref_no,paid_by) VALUES ($emp_id,$amount,$dated,$pay_mode,$ref_no,$paid_by)";

if ($conn->multi_query($sql) === TRUE) {
    echo "ok";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}


$conn->close();




 ?>


