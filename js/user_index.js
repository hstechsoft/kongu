
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

 $("#download_report_entry").hide();

     check_login();
    
  $("#unamed").text(localStorage.getItem("ls_uname"))






get_team_dropdown()
// get_employees_dropdown()
      $("#switch_view").on("change", function(event) {

 $("#group_div").toggle();
 
 $("#individual_div").toggle();

});


$("#team_select").on("change", function(event) {
  event.preventDefault();
  // your logic here
  get_team_members($(this).val())
  get_payment_dashboard_all($(this).val())
});

$("#member_select").on("change", function(event) {
  event.preventDefault();
  // your logic here
  $("#group_txt").text("individual Payment Entry")
   $("#group_txt").closest(".card-header").addClass("text-bg-success")

    get_payment_dashboard($(this).val());
  get_emi_table($('#team_select').val())

if($(this).val() == "all")
{
    $("#group_txt").text("Group Payment Entry")
   $("#group_txt").closest(".card-header").removeClass("text-bg-success") 
   
}

});

$('#group_pay_table').on("change", "tr td input[type='checkbox']", function(event) {
  event.preventDefault();


  if($(this).is(':checked')) {
    $(this).closest('tr').find('td').eq(2).attr('contenteditable', 'true');
     $(this).closest('tr').find('td').eq(2).text(  $(this).closest('tr').find('td').eq(2).data("amount"));

  } else {
    
    $(this).closest('tr').find('td').eq(2).attr('contenteditable', 'false');
    $(this).closest('tr').find('td').eq(2).text('0');
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
              $('#collection_date').val('');
          

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

$("#collection_date").on("change", function(event) {
  event.preventDefault();
  // your logic here
  get_emi_table($('#team_select').val())
  $("#paid_date").val($(this).val())
});


$("#download_report").click(function () {
  $("#report_full_tbl").table2excel({
    filename:  $("#team_select").find("option:selected").text() + "_Payment Dashboard" +  ".xls", // File name
    name: "Report"          // Sheet name
  });
});



$("#download_report_entry").click(function () {
  $("#report_entry_tbl").table2excel({
    filename:  $("#team_select").find("option:selected").text() + "_Entry Sheet" +  ".xls", // File name
    name: "Report"          // Sheet name
  });
});


$("#toggle_report").on("change", function(event) {




  // TODO: handle click here
  if($(this).prop("checked")) {
    $("#report_full_div").addClass("d-none")
    $("#report_entry_div").removeClass("d-none")

$("#download_report").toggle();
$("#download_report_entry").toggle();
  }
  else {
    $("#report_full_div").removeClass("d-none")
    $("#report_entry_div").addClass("d-none")

$("#download_report").toggle();
$("#download_report_entry").toggle();
  }
});




$("#pdf_button").on("click", function(event) {
  event.preventDefault();
  // TODO: handle click here

  const printContent = $("#report_entry_tbl").prop("outerHTML");

  const printWindow = window.open('', '', 'width=1200,height=900');

  // Copy all <link> and <style> tags from current document
  $('link[rel="stylesheet"], style').each(function () {
    printWindow.document.write(this.outerHTML);
  });

  // Force A4 Landscape
  printWindow.document.write('<style>@page { size: A4 landscape; margin: 1mm; }</style>');

  // Write the content to print
  printWindow.document.write('<body>');
  printWindow.document.write(printContent);
  printWindow.document.write('</body>');

  printWindow.document.close();
  printWindow.focus();

  // Wait a bit to ensure styles are applied, then print
  setTimeout(function () {
    printWindow.print();

    // Fallback close: close after 1s even if onafterprint doesn't fire
    const closeTimer = setTimeout(() => {
      if (!printWindow.closed) printWindow.close();
    }, 1000);

    // Try to use onafterprint if supported
    printWindow.onafterprint = () => {
      clearTimeout(closeTimer);
      printWindow.close();
    };
  }, 300);
});

$('#group_txt_auto').on('input',function(){
   //check the value not empty
       if($('#group_txt_auto').val() !="")
       {
         $('#group_txt_auto').autocomplete({
           //get data from databse return as array of object which contain label,value

           source: function(request, response) {
             $.ajax({
               url: "php/get_group_auto.php",
               type: "get", //send it through get method
               data: {
               term :request.term


             },
             dataType: "json", 
               success: function (data) {

             console.log(data);
             response($.map(data, function(item) {
               return {
                   label: item.group_number,
                   value: item.group_number,
                   id:item.id
                 
               };
           }));

               }

             });
           },
           minLength: 2,
           appendTo: "body",
           cacheLength: 0,
           select: function(event, ui) {
          
            $('#team_select').val( ui.item.id).trigger('change');

  
             
            // get_bom(ui.item.id)


           } ,

         }).autocomplete("instance")._renderItem = function(ul, item) {
           return $("<li>")
               .append("<div>" + item.label + "</div>")
               .appendTo(ul);
       };
       }

      });


     

});

function getInlineStyles(el) {
  // Copy computed styles into inline style
  const computed = window.getComputedStyle(el);
  let inlineStyle = "";
  for (let i = 0; i < computed.length; i++) {
    const prop = computed[i];
    inlineStyle += `${prop}:${computed.getPropertyValue(prop)};`;
  }
  el.setAttribute("style", inlineStyle);
  for (const child of el.children) {
    getInlineStyles(child);
  }
}

  function get_collection_data(team_id)
   {
    
   
   $.ajax({
     url: "php/get_collection_data.php",
     type: "get", //send it through get method
     data: {
     team_id : team_id

     },
     success: function (response) {
   
   $('#collection_date').empty()
   $('#collection_date').append("<option selected disabled value=''>Choose...</option>")
 
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
   
   
     obj.forEach(function (obj) {
      var class_d = "";
        count = count +1;
        if(obj.c_sts == " - entry")
        {
          class_d = "text-success fw-bold"
        }
$('#collection_date').append("<option class= '"+class_d+"' value='"+obj.c_date+"'>"+count+"."+obj.collection_date+"</option>")

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

  function insert_memberspayment()
   {
    $('#hs_loader').removeClass('d-none');
    var pay_details = [];
    $("#group_pay_table tr").each(function() {

      if($(this).find("td").eq(4).find("input[type='checkbox']").is(':checked'))
      {

      // your logic here
       var member_id = $(this).data("mem_id");  
var paid_date = $('#paid_date').val();
var is_paid = 1;
var paid_amount  = parseFloat($(this).find("td").eq(2).text());
var payment_mode = $(this).find("td").eq(3).find("select").val();
// var emp_id = $('#employee').val();
var emp_id = current_user_id
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
   
$('#hs_loader').addClass('d-none');
   
   if (response.trim() == "ok") {

 location.reload();
   
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
  


 function get_team_members(team_id)
   {
    
   
   $.ajax({
     url: "php/get_team_members_dropdown.php",
     type: "get", //send it through get method
     data: {
     team_id : team_id
     },
     success: function (response) {

   
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
   
    // get_emi_table(team_id)
    get_collection_data(team_id)
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
        mem_query : mem_query,
        emi_date : $('#collection_date').val()

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
$('#group_pay_table').append("<tr data-mem_id='"+obj.member_id+"'><td><div style='width: 50px; height:50px; overflow: hidden;'> <img src='"+obj.photo+"' class='img-fluid ' style='height: 100%; width: 100%; object-fit:contain ;' alt=''> </div></td><td class='small'>"+obj.member+  " - "+ obj.nominee_name+"</td><td  data-amount='"+amountPay+"'class='small'contenteditable = 'true'>"+amountPay+"</td><td> <select class='form-select small' > <option value='Cash' selected>Cash</option> <option value='UPI'>UPI</option> <option value='Bank Transfer'>Bank Transfer</option> <option value='Cheque'>Cheque</option> <option value='Other'>Other</option> </select></td><td> <div class='form-check '> <input class='form-check-input' checked type='checkbox' value='"+obj.member_id+"' > <label class='form-check-label' for=''> </label></div></td></tr>")






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




  function get_payment_dashboard(mem_id)
   {
    
   
   $.ajax({
     url: "php/get_payment_dashboard.php",
     type: "get", //send it through get method
     data: {

team_id : mem_id,


     },
     success: function (response) {
$('#report_tbl').empty()
       
   var count = 0;
    if (response.trim() != "error") {
       var obj = JSON.parse(response);
      

      var collection_date = [];
      
       obj.forEach(function (obj) {
     count = count + 1;
    //    $('#report_tbl').append("<tr><td>"+count+"</td><td>"+obj.collection_date+"</td><td>"+obj.expected_amount+"</td><td>"+obj.total_paid+"</td><td>"+obj.pending_balance+"</td><td>"+obj.amount_to_pay+"</td><td>"+obj.available_advance+"</td><td>"+obj.sts+"</td><td>"+obj.his_html+"</td></tr>")
      




 




        $('#report_tbl').append("<tr><td>"+count+"</td><td>"+obj.collection_date+"</td><td>"+obj.payable+"</td><td>"+obj.paid_amount+"</td><td>"+obj.bal+"</td><td>"+obj.sts+"</td><td>"+obj.his_html+"</td></tr>")
       });
      



    //    get_sales_order()
      }
      
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }


  function get_payment_dashboard_all(team_id)
   {
    
   $("#title_tbl").text($("#team_select").find("option:selected").text() + " - Payment Dashboard")
   $("#title_tbl_entry").text($("#team_select").find("option:selected").text() + " - Payment Dashboard")

   $.ajax({
     url: "php/get_payment_dashboard_all.php",
     type: "get", //send it through get method
     data: {

team_id : team_id,
mem_query  : "1"

     },
     success: function (response) {
$('#report_all_tbl').empty()
$('#report_all_head').empty()
$('#report_entry_head').empty()
$('#report_entry_tbl_body').empty()
    
   var count = 0;
    if (response.trim() != "error") {
       var obj = JSON.parse(response);
      

      
      
       obj.forEach(function (obj) {
     count = count + 1;
    //    $('#report_tbl').append("<tr><td>"+count+"</td><td>"+obj.collection_date+"</td><td>"+obj.expected_amount+"</td><td>"+obj.total_paid+"</td><td>"+obj.pending_balance+"</td><td>"+obj.amount_to_pay+"</td><td>"+obj.available_advance+"</td><td>"+obj.sts+"</td><td>"+obj.his_html+"</td></tr>")
       var td_report1 = "<th scope ='col'>Date</th>";
       var td_entry_date = "<th colspan='4' >"+obj.group_number+"-("+obj.time_period+" weeks) -"+obj.collection_day+"</th>";
if(count == 1)
{
var dueDatesArray = obj.due_dates.split(","); // Convert to array
var emp_name_list = obj.emp_name_list.split(","); // Convert to array

  console.log(emp_name_list);

  console.log();
  
var emp_count = 0;
  
dueDatesArray.forEach(function(item) {
  td_report1 = td_report1 + "<td scope='col' class='small' >" + item + "</td>";
  td_entry_date = td_entry_date + "<td scope='col' class=' small '><div  class = 'd-flex justify-content-center g-1'><p   class='vertical-text m-0 p-0 '>" + (item || '') + "</p><p  class = 'vertical-text m-0 p-0'>" + (emp_name_list[emp_count] || '') + "</p></div></td>";
  emp_count = emp_count + 1;
});
  td_entry_date = td_entry_date + "<td scope='col' class='small'>Summary</td>";

 $('#report_all_head').append("<tr>" + td_report1 +"</tr>")
 $('#report_entry_head').append("<tr>" + td_entry_date +"</tr>")


}



$('#report_all_tbl').append(obj.payable_amounts_tr)
$('#report_entry_tbl_body').append(obj.payable_amounts_entry_tr)
$('#report_entry_tbl_body tr:last').find('td').eq(0).text(count)
// $('#report_entry_tbl_body').append(obj.payable_amounts_entry__emp_tr)


       });
   console.log( $("#report_entry_div").html());
   
      
      
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