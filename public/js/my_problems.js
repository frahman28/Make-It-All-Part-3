//Used to colour the data in status row
$(".visible-row td:last-child").each(function (i) {
    if ($(this).text().trim() == "Comments received") {
        $(".status").eq(i).css({ "background-color": "#ffb94f" });
    } else if ($(this).text() == "Pending solution") {
        $(".status").eq(i).css({ "background-color": "#d1ff4f" });
    } else if ($(this).text() == "Awaiting support") {
        $(".status").eq(i).css({ "background-color": "#878787" });
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