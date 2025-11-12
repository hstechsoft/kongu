<?php
 include 'db_head.php';

  $emp_id = test_input($_GET['emp_id']);
  
  $paid_date = test_input($_GET['paid_date']);

 
 
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
    SELECT
        SUM(emp_payment.pay_amount) AS total_emp_paid,
        pay_date,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'mode',
                emp_payment.pay_mode,
                'paid_amount',
                emp_payment.pay_amount
            )
        ) AS emp_amount_details
    FROM
        emp_payment
    WHERE
        emp_payment.emp_id =  $emp_id 
    GROUP BY
        emp_payment.pay_date
)
SELECT
    *
FROM
    cd_final
LEFT JOIN emp_pay_full ef ON
    cd_final.paid_date = ef.pay_date
UNION
SELECT
    *
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