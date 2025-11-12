<?php
 include 'db_head.php';

 $salary_month = test_input($_GET['salary_month']);
$salary_year = test_input($_GET['salary_year']);
$emp_id = test_input($_GET['emp_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';";
$sql .= "SELECT
    SUM(paid_amount) AS total_paid,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'salary_pay_id',
            salary_pay_id,
            'paid_amount',
            `paid_amount`,
            'dated',
            date_only(dated),
            'pay_mode',
            pay_mode,
            'ref_no',
            ref_no,
            'is_advance',
            is_advance
           
            
        ) 
    ) as pay_details
FROM
    `salary_payment`
WHERE
    salary_year = $salary_year AND salary_month = $salary_month and emp_id = $emp_id
GROUP BY
    salary_year,
    salary_month;";

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


