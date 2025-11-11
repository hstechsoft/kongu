<?php
 include 'db_head.php';

 $team_id = test_input($_GET['team_id']);




 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';";
$sql .= "WITH
    collection_date AS(
    SELECT
        fp.collection_date
    FROM
        finance_payment fp
    INNER JOIN memberspayment mp ON
        fp.collection_date = mp.paid_date
    WHERE
        fp.group_id =  $team_id and  (SELECT 1 as result FROM `memberspayment` mp WHERE mp.member_id  in (SELECT members.id from members WHERE members.teamid = $team_id ) LIMIT 1)
    GROUP BY
        collection_date
),
fp AS(
    SELECT
        *
    FROM
        finance_payment fp
    WHERE
        fp.group_id =  $team_id
)
SELECT
concat(date_only(fp.collection_date), if(collection_date.collection_date is null ,'',' ✓')) as collection_date,
fp.collection_date as c_date,
 if(collection_date.collection_date is null ,'',' - entry') as c_sts
    
FROM
    fp
LEFT JOIN collection_date ON fp.collection_date = collection_date.collection_date group by fp.collection_date
ORDER BY fp.collection_date DESC;";

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


