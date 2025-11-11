
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 
 var physical_stock_array = [];
  var mode = "insert";
  var group_id1 = 0
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
get_group_finance_collections()


     check_login();
    
  $("#unamed").text(localStorage.getItem("ls_uname"))


get_employees_dropdown()


  $('#groupForm').on('submit', function (event) {
  event.preventDefault();

  if (!this.checkValidity()) {
    event.stopPropagation();
    $(this).addClass('was-validated');
    return;
  }

  $(this).addClass('was-validated');

  if(mode == "update")
 {
update_group_finance_collections()
 }
 else{
   insert_group_finance_collections()
 }

  // // ✅ All database (AJAX) operations go here
  // if (actionType === 'submit') {
  //   // insert via AJAX
  // } else if (actionType === 'update') {
  //   // update via AJAX
  // }
});

$("#groupTable").on("click", "tr td button", function(event) {
  event.preventDefault();
      var group_id = $(this).val()
  if($(this).hasClass("edit"))
  {
get_group_finance_collections_single(group_id)
  }
  else  if($(this).hasClass("delete"))
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
    
            delete_group_finance_collections(group_id) // <--- submit form programmatically
    
    
          });
        } else {
          swal("Cancelled", "This is safe :)", "error");
        }
      })
      }
  }


  else{
   
  }
});


});


  function delete_group_finance_collections(group_id)
   {
    
   
   $.ajax({
     url: "php/delete_group_finance_collections.php",
     type: "get", //send it through get method
     data: {
     id : group_id

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



  function update_group_finance_collections()
   {
    
   var dc_charge_calculation = parseFloat($('#dc_charge').val())/ parseFloat($('#dc_amount').val())
   var ic_factor =  parseFloat($('#ic_interest').val())/ parseFloat($('#ic_amount').val())
   $.ajax({
     url: "php/update_group_finance_collections.php",
     type: "get", //send it through get method
     data: {
     group_number :  $('#group_number').val(),
employee_id : $("#employee").val(),
collection_day :  $('#collection_day').val(),
assemble_location :  $('#assemble_location').val(),
group_phone :  $('#group_phone').val(),
time_period :  $('#time_period').val(),
group_location_url :  $('#group_location_url').val(),
dc_amount :  parseFloat($('#dc_amount').val()),
dc_charge :  parseFloat($('#dc_charge').val()),
dc_charge_calculation : parseFloat(dc_charge_calculation),

ic_amount :  parseFloat($('#ic_amount').val()),
ic_interest :  parseFloat($('#ic_interest').val()),
ic_factor : parseFloat(ic_factor),
id :group_id1,
start_date : $('#start_date').val()

     },
     success: function (response) {
   
   console.log(response);
   
   if (response.trim() == "ok") {

 location.reload()
   
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }


  function get_group_finance_collections_single(group_id)
   {
    
   
   $.ajax({
     url: "php/get_group_finance_collections_single.php",
     type: "get", //send it through get method
     data: {
     id : group_id
     },
     success: function (response) {
   
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
   
   
     obj.forEach(function (obj) {
        count = count +1;

 $('#group_number').val(obj.group_number)
 $('#employee').val(obj.employee_id)
 $('#collection_day').val(obj.collection_day)
 $('#assemble_location').val(obj.assemble_location)
 $('#group_phone').val(obj.group_phone)
 $('#time_period').val(obj.time_period)
 $('#group_location_url').val(obj.group_location_url)
 $('#dc_amount').val(obj.dc_amount)
 $('#dc_charge').val(obj.dc_charge)

 $('#ic_amount').val(obj.ic_amount)
 $('#ic_interest').val(obj.ic_interest)
group_id1 = obj.id;
mode = "update"
$("#group_submit_btn").addClass("d-none");
$("#group_update_btn").removeClass("d-none");
$('#start_date').val(obj.start_date)
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

  function get_group_finance_collections()
   {
    
   
   $.ajax({
     url: "php/get_group_finance_collections.php",
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
$('#groupTable').append("<tr><td>"+count+"</td><td>"+obj.group_number+"</td><td>"+obj.employee_name+"</td><td>"+obj.collection_day + " ("+obj.start_date_f+ ")"+ "</td><td><button type='button' class='btn btn-outline-primary btn-sm edit border-0' value = '"+obj.id+"'><i class='fa fa-pencil' aria-hidden='true'></i></button> <button  value = '"+obj.id+"' type='button' class='btn btn-outline-danger btn-sm delete border-0' id=''><i class='fa-solid fa-trash'></i></button></td></tr>")

     });
   
    
   }
   else{
   // $("#@id@") .append("<td colspan='5' scope='col'>No Data</td>");
 
   }
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }

  function insert_group_finance_collections()
   {
    
   var dc_charge_calculation = parseFloat($('#dc_charge').val())/ parseFloat($('#dc_amount').val())
   var ic_factor =  parseFloat($('#ic_interest').val())/ parseFloat($('#ic_amount').val())
   $.ajax({
     url: "php/insert_group_finance_collections.php",
     type: "get", //send it through get method
     data: {
     group_number :  $('#group_number').val(),
employee_id : $("#employee").val(),
collection_day :  $('#collection_day').val(),
assemble_location :  $('#assemble_location').val(),
group_phone :  $('#group_phone').val(),
time_period :  $('#time_period').val(),
group_location_url :  $('#group_location_url').val(),
dc_amount :  $('#dc_amount').val(),
dc_charge :  $('#dc_charge').val(),
dc_charge_calculation : dc_charge_calculation,

ic_amount :  $('#ic_amount').val(),
ic_interest :  $('#ic_interest').val(),
ic_factor : ic_factor,
start_date : $('#start_date').val()

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







  function get_employees_dropdown()
   {
    
   
   $.ajax({
     url: "php/get_employees_dropdown.php",
     type: "get", //send it through get method
     data: {
     
     },
     success: function (response) {
   
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
   
   
     obj.forEach(function (obj) {
        count = count +1;
$('#employee').append("<option value = '"+obj.id+"'>"+obj.employee_name+"</option>")

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