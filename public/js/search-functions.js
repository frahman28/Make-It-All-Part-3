$(document).ready(function(){
    // Search and filter solution table on the problem submission page.
    $("#solution-search").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $(".solution-row").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });

    // Search and filter problems register.
    $("#search-problems-button").click(function() {
        var currentUser = $(document).find("#current-user-id").text();

        $(".problem-row").each(function() {
            // Reset rows, if previously filtered.
            $(this).removeClass("filtered-row");

            // If "solved only" checkbox is checked, show all not closed / solved solutions.
            if($("#solved-only").is(':checked')) {
                if(($(this).find("div.status").text().indexOf("Solved")>0)) {
                    $(this).addClass("filtered-row");
                }
            }

            // If "reported by me" checkbox is checked, show all problems reported by current user.
            if ($("#reported-by-me").is(':checked')) {
                if ($(this).next().find(".reported-by").text() !== currentUser) {
                    $(this).addClass("filtered-row")
                }
            }

            // If "assigned to me" checkbox is checked, show all problems assigned to current user.
            if($("#assign-to-me").is(':checked')) {
                if ($(this).next().find(".specialistHidden").val() !== currentUser) {
                    $(this).addClass("filtered-row")
                }
            }; 

            // Filter problems based on their name and description.
            var value = $("#problem-search").val().toLowerCase();
            var problemName = $(this).next().find(".problem-name").text().toLowerCase();
            var problemDescription = $(this).next().find(".problem-description").text().toLowerCase();
            if ((problemName + " " + problemDescription).indexOf(value) < 0) {
                $(this).addClass("filtered-row")
            }

            // Filter problems based on specialists, that solved the problem.
            value = $('#specialist-search').val();
            if (value !== 'all') {
                if ($(this).next().find(".specialistHidden").val() !== value) {
                    $(this).addClass("filtered-row")
                }
            }

            // Filter problems based on their current status.
            value = $('#status-list').val();
            if (value !== 'all') {
                if(($(this).find("div.status").text().indexOf(value) < 0)) {
                    $(this).addClass("filtered-row");
                }
            }
        });
    });

    // Search and filter equipment register.
    $("#search-equipment-button").click(function() {  
        // Filter equipment based on their properties (name, type, serial number etc). 
        $(".equipment-row").each(function() {
            $(this).removeClass("filtered-row");
            var value = $("#equipment-search").val().toLowerCase();

            if ($(this).text().toLowerCase().indexOf(value) < 0) {
                $(this).addClass("filtered-row");
            }
        });

        // Filter equipment based on their type (hardware, software, os, all). 
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