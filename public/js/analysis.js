$(document).ready(function () {
  getNumOfOpenProblems();
  let specialistChart = createClosedBySpecialistChart();
  getNumClosedBySpecialist(null, null, specialistChart);
  let problemTypeChart = createProblemTypeChart();
  getNumClosedByProblemType(null, null, problemTypeChart);

  $("#closedBySpecialistLookup").click(function () {
    const date1 = $("#startingDateInput").val();
    const date2 = $("#endDateInput").val();
    if (date1 === "" || date2 === "") {
      return;
    }
    const date1AsDate = new Date(date1);
    const date2AsDate = new Date(date2);
    console.log(date1AsDate, date2AsDate);
    getNumClosedBySpecialist(
      date1AsDate.getFullYear() +
        "-" +
        (date1AsDate.getMonth() + 1) +
        "-" +
        date1AsDate.getDate(),
      date2AsDate.getFullYear() +
        "-" +
        (date2AsDate.getMonth() + 1) +
        "-" +
        date2AsDate.getDate(),
      specialistChart
    );
  });

  $("#closedByTypeLookup").click(function () {
    const date1 = $("#startingDateInputType").val();
    const date2 = $("#endDateInputType").val();
    if (date1 === "" || date2 === "") {
      return;
    }
    const date1AsDate = new Date(date1);
    const date2AsDate = new Date(date2);
    console.log(date1AsDate, date2AsDate);
    getNumClosedByProblemType(
      date1AsDate.getFullYear() +
        "-" +
        (date1AsDate.getMonth() + 1) +
        "-" +
        date1AsDate.getDate(),
      date2AsDate.getFullYear() +
        "-" +
        (date2AsDate.getMonth() + 1) +
        "-" +
        date2AsDate.getDate(),
      problemTypeChart
    );
  });
});

var getNumOfOpenProblems = () => {
  $.ajax({
    url: "/analysis/api/open-problems",
    type: "GET",
    dataType: "json",
    success: function (data) {
      $(".problem-number-count").text(
        "Current number of problems open: " + data.data.numberOfOpenProblems
      );
    },
    error: function (error) {
      console.error(error);
    },
  });
};

function createClosedBySpecialistChart() {
  const chartDate = {
    labels: [],
    datasets: [
      {
        label: "Number closed by specialist",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [],
      },
    ],
  };
  const config = {
    type: "bar",
    data: chartDate,
    options: {},
  };
  const chart = new Chart(
    document.getElementById("closedBySpecialist"),
    config
  );
  return chart;
}

function createProblemTypeChart() {
  const chartDate = {
    labels: [],
    datasets: [
      {
        label: "Closed with problem type",
        backgroundColor: "rgb(31,117,254)",
        borderColor: "rgb(255, 99, 132)",
        data: [],
      },
    ],
  };
  const config = {
    type: "bar",
    data: chartDate,
    options: {},
  };
  const chart = new Chart(document.getElementById("closedByType"), config);
  return chart;
}

var getNumClosedByProblemType = (date1, date2, chart) => {
  $.ajax({
    type: "GET",
    url:
      "/analysis/api/problem-type" +
      "?startDate=" +
      date1 +
      "&endDate=" +
      date2,
    dataType: "json",
    success: function (response) {
      console.log(response);
      if (response.success) {
        chart.data.labels = [];
        chart.data.datasets[0].data = [];
        console.log(response);
        response.data.forEach((element) => {
          chart.data.labels.push(element.problem_type);
          chart.data.datasets[0].data.push(element.numberOfProblems);
        });
        chart.update();
      }
    },
  });
};

var getNumClosedBySpecialist = (date1, date2, chart) => {
  $.ajax({
    type: "GET",
    url:
      "/analysis/api/specialist" + "?startDate=" + date1 + "&endDate=" + date2,
    dataType: "json",
    success: function (response) {
      if (response.success) {
        chart.data.labels = [];
        chart.data.datasets[0].data = [];
        response.data.forEach((element) => {
          chart.data.labels.push(element.name);
          chart.data.datasets[0].data.push(element.numberOfProblems);
        });
        chart.update();
      }
    },
  });
};
