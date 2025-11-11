
<?php
 include 'db_head.php';

 
 $exp_cat = ($_GET['exp_cat']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$exp_cat  = "%" .  $exp_cat ."%";

$sql = "SELECT exp_cat from expense where exp_cat LIKE '$exp_cat' group by exp_cat;";

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


