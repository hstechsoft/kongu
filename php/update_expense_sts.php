<?php
 include 'db_head.php';



 $exp_id_arr = json_decode($_POST['exp_id_arr'], true);
 $exp_approve = test_input($_POST['exp_approve']);



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

foreach($exp_id_arr as $exp){

    $exp_id =($exp);



$sql = "UPDATE expense SET  exp_approve =  $exp_approve WHERE exp_id= '$exp_id'";
  if ( $conn->query($sql) === TRUE) {
  } 
   else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}
  echo "ok";
$conn->close();

 ?>


