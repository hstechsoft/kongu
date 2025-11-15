<?php
include 'db_head.php';

$emp_id_query = test_input($_GET['emp_id']) == "''" ? 1 : "emp_id = ".$_GET['emp_id'];

$start_date = ($_GET['start_date']) == '' ? "2000-01-01" : ($_GET['start_date']);
$end_date = ($_GET['end_date']) == '' ? "CURRENT_DATE"  : ($_GET['end_date']);
$mp_date_query = "mp.paid_date BETWEEN '".$start_date."' AND '".$end_date."'";
$exp_date_query = "ep.paid_date BETWEEN '".$start_date."' AND '".$end_date."'";
$team_list  = ($_GET['team_list']) == '' ? 1 : "mp.member_id IN (SELECT members.id from members WHERE members.teamid IN (".$_GET['team_list'].")) ";
$pay_mode_query = ($_GET['pay_mode']) == '' ? 1 : "mp.payment_mode IN (".$_GET['pay_mode'].") ";

echo $emp_id_query;

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
    -- emp.id =  19 and mp.paid_date <= '2025-11-15' and mp.cash_id is null

        $emp_id_query and $mp_date_query and $team_list and $pay_mode_query
GROUP BY
    paid_date,
    teamid,
    payment_mode
),
cd_final AS(
    SELECT
    DATE_FORMAT(cd.paid_date, '%Y-%m-%d') as paid_date,
       cd.team AS team,
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
        )  AS details,
        SUM(amount) AS total_amount
    FROM
        collection_details cd
    GROUP BY
        paid_date,
        teamid
),
 expense_details as (SELECT dated,JSON_ARRAYAGG(
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
        ) AS amount_details,sum(amount) as total,paymode,'team_payment' as cat from(SELECT DATE_FORMAT(tp.dated, '%Y-%m-%d')  as dated,tp.amount as amount,tp.pay_mode as paymode, 'team_payment' as cat FROM team_payment tp WHERE emp_id = 19 GROUP by dated,paymode) as team  GROUP by dated),

emp_pay_full AS(SELECT  ed.dated as paid_date,
                'expense' as team,
                19 as emp_id,JSON_ARRAYAGG(
            JSON_OBJECT(
                'cat',
				cat,
                'details',
               amount_details
            )
        ) AS details,sum(total) as total_amount from expense_details ed GROUP by dated),
        
  final as(SELECT   paid_date,
   team  COLLATE utf8mb4_unicode_ci as team,
   emp_id,
   details COLLATE utf8mb4_unicode_ci as details,
    total_amount as credit,
   '' as debit
  
   from cd_final  
   UNION ALL 
     SELECT  paid_date,
   team,
   emp_id,
   details,
   "" as credit,
     total_amount as debit from emp_pay_full  )
     
     SELECT * from final ORDER by paid_date

    
    

 
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


 