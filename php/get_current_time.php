<?php
 include 'db_head.php';




 function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    $data = "'".$data."'";
    return $data;
    }

    
 $sql = "SELECT DATE_FORMAT(
        CONVERT_TZ(NOW(), @@session.time_zone, '+05:30'),
        '%Y-%m-%d'
    )  as date,DATE_FORMAT(
        CONVERT_TZ(NOW(), @@session.time_zone, '+05:30'),
        '%Y-%m-%d %h:%i:%s %p'
    )  as date_time,DATE_FORMAT(
        CONVERT_TZ(NOW(), @@session.time_zone, '+05:30'),
        '%h:%i:%s %p'
    )  as time_only";

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


