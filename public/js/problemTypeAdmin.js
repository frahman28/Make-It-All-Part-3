$(document).ready(function () {
  refreshProblemTypes();

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
});

function refreshProblemTypes() {
  setProblemTypesForDelete();
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

var setProblemTypesForDelete = () => {
  $.ajax({
    type: "GET",
    url: "/problem-type/api",
    data: "",
    dataType: "json",
    success: function (response) {
      if (response.success) {
        $("#problemTypesForDelete").html("");
        createSelect(getParents(response.data), "#problemTypesForDelete");
      }
    },
    error: function (error) {
      alert(error);
    },
  });
};
