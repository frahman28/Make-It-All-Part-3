//Used to colour the data in status row
$("tr td:last-child").each(function(i) {
    if ($(this).text() == "Comments received") {
        $(".status").eq(i).css({"background-color":"#ffb94f"});
    } else if ($(this).text() == "Pending solution") {
        $(".status").eq(i).css({"background-color":"#d1ff4f"});
    } else if ($(this).text() == "Awaiting support") {
        $(".status").eq(i).css({"background-color":"#878787"});
    }
});