$(window).on("scroll", function () {
    if ($(window).scrollTop() > 0) {
        $(".header").addClass("active");
    } else {
        $(".header").removeClass("active");
    }
})




