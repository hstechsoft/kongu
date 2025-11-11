
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 
 var physical_stock_array = [];
$(document).ready(function(){
 $("#individual_div").hide()
  
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

const dateInput = document.getElementById('demo_date');
  const today = new Date().toISOString().split('T')[0];

  // Disable dates after today
  dateInput.setAttribute('max', today);

  // Auto validate when user selects/enters a date
  dateInput.addEventListener('input', function () {
    if (dateInput.value > today) {
      dateInput.classList.add('is-invalid');
    } else {
      dateInput.classList.remove('is-invalid');
    }
  });



get_team_dropdown()
get_employees_dropdown()
      $("#switch_view").on("change", function(event) {

 $("#group_div").toggle();
 
 $("#individual_div").toggle();

});


$("#team_select").on("change", function(event) {
  event.preventDefault();
  // your logic here
  get_team_members($(this).val())
});

$("#member_select").on("change", function(event) {
  event.preventDefault();
  // your logic here
  $("#group_txt").text("individual Payment Entry")
   $("#group_txt").closest(".card-header").addClass("text-bg-success")

    get_payment_dashboard($(this).val());
  get_emi_table($("#team_select").val())
if($(this).val() == "all")
{
    $("#group_txt").text("Group Payment Entry")
   $("#group_txt").closest(".card-header").removeClass("text-bg-success") 
   
}

});

$('#group_pay_table').on("change", "tr td input[type='checkbox']", function(event) {
  event.preventDefault();


  if($(this).is(':checked')) {
    $(this).closest('tr').find('td').eq(3).attr('contenteditable', 'true');
     $(this).closest('tr').find('td').eq(3).text(parseFloat($(this).closest('tr').find('td').eq(2).text(),2));

  } else {
    
    $(this).closest('tr').find('td').eq(3).attr('contenteditable', 'false');
    $(this).closest('tr').find('td').eq(3).text('0');
  }
});


$("#reset_group_btn").on("click", function(event) {
  // Do not reset until confirm
  event.preventDefault();
  // TODO: handle click here


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

         $("#group_pay_table").empty();
         // Optionally reset other related UI elements
         $("#pay_date").text("");
         $("#group_txt").text("Group Payment Entry");
         $("#group_txt").closest(".card-header").removeClass("text-bg-success");
          $('#member_select').val('');
            $('#team_select').val('');
              $('#demo_date').val('');
          

      });
    } else {
      swal("Cancelled", "This is safe :)", "error");
    }
  })
  }

}); 

  $('#pay_form').on('submit', function (event) {
  event.preventDefault();

  if (!this.checkValidity()) {
    event.stopPropagation();
    $(this).addClass('was-validated');
  shw_toast("Error","Kindly fill all required fields","error")
    return;
  }

  $(this).addClass('was-validated');

  // // ✅ All database (AJAX) operations go here
  // if (actionType === 'submit') {
  //   // insert via AJAX
  // } else if (actionType === 'update') {
  //   // update via AJAX
  // }
insert_memberspayment()

});

});

  function insert_memberspayment()
   {
    var pay_details = [];
    $("#group_pay_table tr").each(function() {

      if($(this).find("td").eq(5).find("input[type='checkbox']").is(':checked'))
      {
   var inputParts = $(this).find("td").eq(1).find("li");
      // your logic here
       var member_id = $(this).data("mem_id");  
var paid_date = $('#demo_date').val();
var is_paid = 1;
var paid_amount  = parseFloat($(this).find("td").eq(3).text());
var payment_mode = $(this).find("td").eq(4).find("select").val();
var emp_id = $('#employee').val();
pay_details.push({
    member_id: member_id,
    paid_date: paid_date,
    is_paid: is_paid,
    paid_amount: paid_amount,
    payment_mode: payment_mode,
    emp_id: emp_id,
    created_at: get_cur_millis()
}); 

      }
   



    });
   
   $.ajax({
     url: "php/insert_memberspayment.php",
     type: "POST", //send it through get method
     data: {
      // Disable submit button before AJAX success
     
pay_details : JSON.stringify(pay_details)
     },
     success: function (response) {
   
   console.log(response);
   
   if (response.trim() == "ok") {

 
   
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
  


 function get_team_members(team_id)
   {
    
   
   $.ajax({
     url: "php/get_team_members_dropdown.php",
     type: "get", //send it through get method
     data: {
     team_id : team_id
     },
     success: function (response) {
   console.log(response);
   
   $('#member_select').empty()
   $('#member_select').append("<option value='' disabled selected>Select Member</option>")
     $('#member_select').append("<option value='all'>All Member</option>")
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
   
   
     obj.forEach(function (obj) {
        count = count +1;
$('#member_select').append("<option value='"+obj.id+"'>"+obj.member+"</option>")

     });
   
    get_emi_table(team_id)
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


   
 function get_emi_table(team_id)
   {
    var mem_query = "1";
    if($("#member_select").val() != null  && $("#member_select").val() != undefined && $("#member_select").val() != "" && $("#member_select").val() != "all")
    {
        mem_query = " member_id = " + $("#member_select").val();
    }
   
   $.ajax({
     url: "php/get_emi_table.php",
     type: "get", //send it through get method
     data: {
        team_id : team_id,
        mem_query : mem_query

     },
     success: function (response) {
   console.log(response);
   $('#group_pay_table').empty()
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
var amountPay =   0;

 
   
     obj.forEach(function (obj) {
      amountPay =   obj.adv
        $("#pay_date").text("Payment On/Before - " + obj.collection_date)
        count = count +1;
        var pay_amount = obj.adv
        if(parseInt(obj.adv)<= 0)
        {
            let value = parseInt(obj.adv || 0, 10);

            pay_amount = "Advance available - " + Math.abs(value)
        }
$('#group_pay_table').append("<tr data-mem_id='"+obj.member_id+"'><td><div style='width: 50px; height:50px; overflow: hidden;'> <img src='"+obj.photo+"' class='img-fluid img-thumbnail' style='height: 100%; width: 100%; object-fit:contain ;' alt=''> </div></td><td>"+obj.member+"</td><td>"+pay_amount+"</td><td contenteditable = 'true'>"+amountPay+"</td><td> <select class='form-select' id='' > <option value='Cash' selected>Cash</option> <option value='UPI'>UPI</option> <option value='Bank Transfer'>Bank Transfer</option> <option value='Cheque'>Cheque</option> <option value='Other'>Other</option> </select> <label for=''></label></td><td><div class='form-check '> <input class='form-check-input' checked type='checkbox' value='"+obj.member_id+"' > <label class='form-check-label' for=''> </label></div></td></tr>")

     });
   
   
   }
   else{
    $("#group_pay_table") .append("<tr class='text-bg-secondary text-center'><td colspan='6' scope='col'>No Data</td></tr>");
 
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
$('#team_select').append("<option value='"+obj.id+"' data-ic_factor='"+obj.ic_factor+"' data-dc_factor='"+obj.dc_charge_calculation+"' data-time_period='"+obj.time_period+"' data-leader='"+obj.leader_sts+"'>"+obj.group_mem+"</option>")

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




  function get_payment_dashboard(team_id)
   {
    
   
   $.ajax({
     url: "php/get_payment_dashboard.php",
     type: "get", //send it through get method
     data: {

team_id : team_id

     },
     success: function (response) {

      console.log(response);
   var count = 0;
    if (response.trim() != "error") {
       var obj = JSON.parse(response);
      

      
      
       obj.forEach(function (obj) {
     count = count + 1;
    //    $('#report_tbl').append("<tr><td>"+count+"</td><td>"+obj.collection_date+"</td><td>"+obj.expected_amount+"</td><td>"+obj.total_paid+"</td><td>"+obj.pending_balance+"</td><td>"+obj.amount_to_pay+"</td><td>"+obj.available_advance+"</td><td>"+obj.sts+"</td><td>"+obj.his_html+"</td></tr>")
       

        $('#report_tbl').append("<tr><td>"+count+"</td><td>"+obj.collection_date+"</td><td>"+obj.expected_amount+"</td><td>"+obj.total_paid+"</td><td>"+obj.amount_to_pay+"</td><td>"+obj.available_advance+"</td><td>"+obj.sts+"</td><td>"+obj.his_html+"</td></tr>")
       });
      
    //    get_sales_order()
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