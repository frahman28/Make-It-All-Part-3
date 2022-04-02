//Used to colour the data in status row
$("tr td:last-child").each(function(i) {
    if ($(this).text() == "Solved") {
        $(".status").eq(i).css({"background-color":"#62cc3d"});
    } else if ($(this).text() == "Closed") {
        $(".status").eq(i).css({"background-color":"#ff4f4f"});
    }
});