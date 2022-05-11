$(document).ready(function () {
  refreshProblemTypes();

  $("#problemTypeViewSelect").change(function () {
    getSpecialistForProblemType();
  });

  $("#deleteProblemTypeBtn").click(function () {
    const selected = $("#problemTypesForDelete").val();
    $.ajax({
      type: "DELETE",
      url: "/problem-type/api/" + selected,
      data: "data",
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

  $("#createProblemType").click(function () {
    const selected = $("#problemTypeForCreate").val();
    const problemTypeName = $("#problemTypeName").val().trim();
    if (problemTypeName === "") {
      alert("Problem type name cannot be empty");
      return;
    }
    $.ajax({
      type: "POST",
      url: "/problem-type/api",
      data: { problemTypeName: problemTypeName, problemTypeChild: selected },
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

var getSpecialistForProblemType = () => {
  const value = $("#problemTypeViewSelect").val();
  $.ajax({
    type: "GET",
    url: "/problem-type/api/specialist?problemTypeID=" + value,
    data: "",
    dataType: "json",
    success: function (response) {
      $("#specialistsToShow").html("");
      if (response.success) {
        htmlCode = "";
        response.data.forEach((employee) => {
          htmlCode += "<option>" + employee.name + "</option>";
        });
        $("#specialistsToShow").html(htmlCode);
      }
    },
    error: function (error) {
      console.error(error);
    },
  });
};

function refreshProblemTypes() {
  setProblemTypes("#problemTypesForDelete");
  setProblemTypes("#problemTypeForCreate");
  setProblemTypes("#problemTypeViewSelect");
}

function createSelect(parentsList, identifier) {
  parentsList.sort(function (a, b) {
    return a.parent.problem_type_id - b.parent.problem_type_id;
  });
  htmlCode = "";
  parentsList.forEach((parentProblemType) => {
    htmlCode +=
      "<option value=" +
      parentProblemType.parent.problem_type_id +
      ">" +
      parentProblemType.parent.problem_type +
      "</option>";
    parentProblemType.children.forEach((childProblemType) => {
      htmlCode +=
        "<option value=" +
        childProblemType.problem_type_id +
        ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        childProblemType.problem_type +
        "</option>";
    });
  });
  $(identifier).html(htmlCode);
}

function getParents(list) {
  parentIds = [];
  list.forEach((element) => {
    if (element.child_of != null) {
      if (!parentIds.includes(element.child_of)) {
        parentIds.push(element.child_of);
      }
    }
  });
  parents = [];
  parentIds.forEach((element) => {
    parents.push({
      parent: list.find(
        (problemType) => problemType.problem_type_id == element
      ),
      children: [],
    });
  });
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
    },
    error: function (error) {
      alert(error);
    },
  });
};
