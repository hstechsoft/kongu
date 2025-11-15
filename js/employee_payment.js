
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
var emp_id = ''
$(document).ready(function () {


  $("#menu_bar").load('menu.html',
    function () {
      var lo = (window.location.pathname.split("/").pop());
      var web_addr = "#" + (lo.substring(0, lo.indexOf(".")))


      if ($(web_addr).find("a").hasClass('nav-link')) {
        $(web_addr).find("a").toggleClass('active')
      }
      else if ($(web_addr).find("a").hasClass('dropdown-item')) {
        $(web_addr).parent().parent().find("a").eq(0).toggleClass('active')
      }


    }
  );



  check_login();

  get_team_dropdown();

  $("#unamed").text(localStorage.getItem("ls_uname"))

  get_employees_dropdown()


  $('#group_txt_auto').on('input', function () {
    //check the value not empty
    if ($('#group_txt_auto').val() != "") {
      $('#group_txt_auto').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_group_auto.php",
            type: "get", //send it through get method
            data: {
              term: request.term


            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.group_number,
                  value: item.group_number,
                  id: item.id

                };
              }));

            }

          });
        },
        minLength: 2,
        appendTo: "body",
        cacheLength: 0,
        select: function (event, ui) {

          $('#team_select').val(ui.item.id).trigger('change');



          // get_bom(ui.item.id)


        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div>" + item.label + "</div>")
          .appendTo(ul);
      };
    }

  });



  $("#employee").on("change", function (event) {
    event.preventDefault();
    if ($("#paid_date").val() != "" && $("#paid_date").val() != null) {
      emp_id = $("#employee").val()
      var paid_date = $("#paid_date").val()
      get_emp_payment_report(emp_id, paid_date)
    }
  });

  $("#paid_date").on("change", function (event) {
    event.preventDefault();

    console.log($("#employee").val());

    // TODO: handle click here
    if ($("#employee").val() != "" && $("#employee").val() != null) {
      emp_id = $("#employee").val()
      var paid_date = $("#paid_date").val()
      get_emp_payment_report(emp_id, paid_date)
    }
    else {
      salert("Error", "Please select employee", "error");
    }
  });

  let enter_total = 0;
  enter_total = $("#Summary_tbody tr:last").find("td").eq(2).text().trim().replace(/[^0-9.-]/g, '') || 0;


  $("#emp_payment_add_btn").on("click", function () {


    if (
      $("#employee").val() == null ||
      $("#paid_date").val() == '' ||
      $("#emp_amount").val() == '' ||
      $("#pay_mode").val() == null ||
      $("#ref_no").val() == ''
    ) {
      salert("Warning", "All fields are required", "warning");
      return;
    }

    let found = false;
    let payMode = $("#pay_mode").val();
    let empAmount = $("#emp_amount").val();
    let refNo = $("#ref_no").val();
    let paidDate = $("#paid_date").val();
    let count = 0;
    // let final_total = $("#Summary_tbody tr:last").find("td").eq(1).text().trim();
    // final_total = final_total.replace(/[^0-9.-]/g, '')
    let in_hand = 0;

    // console.log(final_total);



    let rows = $("#Summary_tbody tr");
    rows.slice(0, -1).each(function () {
      count++;
      let pay_type = $(this).find("td").eq(1).text().trim();

      if (pay_type === payMode) {
        // enter_total += parseFloat($("#emp_amount").val());
        let rev_details = `
        <ul class='list-group'>
          <li class='list-group-item d-flex justify-content-between p-1'  data-pay_mode="${payMode}" data-empAmount="${empAmount}" data-refNo="${refNo}">
            <strong class="text-success" style="font-size: 15px">₹${empAmount}</strong><p id="p2" class="mb-0"  style="font-size: 15px">${refNo}</p>
          </li>
        </ul>`;
        $(this).find("td").eq(3).append(rev_details);
        // $(this).find("li").data("pay_mode", payMode)
        // $(this).find("li").data("empAmount", empAmount)
        // $(this).find("li").data("refNo", refNo)
        found = true;
        return false;
      }
    });


    if (!found) {
      count += 1;
      // enter_total += parseFloat($("#emp_amount").val());
      let newRow = `
      <tr>
        <td>${count}</td>
        <td>${payMode}</td>
        <td></td>
        <td>
          <ul class='list-group' >
            <li class='list-group-item d-flex justify-content-between p-1' data-pay_mode="${payMode}" data-empAmount="${empAmount}" data-refNo="${refNo}">
              <strong class="text-success"  style="font-size: 15px">₹${empAmount}</strong> <p id="p2" class="mb-0"   style="font-size: 15px">${refNo}</p>
            </li>
          </ul>
        </td>
      </tr>
    `;
      $(newRow).insertBefore(rows.last());
    }

    // calculation

    var total = $("#Summary_tbody tr:last").find("td").eq(1).text().trim().replace(/[^0-9.-]/g, '');
    total = parseFloat(total);
    console.log(total);

    // $("#in_hand").find("strong").text("")
    // $("#Summary_tbody tr:last").find("td").eq(2).text("")

    var amount = 0;

    $("#Summary_tbody tr").slice(0, -1).each(function () {
      var td = $(this).find("td").eq(3);
      td.find("li.list-group-item").each(function () {
        var pay_amount = parseFloat($(this).find("strong").text().replace(/[^\d.-]/g, '').trim());
        amount += pay_amount;
      });
    });

    let final_total = total - amount;
    console.log(amount, final_total);

    // Update in-hand
    $("#in_hand").find("strong").text("₹" + final_total);

    // Store and update final total
    $("#Summary_tbody tr:last").find("td").eq(2).html(`<strong class="text-danger">₹${amount}</strong>`);


    $("#emp_amount").val("");
    $("#pay_mode").val("");
    $("#ref_no").val("");

  });






  $("#Summary_tbody").on("click", "li.list-group-item", function () {

    let row = $(this).closest("tr");
    let rowIndex = row.index();

    let td = $(this).closest("td");
    let liIndex = td.find("li.list-group-item").index(this); // WHICH LI was clicked

    // fill inputs
    $("#emp_amount").val($(this).find("strong").text().replace(/[^\d.-]/g, '').trim());
    $("#ref_no").val($(this).find("p").text().trim());
    $("#pay_mode").val($(this).data("pay_mode"));
    console.log($("#emp_amount").val(), $("#pay_mode").val(), $("#ref_no").val());

    // Save identifiers
    $("#emp_payment_edit_btn").data("rowIndex", rowIndex);
    $("#emp_payment_edit_btn").data("liIndex", liIndex);
    $("#emp_payment_delete_btn").data("rowIndex", rowIndex);
    $("#emp_payment_delete_btn").data("liIndex", liIndex);

    $("#emp_payment_edit_btn").removeClass("d-none");
    $("#emp_payment_add_btn").addClass("d-none");
    $("#emp_payment_delete_btn").removeClass("d-none");
  });



  $("#emp_payment_edit_btn").on("click", function () {

    let rowIndex = $(this).data("rowIndex");
    let liIndex = $(this).data("liIndex");

    let payMode = $("#pay_mode").val();
    let empAmount = $("#emp_amount").val();
    let refNo = $("#ref_no").val();

    // Find correct LI
    let liToEdit = $("#Summary_tbody tr")
      .eq(rowIndex)
      .find("td").eq(3)
      .find("li.list-group-item")
      .eq(liIndex);

    // Update only that LI
    liToEdit.replaceWith(`
        <li class='list-group-item d-flex justify-content-between p-1'
            data-pay_mode="${payMode}"
            data-empAmount="${empAmount}"
            data-refNo="${refNo}">
            <strong class="text-success" style="font-size: 15px">₹${empAmount}</strong>
            <p class="mb-0" style="font-size: 15px">${refNo}</p>
        </li>
    `);

    // ------------------------------------
    // Recalculate totals
    // ------------------------------------
    var total = $("#Summary_tbody tr:last").find("td").eq(1).text().trim().replace(/[^0-9.-]/g, '');
    total = parseFloat(total);
    console.log(total);

    // $("#in_hand").find("strong").text("")
    // $("#Summary_tbody tr:last").find("td").eq(2).text("")

    var amount = 0;

    $("#Summary_tbody tr").slice(0, -1).each(function () {
      var td = $(this).find("td").eq(3);
      td.find("li.list-group-item").each(function () {
        var pay_amount = parseFloat($(this).find("strong").text().replace(/[^\d.-]/g, '').trim());
        amount += pay_amount;
      });
    });

    let final_total = total - amount;
    console.log(amount, final_total);

    // Update in-hand
    $("#in_hand").find("strong").text("₹" + final_total);

    // Store and update final total
    $("#Summary_tbody tr:last").find("td").eq(2).html(`<strong class="text-danger">₹${amount}</strong>`);

    // Switch buttons
    $("#emp_payment_edit_btn").addClass("d-none");
    $("#emp_payment_delete_btn").addClass("d-none");
    $("#emp_payment_add_btn").removeClass("d-none");

    $("#emp_amount").val("");
    $("#pay_mode").val("");
    $("#ref_no").val("");

  });


  $("#emp_payment_delete_btn").on("click", function () {
    $("#emp_amount").val("");
    $("#pay_mode").val("");
    $("#ref_no").val("");

    $("#Summary_tbody tr").eq($(this).data("rowIndex")).find("td").eq(3).find("li.list-group-item").eq($(this).data("liIndex")).closest("ul").empty();

    $("#emp_payment_edit_btn").addClass("d-none");
    $("#emp_payment_delete_btn").addClass("d-none");
    $("#emp_payment_add_btn").removeClass("d-none");



    // Recalculate totals
    // ------------------------------------
    var total = $("#Summary_tbody tr:last").find("td").eq(1).text().trim().replace(/[^0-9.-]/g, '');
    total = parseFloat(total);
    console.log(total);

    // $("#in_hand").find("strong").text("")
    // $("#Summary_tbody tr:last").find("td").eq(2).text("")
    var amount = 0;

    $("#Summary_tbody tr").slice(0, -1).each(function () {
      var td = $(this).find("td").eq(3);

      td.find("li.list-group-item").each(function () {

        var pay_amount = parseFloat($(this).find("strong").text().replace(/[^\d.-]/g, '').trim());
        amount += pay_amount;
      });

    });
    console.log(amount);

    let final_total = total - amount;
    console.log(amount, final_total);

    // Update in-hand
    $("#in_hand").find("strong").text("₹" + final_total);

    // Store and update final total
    $("#Summary_tbody tr:last").find("td").eq(2).html(`<strong class="text-danger">₹${amount}</strong>`);
  })






  $("#emp_payment_btn").on("click", function () {

    var cash_remain = $("#in_hand").text();
    var emp_pay_arr = [];
console.log(cash_remain);

    $("#Summary_tbody tr").slice(0, -1).each(function () {

      var td = $(this).find("td").eq(3);

      td.find("li.list-group-item").each(function () {

        var pay_mode = $(this).data("pay_mode");
        var pay_amount = $(this).find("strong").text().replace(/[^\d.-]/g, '').trim();
        var reference = $(this).find("p#p2").text().trim();

        if (pay_mode || pay_amount || reference) {
          emp_pay_arr.push({
            pay_mode: pay_mode,
            pay_amount: pay_amount,
            reference: reference
          });
        }
      });

    });

    console.log(emp_pay_arr);
    if (emp_pay_arr.length > 0) {
      insert_emp_payment({
        emp_pay_arr: emp_pay_arr,
        emp_id: emp_id,
        paid_date: $("#paid_date").val(),
        received_by: current_user_id,
        cash_remain: cash_remain,
      });
    }
    else {
      salert("Error", "Data Missing", "error")
    }

  });






  $("#view_report").on("click", function () {
    $(this).addClass("d-none");
    $("#emp_pay_report").empty();
    $("#view_home").removeClass("d-none");
    $(".emp_pay_form").addClass("d-none");
    $(".report_form").removeClass("d-none");

    $("#employee").val("");
    $("#emp_amount").val("");
    $("#pay_mode").val("");
    $("#ref_no").val("");
  })

  $("#view_home").on("click", function () {
    $(this).addClass("d-none");
    $("#emp_pay_report").empty();
    $("#view_report").removeClass("d-none");
    $(".report_form").addClass("d-none");
    $(".emp_pay_form").removeClass("d-none")

    $("#employee").val("");
    $("#from_date_report").val("");
    $("#to_date_report").val("");
    $("#pay_mode_report").val("");
    $("#team_select").val("");
    $("#group_txt_auto").val("");

  })





  var team_list = "";

  $("#team_select").on("change", function () {
    $("#group_txt_auto").val("");
  })

  $("#group_add").on("click", function () {

    let dropVal = $("#team_select").val();
    // let textVal = $("#group_txt_auto").val();

    let value = dropVal;

    if (value) {
      if (team_list != "") {
        team_list += ', "' + value + '"';
      }
      else {
        team_list = '"' + value + '"';
      }

      // $("#search_report").data("team_list", team_list)

    }
    $("#group_data").val(team_list)
    $("#team_select").val("");
    $("#group_txt_auto").val("");

  });


  $("#search_report").on("click", function () {

    var employee_id = $("#employee_report").val();
    var start_date = $("#from_date_report").val() || "";
    var end_date = $("#to_date_report").val() || "";
    var pay_mode = $("#pay_mode_report").val() || "";
    var team = $("#group_data").val() || "";

    console.log(team," 1"+ employee_id,"2 "+ start_date," 3"+ end_date," 4"+ pay_mode);

    if (employee_id || start_date || end_date || pay_mode || team) {
      get_emp_payment_report_mode(employee_id, start_date, end_date, team, pay_mode)

      team_list = "";

      $("#employee_report").val();
      $("#from_date_report").val();
      $("#to_date_report").val();
      $("#pay_mode_report").val();
      $("#group_data").val();

    }
    else {
      salert("Warning", "At Least one field is required", "warning");
    }

  });


});





function get_employees_dropdown() {


  $.ajax({
    url: "php/get_employees_dropdown.php",
    type: "get", //send it through get method
    data: {

    },
    success: function (response) {


      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0
          var cur_date = ""

          obj.forEach(function (obj) {
            count = count + 1;
            $('#employee').append("<option value = '" + obj.id + "'>" + obj.employee_name + "</option>")
            $('#employee_report').append("<option value = '" + obj.id + "'>" + obj.employee_name + "</option>")
            cur_date = obj.cur_date
          });


          $("#paid_date").val(cur_date)


        }
        else {
          // $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}


function insert_emp_payment(data) {


  $.ajax({
    url: "php/insert_emp_payment.php",
    type: "post", //send it through get method
    data: {
      emp_pay_arr: JSON.stringify(data.emp_pay_arr),
      emp_id: data.emp_id,
      paid_date: data.paid_date,
      received_by: data.received_by,
      cash_remain: data.cash_remain
    },

    success: function (response) {

      console.log(response);

      if (response.trim() == "ok") {
        alert("success")
        window.location.reload()

      }
      else {
        salert("Error", "Error while insert", "error")
      }





    },
    error: function (xhr) {
      console.error(xhr.responseText);
    }
  });




}






function get_emp_payment_report_mode(emp_id, start_date, end_date, team_list, pay_mode) {
console.log(emp_id, start_date, end_date, team_list, pay_mode);

  $.ajax({
    url: "php/get_emp_payment_reportmode.php",
    type: "get",
    data: {
      emp_id: emp_id,
      start_date: start_date,
      end_date: end_date,
      team_list: team_list,
      pay_mode: pay_mode,
    },

    success: function (response) {
      console.log(response);

      $('#emp_report').empty();

      if (response.trim() !== "error" && response.trim() !== "0 result") {

        var obj = JSON.parse(response);
        var count = 0;
        var tcredit = 0;
        var tdebit = 0;

        obj.forEach(function (row) {

          count++;

          let credit = row.credit ? "₹" + row.credit : "-";
          let c = row.credit ? row.credit : 0;
          tcredit += parseFloat(c);

          let debit = row.debit ? "₹" + row.debit : "-";
          let d = row.debit ? row.debit : 0;
          tdebit += parseFloat(d);

          let deb = JSON.parse(row.details);

          let detailTable = `
            <table class="table table-bordered table-sm">
              <thead>
                <tr class="bg-info text-center">
                  <td>Type</td>
                  <td>Mode / User</td>
                  <td>Amount</td>
                </tr>
              </thead>
              <tbody>
          `;

          deb.forEach(function (item) {

            // ================= CATEGORY =================
            if (item.cat) {
              item.details.forEach(function (d) {
                detailTable += `
                  <tr class="bg-white">
                    <td>${item.cat}</td>
                    <td>${d.mode}</td>
                    <td>₹${d.amount}</td>
                  </tr>
                `;
              });
            }

            // =============== PAYMENT MODE ===============
            if (item.payment_mode) {
              item.pay_details.forEach(function (pd) {
                detailTable += `
                  <tr class="bg-white">
                    <td>${item.payment_mode}</td>
                    <td>${pd.user_name}</td>
                    <td>₹${pd.paid_amount}</td>
                  </tr>
                `;
              });
            }

          });

          detailTable += `</tbody></table>`;
          console.log(tcredit, tdebit);

          $("#emp_report").append(`
            <tr>
              <td>${count}</td>
              <td>${row.paid_date}</td>
              <td>${row.team}</td>
              <td>${detailTable}</td>
              <td>${credit}</td>
              <td>${debit}</td>
            </tr>
          `);

          $("#tcredit").text(tcredit);
          $("#tdebit").text(tdebit);
          console.log(parseFloat(tcredit)-parseFloat(tdebit));
          
          $("#profit").text(parseFloat(tcredit)-parseFloat(tdebit));

        });

      }

    },

    error: function (xhr) {
      console.error("AJAX Error:", xhr);
    }

  });

}





function get_emp_payment_report(emp_id, paid_date) {


  $.ajax({
    url: "php/get_emp_payment_report.php",
    type: "get", //send it through get method
    data: {
      emp_id: emp_id,
      paid_date: paid_date
    },
    success: function (response) {

      console.log(response);

      $('#emp_pay_report').empty()
      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0
          var grand_total = 0;
          obj.forEach(function (obj) {
            console.log(obj);
            var acc = ""
            var li = ""
            var ul = ""
            var ul_emp = ""
            var li_emp = ""
            count = count + 1;
            var emp_pay = obj.emp_amount_details
            if (emp_pay != null) {

              emp_pay = JSON.parse(emp_pay);
              emp_pay.forEach(function (emp_pay) {
                li_emp = "<li class='list-group-item '>" + emp_pay.mode + " - " + emp_pay.paid_amount + "</li>"
              })
              ul_emp = "<ul class='list-group '>" + li_emp + "</ul>"
            }




            var details = obj.details;
            if (details != null) {
              details = JSON.parse(details);
              var de_count = 0
              details.forEach(function (details) {
                de_count = de_count + 1
                var title = details.payment_mode + "<span class='text-end'>  -- ₹ " + details.mode_sum + "</span>"
                li = ""
                var pay = details.pay_details;
                // li =  "<li class='list-group-item selected'>"+details.payment_mode+ "<span class='text-end'>  -- ₹ " +details.mode_sum+ "</span></li>"

                pay.forEach(function (pay) {
                  li = li + "<li class='list-group-item '>" + pay.user_name + " - " + pay.paid_amount + "</li>"

                })
                ul = "<ul class='list-group small'>" + li + "</ul>"
                acc = acc + "<div class='accordion ' id='acc_" + count + "_" + de_count + "' > <div class='accordion-item'> <h2 class='accordion-header small'> <button class='accordion-button collapsed small' type='button' data-bs-toggle='collapse' data-bs-target='#acc__item" + count + "_" + de_count + "' aria-expanded='true' aria-controls='acc__item" + count + "_" + de_count + "'> " + title + " </button> </h2> <div id='acc__item" + count + "_" + de_count + "' class='accordion-collapse collapse hide' data-bs-parent='#acc_" + count + "_" + de_count + "'> <div class='accordion-body m-0 p-0 small'>" + ul + "</div> </div> </div></div>"
              })
            }

            console.log(acc);

            grand_total = grand_total + parseFloat(obj.total_amount)
            $('#emp_pay_report').append("<tr class=\"small\"><td>" + count + "</td><td>" + obj.paid_date + "</td><td>" + obj.team + "</td><td>" + acc + "</td><td>" + obj.total_amount + "</td>></tr>")


          });
          //  $('#emp_pay_report').append("<tr class=\"small\"><td colspan='4'>"+"Total"+"</td><td colspan='4'>"+grand_total.toFixed(2)+"</td></tr>")
          //   $('#emp_pay_report').append("<tr class=\"small\"><td colspan='4'>"+"Expenses"+"</td><td colspan='4'>"+grand_total.toFixed(2)+"</td></tr>")
          //    $('#emp_pay_report').append("<tr class=\"small\"><td colspan='4'>"+"Cash In hand"+"</td><td colspan='4'>"+grand_total.toFixed(2)+"</td></tr>")

          get_emp_payment_summary(emp_id, paid_date)

        }
        else {
          // $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}



function get_emp_payment_summary(emp_id, paid_date) {
  $.ajax({
    url: "php/get_emp_payment_summary.php",
    type: "get", //send it through get method
    data: {
      emp_id: emp_id,
      paid_date: paid_date


    },
    success: function (response) {


      if (response.trim() != "error") {

        if (response.trim() != "0 result") {
          $("#Summary_tbody").empty()
          $("#in_hand").find("strong").text("")
          var obj = JSON.parse(response);

          var count = 0;
          var grand_total = 0;
          console.log(response);

          obj.forEach(function (obj) {
            count += 1;
            grand_total += parseInt(obj.total) || 0;
            $("#Summary_tbody").append(`<tr><td>${count}</td><td>${obj.payment_mode}</td><td>₹${obj.total}</td><td></td></tr>`)
          });
          $("#Summary_tbody").append(`<tr><td class="text-center" colspan="2">Total</td><td class="fw-bold text-success">₹${grand_total}</td><td></td></tr>`);
        }

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



function get_team_dropdown() {


  $.ajax({
    url: "php/get_team_dropdown.php",
    type: "get", //send it through get method
    data: {

    },
    success: function (response) {



      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;
            $('#team_select').append("<option value='" + obj.id + "' data-ic_factor='" + obj.ic_factor + "' data-dc_factor='" + obj.dc_charge_calculation + "' data-time_period='" + obj.time_period + "' data-leader='" + obj.leader_sts + "'>" + obj.group_mem + "</option>")

          });


        }
        else {
          // $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}





function check_login() {

  if (localStorage.getItem("logemail") == null && phone_id == null) {
    window.location.replace("login.html");
  }
  else if (localStorage.getItem("logemail") == null && phone_id != null) {
    get_current_userid_byphoneid();
    $('#menu_bar').hide()
  }

  else {

  }
}


function get_current_userid_byphoneid() {
  $.ajax({
    url: "php/get_current_employee_id_byphoneid.php",
    type: "get", //send it through get method
    data: {
      phone_id: phone_id,


    },
    success: function (response) {


      if (response.trim() != "error") {
        var obj = JSON.parse(response);


        console.log(response);


        obj.forEach(function (obj) {
          current_user_id = obj.emp_id;
          current_user_name = obj.emp_name;
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


function shw_toast(title, des, theme) {


  $('.toast-title').text(title);
  $('.toast-description').text(des);
  var toast = new bootstrap.Toast($('#myToast'));
  toast.show();
}

function get_millis(t) {

  var dt = new Date(t);
  return dt.getTime();
}



function get_cur_millis() {
  var dt = new Date();
  return dt.getTime();
}


function get_today_date() {
  var date = new Date();

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  var hour = date.getHours();
  var mins = date.getMinutes();

  console.log(mins)

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  var today = year + "-" + month + "-" + day + "T" + hour + ":" + mins;
  return today;
}

function get_today_start_millis() {
  var date = new Date();

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  var today = year + "-" + month + "-" + day + "T00:00";

  return get_millis(today)

}


function get_today_end_millis() {
  var date = new Date();

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  var today = year + "-" + month + "-" + day + "T23:59";

  return get_millis(today)

}

function salert(title, text, icon) {


  swal({
    title: title,
    text: text,
    icon: icon,
  });
}



function millis_to_date(millis) {
  var d = new Date(millis); // Parameter should be long value


  return d.toLocaleString('en-GB');

}