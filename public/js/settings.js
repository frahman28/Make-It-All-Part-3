$(document).ready(function() {
    $('form').on('submit', function(event) {
        var valid = true;
        var alert = "";
        if ($("#new-password").val().length == 0) {
            valid = false;
            alert = "Missing new password.";
        }
        if ($("#confirm-new-password").val().length == 0) {
            valid = false;
            if (alert == "") {
                alert = "Missing confirm new password.";
            }
            else {
                alert = "Missing password.";
            }
            
        }
        if (valid == true) {
            if ($("#new-password").val() != $("#confirm-new-password").val()) {
                valid = false;
                alert = "Password and confirm password must be the same."
            }
        }
        if (valid == true) {
            if ($("#new-password").val().length < 5) {
                valid = false;
                alert = "Password must be at least 5 characters long.";
            }
            else if ($("#new-password").val().length > 256) {
                valid = false;
                alert = "Password too long.";
            }
        }
        if (valid == false) {
            event.preventDefault();
            $(".inputValidation").text(alert);
            $("#new-password").val("");
            $("#confirm-new-password").val("");
            $(".main-alerts").hide();
            $(".inputValidation").show();
        }
    });
});