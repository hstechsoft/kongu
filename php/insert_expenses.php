
<?php
 include 'db_head.php';

$exp_arr = json_decode($_POST['exp_arr'], true);
$exp_emp_id =($_POST['emp_id']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


foreach($exp_arr as $exp){
    $exp_des =test_input($exp['exp_des']);
    $exp_cat =test_input($exp['exp_cat']);
    $exp_amount =test_input($exp['exp_amount']);
    $exp_date =test_input($exp['exp_date']);
  

$sql = "INSERT  INTO  expense (exp_des,exp_cat,exp_amount,exp_date,exp_emp_id)
 VALUES ($exp_des,$exp_cat,$exp_amount,$exp_date,$exp_emp_id)";
  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  
}

  echo "ok";

$conn->close();

 ?>





