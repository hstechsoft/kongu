<?php
 include 'db_head.php';



 $exp_arr = json_decode($_POST['exp_arr'], true);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

foreach($exp_arr as $exp){

    $exp_id =test_input($exp['exp_id']);
    $exp_approve =test_input($exp['exp_approve']);


$sql = "UPDATE expense SET  exp_approve =  $exp_approve WHERE exp_id= $exp_id";
  if ( $conn->query($sql) === TRUE) {
  } 
   else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}
  echo "ok";
$conn->close();

 ?>


