$(document).ready(function () {

    $(".neaktivna-stranica").hover(ulaz, izlaz);
    function ulaz() {
        // $(".neaktivna-stranica").animate({color: "red"}, 100);
        $(this).css("background", "rgb(0, 153, 255)");
        $(this).css("text-decoration", "underline");

    }
    function izlaz() {
        $(this).css("background", "rgb(78, 184, 255)");
        $(this).css("text-decoration", "none");

    }

    function bojenjeReda() {
      alert("BOJENJE");
    }

    var i = $("#navigacioniMeni").height();
    // alert(i);
    var velicina = i * 1.5 + "px";
    // alert("visina navigacionog menija je: " + velicina);
    $("#odvajanjeOdVrha").css("margin-top", velicina);

    $("#odvajanjeOdVrha").css("margin-top", velicina);
    for (var i = 0; i < 2; i++) {
        $("#ponuda").append($("#ponuda").html());
    }

    // if ($(window).width() > 768) {
    //     $("#sadrzaj").css("padding-left", 0);
    // }

    // $(window).resize(function() {
    //     if ($(window).width() > 768) {
    //         $("#sadrzaj").css("padding-left", 0);
    //     }
    //     else {
    //         $("#sadrzaj").css("padding-left", 15);
    //     }
    // });

    $("#korpa").click(function() {
        alert("Ova funkcionalnost još nije implementirana.");
    });
});
