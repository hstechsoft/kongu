
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 
 var physical_stock_array = [];
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


get_employees_dropdown()

$("#employee").on("change", function(event) {
  event.preventDefault();
  // TODO: handle click here
  get_emp_payment_report($(this).val())
});

});





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
   var cur_date = ""
   
     obj.forEach(function (obj) {
        count = count +1;
$('#employee').append("<option value = '"+obj.id+"'>"+obj.employee_name+"</option>")
cur_date = obj.cur_date
     });

   
    $("#paid_date").val(cur_date)
   
    
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
  



 function get_emp_payment_report(emp_id)
   {
    
   
   $.ajax({
     url: "php/get_emp_payment_report.php",
     type: "get", //send it through get method
     data: {
      emp_id :emp_id
     },
     success: function (response) {

   console.log(response);
   
   $('#emp_pay_report').empty()
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
  var grand_total =0;
     obj.forEach(function (obj) {
      console.log(obj);
      var acc = ""
       var li = ""
   var ul = ""
   var ul_emp   =  ""
      var li_emp   =  ""
        count = count +1;
var emp_pay = obj.emp_amount_details
if(emp_pay != null)
{

 emp_pay = JSON.parse(emp_pay);
 emp_pay.forEach(function (emp_pay) {
li_emp = "<li class='list-group-item '>"+emp_pay.mode+ " - "+emp_pay.paid_amount+ "</li>"
 })
ul_emp =  "<ul class='list-group '>" + li_emp + "</ul>"
}




var details =  obj.details;
if(details !=null)
{
     details = JSON.parse(details);
     var de_count = 0
 details.forEach(function (details) {
  de_count = de_count+1
var title = details.payment_mode+ "<span class='text-end'>  -- ₹ " +details.mode_sum+ "</span>"
  li = ""
   var pay = details.pay_details;
  // li =  "<li class='list-group-item selected'>"+details.payment_mode+ "<span class='text-end'>  -- ₹ " +details.mode_sum+ "</span></li>"
   
   pay.forEach(function (pay) {
    li = li + "<li class='list-group-item '>"+pay.user_name + " - "+pay.paid_amount +"</li>"
    
   })
ul = "<ul class='list-group small'>" + li + "</ul>"
acc = acc +"<div class='accordion ' id='acc_"+count+"_"+de_count+"' > <div class='accordion-item'> <h2 class='accordion-header small'> <button class='accordion-button collapsed small' type='button' data-bs-toggle='collapse' data-bs-target='#acc__item"+count+"_"+de_count+"' aria-expanded='true' aria-controls='acc__item"+count+"_"+de_count+"'> "+title+" </button> </h2> <div id='acc__item"+count+"_"+de_count+"' class='accordion-collapse collapse hide' data-bs-parent='#acc_"+count+"_"+de_count+"'> <div class='accordion-body m-0 p-0 small'>"+ul+ "</div> </div> </div></div>"
 })
}

console.log(acc);

grand_total = grand_total + parseFloat(obj.total_amount)
$('#emp_pay_report').append("<tr class=\"small\"><td>"+count+"</td><td>"+obj.paid_date+"</td><td>"+obj.team+"</td><td>"+acc+ "</td><td>"+obj.total_amount+ "</td>></tr>")


     });
   $('#emp_pay_report').append("<tr class=\"small\"><td colspan='4'>"+"Total"+"</td><td colspan='4'>"+grand_total.toFixed(2)+"</td></tr>")
    $('#emp_pay_report').append("<tr class=\"small\"><td colspan='4'>"+"Expenses"+"</td><td colspan='4'>"+grand_total.toFixed(2)+"</td></tr>")
     $('#emp_pay_report').append("<tr class=\"small\"><td colspan='4'>"+"Cash In hand"+"</td><td colspan='4'>"+grand_total.toFixed(2)+"</td></tr>")
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