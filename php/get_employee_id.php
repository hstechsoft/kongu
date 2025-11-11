<?php
 include 'db_head.php';

 
 $email = test_input($_GET['username']);
 $password = test_input($_GET['password']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT id as emp_id,	employee_name as emp_name,emp_role,emp_approve,emp_email FROM employees where employee_login = $email and employee_password = $password and emp_approve = 'yes'";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "0 result";
}
$conn->close();

 ?>


