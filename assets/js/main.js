let getHearts = 0;
let downStones = [];

let stones = [];
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

// checking current position is el by coords
function checkElementHere(x_coords, y_coords, el) {

    for (let k = 0; k < el.length; k += 1) {
        if (el[k][0] === x_coords && el[k][1] === y_coords) {
            return true;
        }
    }
    return false;
}

function isBusy(x, y, arr) {
    for (let k = 0; k < arr.length; k++) {
        if (arr[k][0] === x && arr[k][1] === y) {
            return true;
        }
    }
    return false;
}

// handling visited position
function isVisited(x, y) {
    let id = `${x}${y}`;
    let cls = $('#' + id).attr("class");
    let clsList = cls.split(/\s+/);
    for (let el of clsList) {
        if (el === 'ground') {
            $(`#${x}${y}`).removeClass('ground');
        } else if (el === 'heart') {
            $(`#${x}${y}`).removeClass('heart');
            getHearts++;
            $("#hudHearts").text(getHearts.toString() + '/10');
            if (getHearts === 10) {
                $("#screenRating").addClass('active');
            }
        }
    }

}

function moveDown(id) {
    $('#' + id).animate({
        top: '+=10px'
    }, 0.1);
}

function fallObj(player) {
    let id = `${player.x}${player.y - 64}`;
    let cls = $('#' + id).attr("class");
    let clsList = cls.split(/\s+/);
    for (let el of clsList) {
        if (el === 'stone') {
            downStones.push({
                id: id,
                x: player.x,
                y: player.y - 64
            });
            for (let i = 0; i < stones.length; i++) {
                if (stones[i][0] === player.x && stones[i][1] === player.y - 64) {
                    stones.splice(i, 1);
                }
            }
            console.log(stones.length);
            window.setInterval(moveDown, 100, id);
        }
    }
}

$(document).ready(function () {
    const player = {
        x: 0,
        y: 0
    }

    let pos = [];

    //window params
    let width = $(window).width() - 63;
    let height = $(window).height() - 160;
    
    // generating 10 randoms pos for stones
    for (let i = 0; i < 10; i++) {
        pos = getRandPos(width, height);
        if (isBusy(pos[0], pos[1], stones)) {
            i--;
        } else {
            stones.push(pos);
        }
    }
    // generating 10 randoms pos for hearts
    let hearts = [];
    for (let i = 0; i < 10; i++) {
        pos = getRandPos(width, height);
        if (isBusy(pos[0], pos[1], stones) || isBusy(pos[0], pos[1], hearts)) {
            i--;
        } else {
            hearts.push(pos);
        }
    }

    // field
    let max_w;
    for (let i = 0; i < width; i += 64) {
        for (let j = 0; j < height; j += 64) {
            if (i === 0 && j === 0) {
                $(".field").append(`<div class="cell" id="${i}${j}" style="left: ${i}px; top: ${j}px;"></div>`);
            } else if (checkElementHere(i, j, stones)) {
                $(".field").append(`<div class="cell stone" id="${i}${j}"  style="left: ${i}px; top: ${j}px;"></div>`);
            } else if (checkElementHere(i, j, hearts)) {
                $(".field").append(`<div class="cell heart" id="${i}${j}"  style="left: ${i}px; top: ${j}px;"></div>`);
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
                    if (!checkElementHere(player.x + 64, player.y, stones)) {
                        $(".player").animate({
                            left: '+=64px'
                        }, 1);
                        player.x = player.x + 64;
                        isVisited(player.x, player.y);
                        fallObj(player);
                    }
                }
            }
            // left
            if (e.keyCode === 97 || e.keyCode === 1092) {
                if ($(".player").offset().left > 0) {
                    if (!checkElementHere(player.x - 64, player.y, stones)) {
                        $(".player").animate({
                            left: '-=64px'
                        }, 1);
                        player.x = player.x - 64;
                        isVisited(player.x, player.y);
                        fallObj(player);
                    }
                }
            }
            // down
            if (e.keyCode === 115 || e.keyCode === 1099) {
                if ($(".player").offset().top < height) {
                    if (!checkElementHere(player.x, player.y + 64, stones)) {
                        $(".player").animate({
                            top: '+=64px'
                        }, 1);
                        player.y = player.y + 64;
                        isVisited(player.x, player.y);
                        fallObj(player);
                    }
                }
            }
            // up
            if (e.keyCode === 119 || e.keyCode === 1094) {
                if ($(".player").offset().top > 100) {
                    if (!checkElementHere(player.x, player.y - 64, stones)) {
                        $(".player").animate({
                            top: '-=64px'
                        }, 1);
                        player.y = player.y - 64;
                        isVisited(player.x, player.y);
                        fallObj(player);
                    }
                }
            }
        });
    });

});