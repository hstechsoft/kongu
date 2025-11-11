$(document).ready(function(){

   
console.log(localStorage.getItem("lastname"));
 

      $("#demo_form").submit(function (e) {
       localStorage.setItem("lastname", "Smith");
e.preventDefault();
        $.ajax({
            url: "php/demo.php",
            type: "GET",
          data : {
            username : $("#floatingInput1").val(),
            password: "pass"

          },
         
            success: function (san) {
san= san.trim()
$("#dy").append(san)
            }
})
})
})