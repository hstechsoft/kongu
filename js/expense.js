
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
var count = 0;
let isSelectionMode = false;
let selectedItems = [];
let longPressTimer = null;
let button_type = 0;

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

    get_expense_summary_single(current_user_id);
    get_current_time();

    $("#unamed").text(localStorage.getItem("ls_uname"))

    $("#unapprove_view_btn").on("click", function () {
        button_type = 1;
        get_expense_approve_sts("no");
    })

    $("#decline_view_btn").on("click", function () {
        button_type = 2;
        get_expense_approve_sts("decline");
    })


    $('#exp_category').on('input', function () {
        //check the value not empty
        if ($('#exp_category').val() != "") {
            $('#exp_category').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_exp_cat_auto.php",
                        type: "get", //send it through get method
                        data: {

                            exp_cat: request.term,

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.exp_cat,
                                    value: item.exp_cat,
                                    // id: item.part_id,
                                    // part_name: item.part_name
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    //   $(this).data("exp_cat", ui.item.value);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)
                    //  get_bom(ui.item.id)


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong></div>")
                    .appendTo(ul);
            };
        }

    });

    $("#add_expense").on("click", function () {
        var exp_cat = $("#exp_category").val();
        var exp_date = $("#exp_date").val();
        var exp_des = $("#exp_description").val();
        var exp_amount = $("#exp_amount").val();

        if (exp_amount === "" || exp_date === "" || exp_cat === "") {
            salert("Warning", "Please enter the category, amount and date", "warning");
            return;
        }

        $("#exp_table").append(`<ul class="list-group text-center my-2" data-exp_cat='${exp_cat}' data-exp_des='${exp_des}' data-exp_date='${exp_date}' data-exp_amount='${exp_amount}'>
                        
                        <div class="card expense-card p-1">
                        <div class="d-flex justify-content-between align-items-center p-0">
                            <div class="expense-name p-1 m-0">${exp_cat}</div>
                            <div class="expense-date p-1 m-0">${exp_date}</div>
                            <div class="expense-amount p-1 m-0">₹ ${exp_amount}</div>
                        </div>
                        <hr class="p-1 m-0">
                            <p class="expense-des mb-0">${exp_des}</p>
                    </div>

                        </ul>`);

        $("#exp_category").val("");
        $("#exp_description").val("");
        $("#exp_amount").val("");
    });


    $("#exp_table").on("mousedown touchstart", "ul", function () {
        const $item = $(this);
        if (!isSelectionMode) {
            longPressTimer = setTimeout(() => {
                isSelectionMode = true;
                toggleSelection($item);
                $("#bulk_delete_btn").removeClass("d-none");
                $("#bulk_delete_cancel_btn").removeClass("d-none");
            }, 2000);
        }

    });

    $("#exp_table").on("mouseup mouseleave touchend", "ul", function () {
        clearTimeout(longPressTimer);
    });

    $("#exp_table").on("click", "ul", function () {
        if (isSelectionMode) {
            toggleSelection($(this));
        }
    });

    function toggleSelection($item) {
        const expId = $item.data("exp_id");
        $("#bulk_delete_btn").data("exp_data", $item.data("exp_data"))
        if ($item.hasClass("selected")) {
            $item.removeClass("selected");
            selectedItems = selectedItems.filter(id => id !== expId);
        } else {
            $item.addClass("selected");
            selectedItems.push(expId);
        }

        if (selectedItems.length === 0) {
            isSelectionMode = false;
            $("#bulk_delete_btn").addClass("d-none");
            $("#bulk_delete_btn").data("exp_data", "");
            $("#bulk_delete_cancel_btn").addClass("d-none");


        }
    }


    $("#bulk_delete_cancel_btn").on("click", function () {

        $("#exp_table ul.selected").each(function () {
            $(this).removeClass("selected");
        });


        selectedItems = [];
        isSelectionMode = false;

        $("#bulk_delete_btn").data("exp_data", "");
        $("#bulk_delete_btn").addClass("d-none");
        $("#bulk_delete_cancel_btn").addClass("d-none");
        console.log("Bulk delete canceled");
    });



    $("#bulk_delete_btn").on("click", function () {
        if (selectedItems.length !== 0) {
            delete_expenses(selectedItems, $(this).data("exp_date"));
            $("#bulk_delete_btn").data("exp_data", "");
            $(this).addClass("d-none");
            $("#bulk_delete_cancel_btn").addClass("d-none");
        };
    })

    $(".fa-trash").on("click", function () {
        var row = $(this).data("row")
        if (row.data("exp_id")) {
            var exp_id_arr = [row.data("exp_id")]
            delete_expenses(exp_id_arr, row.data("exp_date"));
            $(this).data("row").remove();
            $("#edit_expense").trigger();

        }
        else {
            $(this).data("row").remove();
            $("#edit_expense").trigger();
        }


        // $("#expenditure_table_body tr").each(function (index) {

        //     $(this).find("td").eq(0).text(index + 1);
        //     count = index + 1;
        // });

    })



    $("#exp_table").on("click", "ul", function () {
        if (!isSelectionMode) {
            var row = $(this);
            console.log(row);

            $("#edit_expense").data("row", row);
            $(".fa-trash").data("row", row);

            var exp_date = row.data("exp_date");
            var exp_cat = row.data("exp_cat");
            var exp_amount = row.data("exp_amount");
            var exp_des = row.data("exp_des");

            console.log(exp_cat, exp_des);

            $("#exp_date").val(exp_date);
            $("#exp_category").val(exp_cat);
            $("#exp_amount").val(exp_amount);
            $("#exp_description").val(exp_des);

            $("#add_expense").addClass("d-none");
            $("#edit_expense").removeClass("d-none");
            $("#delete_btn").removeClass("d-none");
        }

    });


    $("#edit_expense").on("click", function () {
        let row = $(this).data("row");

        if (!row) {
            salert("Error", "No expense selected for update", "error");
            return;
        }

        var exp_cat = $("#exp_category").val();
        var exp_date = $("#exp_date").val();
        var exp_des = $("#exp_description").val();
        var exp_amount = $("#exp_amount").val();

        // row.find("li").eq(0).text(`${exp_cat} - ${exp_date} - ${exp_amount}`);
        // row.find("li").eq(1).text(exp_des);
        console.log(row.data("exp_id"), exp_des, exp_cat, exp_amount, exp_date);


        if (row.data("exp_id")) {
            update_expenses(exp_des, exp_cat, exp_amount, exp_date, row.data("exp_id"));
        }


        $("#add_expense").removeClass("d-none");
        $("#edit_expense").addClass("d-none");
        $("#delete_btn").addClass("d-none");
        $("#exp_category, #exp_date, #exp_description, #exp_amount").val("");


        $(this).removeData("row");

        salert("Success", "Expense updated successfully!", "success");
    });

    $("#submit_exp_btn").on('click', function () {
        const exp_arr = [];

        $("#exp_table ul").each(function () {
            const $ul = $(this);
            const exp_date = $ul.data("exp_date");
            const exp_cat = $ul.data("exp_cat");
            const exp_amount = $ul.data("exp_amount");
            const exp_des = $ul.data("exp_des") || "";
            const exp_id = $ul.data("exp_id");

            if (exp_date && exp_cat && exp_amount && typeof exp_id == "undefined") {
                exp_arr.push({
                    exp_id,
                    exp_date,
                    exp_cat,
                    exp_des,
                    exp_amount: parseFloat(exp_amount)
                });
            } else {
                salert("Error", "Data missing or invalid", "error");
            }
        });

        if (exp_arr.length > 0) {
            insert_expenses(exp_arr, current_user_id);
            $("#exp_date").val("");
        } else {
            salert("Error", "No valid expense data found", "error");
        }
    });


    $("#exp_date").on("input", function () {

        const selectedDate = $(this).val();

        if (selectedDate) {
            get_expenses_single(selectedDate);
        }
    });


});


function get_expenses_single(data) {
    $.ajax({
        url: "php/get_expenses_single.php",
        type: "get", //send it through get method
        data: {
            exp_date: data,


        },
        success: function (response) {


            console.log(response);
            if (response.trim() != "error") {
                $("#exp_table").find("ul").empty();
                $("#exp_head").text("Expenditure Table - " + data);
                if (response.trim() != "0 result") {
                    // count = 0;
                    var obj = JSON.parse(response);


                    obj.forEach(function (obj) {
                        // count += 1;
                        // $("#expenditure_table_body").append(`<tr data-exp_id=${obj.exp_id}><td>${count}</td><td>${obj.exp_date}</td><td>${obj.exp_cat}</td><td>${obj.exp_des}</td><td>${obj.exp_amount}</td><td><i class='fa fa-edit pe-2 text-warning'></i><i class='fa fa-trash text-danger'></i></td></tr>`)



                        $("#exp_table").append(`<ul class="list-group text-center my-2" data-exp_id='${obj.exp_id}' data-exp_cat='${obj.exp_cat}' data-exp_des='${obj.exp_des}' data-exp_date='${obj.exp_date}' data-exp_amount='${obj.exp_amount}'>
                        
                        <div class="card expense-card p-1">
                        <div class="d-flex justify-content-between align-items-center p-0">
                            <div class="expense-name p-1 m-0">${obj.exp_cat}</div>
                            <div class="expense-date  p-1 m-0">${obj.exp_date}</div>
                            <div class="expense-amount  p-1 m-0">₹ ${obj.exp_amount}</div>
                        </div>
                        <hr class="m-0 p-1">
                            <p class="expense-des mb-0">${obj.exp_des}</p>
                    </div>

                        </ul>`);
                    });
                }
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


function get_expense_approve_sts(data) {
    console.log(data);

    $.ajax({
        url: "php/get_expense_approve_sts.php",
        type: "get", //send it through get method
        data: {
            exp_emp_id: current_user_id,
            exp_approve: data


        },
        success: function (response) {


            if (response.trim() != "error") {
                $("#exp_table").find("ul").empty();
                $("#exp_head").text("Expenditure Table - " + data);

                // count = 0;
                var obj = JSON.parse(response);


                console.log(response);
                obj.forEach(function (obj) {
                    // count += 1;
                    // $("#expenditure_table_body").append(`<tr data-exp_id=${obj.exp_id}><td>${count}</td><td>${obj.exp_date}</td><td>${obj.exp_cat}</td><td>${obj.exp_des}</td><td>${obj.exp_amount}</td><td><i class='fa fa-edit pe-2 text-warning'></i><i class='fa fa-trash text-danger'></i></td></tr>`)



                    $("#exp_table").append(`<ul class="list-group text-center my-2" data-exp_id='${obj.exp_id}' data-exp_cat='${obj.exp_cat}' data-exp_des='${obj.exp_des}' data-exp_date='${obj.exp_date}' data-exp_amount='${obj.exp_amount}'>
                        
                        <div class="card expense-card p-1">
                        <div class="d-flex justify-content-between align-items-center p-0">
                            <div class="expense-name p-1 m-0">${obj.exp_cat}</div>
                            <div class="expense-date p-1 m-0">${obj.exp_date}</div>
                            <div class="expense-amount p-1 m-0">₹ ${obj.exp_amount}</div>
                        </div>
                        <hr class="p-1 m-0">
                            <p class="expense-des mb-0">${obj.exp_des}</p>
                    </div>

                        </ul>`);
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


function delete_expenses(exp_id, exp_date) {

    $.ajax({
        url: "php/delete_expenses.php",
        type: "post", //send it through get method
        data: {
            exp_id_arr: exp_id,


        },

        success: function (response) {

            console.log(response);

            if (response.trim() == "ok") {
                if (button_type == 0) {
                    get_expenses_single(exp_date)
                }
                else if (button_type == 1) {
                    get_expense_approve_sts("no")
                }
                else {
                    get_expense_approve_sts("decline")
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


function update_expenses(exp_des, exp_cat, exp_amount, exp_date, exp_id) {

    console.log(exp_des, exp_cat, exp_amount, exp_date, exp_id);

    $.ajax({
        url: "php/update_expenses.php",
        type: "get", //send it through get method
        data: {
            exp_des: exp_des,
            exp_cat: exp_cat,
            exp_amount: exp_amount,
            exp_date: exp_date,
            exp_emp_id: current_user_id,
            exp_id: exp_id,


        },

        success: function (response) {

            console.log(response);

            if (response.trim() == "ok") {
                if (button_type == 0) {
                    get_expenses_single(exp_date)
                }
                else if (button_type == 1) {
                    get_expense_approve_sts("no")
                }
                else {
                    get_expense_approve_sts("decline")
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

function insert_expenses(exp_arr, current_user_id) {
    $.ajax({
        url: "php/insert_expenses.php",
        type: "post", //send it through get method
        data: {
            exp_arr: JSON.stringify(exp_arr),
            emp_id: current_user_id,


        },

        success: function (response) {

            console.log(response);

            if (response.trim() == "ok") {
                window.location.reload();
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

function get_expense_summary_single(emp_id) {
    $.ajax({
        url: "php/get_expense_summary_single.php",
        type: "get", //send it through get method
        data: {
            emp_id: emp_id,


        },
        success: function (response) {


            if (response.trim() != "error") {
                $("#unapproved_count").html("")
                $("#declined_count").html("")

                // count = 0;
                var obj = JSON.parse(response);


                console.log(response);
                obj.forEach(function (obj) {
                    $("#unapproved_count").html("<bold>₹" + obj.unapproved + "</bold>")
                    $("#declined_count").html("<bold>₹" + obj.decline + "</strong>")
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


function get_current_time() {
    $.ajax({
        url: "php/get_current_time.php",
        type: "get", //send it through get method
        data: {


        },
        success: function (response) {


            if (response.trim() != "error") {
                $("#exp_date").val("");

                // count = 0;
                var obj = JSON.parse(response);


                console.log(response);
                obj.forEach(function (obj) {
                    $("#exp_date").val(obj.date);
                    get_expenses_single(obj.date);
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