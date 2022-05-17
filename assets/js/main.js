function getRandPos(width, height) {
    let x_coords = Math.floor(Math.random() * (width - 0));
    x_coords -= x_coords % 64;
    let y_coords = Math.floor(Math.random() * (height - 100) + 100);
    y_coords -= y_coords % 64;
    return [x_coords, y_coords];
}

$(document).ready(function () {
    let stones = [];
    let width = $(window).width() - 63;
    let height = $(window).height() - 64;
    let max_w;
    for (let i = 0; i < 10; i++) {
        
        stones.push([getRandPos])
    }
    for (let i = 0; i < width; i += 64) {
        for (let j = 0; j < height; j += 64) {
            $(".field").append(`<div class="cell ground" style="left: ${i}px; top: ${j}px;"></div>`);
            max_w = i;
        }
    }

    $("#username").keyup(function (e) {
        $('#submitusername').prop("disabled", false);
    });
    $("#welcomeForm").submit(function (e) {
        e.preventDefault();
        let username = $("#username").val();
        alert(username);
        $("#hudUsername").text(username);
        $("#screenWelcome").hide();

        $("body").keypress(function (e) {
            // вправо
            if (e.keyCode == 100 || e.keyCode == 1074) {
                if ($(".player").offset().left < max_w) {
                    $(".player").animate({
                        left: '+=64px'
                    }, 1);
                }
            }
            // влево
            if (e.keyCode == 97 || e.keyCode == 1092) {
                if ($(".player").offset().left > 0) {
                    $(".player").animate({
                        left: '-=64px'
                    }, 1);
                }
            }
            // вниз
            if (e.keyCode == 115 || e.keyCode == 1099) {
                if ($(".player").offset().top < height) {
                    $(".player").animate({
                        top: '+=64px'
                    }, 1);
                }
            }
            // вверх
            if (e.keyCode == 119 || e.keyCode == 1094) {
                if ($(".player").offset().top > 100) {
                    $(".player").animate({
                        top: '-=64px'
                    }, 1);
                }

            }
        });
    });

});