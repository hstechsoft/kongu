<?php
 include 'db_head.php';

 $team_id = test_input($_GET['team_id']);

 $mem_query = ($_GET['mem_query']);

  $emi_date = ($_GET['emi_date']);

if($emi_date == ""){
    $emi_date = "CURDATE()";
}
else{
    
    $emi_date = "'".$emi_date."'";
}
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';";
$sql .= "WITH
    fp_sum AS(
    SELECT
        mp.member_id,
        SUM(mp.paid_amount) AS total_paid
    FROM
        memberspayment mp
    GROUP BY
        member_id
),
pay_sum AS(
    SELECT
        fp.member_id,
        SUM(fp.pay_amount) AS total_pay_amount,
        MAX(fp.collection_date) AS collection_date
    FROM
        finance_payment fp
    WHERE
        IF(
            DATEDIFF(
                fp.collection_date,
               $emi_date) < 7,
                1,
                0
            ) and fp.group_id =  $team_id and $mem_query
        GROUP BY
            member_id
        ORDER BY
            finance_id
        )
    SELECT
        pay_sum.member_id,
        (select members.user_name from members where members.id =  pay_sum.member_id) as member,
          (select members.nominee_name from members where members.id =  pay_sum.member_id) as nominee_name,
         (select members.photo from members where members.id =  pay_sum.member_id) as photo,
        ifnull(fp_sum.total_paid,0) as total_paid,
        ifnull(pay_sum.total_pay_amount,0) as total_pay_amount ,
        date_only(pay_sum.collection_date) as collection_date,
        if((ifnull(total_pay_amount,0) - ifnull(total_paid,0)) <=0, 'no pay','pay') as sts,
       ROUND(IFNULL(total_pay_amount, 0) - IFNULL(total_paid, 0), 0) as adv
    FROM
        fp_sum
    RIGHT JOIN pay_sum ON fp_sum.member_id = pay_sum.member_id;";

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


