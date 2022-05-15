$(document).ready(function () {
  let employees = [];
  let usernamesInUse = [];

  $("#employee-id-error").hide();
  $("#login-username-error").hide();

  $.ajax({
    type: "GET",
    url: "/api",
    data: "",
    dataType: "json",
    success: function (response) {
      if (response.success) {
        employees = response.data.map((employee) => {
          return employee.employee_id;
        });
      }
    },
  });

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

  $("#employee-id-input").keyup(function (e) {
    const enteredValue = $(this).val();
    if (!isNaN(Number.parseInt(enteredValue))) {
      if (employees.includes(Number.parseInt(enteredValue))) {
        $("#employee-id-error").show();
      } else {
        $("#employee-id-error").hide();
      }
    }
  });

  $("#login-username-input").keyup(function (e) {
    const enteredValue = $(this).val();
    if (usernamesInUse.includes(enteredValue.toLowerCase())) {
      $("#login-username-error").show();
    } else {
      $("#login-username-error").hide();
    }
  });

  $(document).on("submit", "#problemSubmissionForm", function () {
    employee_id = $("#employee-id-input").val();
    employee_name = $("#employee-name-input").val();
    role_id = $("#role-id-input").val();
    title_id = $("#title-input").val();
    department_id = $("#department-input").val();
    extension_number = $("#ext-num-input").val();
    external_account = $("#external-input").val();
    login_username = $("#login-username-input").val();
    login_password = $("#login-password-input").val();
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
    $.ajax({
      type: "POST",
      url: "/create-employee",
      data: dataToSend,
      dataType: "json",
      success: function (response) {
        if (response.success) {
          alert(response.msg);
          location.reload(true);
        } else {
          alert(response.msg);
        }
      },
    });

    return false;
  });
});

var createEmployee = function (e) {
  e.preventDefault();
  return false;
};
