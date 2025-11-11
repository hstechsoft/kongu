<?php
 include 'db_head.php';

  $team_id = test_input($_GET['team_id']);
  $mem_query = ($_GET['mem_query']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



 

// $sql = <<<SQL
// SELECT
//     collection_date,
//     expected_amount,
//     total_paid,
//     pay_history,
//     his_html,
//     @running_balance := @running_balance +(expected_amount - total_paid) AS pending_balance,
//     CASE WHEN @running_balance <= 0 THEN 0 ELSE @running_balance
// END AS amount_to_pay,
// CASE WHEN @running_balance < 0 THEN ABS(@running_balance) ELSE 0
// END AS available_advance,
// CASE WHEN @running_balance < 0 THEN 'Advance Paid' WHEN total_paid = 0 THEN 'No Payment' WHEN total_paid >= expected_amount THEN 'Paid' ELSE 'Partially Paid'
// END AS sts
// FROM
//     (
//     SELECT
//         fp.collection_date,
//         fp.pay_amount AS expected_amount,
//         IFNULL(SUM(mp.paid_amount),
//         0) AS total_paid,
//           ul("",
//        GROUP_CONCAT(
//             li(
//                 CONCAT(
//                     div_fun(
//                         'd-flex justify-content-between',
//                         CONCAT(
//                             p('small', mp.paid_date),
//                             p('small', concat(mp.paid_amount,case when mp.payment_mode = 'Cash' then ' <span><i class="fa-solid fa-money-bill-wave h6 ms-1"></i></span>' when mp.payment_mode = 'Cheque' then ' <span><i class="fa-solid fa-credit-card h6 ms-1"></i></span>' when mp.payment_mode = 'UPI' then ' <span><i class="fa-brands fa-google-pay h6 ms-1"></i></span>' else '' end)),
//                             p(
//                                 'small',
//                                 if(
//                                     mp.is_paid = 1,
//                                     '<i class="fa-solid fa-circle-check text-success"></i>',
//                                     '<i class="fa-solid fa-triangle-exclamation blink"></i>'
//                                 )
//                             )
//                         )
//                     )
//                 )
//             ) separator ''
//         ) ) as his_html,
//         GROUP_CONCAT(mp.paid_amount) AS pay_history
//     FROM
//     finance_payment fp
// LEFT JOIN memberspayment mp ON
//     mp.member_id = fp.member_id AND IF(
//         mp.paid_date <= fp.collection_date,
//         1,
//         IF(
//             (
//             SELECT
//                 MAX(finance_payment.collection_date)
//             FROM
//                 finance_payment
//             WHERE
//                 finance_payment.member_id = $team_id 
//         ) < fp.collection_date,1,0
//         )
//     ) AND mp.paid_date > IFNULL(
//         (
//         SELECT
//             MAX(fp2.collection_date)
//         FROM
//             finance_payment fp2
//         WHERE
//             fp2.collection_date < fp.collection_date AND fp2.member_id = fp.member_id
//     ),
//     '0000-00-00'
//     )
// WHERE
//     fp.member_id = $team_id 
// GROUP BY
//     fp.collection_date,
//     fp.pay_amount
// ORDER BY
//     fp.collection_date
// ) AS t,
// (
// SELECT
//     @running_balance := 0
// ) AS vars 
// ORDER BY `t`.`expected_amount` ASC 
// SQL;



$sql = <<<SQL
WITH
    pay_info AS(
    SELECT
            ul("",
       GROUP_CONCAT(
            li(
                CONCAT(
                    div_fun(
                        'd-flex justify-content-between',
                        CONCAT(
                            p('small', mp.paid_date),
                            p('small', concat(mp.paid_amount,case when mp.payment_mode = 'Cash' then ' <span><i class="fa-solid fa-money-bill-wave h6 ms-1"></i></span>' when mp.payment_mode = 'Cheque' then ' <span><i class="fa-solid fa-credit-card h6 ms-1"></i></span>' when mp.payment_mode = 'UPI' then ' <span><i class="fa-brands fa-google-pay h6 ms-1"></i></span>' else '' end)),
                            p(
                                'small',
                                if(
                                    mp.is_paid = 1,
                                    '<i class="fa-solid fa-circle-check text-success"></i>',
                                    '<i class="fa-solid fa-triangle-exclamation blink"></i>'
                                )
                            )
                        )
                    )
                )
            ) separator ''
        ) ) as his_html,
        fp.finance_id,
        fp.collection_date,
        fp.member_id,
        fp.pay_amount,
        mp.paid_date,
        mp.is_paid,
        mp.payment_mode,
        mp.created_at,
      
        (SELECT employees.employee_name from employees WHERE employees.id = mp.emp_id) as emp_name,
        IFNULL(SUM(pay_amount),
        0) AS tot_emi,
        IFNULL(SUM(paid_amount),
        0) AS paid_amount
    FROM
        finance_payment fp
    LEFT JOIN memberspayment mp ON
        mp.member_id = fp.member_id AND IF(
            mp.paid_date <= fp.collection_date,
            1,
            IF(
                (
                SELECT
                    MAX(
                        finance_payment.collection_date
                    )
                FROM
                    finance_payment
                WHERE
                    finance_payment.member_id =   $team_id
            ) = fp.collection_date,
            1,
            0
            )
        ) AND mp.paid_date > IFNULL(
            (
            SELECT
                MAX(fp2.collection_date)
            FROM
                finance_payment fp2
            WHERE
                fp2.collection_date < fp.collection_date AND fp2.member_id = fp.member_id
        ),
        '0000-00-00'
        )
    WHERE
        fp.group_id =   $team_id and $mem_query
    GROUP BY
        collection_date,
        fp.finance_id
    ORDER BY
        fp.member_id
),
sum_table AS(
    SELECT
        pay_info.*,

        SUM(pay_amount) OVER(
           PARTITION BY member_id
        ORDER BY
            collection_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS pay_amount_total_till_date,
    SUM(paid_amount) OVER(
           PARTITION BY member_id
    ORDER BY
        collection_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
) AS paid_amount_total_till_date,
SUM(paid_amount) OVER(
       PARTITION BY member_id
    ORDER BY
        collection_date ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
) AS paid_amount_total_pre_date
FROM
    pay_info
),final as (
SELECT
    sum_table.*,
    sum_table.pay_amount_total_till_date - sum_table.paid_amount_total_till_date AS bal,
    sum_table.pay_amount_total_till_date - IFNULL(
        sum_table.paid_amount_total_pre_date,
        0
    ) AS payable,
    IF(
        (
            sum_table.pay_amount_total_till_date - IFNULL(
                sum_table.paid_amount_total_pre_date,
                0
            )
        ) > 0,
        (
            IF(
                paid_amount = 0,
                if(collection_date <= CURDATE(),
                'text-bg-danger','disabled'),
                IF(
                    (
                        sum_table.pay_amount_total_till_date - IFNULL(
                            sum_table.paid_amount_total_pre_date,
                            0
                        ) )= paid_amount,
                        'text-bg-success',
                      IF(
                    (
                        sum_table.pay_amount_total_till_date - IFNULL(
                            sum_table.paid_amount_total_pre_date,
                            0
                        ) )< paid_amount,'text-bg-success fw-bold ','text-bg-warning')
                    )
                
            )
        ),
        if(paid_amount>0,'','')
    ) AS sts,
   
     sum_table.pay_amount_total_till_date - IFNULL(
        sum_table.paid_amount_total_pre_date,
        0
    )  AS payable_amounts,
  
   sum_table.pay_amount_total_till_date - IFNULL(
        sum_table.paid_amount,
        0
    )  AS payable_amounts1,
    
    (SELECT user_name FROM members WHERE members.id = sum_table.member_id) AS member_name,
    (SELECT phone FROM members WHERE members.id = sum_table.member_id) AS member_phone,
    (SELECT nominee_name FROM members WHERE members.id = sum_table.member_id) AS nominee_name,
    (SELECT nominee_phone FROM members WHERE members.id = sum_table.member_id) AS nominee_phone
FROM
    sum_table ) 
SELECT
(select collection_day from group_finance_collections where id = $team_id limit 1) as collection_day,

(select group_number from group_finance_collections where id = $team_id limit 1) as group_number,
(select time_period from group_finance_collections where id = $team_id limit 1) as time_period,
   member_name,
    member_phone,
    nominee_name,
    nominee_phone, 
   group_concat(date_only(collection_date)) AS due_dates,  
   group_concat(payable_amounts) AS payable_amounts ,
    member_id,
    tr(group_concat(concat('<td class=\"small\" scope=\"col\">',collection_date,'</td>'))) AS due_dates_tr,
    tr(concat('<td scope=\"col\">',ifnull(member_name,''),'</td>',(group_concat(concat('<td class=\"',sts,'\">',ROUND(paid_amount, 0),'/',ROUND(payable_amounts, 0),'</td>'))))) AS payable_amounts_tr,

    -- tr(concat('<th scope=\"col\">',ifnull(member_name,''),'</th>','<th scope=\"col\">',ifnull(nominee_name,''),'</th>',
    -- '<th scope=\"col\">',sum(tot_emi),'</th>',group_concat(concat('<td>',ROUND(pay_amount, 0),'</td>')))) AS payable_amounts_entry_tr,

    
    tr(concat('<td></td><td scope=\"col\">',ifnull(concat('<p class=\"m-0 p-0 small\">',member_name,'</p><p class=\"m-0 p-0 small\">',member_phone,'</p>'),''),'</td>','<td scope=\"col\">',ifnull(concat('<p class=\"m-0 p-0 small\">',nominee_name,'</p><p class=\"m-0 p-0 small\">',nominee_phone,'</p>'),''),'</td>',
    '<th scope=\"col\">',ROUND(sum(tot_emi), 0),'</th>',group_concat(concat('<td>',if(paid_amount = 0,'',ROUND(paid_amount, 0)),'</td>')), '<td scope=\"col\">',ROUND(sum(tot_emi)-sum(paid_amount), 0),'</td>')) AS payable_amounts_entry_tr,

    -- tr(concat('<th scope=\"col\">',ifnull(member_phone,''),'</th>','<th scope=\"col\">',ifnull(nominee_phone,''),'</th>',   '<th scope=\"col\">',sum(tot_emi)-sum(paid_amount),'</th>',group_concat(concat('<td>',if(paid_amount = 0,'',paid_amount),'</td>')))) AS 
    -- payable_amounts_entry__emp_tr

    
    tr(concat('<td scope=\"col\">',ifnull(member_phone,''),'</td>','<td scope=\"col\">',ifnull(nominee_phone,''),'</td>',   '<td scope=\"col\">','</td>',group_concat(concat('<td>','</td>')),'<td></td>')) AS 
    payable_amounts_entry__emp_tr,

    group_concat(emp_name) as emp_name_list


    from final group by member_id  order by member_id
SQL;

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