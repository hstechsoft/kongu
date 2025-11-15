var cus_id = '0';
var urlParams = new URLSearchParams(window.location.search);
var current_user_id = localStorage.getItem("ls_uid");
var emp_id = urlParams.get('emp_id');
var his_query = "SELECT * FROM expense_payment   where emp_id=" + emp_id
var query_exp = "SELECT * FROM expense inner join employees on employees.id = expense.exp_emp_id where exp_emp_id=" + emp_id;
$(document).ready(function () {

  check_login();
  get_expense();
  get_payment_history();
  get_employee();
  get_current_time();

  $("#unamed").text(localStorage.getItem("ls_uname"))

  $("#search_emp_txt").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#exp_table tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });


  $('#sel_all_chk').change(function () {
    if (this.checked) {

      $("#exp_table_single tr").each(function () {

        var this_row = $(this);
        this_row.find('td:eq(5) input:checkbox')[0].checked = true
      });
    }

    else {
      $("#exp_table_single tr").each(function () {

        var this_row = $(this);
        this_row.find('td:eq(5) input:checkbox')[0].checked = false
      });
    }

  });

  $('#sel_usr_in').change(function () {

    if ($('#sel_usr_in').find(":selected").val() > 0) {

      if ($('#sel_exp_sts_in').find(":selected").val() != "0") {
        query_exp = "SELECT expense.*,employees.employee_name FROM expense inner join employees on employees.id = expense.exp_emp_id where exp_emp_id=" + $('#sel_usr_in').find(":selected").val() + " and exp_approve = '" + $('#sel_exp_sts_in').find(":selected").val() + "'"

        his_query = "SELECT * FROM expense_payment   where emp_id=" + $('#sel_usr_in').find(":selected").val()
        get_payment_history()
        get_expense();
      }
      else {
        query_exp = "SELECT expense.*,employees.employee_name FROM expense inner join employees on employees.id = expense.exp_emp_id where exp_emp_id=" + $('#sel_usr_in').find(":selected").val()
        his_query = "SELECT * FROM expense_payment   where emp_id=" + $('#sel_usr_in').find(":selected").val()
        get_payment_history()
        get_expense();
      }

      $("#selected_usr").text("employee - " + $('#sel_usr_in').find(":selected").text());

    }


  });

  $('#sel_exp_sts_in').change(function () {

    if ($('#sel_exp_sts_in').find(":selected").val() != "0") {

      if ($('#sel_usr_in').find(":selected").val() > 0) {
        query_exp = "SELECT expense.*,employees.employee_name FROM expense inner join employees on employees.id = expense.exp_emp_id where exp_emp_id=" + $('#sel_usr_in').find(":selected").val() + " and exp_approve = '" + $('#sel_exp_sts_in').find(":selected").val() + "'"

        his_query = "SELECT * FROM expense_payment   where emp_id=" + $('#sel_usr_in').find(":selected").val()
        get_payment_history()
        get_expense();
      }
      else {

        query_exp = "SELECT expense.*,employees.employee_name FROM expense inner join employees on employees.id = expense.exp_emp_id where exp_emp_id=" + emp_id + " and exp_approve = '" + $('#sel_exp_sts_in').find(":selected").val() + "'"

        his_query = "SELECT * FROM expense_payment   where emp_id=" + emp_id
        get_payment_history()
        get_expense();
      }

    }


  });


  $('#view_history_btn').click(function () {
    $('#history_model').modal('show');
  });



  $('#pay_emp_btn').click(function () {
    $('#emp_pay_model').modal('show');
  });


  $("#salary_month").on("input", function () {

    get_salary_payment($(this).val(), $("#salary_year").val())
  })
  $("#salary_btn").on("click", function () {
    $("#salary_form").removeClass("d-none")
    $("#expense_form").addClass("d-none")
    $("#team_form").addClass("d-none")

    $("#exp_add_btn").trigger()
    $("#team_add_btn").trigger()

  })

  $("#salary_add_btn").on("click", function () {
    let salary_advance = $("#salary_advance").is(":checked") ? "1" : "0";
    if ($("#salary_year").val() == '' || $("#salary_month").val() == null || $("#salary_amount").val() == '' || $("#salary_mode").val() == null || $("#salary_ref_no").val() == '' || $("#salary_date").val() == '') {

      salert("warning", "All the fields are required", "warning")
    }
    else {
      insert_salary_payment({
        paid_amount: $("#salary_amount").val(),
        dated: $("#salary_date").val(),
        pay_mode: $("#salary_mode").val(),
        ref_no: $("#salary_ref_no").val(),
        is_advance: salary_advance,
        emp_id: emp_id,
        month: $("#salary_month").val(),
        paid_by: current_user_id,
        salary_year: $("#salary_year").val(),
        salary_month: $("#salary_month").val(),
      });
    }
  })

  $("#salary_table").on("click", ".fa-edit", function () {

    var rowCard = $(this).closest("tr").find("#salary_card");

    $("#salary_amount").val(rowCard.data("amount"));
    $("#salary_date").val(rowCard.find(".bcard1 p").eq(0).text());
    $("#salary_mode").val(rowCard.find(".bcard1 p").eq(1).text());
    $("#salary_ref_no").val(rowCard.find(".bcard2 p").eq(0).text());
    $("#salary_update_btn").data("salary_pay_id", rowCard.data("salary_pay_id"))

    var isAdvance = rowCard.data("sel_adv");
    $("#salary_advance").prop("checked", isAdvance === "checked");

    $("#salary_add_btn").addClass("d-none")
    $("#salary_update_btn").removeClass("d-none")

  });

  $("#salary_update_btn").on("click", function () {

    let salary_advance = $("#salary_advance").is(":checked") ? "1" : "0";

    if ($("#salary_year").val() == '' || $("#salary_month").val() == null || $("#salary_amount").val() == '' || $("#salary_mode").val() == null || $("#salary_ref_no").val() == '' || $("#salary_date").val() == '') {

      salert("warning", "All the fields are required", "warning")
    }
    else {
      console.log($(this).data("salary_pay_id"));

      update_salary_payment({
        paid_amount: $("#salary_amount").val(),
        dated: $("#salary_date").val(),
        pay_mode: $("#salary_mode").val(),
        ref_no: $("#salary_ref_no").val(),
        is_advance: salary_advance,
        emp_id: emp_id,
        month: $("#salary_month").val(),
        paid_by: current_user_id,
        salary_year: $("#salary_year").val(),
        salary_month: $("#salary_month").val(),
        salary_pay_id: $(this).data("salary_pay_id"),
      });
    }

  })

  $("#salary_table").on("click", ".fa-trash", function () {
    var rowCard = $(this).closest("tr").find("#salary_card");
    console.log(rowCard.data("salary_pay_id"));

    if (!rowCard.data("salary_pay_id")) return;
    if (confirm("Are you sure you want to delete this salary?")) {
      delete_salary_payment(rowCard.data("salary_pay_id"));
    }
  });




  $("#expense_btn").on("click", function () {
    $("#expense_form").removeClass("d-none")
    $("#salary_form").addClass("d-none")
    $("#team_form").addClass("d-none")

    get_expense_payment();

    $("#salary_add_btn").trigger()
    $("#team_add_btn").trigger()

  })
  $("#exp_add_btn").on("click", function () {
    if ($("#exp_paid_amount").val() == '' || $("#exp_mode").val() == null || $("#exp_date").val() == '') {

      salert("warning", "All the fields are required", "warning")
    }
    else {
      insert_expense_payment({
        paid_date: $("#exp_date").val(),
        emp_id: emp_id,
        paid_amount: $("#exp_paid_amount").val(),
        pay_mode: $("#exp_mode").val(),
        paid_by: current_user_id,
      });
    }
  })
  $("#expense_tbody").on("click", ".fa-edit", function () {

    var row = $(this).closest("tr");

    console.log(row.find("td").eq(3).text());
    
    $("#exp_paid_amount").val(row.find("td").eq(1).text());
    $("#exp_mode").val(row.find("td").eq(2).text());
    // $("#exp_ref_no").val(row.find("td").eq(1).text());
    $("#exp_date").val(row.find("td").eq(3).text());
    $("#exp_update_btn").data("paid_id", row.data("paid_id"));

    $("#exp_add_btn").addClass("d-none");
    $("#exp_update_btn").removeClass("d-none");

  })
  $("#exp_update_btn").on("click", function () {
    if ($(this).data("paid_id") == '' || $("#exp_paid_amount").val() == '' || $("#exp_mode").val() == null || $("#exp_date").val() == '') {

      salert("warning", "All the fields are required", "warning")
    }
    else {
      update_expense_payment({
        paid_date: $("#exp_date").val(),
        emp_id: emp_id,
        paid_amount: $("#exp_paid_amount").val(),
        pay_mode: $("#exp_mode").val(),
        paid_by: current_user_id,
        paid_id: $(this).data("paid_id"),
      });
    }
  })
  $("#expense_tbody").on("click", ".fa-trash", function () {
    const paid_id = $(this).closest("tr").data("paid_id");
    if (!paid_id) return;
    if (confirm("Are you sure you want to delete this expense?")) {
      delete_expense_payment(paid_id);
    }
  });




  $("#team_btn").on("click", function () {
    $("#team_form").removeClass("d-none")
    $("#salary_form").addClass("d-none")
    $("#expense_form").addClass("d-none")

    get_team_payment();

    $("#salary_add_btn").trigger()
    $("#exp_add_btn").trigger()

  })

  $("#team_add_btn").on("click", function () {

    if ($("#team_paid_amount").val() == '' || $("#team_mode").val() == null || $("#team_ref_no").val() == '' || $("#team_date").val() == '') {

      salert("warning", "All the fields are required", "warning")
    }
    else {
      insert_team_payment({
        dated: $("#team_date").val(),
        emp_id: emp_id,
        amount: $("#team_paid_amount").val(),
        pay_mode: $("#team_mode").val(),
        paid_by: current_user_id,
        ref_no: $("#team_ref_no").val(),
      });
    }
  })
  $("#team_tbody").on("click", ".fa-edit", function () {

    var row = $(this).closest("tr");

    $("#team_paid_amount").val(row.find("td").eq(1).text());
    $("#team_mode").val(row.find("td").eq(2).text());
    $("#team_ref_no").val(row.find("td").eq(3).text());
    $("#team_date").val(row.find("td").eq(4).text());
    $("#team_update_btn").data("team_pay", row.data("team_pay"));

    $("#team_add_btn").addClass("d-none");
    $("#team_update_btn").removeClass("d-none");

  })
  $("#team_update_btn").on("click", function () {
    if ($(this).data("team_pay") == '' || $("#team_paid_amount").val() == '' || $("#team_mode").val() == null || $("#team_ref_no").val() == '' || $("#team_date").val() == '') {

      salert("warning", "All the fields are required", "warning")
    }
    else {
      update_team_payment({
        dated: $("#team_date").val(),
        emp_id: emp_id,
        amount: $("#team_paid_amount").val(),
        pay_mode: $("#team_mode").val(),
        ref_no: $("#team_ref_no").val(),
        paid_by: current_user_id,
        team_pay: $(this).data("team_pay"),
      });
    }
  })
  $("#team_tbody").on("click", ".fa-trash", function () {
    const team_pay = $(this).closest("tr").data("team_pay");
    if (!team_pay) return;
    if (confirm("Are you sure you want to delete this team amount?")) {
      delete_team_payment(team_pay);
    }
  })




  $('#submit_emp_btn').click(function () {
    insert_emp_pay();
  });


  $('#submit_exp_btn').click(function () {
    var exp_data = [];
    if ($('#sel_expc_sts_in').find(":selected").val() == "0") {
      salert("status", "kindly choose status", "warning")
      return
    }
    $("#exp_table_single tr").each(function () {

      var this_row = $(this);
      if (this_row.find('td:eq(5) input:checkbox')[0].checked) {
        exp_data.push(this_row.find('td:eq(5) input:checkbox')[0].value)
      }
      // update_expense((this_row.find('td:eq(5) input:checkbox')[0].value) , $('#sel_expc_sts_in').find(":selected").val())
      // console.log(this_row.find('td:eq(5) input:checkbox')[0].value)

    });
    if (exp_data.length > 0) {
      update_expense(exp_data)
    }
  });

});
//


function insert_salary_payment(data) {

  let m = $("#salary_month").val();
  let y = $("#salary_year").val();

  $.ajax({
    url: "php/insert_salary_payment.php",
    type: "get", //send it through get method
    data: data,
    success: function (response) {
      console.log(response)

      if (response.trim() == "ok") {

        get_salary_payment(m, y)
      }
      // location.reload();



    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function update_salary_payment(data) {

  let m = $("#salary_month").val();
  let y = $("#salary_year").val();

  $.ajax({
    url: "php/update_salary_payment.php",
    type: "get", //send it through get method
    data: data,
    success: function (response) {
      console.log(response)

      if (response.trim() == "ok") {

        get_salary_payment(m, y)
        $("#salary_update_btn").addClass("d-none")
        $("#salary_add_btn").removeClass("d-none")
      }
      // location.reload();



    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function delete_salary_payment(data) {
  let m = $("#salary_month").val();
  let y = $("#salary_year").val();

  $.ajax({
    url: "php/delete_salary_payment.php",
    type: "get", //send it through get method
    data: { salary_pay_id: data, },
    success: function (response) {
      console.log(response)

      if (response.trim() == "ok") {
        get_salary_payment(m, y)
      }
      // location.reload();



    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function get_salary_payment(month, year) {
  console.log(emp_id, month, year);
  $("#salary_month").val(month);

  $.ajax({
    url: "php/get_salary_payment.php",
    type: "get", //send it through get method
    data: {
      salary_month: month,
      salary_year: year,
      emp_id: emp_id,
    },
    success: function (response) {
      console.log(response)

      if (response.trim() !== "error") {

        $("#salary_table").empty();

        if (response.trim() !== "0 result") {

          var count = 0;
          var obj = JSON.parse(response);

          obj.forEach(function (item) {

            var full_data = '';
            var data = JSON.parse(item.pay_details);

            if (data != "null") {

              data.forEach(function (dets) {
                var advance = ""
                var select = ""
                count += 1;

                if (dets.is_advance == "1") {
                  advance = "<i class='fas fa-money-bill money-pulse text-success'></i>";
                  select = "checked";
                }

                full_data = `<div class="card"  data-sel_adv="${select}" data-salary_pay_id="${dets.salary_pay_id}" data-amount="${dets.paid_amount}"id="salary_card">
                              <div class="card-body">
                                <div class="d-flex justify-content-between bcard1" id="">
                                  <p>${dets.dated_format}</p><p>${dets.pay_mode}</p>${advance}
                                </div>
                                <div class="d-flex justify-content-between bcard2" id="">
                                  <strong class="text-success">₹${dets.paid_amount}</strong><p>${dets.ref_no}</p>
                                </div>
                              </div>
                            </div>`;
                $("#salary_table").append(`<tr><td>${count}</td><td>${full_data}</td><td><i class="fa fa-edit text-warning me-3"></i><i class="fa fa-trash text-danger"></i></td></tr>`)
              })
            }
            $("#salary_table").find("tr").eq(0).append(`<td   rowspan="${count}" class="align-item-center text-center fw-bold text-primary">₹${item.total_paid}</td>`)

          })
        }
        else {
          // salert("Error", "User ", "error");
        }
      }
      // location.reload();



    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}




function insert_expense_payment(data) {


  $.ajax({
    url: "php/insert_expense_payment.php",
    type: "get", //send it through get method
    data: data,
    success: function (response) {
      console.log(response)

      if (response.trim() == "ok") {
        get_expense_payment()
      }
      // location.reload();



    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function update_expense_payment(data) {


  $.ajax({
    url: "php/update_expense_payment.php",
    type: "get", //send it through get method
    data: data,
    success: function (response) {
      console.log(response)

      if (response.trim() == "ok") {
        get_expense_payment()

        $("#exp_add_btn").removeClass("d-none");
        $("#exp_update_btn").addClass("d-none");

      }
      // location.reload();



    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function delete_expense_payment(data) {


  $.ajax({
    url: "php/delete_expense_payment.php",
    type: "get", //send it through get method
    data: { paid_id: data, },
    success: function (response) {
      console.log(response)

      if (response.trim() == "ok") {
        get_expense_payment()
      }
      // location.reload();



    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function get_expense_payment() {
  console.log(emp_id);


  $.ajax({
    url: "php/get_expense_payment.php",
    type: "get", //send it through get method
    data: {
      emp_id: current_user_id,
    },
    success: function (response) {
      console.log(response)

      if (response.trim() !== "error") {

        $("#expense_tbody").empty();

        if (response.trim() !== "0 result") {
          var count = 0;
          var obj = JSON.parse(response);
          obj.forEach(function (item) {
            count += 1;
            $("#expense_tbody").append(`<tr data-paid_id='${item.paid_id}'><td>${count}</td><td>${item.paid_amount}</td><td>${item.pay_mode}</td><td>${item.formatted_date}</td><td><i class="fa fa-edit text-warning me-3"></i><i class="fa fa-trash text-danger"></i></td></tr>`)
          })
        }
        else {
          // salert("Error", "User ", "error");
        }
      }
      // location.reload();



    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}



function insert_team_payment(data) {


  $.ajax({
    url: "php/insert_team_payment.php",
    type: "get", //send it through get method
    data: data,
    success: function (response) {
      console.log(response)

      if (response.trim() == "ok") {
        get_team_payment()
      }
      // location.reload();



    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function update_team_payment(data) {


  $.ajax({
    url: "php/update_team_payment.php",
    type: "get", //send it through get method
    data: data,
    success: function (response) {
      console.log(response)

      if (response.trim() == "ok") {
        get_team_payment()
        $("#team_add_btn").removeClass("d-none");
        $("#team_update_btn").addClass("d-none");
      }
      // location.reload();



    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function delete_team_payment(data) {


  $.ajax({
    url: "php/delete_team_payment.php",
    type: "get", //send it through get method
    data: { team_pay: data, },
    success: function (response) {
      console.log(response)

      if (response.trim() == "ok") {
        get_team_payment()
      }
      // location.reload();



    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function get_team_payment() {
  console.log(emp_id);

  $.ajax({
    url: "php/get_team_payment.php",
    type: "get", //send it through get method
    data: {
      emp_id: emp_id,
    },
    success: function (response) {
      console.log(response)

      if (response.trim() !== "error") {

        $("#team_tbody").empty();

        if (response.trim() !== "0 result") {
          var count = 0;
          var obj = JSON.parse(response);
          obj.forEach(function (item) {
            count += 1;
            var date = item.dated.split(" ")
            $("#team_tbody").append(`<tr data-team_pay='${item.team_pay}'><td>${count}</td><td>${item.amount}</td><td>${item.pay_mode}</td><td>${item.ref_no}</td><td>${date[0]}</td><td><i class="fa fa-edit text-warning me-3"></i><i class="fa fa-trash text-danger"></i></td></tr>`)
          })
        }
        else {
          // salert("Error", "User ", "error");
        }
      }
      // location.reload();



    },
    error: function (xhr) {
      salert("Error", "User ", "error");
    }
  });
}




function insert_emp_pay() {

  if ($("#emp_pay_amount").val() == "") {
    salert("Amount", "kindly enter Amount", "warning")
    return
  }

  $.ajax({
    url: "php/insert_expense_pay.php",
    type: "get", //send it through get method
    data: {
      emp_id: emp_id,
      paid_amount: $("#emp_pay_amount").val(),
      paid_date: $("#pay_date").val()

    },
    success: function (response) {
      console.log(response)


      location.reload();



    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function update_expense(exp_id_arr) {



  $.ajax({
    url: "php/update_expense_sts.php",
    type: "POST", //send it through get method
    async: false,
    data: {
      exp_id_arr: JSON.stringify(exp_id_arr),
      exp_approve: $('#sel_expc_sts_in').find(":selected").val()

    },
    success: function (response) {
      console.log(response)

      if (response.trim() == "ok") {
        salert("Success", "Expense updated successfully", "success")
        get_expense();
      }
      else {
        salert("Error", "Error in updating expense", "error")
      }




    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });

}

function get_employee() {


  $.ajax({
    url: "php/get_employee.php",
    type: "get", //send it through get method

    success: function (response) {


      if (response.trim() != "error") {

        var obj = JSON.parse(response);



        obj.forEach(function (obj) {


          $("#sel_usr_in").append(" <option value='" + obj.emp_id + "'>" + obj.emp_name + "</option>");



        });


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


function check_login() {

  if (localStorage.getItem("logemail") == null) {
    window.location.replace("login.html");
  }
}


function get_expense() {



  $.ajax({
    url: "php/get_expense_single.php",
    type: "get", //send it through get method
    data: {
      query: query_exp

    },
    success: function (response) {
      console.log(response)
      if (response.trim() != "error") {
        $("#exp_table_single").empty();
        if (response.trim() != "0 result") {
          var obj = JSON.parse(response);


          var count = 0
          obj.forEach(function (obj) {

            count = count + 1;


            var exp_sts = ""
            if (obj.exp_approve == "yes")
              exp_sts = "Approved"
            else if (obj.exp_approve == "no")
              exp_sts = "Not Approved"
            else if (obj.exp_approve == "decline")
              exp_sts = "Declined"
            $("#exp_table_single").append(" <tr> <td>" + count + "</td> <td>" + obj.exp_date + "</td><td>" + obj.exp_cat + " " + obj.exp_des + "</td> <td>" + obj.exp_amount + "</td> <td>" + exp_sts + "</td> <td><input class='form-check-input' value = '" + obj.exp_id + "'type='checkbox' value=''> </td> </tr>")

            $("#selected_usr").text("employee - " + obj.employee_name);
          });


        }
        else {

          $("#exp_table_single").append("<tr> <td colspan='6'>No Data  </td> </tr>");
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

function get_payment_history() {


  $.ajax({
    url: "php/get_expense_single.php",
    type: "get", //send it through get method
    data: {
      query: his_query + " order by paid_date DESC"

    },
    success: function (response) {
      console.log(response)
      if (response.trim() != "error") {
        $("#exp_payment_tbl").empty();
        if (response.trim() != "0 result") {
          var obj = JSON.parse(response);


          var count = 0
          var total = 0
          obj.forEach(function (obj) {

            count = count + 1;

            total = total + parseFloat(obj.paid_amount);


            $("#exp_payment_tbl").append(" <tr> <td>" + count + "</td> <td>" + obj.paid_date + "</td><td>" + obj.paid_amount + "</td></tr>")


          });

          $("#exp_payment_tbl").append("<tr class='text-bg-warning'> <td colspan='2'> Total Amount </td> <td>" + total + "</td> </tr>")
        }
        else {

          $("#exp_payment_tbl").append("<tr > <td colspan='4'>No Data  </td> </tr>");
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

function get_current_time() {
  $.ajax({
    url: "php/get_current_time.php",
    type: "get", //send it through get method
    data: {


    },
    success: function (response) {


      if (response.trim() != "error") {

        if (response.trim() != "0 result") {
          $("#Summary_tbody").empty()
          var obj = JSON.parse(response);

          console.log(response);

          obj.forEach(function (obj) {
            console.log(obj.date_time);

            $("#salary_date").val(obj.date)
            $("#exp_date").val(obj.date)
            $("#team_date").val(obj.date)


          });
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