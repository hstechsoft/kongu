
<?php
 include 'php/db_head.php';

 $file_name = $_POST['file_name'];
   $file_ext = $_POST['file_ext'];
  $user_name = $_POST['user_name'];
  
    $nominee_name = $_POST['nominee_name'];
    $phone = $_POST['phone'];
    $nominee_phone = $_POST['nominee_phone'];
    $phone2 = $_POST['phone2'];
    $nominee_phone2 = $_POST['nominee_phone2'];
    $aadhar = $_POST['aadhar'];
    $nominee_aadhar = $_POST['nominee_aadhar'];
    $city = $_POST['city'];
    $nominee_relationship = $_POST['nominee_relationship'];
    $different_address = $_POST['different_address'];
    $district = $_POST['district'];
    $nominee_city = $_POST['nominee_city'];
    $pincode = $_POST['pincode'];
    $nominee_district = $_POST['nominee_district'];
    $location_url = $_POST['location_url'];
    $nominee_pincode = $_POST['nominee_pincode'];
    $nominee_location_url = $_POST['nominee_location_url'];
    $teamid = $_POST['team_id'];
     $amount = $_POST['amount'];
      $interest = $_POST['interest'];
       $verification = $_POST['verification'];
        $nominee_verification = $_POST['nominee_verification'];
    $leader = $_POST['leader'];
        $dc_amount = $_POST['dc_amount'];
            $after_dc_factor_amount = $_POST['after_dc_factor_amount'];
                $interest = $_POST['interest'];
                    $totalAmount = $_POST['totalAmount'];
           $pending_amount = $_POST['pending_amount'];
             $start_date = $_POST['start_date'];
                  $is_addr_differ = $_POST['is_addr_differ'];
                  $emi = $_POST['emi']; 
                    $time_period = $_POST['time_period'];
  $last_id  = 0;
  

        if($different_address == "no")
        {
$nominee_city = $city; 
 $nominee_district =  $district;
   $nominee_pincode =   $pincode;
   $nominee_location_url = $location_url;
        }

$sql =  "INSERT INTO members (user_name,phone,phone2,aadhar,city,district,pincode,location_url,leader,nominee_name,nominee_phone,nominee_phone2,nominee_aadhar,nominee_relationship,nominee_city,nominee_district,nominee_pincode,nominee_location_url,teamid,amount,dc_amount,after_dc_factor_amount,interest,totalAmount,photo,verification,nominee_verification,pending_amount,start_date,is_addr_differ) VALUES ('$user_name','$phone','$phone2','$aadhar','$city','$district','$pincode','$location_url','$leader','$nominee_name','$nominee_phone','$nominee_phone2','$nominee_aadhar','$nominee_relationship','$nominee_city','$nominee_district','$nominee_pincode','$nominee_location_url','$teamid','$amount','$dc_amount','$after_dc_factor_amount','$interest','$totalAmount','photo','$verification','$nominee_verification','$pending_amount','$start_date',$is_addr_differ)";

 if ($conn->query($sql) === TRUE) {
  $last_id = $conn->insert_id;
$photo_url =  "images/group/". $teamid . "/".$last_id . "." . $file_ext;
   $sql_update =  "UPDATE  members  SET photo  =  '$photo_url'  WHERE id =  $last_id ";

  if ($conn->query($sql_update) === TRUE) {
    $sql_procedure =  " CALL insert_dates('$start_date', $time_period, $last_id, $teamid, $emi);";

  if ($conn->query($sql_procedure) === TRUE) {
   echo "ok";

   
  } else {
    echo "Error: " . $sql_procedure . "<br>" . $conn->error;
  }
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }


  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }




    

if($_FILES['file']['name'] != ''){
  
  
    $dirname = $teamid;
    $target_path = "images/group/" . $dirname . "/" ;

    if (file_exists($target_path)) {
       
    } else {
        mkdir($target_path, 0777, true);
      
       
    }
        $target_path = $target_path .   $last_id  . '.' . $file_ext ; 

        $FileType = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));    
       
    
       
    // Resize the image
    $max_width = 800;  // Set the desired width
    $max_height = 800; // Set the desired height

    list($width, $height) = getimagesize($_FILES['file']['tmp_name']);
    $ratio = $width / $height;

    if ($width > $max_width || $height > $max_height) {
        if ($ratio > 1) {
            $new_width = $max_width;
            $new_height = $max_width / $ratio;
        } else {
            $new_height = $max_height;
            $new_width = $max_height * $ratio;
        }

        $src = imagecreatefromstring(file_get_contents($_FILES['file']['tmp_name']));
        $dst = imagecreatetruecolor($new_width, $new_height);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $new_width, $new_height, $width, $height);

        // Add text to the image
        $date = new DateTime('now', new DateTimeZone('Asia/Kolkata'));
        $text = $date->format('d-m-Y H:i:s')."(".  $user_name. ")";
        $font = realpath(__DIR__ . '/arial.ttf'); // Ensure this path points to a valid TTF font file on your server
        if ($font === false) {
            die("Font file not found!");
        }
        $font_size = 15;
        $text_color = imagecolorallocate($dst, 255, 255, 255); // White color
        $x_position = 10;
        $y_position = $new_height - 10;

        imagettftext($dst, $font_size, 0, $x_position, $y_position, $text_color, $font, $text);

        if ($FileType == 'jpg' || $FileType == 'jpeg') {
            imagejpeg($dst, $target_path);
        } elseif ($FileType == 'png') {
            imagepng($dst, $target_path);
        } elseif ($FileType == 'gif') {
            imagegif($dst, $target_path);
        }

        imagedestroy($src);
        imagedestroy($dst);
    } else {
        // Add text to the image
        $src = imagecreatefromstring(file_get_contents($_FILES['file']['tmp_name']));
        $date = new DateTime('now', new DateTimeZone('Asia/Kolkata'));
        $text = $date->format('d-m-Y H:i:s');
        
        $font = realpath(__DIR__ . '/arial.ttf'); // Ensure this path points to a valid TTF font file on your server
        if ($font === false) {
            die("Font file not found!");
        }
        $font_size = 20;
        $text_color = imagecolorallocate($src, 255, 255, 255); // White color
        $x_position = 10;
        $y_position = $height - 10;

        imagettftext($src, $font_size, 0, $x_position, $y_position, $text_color, $font, $text);

        if ($FileType == 'jpg' || $FileType == 'jpeg') {
            imagejpeg($src, $target_path);
        } elseif ($FileType == 'png') {
            imagepng($src, $target_path);
        } elseif ($FileType == 'gif') {
            imagegif($src, $target_path);
        }

        imagedestroy($src);
    }



        
}

$conn->close();

 
?>
