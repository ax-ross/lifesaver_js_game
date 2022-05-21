// stopwatch params
let seconds = 0;
let minutes = 0;
let displaySeconds = 0;
let displayMinutes = 0;

//displaying stopwatch
function displayStopwatch() {
    seconds++;
    if (seconds / 60 === 1) {
        seconds = 0;
        minutes++;
    }

    if (seconds < 10) {
        displaySeconds = "0" + seconds.toString();
    } else {
        displaySeconds = seconds;
    }

    if (minutes < 10) {
        displayMinutes = "0" + minutes.toString();
    } else {
        displayMinutes = minutes;
    }

    document.getElementById("hudTime").innerHTML = displayMinutes + ":" + displaySeconds;
}

// get 10 randoms position at field
function getRandPos(width, height) {
    let res = [];
    let x_coords = Math.floor(Math.random() * (width - 0));
    x_coords -= x_coords % 64;
    let y_coords = Math.floor(Math.random() * (height - 100) + 100);
    y_coords -= y_coords % 64;
    res.push(x_coords);
    res.push(y_coords);
    return res;
}

// checking current position is stone by coords
function checkStoneHere(x_coords, y_coords, stones) {
    for (let k = 0; k < 10; k += 1) {
        if (stones[k][0] === x_coords && stones[k][1] === y_coords) {
            return true;
        }
    }
    return false;
}

// handling visited position
function isVisited(x, y) {
    let id = `${x}${y}`;
    console.log(x, y);
    let cls = $('#' + id).attr("class");
    let clsList = cls.split(/\s+/);
    for (let el of clsList) {
        if (el === 'ground') {
            $(`#${x}${y}`).removeClass('ground');
        }
    }

}

$(document).ready(function () {
    const player = {
        x: 0,
        y: 0
    }
    //window params
    let width = $(window).width() - 63;
    let height = $(window).height() - 128;
    // generating 10 randoms pos for stones
    let stones = [];
    for (let i = 0; i < 10; i++) {
        stones.push(getRandPos(width, height));
    }

    // field
    let max_w;
    for (let i = 0; i < width; i += 64) {
        for (let j = 0; j < height; j += 64) {
            if (i === 0 && j === 0) {
                $(".field").append(`<div class="cell" id="${i}${j}" style="left: ${i}px; top: ${j}px;"></div>`);
            } else if (checkStoneHere(i, j, stones)) {
                $(".field").append(`<div class="cell stone" id="${i}${j}"  style="left: ${i}px; top: ${j}px;"></div>`);
            } else {
                $(".field").append(`<div class="cell ground" id="${i}${j}"  style="left: ${i}px; top: ${j}px;"></div>`);
            }
            max_w = i;
        }
    }

    $("#username").keyup(function (e) {
        $('#submitusername').prop("disabled", false);
    });

    //staring game
    $("#welcomeForm").submit(function (e) {
        e.preventDefault();

        let username = $("#username").val();
        $("#hudUsername").text(username);
        $("#screenWelcome").hide();

        window.setInterval(displayStopwatch, 1000); // start stopwatch
        $("body").keypress(function (e) {
            // right
            if (e.keyCode === 100 || e.keyCode === 1074) {
                if ($(".player").offset().left < max_w) {
                    $(".player").animate({
                        left: '+=64px'
                    }, 1);
                    player.x = player.x + 64;
                }
                isVisited(player.x, player.y);
            }
            // left
            if (e.keyCode === 97 || e.keyCode === 1092) {
                if ($(".player").offset().left > 0) {
                    $(".player").animate({
                        left: '-=64px'
                    }, 1);
                    player.x = player.x - 64;
                }
                isVisited(player.x, player.y);
            }
            // down
            if (e.keyCode === 115 || e.keyCode === 1099) {
                if ($(".player").offset().top < height) {
                    $(".player").animate({
                        top: '+=64px'
                    }, 1);
                    player.y = player.y + 64;
                }
                isVisited(player.x, player.y);
            }
            // up
            if (e.keyCode === 119 || e.keyCode === 1094) {
                if ($(".player").offset().top > 100) {
                    $(".player").animate({
                        top: '-=64px'
                    }, 1);
                    player.y = player.y - 64;
                }
                isVisited(player.x, player.y);
            }
        });
    });

});