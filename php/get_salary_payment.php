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

$sql = "SET time_zone = '+05:30';"; // First query to set the time zone
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
    salary_year = 2025 AND salary_month = 10 and emp_id = 20
GROUP BY
    salary_year,
    salary_month";

if ($conn->multi_query($sql) === TRUE) {
    echo "ok";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}


$conn->close();   




 ?>


