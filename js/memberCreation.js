
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 
 var physical_stock_array = [];
  var property = "";
  var interest = 0
  var dc_amount = 0
  var total_amount = 0
  var memberid = 0
$(document).ready(function(){
 
  
  $("#menu_bar").load('menu.html',
    function() { 
      var lo = (window.location.pathname.split("/").pop());
      var web_addr = "#"+ (lo.substring(0, lo.indexOf(".")))
 
    
     if($(web_addr).find("a").hasClass('nav-link'))
     {
      $(web_addr).find("a").toggleClass('active')
     }
     else if($(web_addr).find("a").hasClass('dropdown-item'))
{
$(web_addr).parent().parent().find("a").eq(0).toggleClass('active')
}
      
     
    }
 );



    // check_login();
    
  $("#unamed").text(localStorage.getItem("ls_uname"))

get_team_dropdown()

 get_members()

    // Show/hide nominee address fields
    $('#different_address').on('change', function () {
        $('#nominee_address_fields').toggle(this.checked);
    });
$('#user_photo_preview').click(function () {
  

    $("#user_photo_up").trigger("click");
   
   });

   
   $('#user_photo_up').on('change',function ()
{
 property =this.files[0];

shw_toast("File Selected","File Name : " + property.name + " | File Size : " + (property.size/1024).toFixed(2) + " KB","info");
  var reader = new FileReader();
  reader.onload = function (e) {
      $('#user_photo_preview').attr('src', e.target.result);
  }
  reader.readAsDataURL(this.files[0]);
 

});

  $('#memberForm').on('submit', function (event) {
  event.preventDefault();

  if (!this.checkValidity()) {
    event.stopPropagation();
    $(this).addClass('was-validated');
    return;
  }

  $(this).addClass('was-validated');

  if($('#team_select').find(":selected").val() == "")
  {
    shw_toast("Error","Please select Team","error");
    return;
  }
  if($("#amount").val() == "" || parseFloat($("#amount").val()) <= 0)
  {
    shw_toast("Error","Please enter valid Amount","error");
    return;
  } 
  if(property == "")
  {
    if($("#submit_btn").hasClass("d-none") == false)
    {
   shw_toast("Error","Please select Photo","error");
    return;
    }
    

 
  }
  if($("#user_name").val().trim() == "")
  {
    shw_toast("Error","Please enter Name","error");
    return;
  }

  if($("#start_date").val().trim() == "" )
  {
    shw_toast("Error","Please select Start Date","error");
    return;
  }

  if ($("#submit_btn").hasClass("d-none") == false) {
    upload_user_photo(property, "user_photo", "#user_photo_preview");
  } else {
    if (property != "") {
      console.log(memberid);
      
       update_photo(property,memberid);
    } else {
      // No photo selected, do nothing or show a message if needed
      update_user_info("",memberid)
    }
  }
});

$("#team_select").on("change", function(event) {
  event.preventDefault();
  // your logic here

  if($(this).val() != "")
  {

     $("#start_date").val("2025-02-12");
    $("#amount").prop("disabled", false);
     $("#amount").focus()
    // Dynamically set the start date input based on selected team's start_date
   
  }

    
});



$("#amount").on("input", function(event) {
 
  // TODO: handle live input change
var selected = $('#team_select option:selected');

// Get its data attributes
var icFactor   = selected.data('ic_factor');
var dcFactor   = selected.data('dc_factor');
var timePeriod = selected.data('time_period');
var dc = parseFloat($(this).val()) * parseFloat(dcFactor)



var interest_only = (parseFloat($(this).val()) ) * icFactor 
var total =  (parseFloat($(this).val()) )  + interest_only
var amount_week = total/timePeriod;




$("#summary_table").find("tr").eq(0).find("td").eq(0).html($(this).val() +  "(" + total + ")")
$("#summary_table").find("tr").eq(1).find("td").eq(0).html(timePeriod + " Weeks" + "(" + amount_week + ")")
$("#summary_table").find("tr").eq(2).find("td").eq(0).html(dc)
$("#summary_table").find("tr").eq(3).find("td").eq(0).html(parseFloat($(this).val()) - dc)

interest = interest_only
dc_amount =  dc
total_amount = total
});

$("#leader").on("change", function(event) {
  event.preventDefault();

  if($("#leader").prop("checked") == true)
  {
    $("#team_select option").each(function() {
      if($(this).data("leader") == "leader")
      {
        $(this).prop("disabled",true)
      }
      else
      {
         $(this).prop("disabled",false)
      }
     
    });
  }

  
  if($("#leader").prop("checked") == false)
  {
    $("#team_select option").each(function() {
     
        $(this).prop("disabled",false)
    });
  }
  // your logic here
});

$("#membersTable").on("click", "tr td button", function(event) {
  event.preventDefault();
  // your logic here
if($(this).hasClass("hide_btn"))
{
 console.log($(this).data("gid"));

  var hide_element = $("."+$(this).data("gid"))

  hide_element.toggleClass("d-none")

  console.log(hide_element.hasClass("d-none"));
// element is shown
if(hide_element.hasClass("d-none")==false)
{
 $(this).find("i").removeClass("fa-angle-down");
   $(this).find("i").addClass("fa-angle-up");
}
else
{
  $(this).find("i").removeClass("fa-angle-up");
   $(this).find("i").addClass("fa-angle-down");
}
}


else if($(this).hasClass("edit"))
{
 var member_id = $(this).val();
get_members_single(member_id)
 
}

else if($(this).hasClass("delete"))
{
  var member_id = $(this).val();
  var memberid1 = $(this).val()
  
    {
    swal({
      title: "Are you sure - Delete? ",
      text: "You will not be recover this  again!",
      icon: "warning",
      buttons: [
        'No, cancel it!',
        'Yes, I am sure!'
      ],
      dangerMode: true,
    }).then(function(isConfirm) {
      if (isConfirm) {
        swal({
          title: 'Applied!',
          text: 'successfully Deleted!',
          icon: 'success'
        }).then(function() {
  
          delete_members(memberid1) // <--- submit form programmatically
  
  
        });
      } else {
        swal("Cancelled", "This is safe :)", "error");
      }
    })
    }
}

  
});

});


  function delete_members(memberid1)
   {
    
   
   $.ajax({
     url: "php/delete_members.php",
     type: "get", //send it through get method
     data: {
     id : memberid1

     },
     success: function (response) {
   
   
   if (response.trim() == "ok") {

 location.reload()
   
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }




 function update_user_info(path, memberid)
  {

     var is_addr_differ = 0
var leader = 0

if($("#leader").prop("checked") == true) 
{
    leader = 1
}
if($("#different_address").prop("checked") == true) 
{
    is_addr_differ = 1
}

     
      var emi = total_amount /  parseFloat($('#team_select option:selected').data('time_period'))
      var time_period = parseFloat($('#team_select option:selected').data('time_period'))



   
   $.ajax({
     url: "php/update_members.php",
     type: "get", //send it through get method
 
    

       data: {
     user_name :  $('#user_name').val(),
phone :  $('#phone').val(),
phone2 :  $('#phone2').val(),
aadhar :  $('#aadhar').val(),
city :  $('#city').val(),
district :  $('#district').val(),
pincode :  $('#pincode').val(),
location_url :  $('#location_url').val(),
leader : leader,
nominee_name :  $('#nominee_name').val(),
nominee_phone :  $('#nominee_phone').val(),
nominee_phone2 :  $('#nominee_phone2').val(),
nominee_aadhar :  $('#nominee_aadhar').val(),
nominee_relationship :  $('#nominee_relationship').val(),
nominee_city :  $('#nominee_city').val(),
nominee_district :  $('#nominee_district').val(),
nominee_pincode :  $('#nominee_pincode').val(),
nominee_location_url :  $('#nominee_location_url').val(),
teamid :  $('#team_select').find(":selected").val(),
amount :  $('#amount').val(),
dc_amount : dc_amount,
after_dc_factor_amount : 0,
interest : interest,
totalAmount : total_amount,
photo : path,
verification :  $('#verification').val(),
nominee_verification :  $('#nominee_verification').val(),
pending_amount : 0,
is_addr_differ : is_addr_differ,
start_date :  $('#start_date').val(),
id : memberid,
emi : emi,
time_period : time_period,


     },
     success: function (response) {
   
   console.log(response);
   
   
           if(response.trim() == "ok")
           {
            location.reload()
           }
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   

  }


function update_photo(property,memberid)
{
  if (!property) {
    return; // No file selected
}
  var file_name = property.name;
  var file_extension = file_name.split('.').pop().toLowerCase();
{
 var form_data = new FormData();
 form_data.append("file",property);
 form_data.append("team_id",$('#team_select').find(":selected").val());
 form_data.append("member_id",  memberid);
  form_data.append("file_ext",file_extension);
   
     // Show the overlay and reset progress bar
    
 
      $.ajax({
          url:'update_user_photo.php',
          method:'POST',
          data:form_data,
          contentType:false,
          cache:false,
          processData:false,
          beforeSend:function(){
          //  $('#msg').html('Loading......');
          console.log('Loading......');
         
          },
         
          success:function(data){
          
         console.log(data);
         
         var path_d = "images/group/"+$('#team_select').find(":selected").val() + "/"+  memberid + "." + file_extension
         update_user_info(path_d,memberid);
         
        
          }
        });
      
  }


}



function get_members_single(member_id)
{
 

$.ajax({
  url: "php/get_members_single.php",
  type: "get", //send it through get method
  data: {
  id : member_id

  },
  success: function (response) {
console.log(response);


if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {
$("#submit_btn").addClass("d-none")
$("#update_btn").removeClass("d-none")

property = ""
  var obj = JSON.parse(response);
var count =0 


  memberid = member_id
  // $('#different_address').prop('checked', true).trigger('change');
obj.forEach(function (obj) {

if(obj.is_addr_differ == "1")
{
  $('#different_address').prop('checked', true).trigger('change');
}
else
{
  $('#different_address').prop('checked', false).trigger('change');
}
     count = count +1;
$('#user_name').val(obj.user_name)
$('#phone').val(obj.phone)
$('#phone2').val(obj.phone2)
$('#aadhar').val(obj.aadhar)
$('#city').val(obj.city)
$('#district').val(obj.district)
$('#pincode').val(obj.pincode)
$('#location_url').val(obj.location_url)
if(obj.leader == "1")
{
  $('#leader').prop('checked', true).trigger('change');
}
else
{
  $('#leader').prop('checked', false).trigger('change');
} 
  

$('#nominee_name').val(obj.nominee_name)
$('#nominee_phone').val(obj.nominee_phone)
$('#nominee_phone2').val(obj.nominee_phone2)
$('#nominee_aadhar').val(obj.nominee_aadhar)
$('#nominee_relationship').val(obj.nominee_relationship)
$('#nominee_city').val(obj.nominee_city)
$('#nominee_district').val(obj.nominee_district)
$('#nominee_pincode').val(obj.nominee_pincode)
$('#nominee_location_url').val(obj.nominee_location_url)
$('#team_select').val(obj.teamid).trigger('change');
$('#amount').val(obj.amount).trigger('input');
$('#dc_amount').val(obj.dc_amount)
$('#after_dc_factor_amount').val(obj.after_dc_factor_amount)
$('#interest').val(obj.interest)
$('#totalAmount').val(obj.totalAmount)
$('#photo').val(obj.photo)
$('#verification').val(obj.verification)
$('#nominee_verification').val(obj.nominee_verification)
$('#created_at').val(obj.created_at)
$('#pending_amount').val(obj.pending_amount)
$("#user_photo_preview").attr("src",obj.photo)
$("#start_date").val(obj.start_date)
  });


 
}
else{
// $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");

}
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}


 function get_members()
   {
    
   
   $.ajax({
     url: "php/get_members.php",
     type: "get", //send it through get method
     data: {
     
     },
     success: function (response) {
   
   console.log(response);
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
   
   
     obj.forEach(function (obj) {
        count = count +1;
// $('#membersTable').append("<tr><td>"+count+"</td><td>"+obj.user_name+"</td><td>"+obj.phone+"</td> <td>"+obj.totalAmount+"</td><td> <div style='width: 90px; height : 90px; overflow: hidden;'> <img src='"+obj.photo+"' class='img-fluid img-thumbnail' style='height: 100%; width: 100%; object-fit:contain ;' alt=''> </div></td><td><button type='button' class='btn btn-outline-primary btn-sm edit border-0' value = '"+obj.id+"'><i class='fa fa-pencil' aria-hidden='true'></i></button> <button  value = '"+obj.id+"' type='button' class='btn btn-outline-danger btn-sm delete border-0' id=''><i class='fa-solid fa-trash'></i></button></td></tr>")


$('#membersTable').append("<tr><td colspan = '7'> <div class = 'd-flex justify-content-between'><p class='p-0 m-0'>"+ obj.group_mem + "</p><p class='p-0 m-0'> (Total - " +obj.total_members +  ")  <span class = 'fw-bold ms-4'>("+obj.g_total+")</span> </p><button type='button' class='btn btn-outline-success border-0 btn-sm hide_btn' data-gid='"+obj.gid+"' ><i class='fa fa-angle-down' aria-hidden='true'></i></button> </td></tr> "+ obj.mem)
     });
   
    
   }
   else{
   // $("#@id@") .append("<td colspan='3' scope='col'>No Data</td>");
 
   }
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }

  function get_team_dropdown()
   {
    
   
   $.ajax({
     url: "php/get_team_dropdown.php",
     type: "get", //send it through get method
     data: {
     
     },
     success: function (response) {
   console.log(response);
   
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
   
   
     obj.forEach(function (obj) {
        count = count +1;
$('#team_select').append("<option value='"+obj.id+"' data-ic_factor='"+obj.ic_factor+"' data-dc_factor='"+obj.dc_charge_calculation+"' data-time_period='"+obj.time_period+"' data-leader='"+obj.leader_sts+"'data-start_date='"+ obj.start_date+"'>"+obj.group_mem+"</option>")

     });
   
    
   }
   else{
   // $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");
 
   }
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }


 function upload_user_photo(property,fname,preview)
  {
    if (!property) {
      return; // No file selected
  }
    var file_name = property.name;
    var file_extension = file_name.split('.').pop().toLowerCase();
  {
   var form_data = new FormData();
   form_data.append("file",property);
    var is_addr_differ = 0
var leader = "no"

if($("#leader").prop("checked") == true) 
{
    leader = "yes"
}
if($("#different_address").prop("checked") == true) 
{
    is_addr_differ = 1
}


   form_data.append("file_name", + "demo" + file_extension);
   form_data.append("file_name","demo" + "." + file_extension);
     form_data.append("file_ext",file_extension);
      form_data.append("user_name",$("#user_name").val());
   
    form_data.append("nominee_name",$("#nominee_name").val());
    form_data.append("phone",$("#phone").val());
    form_data.append("nominee_phone",$("#nominee_phone").val());
    form_data.append("phone2",$("#phone2").val());
    form_data.append("nominee_phone2",$("#nominee_phone2").val());
    form_data.append("aadhar",$("#aadhar").val());
    form_data.append("nominee_aadhar",$("#nominee_aadhar").val());
    form_data.append("city",$("#city").val());
    form_data.append("nominee_relationship",$("#nominee_relationship").val());
    form_data.append("different_address",different_address);
    form_data.append("district",$("#district").val());
    form_data.append("nominee_city",$("#nominee_city").val());
    form_data.append("pincode",$("#pincode").val());
    form_data.append("nominee_district",$("#nominee_district").val());
    form_data.append("location_url",$("#location_url").val());
    form_data.append("nominee_pincode",$("#nominee_pincode").val());
    form_data.append("nominee_location_url",$("#nominee_location_url").val());
    form_data.append("team_id",$('#team_select').find(":selected").val());
    form_data.append("amount",$("#amount").val());
  form_data.append("start_date",$("#start_date").val());
    form_data.append("is_addr_differ",is_addr_differ);
    form_data.append("verification",$("#verification").val());
    form_data.append("nominee_verification",$("#nominee_verification").val());
     
       var emi = total_amount /  parseFloat($('#team_select option:selected').data('time_period'))
      var time_period = parseFloat($('#team_select option:selected').data('time_period'))
  form_data.append("emi",emi);
  form_data.append("time_period",time_period);
    if($("#leader").prop("checked") == true)
    form_data.append("leader","1");
  else
     form_data.append("leader","0");
   form_data.append("dc_amount",team_select);
       form_data.append("after_dc_factor_amount","0");
         form_data.append("interest",interest);
         form_data.append("totalAmount",total_amount);
           form_data.append("pending_amount","0");
       // Show the overlay and reset progress bar
          form_data.append("start_date",$('#start_date').val());

        $.ajax({
            url:'upload_user_photo.php',
            method:'POST',
            data:form_data,
            contentType:false,
            cache:false,
            processData:false,
            beforeSend:function(){
            //  $('#msg').html('Loading......');
            console.log('Loading......');
           
            },
           
            success:function(data){
            
           if(data.trim() == "ok")
           {
            location.reload()
           }
             console.log(data);
            //  // $('#msg').html(data);
            //  var timestamp = new Date().getTime(); // Get current timestamp
            
            //  $(preview).attr("src", "attachment/delivery/" + did + "/" + $("#chasis_no").val() + "." + file_extension + "?" + timestamp);
            //  $("#dsubmit").show()
         
          
            }
          });
        
    }
  
  }


  

   



function check_login()
{
 
if (localStorage.getItem("logemail") == null && phone_id == null )  {
 window.location.replace("login.html");
}
else if (localStorage.getItem("logemail") == null && phone_id != null )
 {
get_current_userid_byphoneid();
$('#menu_bar').hide()
 }

 else
 {
   
 }
}


function get_current_userid_byphoneid()
   {
     $.ajax({
       url: "php/get_current_employee_id_byphoneid.php",
       type: "get", //send it through get method
       data: {
         phone_id:phone_id,
        
      
      },
       success: function (response) {
      
      
      if (response.trim() != "error") {
       var obj = JSON.parse(response);
      

      console.log(response);
      
      
       obj.forEach(function (obj) {
         current_user_id = obj.emp_id;
         current_user_name =  obj.emp_name;
       });
      
    //    get_sales_order()
      }
      
      else {
       salert("Error", "User ", "error");
      }
      
      
         
       },
       error: function (xhr) {
           //Do Something to handle error
       }
      });
   }

  
   function shw_toast(title,des,theme)
   {
   
     
         $('.toast-title').text(title);
         $('.toast-description').text(des);
   var toast = new bootstrap.Toast($('#myToast'));
   toast.show();
   }  

   function get_millis(t)
   {
    
    var dt = new Date(t);
    return dt.getTime();
   }



   function get_cur_millis()
   {
    var dt = new Date();
    return dt.getTime();
   }


   function get_today_date(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    var hour = date.getHours();
    var mins = date.getMinutes();
  
console.log(mins)

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today = year + "-" + month + "-" + day +"T"+ hour + ":"+ mins; 
    return today;
   }

   function get_today_start_millis(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today = year + "-" + month + "-" + day +"T00:00"; 

    return get_millis(today)
     
   }


   function get_today_end_millis(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today = year + "-" + month + "-" + day +"T23:59"; 

    return get_millis(today)
     
   }

   function salert(title, text, icon) {
  

    swal({
        title: title,
        text: text,
        icon: icon,
    });
}



function millis_to_date( millis)
{
  var d = new Date(millis); // Parameter should be long value

  
return d.toLocaleString('en-GB');

}