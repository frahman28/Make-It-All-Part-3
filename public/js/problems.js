//Used to colour the data in status row
$("tr td:last-child").each(function(i) {
    var status = $.trim($(this).text());
    
    if (status == "Comments received") {
        $(".status").eq(i).css({"background-color":"#ffb94f"});
    } else if (status == "Pending solution") {
        $(".status").eq(i).css({"background-color":"#d1ff4f"});
    } else if (status == "Awaiting support") {
        $(".status").eq(i).css({"background-color":"#878787"});
    } else if (status == "Solved") {
        $(".status").eq(i).css({"background-color":"#62cc3d"});
    } else if (status == "Closed") {
        $(".status").eq(i).css({"background-color":"#ff4f4f"});
    } else {
        $(".status").eq(i).css({"background-color":"#070707", color: "white"});
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