$(document).ready(function () {
  // Get the number of problems currently open
  getNumOfOpenProblems();
  // Create a blank chart to display how well specialists are performing
  let specialistChart = createClosedBySpecialistChart();
  // Populate this chart
  getNumClosedBySpecialist(null, null, specialistChart);
  // Create a blank chart to display how well specialists are performing
  let problemTypeChart = createProblemTypeChart();
  // Populate this chart
  getNumClosedByProblemType(null, null, problemTypeChart);

  // Add a click listener for looking up specialists performance
  $("#closedBySpecialistLookup").click(function () {
    // Get the dates the user has entered
    const date1 = $("#startingDateInput").val();
    const date2 = $("#endDateInput").val();
    // Check the dates aren't blank before continuing
    if (date1 === "" || date2 === "") {
      return;
    }
    // Convert the entered dates to date objects
    const date1AsDate = new Date(date1);
    const date2AsDate = new Date(date2);
    // Send the dates to the request with the chart to fill
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
  // Use ajax to make the api query to see how many problems are open
  $.ajax({
    url: "/analysis/api/open-problems",
    type: "GET",
    dataType: "json",
    // On sucess then replace the text to include the number of open problems
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
  // Create the keys for the chart
  const chartDate = {
    labels: [],
    datasets: [
      {
        label: "Number closed by specialist",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [],
      },
      {
        label: "Average number of days to close a problem",
        backgroundColor: " rgb(255,117,24)",
        borderColor: "rgb(255, 99, 132)",
        data: [],
      },
    ],
  };
  // Set the type of chart
  const config = {
    type: "bar",
    data: chartDate,
    options: {},
  };
  // Create the chart into a canvas with the options set
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
      {
        label: "Average number of days to with problem type",
        backgroundColor: "rgb(123,104,238)",
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
  // Use ajax to get the number of closed problems by problem type
  $.ajax({
    // A get request
    type: "GET",
    // The dates go in the query and will be handled server side
    url:
      "/analysis/api/problem-type" +
      "?startDate=" +
      date1 +
      "&endDate=" +
      date2,
    dataType: "json",
    success: function (response) {
      if (response.success) {
        // Clear out the old date from the chart (in case of an update)
        chart.data.labels = [];
        chart.data.datasets[0].data = [];
        chart.data.datasets[1].data = [];
        // Add in the new data to the chart
        response.data.forEach((element) => {
          chart.data.labels.push(element.problem_type);
          chart.data.datasets[0].data.push(element.numberOfProblems);
          chart.data.datasets[1].data.push(element.averageDaysToClose);
        });
        // Call an update on the chart so it is reloaded
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
        chart.data.datasets[1].data = [];
        response.data.forEach((element) => {
          chart.data.labels.push(element.name);
          chart.data.datasets[0].data.push(element.numberOfProblems);
          chart.data.datasets[1].data.push(element.averageDaysToClose);
        });
        chart.update();
      }
    },
  });
};
