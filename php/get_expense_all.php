<?php
 include 'db_head.php';

 

 $sql = "SELECT SUM(CASE when exp_approve = 'no' then exp_amount ELSE 0 END)as un_approve, SUM(CASE when exp_approve = 'yes' then exp_amount ELSE 0 END)as approve,  SUM(CASE when exp_approve = 'decline' then exp_amount ELSE 0 END)as decline,exp_emp_id,employees.employee_name,sum(DISTINCT  IFNULL(expense_payment.paid_amount,0))as amount_paid FROM expense INNER JOIN employees on expense.exp_emp_id = employees.id LEFT join expense_payment on expense_payment.emp_id = expense.exp_emp_id GROUP by exp_emp_id";

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


