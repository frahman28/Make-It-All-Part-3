$(document).ready(function () {
  // Populate the specialists select option
  populateSpecialistSelect();

  // Select a listener for pressing the submit button to change the availability
  $("#submitBtn").click(function () {
    const employeeID = $("#specialistSelect").val();
    const availabilitySet = $("#availabilitySelect").val();
    changeAvailability(employeeID, availabilitySet);
  });
});

// Use the API to change the specialists availability based on what availability the user
// set
var changeAvailability = (employeeID, availabilitySet) => {
  $.ajax({
    type: "PUT",
    url: "/api/" + employeeID,
    data: { available: availabilitySet },
    dataType: "json",
    success: function (response) {
      // Refresh the populate specialists
      populateSpecialistSelect(employeeID);
      alert(response.msg);
    },
  });
};

var populateSpecialistSelect = (employeeID = null) => {
  // Use the API to get the specialsits from the database
  $.ajax({
    type: "GET",
    url: "/api/5/role",
    data: "",
    dataType: "json",
    success: function (response) {
      if (response.success) {
        // If the response was succesful create html code
        // options for each specialist, with values of their employee ID
        // and also display their current availability
        const specialists = response.data;
        let htmlCode = "";
        $("#specialistSelect").html(htmlCode);
        specialists.forEach((employee) => {
          let availability = employee.available == 1 ? "Yes" : "No";
          htmlCode +=
            "<option value=" +
            employee.employee_id +
            ">" +
            employee.name +
            " | Available: " +
            availability +
            "</option>";
        });
        $("#specialistSelect").html(htmlCode);
        // If an employeeID was previously selected, then change it back to be that employeeID that was selected
        if (employeeID != null) {
          $("#specialistSelect").val(employeeID).change();
        }
      }
    },
  });
};
