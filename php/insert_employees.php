<?php
 include 'db_head.php';

 $employee_name = test_input($_GET['employee_name']);
$phone = test_input($_GET['phone']);
$alt_phone = test_input($_GET['alt_phone']);
$aadhar = test_input($_GET['aadhar']);
$voter_id = test_input($_GET['voter_id']);
$address = test_input($_GET['address']);
$location_url = test_input($_GET['location_url']);
$employee_login = test_input($_GET['employee_login']);
$employee_password = test_input($_GET['employee_password']);
$created_at = test_input($_GET['created_at']);
$emp_salary = test_input($_GET['emp_salary']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO employees ( employee_name,phone,alt_phone,aadhar,voter_id,address,location_url,employee_login,employee_password,created_at,emp_salary) VALUES ($employee_name,$phone,$alt_phone,$aadhar,$voter_id,$address,$location_url,$employee_login,$employee_password,$created_at,$emp_salary)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


