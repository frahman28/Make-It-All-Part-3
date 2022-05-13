$(document).ready(function () {

    //Used to colour the data in status row
    $(".status").each(function(i) {
        var status = $.trim($(this).text());
        console.log(status)
        if (status == "Comments received") {
            $(".status").eq(i).css({"background-color":"#ffb94f"});
        } else if (status == "Pending solution") {
            $(".status").eq(i).css({"background-color":"#d1ff4f"});
        } else if (status == "Awaiting support") {
            $(".status").eq(i).css({"background-color":"#878787"});
        } else if (status == "Solved") {
            $(".status").eq(i).css({"background-color":"#62cc3d"});
        } else if (status == "Closed") {
            $(".status").eq(i).css({"background-color":"#ff4f4f"});
        } else {
            $(".status").eq(i).css({"background-color":"#070707", color: "white"});
        }
    });

    //Change colour of row on hover
    $(".visible-row").hover(function () {
        $(this).find("td:nth-child(n)").css("background-color", "#666564");
        $(this).css('cursor', 'pointer');
    }, function () {
        $(this).find("td:nth-child(n)").css("background-color", "#ffffff");
        $(this).css('cursor', 'default');
    });

    //Collapse rows seperately
    $(".visible-row").click(function () {
        $(this).find("td:nth-child(n)").css("background-color", "#ffffff");
        $(this).next("tr").collapse("toggle");
        $(this).next().find("div").collapse("toggle");
    });

    $(".resolve-problem-button").click(function() {
        $(this).text() == "Resolved!" ? $(this).text("Click to Resolve.") : $(this).text("Resolved!");
        $(this).toggleClass("btn-outline-success");
        $(this).toggleClass("resolved");
        $(this).toggleClass("btn-success");
    });

    $(".accordion").click(function() {
        var panel = this.nextElementSibling;
          if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
          } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
          } 
      });
    

    $("#serialNumber").on("change keydown keyup input paste", function () {
        let optionFound = false;
        let selectedOption = $(this).val();
        $("#serialNumbers option").each(function() {
            // Determine whether an option exists with the current value of the input.
            if (selectedOption.length < 1) {
                optionFound = true;
                $("#hardwareHidden").attr('value', "");
                $("#hardware").attr('value', "");
                return;
            }
            if (this.value === selectedOption) {
                console.log($(this).attr("data-value"));
                optionFound = true;
                $("#hardwareHidden").attr('value', $(this).attr("data-value"));
                $("#hardware").attr('value', this.text);
                return;
            }
        });

        // use the setCustomValidity function of the Validation API
        // to provide an user feedback if the value does not exist in the datalist
        if (optionFound) {
            $(this)[0].setCustomValidity("");
        } else {
            $(this)[0].setCustomValidity("Please select a valid serial number.");
        }
    });

    $("#license").on("change keydown keyup input paste", function () {
        let optionFound = false;
        let selectedOption = $(this).val();
        $("#licenseList option").each(function() {
            if (selectedOption.length < 1) {
                optionFound = true;
                $("#softwareHidden").attr('value', "");
                $("#software").attr('value', "");
                return;
            }
            // Determine whether an option exists with the current value of the input.
            if (this.value === selectedOption) {
                console.log($(this).attr("data-value"));
                optionFound = true;
                $("#softwareHidden").attr('value', $(this).attr("data-value"));
                $("#software").attr('value', this.text);
                return;
            }
        });

        // use the setCustomValidity function of the Validation API
        // to provide an user feedback if the value does not exist in the datalist
        if (optionFound || selectedOption.length < 1) {
            $(this)[0].setCustomValidity("");
        } else {
            $(this)[0].setCustomValidity("Please select a valid license.");
        }
    });

    $("#editNotesButton").click(function () {
        var t = $(this).closest("tr");
        $(t).find("td:nth-child(n)").css("background-color", "#ffffff");
        $(t).next("tr").collapse("toggle");
        $(t).next().find("div").collapse("toggle");
    });
});