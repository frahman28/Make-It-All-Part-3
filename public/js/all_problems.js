//Used to colour the data in status row
$(".visible-row td:last-child").each(function (i) {
    if ($(this).text().trim() == "Solved") {
        $(".status").eq(i).css({ "background-color": "#62cc3d" });
    } else if ($(this).text().trim() == "Closed") {
        $(".status").eq(i).css({ "background-color": "#ff4f4f" });
    }
});

$(document).ready(function () {
    //Change colour of row on hover
    $(".visible-row").hover(function () {
        $(this).find("td:nth-child(n)").css("background-color", "#666564");
        $(this).css('cursor', 'pointer');
    }, function () {
        $(this).find("td:nth-child(n)").css("background-color", "#ffffff");
        $(this).css('cursor', 'default');
    });

    //Collapse rows seperately
    $(".visible-row").click(function () {
        $(this).find("td:nth-child(n)").css("background-color", "#ffffff");
        $(this).next("tr").collapse("toggle");
        $(this).next().find("div").collapse("toggle");
    });
});