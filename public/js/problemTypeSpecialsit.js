$(document).ready(function () {
  // Load in the data from the APIs on load
  refreshProblemTypes();

  // Click function for when an admin wants to delete a problem type
  $("#deleteProblemTypeBtn").click(function () {
    // Get the problem type to delete from the select
    const selected = $("#problemTypeToDelete").val();
    // Call the ajax request to use the delete api
    $.ajax({
      type: "DELETE",
      url: "/problem-type/api/specialist",
      data: { problemTypeID: selected },
      dataType: "json",
      success: function (response) {
        // Alert the user on success or if there was a problem
        if (response.success) {
          alert(response.msg);
        } else {
          alert(response.msg);
        }
        // Refresh the problem types to account for the now deleted problem type
        refreshProblemTypes();
      },
    });
  });

  $("#addProblemType").click(function () {
    // Get the selected problem type for the child
    const selected = $("#problemTypeToAdd").val();
    $.ajax({
      type: "POST",
      url: "/problem-type/api/specialist",
      data: { problemTypeID: selected },
      dataType: "json",
      success: function (response) {
        if (response.success) {
          alert(response.msg);
        } else {
          alert(response.msg);
        }
        refreshProblemTypes();
      },
    });
  });
});

var popualteSelect = () => {
  // This will populate the select box with all of the
  // specialists currently assigned problem types
  $.ajax({
    type: "GET",
    url: "/problem-type/api/specialist/active",
    data: "",
    dataType: "json",
    success: function (response) {
      if (response.success) {
        // Use map to conver to array
        problemTypes = response.data.map(
          (problemType) => problemType.problem_type
        );
        // Reset the select box options
        htmlCode = "";
        $("#assignedProblemTypes").html(htmlCode);
        // Create option html for each problem type
        problemTypes.forEach((problemType) => {
          htmlCode += "<option>" + problemType + "</option>";
        });
        // Set the select box to have the new options
        $("#assignedProblemTypes").html(htmlCode);
      }
    },
  });
};

function refreshProblemTypes() {
  // Set the problem types for every select that needs to display the problem types
  setProblemTypes("#problemTypeToAdd");
  setProblemTypes("#problemTypeToDelete");
  popualteSelect();
}

function createSelect(parentsList, identifier) {
  // Populate a select option
  // Sort the list by order of problem types
  parentsList.sort(function (a, b) {
    return a.parent.problem_type_id - b.parent.problem_type_id;
  });
  htmlCode = "";
  // Loop through each of the parents list
  parentsList.forEach((parentProblemType) => {
    // Create an option with the value of the parents problem id
    // and will display the problem type name
    htmlCode +=
      "<option value=" +
      parentProblemType.parent.problem_type_id +
      ">" +
      parentProblemType.parent.problem_type +
      "</option>";
    // For each children a parent has, create indented versions of the above
    // for the children
    parentProblemType.children.forEach((childProblemType) => {
      htmlCode +=
        "<option value=" +
        childProblemType.problem_type_id +
        ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        childProblemType.problem_type +
        "</option>";
    });
  });
  // Set the options to be inside the select box
  $(identifier).html(htmlCode);
}

function getParents(list) {
  // First loop through each problem type to identifier
  // the problem types that are parents
  parentIds = [];
  list.forEach((element) => {
    if (element.child_of != null) {
      if (!parentIds.includes(element.child_of)) {
        parentIds.push(element.child_of);
      }
    }
  });
  parents = [];
  // Using each parents id, add the parents elements to the new list
  parentIds.forEach((element) => {
    parents.push({
      parent: list.find(
        (problemType) => problemType.problem_type_id == element
      ),
      children: [],
    });
  });
  // With the parent problem type, populate the children using child_of
  parents.forEach((parentProblemType) => {
    parentProblemType.children = [];
    list.forEach((element) => {
      if (element.child_of == parentProblemType.parent.problem_type_id) {
        parentProblemType.children.push(element);
      }
    });
  });
  return parents;
}

var setProblemTypes = (identifier) => {
  // This will get the problem types from the API
  $.ajax({
    type: "GET",
    url: "/problem-type/api",
    data: "",
    dataType: "json",
    success: function (response) {
      if (response.success) {
        $(identifier).html("");
        createSelect(getParents(response.data), identifier);
      }
      if (identifier == "#problemTypeViewSelect") {
        getSpecialistForProblemType();
      }
    },
    error: function (error) {
      alert(error);
    },
  });
};
