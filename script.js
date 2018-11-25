// menubar
$("#menu,#apply").click(() => {
    $("#menu").toggleClass("clicked_menu");
    $("#sidebar").toggleClass("active_bar");
});

// loader js
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



var setPrameters = () => {
    xCord = cordinates[horizontal.value];
    yCord = cordinates[vertical.value];
    measures = measuresArray[measure.value];
}