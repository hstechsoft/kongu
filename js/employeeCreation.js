
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 
 var physical_stock_array = [];
 var mode = "insert";
 var emp_id = 0;
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



     check_login();
    
  $("#unamed").text(localStorage.getItem("ls_uname"))

  $('#employeeForm').on('submit', function (event) {
  event.preventDefault();

  if (!this.checkValidity()) {
    event.stopPropagation();
    $(this).addClass('was-validated');
        shw_toast("Error","Kindly fill All details")
    return;

  }

  $(this).addClass('was-validated');

  // // ✅ All database (AJAX) operations go here
  // if (actionType === 'submit') {
  //   // insert via AJAX
  // } else if (actionType === 'update') {
  //   // update via AJAX
  // }
if(mode == "update")
 {
update_employees()
 }
 else{
    insert_employees()
 }
});


get_employees()

$("#employeeTable").on("click", "tr td button", function(event) {
  event.preventDefault();
      var employee_id = $(this).val()
  if($(this).hasClass("edit"))
  {
get_employees_single(employee_id)
  }
  else
  {

    
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
    
            delete_employees(employee_id) // <--- submit form programmatically
    
    
          });
        } else {
          swal("Cancelled", "This is safe :)", "error");
        }
      })
      }
  }
});


      $("#togglePassword").on("click", function () {
            let passwordField = $("#employee_password");
            let type = passwordField.attr("type") === "password" ? "text" : "password";
            passwordField.attr("type", type);

            $(this).toggleClass("fa-eye fa-eye-slash");
        });
});


  function delete_employees(employee_id)
   {
    
   
   $.ajax({
     url: "php/delete_employees.php",
     type: "get", //send it through get method
     data: {
     id : employee_id

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




  function insert_employees()
   {
    
   
   $.ajax({
     url: "php/insert_employees.php",
     type: "get", //send it through get method
     data: {
     employee_name :  $('#employee_name').val(),
phone :  $('#phone').val(),
alt_phone :  $('#alt_phone').val(),
aadhar :  $('#aadhar').val(),
voter_id :  $('#voter_id').val(),
address :  $('#address').val(),
location_url :  $('#location_url').val(),
employee_login :  $('#employee_login').val(),
employee_password :  $('#employee_password').val(),
created_at :  $('#created_at').val(),
emp_salary :  $('#employee_salary').val()

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




  function update_employees()
   {
    
   
   $.ajax({
     url: "php/update_employees.php",
     type: "get", //send it through get method
     data: {
     employee_name :  $('#employee_name').val(),
phone :  $('#phone').val(),
alt_phone :  $('#alt_phone').val(),
aadhar :  $('#aadhar').val(),
voter_id :  $('#voter_id').val(),
address :  $('#address').val(),
location_url :  $('#location_url').val(),
employee_login :  $('#employee_login').val(),
employee_password :  $('#employee_password').val(),
created_at :  $('#created_at').val(),
id : emp_id,
emp_salary :  $('#employee_salary').val()

     },
     success: function (response) {
   console.log(response);
   
   
   if (response.trim() == "ok") {
shw_toast("success","update successfully")
 
   
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }




  function get_employees_single(employee_id)
   {
    
   
   $.ajax({
     url: "php/get_employees_single.php",
     type: "get", //send it through get method
     data: {
     id : employee_id

     },
     success: function (response) {
   
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
   
   
     obj.forEach(function (obj) {
        count = count +1;
        $("#employee_salary").val(obj.emp_salary)
 $('#employee_name').val(obj.employee_name)
 $('#phone').val(obj.phone)
 $('#alt_phone').val(obj.alt_phone)
 $('#aadhar').val(obj.aadhar)
 $('#voter_id').val(obj.voter_id)
 $('#address').val(obj.address)
 $('#location_url').val(obj.location_url)
 $('#employee_login').val(obj.employee_login)
 $('#employee_password').val(obj.employee_password)
 $('#created_at').val(obj.created_at)
$("#emp_submit_btn").addClass("d-none");
$("#emp_update_btn").removeClass("d-none");
mode = "update"
emp_id = obj.id
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


  function get_employees()
   {
    
   
   $.ajax({
     url: "php/get_employees.php",
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
$('#employeeTable').append("<tr><td>"+count+"</td><td>"+obj.employee_name+"</td><td>"+obj.phone+"</td><td><button type='button' class='btn btn-outline-primary btn-sm edit border-0' value = '"+obj.id+"'><i class='fa fa-pencil' aria-hidden='true'></i></button> <button  value = '"+obj.id+"' type='button' class='btn btn-outline-danger btn-sm delete border-0' id=''><i class='fa-solid fa-trash'></i></button></td></tr>")

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