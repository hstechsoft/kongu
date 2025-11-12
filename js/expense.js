
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
var count = 0;

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

    $("#unamed").text(localStorage.getItem("ls_uname"))


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

    $("#add_expense").on('click', function () {

        var exp_cat = $("#exp_category").val();
        var exp_date = $("#exp_date").val();
        var exp_des = $("#exp_description").val();
        var exp_amount = $("#exp_amount").val();

        if ($("#exp_amount").val() != "") {
            $("#expenditure_table_body").append(`<tr><td>${count + 1}</td><td>${exp_date}</td><td>${exp_cat}</td><td>${exp_des}</td><td>${exp_amount}</td><td><i class='fa fa-edit pe-2 text-warning'></i><i class='fa fa-trash text-danger'></i></td></tr>`)

            $("#exp_table").append(`<ul class="list-group"><li class="list-group-item">${obj.exp_date} - ${obj.exp_cat} - ${obj.exp_amount}</li><li class="list-group-item">${obj.exp_des}</li><li class="list-group-item"><i class='fa fa-edit pe-2 text-warning'></i><i class='fa fa-trash text-danger'></i></li></ul>`);

            count++;
        }
        else {
            salert("Warning", "Please Enter the amount", 'warning');
        }

    })



    $("#expenditure_table_body").on("click", ".fa-trash", function () {
        $(this).closest("tr").remove();

        $("#expenditure_table_body tr").each(function (index) {

            $(this).find("td").eq(0).text(index + 1);
            count = index + 1;
        });

    })



    $("#expenditure_table_body").on("click", ".fa-edit", function () {

        var row = $(this).closest("tr");
        $("#edit_expense").data("row", row);
        $("#exp_category").val(row.find("td").eq(2).text());
        $("#exp_date").val(row.find("td").eq(1).text());
        $("#exp_description").val(row.find("td").eq(3).text());
        $("#exp_amount").val(row.find("td").eq(4).text());
        // $(this).closest("tr").remove();

        $("#add_expense").addClass("d-none");
        $("#edit_expense").removeClass("d-none");
    })

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

        row.find("td").eq(1).text(exp_date);
        row.find("td").eq(2).text(exp_cat);
        row.find("td").eq(3).text(exp_des);
        row.find("td").eq(4).text(exp_amount);

        console.log(row.data("exp_id"));
        console.log(current_user_id);

        // salert("Success", "Expense updated successfully!", "success");
        if (row.data("exp_id")) {
            update_expenses(exp_des, exp_cat, exp_amount, exp_date, row.data("exp_id"))
        }
        $(this).removeData("row");

    })

    $("#submit_exp_btn").on('click', function () {
        var exp_arr = [];

        $("#expenditure_table_body tr").each(function () {
            var exp_date = $(this).find("td").eq(1).text().trim();
            var exp_cat = $(this).find("td").eq(2).text().trim();
            var exp_des = $(this).find("td").eq(3).text().trim();
            var exp_amount = $(this).find("td").eq(4).text().trim();
            var exp_id = $(this).data("exp_id");
            console.log(exp_id);

            if (exp_date || exp_cat || exp_des || exp_amount || typeof exp_id === "undefined") {
                exp_arr.push({
                    exp_date: exp_date,
                    exp_cat: exp_cat,
                    exp_des: exp_des,
                    exp_amount: exp_amount
                });
            }
            else {
                salert("Error", "Data missing", "error")
            }
        });

        insert_expenses(exp_arr, current_user_id);
    })

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


            if (response.trim() != "error") {
                $("#expenditure_table_body").empty();
                count = 0;
                var obj = JSON.parse(response);


                console.log(response);
                obj.forEach(function (obj) {
                    count += 1;
                    $("#expenditure_table_body").append(`<tr data-exp_id=${obj.exp_id}><td>${count}</td><td>${obj.exp_date}</td><td>${obj.exp_cat}</td><td>${obj.exp_des}</td><td>${obj.exp_amount}</td><td><i class='fa fa-edit pe-2 text-warning'></i><i class='fa fa-trash text-danger'></i></td></tr>`)

                    $("#exp_table").append(`<ul class="list-group"><li class="list-group-item">${obj.exp_date} - ${obj.exp_cat} - ${obj.exp_amount}</li><li class="list-group-item">${obj.exp_des}</li><li class="list-group-item"><i class='fa fa-edit pe-2 text-warning'></i><i class='fa fa-trash text-danger'></i></li></ul>`);
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


function update_expenses(exp_des, exp_cat, exp_amount, exp_date, exp_id) {
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

            if (response.trim() == "okok") {
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