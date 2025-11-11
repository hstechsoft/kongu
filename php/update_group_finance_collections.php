<?php
 include 'db_head.php';

 $group_number = test_input($_GET['group_number']);
$employee_id = test_input($_GET['employee_id']);
$collection_day = test_input($_GET['collection_day']);
$assemble_location = test_input($_GET['assemble_location']);
$group_phone = test_input($_GET['group_phone']);
$time_period = test_input($_GET['time_period']);
$group_location_url = test_input($_GET['group_location_url']);
$dc_amount = test_input($_GET['dc_amount']);
$dc_charge = test_input($_GET['dc_charge']);
$dc_charge_calculation = test_input($_GET['dc_charge_calculation']);

$ic_amount = test_input($_GET['ic_amount']);
$ic_interest = test_input($_GET['ic_interest']);
$ic_factor = test_input($_GET['ic_factor']);
$start_date = test_input($_GET['start_date']);
$id = test_input($_GET['id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  group_finance_collections SET group_number =  $group_number,employee_id =  $employee_id,collection_day =  $collection_day,assemble_location =  $assemble_location,group_phone =  $group_phone,time_period =  $time_period,group_location_url =  $group_location_url,dc_amount =  $dc_amount,dc_charge =  $dc_charge,dc_charge_calculation =  $dc_charge_calculation,ic_amount =  $ic_amount,ic_interest =  $ic_interest,ic_factor =  $ic_factor,start_date = $start_date WHERE id =  $id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


