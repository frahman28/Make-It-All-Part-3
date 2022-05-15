$(document).ready(function(){
    $("#solution-search").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $(".solution-row").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });

    $("#solved-only").change(function() {
        if(this.checked) {
            $(".problem-row").filter(function() {
                $(this).toggle($(this).find(".status").text().indexOf("Solved") < 0)
            }); 
        } else {
            $(".problem-row").filter(function() {
                $(this).toggle($(this).text().indexOf("") > -1)
            });
        }
    });

    $("#reported-by-me").change(function() {
        var currentUser = $(document).find("#current-user-id").text();
        if(this.checked) {
            $(".problem-row").filter(function() {
                $(this).toggle($(this).next().find(".reported-by").text().indexOf(currentUser) > -1)
            }); 
        } else {
            $(".problem-row").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf("") > -1)
            });
        }
    });

    $("#assigned-to-me").change(function() {
        var currentUser = $(document).find("#current-user-id").text();
        if(this.checked) {
            $(".problem-row").filter(function() {
                $(this).toggle($(this).next().find(".specialistHidden").val().indexOf(currentUser) > -1)
            }); 
        } else {
            $(".problem-row").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf("") > -1)
            });
        }
    });

    $("#problem-search").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".problem-row").filter(function() {
            var problemName = $(this).next().find(".problem-name").text().toLowerCase();
            var problemDescription = $(this).next().find(".problem-description").text().toLowerCase();
          $(this).toggle((problemName + " " + problemDescription).indexOf(value) > -1)
        });
      });

    $('#specialist-search').change(function() {
        var value = $(this).val();
        if (value === '') {
            $(".problem-row").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf("") > -1)
            });
        } else {
            $(".problem-row").filter(function() {
                $(this).toggle($(this).next().find(".specialistHidden").val().indexOf(value) > -1)
            });
        }
    });

    $('#status-list').change(function() {
        var value = $(this).val();
        if (value === '') {
            $(".problem-row").filter(function() {
                var status = $.trim($(this).find(".status").text());
                $(this).toggle(status.indexOf("") > -1)
            });
        } else {
            $(".problem-row").filter(function() {
                var status = $.trim($(this).find(".status").text());
                $(this).toggle(status.indexOf(value) > -1)
            });
        }
    });
});