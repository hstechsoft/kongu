<?php
$host = "srv1002.hstgr.io";
$user = "u333142350_kongufinance";
$pass = "W&n7tE&#Gm[H?k64";
$db   = "u333142350_kongufinace";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

header('Content-Type: application/json');

// =================== GET ALL MEMBERS ===================
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $result = $conn->query("SELECT * FROM members");
    $members = [];
    while ($row = $result->fetch_assoc()) {
        $members[] = $row;
    }
    echo json_encode($members);
    exit;
}

// =================== POST ACTIONS ===================
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $action = $_POST['action'] ?? 'create';

    // DELETE MEMBER
    if ($action === 'delete') {
        $id = intval($_POST['id'] ?? 0);
        if ($id <= 0) {
            echo json_encode(["status" => "error", "message" => "Invalid member ID"]);
            exit;
        }
        $stmt = $conn->prepare("DELETE FROM members WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Member deleted successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => $stmt->error]);
        }
        $stmt->close();
        exit;
    }

    // Collect form data
    $member_id       = $_POST['member_id'] ?? '';
    $user_name       = $_POST['user_name'] ?? '';
    $phone           = $_POST['phone'] ?? '';
    $phone2          = $_POST['phone2'] ?? '';
    $aadhar          = $_POST['aadhar'] ?? '';
    $city            = $_POST['city'] ?? '';
    $district        = $_POST['district'] ?? '';
    $pincode         = $_POST['pincode'] ?? '';
    $location_url    = $_POST['location_url'] ?? '';
    $leader          = isset($_POST['leader']) ? 1 : 0;

    $nominee_name         = $_POST['nominee_name'] ?? '';
    $nominee_phone        = $_POST['nominee_phone'] ?? '';
    $nominee_phone2       = $_POST['nominee_phone2'] ?? '';
    $nominee_aadhar       = $_POST['nominee_aadhar'] ?? '';
    $nominee_relationship = $_POST['nominee_relationship'] ?? '';

    if (isset($_POST['different_address'])) {
        $nominee_city       = $_POST['nominee_city'] ?? '';
        $nominee_district   = $_POST['nominee_district'] ?? '';
        $nominee_pincode    = $_POST['nominee_pincode'] ?? '';
        $nominee_location   = $_POST['nominee_location_url'] ?? '';
    } else {
        $nominee_city       = $city;
        $nominee_district   = $district;
        $nominee_pincode    = $pincode;
        $nominee_location   = $location_url;
    }

    $teamid = $_POST['teamid'] ?? '';
    $amount = isset($_POST['amount']) ? (float)$_POST['amount'] : 0;
    $dc_charge_calculation = isset($_POST['dc_charge_calculation']) ? (float)$_POST['dc_charge_calculation'] : 0;
    $dc_amount = $dc_charge_calculation * $amount;
    $after_dc_factor_amount = $amount - $dc_amount;

    $interest     = isset($_POST['interest']) ? (float)$_POST['interest'] : 0;
    $time_period  = isset($_POST['time_period']) ? (float)$_POST['time_period'] : 0;
    $interestCalculated = ($amount * $time_period * $interest) / 100;
    $totalAmount = $amount + $interestCalculated;

    $verification         = isset($_POST['verification']) ? 1 : 0;
    $nominee_verification = isset($_POST['nominee_verification']) ? 1 : 0;
    $pending_amount       = $totalAmount;

    // Photo upload
    $photo = NULL;
    if (!empty($_FILES["photo"]["name"])) {
        $targetDir = "uploads/";
        if (!file_exists($targetDir)) mkdir($targetDir, 0777, true);
        $photo = $targetDir . time() . "_" . basename($_FILES["photo"]["name"]);
        move_uploaded_file($_FILES["photo"]["tmp_name"], $photo);
    }

    // CREATE or UPDATE
    if ($action === 'update' && !empty($member_id)) {

        if (!empty($photo)) {
            // photo included
            $sql = "
                UPDATE members SET
                    user_name=?, phone=?, phone2=?, aadhar=?, city=?, district=?, pincode=?, location_url=?, leader=?,
                    nominee_name=?, nominee_phone=?, nominee_phone2=?, nominee_aadhar=?, nominee_relationship=?,
                    nominee_city=?, nominee_district=?, nominee_pincode=?, nominee_location_url=?,
                    teamid=?, amount=?, dc_amount=?, after_dc_factor_amount=?, verification=?, nominee_verification=?, photo=?, interest=?, totalAmount=?, pending_amount=?
                WHERE id=?
            ";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param(
                "ssssssssisssssssssidddiisdddi",
                $user_name,
                $phone,
                $phone2,
                $aadhar,
                $city,
                $district,
                $pincode,
                $location_url,
                $leader,
                $nominee_name,
                $nominee_phone,
                $nominee_phone2,
                $nominee_aadhar,
                $nominee_relationship,
                $nominee_city,
                $nominee_district,
                $nominee_pincode,
                $nominee_location,
                $teamid,
                $amount,
                $dc_amount,
                $after_dc_factor_amount,
                $verification,
                $nominee_verification,
                $photo,
                $interest,
                $totalAmount,
                $pending_amount,
                $member_id
            );
        } else {
            // no photo update
            $sql = "
                UPDATE members SET
                    user_name=?, phone=?, phone2=?, aadhar=?, city=?, district=?, pincode=?, location_url=?, leader=?,
                    nominee_name=?, nominee_phone=?, nominee_phone2=?, nominee_aadhar=?, nominee_relationship=?,
                    nominee_city=?, nominee_district=?, nominee_pincode=?, nominee_location_url=?,
                    teamid=?, amount=?, dc_amount=?, after_dc_factor_amount=?, verification=?, nominee_verification=?, interest=?, totalAmount=?, pending_amount=?
                WHERE id=?
            ";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param(
                "ssssssssisssssssssidddiidddi",
                $user_name,
                $phone,
                $phone2,
                $aadhar,
                $city,
                $district,
                $pincode,
                $location_url,
                $leader,
                $nominee_name,
                $nominee_phone,
                $nominee_phone2,
                $nominee_aadhar,
                $nominee_relationship,
                $nominee_city,
                $nominee_district,
                $nominee_pincode,
                $nominee_location,
                $teamid,
                $amount,
                $dc_amount,
                $after_dc_factor_amount,
                $verification,
                $nominee_verification,
                $interest,
                $totalAmount,
                $pending_amount,
                $member_id
            );
        }

        $msg = "Member updated successfully";
    } else {
        // INSERT
        $sql = "
            INSERT INTO members 
            (user_name, phone, phone2, aadhar, city, district, pincode, location_url, leader,
             nominee_name, nominee_phone, nominee_phone2, nominee_aadhar, nominee_relationship,
             nominee_city, nominee_district, nominee_pincode, nominee_location_url,
             teamid, amount, dc_amount, after_dc_factor_amount, photo, verification, nominee_verification, interest, totalAmount, pending_amount)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "ssssssssisssssssssidddsiiddd",
            $user_name,
            $phone,
            $phone2,
            $aadhar,
            $city,
            $district,
            $pincode,
            $location_url,
            $leader,
            $nominee_name,
            $nominee_phone,
            $nominee_phone2,
            $nominee_aadhar,
            $nominee_relationship,
            $nominee_city,
            $nominee_district,
            $nominee_pincode,
            $nominee_location,
            $teamid,
            $amount,
            $dc_amount,
            $after_dc_factor_amount,
            $photo,
            $verification,
            $nominee_verification,
            $interest,
            $totalAmount,
            $pending_amount
        );
        $msg = "Member created successfully";
    }

    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $conn->error]);
        exit;
    }

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => $msg]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $stmt->error]);
    }
    $stmt->close();
    exit;
}

$conn->close();
