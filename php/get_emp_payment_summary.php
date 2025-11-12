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
$sql .= "SELECT
    SUM(paid_amount) AS total,
    payment_mode
FROM memberspayment
WHERE emp_id = 20 AND cash_id IS NULL
GROUP BY payment_mode

UNION ALL

SELECT
    amount AS total,
    'in_hand' AS payment_mode
FROM employee_cash
WHERE emp_id = 20
  AND cash_id = (
      SELECT MAX(cash_id) FROM employee_cash WHERE emp_id = 20
  );
";

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


