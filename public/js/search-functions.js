$(document).ready(function(){
    $("#solution-search").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $(".solution-row").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
//   $(".country-button").off("click");
//   $(".country-button").on("click",  function(event) {
//     const id = ".country-row." + $(this).attr("id");
//       $(id).show();
//         $("html, body").animate({
//           scrollTop: $(id).offset().top - 20
//     }, 100, function() {
//       $(id).delay(200).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100)
//     });	
// });
});