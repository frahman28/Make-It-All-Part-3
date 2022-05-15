$(document).ready(function() {
    $('form').on('submit', function(event) {
        var valid = true;
        var alert = "";
        if ($("#username").val().length == 0 || $("#password").val().length == 0) {
            valid = false;
            alert = "Please provide both a username and a password.";
        }
        else {
            if ($("#username").val().length < 5) {
                valid = false;
                alert = "Username must be at least 5 characters long.";
            }
            else if ($("#username").val().length > 256) {
                valid = false;
                alert = "Username too long.";
            }
            if ($("#password").val().length < 5) {
                valid = false;
                if (alert == "") {
                    alert = "Password must be at least 5 characters long.";
                }
                else {
                    alert += "\nPassword must be at least 5 characters long.";
                }
            }
            else if ($("#password").val().length > 256) {
                valid = false;
                if (alert == "") {
                    alert = "Password too long.";
                }
                else {
                    alert += "\nPassword too long.";
                }
            }
        }
        if (valid == false) {
            event.preventDefault();
            obj = $(".inputValidation").text(alert);
            obj.html(obj.html().replace(/\n/g,'<br/>'));
            $("#username").val("");
            $("#password").val("");
            $(".accoutValidation").hide();
            $(".inputValidation").show();
        }
    });
});