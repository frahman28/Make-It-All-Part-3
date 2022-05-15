$(document).ready(function () {
  let employees = [];
  let usernamesInUse = [];

  // Hide the warning messages
  $("#employee-id-error").hide();
  $("#login-username-error").hide();

  // Use ajax to get a list of the employee id's in use
  $.ajax({
    type: "GET",
    url: "/api",
    data: "",
    dataType: "json",
    success: function (response) {
      if (response.success) {
        // Use a map function to get each employee id and store it in an array
        employees = response.data.map((employee) => {
          return employee.employee_id;
        });
      }
    },
  });
  // Do the same but for account usernames
  $.ajax({
    type: "GET",
    url: "/api/usernames/all",
    data: "",
    dataType: "json",
    success: function (response) {
      if (response.success) {
        usernamesInUse = response.data.map((username) => {
          return username.username.toLowerCase();
        });
      }
    },
  });

  // Check to watch as the user types in the employee id input field
  $("#employee-id-input").keyup(function (e) {
    // Check the entered value to make sure it is not already being used by an employee
    const enteredValue = $(this).val();
    if (!isNaN(Number.parseInt(enteredValue))) {
      if (employees.includes(Number.parseInt(enteredValue))) {
        // If the id is being used then display an error message
        $("#employee-id-error").show();
      } else {
        // If the id is not being used then display a warning message
        $("#employee-id-error").hide();
      }
    }
  });

  $("#login-username-input").keyup(function (e) {
    // Do the same as for the employee id but for checking if the username is already in use
    const enteredValue = $(this).val();
    if (usernamesInUse.includes(enteredValue.toLowerCase())) {
      $("#login-username-error").show();
    } else {
      $("#login-username-error").hide();
    }
  });

  $(document).on("submit", "#problemSubmissionForm", function () {
    // Get all the data from the input fields
    employee_id = $("#employee-id-input").val();
    employee_name = $("#employee-name-input").val();
    role_id = $("#role-id-input").val();
    title_id = $("#title-input").val();
    department_id = $("#department-input").val();
    extension_number = $("#ext-num-input").val();
    external_account = $("#external-input").val();
    login_username = $("#login-username-input").val();
    login_password = $("#login-password-input").val();
    // Store the data in an object
    const dataToSend = {
      employee_id: employee_id,
      name: employee_name,
      role_id: role_id,
      extension: extension_number,
      external: external_account,
      available: 1,
      title_id: title_id,
      department_id: department_id,
      username: login_username,
      password: login_password,
    };
    // Use ajax post method to make an account
    $.ajax({
      type: "POST",
      url: "/create-employee",
      data: dataToSend,
      dataType: "json",
      success: function (response) {
        if (response.success) {
          // If the account is display succesfully show an alert
          // After the alert reload the page to reset the fields and also
          // update to account for the new users
          alert(response.msg);
          location.reload(true);
        } else {
          // Otherwise just display the error message
          alert(response.msg);
        }
      },
    });
    // Return false to prevent always reloading on the page
    return false;
  });
});
