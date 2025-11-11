<?php
 include 'db_head.php';

 $user_name = test_input($_GET['user_name']);
$phone = test_input($_GET['phone']);
$phone2 = test_input($_GET['phone2']);
$aadhar = test_input($_GET['aadhar']);
$city = test_input($_GET['city']);
$district = test_input($_GET['district']);
$pincode = test_input($_GET['pincode']);
$location_url = test_input($_GET['location_url']);
$leader = ($_GET['leader']);
$nominee_name = test_input($_GET['nominee_name']);
$nominee_phone = test_input($_GET['nominee_phone']);
$nominee_phone2 = test_input($_GET['nominee_phone2']);
$nominee_aadhar = test_input($_GET['nominee_aadhar']);
$nominee_relationship = test_input($_GET['nominee_relationship']);
$nominee_city = test_input($_GET['nominee_city']);
$nominee_district = test_input($_GET['nominee_district']);
$nominee_pincode = test_input($_GET['nominee_pincode']);
$nominee_location_url = test_input($_GET['nominee_location_url']);
$teamid = ($_GET['teamid']);
$amount = test_input($_GET['amount']);
$dc_amount = test_input($_GET['dc_amount']);
$after_dc_factor_amount = test_input($_GET['after_dc_factor_amount']);
$interest = test_input($_GET['interest']);
$totalAmount = test_input($_GET['totalAmount']);
$photo = test_input($_GET['photo']);
$verification = test_input($_GET['verification']);
$nominee_verification = test_input($_GET['nominee_verification']);
$pending_amount = test_input($_GET['pending_amount']);
$is_addr_differ = test_input($_GET['is_addr_differ']);
$start_date = test_input($_GET['start_date']);
$id = ($_GET['id']);
$emi = ($_GET['emi']);
$time_period = ($_GET['time_period']);




 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

if($photo == "''")
{
   $sql =  "UPDATE  members SET user_name =  $user_name,phone =  $phone,phone2 =  $phone2,aadhar =  $aadhar,city =  $city,district =  $district,pincode =  $pincode,location_url =  $location_url,leader =  $leader,nominee_name =  $nominee_name,nominee_phone =  $nominee_phone,nominee_phone2 =  $nominee_phone2,nominee_aadhar =  $nominee_aadhar,nominee_relationship =  $nominee_relationship,nominee_city =  $nominee_city,nominee_district =  $nominee_district,nominee_pincode =  $nominee_pincode,nominee_location_url =  $nominee_location_url,teamid =  '$teamid',amount =  $amount,dc_amount =  $dc_amount,after_dc_factor_amount =  $after_dc_factor_amount,interest =  $interest,totalAmount =  $totalAmount,verification =  $verification,nominee_verification =  $nominee_verification,pending_amount =  $pending_amount,is_addr_differ =  $is_addr_differ,start_date =  $start_date WHERE id =  '$id'";
}
else
 $sql =  "UPDATE  members SET user_name =  $user_name,phone =  $phone,phone2 =  $phone2,aadhar =  $aadhar,city =  $city,district =  $district,pincode =  $pincode,location_url =  $location_url,leader =  $leader,nominee_name =  $nominee_name,nominee_phone =  $nominee_phone,nominee_phone2 =  $nominee_phone2,nominee_aadhar =  $nominee_aadhar,nominee_relationship =  $nominee_relationship,nominee_city =  $nominee_city,nominee_district =  $nominee_district,nominee_pincode =  $nominee_pincode,nominee_location_url =  $nominee_location_url,teamid =  '$teamid',amount =  $amount,dc_amount =  $dc_amount,after_dc_factor_amount =  $after_dc_factor_amount,interest =  $interest,totalAmount =  $totalAmount,photo =  $photo,verification =  $verification,nominee_verification =  $nominee_verification,pending_amount =  $pending_amount,is_addr_differ =  $is_addr_differ,start_date =  $start_date WHERE id =  '$id'";

  if ($conn->query($sql) === TRUE) {

     $sql_delete =  "DELETE  FROM finance_payment WHERE member_id =  $id";

  if ($conn->query($sql_delete) === TRUE) {
    $sql_procedure =  " CALL insert_dates($start_date, $time_period, $id , $teamid, $emi);";

  if ($conn->query($sql_procedure) === TRUE) {
   echo "ok";

   
  }
  
  else {
    echo "Error: " . $sql_procedure . "<br>" . $conn->error;
  }
  } else {
    echo "Error: " . $sql_delete . "<br>" . $conn->error;
  }





  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


