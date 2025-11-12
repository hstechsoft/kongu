<?php
 include 'db_head.php';

 $paid_date = test_input($_GET['paid_date']);
$emp_id = test_input($_GET['emp_id']);
$paid_amount = test_input($_GET['paid_amount']);
$pay_mode = test_input($_GET['pay_mode']);
$paid_by = test_input($_GET['paid_by']);
$paid_id = test_input($_GET['paid_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "DELETE  FROM expense_payment WHERE paid_id  =  $paid_id ";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


