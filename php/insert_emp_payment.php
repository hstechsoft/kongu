
<?php
 include 'db_head.php';

$emp_pay_arr = json_decode($_POST['emp_pay_arr'], true);
$emp_id =test_input($_POST['emp_id']);
$paid_date =test_input($_POST['paid_date']);
$received_by =test_input($_POST['received_by']);
$cash_remain =test_input($_POST['cash_remain']);



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
 $cash_id = 0;
$sql_insert = "SET time_zone = '+05:30';"; // First query to set the time zone
$sql_insert .= "INSERT INTO employee_cash (amount, dated,emp_id) VALUES ( $cash_remain, $paid_date,$emp_id)";
// 
if ($conn->multi_query($sql_insert) === TRUE) {
    $cash_id = $conn->insert_id;




 
} else {
    echo "Error: " . $sql_insert . "<br>" . $conn->error;
}


    foreach($emp_pay_arr as $emp_pay){
    $pay_mode =test_input($emp_pay['pay_mode']);
    $pay_amount =test_input($emp_pay['pay_amount']);
   
    $reference =test_input($emp_pay['reference']);
  

$sql = "INSERT INTO emp_payment (pay_mode, pay_amount, pay_date, emp_id, reference, received_by,cash_id) VALUES ( $pay_mode, $pay_amount,  $paid_date, $emp_id,   $reference, $received_by, $cash_id)";
  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  
}


 $sql_update =  "UPDATE memberspayment SET cash_id = ' WHERE emp_id = $emp_id and paid_date <= $paid_date and cash_id is null";

  if ($conn->query($sql_update) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql_update . "<br>" . $conn->error;
  }




$conn->close();

 ?>





