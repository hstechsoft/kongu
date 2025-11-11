<?php
 include 'db_head.php';

 

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT
 'leader' as leader_sts,
 gfc.start_date,
    gfc.time_period,
        gfc.ic_factor,
        gfc.dc_charge_calculation,
        gfc.id,
    CONCAT(
        gfc.group_number,
       
        '-',
        members.user_name
    ) AS group_mem
FROM
    members
INNER JOIN group_finance_collections gfc ON
    members.teamid = gfc.id
WHERE
    members.leader = 1

UNION ALL
SELECT 
 'no-leader' as leader_sts, 
  gfc.start_date,
   gfc.time_period,
        gfc.ic_factor,
        gfc.dc_charge_calculation,
         gfc.id,
CONCAT(
        gfc.group_number,
        '- No Leader'
       
    ) AS group_mem from group_finance_collections gfc WHERE gfc.id not in 
(SELECT members.teamid from members WHERE members.leader = 1)";

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


