<?php
 include 'db_head.php';

 

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT GROUP_CONCAT(concat('<tr class=\'d-none ',  gid , '\'><td>',members.user_name,'</td><td>',members.phone ,'</td><td>',members.nominee_aadhar,'</td><td>',members.totalAmount, '</td><td> <div style=\'width: 90px; height : 90px; overflow: hidden;\'> <img src=\'',members.photo,'\' class=\'img-fluid img-thumbnail\' style=\'height: 100%; width: 100%; object-fit:contain ;\' alt=\'\'> </div></td>','<td>
<a href=\'',members.location_url,' \' target=\'_blank\' rel=\'noopener\'>
    <button type=\'button\' class=\'btn btn-outline-primary border-0\' >
        <i class=\'fa-solid fa-location-dot\'></i>
    </button>
</a>
</td><td><button type=\'button\' class=\'btn btn-outline-primary btn-sm edit border-0\' value = \'',members.id,'\'><i class=\'fa fa-pencil\' aria-hidden=\'true\'></i></button> <button  value = \'',members.id,'\' type=\'button\' class=\'btn btn-outline-danger btn-sm delete border-0\' ><i class=\'fa-solid fa-trash\'></i></button></td></tr>')) as mem,gid,group_mem,count(members.id) as total_members, sum(members.totalAmount) as g_total from(SELECT
    gfc.id as gid,
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

  
         gfc.id as gid,
CONCAT(
        gfc.group_number,
        '- No Leader'
       
    ) AS group_mem from group_finance_collections gfc WHERE gfc.id not in 
(SELECT members.teamid from members WHERE members.leader = 1)) as group_sts INNER join members on group_sts.gid = members.teamid GROUP by gid;";



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


