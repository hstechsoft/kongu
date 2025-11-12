<?php
 include 'db_head.php';

 $paid_amount = test_input($_GET['paid_amount']);
$dated = test_input($_GET['dated']);
$pay_mode = test_input($_GET['pay_mode']);
$ref_no = test_input($_GET['ref_no']);
$is_advance = test_input($_GET['is_advance']);
$emp_id = test_input($_GET['emp_id']);
$month = test_input($_GET['month']);
$paid_by = test_input($_GET['paid_by']);
$salary_year = test_input($_GET['salary_year']);
$salary_month = test_input($_GET['salary_month']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';"; // First query to set the time zone
$sql .= "INSERT INTO salary_payment ( paid_amount,dated,pay_mode,ref_no,is_advance,emp_id,month,paid_by,salary_year,salary_month) VALUES ($paid_amount,$dated,$pay_mode,$ref_no,$is_advance,$emp_id,$month,$paid_by,$salary_year,$salary_month)";

if ($conn->multi_query($sql) === TRUE) {
    echo "ok";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}


$conn->close();

 ?>


