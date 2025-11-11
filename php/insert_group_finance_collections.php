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


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$sql = "SET time_zone = '+05:30';";
$sql .= "INSERT INTO group_finance_collections ( group_number,employee_id,collection_day,assemble_location,group_phone,time_period,group_location_url,dc_amount,dc_charge,dc_charge_calculation,ic_amount,ic_interest,ic_factor,start_date) VALUES ($group_number,$employee_id,$collection_day,$assemble_location,$group_phone,$time_period,$group_location_url,$dc_amount,$dc_charge,$dc_charge_calculation,$ic_amount,$ic_interest,$ic_factor,$start_date);";

if ($conn->multi_query($sql)) {
    do {
        if ($result = $conn->store_result()) {
            if ($result->num_rows > 0) {
                $rows = array();
                while ($r = $result->fetch_assoc()) {
                    $rows[] = $r;
                }
                echo json_encode($rows);
            } else {
                echo "0 result";
            }
            $result->free();
        }
    } while ($conn->more_results() && $conn->next_result());
} else {
    echo "Error: " . $conn->error;
}
$conn->close();



 ?>


