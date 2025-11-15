<?php
 include 'db_head.php';

  $emp_id = test_input($_GET['emp_id']);
  
  $paid_date = test_input($_GET['paid_date']);

//  emp.id = '18' and mp.paid_date <= 	'2025-04-05' and mp.cash_id is null and mp.member_id in (SELECT members.id from members WHERE members.teamid in (66,55)) and 1
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SET time_zone = '+05:30';";


$sql .= <<<SQL
WITH
    collection_details AS(
    SELECT
        mp.member_id,
        mp.paid_amount,
        mp.emp_id,
        emp.employee_name,
        mem.user_name,
        mem.teamid,
        mp.paid_date,
        (
        SELECT
            gfc.group_number
        FROM
            group_finance_collections gfc
        WHERE
            gfc.id = mem.teamid
    ) AS team,
    mp.payment_mode,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'user_name',
            user_name,
            'paid_amount',
            paid_amount
        )
    ) AS details,
    SUM(paid_amount) AS amount
FROM
    `memberspayment` mp
INNER JOIN employees emp ON
    mp.emp_id = emp.id
INNER JOIN members mem ON
    mem.id = mp.member_id
WHERE
    emp.id =  $emp_id and mp.paid_date <= $paid_date and mp.cash_id is null
GROUP BY
    paid_date,
    teamid,
    payment_mode
),
cd_final AS(
    SELECT
        cd.paid_date,
        cd.team,
        cd.emp_id,

        JSON_ARRAYAGG(
            JSON_OBJECT(
                'payment_mode',
                payment_mode,
                'pay_details',
                details,
                'mode_sum',
                amount
            )
        ) AS details,
        SUM(amount) AS total_amount
    FROM
        collection_details cd
    GROUP BY
        paid_date,
        teamid
),
emp_pay_full AS(
with expense_details as (SELECT dated,JSON_ARRAYAGG(
            JSON_OBJECT(
                'mode',
				paymode,
                'amount',
               amount
            )
        ) AS amount_details,sum(amount) as total,paymode,'expense' as cat from(SELECT DATE_FORMAT(ep.paid_date, '%Y-%m-%d')  as dated,sum(ep.paid_amount) as amount,ep.pay_mode as paymode,'expense' as cat FROM `expense_payment` ep WHERE emp_id = 19 GROUP by dated,paymode) as exp GROUP by dated
UNION ALL
SELECT dated,JSON_ARRAYAGG(
            JSON_OBJECT(
                'mode',
				paymode,
                'amount',
               amount
            )
        ) AS amount_details,sum(amount) as total,paymode,'salary' as cat from(SELECT DATE_FORMAT(sp.dated, '%Y-%m-%d')  as dated,sum(sp.paid_amount) as amount,sp.pay_mode as paymode, 'salary' as cat FROM `salary_payment` sp WHERE emp_id = 19 GROUP by dated,paymode) as sal GROUP by dated
UNION ALL
SELECT dated,JSON_ARRAYAGG(
            JSON_OBJECT(
                'mode',
				paymode,
                'amount',
               amount
            )
        ) AS amount_details,sum(amount) as total,paymode,'team_payment' as cat from(SELECT DATE_FORMAT(tp.dated, '%Y-%m-%d')  as dated,tp.amount as amount,tp.pay_mode as paymode, 'team_payment' as cat FROM team_payment tp WHERE emp_id = 19 GROUP by dated,paymode) as team  GROUP by dated)
SELECT ed.dated,JSON_ARRAYAGG(
            JSON_OBJECT(
                'cat',
				cat,
                'details',
               amount_details
            )
        ) AS amount_details,sum(total) as total from expense_details ed GROUP by dated
)
SELECT
    cd_final.*
FROM
    cd_final
LEFT JOIN emp_pay_full ef ON
    cd_final.paid_date = ef.pay_date
UNION
SELECT
    cd_final.*
FROM
    cd_final
RIGHT JOIN emp_pay_full ef ON
    cd_final.paid_date = ef.pay_date;
SQL;

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