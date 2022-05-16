$(document).ready(function(){
    var allRows = $(".problem-row");

    $("#solution-search").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $(".solution-row").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });

    $("#search-problems-button").click(function() {
        var currentUser = $(document).find("#current-user-id").text();

        $(".problem-row").each(function() {
            $(this).removeClass("filtered-row");

            if($("#solved-only").is(':checked')) {
                if(($(this).find("div.status").text().indexOf("Solved")>0)) {
                    $(this).addClass("filtered-row");
                }
            }

            if ($("#reported-by-me").is(':checked')) {
                if ($(this).next().find(".reported-by").text() !== currentUser) {
                    $(this).addClass("filtered-row")
                }
            }

            if($("#assign-to-me").is(':checked')) {
                if ($(this).next().find(".specialistHidden").val() !== currentUser) {
                    $(this).addClass("filtered-row")
                }
            }; 

            var value = $("#problem-search").val().toLowerCase();
            var problemName = $(this).next().find(".problem-name").text().toLowerCase();
            var problemDescription = $(this).next().find(".problem-description").text().toLowerCase();
            if ((problemName + " " + problemDescription).indexOf(value) < 0) {
                $(this).addClass("filtered-row")
            }

            value = $('#specialist-search').val();
            if (value !== 'all') {
                if ($(this).next().find(".specialistHidden").val() !== value) {
                    $(this).addClass("filtered-row")
                }
            }

            value = $('#status-list').val();
            if (value !== 'all') {
                if(($(this).find("div.status").text().indexOf(value) < 0)) {
                    $(this).addClass("filtered-row");
                }
            }
        });
    });

    $("#search-equipment-button").click(function() {   
        $(".equipment-row").each(function() {
            $(this).removeClass("filtered-row");
            var value = $("#equipment-search").val().toLowerCase();

            if ($(this).text().toLowerCase().indexOf(value) < 0) {
                $(this).addClass("filtered-row");
            }
        });

        var value = $('#equipment-type-list').val();

        if (value !== 'all') {
            $(".software-container").addClass("filtered-row");
            $(".hardware-container").addClass("filtered-row");
            $(".os-container").addClass("filtered-row");

            if (value === "hardware") {
                $(".hardware-container").removeClass("filtered-row");
            } else if (value === "software") {
                $(".software-container").removeClass("filtered-row");
            } else if (value === "os") {
                $(".os-container").removeClass("filtered-row");
            }
        }
    });
});