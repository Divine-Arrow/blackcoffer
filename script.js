// menubar
$("#menu,#apply").click(() => {
    $("#menu").toggleClass("clicked_menu");
    $("#sidebar").toggleClass("active_bar");
});

// embeding options in yearSelector
var createYearOptions = () => {
    var yearSelector = $("#startYear, #endYear");
    yearSelector.append($("<option>").text("All").attr("value", 1).attr("selected", "selected"));
    years.forEach(e => {
        yearSelector.append($("<option>").text(e).attr("value", e))
    });
}

/* loader */
    /* loader animation removal */
var clicked = false;
var stopScroll = () => {
    window.scroll(xAxis, yAxis);
}
var loader = () => {
    $(".loader_container").css('top', '-100vh');
    $(".loader_container").css('opacity, 0');
    clicked = !clicked;
    window.removeEventListener("scroll", stopScroll);
}

    /* loader listener */
window.addEventListener("load", () => {
    xAxis = 0;
    yAxis = 0;
    clicked = !clicked;
    window.addEventListener("scroll", stopScroll);
    loader();
});

/* loader ends */

var setPrameters = () => {
    xCord = cordinates[horizontal.value];
    yCord = cordinates[vertical.value];
    measures = measuresArray[measure.value];
    // 0 indicator
    if (Math.floor(zeroIndicator.value)) {
        allColors[0] = 'rgb(255, 255, 255)'
    } else {
        allColors[0] = 'rgb(255, 226, 154)'
    };
    // Year Range
    if (Math.floor(startYear.value) === 1 && Math.floor(endYear.value) === 1)
        yearRange.allYear = true;
    else {
        if (Math.floor(startYear.value) > Math.floor(endYear.value)) {
            alert("Please select valid year range");
        } else {
            yearRange.allYear = false;
            yearRange.start_year = Math.floor(startYear.value);
            yearRange.end_year = Math.floor(endYear.value);
        }
    }
}