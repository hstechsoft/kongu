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
$emp_salary = test_input($_GET['emp_salary']);


$id = test_input($_GET['id']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  employees SET employee_name =  $employee_name,phone =  $phone,alt_phone =  $alt_phone,aadhar =  $aadhar,voter_id =  $voter_id,address =  $address,location_url =  $location_url,employee_login =  $employee_login,employee_password =  $employee_password,emp_salary = $emp_salary WHERE id =  $id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


