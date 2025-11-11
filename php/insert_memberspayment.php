<?php
 include 'db_head.php';

 $pay_details = ($_POST['pay_details']);
  $pay_details = json_decode($pay_details, true);

  function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

  foreach($pay_details as $detail) {
      $member_id = test_input($detail['member_id']);
      $paid_date = test_input($detail['paid_date']);
      $is_paid = test_input($detail['is_paid']);
      $paid_amount = test_input($detail['paid_amount']);
      $payment_mode = test_input($detail['payment_mode']);
      $pending_amount = 0;
  $dt = new DateTime('@' . ($detail['created_at'] / 1000));
  $dt->setTimezone(new DateTimeZone('Asia/Kolkata'));
  $created_at = "'" . $dt->format('Y-m-d H:i:s') . "'";

      $emp_id = test_input($detail['emp_id']); 


$sql = "INSERT INTO memberspayment ( member_id,paid_date,is_paid,paid_amount,payment_mode,pending_amount,emp_id,created_at) VALUES ($member_id,$paid_date,$is_paid,$paid_amount,$payment_mode,$pending_amount,$emp_id,$created_at)";

  if ($conn->query($sql) === TRUE) {

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  }


  echo "ok";
    

 
 



$conn->close();

 ?>


