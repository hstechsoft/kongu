<?php
 include 'db_head.php';

 $paid_date = test_input($_GET['paid_date']);
$emp_id = test_input($_GET['emp_id']);
$paid_amount = test_input($_GET['paid_amount']);
$pay_mode = test_input($_GET['pay_mode']);
$paid_by = test_input($_GET['paid_by']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';"; // First query to set the time zone
$sql .= "INSERT INTO expense_payment ( paid_date,emp_id,paid_amount,pay_mode,paid_by) VALUES ($paid_date,$emp_id,$paid_amount,$pay_mode,$paid_by)";

if ($conn->multi_query($sql) === TRUE) {
    echo "ok";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}


$conn->close();



 ?>


